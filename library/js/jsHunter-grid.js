/*
*
* Project: jsHunter Grid for UI
* Initial Date: 2021-11-01
* License: MIT
* Description: This is a free source code, please use of the anyway better possible.
*
* This library should be used together with jsHunter and jsHunter-ui.css !
*
*/

;(function(){

    /*
     --------------------------------------------------------------------------------
     - INITIALIZER OF GRID EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in grid extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /**[THEME]
     * @description Grid, create a data grid with pagination and input text to search the results contained in grid
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: The Runnable method for this component run())
     */
    jsHunter.prototype.grid = function(params) {

        /**
         * Settings/Configurations by args
         */
        let debug = ($$.has('debug').in(params)) ? params.debug : false;
        let target = ($$.has('target').in(params)) ? params.target : "";
        let loading = ($$.has('loading').in(params)) ? params.loading : true;
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let identify_key = ($$.has('identify_key').in(params)) ? params.identify_key : {id:null};
        let renderize = ($$.has('renderize').in(params)) ? params.renderize : {};
        let query_renderize = ($$.has('query_renderize').in(params)) ? params.query_renderize : {};
        let query_paginate = ($$.has('query_paginate').in(params)) ? params.query_paginate : {};
        let filter = ($$.has('filter').in(params)) ? params.filter : false;
        let controls = ($$.has('controls').in(params)) ? params.controls : {};
        let more = ($$.has('more').in(params)) ? params.more : {};
        let actions = ($$.has('actions').in(params)) ? params.actions : {};
        let checkbox = ($$.has('checkbox').in(params)) ? params.checkbox : false;
        let ordering = ($$.has('ordering').in(params)) ? params.ordering : false;
        let links = ($$.has('links').in(params)) ? params.links : {};
        let icons = ($$.has('icons').in(params)) ? params.icons : {};
        let rating = ($$.has('rating').in(params)) ? params.rating : {};
        let paginate = ($$.has('paginate').in(params)) ? params.paginate : false;
        let columns = ($$.has('columns').in(params)) ? params.columns : [];
        let cors = ($$.has('cors').in(params)) ? params.cors : false;
        let restful = ($$.has('restful').in(params)) ? params.restful : false;

        /**
         * Global Settings
         */
        const max_time_loading = 120;
        let abort_import = false;
        let not_found = false;
        let loaded = false;
        let on_paginate = false;
        let on_import = false;
        let default_color_line = false;
        let loading_control = null;
        let turtle_control = null;
        let process_monitor = null;
        let pager_monitor = null;
        let action_col_width = 180;
        let checkbox_col_width = 45;
        let data_len = 0;
        let grid_width = 0;
        let grid_lines_count = 0;
        let loading_count = 1;
        let data_type = "";
        let process_type = "renderize";
        let no_results = "";
        let query_error = "";
        let global_data = [];
        let grid_lines = [];
        let grid_fields = [];
        let queue_import = [];
        let links_fn_col = [];
        let accepted_controls = ["new", "search", "import", "export", "reload", "previous", "next", "more"];
        let accepted_more = ["continue", "delete", "lock", "execute"];
        let accepted_actions = ["read", "update", "delete"];
        let buttons_depend = ["export", "reload", "previous", "next", "more"];
        let save_original_param = [];
        let control_icon = {
            new: "&#10010;",
            search: "&#8635;",
            import: "&#8613;",
            export: "&#8615;",
            reload: "&#8635;",
            previous: "&#8606;",
            next: "&#8608;",
            more: "&there4;"
        };
        let actions_icons = {
            update: "&#9998;",
            delete: "&#10006;",
            read: "&#9783;"
        };
        let controls_active = {
            new: {state: false, action: undefined},
            search: {state: false, action: undefined},
            import: {state: false, action: undefined, abort: null},
            export: {state: false, action: undefined},
            reload: {state: false, action: undefined},
            previous: {state: false, action: undefined},
            next: {state: false, action: undefined}
        };
        let more_active = {
            continue: false,
            delete: false,
            lock: false,
            execute: false
        };
        let actions_active = {
            read: {state: false, action: undefined},
            update: {state: false, action: undefined},
            delete: {state: false, action: undefined},
        };
        let checkbox_active = {
            check_all: false,
            check_one: false
        };
        let links_active = {};
        let icons_active = {};
        let rating_active = {};

        /**
         * Save Original Settings
         */
        let original_process_type = process_type;
        let original_data_len = global_data.length;
        let original_max_pager = paginate.max_pager;
        let original_page = paginate.page;
        let original_items_show = paginate.items_show;
        let original_url = query_renderize.url || query_paginate.url;
        let original_query_params = query_renderize.params || query_paginate.params;

        /**
         * Accepted Key Codes in search
         */
        let accepted_keys_code = [
            8,13,32,46,48,49,50,51,52,53,54,55,56,57,59,65,66,67,68,69,70,71,72,73,74,75,76,
            77,78,79,80,81,82,83,84,85,86,87,88,89,90,96,97,98,99,100,101,102,103,104,105,231
        ];

        /**
         * Get Global Settings
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(lang);

        /**
         * General Adjust
         */
        if (lang === 'ptbr') {
            no_results = "Nenhum resultado encontrado";
            query_error = "Ocorreu um erro durante a consulta";
        } else if(lang === 'en') {
            no_results = "No results found";
            query_error = "An error occurred during the query";
        } else if(lang === 'es') {
            no_results = "Ningún resultado encontrado";
            query_error = "Ocurrió un error durante la consulta";
        }

        /**
         * Grid Information
         */
        function _gridInfo() {

            function _getOriginalSettings(log = false) {
                if (log === true) {
                    $$.log("Original Settings").print("yellow");
                    $$.log("original_data_len: " + original_data_len).log();
                    $$.log("original_max_pager: " + original_max_pager).log();
                    $$.log("original_page: " + original_page).log();
                    $$.log("original_items_show: " + original_items_show).log();
                    $$.log("original_url: " + original_url).log();
                    $$.log("original_query_params").log();
                    $$.log(original_query_params).log();
                    $$.log("save_original_param").log();
                    $$.log(save_original_param).log();
                }

                return {
                    "original_max_pager": original_max_pager,
                    "original_page": original_page,
                    "original_items_show": original_items_show,
                    "original_url": original_url,
                    "original_query_params": original_query_params,
                    "save_original_param": save_original_param
                };
            }

            function _getCurrentSettings(log = false) {
                if (log === true) {
                    $$.log("Current Settings").print("yellow");
                    $$.log("original_data_len: " + original_data_len).log();
                    $$.log("max_pager: " + paginate.max_pager).log();
                    $$.log("page: " + paginate.page).log();
                    $$.log("items_show: " + paginate.items_show).log();
                    $$.log("url: " + query_renderize.url || query_paginate.url).log();
                    $$.log("query_params").log();
                    $$.log(query_renderize.params || query_paginate.params).log();
                    $$.log("save_original_param").log();
                    $$.log(save_original_param).log();
                }

                return {
                    "max_pager": paginate.max_pager,
                    "page": paginate.page,
                    "items_show": paginate.items_show,
                    "url": query_renderize.url,
                    "query_params": query_renderize.params,
                    "save_original_param": save_original_param
                };
            }

            function _checkGridParameters() {
                /*grid error prefix message*/
                let ge = "$$.grid()<br /><br />";

                /*checkTarget*/
                if (target === "" || !$$.findId(target)) {
                    _gridExtends().except(ge+"Missing target element !");
                    $$.log("grid() error => Missing target element !").error();
                    return false;
                }

                /*checkMode: Renderize/QueryRenderize/QueryPaginate*/
                if (renderize.active === true) {
                    if (!$$.has('data').in(renderize)) {
                        _gridExtends().except(ge+"Wrong parameters to renderize mode !");
                        $$.log("grid() error => Wrong parameters to renderize mode !").error();
                        return false;
                    }
                    global_data = renderize.data;
                    process_type = "renderize";
                    data_type = $$.dataType(global_data);
                    original_data_len = global_data.length;
                } else if (query_renderize.active === true) {
                    if (
                        !$$.has('url').in(query_renderize) ||
                        !$$.has('params').in(query_renderize) ||
                        !$$.has('data_type').in(query_renderize) ||
                        !$$.has('content_type').in(query_renderize)
                    ) {
                        _gridExtends().except(ge+"Wrong parameters to query_renderize mode !");
                        $$.log("grid() error => Wrong parameters to query_renderize mode !").error();
                        return false;
                    }
                    process_type = "query_renderize";
                } else if (query_paginate.active === true) {
                    if (
                        !$$.has('url').in(query_paginate) ||
                        !$$.has('params').in(query_paginate) ||
                        !$$.has('data_type').in(query_paginate) ||
                        !$$.has('content_type').in(query_paginate)
                    ) {
                        _gridExtends().except(ge+"Wrong parameters to query_paginate mode !");
                        $$.log("grid() error => Wrong parameters to query_paginate mode !").error();
                        return false;
                    }
                    process_type = "query_paginate";
                } else {
                    _gridExtends().except(ge+"Wrong process type !");
                    $$.log("grid() error => Wrong process type !").error();
                    return false;
                }
                original_process_type = process_type;

                /*checkControls*/
                if (controls.active === true) {
                    if (!$$.has('items').in(controls) || controls.items.length === 0) {
                        _gridExtends().except(ge+"Wrong controls items !");
                        $$.log("grid() error => Wrong controls items !").error();
                        return false;
                    }
                    for (let k = 0; k < controls.items.length; k++) {
                        let cn = controls.items[k].name/*Control Name*/
                        let ca = controls.items[k].action/*Control Action*/
                        if (!$$.inArray(accepted_controls, cn)) {
                            _gridExtends().except(ge+"Wrong control name: " + cn);
                            $$.log("grid() error => Wrong control name: " + cn).error();
                            return false;
                        }
                        if (!$$.is(ca).function() && !$$.is(ca).url()) {
                            _gridExtends().except(ge+"Control action is not a function !");
                            $$.log("grid() error => Control action is not a function !").error();
                            return false;
                        }
                    }
                } else {
                    controls["active"] = false;
                }

                /*checkMoreControls*/
                if (more.active === true) {
                    if (!$$.has('items').in(more) || more.items.length === 0) {
                        _gridExtends().except(ge+"Wrong more controls items !");
                        $$.log("grid() error => Wrong more controls items !").error();
                        return false;
                    }
                    for (let k = 0; k < more.items.length; k++) {
                        let mn = more.items[k].name;/*More Name*/
                        let ma = more.items[k].action;/*More Action*/
                        if (!$$.inArray(accepted_more, mn)) {
                            _gridExtends().except(ge+"Wrong more control name: " + mn);
                            $$.log("grid() error => Wrong more control name: " + mn).error();
                            return false;
                        }
                        if (!$$.is(ma).function()) {
                            _gridExtends().except(ge+"More action is not a function !");
                            $$.log("grid() error => More action is not a function !").error();
                            return false;
                        }
                    }
                } else {
                    more["active"] = false;
                }

                /*checkActions*/
                if (actions.active === true) {
                    if (!$$.has('items').in(actions) || actions.items.length === 0) {
                        _gridExtends().except(ge+"Wrong actions items !");
                        $$.log("grid() error => Wrong actions items !").error();
                        return false;
                    }
                    for (let j = 0; j < actions.items.length; j++) {
                        let an = actions.items[j].name;/*Action Name*/
                        let af = actions.items[j].action;/*Action Function*/
                        if (!$$.inArray(accepted_actions, an)) {
                            _gridExtends().except(ge+"Wrong actions name: " + an);
                            $$.log("grid() error => Wrong actions name: " + an).error();
                            return false;
                        }
                        if (!$$.is(af).function()) {
                            _gridExtends().except(ge+"Action is not a function !");
                            $$.log("grid() error => Action is not a function !").error();
                            return false;
                        }
                    }
                } else {
                    actions["active"] = false;
                }

                /*checkLinks*/
                if (links.active === true) {
                    if (!$$.has('columns').in(links) || links.columns.length === 0) {
                        _gridExtends().except(ge+"Wrong links columns !");
                        $$.log("grid() error => Wrong links columns !").error();
                        return false;
                    }
                    for (let j = 0; j < links.columns.length; j++) {
                        if (!$$.has('col').in(links.columns[j]) || !$$.is(links.columns[j].col).num()) {
                            _gridExtends().except(ge+"Wrong links col !");
                            $$.log("grid() error => Wrong links col: " + links.columns[j]).error();
                            return false;
                        }
                        if (
                            !$$.has('action').in(links.columns[j]) ||
                            (!$$.is(links.columns[j].action).function()) && (!$$.is(links.columns[j].action).url())
                        ) {
                            _gridExtends().except(ge+"Links Action is not a function or URL !");
                            $$.log("grid() error => Links Action is not a function or URL !").error();
                            return false;
                        }
                    }
                } else {
                    links["active"] = false;
                }

                /*checkIcons*/
                if (icons.active === true) {
                    if (!$$.has('columns').in(icons) || icons.columns.length === 0) {
                        $$.exceptBox(ge+"Wrong icons columns !", debug);
                        $$.log("grid() error => Wrong icons columns !").error();
                        return false;
                    }
                    for (let j = 0; j < icons.columns.length; j++) {
                        if (!$$.has('col').in(icons.columns[j]) || !$$.is(icons.columns[j].col).num()) {
                            _gridExtends().except(ge+"Wrong icons col !");
                            $$.log("grid() error => Wrong icons col: " + icons.columns[j]).error();
                            return false;
                        }
                    }
                } else {
                    icons["active"] = false;
                }

                /*checkRating*/
                if (rating.active === true) {
                    if (!$$.has('column').in(rating) || !$$.is(rating.column).num()) {
                        _gridExtends().except(ge+"Wrong rating column !");
                        $$.log("grid() error => Wrong rating column !").error();
                        return false;
                    }
                    if (!$$.has('star_size').in(rating) || !$$.is(rating.star_size).num()) {
                        _gridExtends().except(ge+"Wrong rating star_size !");
                        $$.log("grid() error => Wrong rating star_size !").error();
                        return false;
                    }
                    if (rating.allow_rate === true) {
                        if (
                            !$$.has('action').in(rating) ||
                            (rating.action.type !== "quick" && rating.action.type !== "cookie")
                        ) {
                            _gridExtends().except(ge+"Wrong rating action !");
                            $$.log("grid() error => Wrong rating action !").error();
                            return false;
                        }
                    }
                } else {
                    rating["active"] = false;
                }

                /*checkPaginate*/
                if (paginate.active === true) {
                    if (
                        !$$.has('page').in(paginate) ||
                        !$$.has('max_pager').in(paginate) ||
                        !$$.has('items_show').in(paginate) ||
                        !$$.has('jumper').in(paginate) ||
                        !$$.has('jumper_fix').in(paginate) ||
                        paginate.page <= 0
                    ) {
                        _gridExtends().except(ge+"Wrong parameters to paginate !");
                        $$.log("grid() error => Wrong parameters to paginate !").error();
                        return false;
                    }
                } else {
                    paginate["active"] = false;
                }

                /*checkColumns*/
                try {
                    for (let i = 0; i < columns.length; i++) {
                        if (
                            !$$.has('name').in(columns[i]) ||
                            !$$.has('width').in(columns[i]) ||
                            !$$.has('money').in(columns[i]) ||
                            !$$.has('required').in(columns[i])
                        ) {
                            _gridExtends().except(ge+"Wrong columns settings: " +
                                $$.objectMap(columns[i]).toString());
                            $$.log("grid() error => Wrong columns settings: " + columns[i]).error();
                            return false;
                        }
                    }
                } catch (er) {
                    _gridExtends().except(ge+"Wrong columns settings...");
                    $$.log("grid() error => Wrong columns settings...").error();
                    return false;
                }

                /**
                 * Last Checkin - Do not change this
                 * */

                /*CheckIdentifyKey*/
                if (identify_key.active === true) {
                    if ($$.has("id").in(identify_key)) {
                        for (let i = 0; i < columns.length; i++) {
                            if (columns[i].name === identify_key.id) {
                                return true;
                            }
                        }
                    }

                    _gridExtends().except(ge+"Wrong identify_key [" +
                        $$.objectMap(identify_key).toString() + "] to columns settings");
                    $$.log("grid() error => Wrong identify_key [" +
                        $$.objectMap(identify_key).toString() + "] to columns settings").error();

                    return false;
                }

                return true;
            }

            function _defineStateEvents() {

                (function controlsState() {
                    if (controls.active !== true) return;

                    controls.items.forEach(function(item, index, array) {
                        if ($$.inArray(accepted_controls, item.name)) {
                            controls_active[item.name].state = true;
                            controls_active[item.name].action = item.action;
                            if ($$.isDefined(item.rollback) && item.name === "import") {
                                controls_active[item.name].rollback = item.rollback;
                            }
                        }
                    });
                })();

                (function moreControlsState() {
                    if (more.active !== true) return;

                    more.items.forEach(function(item, index, array) {
                        if ($$.inArray(accepted_more, item.name)) {
                            more_active[item.name] = true;
                        }
                    });
                })();

                (function actionsState() {
                    if (actions.active !== true) return;

                    actions.items.forEach(function(item, index, array) {
                        if ($$.inArray(accepted_actions, item.name)) {
                            actions_active[item.name].state = true;
                            actions_active[item.name].action = item.action;
                        }
                    });
                })();

                (function markerState() {
                    if (checkbox !== true) return;

                    checkbox_active['check_all'] = true;
                    checkbox_active['check_one'] = true;
                })();

                (function linksSate() {
                    if (links.active !== true) return;

                    for (let k = 0; k < links.columns.length; k ++) {
                        /*Object/Array*/
                        links_active[links.columns[k].col] = [links.columns[k].action];

                        if ($$.is(links.columns[k].action).function()) {
                            if (!$$.inArray(links_fn_col, links.columns[k].col)) {
                                links_fn_col.push(links.columns[k].col);
                            }
                        }
                    }
                })();

                (function iconsState() {
                    if (icons.active !== true) return;

                    for (let k = 0; k < icons.columns.length; k ++) {
                        /*Object/Array*/
                        icons_active[icons.columns[k].col] = [icons.columns[k].src];
                    }
                })();

                (function ratingsState() {
                    if (rating.active !== true) return;
                    rating_active[rating.column] = [rating.action];
                })();

            }

            function _checkItemsChecked() {
                return jH('.jh-grid-checkbox-items').count('checked');
            }

            function _itemsChecked() {
                let items = [];
                let grid_items = $$.toArray(jH("#jh-grid-container-values .jh-grid-checkbox-items").select());
                grid_items.forEach(function(item, index, array) {
                    if (item.checked === true) {
                        items.push(item.value);
                    }
                });
                return items;
            }

            function _setDataLen(len = undefined) {
                if (len) {
                    data_len = len;
                } else {
                    data_len = 0;
                    Object.keys(global_data).forEach(function (item, index, array) {
                        data_len += 1;
                    });
                }
            }

            function _gridFields() {
                grid_fields = [];
                try {
                    grid_fields = $$.toArray(jH("#jh-grid-columns-name div").select());
                } catch (er) {
                    $$.log("grid() _gridFields error => " + er).except();
                }
            }

            function _gridLines() {
                grid_lines = [];
                grid_lines_count = 0;
                if (not_found === true) return;
                try {
                    grid_lines = $$.toArray(jH("#jh-grid-container-values .jh-grid-values").select());
                    grid_lines_count = grid_lines.length;
                } catch (er) {
                    $$.log("grid() _gridLines error => " + er).except();
                }
            }

            function _setLoaded(flag) {
                loaded = flag;
            }

            function _isLoaded() {
                _gridLines();
                return (grid_lines_count > 0 && loaded === true);
            }

            function _notFound() {
                return (not_found === true);
            }

            function _isTurtle() {
                return (loading_count >= max_time_loading);
            }

            return {
                "original": _getOriginalSettings,
                "current": _getCurrentSettings,
                "checkin": _checkGridParameters,
                "checked": _checkItemsChecked,
                "itemsChecked": _itemsChecked,
                "events": _defineStateEvents,
                "setLength": _setDataLen,
                "fields": _gridFields,
                "lines": _gridLines,
                "setLoaded": _setLoaded,
                "isLoaded": _isLoaded,
                "notFound": _notFound,
                "isTurtle": _isTurtle,
            };
        }

        /**
         * Grid Loading
         */
        function _gridLoading() {

            function _start() {
                _gridExtends().loading().start();
            }

            function _monitor(force = false) {
                loading_control = setInterval(function () {
                    _finish(force);
                }, 1000);
            }

            function _finish(force = false) {
                _gridExtends().loading().finish(force);
            }

            function _turtle() {
                let message_view = false;
                turtle_control = setInterval(function () {
                    if (_gridInfo().isTurtle() && message_view === false) {
                        _gridExtends().alert("There is a problem in the system that is causing slow processing...");
                        message_view = true;
                    }
                    loading_count++;
                }, 1000);
            }

            function _run() {
                if (loading) {
                    _start();
                    _monitor();
                }
            }

            return {"start": _start, "monitor": _monitor, "finish": _finish, "run": _run, "turtle": _turtle};
        }

        /**
         * Grid Handler
         */
        function _gridHandler() {

            function _clear(clear_only_grid = false) {
                if (!clear_only_grid) {
                    jH(target).erase();
                } else {
                    jH("#jh-grid-columns-name").erase();
                    jH("#jh-grid-container-values").erase();
                    grid_width = 0;
                }
            }

            function _toggleOptions(src) {
                jH('#jh-grid-container-controls').show();
                if (src === 'new') {
                    _gridExtends().slideIn("right").hide();
                    jH('#jh-grid-new-control').show();
                    jH('#jh-grid-search-control').hide();
                    jH('#jh-grid-import-control').hide();
                } else if (src === 'search') {
                    _gridExtends().slideIn("right").hide();
                    jH('#jh-grid-new-control').hide();
                    jH('#jh-grid-search-control').show();
                    jH('#jh-grid-import-control').hide();
                } else if (src === 'import') {
                    _gridExtends().slideIn("right").hide();
                    jH('#jh-grid-new-control').hide();
                    jH('#jh-grid-search-control').hide();
                    jH('#jh-grid-import-control').show();
                } else if (src === 'export') {
                    _gridExtends().slideIn("right").hide();
                    jH('#jh-grid-container-controls').hide();
                } else {
                    /*More Controls Requested*/
                    jH('#jh-grid-container-controls').hide();
                    jH('#jh-grid-new-control').hide();
                    jH('#jh-grid-search-control').hide();
                    jH('#jh-grid-import-control').hide();
                }
            }

            function _gridOrder(order = "asc", col) {
                let grid_matrix = [];
                let ord_matrix = [];

                if (grid_lines_count >= paginate.items_show) {
                    /*populate the grid matrix*/
                    grid_lines.forEach(function (item, index, array) {
                        let _sel_ = "#jh-grid-container-values #jh-grid-line-" + index + " div";
                        grid_matrix.push($$.toArray(jH(_sel_).select()));
                    });

                    /*Grid Matrix Ordered*/
                    ord_matrix = $$.sort(grid_matrix).asNodes(order, parseInt(col));

                    /*insert data ordered in grid*/
                    ord_matrix.forEach(function (item, index, array) {
                        item.forEach(function (_item, _index, _array) {
                            $$.insert(_item).last("#jh-grid-container-values #jh-grid-line-" + index);
                        });
                    });

                    /*update data values after ordered*/
                    let total = ord_matrix.length;
                    if (order === 'desc') {
                        for (let i = total; i >= 0; i--) {
                            let val = (total - i - 1);
                            jH("#jh-grid-action-bt-update-" + i).props("data-content",val);
                            jH("#jh-grid-action-bt-delete-" + i).props("data-content",val);
                            jH("#jh-grid-action-bt-read-" + i).props("data-content",val);
                        }
                    } else if (order === 'asc') {
                        for (let i = 0; i <= total; i++) {
                            jH("#jh-grid-action-bt-update-" + i).props("data-content",i);
                            jH("#jh-grid-action-bt-delete-" + i).props("data-content",i);
                            jH("#jh-grid-action-bt-read-" + i).props("data-content",i);
                        }
                    }
                }
            }

            function _gridReset() {
                if (_gridInfo().isLoaded()) {
                    grid_lines.forEach(function (item, index, array) {
                        jH("#jh-grid-container-values #"+item.id).show();
                    });
                }
            }

            function _gridFilter(_data) {
                let grid_matrix = [];
                let searching = "";
                let _data_ = $$.trim(_data.toLowerCase());

                _gridInfo().lines();

                if (_gridInfo().isLoaded()) {
                    /*populate the grid matrix*/
                    grid_lines.forEach(function (item, index, array) {
                        grid_matrix.push([item.id, $$.toArray(jH("#jh-grid-container-values #"+item.id+" div").select())]);
                    });

                    /*data search: line by line from matrix*/
                    grid_matrix.forEach(function (item, index, array) {
                        let not_found = true;
                        for (let k = 2; k <= item[1].length; k++) {
                            if (item[1][k]) {
                                searching = $$.trim(item[1][k].textContent.toLowerCase());
                                if (searching.search(_data_) !== -1) {
                                    not_found = false;
                                    break;
                                }
                            }
                        }
                        if (not_found) {
                            jH("#jh-grid-container-values #" + item[0]).hide();
                        }
                    });
                }
            }

            function _setGridWidth() {
                jH("#jh-grid-columns-name").width(grid_width + "px");
                jH("#jh-grid-container-values").width(grid_width+"px");
            }

            return {
                "clear": _clear,
                "toggle": _toggleOptions,
                "order": _gridOrder,
                "reset": _gridReset,
                "filter": _gridFilter,
                "width": _setGridWidth,
            };
        }

        /**
         * Grid Actions (CRUD: less Create)
         */
        function _gridActions() {

            function _editItem(args) {
                _gridLoading().start();
                $$.exec(actions_active.update.action, args);
                _gridLoading().turtle();
            }

            function _removeItem(id) {
                _gridLoading().start();
                $$.exec(actions_active.delete.action, id);
                _gridLoading().turtle();
            }

            function _viewItem(html, id) {
                _gridExtends().viewer(html);
                $$.exec(actions_active.read.action, id);
            }

            return {"edit": _editItem, "delete": _removeItem, "view": _viewItem};
        }

        /**
         * Grid Structure
         */
        function _gridStructure() {

            function _createContainerGrid() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-container", "jh-grid-container"+theme],
                    append: target
                });
            }

            function _createContainerGridMoreControls() {
                if (more.active !== true) return;
                _gridExtends().slideIn("right").run();
            }

            function _createContainerGridControls() {
                if (controls.active !== true) return;

                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-container-controls",
                    append: "#jh-grid-container"
                });

                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-container-controls-close",
                    append: "#jh-grid-container-controls"
                }, "X");
            }

            function _createContainerGridHeader() {
                $$.create({
                    element: "div",
                    attr_type: "id",
                    attr_name: "jh-grid-controls",
                    append: "#jh-grid-container"
                });
            }

            function _createContainerGridContent() {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-container-content",
                    append: "#jh-grid-container"
                });
            }

            function _createContainerGridColumns() {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-columns-name",
                    append: "#jh-grid-container-content"
                });
            }

            function _createContainerGridValues() {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-container-values",
                    append: "#jh-grid-container-content"
                });
            }

            function _createContainerGridPaginate() {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-paginate",
                    append: "#jh-grid-container"
                });
            }

            function _build() {
                _createContainerGrid();
                _createContainerGridMoreControls();
                _createContainerGridControls();
                _createContainerGridHeader();
                _createContainerGridContent();
                _createContainerGridColumns();
                _createContainerGridValues();
                _createContainerGridPaginate();
            }

            return {"build": _build};
        }

        /**
         * Grid Data Content
         */
        function _gridPrepare() {

            function _bodyReset() {
                if ($$.findId("jh-grid-container-values")) {
                    jH("#jh-grid-container-values").erase();
                }
            }

            function _headerDraw() {
                /*Prevent Bug*/
                if (!columns) return;

                let _w_ = 0;
                let jump = 0;

                (function columnActions() {
                    if (actions.active !== true) return;

                    $$.create({
                        element:  "div",
                        attr_type: "class",
                        attr_name: "jh-grid-action",
                        append: "#jh-grid-columns-name"
                    }, "Action");

                    grid_width += action_col_width;
                    jump += 1;
                })();

                (function columnCheckbox() {
                    if (checkbox !== true) return;

                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-check", "jh-grid-check"],
                        append: "#jh-grid-columns-name"
                    });

                    $$.create({
                        element:  "button",
                        attr_type: ["type", "id", "title"],
                        attr_name: ["button", "jh-grid-checkbox-all", "Check All"],
                        append: "#jh-grid-check"
                    }, "&#9745;");

                    $$.create({
                        element:  "button",
                        attr_type: ["type", "id", "title"],
                        attr_name: ["button", "jh-grid-uncheck-all", "UnCheck All"],
                        append: "#jh-grid-check"
                    }, "&#9745;");

                    grid_width += checkbox_col_width;
                    jump += 1;
                })();

                (function dynamicColumns() {
                    for (let k = 0; k < columns.length; k++) {
                        $$.create({
                            element:  "div",
                            attr_type: "id",
                            attr_name: "jh-grid-header-"+k,
                            append: "#jh-grid-columns-name"
                        });

                        $$.create({
                            element:  "span",
                            attr_type: ["id", "class", "data-jh-grid-sort-by", "data-content"],
                            attr_name: ["jh-grid-header-span-"+k, "jh-grid-header-span", "asc", k+jump],
                            append: "#jh-grid-header-"+k
                        }, $$.replaceAll(columns[k].name, "_", " ") + " &#8645;");

                        if ($$.isDefined(columns[k].width)) {
                            _w_ = $$.intNumber(columns[k].width);
                        } else {
                            _w_ = "200";/*minimal width*/
                        }

                        (function applyWidthColumn() {
                            jH("#jh-grid-header-"+k).width(_w_+"px");
                        })();

                        grid_width += _w_;
                    }
                })();

                (function applyGridWidth() {
                    _gridHandler().width();
                })();

            }

            function _bodyDraw() {

                (function renderize() {
                    if (process_type !== 'renderize') return;
                    _gridRenderize().renderize();
                })();

                (function query_renderize() {
                    if (process_type !== 'query_renderize') return;
                    _gridRenderize().query();
                })();

                (function query_paginate() {
                    if (process_type !== 'query_paginate') return;
                    _gridRenderize().query_paginate();
                })();

            }

            function _pagerDraw() {
                _gridExtends().smartPager().run();
            }

            return {
                "bodyReset": _bodyReset,
                "headerDraw": _headerDraw,
                "bodyDraw": _bodyDraw,
                "pagerDraw": _pagerDraw
            };
        }

        /**
         * Grid Data Renderize
         */
        function _gridRenderize() {

            function _setQueueImport(idx) {
                /*Save only index to data source*/
                queue_import.push(idx);
            }

            function _gridItemMapper(j, static_line = undefined) {
                if (!$$.isDefined(global_data[j])) return;

                let _identity_ = null;

                function _itemMapper(x, array_y) {
                    let _class_ = "jh-data-grid-val";
                    let _value_ = array_y[1];

                    if (columns[x].money === true) {
                        _class_ = "txt-money";
                    }

                    if (links.active === true && $$.isDefined(links_active[x])) {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class", "style"],
                            attr_name: [_class_+"-" + static_line + "-index", _class_, "width: " + columns[x].width + "px"],
                            append: "#jh-grid-line-" + static_line
                        });

                        if ($$.is(links_active[x]).url()) {
                            let _url_ = null;

                            if (links_active[x][0].search(/\?([a-zA-Z0-9-]+)=$/) !== -1) {
                                _url_ = links_active[x][0] + _value_ + "&item_id=" + _identity_;
                            } else {
                                _url_ = links_active[x][0].replace(/\/$/, "") +"/"+ _identity_;
                            }

                            $$.create({
                                element: "a",
                                attr_type: ["href", "target"],
                                attr_name: [_url_, "_blank"],
                                append: "#"+_class_+"-" + static_line + "-index"
                            }, _value_);

                        } else if ($$.is(links_active[x][0]).function()) {

                            let grid_link = "data-jh-grid-link";

                            $$.create({
                                element: "a",
                                attr_type: ["id", grid_link+"-index-"+x, grid_link+"-item-id-"+x, "data-content"],
                                attr_name: [grid_link+"-"+static_line+"-"+x, j, _identity_, static_line],
                                append: "#"+_class_+"-" +static_line + "-index"
                            }, _value_);

                        }

                    } else if (icons.active === true && $$.isDefined(icons_active[x])) {
                        let icon_src = null;
                        let icon_alt = null;
                        if ($$.is(_value_).url()) {
                            icon_src = _value_;
                            icon_alt = "External Image";
                        } else {
                            if (!$$.isDefined(icons_active[x][0])) {
                                $$.exceptBox("$$.grid()<br /><br />Wrong icon source settings", true);
                            }
                            icon_src = $$.trim(icons_active[x][0]).replace(/\/$/, '') + "/" + _value_;
                            icon_alt = $$.ucFirst(_value_);
                        }
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class", "style"],
                            attr_name: [_class_+"-" + static_line + "-index", _class_, "width: " + columns[x].width + "px"],
                            append: "#jh-grid-line-" + static_line
                        });

                        $$.create({
                            element: "img",
                            attr_type: ["id", "class", "src", "alt", "title"],
                            attr_name: ["jh-grid-icon-"+static_line, "jh-grid-icon", icon_src, icon_alt, icon_alt],
                            append: "#"+_class_+"-" + static_line + "-index"
                        });

                    } else if (rating.active === true && $$.isDefined(rating_active[x])) {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class", "style"],
                            attr_name: [""+_class_+"-" + static_line +"-"+ x + "-index", _class_, "width: " + columns[x].width + "px"],
                            append: "#jh-grid-line-" + static_line
                        });

                        let _item_ratings_ = {
                            [_identity_] : [
                                {
                                    item_id: _identity_,
                                    stars: _value_.stars
                                }
                            ]
                        };

                        _gridExtends().rater("#"+_class_+"-" + static_line +"-"+ x + "-index", _item_ratings_);

                        jH("#"+_class_+"-" + static_line +"-"+ x + "-index").addClass('pad-0');

                    } else {
                        (function runDefaultColumns() {
                            $$.create({
                                element: "div",
                                attr_type: ["id", "class", "style"],
                                attr_name: [_class_+"-" + static_line + "-index", _class_, "width: " + columns[x].width + "px"],
                                append: "#jh-grid-line-" + static_line
                            }, _value_);
                        })();
                    }

                }

                (function setItemIdentity() {
                    if (identify_key.active !== true) return;

                    if ($$.isDefined(global_data[j][identify_key.id])) {
                        _identity_ = global_data[j][identify_key.id];
                    }
                })();

                (function createGridLines() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class", "data-jh-grid-line", "data-content"],
                        attr_name: ["jh-grid-line-" + static_line, "jh-grid-values", j, static_line],
                        append: "#jh-grid-container-values"
                    });

                    jH("#jh-grid-line-" + static_line).width(grid_width + "px");

                    if (default_color_line) {
                        jH("#jh-grid-line-" + static_line).addClass("jh-grid-default-color");
                        default_color_line = false;
                    } else {
                        default_color_line = true;
                    }
                })();

                (function createGridActions() {
                    if (actions.active !== true) return;

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-action-" + static_line, "jh-grid-action"],
                        append: "#jh-grid-line-" + static_line
                    });

                    $$.create({
                        element: "ul",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-menu-action-" + static_line, "jh-grid-menu-action"],
                        append: "#jh-grid-action-" + static_line
                    });

                    /*Create Actions Buttons*/
                    actions.items.forEach(function(item, index, array) {
                        if ($$.inArray(accepted_actions, item.name)) {
                            $$.create({
                                element: "li",
                                attr_type: "id",
                                attr_name: "jh-grid-menu-action-li-"+item.name+"-"+static_line,
                                append: "#jh-grid-menu-action-" + static_line
                            });

                            $$.create({
                                element: "button",
                                attr_type: [
                                    "type",
                                    "id",
                                    "class",
                                    "data-jh-grid-action-"+item.name,
                                    "data-content",
                                    "title",
                                    "value"
                                ],
                                attr_name: [
                                    "button",
                                    "jh-grid-action-bt-"+item.name+"-"+static_line,
                                    "jh-grid-action-"+item.name+"-icon",
                                    j,
                                    static_line,
                                    $$.ucFirst(item.name),
                                    _identity_
                                ],
                                append: "#jh-grid-menu-action-li-"+item.name+"-"+static_line
                            }, actions_icons[item.name]);
                        }
                    });

                })();

                (function createGridCheckbox() {
                    if (checkbox === false) return;

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-check-" + static_line, "jh-grid-check"],
                        append: "#jh-grid-line-" + static_line
                    });

                    $$.create({
                        element: "a",
                        attr_type: "id",
                        attr_name: "jh-grid-check-a-" + static_line,
                        append: "#jh-grid-check-" + static_line
                    });

                    $$.create({
                        element: "input",
                        attr_type: [
                            "type",
                            "id",
                            "class",
                            "name",
                            "value",
                            "data-content"
                        ],
                        attr_name: [
                            "checkbox",
                            "jh-grid-checkbox-items-" + static_line,
                            "jh-grid-checkbox-items",
                            "jh-grid-checkbox-items-" + static_line,
                            _identity_,
                            static_line
                        ],
                        append: "#jh-grid-check-a-" + static_line
                    });
                })();

                (function createGridValues() {
                    let _line_ = $$.objectMap(global_data[j]).toArray();
                    for (let x = 0; x < columns.length; x++) {
                        for (let y = 0; y < _line_.length; y++) {
                            if (_line_[y][0] === columns[x].name) {
                                _itemMapper(x, _line_[y]);
                                break;
                            }
                        }
                    }
                })();

            }

            function _mapperArray(_import_ = false) {
                let static_grid_line = 0;
                for (let j = ((paginate.items_show * paginate.page) - paginate.items_show); j < (paginate.items_show * paginate.page); j++) {
                    if (_import_ === false) {
                        _gridItemMapper(j, static_grid_line);
                    } else {
                        _setQueueImport(j);
                    }
                    static_grid_line++;
                }
                _gridInfo().setLoaded(true);
            }

            function _mapperArrayPageable(idx_start = 0) {
                let static_grid_line = 0;
                for (let j = idx_start; j < paginate.items_show; j++) {
                    _gridItemMapper(j, static_grid_line);
                    static_grid_line++;
                }
                _gridInfo().setLoaded(true);
            }

            function _mapperObject(_import_ = false) {
                let static_grid_line = 0;
                for (let j = (1+(paginate.items_show * paginate.page) - paginate.items_show); j <= (paginate.items_show * paginate.page); j++) {
                    if (_import_ === false) {
                        _gridItemMapper(j, static_grid_line);
                    } else {
                        _setQueueImport(j);
                    }
                }
                _gridInfo().setLoaded(true);
            }

            function _import(fn) {
                abort_import = false;
                data_len = global_data.length;
                paginate.total_items = global_data.length;
                on_import = true;

                _mapperArray(true);

                let pg = _gridExtends().progress(queue_import.length, "The file is processing...");
                let sl = 0;

                let time_control = setInterval(function() {
                    _gridItemMapper(queue_import.shift(), sl);
                    if (queue_import.length === 0 || abort_import === true) {
                        pg.close();
                        clearInterval(time_control);
                        _gridExtends().sticker(global_data).open();
                        _gridInfo().lines();
                        _gridExtends().smartPager().import();
                    }
                    pg.update();
                    sl++;
                }, 100);

                if ($$.is(fn).function()) {
                    fn();
                }
            }

            function _renderize(backend_paginate = false) {

                _gridPrepare().bodyReset();

                if (data_type === 'array/object') {
                    _gridInfo().setLength(global_data.length);
                    if (backend_paginate === false) {
                        _mapperArray();
                    } else {
                        _mapperArrayPageable(0);
                    }
                }
                if (data_type === 'array/array') {/*TODO: Verificar bug aqui*/
                    _gridInfo().setLength();
                    if (backend_paginate === false) {
                        _mapperArray();
                    } else {
                        _mapperArrayPageable(0);
                    }
                }
                if (data_type === 'object/object') {
                    _gridInfo().setLength();
                    if (backend_paginate === false) {
                        _mapperObject();
                    } else {
                        _mapperArrayPageable(1);
                    }
                }
                if (data_type === 'object/array') {
                    _gridInfo().setLength();
                    if (backend_paginate === false) {
                        _mapperObject();
                    } else {
                        _mapperArrayPageable(1);
                    }
                }
                _gridInfo().lines();
            }

            function _query() {
                function _msgError(err) {
                    return "<div " +
                        "id='jh-grid-query-error' " +
                        "class='jh-grid-query-error'>" +
                        query_error +": "+ err +
                        "</div>";
                }
                function _msgNoResults() {
                    return "<div " +
                        "id='jh-grid-query-no-results' " +
                        "class='jh-grid-query-no-results'>" +
                        no_results +
                        "</div>";
                }

                $$.ajax({
                    url: query_renderize.url,
                    async: true,
                    cors: cors,
                    data: query_renderize.params || "",
                    dataType: query_renderize.data_type || "json",
                    contentType: query_renderize.content_type || "application/json",
                    restful: false
                }).get(function(resp) {

                    if (resp.error) {
                        not_found = true;
                        jH("#jh-grid-container-values").html(_msgError(resp.text));
                        jH("#jh-grid-container-values").width(grid_width+"px");
                        if (loading) _gridLoading().finish(true);
                    } else {

                        if (resp.length > 0) {
                            not_found = false;
                            global_data = resp;
                            data_type = $$.dataType(global_data);
                            original_data_len = global_data.length;
                            paginate.total_items = global_data.length;

                            _renderize(false);

                        } else {
                            not_found = true;
                            jH("#jh-grid-container-values").html(_msgNoResults());
                            jH("#jh-grid-container-values").width(grid_width+"px");
                            if (loading) _gridLoading().finish(true);
                        }
                    }

                }, function(err) {
                    $$.log("grid() > _query() > ajax() error => " + err).error();
                });
            }

            function _query_paginate() {
                function _msgError(err) {
                    return "<div " +
                        "id='jh-grid-query-error' " +
                        "class='jh-grid-query-error'>" +
                        query_error +": "+ err +
                        "</div>";
                }
                function _msgNoResults() {
                    return "<div " +
                        "id='jh-grid-query-no-results' " +
                        "class='jh-grid-query-no-results'>" +
                        no_results +
                        "</div>";
                }

                $$.ajax({
                    url: query_paginate.url,
                    async: true,
                    cors: cors,
                    data: query_paginate.params || "",
                    dataType: query_paginate.data_type || "json",
                    contentType: query_paginate.content_type || "application/json",
                    restful: false
                }).get(function(resp) {

                    if ($$.has("error").in(resp)) {
                        not_found = true;
                        jH("#jh-grid-container-values").html(_msgError(resp.text));
                        jH("#jh-grid-container-values").width(grid_width+"px");
                        if (loading) _gridLoading().finish(true);
                    } else {

                        if ($$.has("result").in(resp) && resp.result.length > 0) {
                            not_found = false;
                            global_data = resp.result;
                            paginate.page = resp.page;
                            paginate.items_show = resp.items_show;
                            paginate.max_pager = resp.max_pager;
                            paginate.total_items = resp.counter;
                            original_data_len = resp.counter;
                            data_type = $$.dataType(global_data);

                            _renderize(true);

                        } else {
                            not_found = true;
                            jH("#jh-grid-container-values").html(_msgNoResults());
                            jH("#jh-grid-container-values").width(grid_width+"px");
                            if (loading) _gridLoading().finish(true);
                        }
                    }

                }, function(err) {
                    $$.log("grid() > _query() > ajax() error => " + err).error();
                });
            }

            function _query_export(fn) {
                $$.ajax({
                    url: query_paginate.url_export,
                    async: true,
                    cors: cors,
                    data: query_paginate.params || "",
                    dataType: query_paginate.data_type || "json",
                    contentType: query_paginate.content_type || "application/json",
                    restful: false
                }).get(function(resp) {
                    $$.exec(fn, resp);
                }, function(err) {
                    $$.log("grid() > _query() > ajax() error => " + err).error();
                });
            }

            function _reload() {

                if ($$.findId("jh-sticker-container")) {
                    _gridExtends().sticker().close();
                }

                process_type = original_process_type;

                if (save_original_param.length > 0) {
                    if (query_renderize.active === true) {
                        query_renderize.params[save_original_param[0][0]] = save_original_param[0][1];
                    } else if (query_paginate.active === true) {
                        query_paginate.params[save_original_param[0][0]] = save_original_param[0][1];
                    }
                    $$.await(0.2).run(function () {
                        save_original_param = [];
                    });
                }

                let settings = _gridInfo().original(false);
                // _gridInfo().current(true);

                if (process_type === 'renderize' && on_paginate === false && on_import === false) {
                    window.location.reload();
                    return false;
                }

                if (
                    process_type === 'query_renderize' ||
                    process_type === 'query_paginate' ||
                    on_paginate === true ||
                    on_import === true
                ) {
                    if (process_type === 'query_renderize') {
                        /*Reset state smartPage*/
                        data_len = original_data_len;
                        paginate.page = settings.original_page;
                        paginate.max_pager = settings.original_max_pager;
                        paginate.items_show = settings.original_items_show;
                        paginate.total_items = original_data_len;
                    } else if (process_type === 'query_paginate') {
                        paginate.page = 1;
                        query_paginate.params.page = 1;
                    }

                    not_found = false;
                    abort_import = false;
                    on_paginate = false;
                    on_import = false;

                    _sharedProcess();
                }
            }

            function _search() {
                _sharedProcess();
            }

            function _sharedProcess() {
                clearInterval(turtle_control);
                _gridLoading().start();
                if (process_type === 'query_renderize') {
                    _gridRenderize().query();
                } else if (process_type === 'query_paginate') {
                    _gridRenderize().query_paginate();
                }
                _gridLoading().monitor(false);
                _gridExtends().smartPager().run();
                _gridEvents().activeEventsGridItems().monitor();
            }

            return {
                "import": _import,
                "renderize": _renderize,
                "query": _query,
                "query_paginate": _query_paginate,
                "query_export": _query_export,
                "reload": _reload,
                "search": _search,
            }
        }

        /**
         * Grid Buttons and Controls
         */
        function _gridControls() {

            function _createControlsNew() {

                function _createColumnNew(k) {
                    let required = "";
                    (function column__LABEL_LEFT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-3-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-3-" + k).addClass('jh-col-2');
                        jH("#jh-grid-form-new-col-3-" + k).addClass('jh-color-1');
                        jH("#jh-grid-form-new-col-3-" + k).addClass('pad-10');
                        jH("#jh-grid-form-new-col-3-" + k).addClass('align-right');

                        $$.create({
                            element: "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-span-key-1-" + k, "jh-txt-color-1"],
                            append: "#jh-grid-form-new-col-3-" + k
                        }, $$.ucFirst($$.replaceAll(columns[k].name, "_", " ")));
                    })();

                    (function column__INPUT_LEFT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-4-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-4-" + k).addClass('jh-col-2');
                        jH("#jh-grid-form-new-col-4-" + k).addClass('jh-color-1');

                        let _ref_ = (columns[k].name)
                            .toString()
                            .toLowerCase()
                            .replace(" ", "-");

                        $$.create({
                            element: "input",
                            attr_type: ["type", "name", "id", "class", "value", "placeholder"],
                            attr_name: ["text", _ref_, _ref_, "jh-form-input-txt", "", "Type a value"],
                            append: "#jh-grid-form-new-col-4-" + k
                        });

                        if (columns[k].required === true && columns[k].name !== identify_key.id) {
                            jH("#"+_ref_).attr("required", "true");
                        } else if (columns[k].name === identify_key.id) {
                            jH("#"+_ref_).attr("disabled", true);
                        }
                    })();

                    (function column__SEPARATOR__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-2-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-2-" + k).addClass('jh-col-1');
                        jH("#jh-grid-form-new-col-2-" + k).addClass('jh-color-1');
                    })();

                    /*Bug Prevent*/
                    try {
                        if (!$$.isDefined(columns[k + 1].name)) return;
                    } catch(er) {
                        return;
                    }

                    (function column__LABEL_RIGHT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-5-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-5-" + k).addClass('jh-col-2');
                        jH("#jh-grid-form-new-col-5-" + k).addClass('jh-color-1');
                        jH("#jh-grid-form-new-col-5-" + k).addClass('pad-10');
                        jH("#jh-grid-form-new-col-5-" + k).addClass('align-right');

                        $$.create({
                            element: "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-span-key-2-" + k, "jh-txt-color-1"],
                            append: "#jh-grid-form-new-col-5-" + k
                        }, $$.ucFirst($$.replaceAll(columns[k+1].name, "_", " ")));
                    })();

                    (function column__INPUT_RIGHT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-6-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-6-" + k).addClass('jh-col-2');
                        jH("#jh-grid-form-new-col-6-" + k).addClass('jh-color-1');

                        let _ref_ = (columns[k+1].name)
                            .toString()
                            .toLowerCase()
                            .replace(" ", "-");

                        $$.create({
                            element: "input",
                            attr_type: ["type", "name", "id", "class", "value", "placeholder"],
                            attr_name: ["text", _ref_, _ref_, "jh-form-input-txt", "", "Type a value"],
                            append: "#jh-grid-form-new-col-6-" + k
                        });

                        if (columns[k+1].required === true && columns[k+1].name !== identify_key.id) {
                            jH("#"+_ref_).attr("required", "true");
                        } else if (columns[k+1].name === identify_key.id) {
                            jH("#"+_ref_).attr("disabled", true);
                        }
                    })();

                    (function column__PADDING__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-7-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-7-" + k).addClass('jh-col-1');
                        jH("#jh-grid-form-new-col-7-" + k).addClass('jh-color-1');
                    })();
                }

                function _createLastLineNew(k) {

                    (function lastLine(){
                        $$.create({
                            element:  "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-row-"+k, "jh-row-margin"],
                            append: "#jh-grid-form-new"
                        });
                    })();

                    (function column1() {
                        $$.create({
                            element:  "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-1-"+k, "jh-col"],
                            append: "#jh-grid-form-new-row-"+k
                        });
                        jH("#jh-grid-form-new-col-1-"+k).addClass('jh-col-09');
                        jH("#jh-grid-form-new-col-1-"+k).addClass('jh-color-1');
                    })();

                    (function column2() {
                        $$.create({
                            element:  "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-2-"+k, "jh-col"],
                            append: "#jh-grid-form-new-row-"+k
                        });
                        jH("#jh-grid-form-new-col-2-"+k).addClass('jh-col-4');
                        jH("#jh-grid-form-new-col-2-"+k).addClass('jh-color-1');

                        //Form Control Column 2
                        $$.create({
                            element:  "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-control-1"+k, "jh-grid-form-control"],
                            append: "#jh-grid-form-new-col-2-"+k
                        });

                        $$.create({
                            element:  "button",
                            attr_type: ["type", "name", "id", "title"],
                            attr_name: ["button", "", "jh-grid-new-send", "Save"],
                            append: "#jh-grid-form-control-1"+k
                        });

                        $$.create({
                            element:  "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-send-span-1", "button-icon"],
                            append: "#jh-grid-new-send"
                        }, "&#9745;");

                        $$.create({
                            element:  "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-send-span-2", "button-text"],
                            append: "#jh-grid-new-send"
                        }, "Save");
                    })();

                    (function column3() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-3-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-3-" + k).addClass('jh-col-02');
                        jH("#jh-grid-form-new-col-3-" + k).addClass('jh-color-1');
                    })();

                    (function column4() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-4-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-4-" + k).addClass('jh-col-4');
                        jH("#jh-grid-form-new-col-4-" + k).addClass('jh-color-1');

                        //Form Control Column 4
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-control-2" + k, "jh-grid-form-control"],
                            append: "#jh-grid-form-new-col-4-" + k
                        });

                        $$.create({
                            element: "button",
                            attr_type: ["type", "name", "id", "title"],
                            attr_name: ["reset", "", "jh-grid-new-cancel", "Cancel"],
                            append: "#jh-grid-form-control-2" + k
                        });

                        $$.create({
                            element: "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-cancel-span-1", "button-icon"],
                            append: "#jh-grid-new-cancel"
                        }, "&#9746;");

                        $$.create({
                            element: "span",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-cancel-span-2", "button-text"],
                            append: "#jh-grid-new-cancel"
                        }, "Cancel");
                    })();

                    (function column5() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-col-5-" + k, "jh-col"],
                            append: "#jh-grid-form-new-row-" + k
                        });
                        jH("#jh-grid-form-new-col-5-" + k).addClass('jh-col-09');
                        jH("#jh-grid-form-new-col-5-" + k).addClass('jh-color-1');
                    })();
                }

                (function _createLinesNew() {
                    // let _lq_ = columns.length / 2;
                    let _lq_ = columns.length;

                    for (let k = 0; k < _lq_; k+=2) {
                        /*Create Line by Line*/
                        $$.create({
                            element:  "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-new-row-"+k, "jh-row-margin"],
                            append: "#jh-grid-form-new"
                        });
                        _createColumnNew(k);
                    }
                    _createLastLineNew(_lq_);
                })();

            }

            function _createControlsSearch() {
                /*This method uses column x line concept to builder the form structure*/
                (function uniqLineSearch() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-row-1", "jh-row-margin"],
                        append: "#jh-grid-form-search"
                    });
                })();

                (function column__PADDING_LEFT__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-1", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-1").addClass('jh-col-05');
                    jH("#jh-grid-form-search-col-1").addClass('jh-color-1');
                })();

                (function column__PADDING_LEFT__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-3", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-3").addClass('jh-col-1');
                    jH("#jh-grid-form-search-col-3").addClass('jh-color-1');
                })();

                (function column__INPUT_LEFT__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-4", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-4").addClass('jh-col-3');
                    jH("#jh-grid-form-search-col-4").addClass('jh-color-1');

                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-1", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-4"
                    });

                    $$.create({
                        element:  "input",
                        attr_type: ["type", "name", "id", "value", "placeholder"],
                        attr_name: ["text", "jh-grid-input-search", "jh-grid-input-search", "", "New Search..."],
                        append: "#jh-grid-form-control-1"
                    });

                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-2", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-4"
                    });

                    $$.create({
                        element:  "select",
                        attr_type: ["name", "id"],
                        attr_name: ["jh-grid-select-show-items", "jh-grid-select-show-items"],
                        append: "#jh-grid-form-control-2"
                    });

                    $$.create({
                        element:  "option",
                        attr_type: ["name", "value"],
                        attr_name: ["", ""],
                        append: "#jh-grid-select-show-items"
                    }, "Show Items");

                    for (let i = 1; i <= 10; i++) {
                        $$.create({
                            element:  "option",
                            attr_type: ["name", "value"],
                            attr_name: ["jh-grid-show-items-option-"+(i*10), (i*10)],
                            append: "#jh-grid-select-show-items"
                        }, (i*10));
                    }

                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-3", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-4"
                    });

                    $$.create({
                        element:  "button",
                        attr_type: ["type", "name", "id", "title"],
                        attr_name: ["button", "", "jh-grid-search-send", "Send"],
                        append: "#jh-grid-form-control-3"
                    });

                    $$.create({
                        element:  "span",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-send-span-1", "button-icon"],
                        append: "#jh-grid-search-send"
                    }, "&#8629;");

                    $$.create({
                        element:  "span",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-send-span-2", "button-text"],
                        append: "#jh-grid-search-send"
                    }, "Send");
                })();

                (function column__INPUT_LEFT_LABEL__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-5", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-5").addClass('jh-col-1');
                    jH("#jh-grid-form-search-col-5").addClass('jh-color-1');

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-label-1", "jh-grid-form-control-icon"],
                        append: "#jh-grid-form-search-col-5"
                    });

                    $$.create({
                        element: "label",
                        attr_type: ["for"],
                        attr_name: ["jh-grid-input-search"],
                        append: "#jh-grid-form-search-label-1"
                    }, "&#10162;");

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-label-2", "jh-grid-form-control-icon"],
                        append: "#jh-grid-form-search-col-5"
                    });

                    $$.create({
                        element: "label",
                        attr_type: ["for"],
                        attr_name: ["jh-grid-select-show-items"],
                        append: "#jh-grid-form-search-label-2"
                    }, "&#9636;");
                })();

                (function column__INPUT_RIGHT__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-6", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-6").addClass('jh-col-3');
                    jH("#jh-grid-form-search-col-6").addClass('jh-color-1');

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-4", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-6"
                    });

                    $$.create({
                        element: "select",
                        attr_type: ["name", "id"],
                        attr_name: ["jh-grid-select-search-by", "jh-grid-select-search-by"],
                        append: "#jh-grid-form-control-4"
                    });

                    $$.create({
                        element: "option",
                        attr_type: ["name", "value"],
                        attr_name: ["", ""],
                        append: "#jh-grid-select-search-by"
                    }, "Search by");

                    for (let k = 0; k < columns.length; k++) {
                        $$.create({
                            element: "option",
                            attr_type: ["name", "value"],
                            attr_name: ["jh-grid-search-by-option-" + k, columns[k].name],
                            append: "#jh-grid-select-search-by"
                        }, $$.ucFirst($$.replaceAll(columns[k].name, "_", " ")));
                    }

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-5", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-6"
                    });

                    $$.create({
                        element: "select",
                        attr_type: ["name", "id"],
                        attr_name: ["jh-grid-select-max-pagers", "jh-grid-select-max-pagers"],
                        append: "#jh-grid-form-control-5"
                    });

                    $$.create({
                        element: "option",
                        attr_type: ["name", "value"],
                        attr_name: ["", ""],
                        append: "#jh-grid-select-max-pagers"
                    }, "Max Pagers");

                    for (let k = 1; k <= 4; k++) {
                        $$.create({
                            element: "option",
                            attr_type: ["name", "value"],
                            attr_name: ["jh-grid-max-pagers-option-" + k, (k * 10)],
                            append: "#jh-grid-select-max-pagers"
                        }, (k * 10));
                    }

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-6", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-6"
                    });

                    $$.create({
                        element: "button",
                        attr_type: ["type", "name", "id", "title"],
                        attr_name: ["reset", "", "jh-grid-search-cancel", "Cancel"],
                        append: "#jh-grid-form-control-6"
                    });

                    $$.create({
                        element: "span",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-cancel-span-1", "button-icon"],
                        append: "#jh-grid-search-cancel"
                    }, "&#10008;");

                    $$.create({
                        element: "span",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-cancel-span-2", "button-text"],
                        append: "#jh-grid-search-cancel"
                    }, "Cancel");

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-control-7", "jh-grid-form-control"],
                        append: "#jh-grid-form-search-col-6"
                    });
                })();

                (function column__INPUT_RIGHT_LABEL__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-7", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-7").addClass('jh-col-1');
                    jH("#jh-grid-form-search-col-7").addClass('jh-color-1');

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-label-3", "jh-grid-form-control-icon"],
                        append: "#jh-grid-form-search-col-7"
                    });

                    $$.create({
                        element: "label",
                        attr_type: ["for"],
                        attr_name: ["jh-grid-select-search-by"],
                        append: "#jh-grid-form-search-label-3"
                    }, "&#9636;");

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-label-4", "jh-grid-form-control-icon"],
                        append: "#jh-grid-form-search-col-7"
                    });

                    $$.create({
                        element: "label",
                        attr_type: ["for"],
                        attr_name: ["jh-grid-select-max-pagers"],
                        append: "#jh-grid-form-search-label-4"
                    }, "&#9704;");
                })();

                (function column__PADDING_RIGHT__() {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-search-col-10", "jh-col"],
                        append: "#jh-grid-form-search-row-1"
                    });
                    jH("#jh-grid-form-search-col-10").addClass('jh-col-05');
                    jH("#jh-grid-form-search-col-10").addClass('jh-color-1');
                })();

            }

            function _createControlsImport() {

                (function line__HEIGHT_80PX__() {/*Padding Fake*/
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-import-row-1", "jh-row-margin"],
                        append: "#jh-grid-form-import"
                    });

                    $$.create({
                        element:  "div",
                        attr_type: "style",
                        attr_name: "height: 80px",
                        append: "#jh-grid-form-import-row-1"
                    });
                })();

                (function line__LABEL_AND_INPUT__() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-import-row-2", "jh-row-margin"],
                        append: "#jh-grid-form-import"
                    });

                    (function column__PADDING_LEFT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-1-2", "jh-col"],
                            append: "#jh-grid-form-import-row-2"
                        });
                        jH("#jh-grid-form-import-col-1-2").addClass('jh-col-1');
                        jH("#jh-grid-form-import-col-1-2").addClass('jh-color-1');
                    })();

                    (function column__LABEL_CHOOSE_FILE__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-3-2", "jh-col"],
                            append: "#jh-grid-form-import-row-2"
                        });
                        jH("#jh-grid-form-import-col-3-2").addClass('jh-col-3');
                        jH("#jh-grid-form-import-col-3-2").addClass('jh-color-1');
                        jH("#jh-grid-form-import-col-3-2").addClass('pad-10');
                        jH("#jh-grid-form-import-col-3-2").addClass('align-right');

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "jh-txt-color-2",
                            append: "#jh-grid-form-import-col-3-2"
                        }, 'Choose a file to import');
                    })();

                    (function column__INPUT_FILE__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-4-2", "jh-col"],
                            append: "#jh-grid-form-import-row-2"
                        });
                        jH("#jh-grid-form-import-col-4-2").addClass('jh-col-4');
                        jH("#jh-grid-form-import-col-4-2").addClass('jh-color-1');

                        $$.create({
                            element: "input",
                            attr_type: ["type", "name", "id", "class", "value"],
                            attr_name: ["file","jh-form-input-file","jh-form-input-file","jh-form-input-file",""],
                            append: "#jh-grid-form-import-col-4-2"
                        });
                    })();

                    (function column__PADDING_RIGHT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-5-2", "jh-col"],
                            append: "#jh-grid-form-import-row-2"
                        });
                        jH("#jh-grid-form-import-col-5-2").addClass('jh-col-2');
                        jH("#jh-grid-form-import-col-5-2").addClass('jh-color-1');
                    })();

                    (function line_into_line__PROGRESS_BAR_FILE__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-line-progress-bar", "jh-col"],
                            append: "#jh-grid-form-import-row-2"
                        });
                        jH("#jh-grid-form-import-line-progress-bar").addClass('jh-col-10');
                    })();

                })();

                (function line__BUTTONS__() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-grid-form-import-row-3", "jh-row-margin"],
                        append: "#jh-grid-form-import"
                    });

                    (function column__PADDING_LEFT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-1-3", "jh-col"],
                            append: "#jh-grid-form-import-row-3"
                        });
                        jH("#jh-grid-form-import-col-1-3").addClass('jh-col-05');
                        jH("#jh-grid-form-import-col-1-3").addClass('jh-color-1');
                    })();

                    (function column__BUTTON_IMPORT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-2-3", "jh-col"],
                            append: "#jh-grid-form-import-row-3"
                        });
                        jH("#jh-grid-form-import-col-2-3").addClass('jh-col-4');
                        jH("#jh-grid-form-import-col-2-3").addClass('jh-color-1');

                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-bt-import", "jh-grid-form-control"],
                            append: "#jh-grid-form-import-col-2-3"
                        });

                        $$.create({
                            element: "button",
                            attr_type: ["type", "id", "class", "title"],
                            attr_name: ["button", "jh-grid-button-import", "jh-grid-form-control", "Import"],
                            append: "#jh-grid-form-import-bt-import"
                        });

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-icon",
                            append: "#jh-grid-button-import"
                        }, "&#8613;");

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-text",
                            append: "#jh-grid-button-import"
                        }, "Import");

                    })();

                    (function column__SEPARATOR__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-3-3", "jh-col"],
                            append: "#jh-grid-form-import-row-3"
                        });
                        jH("#jh-grid-form-import-col-3-3").addClass('jh-col-1');
                        jH("#jh-grid-form-import-col-3-3").addClass('jh-color-1');
                    })();

                    (function column__BUTTON_CANCEL__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-4-3", "jh-col"],
                            append: "#jh-grid-form-import-row-3"
                        });
                        jH("#jh-grid-form-import-col-4-3").addClass('jh-col-4');
                        jH("#jh-grid-form-import-col-4-3").addClass('jh-color-1');

                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-bt-cancel", "jh-grid-form-control"],
                            append: "#jh-grid-form-import-col-4-3"
                        });

                        $$.create({
                            element: "button",
                            attr_type: ["type", "id", "class", "title"],
                            attr_name: ["reset", "jh-grid-import-cancel", "jh-grid-form-control", "Cancel"],
                            append: "#jh-grid-form-import-bt-cancel"
                        });

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-icon",
                            append: "#jh-grid-import-cancel"
                        }, "&#8613;");

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-text",
                            append: "#jh-grid-import-cancel"
                        }, "Cancel");
                    })();

                    (function column__PADDING_RIGHT__() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-form-import-col-5-3", "jh-col"],
                            append: "#jh-grid-form-import-row-3"
                        });
                        jH("#jh-grid-form-import-col-5-3").addClass('jh-col-05');
                        jH("#jh-grid-form-import-col-5-3").addClass('jh-color-1');
                    })();

                })();

            }

            function _createControl(control_name) {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-grid-"+control_name+"-control",
                    append: "#jh-grid-container-controls"
                });

                _createControlTitle(control_name);
            }

            function _createControlTitle(control_name) {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-form-"+control_name+"-container-title", "jh-row-margin"],
                    append: "#jh-grid-"+control_name+"-control"
                });

                jH("#jh-grid-form-"+control_name+"-container-title").addClass('title');

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-form-"+control_name+"-title", "jh-col"],
                    append: "#jh-grid-form-"+control_name+"-container-title"
                });

                jH("#jh-grid-form-"+control_name+"-title").addClass('jh-col-10');
                jH("#jh-grid-form-"+control_name+"-title").addClass('jh-color');

                $$.create({
                    element: "span",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-form-"+control_name+"-title-span", "jh-span-block"],
                    append: "#jh-grid-form-"+control_name+"-title"
                }, $$.ucFirst(control_name));
            }

            function _createFormControl(form_name) {

                /*Create Form Control*/
                $$.create({
                    element: "form",
                    attr_type: "id",
                    attr_name: "jh-grid-form-" + form_name,
                    append: "#jh-grid-" + form_name + "-control"
                });

                /*Create Control one by one*/
                switch (form_name) {
                    case "new":
                        _createControlsNew();
                        break;
                    case "search":
                        _createControlsSearch();
                        break;
                    case "import":
                        _createControlsImport();
                        break;
                }
            }

            function _createControls() {
                if (controls.active !== true) return;

                let _forms_ = ["new", "search", "import"];

                controls.items.forEach(function(item, index, array) {
                    if ($$.inArray(_forms_, item.name) && controls_active[item.name].state === true) {
                        _createControl(item.name);
                        _createFormControl(item.name);
                    }
                });
            }

            function _createMoreControls() {
                if (more.active !== true) return;

                $$.create({
                    element:  "h3",
                    attr_type: "id",
                    attr_name: "jh-grid-more-control-h3",
                    append: "#jh-grid-more-control"
                }, "O que fazer com os itens selecionados ?");

                $$.create({
                    element:  "ul",
                    attr_type: "id",
                    attr_name: "jh-grid-more-control-ul",
                    append: "#jh-grid-more-control"
                });

                more.items.forEach(function(item, index, array) {
                    if (more_active[item.name] === true) {
                        let _name_ = item.name;
                        let _text_ = item.text;
                        let _button_ = "bt-green";
                        let _msg_ = "Enviar para a próxima etapa";
                        let _label_ = item.label || $$.ucFirst(_name_);

                        switch (_name_) {
                            case "delete":
                                _button_ = "bt-red";
                                _msg_ = "Excluir selecionados";
                                break;
                            case "lock":
                                _button_ = "bt-orange";
                                _msg_ = "Bloquear selecionados";
                                break;
                            case "execute":
                                _msg_ = "Outros";
                                _button_ = "bt-blue";
                        }

                        $$.create({
                            element: "li",
                            attr_type: "id",
                            attr_name: "jh-grid-more-control-li-" + index,
                            append: "#jh-grid-more-control-ul"
                        });

                        $$.create({
                            element: "span",
                            attr_type: "id",
                            attr_name: "jh-grid-more-control-span-title-" + index,
                            append: "#jh-grid-more-control-li-" + index
                        }, _msg_);

                        $$.create({
                            element: "button",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-more-control-" + _name_, _button_],
                            append: "#jh-grid-more-control-li-" + index
                        }, _label_);

                        $$.create({
                            element: "span",
                            attr_type: "id",
                            attr_name: "jh-grid-more-control-span-text-" + index,
                            append: "#jh-grid-more-control-li-" + index
                        }, _text_);
                    }
                });

            }

            function _searchResults() {
                if (filter === false) return;

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-search-result-enter", "jh-grid-form-control-icon"],
                    append: "#jh-grid-controls"
                });

                $$.create({
                    element: "label",
                    attr_type: "for",
                    attr_name: "jh-grid-input-search-result",
                    append: "#jh-grid-search-result-enter"
                }, _gridExtends().icons('enter', '18', '#FFFFFF'));

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-search-result-1", "jh-grid-form-control"],
                    append: "#jh-grid-controls"
                });

                $$.create({
                    element: "input",
                    attr_type: ["type", "id", "class", "value", "placeholder"],
                    attr_name: ["text", "jh-grid-input-search-result", "jh-grid-form-control", "", "Type 3 letters or more..."],
                    append: "#jh-grid-search-result-1"
                });

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-search-result-erase", "jh-grid-form-control-icon"],
                    append: "#jh-grid-controls"
                });

                $$.create({
                    element: "label",
                    attr_type: "for",
                    attr_name: "jh-grid-input-search-result",
                    append: "#jh-grid-search-result-erase"
                }, _gridExtends().icons('eraser', '26', '#FFFFFF'));
            }

            function _createButtons(){
                if (controls.active === false) return;

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-grid-button-control", "jh-grid-button-control"],
                    append: "#jh-grid-controls"
                });

                Object.keys(controls_active).forEach(function(item, index, array) {
                    if (controls_active[item].state) {
                        $$.create({
                            element: "button",
                            attr_type: ["type", "id", "title"],
                            attr_name: ["button", "jh-grid-" + item, $$.ucFirst(item)],
                            append: "#jh-grid-button-control"
                        });

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-icon",
                            append: "#jh-grid-" + item
                        }, control_icon[item]);

                        $$.create({
                            element: "span",
                            attr_type: "class",
                            attr_name: "button-text",
                            append: "#jh-grid-" + item
                        }, $$.ucFirst(item));
                    }
                });

                if (more.active === true) {
                    $$.create({
                        element: "button",
                        attr_type: ["type", "id", "title"],
                        attr_name: ["button", "jh-grid-more", "More"],
                        append: "#jh-grid-button-control"
                    });

                    $$.create({
                        element: "span",
                        attr_type: "class",
                        attr_name: "button-icon",
                        append: "#jh-grid-more"
                    }, control_icon.more);

                    $$.create({
                        element: "span",
                        attr_type: "class",
                        attr_name: "button-text",
                        append: "#jh-grid-more"
                    }, "More");
                }
            }

            function _build() {
                _createMoreControls();
                _createControls();
                _searchResults();
                _createButtons();
            }

            return {"build": _build};
        }

        /**
         * Grid Extends Components
         */
        function _gridExtends() {

            function _sticker(_data_source_ = undefined) {
                let aux = [];
                let current = null;
                let pg = null;
                function _pg() {
                    pg = _gridExtends().progress(_data_source_.length, "Saving data...");
                }
                function _setCurrent() {
                    current = _data_source_.shift();
                    aux.push(current);
                }
                function _setCurrentRollback() {
                    current = aux.pop();
                    _data_source_.unshift(current);
                }
                function _save(resolve, reject, curr) {
                    if (controls_active.import.action.length < 3) {
                        reject("The action import need expected a Promise arguments (resolve, reject, args)");
                    } else {
                        /*Prevent Overload Server Requests*/
                        $$.await(0.5).run(function() {
                            controls_active.import.action(resolve, reject, curr);
                            });
                    }
                }
                function _first(args) {
                    if (abort_import === true) {
                        $$.log("The import process was aborted by user").print("silver");
                        _rollback();
                        return true;
                    }

                    if (_data_source_.length === 0) {
                        pg.update();
                        pg.close();
                        _gridExtends().toaster({
                            type: "success",
                            text: "Data saving is finished !",
                            timeout: 3000
                        });
                        _gridExtends().sticker().close();
                        $$.await(3).run(_gridRenderize().reload);
                    } else {
                        _setCurrent();
                        pg.update();

                        $$.promise({timeout: 60, debug: false})
                            .run(_save, current)
                            .then([_first, _success, _error]);
                    }
                    return false;
                }
                function _success(rollback) {
                    if (rollback !== true) {
                        $$.log("SUCCESS Data Saving").print("cyan");
                    }
                }
                function _error(rollback) {
                    if (rollback !== true) {
                        _first();
                        $$.log("EXCEPTION Data Saving").print("orange");
                    }
                }
                function _cancel(resolve, reject, curr) {
                    if (controls_active.import.rollback.length < 3) {
                        reject("The rollback import need expected a Promise arguments (resolve, reject, args)");
                    } else {
                        /*Prevent Overload Server Requests*/
                        $$.await(0.5).run(function() {
                            controls_active.import.rollback(resolve, reject, curr);
                        });
                    }
                }
                function _firstRollback(args) {
                    if (aux.length === 0) {
                        pg.close();
                        _gridExtends().toaster({
                            type: "info",
                            text: "Rollback is finished !",
                            timeout: 3000
                        });
                    } else {
                        _setCurrentRollback();
                        pg.down();

                        $$.promise({timeout: 60, debug: false})
                            .run(_cancel, current)
                            .then([_firstRollback, _successRollback, _errorRollback]);
                    }
                    return args;
                }
                function _successRollback(args) {
                    $$.log("SUCCESS Rollback").print("yellowgreen");
                }
                function _errorRollback(args) {
                    _firstRollback();
                    $$.log("EXCEPTION Rollback").print("orange");
                }
                function _rollback() {
                    pg.patch("Rollback is running...");
                    $$.promise({timeout: 60, debug: false})
                        .run(_cancel, current)
                        .then([_firstRollback, _successRollback, _errorRollback]);
                }
                function _open() {
                    $$.sticker({
                        theme: theme,
                        lang: lang,
                        type: "confirm",
                        target: "body",
                        text: "Deseja gravar as informações no banco de dados ?" +
                            "<br />" +
                            "<small>Você ainda poderá executar esta ação posteriormente, " +
                            "basta passar o mouse sobre o icone de ajuda desse mensageiro</small>",
                        action: function() {
                            if (_data_source_.length === 0) {
                                _gridExtends().alert("Data already saved !");
                                return;
                            }

                            abort_import = false;

                            _pg();
                            _hide();
                            _setCurrent();

                            $$.promise({timeout: 60, debug: false})
                                .run(_save, current)
                                .then([_first, _success, _error]);
                        }
                    }).run();
                }
                function _close() {
                    $$.sticker().close();
                }
                function _hide() {
                    $$.sticker().hide();
                }

                return {"open": _open, "close": _close, "hide": _hide};
            }

            function _progress(steps, text) {
                return (
                    $$.progress({
                        target: "body",
                        steps: steps,
                        draggable: true,
                        text: text,
                        abort: {
                            active: true,
                            action: function() {
                                abort_import = true;
                            }
                        }
                    }).run());
            }

            function _raterPlug(target, item_ratings) {
                $$.raterPlug({
                    theme: theme,
                    lang: lang,
                    target: target,
                    stars_size: $$.repeat(rating.star_size, 3).asArray(),
                    stars_color: rating.star_color || "#FAC917",
                    data: item_ratings,
                    action: rating.action,
                    rate: rating.allow_rate || false
                }).run();
            }

            function _loading() {
                function _start() {
                    $$.loading({
                        text: "Grid is loading...",
                        target: target,
                        theme: theme,
                        lang: lang,
                        size: "contain"
                    }).start();
                }
                function _finish(force = false) {
                    if (force === true) {
                        $$.loading({
                            target: target
                        }).finish();
                        clearInterval(loading_control);
                        clearInterval(turtle_control);
                        loading_count = 0;
                        return;
                    }

                    if (_gridInfo().isLoaded()) {
                        clearInterval(loading_control);
                        clearInterval(turtle_control);
                        loading_count = 0;
                        $$.loading({
                            target: target
                        }).finish();
                    } else if (_gridInfo().notFound()) {
                        clearInterval(loading_control);
                        clearInterval(turtle_control);
                    }

                    loading_count += 1;
                }
                return {"start": _start, "finish": _finish};
            }

            function _exceptBox(msg) {
                $$.exceptBox(msg, debug);
            }

            function _alert(message) {
                $$.alert(message);
            }

            function _confirm(params) {
                $$.confirm({
                    title: params.title,
                    question: params.question,
                    theme: theme,
                    buttons: ["Yes", "No"]
                }, function() {
                    params.action(params.args || undefined);
                });
            }

            function _viewer(item) {
                $$.viewer({
                    type: "html",
                    html: item
                });
            }

            function _toaster(args) {
                $$.toaster(args);
            }

            function _file() {
                function _getFile() {
                    return (
                        $$.file({
                            target: "#jh-form-input-file"
                        }).getFile());
                }

                function _downloadFile(blob_part, type) {
                    $$.file({
                        export: {
                            active: true,
                            target: "#jh-box-container-data-export",
                            content: blob_part,
                            type: type,
                            automatic: true,
                            remove: true
                        }
                    }).download();
                }

                return {
                    "getFile": _getFile,
                    "downloadFile": _downloadFile
                };
            }

            function _editor(_fields_, _swap_) {
                $$.editor({
                    type: "table",
                    target: "#jh-grid-container-content",
                    fields: _fields_,
                    values: _swap_,
                    theme: theme,
                    lang: lang,
                    callback: function (args) {
                        _gridActions().edit(args);
                    }
                });
            }

            function _icons(icon, size, color, data = undefined) {
                return $$.icons({
                    icon: icon,
                    size: "s-"+size,
                    data: data,
                    color: "#"+color.replace("#", "")
                }).draw();
            }

            function _smartPager() {

                function _run() {
                    if (paginate.active === true) {
                        pager_monitor = setInterval(function() {
                            _gridExtends().smartPager().monitor();
                        }, 1000);
                    }
                }

                function _monitor() {
                    if (_gridInfo().isLoaded()) {
                        clearInterval(pager_monitor);
                        _gridExtends().smartPager().build();
                    } else if (_gridInfo().notFound()) {
                        clearInterval(pager_monitor);
                    }
                }

                function _build() {
                    $$.smartPager({
                        theme: theme, /*default, dark, light, modern, discreet*/
                        lang: lang,
                        target: '#jh-grid-paginate',
                        pager_info: true,
                        //total_items: (original_data_len > data_len) ? original_data_len : data_len, /*total items*/
                        total_items: paginate.total_items,
                        page: paginate.page, /*current page*/
                        items_show: paginate.items_show,
                        max_pager: paginate.max_pager,
                        jumper: paginate.jumper,
                        jumper_fix: paginate.jumper_fix,
                        use_button: true, /*true, false*/
                    }).callback(function (pag) {
                        on_paginate = true;
                        _gridLoading().start();
                        _gridExtends().smartPager().page(pag);/*Get current item[page]*/
                        _gridLoading().monitor(false);
                    });
                }

                function _page(new_page) {
                    paginate.page = new_page;
                    if (process_type !== "query_paginate") {
                        process_type = "renderize";/*Only renderize*/
                    } else {
                        query_paginate.params.page = new_page;
                    }
                    _gridPrepare().bodyDraw();
                    _gridPrepare().pagerDraw();
                    _gridEvents().activeEventsGridItems().monitor();
                }

                function _import() {
                    process_type = "renderize";/*Only renderize*/
                    paginate.items_show = 20;
                    paginate.page = 1;
                    paginate.max_pager = Math.ceil(paginate.total_items/paginate.items_show);
                    if (paginate.max_pager > 20) paginate.max_pager = 20;
                    _gridExtends().smartPager().build();
                    _gridEvents().activeEventsGridItems().monitor();
                }

                return {
                    "run": _run,
                    "monitor": _monitor,
                    "build": _build,
                    "page": _page,
                    "import": _import
                };
            }

            function _box(box_id) {
                function _open(title) {
                    $$.box({
                        box_id: box_id,
                        size: "small",
                        title: title,
                        border: false,
                        target: "body",
                        theme: theme,
                        lang: lang
                    }).open();
                }
                function _close() {
                    $$.box({
                        box_id: box_id,
                    }).close();
                }
                return {
                    "open": _open,
                    "close": _close
                };
            }

            function _slideIn(origin, size = "small", position = "fixed") {
                function _run() {
                    $$.slideIn({
                        theme: theme,
                        lang: lang,
                        target: "#jh-grid-container",
                        identify: "#jh-grid-more-control",
                        origin: origin, /*top, right, bottom, left*/
                        position: position, /*relative, absolute, fixed*/
                        size: size /*small, medium, large, full*/
                    }).run();
                }
                function _show() {
                    $$.slideIn({
                        theme: theme,
                        lang: lang,
                        target: "#jh-grid-container",
                        identify: "#jh-grid-more-control",
                        origin: origin, /*top, right, bottom, left*/
                        position: position, /*relative, absolute, fixed*/
                        size: size /*small, medium, large, full*/
                    }).show();
                }

                function _hide() {
                    $$.slideIn({
                        theme: theme,
                        lang: lang,
                        target: "#jh-grid-container",
                        identify: "#jh-grid-more-control",
                        origin: origin, /*top, right, bottom, left*/
                        position: position, /*relative, absolute, fixed*/
                        size: size /*small, medium, large, full*/
                    }).hide();
                }

                function _toggle() {
                    $$.slideIn({
                        theme: theme,
                        lang: lang,
                        target: "#jh-grid-container",
                        identify: "#jh-grid-more-control",
                        origin: origin, /*top, right, bottom, left*/
                        position: position, /*relative, absolute, fixed*/
                        size: size /*small, medium, large, full*/
                    }).toggle();
                }
                return {
                    "run": _run,
                    "show": _show,
                    "hide": _hide,
                    "toggle": _toggle,
                };
            }

            return {
                "sticker": _sticker,
                "progress": _progress,
                "rater": _raterPlug,
                "except": _exceptBox,
                "loading": _loading,
                "alert": _alert,
                "confirm": _confirm,
                "viewer": _viewer,
                "toaster": _toaster,
                "file": _file,
                "editor": _editor,
                "icons": _icons,
                "smartPager": _smartPager,
                "box": _box,
                "slideIn": _slideIn
            };
        }

        /**
         * Grid Adjusts and Fix
         */
        function _gridUltimate() {

            /*Grid Sizer Adjust*/
            function _sizer() {
                //TODO: Ajustar tamanho final do componente de acordo com elemento target
            }

            /*Grid Language Tradutor*/
            function _tradutor() {

            }

            return {"sizer": _sizer, "tradutor": _tradutor};
        }

        /**
         * Grid Finish Process
         */
        function _gridEvents() {

            function _run() {
                (function _activeAllEvents() {
                    process_monitor = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(process_monitor);
                            _gridEvents().activeAll();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(process_monitor);
                        }
                    }, 1000);
                })();
            }

            function _activeAllEvents() {
                if (grid_lines_count < paginate.items_show) return;
                _activeGenericEvents().now();
                _activeControlsHeader().now();
                _activeFormControls().now();
                _activeMoreControls().now();
                _activeEventsOrdering().now();
                _activeEventsGridItems().now();
            }

            function _activeGenericEvents() {
                function _runNow() {
                    (function eventGeneric__BT_X_HIDE_CONTROLS__() {
                        if (controls.active !== true) return;
                        /*This is a close icon on the top right grid screen*/
                        jH("#jh-grid-container-controls-close").on('click', function () {
                            jH("#jh-grid-container-controls").hide();
                        });
                    })();
                }

                function _monitor() {
                    let _ev_monitor_ = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(_ev_monitor_);
                            _runNow();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(_ev_monitor_);
                        }
                    }, 1000);
                }

                function _now() {
                    _runNow();
                }

                return {"monitor": _monitor, "now": _now};
            }

            function _activeControlsHeader() {

                function _dataGridExport() {

                    function _boxClose() {
                        _gridExtends().box("data-export").close();
                    }

                    (function createBox() {
                        _gridExtends().box("data-export").open("Data Export");
                    })();

                    (function createBoxContent() {

                        $$.create({
                            element: "p",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-message", "simple-paragraph"],
                            append: "#jh-box-container-data-export"
                        }, "Choose an option below to data export grid...");

                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-bts", "jh-grid-data-export-bts"],
                            append: "#jh-box-container-data-export"
                        });

                        $$.create({
                            element: "button",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-bt-current", "simulate-button-green"],
                            append: "#jh-grid-data-export-bts"
                        }, "Current View");

                        $$.create({
                            element: "button",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-bt-all", "simulate-button-red"],
                            append: "#jh-grid-data-export-bts"
                        }, "All Data");

                        $$.create({
                            element: "button",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-bt-cancel", "simulate-button-silverlight"],
                            append: "#jh-grid-data-export-bts"
                        }, "Cancel");

                        /*minutes*/
                        let data_count = global_data.length;
                        if (process_type === 'query_paginate') {
                            data_count = paginate.total_items;
                        }
                        let estimated_time = Math.ceil((((data_count * 10) / 1000) / 60));
                        let warning_msg = "Note! The [All Data] option may take a long time to finish, " +
                            "<strong>estimated time:</strong> "+estimated_time+" minute(s) !";

                        $$.create({
                            element: "p",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-grid-data-export-warning-text", "warning-paragraph"],
                            append: "#jh-box-container-data-export"
                        }, warning_msg);
                    })();

                    (function activeExportButtons() {
                        let current = null;
                        let pg = null;
                        let grid_row = [];
                        let grid_rows = [];
                        let aux = [];

                        /*Remove action and checkbox column if is activated*/
                        let start_pos = 0;
                        if (actions.active === true) start_pos++;
                        if (checkbox === true) start_pos++;

                        jH('#jh-grid-data-export-bt-current').on('click', function() {

                            _gridInfo().fields();
                            _gridInfo().lines();
                            _boxClose();

                            /*Getting columns grid*/
                            grid_fields.forEach(function(item, index, array) {
                                if (index >= start_pos) {
                                    grid_row.push(
                                        $$.trim($$.htmlClear(item.textContent))
                                            .replace(" ⇅", "")
                                            .toUpperCase()
                                    );
                                }
                            });
                            grid_rows.push(grid_row.join(";"));

                            /*Getting data grid*/
                            grid_lines.forEach(function(item, index, array) {
                                grid_row = [];
                                for (let i = start_pos; i < item.childNodes.length; i++) {
                                    grid_row.push(
                                        $$.trim($$.htmlClear(item.childNodes[i].textContent))
                                    );
                                }
                                grid_rows.push(grid_row.join(";"));
                            });
                            grid_rows = grid_rows.join("\n");

                            /*Create CSV File - Blob*/
                            _gridExtends().file().downloadFile(grid_rows, "csv");
                        });

                        jH('#jh-grid-data-export-bt-all').on('click', function() {
                            _gridExtends().confirm({
                                title: "Warning",
                                question: "Are you sure you want to export all grid records ?",
                                action: async function () {
                                    _boxClose();

                                    function _setHeaderExport() {
                                        for (let j = 0; j < columns.length; j++) {
                                            grid_row.push((columns[j].name).toUpperCase());
                                        }
                                        grid_rows.push(grid_row.join(";"));
                                    }

                                    function _setCurrent() {
                                        current = aux.shift();
                                    }

                                    /*Get Data*/
                                    function _rowProcess(resolve, reject, curr) {
                                        grid_row = [];

                                        for (let j = 0; j < columns.length; j++) {
                                            grid_row.push(curr[columns[j].name]);
                                        }

                                        resolve(grid_row);
                                    }

                                    function _export(resolve, reject, curr) {
                                        /*Prevent Overload Process*/
                                        $$.await(0.01).run(function () {
                                            _rowProcess(resolve, reject, curr);
                                        });
                                    }

                                    function _finalize(grid_row) {

                                        if (abort_import === true) {
                                            _gridExtends().toaster({
                                                type: "warning",
                                                text: "The export process was aborted by user !",
                                                timeout: 3000
                                            });
                                            $$.await(2).run(function () {
                                                pg.close();
                                            });
                                            return false;
                                        }

                                        grid_rows.push(grid_row.join(";"));

                                        if (aux.length === 0) {
                                            pg.update();
                                            pg.close();
                                            _gridExtends().toaster({
                                                type: "success",
                                                text: "Data Export Finished !",
                                                timeout: 3000
                                            });

                                            grid_rows = grid_rows.join("\n");

                                            /*Create CSV File - Blob*/
                                            _gridExtends().file().downloadFile(grid_rows, "csv");

                                        } else {

                                            _setCurrent();
                                            pg.update();

                                            $$.promise({timeout: 60, debug: false})
                                                .run(_export, current)
                                                .then([_finalize]);
                                        }
                                    }

                                    function _dispatch(data) {
                                        pg = _gridExtends().progress(data.length, "Data Exporting...");
                                        aux = data;
                                        _setHeaderExport();
                                        _setCurrent();

                                        $$.promise({timeout: 60, debug: false})
                                            .run(_export, current)
                                            .then([_finalize]);
                                    }

                                    /*Copy data from original array - prevent bug*/
                                    if (process_type === 'query_paginate') {
                                        _gridRenderize().query_export(_dispatch);
                                    } else {
                                        _dispatch(global_data);
                                    }
                                }
                            });
                        });

                        jH("#jh-grid-data-export-bt-cancel").on('click', function() {
                            _boxClose();
                        });

                    })();

                }

                function _runNow() {
                    (function eventFilter__SEARCH_RESULT__() {
                        if (filter === false) return;
                        jH("#jh-grid-input-search-result").on('keyup', function (e) {
                            if ($$.inArray(accepted_keys_code, e.keyCode)) {
                                _gridHandler().reset();
                            }
                            if ($$.inArray(accepted_keys_code, e.keyCode) && $$this.value.length >= 3) {
                                _gridHandler().filter($$this.value);
                            }
                        });

                        jH("#jh-grid-search-result-erase").on('click', function (e) {
                            jH("#jh-grid-input-search-result").val("");
                            _gridHandler().reset();
                        });
                    })();

                    (function eventNew__OPEN_CLOSE_MENU__() {
                        if (controls_active.new.state !== true) return;

                        jH("#jh-grid-new").on('click', function () {
                            _gridHandler().toggle('new');
                        });
                        jH("#jh-grid-new-cancel").on('click', function () {
                            jH('#jh-grid-form-new').reset();
                            jH('#jh-grid-new-control').toggle();
                            jH('#jh-grid-container-controls').toggle();
                        });
                    })();

                    (function eventSearch__OPEN_CLOSE_MENU__() {
                        if (controls_active.search.state !== true) return;

                        jH("#jh-grid-search").on('click', function () {
                            _gridHandler().toggle('search');
                        });
                        jH("#jh-grid-search-cancel").on('click', function () {
                            jH('#jh-grid-form-search').reset();
                            jH('#jh-grid-search-control').toggle();
                            jH('#jh-grid-container-controls').toggle();
                        });
                    })();

                    (function eventImport__OPEN_CLOSE_MENU__() {
                        if (controls_active.import.state !== true) return;

                        jH("#jh-grid-import").on('click', function () {
                            _gridHandler().toggle('import');
                            _gridExtends().sticker().hide();
                            jH("#jh-grid-form-import").reset();
                        });
                        jH("#jh-grid-import-cancel").on('click', function () {
                            jH('#jh-grid-form-import').reset();
                            jH('#jh-grid-import-control').toggle();
                            jH('#jh-grid-container-controls').toggle();
                        });
                    })();

                    (function eventExport__EXPORT_DATA_GRID__() {
                        if (controls_active.export.state === false) return;
                        jH("#jh-grid-export").on('click', function () {
                            _gridHandler().toggle('export');
                            _dataGridExport();
                        });
                    })();

                    (function eventReload__GRID_RELOAD__() {
                        if (controls_active.reload.state === false) return;
                        jH("#jh-grid-reload").on('click', function () {
                            _gridRenderize().reload();
                        });
                    })();

                    (function eventPrevious__PREVIOUS_PAGE__() {
                        if (controls_active.previous.state === false) return;
                        jH("#jh-grid-previous").on('click', function () {
                            $$.exec(controls_active.previous.action);
                        });
                    })();

                    (function eventNext__NEXT_PAGE__() {
                        if (controls_active.next.state === false) return;
                        jH("#jh-grid-next").on('click', function () {
                            $$.exec(controls_active.next.action);
                        });
                    })();
                }

                function _monitor() {
                    let _ev_monitor_ = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(_ev_monitor_);
                            _runNow();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(_ev_monitor_);
                        }
                    }, 1000);
                }

                function _now() {
                    _runNow();
                }

                return {"monitor": _monitor, "now": _now};
            }

            function _activeFormControls() {

                function _runNow() {
                    function _validateForm(form_name, form_data) {
                        let valid = true;
                        (function validNewForm() {
                            if (form_name !== "new") return;
                            columns.forEach(function (item, index, array) {
                                if ($$.has(item.name).in(form_data) && item.required === true && form_data[item.name] === "") {
                                    valid = false;
                                    jH("#" + item.name).css({
                                        styles: {
                                            border: "solid #DB0000 1px",
                                            back_color: "#FFFCE4"
                                        }
                                    });
                                    jH("#" + item.name).on('keypress', function () {
                                        jH("#" + item.name).css({
                                            styles: {
                                                border: "solid #CECECE 1px",
                                                back_color: "#FFFFFF"
                                            }
                                        });
                                    });
                                }
                            });
                        })();

                        (function validSearchForm() {
                            if (form_name !== "search") return;
                            if (
                                form_data["jh-grid-input-search"] === "" ||
                                form_data["jh-grid-select-max-pagers"] === "" ||
                                form_data["jh-grid-select-search-by"] === "" ||
                                form_data["jh-grid-select-show-items"] === ""
                            ) {
                                valid = false;
                            }
                        })();

                        (function validImportForm() {
                            if (form_name !== "import") return;

                            /*Prevent Bug Runtime*/
                            let filename = jH("#jh-form-input-file").val() || "_.xyz";
                            let ext = $$.explode(filename).by(".").get(1);

                            if (filename === "_.xyz" || ext !== "csv") {
                                valid = false;
                                jH("#jh-form-input-file").css({
                                    styles: {
                                        border: "solid #DB0000 1px",
                                        back_color: "#FFFCE4"
                                    }
                                });
                                jH("#jh-form-input-file").on('change', function () {
                                    jH("#jh-form-input-file").css({
                                        styles: {
                                            border: "solid #CECECE 1px",
                                            back_color: "#FFFFFF"
                                        }
                                    });
                                });
                            }
                        })();

                        return valid;
                    }

                    function _itemAdd(resolve, reject, data_item) {
                        if (controls_active.new.action.length < 3) {
                            reject("The action new need expected a Promise arguments (resolve, reject, args)");
                        } else {
                            controls_active.new.action(resolve, reject, data_item);
                        }
                    }

                    function _itemResolve(arg) {
                        _gridExtends().toaster({
                            type: "success",
                            text: "Item added successfully !",
                            timeout: 3000
                        });

                        (function eventNew__FORM_CLOSE__() {
                            jH('#jh-grid-form-new').reset();
                            jH('#jh-grid-new-control').toggle();
                            jH('#jh-grid-container-controls').toggle();
                            jH("#jh-grid-form-new-send-span-2").html("Save");

                            _gridRenderize().reload();
                        })();
                    }

                    function _itemReject(arg) {
                        _gridExtends().toaster({
                            type: "error",
                            text: "Occurs an error: " + arg.message || undefined,
                            timeout: 3000
                        });
                        jH("#jh-grid-form-new-send-span-2").html("Save");
                    }

                    function _loadImport(file_source = []) {
                        if (!$$.is(file_source).file()) {
                            _gridExtends().alert({
                                title: "Application Error",
                                text: "Invalid data type [Expect: File]"
                            });
                            return false;
                        }

                        $$.csvMap({
                            data: file_source, /*file*/
                            delimit: ";",
                            format: "collection"
                        }).run(function (_csv_map_) {
                            if (columns.length !== $$.length(_csv_map_[0])) {
                                _gridExtends().alert({
                                    title: "Application Error",
                                    text: "Invalid columns quantity to data import."
                                });
                                return false;
                            }

                            _gridHandler().clear(true);

                            (function gridHeader() {
                                _gridPrepare().headerDraw();
                            })();

                            (function gridBody() {
                                global_data = _csv_map_;
                                _gridRenderize().import(function () {
                                    (function eventImport__FORM_CLOSE__() {
                                        $$.await(0.5).run(function() {
                                            jH('#jh-grid-import-control').toggle();
                                            jH('#jh-grid-container-controls').toggle();
                                        });
                                    })();
                                });
                            })();
                        });
                    }

                    (function eventNew__FORM_SUBMIT__() {
                        if (controls_active.new.state !== true) return;

                        jH("#jh-grid-new-send").on('click', function () {
                            let form_data = $$.form('#jh-grid-form-new').json();
                            if (_validateForm("new", form_data) !== true) {
                                _gridExtends().toaster({
                                    type: "error",
                                    text: "Please enter all required fields !",
                                    timeout: 3000
                                });
                                return;
                            }

                            _gridExtends().confirm({
                                title: "Warning",
                                question: "Are you sure you want to create the item ?",
                                action: function () {
                                    if ($$.is(controls_active.new.action).function()) {

                                        jH("#jh-grid-form-new-send-span-2")
                                            .html(_gridExtends().icons('loading', '24', '#FFFFFF'));

                                        $$.promise({timeout: 60, debug: false})
                                            .run(_itemAdd, form_data)
                                            .then([_itemResolve, _itemReject]);

                                    } else if ($$.is(controls_active.new.action).url()) {
                                        jH("#jh-grid-form-new").attr("target", "_blank");
                                        jH("#jh-grid-form-new").attr("action", controls_active.new.action);
                                        jH("#jh-grid-form-new").submit();

                                        (function eventNew__FORM_CLOSE__() {
                                            $$.await(0.5).run(function() {
                                                jH('#jh-grid-form-new').reset();
                                                jH('#jh-grid-new-control').toggle();
                                                jH('#jh-grid-container-controls').toggle();
                                            });
                                        })();
                                    }
                                }
                            });
                        });
                    })();

                    (function eventSearch__FORM_SUBMIT__() {
                        if (controls_active.search.state !== true) return;

                        jH("#jh-grid-search-send").on('click', function () {
                            let form_data = $$.form('#jh-grid-form-search').json();
                            if (_validateForm("search", form_data) !== true) {
                                _gridExtends().toaster({
                                    type: "error",
                                    text: "Please enter the fields correctly !",
                                    timeout: 3000
                                });
                                return;
                            }

                            if (process_type === 'query_paginate' || on_paginate === true) {
                                save_original_param.push([
                                    jH("#jh-grid-select-search-by").val(),
                                    query_paginate.params[jH("#jh-grid-select-search-by").val()]
                                ]);
                                query_paginate.params[jH("#jh-grid-select-search-by").val()] = jH("#jh-grid-input-search").val();
                                _gridRenderize().search();
                            } else if (process_type === 'query_renderize' || on_paginate === true) {
                                save_original_param.push([
                                    jH("#jh-grid-select-search-by").val(),
                                    query_renderize.params[jH("#jh-grid-select-search-by").val()]
                                ]);
                                query_renderize.params[jH("#jh-grid-select-search-by").val()] = jH("#jh-grid-input-search").val();
                                _gridRenderize().search();
                            } else if (process_type === 'renderize') {
                                if ($$.is(controls_active.search.action).function()) {
                                    controls_active.search.action(form_data);
                                }
                            }

                            (function eventSearch__FORM_CLOSE__() {
                                $$.await(0.5).run(function() {
                                    jH('#jh-grid-form-search').reset();
                                    jH('#jh-grid-search-control').toggle();
                                    jH('#jh-grid-container-controls').toggle();
                                });
                            })();
                        });
                    })();

                    (function eventImport__FORM_SUBMIT__() {
                        if (controls_active.import.state !== true) return;

                        jH("#jh-grid-button-import").on('click', function () {
                            if (_validateForm("import", null) !== true) {
                                _gridExtends().toaster({
                                    type: "error",
                                    text: "Please select a file correctly !",
                                    timeout: 3000
                                });
                                return;
                            }

                            (function importDataFromCSV() {
                                /*Get a file from the input source*/
                                let _f_ = _gridExtends().file().getFile();
                                _loadImport(_f_);
                            })();
                        });
                    })();
                }

                function _monitor() {
                    let _ev_monitor_ = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(_ev_monitor_);
                            _runNow();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(_ev_monitor_);
                        }
                    }, 1000);
                }

                function _now() {
                    _runNow();
                }

                return {"monitor": _monitor, "now": _now};
            }

            function _activeMoreControls() {

                function _runNow() {
                    (function eventMore__OPEN_CLOSE_MORE__() {
                        if (more.active === false) return;

                        jH("#jh-grid-more").on('click', function () {
                            _gridHandler().toggle();
                            _gridExtends().slideIn("right").toggle();
                        });

                        more.items.forEach(function (it, id, ar) {
                            let _name_item_ = it.name;
                            let _fn_ = it.action;
                            /*Active only more controls defined in grid parameters*/
                            if (more_active[_name_item_] === true) {
                                if ($$.is(_fn_).function()) {
                                    jH("#jh-grid-more-control-" + _name_item_).on('click', function (e) {
                                        if (_gridInfo().checked() <= 0) {
                                            _gridExtends().alert("Please Select one or more items !");
                                        } else {
                                            _gridExtends().confirm({
                                                title: "Warning",
                                                question: "Are you sure you want to execute this operation ?",
                                                action: function () {
                                                    _gridLoading().start();
                                                    _gridExtends().slideIn("right").hide();
                                                    _fn_(_gridInfo().itemsChecked());
                                                    _gridLoading().turtle();
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    })();
                }

                function _monitor() {
                    let _ev_monitor_ = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(_ev_monitor_);
                            _runNow();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(_ev_monitor_);
                        }
                    }, 1000);
                }

                function _now() {
                    _runNow();
                }

                return {"monitor": _monitor, "now": _now};
            }

            function _activeEventsOrdering() {

                function _now() {
                    if (ordering === false) return;
                    jH('[data-jh-grid-sort-by]', {rsp: 'data'}).on('click', function (col) {
                        /*toggle dataset value*/
                        if ($$this.dataset.jhGridSortBy === 'asc') {
                            $$this.dataset.jhGridSortBy = 'desc';
                        } else {
                            $$this.dataset.jhGridSortBy = 'asc';
                        }
                        _gridHandler().order($$this.dataset.jhGridSortBy, col);
                    });
                }

                return {"now": _now};
            }

            function _activeEventsGridItems() {

                function _runNow() {

                    (function eventUpdateAction() {
                        if (actions_active.update.state === false) return;
                        jH('[data-jh-grid-action-update]').on('click', function (ev) {
                            let _item_ = jH('#jh-grid-line-' + $$this.dataset.content).select();
                            let _array_ = $$.htmlToArray(_item_);
                            let _swap_ = [];
                            let _fields_ = [];

                            for (let i = 2; i <= _array_.length - 2; i++) {
                                _swap_.push(_array_[i]);
                            }

                            for (let k = 0; k < columns.length; k++) {
                                _fields_.push(columns[k].name);
                            }

                            _gridExtends().editor(_fields_, _swap_);
                        });
                    })();

                    (function eventRemoveAction() {
                        if (actions_active.delete.state === false) return;
                        jH('[data-jh-grid-action-delete]').on('click', function (ev) {
                            _gridExtends().confirm({
                                title: "Warning",
                                question: "Are you sure that you want remove this item ?",
                                action: function(id) {
                                    _gridActions().delete(id);
                                },
                                args: $$this.value
                            });
                        });
                    })();

                    (function eventViewAction() {
                        if (actions_active.read.state === false) return;
                        jH('[data-jh-grid-action-read]').on('click', function (ev) {
                            let _item_ = jH('#jh-grid-line-' + $$this.dataset.content).select();
                            let _array_ = $$.htmlToArray(_item_);
                            let _swap_ = [];
                            let _fields_ = [];
                            let _html_ = "";

                            for (let i = 2; i <= _array_.length - 2; i++) {
                                _swap_.push(_array_[i]);
                            }

                            for (let k = 0; k < columns.length; k++) {
                                _fields_.push(columns[k].name);
                            }

                            for (let j = 0; j < _fields_.length; j++) {
                                _html_ += "<div class='jh-viewer-item-container'>";
                                _html_ += "<div class='jh-viewer-item-name'>" + _fields_[j] + "</div>";
                                _html_ += "<div class='jh-viewer-item-value'>" + _swap_[j] + "</div>";
                                _html_ += "</div>";
                            }

                            _gridActions().view(_html_, $$this.value);
                        });
                    })();

                    (function eventLinks() {
                        if (links.active !== true) return;

                        links_fn_col.forEach(function(item, index, array) {
                            jH("[data-jh-grid-link-index-"+item+"]").on('click', function (ev) {
                                links_active[item][0]({
                                    grid_index: $$this.dataset["jhGridLinkIndex-"+item],
                                    item_name: $$this.textContent,
                                    item_id: $$this.dataset["jhGridLinkItemId-"+item],
                                    element_id: $$this.id,
                                    value: $$this.value || undefined
                                });
                            });
                        });
                    })();

                    (function eventCheckAll() {
                        if (checkbox_active.check_all === false) return;
                        jH("#jh-grid-checkbox-all").on('click', function () {
                            jH('.jh-grid-checkbox-items').attr('checked', true);
                            jH("#jh-grid-checkbox-all").display('none');
                            jH("#jh-grid-uncheck-all").display('block');
                            jH('[data-jh-grid-line]').addClass('jh-grid-line-checked');
                        });
                    })();

                    (function eventUncheckAll() {
                        if (checkbox_active.check_all === false) return;
                        jH("#jh-grid-uncheck-all").on('click', function () {
                            jH('.jh-grid-checkbox-items').attr('checked', false);
                            jH("#jh-grid-checkbox-all").display('block');
                            jH("#jh-grid-uncheck-all").display('none');
                            jH('[data-jh-grid-line]').removeClass('jh-grid-line-checked');
                        });
                    })();

                    (function eventCheckOne() {
                        if (checkbox_active.check_one === false) return;
                        jH('.jh-grid-checkbox-items').check('click', function (e) {
                            let _item_ = jH('#jh-grid-line-' + $$this.dataset.content).select();
                            if ($$.matchClass(_item_, 'jh-grid-line-checked')) {
                                jH('#jh-grid-line-' + $$this.dataset.content).removeClass('jh-grid-line-checked');
                            } else {
                                jH('#jh-grid-line-' + $$this.dataset.content).addClass('jh-grid-line-checked');
                            }
                        });
                    })();
                }

                function _monitor() {
                    let _ev_monitor_ = setInterval(function() {
                        if (_gridInfo().isLoaded()) {
                            clearInterval(_ev_monitor_);
                            _runNow();
                        } else if (_gridInfo().notFound()) {
                            clearInterval(_ev_monitor_);
                        }
                    }, 1000);
                }

                function _now() {
                    _runNow();
                }

                return {"monitor": _monitor, "now": _now};

            }

            return {
                "run": _run,
                "activeAll": _activeAllEvents,
                "activeControlsHeader": _activeControlsHeader,
                "activeFormControls": _activeFormControls,
                "activeMoreControls": _activeMoreControls,
                "activeEventsGridItems": _activeEventsGridItems
            };
        }

        /**
         * Grid Run
         */
        function _run(callback) {

            _gridHandler().clear();

            try {
                if (_gridInfo().checkin()) {

                    _gridLoading().run();
                    _gridInfo().events();
                    _gridStructure().build();
                    _gridPrepare().headerDraw();
                    _gridPrepare().bodyDraw();
                    _gridPrepare().pagerDraw();
                    _gridControls().build();
                    _gridEvents().run();

                    if ($$.is(callback).function()) {
                        callback({
                            "reload": _gridRenderize().reload
                        });
                    }
                }
            } catch (er) {
                $$.log("grid() error => " + er).except();
            }
        }

        return {"run": _run};
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
