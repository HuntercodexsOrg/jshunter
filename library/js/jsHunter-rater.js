/*
*
* Project: jsHunter Rater For UI
* Initial Date: 2019-11-01
* License: MIT
* Description: This is a free source code, please use of the anyway better possible.
*
* This library should be used together with jsHunter and jsHunter-ui.css !
*
*/

;(function(){

    /*
     --------------------------------------------------------------------------------
     - INITIALIZER OF RATER EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in rater extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /**[THEME]
     * @description Rater Plug, create a component to rating data information
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: File Handler Methods)
     * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
     */
    jsHunter.prototype.raterPlug = function(params) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "";
        let background = ($$.has('background').in(params)) ? params.background : null;
        let effect = ($$.has('effect').in(params)) ? params.effect : "none";
        let shadow = ($$.has('shadow').in(params)) ? params.shadow : false;
        let target = ($$.has('target').in(params)) ? params.target : "";
        let size = ($$.has('size').in(params)) ? params.size : "small";
        let preview = ($$.has('preview').in(params)) ? params.preview : null;
        let result = ($$.has('result').in(params)) ? params.result : false;
        let ratings = ($$.has('ratings').in(params)) ? params.ratings : false;
        let rate = ($$.has('rate').in(params)) ? params.rate : false;
        let stars_size = ($$.has('stars_size').in(params)) ? params.stars_size : [18, 32, 48];
        let stars_color = ($$.has('stars_color').in(params)) ? params.stars_color : "#FAC917";
        let data = ($$.has('data').in(params)) ? params.data : [];
        let action = ($$.has('action').in(params)) ? params.action : "";
        let mode = ($$.has('mode').in(params)) ? params.mode : "view";

        /**
         * Global Settings
         */
        let half_star = false;
        let loader_is_done = false;
        let item_is_processing = false;
        let qty_items_from_params = 0;
        let counter = 0;
        let max_stars = 5;
        let rate_sum = 0;
        let rate_count = 0;
        let rate_result = 0;
        let star_size_min = 0;
        let star_size_mid = 0;
        let star_size_max = 0;
        let rater_identify_model = "-{{{ITEM_ID}}}-{{{COUNTER}}}";
        let accepted_actions = ["quick","rate","cookie","comments"];
        let data_rater_queue_id = [];
        let voted = {};
        let rater_identify = {};
        let comments_cache = {};
        let data_rater_cache = {};
        let data_cache = {};
        let calculate_cache = {};
        let rate_result_cache = {};
        let controls = {
            quick: {},
            rate: {},
            cookie: {},
            comments: {},
            likes: {},
            unlikes: {},
            confused: {}
        };
        let yellow_color = stars_color; /*Yellow is default color*/
        let orange_color = "#EE6B26";
        let blue_color = "#190CD5";
        let silver_light_color = "#BABABA";
        let dark_color = "#232323";
        let light_color = "#DADADA";
        let rater_ask = "Tem certeza que deseja avaliar este item com {{{STARS}}} estrela(s) ?";

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(lang);

        /**
         * Rater Generic Functions
         */
        function _raterCheckinParams() {
            if (params.data.length <= 0 && !params.data) {
                $$.log("raterPlug() error => Missing data content !").error();
                return false;
            }

            if (rate === true) {
                if (!$$.isDefined(action.type) || !$$.inArray(accepted_actions, action.type)) {
                    $$.log("raterPlug() error => Wrong action type: " + action.type).error();
                    return false;
                }
            }

            if (!target || !$$.findId(target)) {
                $$.log("raterPlug() error => Missing target element: " + target).error();
                return false;
            }

            if (mode !== "view" && mode !== "rate") {
                $$.log("raterPlug() error => Wrong mode settings to rater: " + mode).error();
                return false;
            }

            if (stars_size.length !== 3) {
                $$.log("raterPlug() error => Wrong stars_size, use: [num1, num2, num3]").error();
                return false;
            }

            star_size_min = stars_size[0];
            star_size_mid = stars_size[1];
            star_size_max = stars_size[2];

            /*Bug Fix (hidden overflow in target element)*/
            jH(target).css("overflow", "hidden !important");

            return true;
        }

        function _checkItemByItem(item_id) {

            let _ci_ = data_rater_cache[item_id];

            /*Item id [identify] is Mandatory*/
            if (_ci_.item_id === "" || ! _ci_.item_id) {
                $$.log("raterPlug() error => Missing item_id: " + _ci_.item_id).error();
                return false;
            }

            if (!$$.has("stars").in(_ci_)) {
                $$.log("raterPlug() error => Missing star ratings !").error();
                return false;
            }

            /*Calculate by application*/
            if (_isCalculate(item_id)) {
                calculate_cache[_ci_.item_id] = [];
                calculate_cache[_ci_.item_id] = {
                    stars: _ci_.stars,
                    result: _ci_.calculate.result,
                    ratings: _ci_.calculate.ratings
                };
            }

            data_cache[_ci_.item_id] = [];

            /*String: Prevent Bug*/
            if ($$.is(_ci_.stars).string() || !$$.isDefined(_ci_.stars)) {
                _ci_.stars = {1: 0, 2: 0, 3: 0, 4:0, 5: 0};
            }

            /*Array*/
            if ($$.is(_ci_.stars).array() && _ci_.stars.length === 5) {
                for (let k = 0; k < 5; k++) {
                    data_cache[_ci_.item_id].push(parseInt(_ci_.stars[k]));
                }

            } else
            /*Array/Object*/
            if ($$.is(_ci_.stars).object() && _ci_.stars.length === 1) {
                for (let k = 1; k < 6; k++) {
                    if (!$$.has(k.toString()).in(_ci_.stars[0])) {
                        $$.log("raterPlug() error => Wrong data index to rater: " +
                            $$.objectMap(_ci_.stars[0]).toString()).error();
                        return false;
                    }
                    data_cache[_ci_.item_id].push(parseInt(_ci_.stars[0][k]));
                }

            } else
            /*Object/Json*/
            if ($$.is(_ci_.stars).object() && _ci_.stars.length === undefined) {
                for (let k = 1; k < 6; k++) {
                    if (!$$.has(k.toString()).in(_ci_.stars)) {
                        $$.log("raterPlug() error => Wrong data index to rater: " +
                            $$.objectMap(_ci_).toString()).error();
                        return false;
                    }
                    data_cache[_ci_.item_id].push(parseInt(_ci_.stars[k]));
                }
            }
            return true;
        }

        function _isCalculate(item_id) {
            let _ci_ = data_rater_cache[item_id];
            if (!$$.isDefined(_ci_.calculate)) return false;
            return (
                $$.has("calculate").in(_ci_) &&
                _ci_.calculate.result !== "" &&
                _ci_.calculate.ratings !== ""
            );
        }

        function _ratingCalculator(item_id) {
            /*No calculate by rater*/
            if (_isCalculate(item_id)) {
                let item = calculate_cache[item_id];
                rate_result = $$.floatNumber(item.result);
                rate_sum = rate_count = $$.intNumber(item.ratings);
                /*DEBUG*/
                /*console.log(rate_count, rate_sum, rate_result, rate_result%2);*/
            } else {
                for (let i = 0; i < data_cache[item_id].length; i++) {
                    let item = data_cache[item_id][i];
                    rate_count += $$.intNumber(item);
                    rate_sum += $$.intNumber(item) * (i+1);
                }
                rate_result = $$.number(rate_sum / rate_count).float(1);
                /*DEBUG*/
                /*console.log(rate_count, rate_sum, rate_result, rate_result%2);*/
            }
            _setResult(item_id);
        }

        function _setRaterIdentify(item_id) {
            rater_identify[item_id] = {
                identity:
                    rater_identify_model
                        .replace('{{{ITEM_ID}}}', data_rater_cache[item_id].item_id)
                        .replace('{{{COUNTER}}}', counter.toString())
            }
        }

        function _getRaterIdentify(item_id) {
            return rater_identify[item_id].identity || undefined;
        }

        function _getRestResult(rs) {
            return rs.toString().split(".").length > 1;
        }

        function _setResult(item_id) {
            rate_result_cache[data_rater_cache[item_id].item_id] = {
                result: rate_result,
                ratings: rate_count
            };
        }

        function _getResult(item_id) {
            return {
                result: rate_result_cache[item_id].result.toString().replace(".", ","),
                ratings: rate_result_cache[item_id].ratings
            };
        }

        function _rateItem(stars, item_id, comments = false) {
            let params = {
                item_id: item_id,
                comments: comments,
                target: "#jh-box-content",
                mode: "rate",
                size: "large",
                data: stars,
                action: action,
            };
            _createRater(params);
        }

        function _rateIcon(_size, _type, _data, _id, _color) {
            let rating_icons = {
                star: $$.icons(
                    {icon: 'star', size: 's-'+_size, data: _data, color: _color, id: _id}
                ).draw(),
                half_star: $$.icons(
                    {icon: 'half_star', size: 's-'+_size, data: _data, color: _color, id: _id}
                ).draw(),
                like: $$.icons(
                    {icon: 'like', size: 's-'+_size, data: _data, color: _color, id: _id}
                ).draw(),
                unlike: $$.icons(
                    {icon: 'unlike', size: 's-'+_size, data: _data, color: _color, id: _id}
                ).draw(),
                confused: $$.icons(
                    {icon: 'confused', size: 's-'+_size, data: _data, color: _color, id: _id}
                ).draw(),
            };

            return rating_icons[_type];
        }

        function _starId(stars, item_id = "") {
            return stars+":"+data_rater_cache[item_id].item_id;
        }

        function _starHover(item, until, comments = "") {
            if (voted[item].item_id === true) return;

            for (let i = 0; i < 5; i++) {
                jH("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path")
                    .removeClass('jh-rater-star-clicked');
            }
            for (let i = 0; i < until; i++) {
                $$.set({
                    class: 'jh-rater-star-hover'
                }).in("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path");
            }
        }

        function _starHoverRemove(item, comments = "") {
            if (voted[item].item_id === true) return;

            for (let i = 0; i < 5; i++) {
                jH("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path")
                    .removeClass('jh-rater-star-hover');
            }
        }

        function _starClicked(item, until, comments = "") {
            if (voted[item].item_id === true) return;

            for (let i = 0; i < 5; i++) {
                jH("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path")
                    .removeClass('jh-rater-star-hover');
                jH("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path")
                    .removeClass('jh-rater-star-clicked');
            }
            for (let i = 0; i < until; i++) {
                $$.set({
                    class: 'jh-rater-star-clicked'
                }).in("#jh-rater-icon-"+i+rater_identify[item].identity+comments+" path");
            }
        }

        function _mouseEventHandler(_els_, comments) {
            if (action.type !== 'cookie' && action.type !== 'quick') {
                jH(_els_).on('mouseover', function(e) {
                    let _star_id_ = $$this.value || $$this.dataset.content;
                    let _star_ = $$.explode(_star_id_).by(":").get(0);
                    let _id_ = $$.explode(_star_id_).by(":").get(1);
                    _starHover(_id_, _star_, comments);
                });

                jH(_els_).on('mouseout', function(e) {
                    let _star_id_ = $$this.value || $$this.dataset.content;
                    let _star_ = $$.explode(_star_id_).by(":").get(0);
                    let _id_ = $$.explode(_star_id_).by(":").get(1);
                    _starHoverRemove(_id_, comments);
                });
            }
        }

        function _ratingStars(append, comments = false, result = false, item_id) {
            let _cm_ = (comments === true) ? "-comments" : "";

            let _ri_ = _getRaterIdentify(item_id);

            rate_result = $$.floatNumber(_getResult(item_id).result);

            (function createMenuStars() {
                $$.create({
                    element: "ul",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-menu"+_ri_+_cm_, "jh-rater-menu"],
                    append: "#"+append
                });
            })();

            if (result === true) {
                (function createResult() {
                    if (result === false || size !== "medium") return;

                    $$.create({
                        element: "td",
                        attr_type: ["id", "class", "rowspan"],
                        attr_name: ["jh-rater-td-result"+_ri_+_cm_, "jh-rater-td-result", "2"],
                        append: "#jh-rater-tr-menu"+_ri_+_cm_
                    }, rate_result.toString().replace(".", ","));
                })();
            }

            (function createFillStars() {
                for (let i = 0; i < parseInt(rate_result); i++) {
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class", "data-content"],
                        attr_name: ["jh-rater-menu-item-"+i+_ri_+_cm_, "jh-rater-menu-item", _starId(i+1, item_id)],
                        append: "#jh-rater-menu"+_ri_+_cm_
                    });

                    $$.create({
                        element: "button",
                        attr_type: ["type","id", "class", "value"],
                        attr_name: ["button", "jh-rater-bt-"+i+_ri_+_cm_, "jh-rater-bt", _starId(i+1, item_id)],
                        append: "#jh-rater-menu-item-"+i+_ri_+_cm_
                    }, _rateIcon(star_size_max,'star', _starId(i+1, item_id),"jh-rater-icon-"+i+_ri_+_cm_, yellow_color));

                    if (rate === true) {
                        jH("#jh-rater-bt-"+i+_ri_+_cm_).addClass('jh-rater-bt-fill');
                    } else {
                        jH("#jh-rater-bt-"+i+_ri_+_cm_).addClass('jh-rater-bt-fill-disable');
                    }
                }
            })();

            (function createHalfStar() {
                if (_getRestResult(rate_result) === false) {
                    half_star = false;
                    return;
                }
                half_star = true;

                let item = parseInt(rate_result);

                $$.create({
                    element: "li",
                    attr_type: ["id", "class", "data-content"],
                    attr_name: ["jh-rater-menu-item-half-star"+_ri_+_cm_, "jh-rater-menu-item", _starId(item+1, item_id)],
                    append: "#jh-rater-menu"+_ri_+_cm_
                });

                $$.create({
                    element: "button",
                    attr_type: ["type","id", "class", "value"],
                    attr_name: ["button", "jh-rater-bt-half-star"+_ri_+_cm_, "jh-rater-bt", _starId(parseInt(rate_result), item_id)],
                    append: "#jh-rater-menu-item-half-star"+_ri_+_cm_
                }, _rateIcon(star_size_max,'half_star', _starId(item+1, item_id),"jh-rater-icon-"+item+_ri_+_cm_, yellow_color));

                if (rate === true) {
                    jH("#jh-rater-bt-half-star"+_ri_+_cm_).addClass('jh-rater-bt-fill');
                } else {
                    jH("#jh-rater-bt-half-star"+_ri_+_cm_).addClass('jh-rater-bt-fill-disable');
                }
            })();

            (function createEmptyStars() {
                if (half_star) rate_result += 1;

                for (let i = parseInt(rate_result); i < max_stars; i++) {
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class", "data-content"],
                        attr_name: ["jh-rater-menu-item-"+i+_ri_+_cm_, "jh-rater-menu-item", _starId(i+1, item_id)],
                        append: "#jh-rater-menu"+_ri_+_cm_
                    });

                    $$.create({
                        element: "button",
                        attr_type: ["type","id", "class", "value"],
                        attr_name: ["button", "jh-rater-bt-"+i+_ri_+_cm_, "jh-rater-bt", _starId(i+1, item_id)],
                        append: "#jh-rater-menu-item-"+i+_ri_+_cm_
                    }, _rateIcon(star_size_max,'star', _starId(i+1, item_id),"jh-rater-icon-"+i+_ri_+_cm_, silver_light_color));

                    if (rate === true) {
                        jH("#jh-rater-bt-"+i+_ri_+_cm_).addClass('jh-rater-bt-clear');
                    } else {
                        jH("#jh-rater-bt-"+i+_ri_+_cm_).addClass('jh-rater-bt-clear-disable');
                    }
                }
                if (half_star) rate_result -= 1;
            })();
        }

        function _eventRating(comments, max_digits = 150, item_id) {
            if (rate === false) return;

            let _ri_ = rater_identify[item_id].identity;

            function _checkSizeParameters(size_allow, txt) {
                if (size !== size_allow) {
                    $$.exceptBox("" +
                        "Existe uma falha na configuração do componente, " +
                        "a opção {size: "+size+"} não pode ser usada com a ação de avaliação " +
                        "{action: {type: '"+txt+"'}}, por favor corrija o problema e tente novamente !"
                        , true);
                    return false;
                }
                return true;
            }

            function _setEls(j, comments) {
                return "#jh-rater-icon-"+j+_ri_+comments+", " +
                    "#jh-rater-bt-"+j+_ri_+comments+", " +
                    "#jh-rater-menu-item-"+j+_ri_+comments+", " +
                    "#jh-rater-menu-item-half-star"+j+_ri_+comments;
            }

            function _isQuick(_star_) {
                return (rate === true &&
                    $$.has('type').in(action) &&
                    action.type === "quick" &&
                    $$.is(action.callback).function() &&
                    _star_);
            }

            function _execQuick(_star_) {
                if (controls.quick[data_rater_cache[item_id].item_id] !== _star_) {
                    let params = {
                        id: item_id,
                        stars: parseInt(_star_)
                    };
                    if (voted[item_id].item_id !== true) {
                        $$.confirm({
                            title: "Rating Alert",
                            question: rater_ask.replace("{{{STARS}}}", _star_),
                            theme: theme, /*default,dark,light*/
                            buttons: ["Yes", "No"]
                        }, function () {
                            if (action.callback(params)) {
                                _starClicked(item_id, _star_, comments);
                                if (size === 'large' && ratings === true) {
                                    let votes = $$.intNumber(jH("#jh-rater-td-ratings" + _ri_).text()) + 1;
                                    jH("#jh-rater-td-ratings" + _ri_).html(votes + " Votos");
                                } else if (size === 'medium') {
                                    let votes = $$.intNumber(jH("#jh-rater-td-md-ratings" + _ri_).text()) + 1;
                                    jH("#jh-rater-td-md-ratings" + _ri_).html(votes + " Votos");
                                }
                                controls.quick[data_rater_cache[item_id].item_id] = _star_;
                                voted[item_id].item_id = true;
                            }
                        });
                    }
                }
            }

            function _isCookie(_star_) {
                return (rate === true &&
                    $$.has('type').in(action) &&
                    action.type === "cookie" &&
                    _star_);
            }

            function _isRater(_star_) {
                return (rate === true &&
                    $$.has('type').in(action) &&
                    action.type === "rate" &&
                    $$.is(action.callback).function()
                    && _star_);
            }

            function _execRater(_star_) {
                if(!_checkSizeParameters("large", "rate")) return;

                if (voted[item_id].item_id === false) {
                    $$.box({
                        size: "small", /*small, medium, large, full*/
                        title: jH("#jh-rater-td-title" + _ri_).text(),
                        border: false,
                        target: "body",
                        theme: theme,
                        lang: lang
                    }).open();

                    _rateItem(_star_, item_id, false);
                }
            }

            function _isComments() {
                return (rate === true &&
                    $$.has('type').in(action) &&
                    action.type === "comments");
            }

            function _execComments() {
                if(!_checkSizeParameters("large", "comments")) return;

                let box_id = data_rater_cache[item_id].item_id;

                $$.box({
                    box_id: box_id,
                    size: "full", /*small, medium, large, full*/
                    title: "",
                    border: false,
                    target: "body",
                    theme: theme,
                    lang: lang
                }).open();

                _createComments(box_id, item_id);
            }

            if (comments === "-comments") {

                /*Looping on stars menu*/
                for (let j = 0; j < 5; j++) {

                    let _els_ = _setEls(j, comments);

                    jH(_els_).on('click', function(e) {

                        if (voted[item_id].item_id === false) {

                            let _star_id_ = $$this.value || $$this.dataset.content;
                            let _star_ = $$.explode(_star_id_).by(":").get(0);
                            let _id_ = $$.explode(_star_id_).by(":").get(1);

                            if (_id_ !== item_id) {
                                $$.log("raterPlug():#1 error => Wrong item Id !").critical();
                            }

                            $$.box({
                                size: "small", /*small, medium, large, full*/
                                title: jH("#jh-rater-td-title"+_ri_).text(),
                                border: false,
                                target: "body",
                                theme: theme,
                                lang: lang
                            }).open();

                            _rateItem(_star_, item_id, true);
                        }
                    });

                    if (rate === true && action.rate.active === true) {
                        _mouseEventHandler(_els_, comments);
                    }
                }

            } else {

                /*Looping on stars menu*/
                for (let j = 0; j < 5; j++) {

                    let _els_ = _setEls(j, comments);

                    jH(_els_).on('click', function(e) {

                        let _star_id_ = $$this.value || $$this.dataset.content;
                        let _star_ = $$.explode(_star_id_).by(":").get(0);
                        let _id_ = $$.explode(_star_id_).by(":").get(1);

                        if (_id_ !== item_id) {
                            $$.log("raterPlug():#2 error => Wrong item Id !").critical();
                        }

                        if (_isQuick(_star_)) {
                            /*Quick: just one click to rate*/
                            _execQuick(_star_);

                        } else if (_isRater(_star_)) {
                            /*Rate: open box edit and rate*/
                            _execRater(_star_);

                        } else if (_isCookie(_star_)) {
                            /*Cookie: storage rate in cookie*/
                            $$.cookie(action.name+"-"+item_id).set(_star_);
                            _starClicked(item_id, _star_, comments);

                        } else if (_isComments()) {
                            /*Comments: Show all comments, like and ratings*/
                            if (action.comments.active === false) return;
                            _execComments();
                        }
                    });

                    if (rate === true && action.type !== "comments") {
                        _mouseEventHandler(_els_, comments);
                    }
                }
            }
        }

        function _raterLoaderItems() {
            let count = 0;
            _setRaterItems();
            Object.keys(params.data).forEach(function(item, index, array) {
                let _item_ = params.data[item][0];
                try {
                    data_rater_cache[_item_.item_id||item] = {
                        item_id: _item_.item_id||item,
                        image: _item_.image || "",
                        price: _item_.price || "$ 0,00",
                        name: _item_.name || "[Item Name]",
                        description: _item_.description || "",
                        about: _item_.about || "",
                        stars: _item_.stars || null,
                        calculate: _item_.calculate || null
                    };
                    data_rater_queue_id.push(_item_.item_id||item);
                    voted[_item_.item_id||item] = {item_id: false};
                } catch (er) {
                    $$.log("raterPlug() error => " + er).except();
                    return false;
                }
                count++;
                if (count === qty_items_from_params) {
                    loader_is_done = true;
                    count = 0;
                    return true;
                }
            });

            if (rate === true) {
                if ($$.has('comments').in(action) && $$.has('data').in(action.comments)) {
                    _addComments(action.comments.data);
                }
            }
        }

        function _addComments(_comm_) {
            Object.keys(_comm_).forEach(function(item, index, array) {
                comments_cache[item] = _comm_[item];
            });
        }

        function _isCommentsLoaded(item_id) {
            if ($$.isDefined(comments_cache[item_id])) {
                return comments_cache[item_id].length > 0;
            }
            return false;
        }

        function _getCommentsLoaded(item_id) {
            if ($$.has(item_id).in(comments_cache)) {
                return comments_cache[item_id];
            }
        }

        function _setRaterItems() {
            qty_items_from_params = $$.objectMap(params.data).toArray().length;
        }

        function _raterBuilder() {
            let _time_ = setInterval(function(item, index, array) {
                if (data_rater_queue_id.length === 0) {
                    clearInterval(_time_);
                }
                if (item_is_processing === false || item_is_processing === null) {
                    _processNextItem();
                    counter += 1;
                }
            }, 800);
        }

        function _processNextItem() {
            let _item_ = data_rater_queue_id.shift();
            if (!_item_) {
                item_is_processing = false;
            } else {
                item_is_processing = true;
                if (_checkItemByItem(_item_)) {
                    _ratingCalculator(_item_);
                    _setRaterIdentify(_item_);
                    _create(_item_);
                }
            }
        }

        function _create(item_id) {
            if (mode === "view") {
                _createView(item_id);
            } else if (mode === "rate") {
                _createRater(item_id);
            }
        }

        /**
         * Main Functions
         */
        function _createView(item_id) {
            let _tbr_ = "jh-rater-table";
            let pv_td = "jh-rater-td-preview";
            let pv_img = "jh-rater-td-preview-image";
            let tr_tt = "jh-rater-tr-title";
            let pv_pr = "jh-rater-td-preview-price";
            let _identity_ = _getRaterIdentify(item_id);

            /*Bug Prevent*/
            if ($$.findId("#"+_tbr_+_identity_)) {
                $$.log("raterPlug() error => There is more of one HTMLElement " +
                    "with a same id in current document identified " +
                    "by: #"+_tbr_+_identity_).error();
                item_is_processing = null;
                return;
            }

            (function raterContainer() {
                $$.create({
                    element: "table",
                    attr_type: ["id", "class"],
                    attr_name: [_tbr_+_identity_, _tbr_],
                    append: target
                });
            })();

            (function ratingTitle() {
                if (data_rater_cache[item_id].name === "" || size !== "large") return;

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: [tr_tt+_identity_, tr_tt],
                    append: "#"+_tbr_+_identity_
                });

                if (preview === true) {

                    $$.create({
                        element: "td",
                        attr_type: ["id", "class", "rowspan"],
                        attr_name: [pv_td+_identity_, pv_td, "2"],
                        append: "#"+tr_tt+_identity_
                    });

                    $$.create({
                        element: "img",
                        attr_type: ["id", "class", "src"],
                        attr_name: [pv_img+_identity_, pv_img, data_rater_cache[item_id].image],
                        append: "#"+pv_td+_identity_
                    });
                }

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-title"+_identity_, "jh-rater-td-title"],
                    append: "#"+tr_tt+_identity_
                }, data_rater_cache[item_id].name);
            })();

            (function createResult() {
                if (result === false || size !== "large") return;

                $$.create({
                    element: "td",
                    attr_type: ["id", "class", "rowspan"],
                    attr_name: ["jh-rater-td-result"+_identity_, "jh-rater-td-result", "2"],
                    append: "#"+tr_tt+_identity_
                }, rate_result.toString().replace(".", ","));
            })();

            (function ratingAbout() {
                if (data_rater_cache[item_id].about === "" || size !== "large") return;

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-message"+_identity_, "jh-rater-tr-message"],
                    append: "#"+_tbr_+_identity_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-message"+_identity_, "jh-rater-td-message"],
                    append: "#jh-rater-tr-message"+_identity_
                }, data_rater_cache[item_id].about);
            })();

            (function createContainerMenuToStars() {
                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-menu"+_identity_, "jh-rater-tr-menu"],
                    append: "#"+_tbr_+_identity_
                });

                if (preview === true && size === 'large') {

                    $$.create({
                        element: "td",
                        attr_type: ["id", "class"],
                        attr_name: [pv_pr+_identity_, pv_pr],
                        append: "#jh-rater-tr-menu"+_identity_
                    }, data_rater_cache[item_id].price || "$ 0,00");
                }

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-menu"+_identity_, "jh-rater-td-menu"],
                    append: "#jh-rater-tr-menu"+_identity_
                });
            })();

            _ratingStars("jh-rater-td-menu"+_identity_, false, true, item_id);

            (function createRatings() {
                if (ratings === false || size !== 'large') return;

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-ratings"+_identity_, "jh-rater-td-ratings"],
                    append: "#jh-rater-tr-menu"+_identity_
                }, _getResult(item_id).ratings + " Votos");
            })();

            (function createRatingsMediumSize() {
                if (ratings === false || size !== 'medium') return;

                let _tr_md_ = "jh-rater-tr-md-ratings";
                let _td_md_ = "jh-rater-td-md-ratings";

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: [_tr_md_+_identity_, _tr_md_],
                    append: "#"+_tbr_+_identity_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: [_td_md_+_identity_, _td_md_],
                    append: "#"+_tr_md_+_identity_
                }, _getResult(item_id).ratings + " Votos");
            })();

            (function visualStyles() {
                let _styles_ = {};
                if (effect === "slide") {console.log(effect, "#" + _tbr_+_identity_);
                    _styles_["right"] = "1000px";
                }
                if (background !== null) {
                    _styles_["back_color"] = background + " !important";
                }
                if (shadow === true) {
                    _styles_["box_shadow"] = "2px 2px 10px #444444";
                    _styles_["margin_top"] = "20px";
                }

                jH("#" + _tbr_+_identity_).css({styles: _styles_});

                if (effect === 'slide') {
                    setTimeout(function () {
                        $$.move("#" + _tbr_+_identity_).to("right", "0px");
                    }, 200);
                } else if (effect === "fade") {
                    jH("#"+_tbr_+_identity_).fadeIn();
                }
            })();

            _eventRating("", "", item_id);

            setTimeout(function() {
                item_is_processing = false;
            }, 200);
        }

        function _createRater(params) {
            /*Local Parameters*/
            let _item_id_ = params.item_id;
            let _comments_ = ($$.has('comments').in(params)) ? params.comments : false;
            let _target_ = params.target;
            let _mode_ = params.mode;
            let _size_ = params.size;
            let _stars_ = params.data || params.stars;
            let _action_ = params.action;

            /*Element Settings*/
            let _tbc_ = "jh-rater-container";
            let _tbr_ = "jh-rater-table";
            let _rfm_ = "jh-rater-form";
            let _rrm_ = "jh-rater-menu";
            let _rri_ = "jh-rater-menu-item";
            let _bts_ = "jh-rater-bt-send";
            let _btc_ = "jh-rater-bt-cancel";

            function _saveRaterComment(_title_, _message_) {
                let _params_ = {
                    item_id: _item_id_ || undefined,
                    title: _title_ || undefined,
                    message: _message_ || undefined,
                    stars: _stars_ || undefined
                };

                let call = function() {return {status: false}};

                if ($$.is(_action_.callback).function()) {
                    call = _action_.callback;
                } else if ($$.is(_action_.rate.callback).function()) {
                    call = _action_.rate.callback;
                }

                let fn = call(_params_);

                if(fn.status === true) {

                    (function checkComment() {
                        if (_isCommentsLoaded(_item_id_)) {
                            _params_["id"] = fn.id;
                            _params_["likes"] = 0;
                            _params_["unlikes"] = 0;
                            _params_["confused"] = 0;
                            _addComments(_params_);
                        }
                    })();

                    (function updateRatings() {
                        _starClicked(_item_id_, _stars_, "");
                        if (ratings === true) {
                            let _ri_ = rater_identify[_item_id_].identity;
                            let votes = $$.intNumber(jH("#jh-rater-td-ratings" + _ri_).text()) + 1;
                            jH("#jh-rater-td-ratings" + _ri_).html(votes + " Votos");
                        }
                        voted[_item_id_].item_id = true;
                    })();

                    (function visualHandler() {
                        $$.box().close();

                        $$.toaster({
                            text: "Comentário salvo com sucesso !",
                            type: "success",
                            timeout: 4000
                        });

                        if (_comments_ === true) {
                            $$.box({
                                box_id: _item_id_
                            }).close();
                        }
                    })();

                } else if (fn.status === false) {
                    $$.toaster({
                        text: "Ocorreu uma falha ao tentar gravar seu comentário !",
                        type: "warning",
                        timeout: 4000
                    });
                }
            }

            (function raterContainer() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: [_tbc_+theme, _tbc_],
                    append: _target_
                });
            })();

            (function raterForm() {
                $$.create({
                    element: "form",
                    attr_type: ["id", "class"],
                    attr_name: [_rfm_, _rfm_],
                    append: "#"+_tbc_+theme
                });
            })();

            (function raterTable() {
                $$.create({
                    element: "table",
                    attr_type: ["id", "class"],
                    attr_name: [_tbr_, _tbr_],
                    append: "#"+_rfm_
                });
                jH("#"+_tbr_).addClass('jh-rater-table-rater-item');
            })();

            (function ratingTitle() {
                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-1", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-1", "jh-rater-td"],
                    append: "#jh-rater-tr-1"
                }, "Title");

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-2", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-2", "jh-rater-td"],
                    append: "#jh-rater-tr-2"
                });

                $$.create({
                    element: "input",
                    attr_type: ["type", "id", "class"],
                    attr_name: ["text", "jh-rater-input", "jh-rater-input"],
                    append: "#jh-rater-td-2"
                });
            })();

            (function ratingMessage() {
                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-3", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-3", "jh-rater-td"],
                    append: "#jh-rater-tr-3"
                }, "Message");

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-4", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-4", "jh-rater-td"],
                    append: "#jh-rater-tr-4"
                });

                $$.textarea({
                    target: "#jh-rater-td-4",
                    size: "full",
                    id: "jh-rater-textarea",
                    max_digits: _action_.max_digits || _action_.rate.max_digits || 100,
                    theme: theme,
                    lang: lang
                });
            })();

            (function createMenuStars() {
                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-5", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-5", "jh-rater-td"],
                    append: "#jh-rater-tr-5"
                });

                $$.create({
                    element: "ul",
                    attr_type: ["id", "class"],
                    attr_name: [_rrm_, _rrm_],
                    append: "#jh-rater-td-5"
                });
            })();

            (function createFillStars() {
                for (let i = 0; i < _stars_; i++) {
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class"],
                        attr_name: [_rri_+"-"+i, _rri_],
                        append: "#"+_rrm_
                    });

                    $$.create({
                        element: "button",
                        attr_type: ["type","id", "class", "value"],
                        attr_name: ["button", "jh-rater-bt-"+i, "jh-rater-bt-fill-disable", i+1],
                        append: "#"+_rri_+"-"+i
                    }, _rateIcon(star_size_mid,'star',i+1,"jh-rater-icon-"+i, yellow_color));
                }
            })();

            (function createEmptyStars() {
                for (let i = _stars_; i < max_stars; i++) {
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class"],
                        attr_name: [_rri_+"-"+i, _rri_],
                        append: "#"+_rrm_
                    });

                    $$.create({
                        element: "button",
                        attr_type: ["type","id", "class", "value"],
                        attr_name: ["button", "jh-rater-bt-"+i, "jh-rater-bt-clear-disable", i+1],
                        append: "#"+_rri_+"-"+i
                    }, _rateIcon(star_size_mid,'star',i+1,"jh-rater-icon-"+i, silver_light_color));
                }
            })();

            (function createRaterFormButton() {
                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-tr-last", "jh-rater-tr"],
                    append: "#"+_tbr_
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-rater-td-last", "jh-rater-td"],
                    append: "#jh-rater-tr-last"
                });

                $$.create({
                    element: "button",
                    attr_type: ["type", "id", "class"],
                    attr_name: ["button", _bts_, _bts_],
                    append: "#jh-rater-td-last"
                }, "Rate");

                $$.create({
                    element: "button",
                    attr_type: ["type", "id", "class"],
                    attr_name: ["reset", _btc_, _btc_],
                    append: "#jh-rater-td-last"
                }, "Cancel");
            })();

            (function eventRater() {
                jH("#"+_bts_).on('click', function(e) {
                    let _title_ =  jH("#jh-rater-input").val();
                    let _message_ = jH("#jh-rater-textarea").val();

                    if (_title_ !== "" && _message_ !== "") {
                        $$.confirm({
                            title: "Rating Alert",
                            question: rater_ask.replace("{{{STARS}}}", _stars_),
                            theme: theme, /*default,dark,light*/
                            buttons: ["Yes", "No"]
                        }, function() {
                            _saveRaterComment(_title_, _message_);
                        });

                    } else {
                        $$.alert("Por favor, preencha todos os campos !");
                    }
                });

                jH("#"+_btc_).on('click', function(e) {
                    jH("#"+_rfm_).reset();
                    $$.box().close();
                });
            })();
        }

        function _createComments(box_id, item_id) {
            let _tg_ = "jh-box-container"; /*target from library*/
            let _tb_ = "jh-rater-comment-table";

            box_id = "-"+box_id.toString().replace(/^-/, '');

            function _lineSeparator(idx) {
                let _ls_ = _tb_+"-separator-"+idx;
                let _cs_ = _tb_+"-td-separator";

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: [_ls_+box_id+idx, _ls_],
                    append: "#"+_tb_+box_id
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class", "colspan"],
                    attr_name: [_cs_+box_id+idx, _cs_, "2"],
                    append: "#"+_ls_+box_id+idx
                });
            }

            function _staticStars(i, size, star_type, idx, fill_color, target) {
                $$.create({
                    element: "li",
                    attr_type: ["id", "class"],
                    attr_name: ["menu-progress-li-"+idx+"-"+i+box_id, "menu-progress-li"],
                    append: target
                });

                $$.create({
                    element: "button",
                    attr_type: ["type", "class", "disabled"],
                    attr_name: ["button", "menu-progress-li-bt", "disabled"],
                    append: "#menu-progress-li-"+idx+"-"+i+box_id
                }, _rateIcon(size, star_type,"","", fill_color));
            }

            (function createTable() {
                $$.create({
                    element: "table",
                    attr_type: ["id", "class"],
                    attr_name: [_tb_+box_id, _tb_],
                    append: "#"+_tg_+box_id
                });
            })();

            (function createItem() {
                if (action.item.active === true) {

                    let _li_ = _tb_+"-item";
                    let _cl_ = _tb_+"-item-image";
                    let _im_ = _tb_+"-item-image-src";
                    let _c2_ = _tb_+"-item-name";

                    $$.create({
                        element: "tr",
                        attr_type: ["id", "class"],
                        attr_name: [_li_+box_id, _li_],
                        append: "#"+_tb_+box_id
                    });

                    $$.create({
                        element: "td",
                        attr_type: ["id", "class"],
                        attr_name: [_cl_+box_id, _cl_],
                        append: "#"+_li_+box_id
                    });

                    /*Item Image*/
                    if (!$$.is(data_rater_cache[item_id].image).undef() && data_rater_cache[item_id].image !== "") {
                        $$.create({
                            element: "img",
                            attr_type: ["id", "class", "src"],
                            attr_name: [_im_+box_id, _im_, data_rater_cache[item_id].image],
                            append: "#"+_cl_+box_id
                        });
                    }

                    let _in_ = "<h1>"+(data_rater_cache[item_id].name||"")+"</h1><br />";
                    let _id_ = "<h3>"+(data_rater_cache[item_id].description||"")+"</h3>";
                    let _ii_ = _in_+_id_;

                    $$.create({
                        element: "td",
                        attr_type: ["id", "class"],
                        attr_name: [_c2_+box_id, _c2_],
                        append: "#"+_li_+box_id
                    }, _ii_);
                }
            })();

            (function createProgress() {
                if (action.progress !== true) return;

                let _lp_ = _tb_+"-progress";
                let _cp_ = _tb_+"-progress-details";
                let _mn_ = "menu-progress";

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: [_lp_+box_id, _lp_],
                    append: "#"+_tb_+box_id
                });

                $$.create({
                    element: "td",
                    attr_type: ["id", "class", "colspan"],
                    attr_name: [_cp_+box_id, _cp_, "2"],
                    append: "#"+_lp_+box_id
                });

                for (let i = 5; i > 0; i--) {
                    $$.create({
                        element: "ul",
                        attr_type: ["id", "class"],
                        attr_name: [_mn_+"-"+i+box_id, _mn_],
                        append: "#"+_cp_+box_id
                    });

                    /*Fill Stars*/
                    for (let n = 1; n <= i; n++) {
                        _staticStars(i, star_size_min, 'star', n, yellow_color, "#"+_mn_+"-"+i+box_id);
                    }

                    /*Empty Stars*/
                    for (let k = i; k < 5; k++) {
                        _staticStars(i, star_size_min, 'star', k, silver_light_color, "#"+_mn_+"-"+i+box_id);
                    }

                    /*Progress Bar*/
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class"],
                        attr_name: [_mn_+"-li-bar-"+i+box_id, _mn_+"-li-bar"],
                        append: "#"+_mn_+"-"+i+box_id
                    });

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: [_mn_+"-li-bar-content-"+i+box_id, _mn_+"-li-bar-content"],
                        append: "#"+_mn_+"-li-bar-"+i+box_id
                    });

                    let _percent_ = (data_cache[item_id][i-1]/rate_count)*100;
                    jH("#"+_mn_+"-li-bar-content-"+i+box_id).width(_percent_+"%");

                    /*Star Quantity*/
                    $$.create({
                        element: "li",
                        attr_type: ["id", "class"],
                        attr_name: [_mn_+"-li-qty-"+i+box_id, _mn_+"-li-qty"],
                        append: "#"+_mn_+"-"+i+box_id
                    }, data_cache[item_id][i-1]);
                }
            })();

            (function createResults() {

                let _lr_ = _tb_+"-results";
                let _crt_ = _tb_+"-rating";
                let _crs_ = _tb_+"-stars";
                let _h3_ = _tb_+"-h3-result";
                let _h6_ = _tb_+"-h6-result";

                $$.create({
                    element: "tr",
                    attr_type: ["id", "class"],
                    attr_name: [_lr_+box_id, _lr_],
                    append: "#"+_tb_+box_id
                });

                let _rs_ = _getResult(item_id);

                if (ratings === true) {
                    let _rt_view_ = $$.intNumber(jH("#jh-rater-td-ratings" + _getRaterIdentify(item_id)).text());
                    if (_rs_.ratings < _rt_view_) _rs_.ratings = _rt_view_;
                }

                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: [_crt_+box_id, _crt_],
                    append: "#"+_lr_+box_id
                });

                $$.create({
                    element: "h3",
                    attr_type: ["id", "class"],
                    attr_name: [_h3_+box_id, _h3_],
                    append: "#"+_crt_+box_id
                }, _rs_.result);

                $$.create({
                    element: "h6",
                    attr_type: ["id", "class"],
                    attr_name: [_h6_+box_id, _h6_],
                    append: "#"+_crt_+box_id
                }, _rs_.ratings + " Votos");

                /*starRatings*/
                $$.create({
                    element: "td",
                    attr_type: ["id", "class"],
                    attr_name: [_crs_+box_id, _crs_],
                    append: "#"+_lr_+box_id
                });
                _ratingStars(_crs_+box_id, true, false, item_id);
            })();

            _lineSeparator(0);

            (function comments() {

                let _lc_ = _tb_+"-line";
                let _c1_ = _tb_+"-cel";
                let _dvs = _tb_+"-stars";
                let _dv1 = _tb_+"-title";
                let _dv2 = _tb_+"-message";
                let _dvp = _tb_+"-content";
                let _dv3 = _tb_+"-likes";

                let _rml_ = "jh-rater-menu-likes";
                let _rmu_ = "jh-rater-menu-unlikes";
                let _rmd_ = "jh-rater-menu-confused";

                let _tc_ = [];

                if ($$.is(action.comments.callback).function()) {
                    _tc_ = action.comments.callback(item_id);
                } else if (_isCommentsLoaded(item_id)) {
                    _tc_ = _getCommentsLoaded(item_id);
                }

                function _applyReaction(i, icon1, color1, icon2, color2, cancel = false) {
                    if (cancel === true) {
                        (function resetIcon() {
                            jH("#jh-rater-icon-" + i + "_" + icon1 + "_1").css("fill", color1);
                            jH("#jh-rater-icon-" + i + "_" + icon1 + "_2").css("fill", color1);
                            jH("#jh-rater-icon-" + i + "_" + icon2 + "_1").css("fill", color1);
                            jH("#jh-rater-icon-" + i + "_" + icon2 + "_2").css("fill", color1);
                        })();
                    } else {
                        (function fillIcon() {
                            jH("#jh-rater-icon-" + i + "_" + icon1 + "_1").css("fill", color1);
                            jH("#jh-rater-icon-" + i + "_" + icon1 + "_2").css("fill", color1);
                        })();

                        (function resetIcon() {
                            jH("#jh-rater-icon-" + i + "_" + icon2 + "_1").css("fill", color2);
                            jH("#jh-rater-icon-" + i + "_" + icon2 + "_2").css("fill", color2);
                        })();
                    }

                    (function fillIconConfused() {
                        jH("#jh-rater-icon-" + i + "_confused_3").css("fill", color2);
                        jH("#jh-rater-icon-" + i + "_confused_4").css("fill", color2);
                        jH("#jh-rater-icon-" + i + "_confused_5").css("fill", color2);
                    })();
                }

                function _isActiveReactions() {
                    return (
                        $$.has("like").in(action) &&
                        $$.is(action.like.callback).function() &&
                        action.like.active === true
                    );
                }

                function _hasConfusedReaction() {
                    return (
                        !$$.has('like').in(action) ||
                        !$$.has("confused").in(action.like) ||
                        action.like.confused === false);
                }

                function _activeLike(i, identity_comment) {
                    jH("#" + _rml_ + "-li-" + i).on('click', function (e) {
                        if (controls.likes[identity_comment] === "like") {
                            if (action.like.callback({
                                reaction: "like-cancel",
                                identity: $$this.dataset.content
                            })) {
                                _applyReaction(i, "like", light_color, "unlike", light_color);

                                let like = $$.intNumber(jH("#" + _rml_ + "-li-likes-span-" + i).text()) - 1;
                                jH("#" + _rml_ + "-li-likes-span-" + i).html(like);

                                controls.likes[identity_comment] = "";
                            }
                            return;
                        }

                        if (action.like.callback({
                            reaction: "like",
                            identity: $$this.dataset.content
                        })) {

                            try {
                                _applyReaction(i, "like", dark_color, "unlike", light_color);

                                let like = $$.intNumber(jH("#" + _rml_ + "-li-likes-span-" + i).text()) + 1;
                                jH("#" + _rml_ + "-li-likes-span-" + i).html(like);

                                let unlike = $$.intNumber(jH("#" + _rml_ + "-li-unlikes-span-" + i).text());
                                if (unlike > _tc_[i].unlikes) {
                                    jH("#" + _rml_ + "-li-unlikes-span-" + i).html(unlike - 1);
                                }

                                let confused = $$.intNumber(jH("#" + _rml_ + "-li-confused-span-" + i).text());
                                if (confused > _tc_[i].confused) {
                                    jH("#" + _rml_ + "-li-confused-span-" + i).html(confused - 1);
                                }
                            } catch(er) {
                                $$.noth();
                            }
                        }
                        controls.likes[identity_comment] = "like";
                        controls.unlikes[identity_comment] = "";
                        controls.confused[identity_comment] = "";
                    });
                }

                function _activeUnlike(i, identity_comment) {
                    jH("#" + _rmu_ + "-li-" + i).on('click', function (e) {
                        if (controls.unlikes[identity_comment] === "unlike") {
                            if (action.like.callback({
                                reaction: "unlike-cancel",
                                identity: $$this.dataset.content
                            })) {
                                _applyReaction(i, "unlike", light_color, "like", light_color);

                                let unlike = $$.intNumber(jH("#" + _rml_ + "-li-unlikes-span-" + i).text()) - 1;
                                jH("#" + _rml_ + "-li-unlikes-span-" + i).html(unlike);

                                controls.unlikes[identity_comment] = "";
                            }
                            return;
                        }

                        if (action.like.callback({
                            reaction: "unlike",
                            identity: $$this.dataset.content
                        })) {

                            try {
                                _applyReaction(i, "unlike", dark_color, "like", light_color);

                                let unlike = $$.intNumber(jH("#" + _rml_ + "-li-unlikes-span-" + i).text()) + 1;
                                jH("#" + _rml_ + "-li-unlikes-span-" + i).html(unlike);

                                let like = $$.intNumber(jH("#" + _rml_ + "-li-likes-span-" + i).text());
                                if (like > _tc_[i].likes) {
                                    jH("#" + _rml_ + "-li-likes-span-" + i).html(like - 1);
                                }

                                let confused = $$.intNumber(jH("#" + _rml_ + "-li-confused-span-" + i).text());
                                if (confused > _tc_[i].confused) {
                                    jH("#" + _rml_ + "-li-confused-span-" + i).html(confused - 1);
                                }
                            } catch(er) {
                                $$.noth();
                            }
                        }
                        controls.likes[identity_comment] = "";
                        controls.unlikes[identity_comment] = "unlike";
                        controls.confused[identity_comment] = "";
                    });
                }

                function _activeConfused(i, identity_comment) {
                    if (!_hasConfusedReaction()) return;

                    jH("#" + _rmd_ + "-li-" + i).on('click', function (e) {
                        if (controls.confused[identity_comment] === "confused") {
                            if (action.like.callback({
                                reaction: "confused-cancel",
                                identity: $$this.dataset.content
                            })) {
                                _applyReaction(i, "like", light_color, "unlike", light_color, false);

                                let confused = $$.intNumber(jH("#" + _rml_ + "-li-confused-span-" + i).text()) - 1;
                                jH("#" + _rml_ + "-li-confused-span-" + i).html(confused);

                                controls.confused[identity_comment] = "";
                            }
                            return;
                        }

                        if (action.like.callback({
                            reaction: "confused",
                            identity: $$this.dataset.content
                        })) {

                            try {
                                _applyReaction(i, "like", light_color, "unlike", dark_color, true);

                                let confused = $$.intNumber(jH("#" + _rml_ + "-li-confused-span-" + i).text()) + 1;
                                jH("#" + _rml_ + "-li-confused-span-" + i).html(confused);

                                let like = $$.intNumber(jH("#" + _rml_ + "-li-likes-span-" + i).text());
                                if (like > _tc_[i].likes) {
                                    jH("#" + _rml_ + "-li-likes-span-" + i).html(like - 1);
                                }
                                let unlike = $$.intNumber(jH("#" + _rml_ + "-li-unlikes-span-" + i).text());
                                if (unlike > _tc_[i].unlikes) {
                                    jH("#" + _rml_ + "-li-unlikes-span-" + i).html(unlike - 1);
                                }
                            } catch(er) {
                                $$.noth();
                            }
                        }
                        controls.likes[identity_comment] = "";
                        controls.unlikes[identity_comment] = "";
                        controls.confused[identity_comment] = "confused";
                    });
                }

                /*Comments: Item by Item*/
                for (let i = 0; i < _tc_.length; i++) {

                    (function commentLine() {
                        let line_comment = _lc_+box_id+"-"+i;
                        let first_line = (i === 0) ? _lc_+"-first" : _lc_;

                        $$.create({
                            element: "tr",
                            attr_type: ["id", "class"],
                            attr_name: [line_comment, first_line],
                            append: "#"+_tb_+box_id
                        });

                        $$.create({
                            element: "td",
                            attr_type: ["id", "class", "colspan"],
                            attr_name: [_c1_+box_id+"-"+i, _c1_, "2"],
                            append: "#"+line_comment
                        });
                    })();

                    (function starRatingsByUser() {
                        let _mp_ = "menu-progress-comment";
                        let _mn_ = _mp_+box_id+"-"+i;
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: [_dvs+box_id+"-"+i, _dvs],
                            append: "#"+_c1_+box_id+"-"+i
                        });

                        $$.create({
                            element: "ul",
                            attr_type: ["id", "class"],
                            attr_name: [_mn_, _mp_],
                            append: "#"+_dvs+box_id+"-"+i
                        });

                        /*Fill Stars*/
                        for (let n = 1; n <= _tc_[i].stars; n++) {
                            _staticStars(i, star_size_min, 'star', n, yellow_color, "#"+_mn_);
                        }
                        /*Empty Stars*/
                        for (let k = _tc_[i].stars; k < 5; k++) {
                            _staticStars(i, star_size_min, 'star', k, silver_light_color, "#"+_mn_);
                        }
                    })();

                    (function commentTitle() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: [_dv1+box_id+"-"+i, _dv1],
                            append: "#"+_c1_+box_id+"-"+i
                        });

                        $$.create({
                            element: "h3",
                            attr_type: ["id", "class"],
                            attr_name: [_dv1+box_id+"-"+i+"-h3", _dv1+"-h3"],
                            append: "#"+_dv1+box_id+"-"+i
                        }, $$.ucFirst(_tc_[i].title) || "Missing Title");
                    })();

                    (function commentMessage() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: [_dv2+box_id+"-"+i, _dv2],
                            append: "#"+_c1_+box_id+"-"+i
                        });

                        $$.create({
                            element: "p",
                            attr_type: ["id", "class"],
                            attr_name: [_dvp+box_id+"-"+i+"-p", _dvp+"-p"],
                            append: "#"+_dv2+box_id+"-"+i
                        }, $$.ucFirst(_tc_[i].message, false) || "Missing Message");
                    })();

                    (function commentLikes() {

                        let identity_comment = item_id+";"+(_tc_[i].id || "null");

                        (function reactionContainer() {
                            $$.create({
                                element: "div",
                                attr_type: ["id", "class"],
                                attr_name: [_dv3+box_id+"-"+i, _dv3],
                                append: "#"+_c1_+box_id+"-"+i
                            });

                            $$.create({
                                element: "ul",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_+"-"+i, _rml_],
                                append: "#"+_dv3+box_id+"-"+i
                            });
                        })();

                        /*Likes*/
                        (function likeButton() {
                            $$.create({
                                element: "li",
                                attr_type: ["id", "class", "data-content"],
                                attr_name: [_rml_+"-li-"+i, _rml_+"-li", identity_comment],
                                append: "#"+_rml_+"-"+i
                            });

                            $$.create({
                                element: "button",
                                attr_type: ["type","id", "class", "value"],
                                attr_name: ["button", _rml_+"-li-bt-like-"+i, _rml_+"-li-bt-like", identity_comment],
                                append: "#"+_rml_+"-li-"+i
                            }, _rateIcon('38','like',identity_comment,"jh-rater-icon-"+i, light_color));

                            $$.create({
                                element: "li",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_+"-li-likes-"+i, _rml_+"-li"],
                                append: "#"+_rml_+"-"+i
                            });

                            $$.create({
                                element: "span",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_+"-li-likes-span-"+i, _rml_+"-li-span"],
                                append: "#"+_rml_+"-li-likes-"+i
                            }, _tc_[i].likes);
                        })();

                        /*Unlikes*/
                        (function unlikeButton() {
                            $$.create({
                                element: "li",
                                attr_type: ["id", "class", "data-content"],
                                attr_name: [_rmu_+"-li-"+i, _rmu_+"-li", identity_comment],
                                append: "#"+_rml_+"-"+i
                            });

                            $$.create({
                                element: "button",
                                attr_type: ["type","id", "class", "value"],
                                attr_name: ["button", _rml_+"-li-bt-unlike-"+i, _rml_+"-li-bt-unlike", identity_comment],
                                append: "#"+_rmu_+"-li-"+i
                            }, _rateIcon('38','unlike', identity_comment,"jh-rater-icon-"+i, light_color));

                            $$.create({
                                element: "li",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_+"-li-unlikes-"+i, _rmu_+"-li"],
                                append: "#"+_rml_+"-"+i
                            });

                            $$.create({
                                element: "span",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_+"-li-unlikes-span-"+i, _rml_+"-li-span"],
                                append: "#"+_rml_+"-li-unlikes-"+i
                            }, _tc_[i].unlikes);
                        })();

                        /*Confused*/
                        (function confusedButton() {
                            if (!_hasConfusedReaction()) return;

                            $$.create({
                                element: "li",
                                attr_type: ["id", "class", "data-content"],
                                attr_name: [_rmd_ + "-li-" + i, _rmd_ + "-li", identity_comment],
                                append: "#" + _rml_ + "-" + i
                            });

                            $$.create({
                                element: "button",
                                attr_type: ["type", "id", "class", "value"],
                                attr_name: ["button", _rml_ + "-li-bt-confused-" + i, _rml_ + "-li-bt-confused", identity_comment],
                                append: "#" + _rmd_ + "-li-" + i
                            }, _rateIcon('32', 'confused', identity_comment, "jh-rater-icon-" + i, light_color));

                            $$.create({
                                element: "li",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_ + "-li-confused-" + i, _rmd_ + "-li"],
                                append: "#" + _rml_ + "-" + i
                            });

                            $$.create({
                                element: "span",
                                attr_type: ["id", "class"],
                                attr_name: [_rml_ + "-li-confused-span-" + i, _rml_ + "-li-span"],
                                append: "#" + _rml_ + "-li-confused-" + i
                            }, _tc_[i].confused);
                        })();

                        (function activeReactions() {
                            if (!_isActiveReactions()) return;

                            /*Like Reaction*/
                            _activeLike(i, identity_comment);

                            /*Unlike Reaction*/
                            _activeUnlike(i, identity_comment);

                            /*Confused Reaction*/
                            _activeConfused(i, identity_comment);

                        })();

                    })();

                    if (i < _tc_-1) {
                        _lineSeparator(i);
                    }
                }

            })();

            if (action.rate.active === true) {
                _eventRating("-comments", action.rate.max_digits, item_id);
            }
        }

        /**
         * Rater Run
         */
        function _run() {
            try {
                if (_raterCheckinParams()) {
                    _raterLoaderItems();
                    let _time_ = setInterval(function() {
                        if (loader_is_done) {
                            clearInterval(_time_);
                            _raterBuilder();
                        }
                    }, 100);
                }
            } catch (er) {
                $$.log("raterPlug() error => " + er).except();
            }
        }

        return {"run": _run};
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
