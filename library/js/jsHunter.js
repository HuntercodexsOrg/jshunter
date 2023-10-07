/*
*
* Project: jsHunter Javascript Library
* Initial Date: 2019-11-01
* License: MIT
* Description: This is a free source code, please use of the anyway better possible.
*
*/

;(function(){

    /*
     --------------------------------------------------------------------------------
     - GLOBAL VARS
     --------------------------------------------------------------------------------
     */

    let
        jh_debug  = false,
        userAgent = navigator.userAgent.toLowerCase(),
        jh_nodes  = [],
        jh_node   = "",
        fadeCtrl  = null, /*FadeIn FadeOut Effects Controls*/
        sizeCtrl  = null,
        receiver  = null,
        recCtrl   = null,
        $$this    = null;

    /*
     --------------------------------------------------------------------------------
     - LIB CONSTRUCTOR
     --------------------------------------------------------------------------------
     */

    const jsHunter = function(_selector, _args) {
        if(!(this instanceof jsHunter)) {
            return new jsHunter(_selector, _args);
        }
        try {
            if(_selector) {
                this.sel = jsHunter.sel = document.querySelectorAll(_selector);
                if(!this.sel) {
                    throw "Invalid selector ("+_selector+"), use id, class or label";
                }
            } else {
                this.sel = this.selector = _selector = undefined;
            }
        } catch(err) {
            console.error("[Exception] jsHunter() => "+err);
        } finally {
            if(_selector && !this.sel) {
                console.error("[Exception] jsHunter is not done, check the selector arg !");
            } else {
                this.selector = jsHunter.selector = _selector;
                this.args     = jsHunter.args = _args;
                /*(bug-fix) reset vars*/
                jh_nodes      = null;
                jh_node       = "";
            }
        }
    }

    /*
     --------------------------------------------------------------------------------
     - PRIVATE GENERIC FUNCTIONS
     --------------------------------------------------------------------------------
     */

    /*Get specific css property from one HTMLElement*/
    function _getCssProperty(_element, _prop) {
        let s = window.getComputedStyle(_element); /*Element Styles*/
        return s[_prop];
    }

    /*Get all data about css styles from any HTMLElement*/
    function _getStyles(_element) {

        let s = window.getComputedStyle(_element); /*Element Styles*/
        let w = parseInt(s.width);  /*Element Width Pixels*/
        let h = parseInt(s.height); /*Element Height Pixels*/

        return {
            all: s,
            width: w,
            height: h,
            save_width: w
        };
    }

    /*Supported CSS Properties*/
    function _setAttributesStyles(e, p) {

        let s = "";
        if(p.hasOwnProperty("text_color")) { s += "color: "+p.text_color+";"; }
        if(p.hasOwnProperty("cursor")) { s += "cursor: "+p.cursor+";"; }
        if(p.hasOwnProperty("text_align")) { s += "text-align: "+p.text_align+";"; }
        if(p.hasOwnProperty("font_size"))  { s += "font-size: "+p.font_size+";"; }
        if(p.hasOwnProperty("font_weight"))  { s += "font-weight: "+p.font_weight+";"; }
        if(p.hasOwnProperty("width"))     { s += "width: "+p.width+";"; }
        if(p.hasOwnProperty("min_width"))     { s += "min-width: "+p.min_width+";"; }
        if(p.hasOwnProperty("height"))    { s += "height: "+p.height+";"; }
        if(p.hasOwnProperty("min_height"))    { s += "min-height: "+p.min_height+";"; }
        if(p.hasOwnProperty("position"))  { s += "position: "+p.position+";"; }
        if(p.hasOwnProperty("z_index"))   { s += "z-index: "+p.z_index+";"; }
        if(p.hasOwnProperty("top"))       { s += "top: "+p.top+";"; }
        if(p.hasOwnProperty("right"))      { s += "right: "+p.right+";"; }
        if(p.hasOwnProperty("bottom"))      { s += "bottom: "+p.bottom+";"; }
        if(p.hasOwnProperty("left"))      { s += "left: "+p.left+";"; }
        if(p.hasOwnProperty("margin"))    { s += "margin: "+p.margin+";"; }
        if(p.hasOwnProperty("margin_left"))    { s += "margin-left: "+p.margin_left+";"; }
        if(p.hasOwnProperty("margin_right"))    { s += "margin-right: "+p.margin_right+";"; }
        if(p.hasOwnProperty("margin_bottom"))    { s += "margin-bottom: "+p.margin_bottom+";"; }
        if(p.hasOwnProperty("margin_top"))    { s += "margin-top: "+p.margin_top+";"; }
        if(p.hasOwnProperty("padding"))   { s += "padding: "+p.padding+";"; }
        if(p.hasOwnProperty("padding_top")){ s += "padding-top: "+p.padding_top+";"; }
        if(p.hasOwnProperty("padding_bottom")){ s += "padding-bottom: "+p.padding_bottom+";"; }
        if(p.hasOwnProperty("transition")){ s += "transition: "+p.transition+";"; }
        if(p.hasOwnProperty("display"))   { s += "display: "+p.display+";"; }
        if(p.hasOwnProperty("overflow"))  { s += "overflow: "+p.overflow+";"; }
        if(p.hasOwnProperty("border"))  { s += "border: "+p.border+";"; }
        if(p.hasOwnProperty("border_top"))  { s += "border-top: "+p.border_top+";"; }
        if(p.hasOwnProperty("border_right"))  { s += "border-right: "+p.border_right+";"; }
        if(p.hasOwnProperty("border_bottom"))  { s += "border-bottom: "+p.border_bottom+";"; }
        if(p.hasOwnProperty("border_left"))  { s += "border-left: "+p.border_left+";"; }
        if(p.hasOwnProperty("border_radius"))  { s += "border-radius: "+p.border_radius+";"; }
        if(p.hasOwnProperty("box_shadow"))  { s += "box-shadow: "+p.box_shadow+";"; }
        if(p.hasOwnProperty("box_sizing"))  { s += "box-sizing: "+p.box_sizing+";"; }
        if(p.hasOwnProperty("user_drag"))  {
            s += "-webkit-user-drag: "+p.user_drag+";";
            s += "-khtml-user-drag: "+p.user_drag+";";
        }

        /*RGBA*/
        if(p.hasOwnProperty("back_color") && p.hasOwnProperty("opacity") && p.opacity !== "1") {
            s += "background: rgba("+$$.hexToRgb(p.back_color).rgb+","+p.opacity+");";
            /*HEXADECIMAL*/
        } else if(p.hasOwnProperty("back_color") && p.back_color !== "") {
            s += "background-color: "+p.back_color+";";
        }

        e.setAttribute("style", s);
    }

    /*Create a DOM <HTMLElement> with append option*/
    function _createHtmlElement(params) {
        let htmlElement = document.createElement(params.element);

        if ($$.isArray(params.attr_type) && $$.isArray(params.attr_name)) {
            for (let i = 0; i < (params.attr_type).length; i++) {
                htmlElement.setAttribute(params.attr_type[i], params.attr_name[i]);
            }
        } else {
            htmlElement.setAttribute(params.attr_type, params.attr_name.replace("#", ""));
        }

        if(params.hasOwnProperty('styles')) {
            _setAttributesStyles(htmlElement, params.styles);
        }

        if ($$.has('append').in(params)) {
            let _el_ = document.querySelectorAll(params.append);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].appendChild(htmlElement);
            });
        }

        return htmlElement;
    }

    function _middlePositionConfigure(element, element_width, element_height) {
        _MarginAutoConfigure(element, element_width);
        _marginTopConfigure(element, element_height);
    }

    function _MarginAutoConfigure(element, element_width) {
        let screen_width = window.innerWidth;
        let initial_calc = screen_width - parseInt(element_width);
        let margin_calc = initial_calc / 2;

        margin_calc = (margin_calc < 0) ? 0: margin_calc;

        element.style.left = (margin_calc - element.style.padding) + "px";

    }

    function _marginTopConfigure(element, element_height) {
        let screen_height = window.innerHeight;
        let initial_calc = screen_height - parseInt(element_height);
        let margin_calc = ( initial_calc - 30 ) / 2;

        margin_calc = (margin_calc < 0) ? 0: margin_calc;

        element.style.top = margin_calc + "px";
    }

    function _changeElementSize(element, orientation, size, measure) {

        switch (orientation) {
            case 'width':
                element.style.width = size + measure;
                break;
            case 'height':
                element.style.height = size + measure;
                break;
            default:
                console.error("[Error]: Increase Element Function: orientation is invalid !");
        }
    }

    function _opacityElement(element, op) {
        element.style.opacity = op;
    }

    function _doAttr(_sel, type, value, tnode) {

        if(tnode === "nodeList") {

            switch (type) {
                case "src":
                    _sel.forEach(function(a, index) {
                        _sel[index].attributes.src.value = value;
                    })
                    break;
                case "disabled":
                    _sel.forEach(function(a, index) {
                        _sel[index].disabled = value;
                    })
                    break;
                case "href":
                    _sel.forEach(function(a, index) {
                        _sel[index].href = value;
                    })
                    break;
                case "checked":
                    _sel.forEach(function(a, index) {
                        _sel[index].checked = value;
                    })
                    break;
                case "type":
                    _sel.forEach(function(a, index) {
                        _sel[index].type = value;
                    })
                    break;
                default:
                    _sel.forEach(function(a, index) {
                        _sel[index].setAttribute(type, value);
                    })
            }

        } else if(tnode === "node") {

            switch (type) {
                case "src":
                    _sel.attributes.src.value = value;
                    break;
                case "disabled":
                    _sel.disabled = value;
                    break;
                case "href":
                    _sel.href = value;
                    break;
                case "checked":
                    _sel.checked = value;
                    break;
                case "type":
                    _sel.type = value;
                    break;
                default:
                    _sel.setAttribute(type, value);
            }
        }
    }

    function setCookie(cname, c_value, ex_days) {
        let d;
        if (ex_days === '_delete_') {
            d = new Date(1900,0,1);
        } else {
            d = new Date();
            d.setTime(d.getTime() + (ex_days * 24 * 60 * 60 * 1000));
        }
        let expires = "expires="+d.toUTCString();

        if ($$.isHttps(window.location.href)) {
            document.cookie = cname + "=" + c_value + ";" + expires + ";path=/; SameSite=None; Secure";
        } else {
            document.cookie = cname + "=" + c_value + ";" + expires + ";path=/;";
        }
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    jsHunter.fn = jsHunter.prototype = {

        /*
         --------------------------------------------------------------------------------
         - TOPIC: USING
         --------------------------------------------------------------------------------
         */

        /**
         * @description Set a callback when jsHunter and all application resources has been loaded
         * @param {function} callback (function: Mandatory)
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        loaded: function(callback) {
            window.onload = function() {
                if ($$.is(callback).function()) {
                    callback();
                } else {
                    console.info("[Warning] callback is:", typeof callback);
                }
            }
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: REQUEST AND RESPONSE
         --------------------------------------------------------------------------------
         */

        /**
         * @description Make a Ajax request (include sync option)
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        ajax: function(params = {}) {

            /**
             * Settings/Configurations by args
             */
            let _url   = ($$.has('url').in(params)) ? params.url : "";
            let _data  = ($$.has('data').in(params)) ? params.data : "";
            let _dtype = ($$.has('dataType').in(params)) ? params.dataType : false;
            let _ctype = ($$.has('contentType').in(params)) ? params.contentType : false;
            let _str   = ($$.has('stringify').in(params)) ? params.stringify : false;
            let _cors  = ($$.has('cors').in(params)) ? params.cors : true;
            let _async = ($$.has('async').in(params)) ? params.async : true; /*default*/
            let _rest  = ($$.has('restful').in(params)) ? params.restful : false;
            let _auth  = ($$.has('authorization').in(params)) ? params.authorization : "";
            let _cred  = ($$.has('credentials').in(params)) ? params.credentials : false;

            /**
             * Global Settings to pagedTable
             */
            let user_agent = $$.navigator().user_agent.toLowerCase();
            let xhr        = null;

            /**
             * Generic Functions
             */
            function _checkin() {
                if (!_url) {
                    $$.log("ajax() error => Missing url !").error();
                    return false;
                }
                return true;
            }

            function _xhrInit() {
                /*IE*/
                if( user_agent.indexOf( 'msie' ) !== -1 ) {
                    /*IE Version >= 5*/
                    let ieBrowser = ( user_agent.indexOf( 'msie 5' ) !== -1 ) ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP';

                    try {
                        throw xhr = new ActiveXObject( ieBrowser );
                    } catch (err) {
                        $$.log("ajax() XMLHttpRequest failed: " + err + " : " + xhr).except();
                        return false;
                    }

                } else {
                    /*Mozilla, Firefox, Chrome, Netscape, Safari*/
                    xhr = new XMLHttpRequest();
                }

                if( xhr === null ) {
                    $$.log("ajax() XMLHttpRequest failed !").error();
                    return false;
                }
            }

            function _init() {
                /*Prevent Bug*/
                if(_xhrInit() === false) return;
            }

            function _restCheck(type) {
                let _get_ = [
                    '', /*none*/
                    'multipart/form-data',
                    'application/x-www-form-urlencoded',
                    'application/json'
                ];
                let _post_ = [
                    'multipart/form-data',
                    'application/x-www-form-urlencoded',
                    'application/json'
                ];
                let _put_ = [
                    'multipart/form-data',
                    'application/x-www-form-urlencoded',
                    'application/json'
                ];
                let _delete_ = [
                    '', /*none*/
                    'application/x-www-form-urlencoded'
                ];
                let _patch_ = [
                    '', /*none*/
                    'multipart/form-data',
                    'application/x-www-form-urlencoded',
                    'application/json'
                ];
                /*GET: Read*/
                if (type === 'GET') {
                    if (_data !== "") {
                        $$.exception("ajax(): GET is not allowed to send data parameters in body request !");
                    }
                    /*GET: /api/user/:[123456]*/
                    if (_url.search(/([a-zA-Z_-]+)(\/)([a-zA-Z_-]+)(\/)?([0-9a-zA-Z]+)?$/) === -1) {
                        $$.exception("ajax(): Invalid restful request url, see the documentation !");
                    }
                    if (!$$.inArray(_get_, _ctype)) {
                        $$.exception("ajax(): Invalid Content Type to restful request !");
                    }
                }
                /*POST: Create*/
                if (type === 'POST') {
                    if (_data === "") {
                        $$.exception("ajax(): Missing data parameters in restful body request [POST] !");
                    }
                    /*POST: /api/user {name: "Username", address: "Av. Enjoy 1234"}*/
                    if (_url.search(/([a-zA-Z_-]+)(\/)([a-zA-Z_-]+)$/) === -1) {
                        $$.exception("ajax(): Invalid restful request url, see the documentation !");
                    }
                    if (!$$.inArray(_post_, _ctype)) {
                        $$.exception("ajax(): Invalid Content Type to restful request !");
                    }
                }
                /*PUT: Update*/
                if (type === 'PUT') {
                    if (_data === "") {
                        $$.exception("ajax(): Missing data parameters in restful body request [PUT] !");
                    }
                    /*PUT: /api/user/123456 {name: "New Username LastName", address: "New Address, 123567"}*/
                    if (_url.search(/([a-zA-Z_-]+)(\/)([a-zA-Z_-]+)(\/)([0-9a-zA-Z]+)$/) === -1) {
                        $$.exception("ajax(): Invalid restful request url, see the documentation !");
                    }
                    if (!$$.inArray(_put_, _ctype)) {
                        $$.exception("ajax(): Invalid Content Type to restful request !");
                    }
                }
                /*DELETE*/
                if (type === 'DELETE') {
                    if (_data !== "") {
                        $$.exception("ajax(): DELETE is not allowed to send data parameters in body request !");
                    }
                    /*DELETE: /api/user/123456*/
                    if (_url.search(/([a-zA-Z_-]+)(\/)([a-zA-Z_-]+)(\/)([0-9a-zA-Z]+)$/) === -1) {
                        $$.exception("ajax(): Invalid restful request url, see the documentation !");
                    }
                    if (!$$.inArray(_delete_, _ctype)) {
                        $$.exception("ajax(): Invalid Content Type to restful request !");
                    }
                }
                /*PATCH*/
                if (type === 'PATCH') {
                    if (_data === "") {
                        $$.exception("ajax(): Missing data parameters in restful body request [PATCH] !");
                    }
                    if (_data.split('&').length > 1) {
                        $$.exception("ajax(): This method can be use only one parameter, see documentation !");
                    }
                    /*PATCH: /api/user/123456 {name: "NewName Username"}*/
                    if (_url.search(/([a-zA-Z_-]+)(\/)([a-zA-Z_-]+)(\/)([0-9a-zA-Z]+)$/) === -1) {
                        $$.exception("ajax(): Invalid restful request url, see the documentation !");
                    }
                    if (!$$.inArray(_patch_, _ctype)) {
                        $$.exception("ajax(): Invalid Content Type to restful request !");
                    }
                }
            }

            function  _open(type, url) {
                if (_rest) {
                    _restCheck(type);
                }

                /*Fix Data Object Request to HTTP Method GET*/
                if (type === 'GET') {
                    let _p_ = "?"+_data;
                    if (typeof _data === 'object') {
                        _p_ = $$.queryString(_data);
                    }
                    if (_p_ !== "?") {
                        url = url.replace(/\?.*$/gi, '') + _p_;
                    }
                }

                /*Fix Data Object to server send*/
                if (typeof _data === 'object' && type !== 'GET' && _str === true) {
                    _data = JSON.stringify(_data);
                }

                xhr.open(type, url, _async);

                /*Allow Cors*/
                if (_cors) {
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                }

                /*Content Type Send To Server*/
                if (_ctype) {
                    xhr.setRequestHeader("Content-type", _ctype);
                }

                /*Authorization Send To Server*/
                if (_auth !== "") {
                    xhr.setRequestHeader("Authorization", _auth);
                }

                /*Send Credentials Data*/
                if (_cred === true) {
                    xhr.withCredentials = true;
                }

                /*Data Type From Server*/
                if (_dtype && _async) {
                    xhr.responseType = _dtype;
                }
            }

            function _request(fns, fne) {

                if (_async) {

                    /*Async*/
                    xhr.addEventListener("readystatechange", function() {
                        if (xhr.readyState === 4 || xhr.readyState === 0 || xhr.readyState === "complete") {
                            if (xhr.status >= 200 && xhr.status < 400) {
                                if(typeof fns === 'function') {
                                    try {
                                        receiver = xhr.response;
                                    } catch (er) {
                                        try {
                                            receiver = xhr.responseText;
                                        } catch (er) {
                                            receiver = {
                                                error: true,
                                                status: xhr.status,
                                                text: "Async Response Error (see the documentation): " + er
                                            };
                                        }
                                    }
                                    fns(receiver);
                                } else {
                                    $$.log("ajax() error => Callback success is not a function").error();
                                }
                            } else {
                                if(typeof fne === 'function') {
                                    try {
                                        receiver = JSON.parse(xhr.response);
                                    } catch (er) {
                                        receiver = xhr.responseText;
                                    }
                                    fne(receiver);
                                } else {
                                    $$.log("ajax() error => Callback error is not a function").error();
                                }
                            }
                        }
                    });

                } else {

                    /*Sync*/
                    xhr.onload = function() {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            if(typeof fns === 'function') {
                                try {
                                    receiver = JSON.parse(xhr.response);
                                } catch (er) {
                                    try {
                                        receiver = xhr.responseText;
                                    } catch (er) {
                                        receiver = {
                                            error: true,
                                            status: xhr.status,
                                            text: "Sync Response Error (see the documentation): " + er
                                        };
                                    }
                                }
                                fns(receiver);
                            }
                        } else {
                            if(typeof fne === 'function') {
                                try {
                                    receiver = JSON.parse(xhr.response);
                                    // fne(JSON.parse(xhr.response));
                                } catch (er) {
                                    receiver = xhr.responseText;
                                    // fne(xhr.responseText);
                                }
                                fne(receiver);
                            }
                        }
                    }
                }
            }

            function _send(data = true) {
                if (!data) {
                    xhr.send()
                } else {
                    xhr.send(_data)
                }
            }

            /**
             * HTTP-Method (Verb) Functions
             */
            function _get(fns, fne) {
                _open("GET", _url);
                _request(fns, fne);
                _send(false);
            }

            function _post(fns, fne) {
                _open("POST", _url);
                _request(fns, fne);
                _send(true);
            }

            function _put(fns, fne) {
                _open("PUT", _url);
                _request(fns, fne);
                _send(true);
            }

            function _delete(fns, fne) {
                _open("DELETE", _url);
                _request(fns, fne);
                _send(true);
            }

            function _patch(fns, fne) {
                _open("PATCH", _url);
                _request(fns, fne);
                _send(true);
            }

            /**
             * Ajax Init
             */
            try {
                if (_checkin()) {
                    _init();
                }
            } catch (err) {
                $$.log("ajax() error => " + err).except();
            }

            /*CRUD & REST Feature*/
            return {"get":_get,"post":_post,"put":_put,"delete":_delete,"patch":_patch};

        },

        /**
         * @description Do an fast request by HTTP GET Method
         * @param {object} _url (object: Mandatory)
         * @returns {object} (object: Response in format JSON)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        requester: function(_url) {
            let response = null;
            $$.ajax({
                url: _url,
                async: false,
                cors: true
            }).get(
                function(r) {
                    response = r;
                },
                function(e) {
                    $$.log("requester() error => " + e).error();
                });
            let _json_ = JSON.parse(response);
            if (typeof _json_ === 'object' && typeof response === 'string') {
                receiver = _json_;
                return _json_;
            } else {
                receiver = response;
                return response;
            }
        },

        /**
         * @description Restful, to make an requests following restful rules
         * @param {string} _url (string: Mandatory)
         * @param {boolean} _async (boolean: Optional)
         * @param {undefined} _auth (undefined: Optional)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use
         *     $$.restful("https://app.com/api/product", true, TOKEN).get();
         *     $$.restful("https://app.com/api/product/1", true, TOKEN).get();
         *     $$.restful("https://app.com/api/product", true, TOKEN).post({data/json});
         *     $$.restful("https://app.com/api/product/1", true, TOKEN).put({data/json/full});
         *     $$.restful("https://app.com/api/product/1", true, TOKEN).delete();
         *     $$.restful("https://app.com/api/product/1", true, TOKEN).patch({data/json/partial});
         */
        restful: function(_url, _async = false, _auth = undefined) {
            let args = {
                url: _url,
                async: _async,
                cors: true,
                restful: true,
                dataType: "json",
                contentType: "application/json",
                stringify: true,
                authorization: _auth,
                credentials: false,
            };

            function _ok(response) {
                if (!$$.isDefined(response) || $$.empty(response)) return null;
                try {
                    return JSON.parse(response);
                } catch (er) {
                    return response;
                }
            }

            function _error(e) {
                $$.log("restful() error => " + e).error();
            }

            function _get() {
                $$.ajax(args).get(_ok, _error);
            }

            function _delete() {
                $$.ajax(args).delete(_ok, _error);
            }

            function _post(data = undefined) {
                args["data"] = data;
                $$.ajax(args).post(_ok, _error);
            }

            function _put(data = undefined) {
                args["data"] = data;
                $$.ajax(args).put(_ok, _error);
            }

            function _patch(data = undefined) {
                args["data"] = data;
                $$.ajax(args).patch(_ok, _error);
            }

            return {
                "get": _get,
                "post": _post,
                "put": _put,
                "delete": _delete,
                "patch": _patch
            };
        },

        /**
         * @description Receiver an response from any process in the jshunter library
         * @returns {string} (string: Any data from response)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        receiver: function() {
            recCtrl = setInterval(function() {
                if (receiver !== null) {
                    clearInterval(recCtrl);
                    return receiver;
                }
            }, 1000);
        },

        /**
         * @description Promise (resolve, reject)
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        promise: function(params = {}) {
            let timeout = ($$.is(params.timeout).num()) ? (params.timeout * 1000) : 0;
            let debug = ($$.has('debug').in(params)) ? params.debug : false;

            let prm = null;
            let prm_list = [];
            let data_log = null;

            function _run(fn, args = "") {
                prm = new Promise(async function(resolve, reject) {
                    await fn(resolve, reject, args);
                    if (timeout > 0) {
                        setTimeout(function() {
                            reject("Promise Timeout !")
                        }, timeout);
                    }
                });
                data_log = prm;
                return {"then":_then, "log": _log};
            }

            function _promises(arr = []) {
                for (let i = 0; i < arr.length; i++) {
                    prm_list.push(new Promise(async function(resolve, reject){
                        await arr[i](resolve, reject);
                    }));
                }
                data_log = prm_list;
            }

            function _all(arr = []) {
                _promises(arr);
                prm = Promise.all(prm_list);
                return {"then":_then, "log": _log};
            }

            function _ignore(arr = []) {
                _promises(arr);
                prm = Promise.allSettled(prm_list);
                return {"then":_then, "log": _log};
            }

            function _race(arr = []) {
                _promises(arr);
                if (timeout > 0) {
                    prm_list.push(new Promise(async function(resolve, reject) {
                        setTimeout(function() {
                            reject("Promise race Timeout !");
                        }, timeout);
                    }));
                }
                prm = Promise.race(prm_list);
                return {"then":_then, "log": _log};
            }

            function _then(arr = []) {
                let fnf = function(arg) {return arg;};/*first*/
                let fns = function(arg) {return arg;};/*success*/
                let fne = function(arg) {return arg;};/*error|exception*/
                if (arr.length === 0) return;
                if (arr.length === 1) {
                    fns = arr[0];
                }
                if (arr.length === 2) {
                    fns = arr[0];
                    fne = arr[1];
                }
                if (arr.length === 3) {
                    fnf = arr[0];
                    fns = arr[1];
                    fne = arr[2];
                }

                prm.then(function(success) {
                        if ($$.is(fnf).function()) {
                            return fnf(success);
                        }
                        return success;
                    }, function(error) {
                        throw error;
                    })
                    .then(function(success) {
                        if (debug) {
                            $$.log("Promise Success: " + success).print("cyan");
                        }
                        if ($$.is(fns).function()) {
                            fns(success);
                        }
                    }, function(error) {
                        if (debug) {
                            $$.log("Promise Error: " + error).print("red");
                        }
                        if ($$.is(fne).function()) {
                            fne(error);
                        }
                    }).catch(function(except) {
                        if (debug) {
                            $$.log("Promise Except: " + except).except();
                        }
                        if ($$.is(fne).function()) {
                            fne(except);
                        }
                    });
            }

            function _log() {
                $$.log("[Promise Logger]").print("orange");
                $$.log(data_log).log();
            }

            return {"run": _run, "all": _all, "ignore": _ignore, "race": _race};
        },

        /**
         * @description Redirect an request to any url destiny
         * @param {string} url (string: Mandatory)
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        redirect: function(url) {
            window.location.href = url;
        },

        /**
         * @description Open, open a new tab window parametrized
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        open: function(params= {}) {
            let toolbar = (params.toolbar === true) ? "yes" : "no";
            let scrollbars = (params.scrollbars) ? "yes" : "no";
            let resize = (params.resize) ? "yes" : "no";
            let top_pos = params.top || 0;
            let left_pos = params.left || 0;
            let size = params.size || "500x500";
            let width = size.split("x")[0];
            let height = size.split("x")[1];
            let features =
                "toolbar="+toolbar+"," +
                "scrollbars="+scrollbars+"," +
                "resizable="+resize+"," +
                "top="+top_pos+"," +
                "left="+left_pos+"," +
                "width="+width+"," +
                "height="+height+"";

            function _url(url) {
                window.open(
                    url,
                    params.target,
                    features);
            }
            function _write(data) {
                let myWin = window.open(
                    "",
                    params.target,
                    features);
                myWin.document.write(data);
            }
            return {"url": _url, "write": _write};
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: PROPERTIES HANDLER
         --------------------------------------------------------------------------------
         */

        /**
         * @description Check if key name exists in any data object
         * @param {string} param_name (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        has: function(param_name) {
            function _in(name) {
                try {
                    return name.hasOwnProperty(param_name);
                } catch (er) {
                    try {
                        return name.hasOwnProperty(param_name);
                    } catch (ex) {
                        $$.log("has() error => Missing property name: [" + param_name + "]").error();
                        $$.log("Exception: " + ex).print("orange");
                    }
                }
            }
            return {"in":_in};
        },

        /**
         * @description Set property and value to any <HTMLElement> in current DOM
         * @param {string} type (string: Mandatory)
         * @param {undefined} value (undefined: Mandatory)
         * @returns {this} (this.property: The props required)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        props: function(type, value) {
            return this.attr(type, value);
        },

        /**
         * @description Set attributes to any <HTMLElement> in current DOM
         * @param {string} type (string: Mandatory)
         * @param {string|object} value (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        attr: function(type, value) {
            try {
                let _sel = this.sel;
                (_sel && (typeof  _sel === "object" || Array.isArray(_sel))) ?
                    (function() {
                        _doAttr(_sel, type, value, "nodeList");
                    })() : (_sel) ?
                    (function(){
                        _doAttr(_sel, type, value, "node");
                    })() : jsHunter.fn.exception("attr() error " + type);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set or adjust (dynamic) an element size (after calculate) in the screen
         * @param {object} params (object: Mandatory)
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        screenSizer: function(params = {}) {
            sizeCtrl = setInterval(function() {
                let s = $$.screen();
                let w = 0;
                let h = 0;
                /*Width*/
                if(params.hasOwnProperty('width') && params.width.hasOwnProperty('calc')) {
                    w = Math.ceil(100 - (($$.intNumber(params.width.calc) / s.width) * 100)) + (params.width.adjust || 0);
                    w = w + "%";
                } else if(params.hasOwnProperty('width') && params.width.hasOwnProperty('fixed')) {
                    w = params.width.fixed;
                } else {
                    $$.log("Invalid value to parameter width in function screenSizer()").except();
                }
                /*Height*/
                if(params.hasOwnProperty('height') && params.height.hasOwnProperty('calc')) {
                    h = Math.ceil(100 - (($$.intNumber(params.height.calc) / s.height) * 100)) + (params.height.adjust || 0);
                    h = h + "%";
                } else if(params.hasOwnProperty('height') && params.height.hasOwnProperty('fixed')) {
                    h = params.height.fixed;
                } else {
                    $$.log("Invalid value to parameter height in function screenSizer()").except();
                }

                jH(params.target).width(w);
                jH(params.target).height(h);

                //console.log("screenSizer", w, h);

            }, 500);

            if(params.state === false) {
                clearInterval(sizeCtrl);
            }

            if(params.timeout > 0) {
                setTimeout(function() {
                    clearInterval(sizeCtrl);
                }, params.timeout);
            }
            return null;
        },

        /**
         * @description Stop a screenSizer() function execution if needed
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        screenSizerStop: function() {
            clearInterval(sizeCtrl);
            return null;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: EVENTS LISTENER
         --------------------------------------------------------------------------------
         */

        /**
         * @description Password, show and hide password text on any HTMLElement<input>
         * @param {string} target (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        password: function(target) {
            function _mouseover() {
                jH(target).on('mouseover', function (e) {
                    jH(target).attr("type", "text");
                });
                jH(target).on('mouseout', function (e) {
                    jH(target).attr("type", "password");
                });
            }
            function _mouseclick() {
                jH(target).on('click', function (e) {
                    if (e.target.type === 'password') {
                        jH(target).attr("type", "text");
                    } else {
                        jH(target).attr("type", "password");
                    }
                });
            }
            try {
                if ($$.findId(target)) {
                    return {"mouseover": _mouseover, "mouseclick": _mouseclick};
                } else {
                    throw "password() error => Target Not Found: " + target;
                }
            } catch(er) {
                $$.log(er).except();
            }
        },

        /**
         * @description Set fastly an click event to one or more HTMLElements
         * @param {string} param (string: Mandatory)
         * @param {function} callback (function: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        click: function(param = "", callback) {
            let _sel = this.sel;
            let keys = Object.keys(_sel);
            (keys.length > 0) ?
                keys.forEach(function(index) {
                    try {
                        _sel[index].removeEventListener("click", jsHunter.fn.noth);
                    } catch (ex) {
                        $$.log("1: click() error => " + ex).except();
                    }
                    _sel[index].addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.info("click-1");
                    });
                }) : (_sel) ? (function(){
                    try {
                        _sel.removeEventListener("click", jsHunter.fn.noth);
                    } catch (ex) {
                        $$.log("2: click() error => "+ ex).except();
                    }
                    _sel.addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.info("click-2");
                    })
                })()
                 : jsHunter.fn.exception("click() error => " + _sel);
            return this;
        },

        /**
         * @description Check state of the HTMLElement target
         * @param {object} params (object: Mandatory)
         * @param {number} index (number: Optional)
         * @returns {boolean} (boolean: True or False based on required type)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        isOn: function(params = {}, index) {
            let _sel    = this.sel;
            let keys    = Object.keys(_sel);
            let state   = false;
            let element = (keys.length > 0) ? _sel[index] : _sel;
            try {
                (!params || typeof params === undefined) ?
                    jsHunter.fn.exception("isOn() error: missing params !") :

                    (params.type === "classname") ?
                        (element.className.search(params.value) >= 0) ?
                            state=true : state=false :

                        (params.type === "id") ?
                            (element.id === params.value) ?
                                state=true : state=false :

                            (params.type === "disabled") ?
                                (element.disabled === params.value) ?
                                    state=true : state=false :

                                (params.type === "checked") ?
                                    (element.checked === params.value) ?
                                        state=true : state=false :

                                jsHunter.fn.exception("isOn() error: invalid params -> " + params.type);
            } catch(err) {
                console.error(err);
            }
            return state;
        },

        /**
         * @description Remove any register event in one or more HTMLElements
         * @param {string} ev (string[:event]: Mandatory)
         * @param {function} listener (function: Recommended)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        unbind: function(ev, listener) {
            let _sel = this.sel;
            let keys = (_sel) ? Object.keys(_sel) : "";
            try {
                (keys.length > 0) ?
                    keys.forEach(function(index) {
                        try {
                            _sel[index].removeEventListener(ev||'click', listener||jsHunter.fn.on);
                        } catch (ex) {
                            console.exception("exception...");
                        }
                    }) : (_sel) ?
                        (function(){
                            try {
                                _sel.removeEventListener(ev||'click', listener||jsHunter.fn.on);
                            } catch (ex) {
                                console.exception("exception...");
                            }
                        })() : jsHunter.fn.exception("unbind() error: check your calling: "+ev);

            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Create a event in current DOM to one or more HTMLElements
         * @param {string} ev (string[:event]: Mandatory)
         * @param {function} callback (function: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        on: function(ev, callback) {
            let _sel = this.sel;
            let args = this.args;
            let keys = (_sel) ? Object.keys(_sel) : "";
            try {
                (keys.length > 0) ?
                    keys.forEach(function(index) {
                        try {
                            _sel[index].removeEventListener(ev||'click', jsHunter.fn.on||callback);
                        } catch (ex) {
                            $$.log("on() error => " + ex + ", selector: " + this.selector).except();
                        }
                        _sel[index].addEventListener(ev, function(e){
                            window.$$this = e.target;
                            if (ev.search(/(check|keypress|keyup|keydown)/gi) === -1) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            callback((args === undefined) ? e :
                                (args.rsp === 'eventTarget' || args.rsp === 'target') ?
                                    jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel[index]));
                        });
                    }) : (_sel) ?
                    (function(){
                        try {
                            _sel.removeEventListener(ev||'click', jsHunter.fn.on||callback);
                        } catch (ex) {
                            $$.log("on() error => " + ex + ", selector: " + this.selector).except();
                        }
                        _sel.addEventListener(ev, function(e){
                            window.$$this = e.target;
                            if (ev.search(/(check|keypress|keyup|keydown)/gi) === -1) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            callback((args === undefined) ? e :
                                (args.rsp === 'eventTarget' || args.rsp === 'target') ?
                                    jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel));
                        })
                    })() :
                        $$.log("on() error => check your calling:" + ev + ", selector: " + this.selector).except();

            } catch(err) {
                $$.log("on() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Use specific to checkbox elements
         * @param {string} ev (string[:event]: Mandatory)
         * @param {function} callback (function: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        check: function(ev, callback) {
            let _sel = this.sel;
            let args = this.args;
            let keys = (_sel) ? Object.keys(_sel) : "";
            try {
                (keys.length > 0) ?
                    keys.forEach(function(index) {
                        try {
                            _sel[index].removeEventListener(ev, jsHunter.fn.noth);
                        } catch (ex) {
                            $$.log("check() error => " + ex + ", selector: " + this.selector).except();
                        }
                        _sel[index].addEventListener(ev, function(e){
                            window.$$this = e.target;
                            callback(e);
                        });
                    }) : (_sel) ?
                        (function(){
                            try {
                                _sel.removeEventListener(ev, jsHunter.fn.noth);
                            } catch (ex) {
                                $$.log("check() error => " + ex + ", selector: " + this.selector).except();
                            }
                            _sel.addEventListener(ev, function(e){
                                window.$$this = e.target;
                                callback(e);
                            })
                        })() :
                            $$.log("on() error => check your calling:" + ev + ", selector: " + this.selector).except();

            } catch(err) {
                $$.log("check() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Check if element is checked (radio, checkbox...)
         * @returns {boolean} (boolean: True or False to checkbox = checked)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        isChecked: function() {
            let state = false;
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        if (_sel[index].checked === true) {
                            state = true;
                        }
                    }) : (_sel) ?
                        (function(){
                            if (_sel.checked === true) {
                                state = true
                            }
                        })() : jsHunter.fn.exception("isChecked() error " + _sel);
            } catch(err) {
                $$.log("isChecked() error => " + err).except();
            }
            return state;
        },

        /**
         * @description Submit an <HTMLElement:form>
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        submit: function() {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].submit();
                    }) : (_sel) ?
                        _sel.submit() : jsHunter.fn.exception("submit() error " + _sel);
            } catch(err) {
                $$.log("submit() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Reset one or more <HTMLElement:form> elements
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        reset: function() {
            let _sel = this.sel;
            let keys = Object.keys(_sel);

            keys.forEach(function(index) {
                if (_sel[index].tagName.toUpperCase() === "FORM") {
                    _sel[index].reset();
                } else {
                    jsHunter.fn.exception("reset() error, HTMLElement:Form is required !")
                }
            });

            return this;
        },

        /**
         * @description Form, get all data from any <HTMLElement:form> element
         * @param {string} form (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        form: function(form) {
            let targets = [
                "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month",
                "number", "password", "radio", "range", "search", "tel", "text", "time", "url", "week",
                "label", "fieldset", "button"
            ];
            let get_fields = null;
            let tmp = [];
            let files = [];
            let serialized = "";
            let pusher = {};
            let pusher_files = {};
            let json_assert = {};
            let files_assert = {};

            function dataPrepare(file = false) {

                function populateArray(_key) {
                    for (let i = 0; i < tmp.length; i++) {
                        for (let j = 0; j < tmp[i].length; j++) {
                            let _key_ = (tmp[i][j].name || tmp[i][j].id).replace(/[\["\]]/gi, "");
                            if (_key_ === _key) {
                                if (tmp[i][j].type === 'radio' || tmp[i][j].type === 'checkbox') {
                                    if (tmp[i][j].checked === true) {
                                        pusher[_key].push(tmp[i][j].value);
                                    }
                                } else if (tmp[i][j].value !== "") {
                                    pusher[_key].push(tmp[i][j].value);
                                }
                            }
                        }
                    }
                }

                function assertArray() {
                    Object.keys(pusher).forEach(function(item, index, array) {
                        if (pusher[item].length === 1) {
                            json_assert[item] = pusher[item][0];
                        } else if (pusher[item].length > 1) {
                            json_assert[item] = pusher[item];
                        }
                    });
                }

                function populateArrayFiles(_key) {
                    for (let i = 0; i < files.length; i++) {
                        for (let j = 0; j < files[i].length; j++) {
                            let _key_ = (files[i][j].name || files[i][j].id).replace(/[\["\]]/gi, "");
                            if (_key_ === _key && files[i][j].files[0] !== "") {
                                pusher_files[_key].push(files[i][j].files[0]);
                            }
                        }
                    }
                }

                function assertArrayFiles() {
                    Object.keys(pusher_files).forEach(function(item, index, array) {
                        if (pusher_files[item].length === 1) {
                            files_assert[item] = pusher_files[item][0];
                        } else if (pusher_files[item].length > 1) {
                            files_assert[item] = pusher_files[item];
                        }
                    });
                }

                (function captureTargets() {
                    try {
                        /*Input*/
                        targets.forEach(function (item, index, array) {
                            try {
                                get_fields = document.querySelectorAll(form + " input[type=" + item + "]");
                                if (get_fields.length > 0) {
                                    if (item === 'file' && file === true) {
                                        files.push(get_fields);
                                    } else {
                                        tmp.push(get_fields);
                                    }
                                }
                            } catch (er) {
                                $$.noth();
                            }
                        });
                        /*Textarea*/
                        get_fields = document.querySelectorAll(form + " textarea");
                        if (get_fields.length > 0) {
                            tmp.push(get_fields);
                        }
                        /*Select*/
                        get_fields = document.querySelectorAll(form + " select");
                        if (get_fields.length > 0) {
                            tmp.push(get_fields);
                        }
                        /*Buttons*/
                        get_fields = document.querySelectorAll(form + " button");
                        if (get_fields.length > 0) {
                            tmp.push(get_fields);
                        }
                    } catch (er) {
                        $$.noth();
                    }
                })();

                (function mapperTargets() {
                    if (tmp.length === 0) return;

                    tmp.forEach(function(it, id, ar) {
                        for (let i = 0; i < it.length; i++) {
                            let kn = (it[i].name || it[i].id).replace(/[\["\]]/gi, "");
                            pusher[kn] = [];
                            populateArray(kn);
                        }
                    });

                    assertArray();
                })();

                (function mapperTargetsFiles() {
                    if (files.length === 0) return;

                    files.forEach(function(it, id, ar) {
                        for (let i = 0; i < it.length; i++) {
                            let kn = (it[i].name || it[i].id).replace(/[\["\]]/gi, "");
                            pusher_files[kn] = [];
                            populateArrayFiles(kn);
                        }
                    });

                    assertArrayFiles();
                })();
            }

            function _json() {
                dataPrepare();
                return json_assert;
            }

            function _stringify() {
                dataPrepare();
                return JSON.stringify(json_assert);
            }

            function _serialize(enc = false) {
                dataPrepare();
                Object.keys(json_assert).forEach(function(item, index, array) {
                    serialized += "&" + item.toString() + "=" + json_assert[item];
                });

                if (enc === true) {
                    return encodeURIComponent(serialized.replace(/^&/, ""));
                }
                return serialized.replace(/^&/, "");
            }

            function _attach(action = undefined, blank = false) {
                jH(form).attr("method", "POST");
                jH(form).attr("enctype", "multipart/form-data");

                if (action) {
                    jH(form).attr("action", action);
                    if (blank === true) {
                        jH(form).attr("target", "_blank");
                    }
                    setTimeout(function() {
                        jH(form).submit();
                    }, 300)
                } else {
                    dataPrepare(true);
                    let fd = new FormData();
                    fd.append("action_name", "send_files")

                    Object.keys(json_assert).forEach(function (item, index, array) {
                        fd.append(item.toString(), json_assert[item]);
                    });

                    Object.keys(files_assert).forEach(function (item, index, array) {
                        for (let i = 0; i < files_assert[item].length; i++) {
                            if (files_assert[item][i]) {
                                fd.append(item.toString()+"-"+i, files_assert[item][i]);
                            }
                        }
                    });

                    return fd;
                }
            }

            return {"json": _json, "stringify": _stringify,  "serialize": _serialize, "attach": _attach};
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: WRITERS AND MODIFIERS
         --------------------------------------------------------------------------------
         */

        /**
         * @description Erase a content on target <HTMLElement>
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        erase: function() {
            try {
                let _selector = this.selector;
                jH(_selector).html('');
            } catch(err) {
                $$.log("erase() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Write/Reset a content to any <HTMLElement>
         * @param {string} data (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        html: function(data) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML = data;
                    }) : (_sel) ?
                        _sel.innerHTML = data : jsHunter.fn.exception("html() error " + _sel);
            } catch(err) {
                $$.log("html() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Write/Add a content to any <HTMLElement>
         * @param {string} data (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        append: function(data) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML += data;
                    }) : (_sel) ?
                    _sel.innerHTML += data : jsHunter.fn.exception("append() error " + _sel);
            } catch(err) {
                $$.log("append() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Set any className to any <HTMLElement>
         * @param {string} classname (string: Mandatory)
         * @param {number} index (number: Optional)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        addClass: function(classname, index = undefined) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            /*console.log("addClass", classname, _sel, keys, element, jh_nodes, jh_node, index);*/
            try {
                if((index || index >=0) && jh_nodes.length > 0) {
                    /*console.log("IF1");*/
                    if(!jsHunter.fn.matchClass(jh_nodes[index], classname)) {
                        jh_nodes[index].className += " " + classname;
                        jh_nodes[index].className = jsHunter.fn.trim(jh_nodes[index]);
                    }
                } else if(jh_nodes !== null && jh_nodes.length > 1 && !index) {
                    /*console.log("IF2");*/
                    jh_nodes.forEach(function(inode) {
                        try {
                            if (!jsHunter.fn.matchClass(inode, classname)) {
                                inode.className += " " + classname;
                                inode.className = jsHunter.fn.trim(inode.className);
                            }
                        } catch (err) {
                            jsHunter.fn.exception("addClass() error => " + err);
                        }
                    });
                } else if(jh_node !== "") {
                    /*console.log("IF3");*/
                    if(!jsHunter.fn.matchClass(jh_node, classname)) {
                        jh_node.className += " " + classname;
                        jh_node.className = jsHunter.fn.trim(jh_node.className);
                    }
                } else if(element.length > 0) {
                    /*console.log("IF4");*/
                    keys.forEach(function(inode) {
                        if(!jsHunter.fn.matchClass(element[inode], classname)) {
                            element[inode].className += " " + classname;
                            element[inode].className = jsHunter.fn.trim(element[inode].className);
                        }
                    });
                } else if(element && element.length > 0) {
                    /*console.log("IF5");*/
                    if(!jsHunter.fn.matchClass(element, classname)) {
                        element.className += " " + classname;
                        element.className = jsHunter.fn.trim(element.className);
                    }
                } else {
                    /*console.log("ELSE");*/
                    jsHunter.fn.exception("addClass() error, jh_nodes and selector is undefined !");
                }
            } catch(err) {
                $$.log("addClass() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Remove a className from any <HTMLElement>
         * @param {string} classname (string: Mandatory)
         * @param {number} index (number: Optional)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        removeClass: function(classname, index = undefined) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if (element.length > 0) {
                    keys.forEach(function(item, index, array) {
                        element[index].classList.remove(classname);
                    });
                } else {
                    (index || index >= 0) && (jh_nodes.length > 0) ?
                        jh_nodes[index].classList.remove(classname) :
                        (jh_nodes.length > 0) && (!index) ?
                            jh_nodes.forEach(function(inode) {
                                inode.classList.remove(classname);
                            }) : (jh_node) ?
                                jh_node.classList.remove(classname) :
                                $$.log("removeClass() error => jh_nodes is undefined !").except();
                }
            } catch(err) {
                $$.log("removeClass() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Set one className to any <HTMLElement>
         * @param {string} classname (string: Mandatory)
         * @param {number} index (number: Optional)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        setClass: function(classname, index = undefined) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >=0) && jh_nodes.length > 0) { console.log("IF1");
                    jh_nodes[index].className = classname;
                } else if(jh_nodes.length > 0 && !index) { console.log("IF2");
                    jh_nodes.forEach(function(inode) {
                        inode.className = classname;
                    });
                } else if(jh_node) { console.log("IF3");
                    jh_node.className = classname;
                } else if(element.length > 0) { console.log("IF4");
                    keys.forEach(function(inode) {
                        element[inode].className = classname;
                    });
                } else if(element) { console.log("IF5");
                    element.className = classname;
                } else { console.log("ELSE");
                    jsHunter.fn.exception("setClass() error, jh_nodes and selector is undefined !");
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Reset css styles in one or more HTMLElements
         * @param {number} index (number: Optional)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        resetStyle: function(index = undefined) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >= 0) && jh_nodes.length >0) {
                    jh_nodes[index].className = "";
                } else if(jh_nodes.length > 0 && !index) {
                    jh_nodes.forEach(function(inode) {
                        inode.className = "";
                    });
                } else if(jh_node) {
                    jh_node.className = "";
                } else if(element.length > 0) {
                    keys.forEach(function(inode) {
                        element[inode].className = "";
                    });
                } else if(element) {
                    element.className = "";
                } else {
                    jsHunter.fn.exception("resetStyle() error, jh_nodes is undefined !")
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Create a complete <HTMLElement> on DOM
         * @param {object} params (object: Mandatory)
         * @param {string|object} text (string|object: Optional)
         * @returns {object} (object: Mixed Data Object Type)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        create: function(params = {}, text = "") {
            let el = _createHtmlElement(params);
            if (text !== "") {
                el.innerHTML = text;
            }
            try {
                (params.hasOwnProperty('timeout') && params.timeout > 0) ?
                    (function() {
                        setTimeout(function() {
                            if ($$.has('append').in(params)) {
                                $$.remove(params.append, params.attr_name);
                            } else {
                                $$.remove(params.before, params.attr_name);
                            }
                        }, params.timeout);
                    })() : jsHunter.fn.noth();
            } catch (e) {
                $$.log("create() error => " + e).except();
            }
            return el;
        },

        /**
         * @description Insert a new element in any HTMLElement target
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        insert: function(element) {
            let parent = null;
            let first_child = null;
            function _set(p) {
                parent = jH(p).select();
                first_child = parent.firstChild;
            }
            function _first(p) {
                _set(p);
                parent.insertBefore(element, first_child);
            }
            function _last(p) {
                _set(p);
                parent.appendChild(element);
            }
            return {"first": _first, "last": _last};
        },

        /**
         * @description Set one or more attributes on any <HTMLElement>
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        set: function(params = {}) {
            let keys = Object.keys(params);
            let values = Object.values(params);
            let len = Object.keys(params).length;

            function _in(element) {
                try {
                    let query = jH(element).select();
                    let size  = ($$.toArray(query)).length;

                    if (size > 1) {
                        try {
                            query.forEach(function (item, index, array) {
                                if (typeof params === "object") {
                                    for (let i = 0; i < len; i++) {
                                        query[index].setAttribute(keys[i], values[i]);
                                    }
                                } else {
                                    $$.log("set:_in() error => Invalid Object Params" + params).error();
                                }
                            });
                        } catch (e) {
                            query.setAttribute(keys[0], values[0].toString());
                        }
                    } else {
                        if (typeof params === "object") {
                            for (let i = 0; i < len; i++) {
                                query.setAttribute(keys[i], values[i].toString());
                            }
                        } else {
                            $$.log("set:_in() error => Invalid Object Params" + params).error();
                        }
                    }
                } catch(err) {
                    $$.log("set:_in() error => " + err).except();
                }
            }
            return {"in": _in};
        },

        /**
         * @description Remove one element children from parent
         * @param {string} parent (string: Mandatory)
         * @param {string} children (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        remove: function(parent, children) {
            let _el_ = document.querySelectorAll(parent);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].removeChild(document.querySelector(children));
            });

            return this;
        },

        /**
         * @description Remove one element children from parent
         * @param {string} child (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        removeChild: function(child) {
            function _from(parent) {
                let _p_ = document.querySelectorAll(parent);
                let _c_ = document.querySelectorAll(parent + " " + child);

                Object.keys(_p_).forEach(function(item, index, array) {
                    Object.keys(_c_).forEach(function(_item, _index, _array) {
                        _p_[item].removeChild(_c_[_item]);
                    });
                });
            }
            return {"from": _from};
        },

        /**
         * @description Restart one or more elements, remove all children
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        restart: function() {
            let _sel = this.sel;
            let keys = Object.keys(_sel);

            keys.forEach(function(index) {
                let _child = _sel[index].childNodes;
                Object.keys(_child).forEach(function(child) {
                    _sel[index].removeChild(_child[child]);
                });
            });

            return this;
        },

        /**
         * @description Set or Get a cookie on current document
         * @param {string} name (string: Mandatory)
         * @returns object
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        cookie: function(name) {
            function set(value) {
                setCookie(name, value, 365);
            }
            function get() {
                return getCookie(name);
            }
            function remove() {
                setCookie(name, "", "_delete_");
            }
            return {"remove": remove, "set": set, "get": get};
        },

        /**
         * @description Storage, Set or Get a value on local storage in the current document
         * @param {string} name (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        storage: function(name) {
            function set(value) {
                localStorage.setItem(name, value);
            }
            function get() {
                return localStorage.getItem(name);
            }
            function remove() {
                localStorage.removeItem(name);
            }
            return {"remove": remove, "set": set, "get": get};
        },

        /**
         * @note Just work in [SecureContext] HTTPS
         * @description Copy, get a text into current document
         * @param {string} target_copy {string: Mandatory}
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        copy: async function(target_copy) {
            let tc = jH(target_copy).select();
            try {
                await navigator.clipboard.writeText(tc.value || tc.textContent).then(r => 'Copied!');
            } catch (err) {
                jsHunter.fn.exception("copy() error: => " + err);
            }
            return this;
        },

        /**
         * @description Cut any <HTMLElement> from DOM defined by parent element
         * @param {object} params (object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)|string
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        cut: function(params = {}) {
            let keys = Object.keys(params);
            let values = Object.values(params);
            let len = Object.keys(params).length;

            function _in(element) {
                try {
                    let query = jH(element).select();
                    let size  = ($$.toArray(query)).length;

                    if (size && size > 0) {
                        query.forEach(function(item, index, array) {
                            console.log(item, index, query[index]);
                            if (typeof params === "object") {
                                for (let i = 0; i < len; i++) {
                                    query[index].setAttribute(keys[i], values[i]);
                                }
                            } else {
                                $$.log("set:_in() error => Invalid Object Params" + params).error();
                            }
                        });
                    } else {
                        if (typeof params === "object") {
                            for (let i = 0; i < len; i++) {
                                query.setAttribute(keys[i], values[i].toString());
                            }
                        } else {
                            $$.log("set:_in() error => Invalid Object Params" + params).error();
                        }
                    }
                } catch(err) {
                    $$.log("set:_in() error => " + err).except();
                }
            }
            return {"in": _in};
        },

        /**
         * @note Just work in [SecureContext] HTTPS
         * @description Paste, recovery text copied previous
         * @param {string} target_paste (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        paste: async function(target_paste) {
            try {
                await navigator.clipboard.readText()
                    .then((text) => jH(target_paste).html(text));
            } catch (err) {
                jsHunter.fn.exception("paste() error: => " + err);
            }
            return this;
        },

        /**
         * @description Map and writer a data object
         * @param {object} obj (object: Mandatory)
         * @param {object} params (object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        objWriter: function(obj, params) {/*For developers, use together with jsHunter.css*/
            try {

                let _sel = this.sel;

                if(!obj || typeof obj !== "object") {
                    jsHunter.fn.exception("Invalid data (object) for this function !");
                } else if(!_sel) {
                    jsHunter.fn.exception("Wrong or missing selector !");
                } else if(_sel.length > 1) {
                    jsHunter.fn.exception("Wrong type to selector, accepted #id !");
                } else {

                    if(!params || typeof params === "undefined") {params = {};}

                    /*Progress controls*/
                    if(params.hasOwnProperty("progress") && params.progress === false) {
                        _sel[0].innerHTML = "";
                    } else {
                        _sel[0].innerHTML = jsHunter.fn.progress();
                    }

                    /*Recursive controls*/
                    let _i_ = 1;
                    let _t_ = 0;

                    /*Tab controls*/
                    let tab = [
                        "<span class='span-tab1'> </span>",
                        "<span class='span-tab2'> </span>",
                        "<span class='span-tab3'> </span>",
                        "<span class='span-tab4'> </span>",
                        "<span class='span-tab5'> </span>",
                        "<span class='span-tab6'> </span>",
                        "<span class='span-tab7'> </span>"
                    ];

                    if(params.hasOwnProperty("tab") && params.tab === false) {
                        tab[0] = tab[1] = tab[2] = tab[3] = tab[4] = tab[5] = tab[6] = "";
                    }

                    /*Content [pre formated] controls*/
                    let pre_ = "<pre>";
                    let _pre = "</pre>";

                    if(params.hasOwnProperty("pre") && params.pre === false) {
                        pre_ = _pre = "";
                    }

                    /*Style controls*/
                    let styles = {
                        obj_index: '<span class="obj-index">',
                        obj_typeof: '<span class="obj-index-typeof">',
                        obj_value: '<span class="obj-value">',
                        end: '</span>'
                    };

                    if(params.hasOwnProperty("styles") && params.styles === false) {
                        styles = {obj_index: '', obj_typeof: '', obj_value: '', end: ''};
                    }

                    function objectWriter(x, obj) {
                        let str = tab[0] + styles.obj_index + x + styles.end;
                        str += ": " + styles.obj_value + obj + styles.end;
                        str += " " + styles.obj_typeof + "(" + typeof obj + ")" + styles.end + "<br />\n";
                        _sel[0].innerHTML += str;
                    }

                    function objectDigger(obj) {
                        for (let k in obj) {
                            /*if(!obj.hasOwnProperty(k)) {continue;}*/

                            let str = tab[_i_] + styles.obj_index + k + styles.end;
                            str += ": " + styles.obj_value + obj[k] + styles.end;
                            str += " " + styles.obj_typeof + "(" + typeof obj[k] + ")" + styles.end + "<br />\n";
                            _sel[0].innerHTML += str;

                            if ((typeof obj[k]).search(/(object|function)/g) !== -1) {
                                _i_+=1;
                                _t_+=1;
                                if(_i_ > 6) {
                                    _i_ = 6;
                                }
                                objectDigger(obj[k]);
                            }
                        }
                        _i_ = (_t_ > 0) ? _i_ - _t_ : _i_;
                        _i_ = (_i_ < 1) ? 1 : _i_;
                    }

                    setTimeout(function() {

                        _sel[0].innerHTML = pre_ + "{<br />";

                        for (let x in obj) {

                            /*if(!obj.hasOwnProperty(x)) {continue;}*/

                            objectWriter(x, obj[x]);

                            if ((typeof obj[x]).search(/(object|function)/g) !== -1) {
                                /*Recursive function*/
                                objectDigger(obj[x]);
                            }
                        }

                        _sel[0].innerHTML += "}<br />\n" + _pre;

                    }, 1200);
                }

            } catch (err) {
                console.error("[Exception] objwriter() => " + err)
            }
            return this;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: INFORMATION DATA
         --------------------------------------------------------------------------------
         */

        /**
         * @description is (Structure), Get data structure type from parameter
         * @param {object} data (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        is: function(data) {
            function _object() {
                return typeof data === 'object';
            }
            function _array() {
                return $$.isArray(data);
            }
            function _matrix() {
                return $$.isArray(data) && $$.isArray(data[0]);
            }
            function _function() {
                return typeof data === 'function';
            }
            function _undef() {
                return typeof data === 'undefined';
            }
            function _null() {
                return data === null;
            }
            function _string() {
                return typeof data === 'string';
            }
            function _bool() {
                return typeof data === 'boolean';
            }
            function _num() {
                return typeof data === 'number' && !isNaN(data);
            }
            function _big() {
                return typeof data === 'bigint';
            }
            function _symbol() {
                return typeof data === 'symbol';
            }
            function _url() {
                return data.toString().search(/^http([s]?):([0-9]+)?\/\/([0-9a-zA-Z_-]+[.]?)+/) !== -1;
            }
            function _file(file_type = undefined) {
                return (
                    typeof data === 'object' &&
                    data.lastModified !== "" &&
                    data.name !== "" &&
                    data.size !== "" &&
                    data.type !== "" &&
                    (data.webkitRelativePath !== "" || data.webkitRelativePath === "") &&
                    (file_type === undefined || data.type === file_type)
                );
            }
            return {
                "object": _object,
                "array": _array,
                "matrix": _matrix,
                "function": _function,
                "undef": _undef,
                "null": _null,
                "string": _string,
                "bool": _bool,
                "num": _num,
                "big": _big,
                "symbol": _symbol,
                "url": _url,
                "file": _file
            }
        },

        /**
         * @description Format any date as needed
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        date: function() {
            let date_now = new Date();

            function _dayWeek() {
                return date_now.getDay() + 1;
            }

            function _day() {
                return date_now.getDate();
            }

            function _month() {
                return date_now.getMonth() + 1;
            }

            function _year() {
                return date_now.getFullYear().toString().substring(2);
            }

            function _fullYear() {
                return date_now.getFullYear();
            }

            function _hour() {
                return date_now.getHours();
            }

            function _minutes() {
                return date_now.getMinutes();
            }

            function _seconds() {
                return date_now.getSeconds();
            }

            function _milliseconds() {
                return date_now.getMilliseconds();
            }

            function _now() {
                return (
                    _year() +"/"+
                    _month() +"/"+
                    _day() +" - "+
                    _hour() +":"+
                    _minutes() +":"+
                    _seconds() +":"+
                    _milliseconds()
                );
            }

            function _stamp() {
                return (
                    _year() +""+
                    _month() +""+
                    _day() +""+
                    _hour() +""+
                    _minutes() +""+
                    _seconds() +""+
                    _milliseconds()
                );
            }

            function _format(data_input, separator) {
                let date_view;
                let tmp_date = data_input.split(separator||"-");

                date_view = tmp_date[2]+'/'+tmp_date[1]+'/'+tmp_date[0];

                if(tmp_date[2].search(" ") !== -1) {
                    date_view = tmp_date[1]+'/'+tmp_date[0];
                    tmp_date = tmp_date[2].split(" ");
                    date_view = tmp_date[0]+'/'+date_view+' '+tmp_date[1];
                }

                return date_view;
            }

            return {
                "stamp": _stamp,
                "now": _now,
                "dayWeek": _dayWeek,
                "day": _day,
                "month": _month,
                "year": _year,
                "fullYear": _fullYear,
                "hour": _hour,
                "minutes": _minutes,
                "seconds": _seconds,
                "milliseconds": _milliseconds,
                "format": _format
            }
        },

        /**
         * @description Get data information about the Browser
         * @returns {object} (object: An JSON object refers to user browser)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        navigator: function() {
            return {
                "code_name": navigator.appCodeName,
                "name": navigator.appName,
                "version": navigator.appVersion,
                "cookies_on": navigator.cookieEnabled,
                "lang": navigator.language,
                "online": navigator.onLine,
                "platform": navigator.platform,
                "user_agent": navigator.userAgent
            };
        },

        /**
         * @description Get a text inside any HTMLElement on DOM by index argument
         * @param {number|undefined} i (number|undefined: Mandatory)
         * @returns {string} (string: An text refer to any <HTMLElement>)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        text: function(i = undefined) {
            return (i >= 0) ? this.sel[i].textContent || this.sel[i].text :
                (this.sel[0].textContent || this.sel[0].text) ? this.sel[0].textContent || this.sel[0].text :
                    jsHunter.fn.exception("text() error " + this.sel);

        },

        /**
         * @description Get the data information from any HTMLELement
         * @param {string} data_type (string: Mandatory)
         * @param {string|object|null|undefined} event (string|object|event: Mandatory)
         * @returns {string} (string: An content [text] refer to any <HTMLElement>)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        getData: function(data_type, event ) {
            switch(data_type) {
                case "undefined" || undefined:
                    return event;
                case "text":
                    return event.text || event.textContent || event.innerText;
                case "textContent":
                    return event.textContent || event.text || event.innerText;
                case "value":
                    return event.value;
                case "html":
                    return event.innerHTML;
                case "outer":
                    return event.outerHTML;
                case "src":
                    return event.src;
                case "attr":
                    return event.attributes;
                case "href":
                    return event.href;
                case "target":
                    return event.target;
                case "eventTarget":
                    return event.target.id;
                case "hash":
                    return event.hash;
                case "data":
                    return event.dataset.content;
                default:
                    throw "Invalid argument [" + data_type + "] on getData !";
            }
        },

        /**
         * @description Get current screen size
         * @returns {object} (object: An JSON object refers to screen size)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        screen: function() {
            return {width: window.innerWidth, height: window.innerHeight};
        },

        /**
         * @description Get a computed css data from any HTMLElement
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @returns {object} (object: An JSON object refers to computed css styles to any <HTMLElement>)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        computedCss: function(element) {
            try {
                return _getStyles(element);
            } catch (err) {
                console.error("[Exception]: styles() => " + err);
            }
        },

        /**
         * @description Set or Get a value from HTMLElement
         * @param {undefined} value (undefined: Mandatory|Optional)
         * @returns {null|string} (null|string: An value from any <HTMLElement>, or erase content)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        val: function(value = undefined) {
            try {

                let _sel = this.sel;
                jh_nodes = [];/*Reset jh_nodes state*/

                if(!_sel) {
                    jsHunter.fn.exception("Wrong or missing selector!");
                } else if (value === undefined) {
                    //Get value
                    _sel.forEach(function(a, index, el) {
                        jh_nodes.push(_sel[index].value);
                    });
                } else {
                    //Set Value
                    _sel.forEach(function(a, index, el) {
                        _sel[index].value = value;
                    })
                }

            } catch (err) {
                console.error("[Exception] val() => " + err);
            }
            return (jh_nodes.length === 1) ? jh_nodes[0] : (jh_nodes.length > 1) ? jh_nodes : null;
        },

        /**
         * @description Toggle a value or the visible to element in current document
         * @param {object} param (object: Optional)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        toggle: function(param = "") {
            try {
                let _sel = this.sel;

                if (!_sel) {
                    jsHunter.fn.exception("[Exception] toggle() => wrong or missing selector!");
                } else {
                    switch (param) {

                        //Toggle Visible
                        case "":
                            _sel.forEach(function(a, index, el) {
                                let _styles = _getStyles(_sel[index]);
                                if (_styles.all.display === "none") {
                                    _sel[index].style.display = "block";
                                } else {
                                    _sel[index].style.display = "none";
                                }
                            });
                            break;

                        //Toggle Checked
                        case "checked":
                            _sel.forEach(function(a, index, el) {
                                _sel[index].checked = _sel[index].checked === false;
                            });
                            break;

                        //Toggle Value
                        default:
                            _sel.forEach(function(a, index, el) {
                                if (_sel[index].value === "") {
                                    _sel[index].value = param;
                                } else {
                                    _sel[index].value = "";
                                }
                            });
                    }
                }

            } catch (err) {
                console.error("[Exception] toggle() => " + err);
            }
            return this;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: VISUAL HANDLERS
         --------------------------------------------------------------------------------
         */

        /**
         * @description Toggle FullScreen Window
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        fullscreen: function() {
            function _run() {
                //TODO: check browser and apply the correct settings
                //console.log($$.navigator().name);
                try {
                    console.log("FULLSCREEN");
                    if (document.fullScreenElement || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                        if (document.documentElement.requestFullScreen) {
                            document.documentElement.requestFullScreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullScreen) {
                            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    } else {
                        if (document.cancelFullScreen) {
                            document.cancelFullScreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                    }
                    return true;
                } catch (er) {
                    $$.log("fullscreen() error => " + er).except();
                    return false;
                }
            }

            function _force() {
                try {
                    console.log("FULLSCREEN:FORCE");
                    let el = document.body;
                    // Supports most browsers and their versions.
                    let requestMethod =
                        el.requestFullScreen ||
                        el.webkitRequestFullScreen ||
                        el.mozRequestFullScreen ||
                        el.msRequestFullScreen;

                    if (requestMethod) {
                        // Native full screen.
                        requestMethod.call(el);
                    } else if (typeof window.ActiveXObject !== "undefined") {
                        // Older IE.
                        let wscript = new ActiveXObject("WScript.Shell");

                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    return true;
                } catch (er) {
                    $$.log("fullscreen():force error => " + er).except();
                    return false;
                }
            }
            return {"run":_run,"force":_force};
        },

        /**
         * @description Set css transition (animation) in any HTMLElement
         * @param {string} transition (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        anime: function(transition) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.transition = transition;
                    }) : (_sel) ?
                    (function(){
                        _sel.style.transition = transition;
                    })() : jsHunter.fn.exception("anime() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set the css display property on any HTMLElement
         * @param {string} value (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        display: function(value) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.display = value;
                    }) : (_sel) ?
                    _sel.style.display = value : jsHunter.fn.exception("[Exception] display() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set any HTMLElement with a show visible
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        show: function() {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.display = 'block';
                    }) : (_sel) ?
                    _sel.style.display = 'block' : jsHunter.fn.exception("[Exception] show() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set any HTMLElement with a hide visible
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        hide: function() {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.display = 'none';
                    }) : (_sel) ?
                    _sel.style.display = 'none' : jsHunter.fn.exception("[Exception] hide() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Make a fade in effect on any HTMLElement
         * @param {object} p (object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        fadeIn: function(p = {}) {
            clearInterval(fadeCtrl); /*Bug Fix*/
            let _opacity  = 0; /*0....100*/
            let _element  = this.sel; /*Copy current target tag (Conflict Fix)*/
            let _keys     = Object.keys(_element);
            let _selector = this.selector; /*Save current selector (fadeOut())*/
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 10;
            let _timeout = (p.hasOwnProperty("timeout")) ? p.timeout : 0;

            _keys.forEach(function(index) {

                /*CSS Reset Element*/
                _element[index].style.display = "block";

                /*Cross Browser CSS > IE*/
                if( userAgent.indexOf( 'msie' ) !== -1 ) {
                    _element[index].style.filter  = "alpha(opacity=0)";
                } else { _element[index].style.opacity = "0"; }

            });

            fadeCtrl = setInterval(function() {

                _keys.forEach(function(index) {

                    if((_opacity >= 100)) {
                        clearInterval(fadeCtrl);

                        /*Automatic Close*/
                        if(parseInt(_timeout) > 0) {

                            setTimeout(function() {
                                jsHunter(_selector).fadeOut(p);
                            }, parseInt(_timeout));

                        }

                    } else {
                        _opacity += 2;

                        /*Cross Browser CSS > IE*/
                        if( userAgent.indexOf( 'msie' ) !== -1 ) {
                            _element[index].style.filter  = "alpha(opacity=" + _opacity + ")";
                        } else { _element[index].style.opacity = (_opacity / 100).toString(); }
                    }
                });

            }, _timer_fade);

            return this;
        },

        /**
         * @description Make a fade out effect on any HTMLElement
         * @param {object} p (object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        fadeOut: function(p = {}) {
            clearInterval(fadeCtrl); /*Bug Fix*/
            let _opacity  = 100; /*100....0*/
            let _element  = this.sel; /*copy current target tag (noConflict)*/
            let _keys     = Object.keys(_element);
            /*let _selector = this.selector;*/
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 1;

            fadeCtrl = setInterval(function() {

                _keys.forEach(function(index) {

                    if((_opacity <= 0)) {
                        clearInterval(fadeCtrl);
                        _element[index].style.display = "none";

                        if(p.remove) {
                            $$.remove(p.parent, p.children);
                        }

                    } else {
                        _opacity -= 2;

                        /*Cross Browser CSS > IE*/
                        if( userAgent.indexOf( 'msie' ) !== -1 ) {
                            _element[index].style.filter = "alpha(opacity=" + _opacity + ")";
                        } else { _element[index].style.opacity = (_opacity / 100).toString(); }
                    }
                });

            }, _timer_fade);

            return this;
        },

        /**
         * @description Set or Get a current height from HTMLElements
         * @param  {number|string|object} value (number|string|object: Mandatory|Optional)
         * @returns {this} (this: Current instanceOf jsHunter)|string
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        height: function(value = undefined) {
            try {
                let _sel = this.sel;
                if (value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _sel[index].style.height = value;
                        }) : (_sel) ?
                            _sel.style.height = value : $$.log("height() error => Missing " + _sel).except();
                } else {
                    return jH(this.selector).cssCurrent('height');
                }
            } catch(err) {
                $$.log("height() error => " + err).error();
            }
            return this;
        },

        /**
         * @description Set or Get a current width from HTMLElements
         * @param {number|string|object} value (number|string|object: Mandatory|Optional)
         * @returns {this} (this: Current instanceOf jsHunter)|string
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        width: function(value = undefined) {
            try {
                let _sel = this.sel;
                if (value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _sel[index].style.width = value;
                        }) : (_sel) ?
                            _sel.style.width = value : $$.log("width() error => Missing " + _sel).except();
                } else {
                    return jH(this.selector).cssCurrent('width');
                }
            } catch(err) {
                $$.log("width() error => " + err).error();
            }
            return this;
        },

        /**
         * @description Set top CSS property on any <HTMLElement>
         * @param  {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        top: function(value = undefined) {
            try {
                let _sel = this.sel;
                let _t_ = null;
                if (!value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _t_ = _sel[index].style.top;
                        }) : (_sel) ?
                            (function(){
                                _t_ = _sel.style.top;
                            })() : $$.log("top() error " + _sel).except();

                    return _t_;
                }
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.top = value;
                    }) : (_sel) ?
                        _sel.style.top = value :
                        $$.log("top() error => " + _sel).except();
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set right CSS property on any <HTMLElement>
         * @param {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        right: function(value = undefined) {
            try {
                let _sel = this.sel;
                let _r_ = null;
                if (!value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _r_ = _sel[index].style.right;
                        }) : (_sel) ?
                            (function(){
                                _r_ = _sel.style.right;
                            })() : $$.log("right() error " + _sel).except();

                    return _r_;
                }
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.right = value;
                    }) : (_sel) ?
                        _sel.style.right = value :
                        $$.log("right() error => " + _sel).except();
            } catch(err) {
                $$.log("right() error => " + err).except();
            }
            return this;
        },

        /**
         * @description Set bottom CSS property on any <HTMLElement>
         * @param {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        bottom: function(value = undefined) {
            try {
                let _sel = this.sel;
                let _b_ = null;
                if (!value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _b_ = _sel[index].style.bottom;
                        }) : (_sel) ?
                            (function(){
                                _b_ = _sel.style.bottom;
                            })() : $$.log("bottom() error " + _sel).except();

                    return _b_;
                }
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.bottom = value;
                    }) : (_sel) ?
                        _sel.style.bottom = value :
                        $$.log("bottom() error => " + _sel).except();
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Set left CSS property on any <HTMLElement>
         * @param {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        left: function(value = undefined) {
            try {
                let _sel = this.sel;
                let _l_ = null;
                if (!value) {
                    (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                        _sel.forEach(function(a, index, el) {
                            _l_ = _sel[index].style.left;
                        }) : (_sel) ?
                            (function(){
                                _l_ = _sel.style.left;
                            })() : $$.log("left() error => " + _sel).except();

                    return _l_;
                }
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.left = value;
                    }) : (_sel) ?
                        _sel.style.left = value :
                        $$.log("left() error " + _sel).except();
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Hide HTMLElements
         * @param {string} element (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        hidden: function(element) {
            let _el_ = document.querySelectorAll(element);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].style.display = 'none';
            });
            return this;
        },

        /**
         * @description Set a margin on any HTMLElement
         * @param {string} orientation (string: Mandatory)
         * @param {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        margin: function(orientation, value) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        switch (orientation){
                            case 'left':
                                _sel[index].style.marginLeft = value;
                                break;
                            case 'right':
                                _sel[index].style.marginRight = value;
                                break;
                            case 'top':
                                _sel[index].style.marginTop = value;
                                break;
                            case 'bottom':
                                _sel[index].style.marginBottom = value;
                                break;
                            case 'all':
                                _sel[index].style.marginTop = value;
                                _sel[index].style.marginRight = value;
                                _sel[index].style.marginBottom = value;
                                _sel[index].style.marginLeft = value;
                                break;
                        }
                    }) : (_sel) ?
                    (function() {
                        switch (orientation){
                            case 'left':
                                _sel.style.marginLeft = value;
                                break;
                            case 'right':
                                _sel.style.marginRight = value;
                                break;
                            case 'top':
                                _sel.style.marginTop = value;
                                break;
                            case 'bottom':
                                _sel.style.marginBottom = value;
                                break;
                            case 'all':
                                _sel.style.marginTop = value;
                                _sel.style.marginRight = value;
                                _sel.style.marginBottom = value;
                                _sel.style.marginLeft = value;
                                break;
                        }
                    })() : jsHunter.fn.exception("margin() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Update the size of one HTMLElement
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @param {string} orientation (string: Mandatory)
         * @param {string|number|undefined|null|object} value (string|number|undefined|null|object: Mandatory)
         * @param {string} type (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        sizer: function(element, orientation, value, type) {
            try {
                _changeElementSize(element, orientation, value, type);
            } catch(err) {
                console.error("[Exception] sizer() => " + err);
            }
            return this;
        },

        /**
         * @description Apply the css effect opacity in any HTMLElement
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @param {string|number|undefined|null|object} opacity (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        opacity: function(element, opacity) {
            try {
                _opacityElement(element, opacity);
            } catch(err) {
                console.error("[Exception] opacity() => " + err);
            }
            return this;
        },

        /**
         * @description Centralize one HTMLElement in the screen
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @param {string|number|undefined|null|object} element_width (string|number|undefined|null|object: Mandatory)
         * @param {string|number|undefined|null|object} element_height (string|number|undefined|null|object: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        centralize: function(element, element_width, element_height) {
            try {
                _middlePositionConfigure(element, element_width, element_height);
            } catch(err) {
                console.error("[Exception] centralize() => " + err);
            }
            return this;
        },

        /**
         * @description Make a automatic scroll of the page (single page) until target
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        scroller: function() {
            try {
                if((jsHunter.selector).search(/^#/) !== -1) {
                    let to = document.getElementById(jsHunter.selector.replace("#", "")).offsetTop;
                    window.scrollTo({
                        top: to - 10,
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    jsHunter.fn.exception("Invalid selector, use #id");
                }
            } catch(err) {
                console.log("[Exception] scroller() error => " + err);
            }
            return this;
        },

        /**
         * @description Move an element to direction left, right, up or down
         * @param {string} element (string: Mandatory)
         * @returns object
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        move: function(element) {
            function _to(direction, value) {
                switch (direction) {
                    case "top":
                        jH(element).top(value);
                        break;
                    case "right":
                        jH(element).right(value);
                        break;
                    case "bottom":
                        jH(element).bottom(value);
                        break;
                    case "left":
                        jH(element).left(value);
                        break;
                    default:
                        jsHunter.fn.exception("slide() error => invalid direction: " + direction);
                }
            }
            return {"to":_to};
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: CSS HANDLER
         --------------------------------------------------------------------------------
         */

        /**
         * @description Set a css property to any HTMLElement in current document
         * @param {number|string|object} prop Css (number|string|object: Mandatory)
         * @param {number|string} val Property Css (number|string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        css: function(prop, val = undefined) {
            let _sel = this.sel;
            let keys = Object.keys(_sel);
            let param = {};

            function _cssText() {
                keys.forEach(function(index) {
                    _sel[index].style.cssText = prop;
                });
            }

            function _cssAttributes() {
                keys.forEach(function(index) {
                    _setAttributesStyles(_sel[index], param);
                });
            }

            try {

                if(!prop && !val) {
                    jsHunter.fn.exception("Wrong or missing css parameters");
                } else if(_sel) {

                    if ($$.has('styles').in(prop) && typeof prop === "object") {
                        param = prop.styles;
                        _cssAttributes();
                        return this;
                    }

                    if (!$$.has('styles').in(prop) && typeof prop !== "object" && !val) {
                        _cssText();
                        return this;
                    }

                    if (prop && val) {
                        prop = prop +":"+val+";";
                        _cssText();
                        return this;
                    }

                    /*Default action*/
                    param[prop] = val;
                    _cssAttributes();

                } else {
                    jsHunter.fn.exception("Wrong or missing target selector");
                }

            } catch (err) {
                console.error("[Exception] css() error " + err);
            }
            return this;
        },

        /**
         * @description Get an specific css property from any HTMLElement
         * @param {string} prop (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)|array
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use jH("#target").cssCurrent("left");
         */
        cssCurrent: function(prop) {
            try {

                let _sel = this.sel;

                if(!prop) {
                    $$.log("getCss() error => Wrong or missing css parameters").error();
                } else if(_sel) {

                    let keys = Object.keys(_sel);
                    let collected = [];

                    keys.forEach(function(index) {
                        collected.push(_getCssProperty(_sel[index], prop));
                    });

                    return collected;

                } else {
                    $$.log("getCss() error => Wrong or missing target selector").error();
                }

            } catch (err) {
                $$.log("getCss() error => " + err).except();
            }
            return this;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: DATA STRUCTURE
         --------------------------------------------------------------------------------
         */

        /**
         * @description dataType, Set and Get data type from any data value
         * @param {object} d (object: Mandatory)
         * @returns string
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        dataType: function(d) {
            if ($$.is(d).array() && $$.is(d).object() && ($$.is(d[0]).array() || $$.is(d[1]).array())) {
                return "array/array";
            } else if (!$$.is(d).array() && $$.is(d).object() && ($$.is(d[0]).array() || $$.is(d[1]).array())) {
                return "object/array";
            } else if (!$$.is(d).array() && $$.is(d).object() && ($$.is(d[0]).object() || $$.is(d[1]).object())) {
                return "object/object";
            } else if ($$.is(d).array() && $$.is(d).object() && ($$.is(d[0]).object() || $$.is(d[1]).object())) {
                return "array/object";
            } else if (!$$.is(d).array() && $$.is(d).object() && !$$.is(d[0]).object() && !$$.is(d[1]).object()) {
                return "data/collection";
            } else {
                return "data/unknown";
            }
        },

        /**
         * @description Array Map, map an array to other data structure
         * @param {array} arr (array: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        arrayMap: function(arr) {
            let _keys = [];
            let result = undefined;

            function _setKeysName(arr) {
                _keys = arr;
                return {"json": _toJson, "collection": _toArrayCollection};
            }

            function _getResult(type) {
                if (type === 'json') result = {};
                if (type === 'collection') result = [];
                if (!$$.is(arr).matrix()) {
                    if (_keys.length !== arr.length) {
                        $$.log("arrayMap() error => keys.length are different to values.length !")
                            .error();
                        return false;
                    }
                    result[0] = {};
                    for (let i = 0; i < arr.length; i++) {
                        result[0][_keys[i]] = arr[i];
                    }
                } else {
                    for (let i = 0; i < arr.length; i++) {
                        result[i] = {};
                        for (let j = 0; j < arr[i].length; j++) {
                            result[i][_keys[j]] = arr[i][j];
                        }
                    }
                }
                return result;
            }

            function _toJson() {
                return _getResult("json");
            }

            function _toArrayCollection() {
                return _getResult("collection");
            }

            return {"keys": _setKeysName, "json": _toJson, "collection": _toArrayCollection};
        },

        /**
         * @description ObjectMap, mapper the object and convert to other data structure
         * @param {object} obj (object: Mandatory)
         * @returns object
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        objectMap: function(obj) {
            function _tryObjToArray() {
                let _array_ = [];
                Object.keys(obj).forEach(function(item, index, array) {
                    _array_.push([item, obj[item]]);
                });
                return _array_;
            }
            function _toArray(node_key = "") {
                try {
                    return Array.from(obj[node_key]);
                } catch (er) {
                    try {
                        return _tryObjToArray();
                    } catch (ex) {
                        $$.log("objectMap() error => " + er).except();
                        $$.log("objectMap() persist-error => " + ex).except();
                    }
                }
            }
            function _toString() {
                try {
                    return JSON.stringify(obj);
                } catch (e) {
                    return obj.toString();
                }
            }
            function _getObject(node_key) {
                return obj[node_key];
            }
            return {"toString": _toString,"toArray": _toArray, "get": _getObject};
        },

        /**
         * @description CSV Map
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        csvMap: function(params) {
            let columns = [];
            let values = [];
            let re = new RegExp(`${params.delimit}$`);

            function _checkin() {
                if (!$$.has("data").in(params)) {
                    $$.log("csvMap() error => Missing data source.").error();
                    return false;
                }
                if (!$$.has("delimit").in(params)) {
                    $$.log("csvMap() error => Missing delimit to data source.").error();
                    return false;
                }
                return true;
            }

            function _toArray() {
                let arr = [];
                for (let i = 0; i < values[0].length; i++) {
                    if (!$$.empty(columns[i])) {
                        arr.push([columns[i], values[0][i]]);
                    }
                }
                return arr;
            }

            function _toJson() {
                let json = {};
                for (let i = 0; i < values.length; i++) {
                    if (values[i].length !== columns.length) continue;
                    json[i] = {};
                    for (let j = 0; j < values[i].length; j++) {
                        if (!$$.empty(columns[j])) {
                            json[i][columns[j]] = values[i][j];
                        }
                    }
                }
                return json;
            }

            function _toCollection() {
                let coll = [];
                for (let i = 0; i < values.length; i++) {
                    if (values[i].length !== columns.length) continue;
                    coll[i] = {};
                    for (let j = 0; j < values[i].length; j++) {
                        if (!$$.empty(columns[j])) {
                            coll[i][columns[j]] = values[i][j];
                        }
                    }
                }
                return coll;
            }

            function _toMatrix() {
                let mat = [];
                mat[0] = [];
                for (let n = 0; n < columns.length; n++) {
                    mat[0].push(columns[n]);
                }
                for (let i = 0; i < values.length; i++) {
                    if (values[i].length !== columns.length) continue;
                    mat[i+1] = [];
                    for (let j = 0; j < values[i].length; j++) {
                        mat[i+1].push(values[i][j]);
                    }
                }
                return mat;
            }

            function _prepare(fn = undefined) {
                if ($$.is(params.data).matrix()) {
                    for (let i = 0; i < params.data.length; i++) {
                        for (let j = 0; j < params.data[i].length; j++) {
                            values.push(params.data[i][j].replace(re, '').split(params.delimit));
                        }
                    }
                } else if ($$.is(params.data).array()) {
                    values.push(params.data[0].replace(re, '').split(params.delimit));

                } else if ($$.is(params.data).file("text/csv")) {
                    function _loadImport(args) {
                        columns = args.shift().toString().replace(re, '').split(params.delimit);
                        for (let i = 0; i < args.length; i++) {
                            for (let j = 0; j < args[i].length; j++) {
                                values.push(args[i][j].replace(re, '').split(params.delimit));
                            }
                        }

                        if ($$.is(fn).function()) {
                            if (params.format === "matrix") {
                                fn(_toMatrix());
                            } else if (params.format === "collection") {
                                fn(_toCollection());
                            } else if (params.format === "json") {
                                fn(_toJson());
                            }
                        }
                    }

                    $$.file({
                        target: params.data,
                        process: "matrix"
                    }).readAsBinaryString(_loadImport);
                }
            }

            function _setHeader(cols = []||0) {
                if ($$.is(params.data).string()) {
                    let _data_ = params.data.replace('\r', '').split('\n');
                    params.data = [];
                    columns = _data_.shift().toString().replace(re, '').split(params.delimit);
                    for (let i = 0; i < _data_.length; i++) {
                        params.data.push([_data_[i]]);
                    }
                } else if ($$.is(cols).array()) {
                    columns = cols;
                } else if ($$.is(cols).num() && $$.isDefined(params.data[cols])) {
                    columns = params.data
                        .shift()
                        .toString()
                        .replace(re, '')
                        .split(params.delimit);
                }
                _prepare();
                return {
                    "array": _toArray,
                    "json": _toJson,
                    "collection": _toCollection,
                    "matrix": _toMatrix
                };
            }

            function _run(fn) {
                _prepare(fn);
            }

            try {
                if (_checkin()) {
                    return {"run": _run, "header": _setHeader};
                }
            } catch (er) {
                $$.log("csvMap() error => " + er).error();
            }
        },

        /**
         * @description jsonMap
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        jsonMap: function() {
            return this;
        },

        /**
         * @description listMap
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        listMap: function() {
            return this;
        },

        /**
         * @description envMap
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        envMap: function() {
            return this;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: UTILS AND TOOLS
         --------------------------------------------------------------------------------
         */

        /**
         * @description Exec, execute an command or function easily
         * @param {string|function} command (string|function: Mandatory)
         * @param {object} arg1 (object: Optional)
         * @param {object} arg2 (object: Optional)
         * @param {object} arg3 (object: Optional)
         * @returns {null} (null: Alone)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.exec(cmd, arg1, arg2, arg3);
         */
        exec: function(command, arg1 = undefined, arg2 = undefined, arg3 = undefined) {
            if ($$.is(command).function()) {
                if (arg1 && arg2 && arg3) {
                    command(arg1, arg2, arg3);
                } else if (arg1 && arg2) {
                    command(arg1, arg2);
                } else if (arg1) {
                    command(arg1);
                } else {
                    command();
                }
            } else {
                $$.log("exec() Command =>").dig(command, arg1, arg2, arg3);
            }
            return null;
        },

        /**
         * @description Await, set a time to execute any function
         * @param {number} seconds (number: Optional)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.await(time[seconds]).run(fn);
         */
        await: function(seconds = 1) {
            let t = seconds * 1000;
            if (t > 60000) {
                $$.log("[WARNING] await() function is long time to execute...").print("orange");
            }
            function _run(fn, args) {
                setTimeout(function() {
                    if ($$.is(fn).function()) {
                        fn(args||undefined);
                    }
                }, t);
            }
            return {"run": _run};
        },

        /**
         * @description Serialize, get data string serialized to server send
         * @param {object} obj (object: Mandatory)
         * @param {boolean} enc (boolean: Optional)
         * @returns {string} (string: The string serialized)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        serialize: function(obj, enc = true) {
            let serialized = "";
            Object.keys(obj).forEach(function(item, index, array) {
                serialized += "&" + item.toString() + "=" + obj[item];
            });

            if (enc === true) {
                return encodeURIComponent(serialized.replace(/^&/, ""));
            }
            return serialized.replace(/^&/, "");
        },

        /**
         * @description Length, get a length from any data source
         * @param {number,string,array,object} data (number,string,array,object: Mandatory)
         * @returns {number} (number: The length to current data source)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        length: function(data) {
            if ($$.is(data).string() || $$.is(data).num()) {
                return data.length;
            } else if ($$.is(data).matrix()) {
                return data.length;
            } else if ($$.is(data).array()) {
                return data.length;
            } else if ($$.is(data).object()) {
                let len = 0;
                Object.keys(data).forEach(function(item, index, array) {
                    len++;
                });
                return len;
            } else {
                return data.length;
            }
        },

        /**
         * @description Optimize, sort, organize and optimize an array data
         * @param {array|object} arr (array|object: Mandatory)
         * @returns {object} (object: An object refers array sorted and info operations)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        optimize: function(arr) {
            function _reverse() {
                return arr.reverse();
            }
            function _sort() {
                return $$.bubble(arr).result();
            }
            /**
             * @param {number|string} ref (number|string: Mandatory)
             * @param {number} direction (number: Optional[0 = left, 1 = right, 2 = alone])
             * @how-use $$.optimize(array).balance(0, 0);
             */
            function _balance(ref = undefined, direction = 2) {
                if (ref === undefined) {
                    $$.log("optimize() error => Missing ref parameter!").print("red");
                    return [];
                }

                let arr_size = arr.length;
                let aux_ref = [];
                let aux_other = [];

                for (let i = 0; i < arr_size; i++) {
                    if (arr[i] === ref) {
                        aux_ref.push(arr[i]);
                    } else {
                        aux_other.push(arr[i]);
                    }
                }

                aux_other = $$.bubble(aux_other).result();

                function _pushRef() {
                    for (let i = 0; i < aux_ref.length; i++) {
                        arr.push(aux_ref[i]);
                    }
                }

                function _pushOther() {
                    for (let i = 0; i < aux_other.length; i++) {
                        arr.push(aux_other[i]);
                    }
                }

                if (direction === 0) {/*left*/
                    arr = aux_ref;
                    _pushOther();
                } else if (direction === 1) { /*right*/
                    arr = aux_other;
                    _pushRef();
                } else if (direction === 2) { /*depend*/
                    if (aux_ref[0] > aux_other[aux_other.length-1]) {
                        arr = aux_other;
                        _pushRef();
                    } else if (aux_ref[0] < aux_other[0]) {
                        arr = aux_ref;
                        _pushOther();
                    } else if (aux_ref.length > aux_other.length) {
                        arr = aux_other;
                        _pushRef();
                    } else {
                        arr = aux_ref;
                        _pushOther();
                    }
                }

                return arr;
            }

            return {
                "sort": _sort,
                "reverse": _reverse,
                "balance": _balance,
            };
        },

        /**
         * @description Bubble, sort array in sequencial mode
         * @param {array|object} arr (array|object: Mandatory)
         * @returns {object} (object: An object refers array sorted and number of changes)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        bubble: function(arr) {
            let aux = undefined;
            let process = true;
            let prevent = 0;
            let changes = 0;

            while (process === true) {
                process = false;
                for (let i = 0; i <= arr.length; i++) {
                    if (arr[i] > arr[i+1]) {
                        aux = arr[i];
                        arr[i] = arr[i+1];
                        arr[i+1] = aux;
                        process = true;
                        changes++;
                    }
                }

                prevent++;
                if (prevent >= 10000) {
                    $$.log("bubble() except => Prevent Bug Dispatched: " + prevent)
                        .print("orange");
                    break;
                }
            }

            function _result() {
                return arr;
            }

            function _changes() {
                return changes;
            }

            return {
                "result": _result,
                "changes": _changes
            };
        },

        /**
         * @description Matcher, compare data with any target list and get a list of matches as result
         * @param {object} params (object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        matcher: function(params = {}) {

            let min_length = ($$.has('min_length').in(params)) ? params.min_length : 2;
            let pattern = ($$.has('pattern').in(params)) ? params.pattern : "";
            let source = ($$.has('source').in(params)) ? params.source : [];
            let callback = ($$.has('callback').in(params)) ? params.callback : null;

            let matches = [];
            let swapper = [];
            let json_rs = {};
            let stringr = "";
            let pattern_map = [];

            function _checkin() {
                if (pattern === "") {
                    $$.log("matcher() error => Missing pattern").error();
                    return false;
                }
                if (source === []) {
                    $$.log("matcher() error => Missing source").error();
                    return false;
                }
                if (!$$.is(callback).null() && !$$.is(callback).function()) {
                    $$.log("matcher() error => Callback is not a function").error();
                    return false;
                }
                return true;
            }

            function _pushPatternMap(initial_pos, final_pos, line = 0) {
                pattern_map.push([{
                    "pattern": pattern,
                    "line": line,
                    "initial_pos": initial_pos,
                    "final_pos": final_pos,
                    "status": true
                }]);
            }

            function _match(_source_ = undefined, line = 0) {
                if ($$.is(pattern).array() && pattern.length > 0) {
                    if (_source_ !== undefined) source = _source_;
                    if (source.toString().search(pattern.toString()) !== -1) {

                        let pattern_len = pattern.length;
                        let counter_found = 0;
                        let current_pos = 0;
                        let initial_pos = 0;
                        let final_pos = 0;
                        let pattern_started = false;
                        let kill_process = false;

                        while (kill_process === false) {

                            for (let i = current_pos; i < pattern_len; i++) {
                                let current = pattern[i];

                                for (let k = final_pos; k < source.length; k++) {
                                    if (k === (source.length-1) && kill_process === false) {
                                        kill_process = true;
                                    }

                                    if (pattern_started === false) {

                                        if (source[k] === current) {
                                            counter_found++;
                                            pattern_started = true;
                                            initial_pos = k;
                                            final_pos = k + 1;
                                            if (pattern_len === 1) {
                                                _pushPatternMap(k, k, line);
                                            }
                                            break;
                                        }

                                    } else if (pattern_started === true) {

                                        if (source[k] === current) {
                                            counter_found++;

                                            if (counter_found === pattern_len) {
                                                _pushPatternMap(initial_pos, k, line);

                                                current_pos = 0;
                                                counter_found = 0;
                                                pattern_started = false;
                                                // final_pos = k + 1;
                                                // break;
                                            }

                                            final_pos = k + 1;
                                            break;

                                        } else {

                                            counter_found = 0;
                                            i = -1;
                                            current_pos = 0;
                                            final_pos = k;
                                            pattern_started = false;
                                            break;

                                        }
                                    }
                                }
                            }
                        }
                    }

                } else if (pattern.toString().length >= parseInt(min_length)) {
                    source.forEach(function(item, index, array) {
                        if (item.search(pattern) !== -1) {
                            matches.push(item.toString().toLowerCase());
                        }
                    });
                }
            }

            function _flush() {
                pattern = "";
                source = "";
                matches = "";
            }

            function _getArray() {
                if ($$.is(callback).function()) {
                    callback(matches);
                }
                return matches;
            }

            function _getArray2D() {
                matches.forEach(function(item, index, array) {
                    swapper.push([item]);
                });
                if ($$.is(callback).function()) {
                    callback(swapper);
                }
                _flush();
                return swapper;
            }

            function _getJSON() {
                if (matches.length === 0) return [];

                matches.forEach(function(item, index, array) {
                    json_rs[index] = item;
                });
                if ($$.is(callback).function()) {
                    callback(json_rs);
                }
                _flush();
                return json_rs;
            }

            function _getCSV() {
                if (matches.length === 0) return [];

                matches.forEach(function(item, index, array) {
                    stringr += item+";";
                });
                if ($$.is(callback).function()) {
                    callback(stringr);
                }
                _flush();
                return stringr;
            }

            function _getENV() {
                if (matches.length === 0) return [];

                matches.forEach(function(item, index, array) {
                    stringr += "ENV_"+item.toUpperCase()+"='"+item+"'\n";
                });
                if ($$.is(callback).function()) {
                    callback(stringr);
                }
                _flush();
                return stringr;
            }

            function _getMap() {
                if ($$.is(callback).function()) {
                    callback(pattern_map);
                }
                return pattern_map;
            }

            try {
                if (_checkin()) {
                    if (!$$.is(source).matrix()) {
                        _match();
                    } else {
                        source.forEach(function(item, index, array) {
                            _match(item, index);
                        });
                    }
                }
            } catch (er) {
                $$.log("matcher() error => " + er).except();
            }

            return {
                "getArray": _getArray,
                "getArray2D": _getArray2D,
                "getJSON": _getJSON,
                "getCSV": _getCSV,
                "getENV": _getENV,
                "getMap": _getMap,
            };

        },

        /**
         * @description MD5, get codification hash refers to any string data
         * @param {string} data (string: Mandatory)
         * @returns {string} MD5 Sum Hash Code
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        md5: function(data) {
            /**
             * Note:
             * This code was initially developed by blueimp and then tweaked to be used
             * within the jshunter library in a simple way.
             *
             * https://github.com/blueimp/JavaScript-MD5
             */

            'use strict'

            function safeAdd(x, y) {
                let lsw = (x & 0xffff) + (y & 0xffff);
                let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xffff);
            }

            function bitRotateLeft(num, cnt) {
                return (num << cnt) | (num >>> (32 - cnt));
            }

            function md5cmn(q, a, b, x, s, t) {
                return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
            }

            function md5ff(a, b, c, d, x, s, t) {
                return md5cmn((b & c) | (~b & d), a, b, x, s, t);
            }

            function md5gg(a, b, c, d, x, s, t) {
                return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
            }

            function md5hh(a, b, c, d, x, s, t) {
                return md5cmn(b ^ c ^ d, a, b, x, s, t);
            }

            function md5ii(a, b, c, d, x, s, t) {
                return md5cmn(c ^ (b | ~d), a, b, x, s, t);
            }

            function _md5Bin(x, len) {
                /* append padding */
                x[len >> 5] |= 0x80 << len % 32;
                x[(((len + 64) >>> 9) << 4) + 14] = len;

                let i;
                let o_l_d_a;
                let o_l_d_b;
                let o_l_d_c;
                let o_l_d_d;
                let a = 1732584193;
                let b = -271733879;
                let c = -1732584194;
                let d = 271733878;

                for (i = 0; i < x.length; i += 16) {
                    o_l_d_a = a;
                    o_l_d_b = b;
                    o_l_d_c = c;
                    o_l_d_d = d;

                    a = md5ff(a, b, c, d, x[i], 7, -680876936);
                    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

                    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                    b = md5gg(b, c, d, a, x[i], 20, -373897302);
                    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

                    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                    d = md5hh(d, a, b, c, x[i], 11, -358537222);
                    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

                    a = md5ii(a, b, c, d, x[i], 6, -198630844);
                    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

                    a = safeAdd(a, o_l_d_a);
                    b = safeAdd(b, o_l_d_b);
                    c = safeAdd(c, o_l_d_c);
                    d = safeAdd(d, o_l_d_d);
                }
                return [a, b, c, d]
            }

            function _binToString(input) {
                let i;
                let output = '';
                let length32 = input.length * 32;
                for (i = 0; i < length32; i += 8) {
                    output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
                }
                return output;
            }

            function _stringToBin(input) {
                let i;
                let output = [];
                output[(input.length >> 2) - 1] = undefined;

                for (i = 0; i < output.length; i += 1) {
                    output[i] = 0;
                }
                let length8 = input.length * 8;
                for (i = 0; i < length8; i += 8) {
                    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
                }
                return output;
            }

            function _md5ToString(s) {
                return _binToString(_md5Bin(_stringToBin(s), s.length * 8));
            }

            function _strToHexResult(input) {
                let hex_tab = '0123456789abcdef';
                let hex_result = '';
                let x;
                let i;

                for (i = 0; i < input.length; i += 1) {
                    x = input.charCodeAt(i);
                    hex_result += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
                }
                return hex_result;
            }

            function _utf8String(input) {
                return unescape(encodeURIComponent(input));
            }

            function _md5Raw(str) {
                return _md5ToString(_utf8String(str));
            }

            function _md5Builder(str) {
                return _strToHexResult(_md5Raw(str));
            }

            function md5(data) {
                if (data && data !== "") {
                    return _md5Builder(data);
                }
                return "Hash-Md5-Error: Missing data to md5 calculate";
            }

            return md5(data);
        },

        /**
         * @description Basename, get a basename of an filepath
         * @param {string} filepath (string: Mandatory)
         * @returns {string} File and Extension name
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        basename: function(filepath) {
            let f = filepath.split('.');
            let ext = f.pop();
            let nam = f.pop() || "";
            nam = nam.toString().split("/").pop();
            if (nam && ext) {
                return nam+"."+ext;
            } else if (!nam && ext) {
                return ext;
            } else {
                return "";
            }
        },

        /**
         * @description Is HTTPS, check if current url is secure
         * @param {string} url (string[:URL]: Mandatory)
         * @returns boolean (boolean: True or False if URL is HTTPS)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        isHttps: function(url) {
            return (url.toString().search(/^https\/\//) !== -1);
        },

        /**
         * @description QueryString, create a query string data send to server
         * @param {object} param (object: Mandatory)
         * @returns string (string: The current string formatted to QueryString Data)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        queryString: function(param) {
            let _d = "";
            Object.keys(param).forEach(function(item, index, array) {
                _d += item + "=" + param[item] + "&";
            });
            return "?"+_d.replace(/&$/, '');
        },

        /**
         * @description Lock a screen navigation with a button from browser
         * @param {string} params (string: Mandatory)
         * @returns array
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        padlock: function(params = "") {

            /**
             * Projeto Name: noback v0.0.1
             * Description: library for prevent backbutton
             * Author: Kiko Mesquita (http://twitter.com/kikomesquita) Copyright (c) 2015 @kikomesquita
             * Comments: Based on stackoverflow
             * Adapted by: Jereelton Teixeira
             */

            (function(window) {
                'use strict';

                let x_back_denied = {

                    //globals
                    version: '0.0.1',
                    history_api: typeof history.pushState !== 'undefined',

                    init: function() {
                        window.location.hash = '#x-to-lock';
                        x_back_denied.configure();
                    },

                    configure: function() {
                        if (window.location.hash === '#x-to-lock') {
                            if (this.history_api) {
                                history.pushState(null, '', '#x-padlock');
                            } else {
                                window.location.hash = '#x-padlock';
                            }
                        }
                        x_back_denied.checkCompat();
                        x_back_denied.hasChanged();
                    },

                    checkCompat: function() {
                        if (window.addEventListener) {
                            window.addEventListener("hashchange", x_back_denied.hasChanged, false);
                        } else if (window.attachEvent) {
                            window.attachEvent("onhashchange", x_back_denied.hasChanged);
                        } else {
                            window.onhashchange = x_back_denied.hasChanged;
                        }
                    },

                    hasChanged: function() {
                        if (window.location.hash === '#x-to-lock') {
                            window.location.hash = '#x-padlock';
                            $$.alert({
                                title: "Alert",
                                text: "Operation Denied !"
                            });
                        }
                    }
                };

                x_back_denied.init();

            }(window));

        },

        /**
         * @description ToArray, convert any data structure to array structure
         * @param {object|string} param (object|string: Mandatory)
         * @returns array (array: An Array contained the current data parameter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        toArray: function(param) {
            let array = [];
            if (typeof param === "object" && param.length !== undefined) {
                array = Array.from(param);
            } else if(param) {
                array[0] = param;
            }
            return array;
        },

        /**
         * @description Check if array contain an element
         * @param {array} _array (array: Mandatory)
         * @param {number|string} _value (number|string: Mandatory)
         * @param {boolean} _async (boolean: Optional)
         * @returns boolean (boolean: True or False if value is in parametrized array)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        inArray: function(_array, _value, _async = true) {
            let result = false
            try {
                if (!_array){
                    jsHunter.fn.exception("inArray() error => missing array stack");
                    return false;
                }
                if (!_value){
                    jsHunter.fn.exception("inArray() error => missing value");
                    return false;
                }

                /*Async*/
                if (_async) {

                    _array.forEach(function(item, index, array) {
                        if (item === _value) {
                            result = true;
                        }
                    });
                    return result;

                } else {

                    /*Sync*/
                    for (let i = 0; i < _array.length; i++) {
                        if (_array[i] === _value) {
                            return true;
                        }
                    }
                }

            } catch (err) {
                jsHunter.fn.exception("inArray() error => " + err);
            }
            return result;
        },

        /**
         * @description Check if element or object is array
         * @param {array|object} _array (array|object: Mandatory)
         * @returns boolean (boolean: True or False if parameter is an valid array)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        isArray: function(_array) {
            try {
                if (!Array.isArray) {
                    Array.isArray = function(arg) {
                        return Object.prototype.toString.call(arg) === '[object Array]';
                    };
                }
                if (Array.isArray(_array)) {
                    return true;
                }
            } catch (err) {
                jsHunter.fn.exception("isArray() error => " + err);
            }
            return false;
        },

        /**
         * @description Replace all values from any array [from] [to]
         * @param {array} array (array: Mandatory)
         * @param {string} from (string: Mandatory)
         * @param {string} to (string: Mandatory)
         * @returns {array} (array: An array replaced with required options)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        replaceArray: function(array = [], from, to) {
            let _arr_ = [];
            array.forEach(function(item, index, array) {
                _arr_.push(item.toString().replace(from, to));
            });
            return _arr_;
        },

        /**
         * @description Sort data with order by and classification
         * @param {object|array} arr (object|array: Mandatory)
         * @param {object} options (object: Optional)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        sort: function(arr, options = {}) {
            let _array = [];
            let _array_ord = [];
            let _object_array = {};
            let _tmp_array = [];
            let _array_object = [];
            let _object_object = {};
            let _collection = {};

            /**
             * Generic Functions
             */
            function _set(_src) {
                _array = _src;
            }
            function _newCollator() {
                let _opt_ = {
                    numeric: true,
                    sensitivity: 'base',
                    ignorePunctuation: true
                };
                if ($$.has("numeric").in(options) && options.numeric === true) {
                    _opt_["numeric"] = options.numeric;
                }
                if ($$.has("sensitivity").in(options) && options.sensitivity !== 'base') {
                    _opt_["sensitivity"] = options.sensitivity;
                }
                if ($$.has("ignorePunctuation").in(options) && options.ignorePunctuation === false) {
                    _opt_["ignorePunctuation"] = options.ignorePunctuation;
                }

                return new Intl.Collator(options.locale, _opt_);
            }

            /**
             * Main Functions
             */
            function _asIs() {
                try {
                    return _array.sort();
                } catch (er) {
                    $$.log("sort() [_asIs] error => " + er).except();
                }
            }
            function _asNumber(order = "asc") {
                return _array.sort(function(x,y) {
                    try {
                        if (order === 'asc') {
                            return x-y;
                        } else if (order === 'desc') {
                            return y-x;
                        }
                    } catch (er) {
                        $$.log("sort() [_asNumber] error => " + er).except();
                    }
                });
            }
            function _asString(order = "asc") {
                return _array.sort(function(x, y) {
                    if (order === 'asc') {
                        return _newCollator().compare(x, y);
                    } else if (order === 'desc') {
                        return  _newCollator().compare(y, x);
                    }
                });
            }
            function _asMatrix(order = "asc", col = 0) {
                try {
                    if ($$.dataType(_array) !== 'array/array') {
                        $$.log("sort() [_asMatrix] error => _data is not a array/array").error();
                        return false;
                    }
                    /*line by line*/
                    _array.forEach(function(item, index, array) {
                        /*column by column*/
                        item.forEach(function(item_, index_, array_) {
                            /*match column*/
                            if (index_ === col) {
                                _array[index].unshift(item_);
                            }
                        });
                    });
                    /*order matrix [asc|desc]*/
                    _array_ord = _asString(order);
                    _array_ord.forEach(function(item, index, array) {
                        /*reset matrix (ordered)*/
                        _array_ord[index].shift();
                    });
                    return _array_ord;
                } catch (er) {
                    $$.log("sort() [_asMatrix] error => " + er).except();
                }
            }
            function _asArray(order = "asc", key_name = "") {
                return _array.sort(function(x,y) {
                    try {
                        if (order === 'asc') {
                            return _newCollator().compare(x[key_name], y[key_name]);
                        } else if (order === 'desc') {
                            return  _newCollator().compare(y[key_name], x[key_name]);
                        }
                    } catch (er) {
                        $$.log("sort() [_asArray] error => " + er).except();
                    }
                });
            }
            function _asObject(order = "asc", col = 0) {
                try {
                    if ($$.dataType(_array) !== 'object/array') {
                        $$.log("sort() [_asObject] error => _data is not a object/array").error();
                        return false;
                    }
                    Object.keys(_array).forEach(function(item, index, array) {
                        _array[item].forEach(function(item_, index_, array_) {
                            if (index_ === col) {
                                _array[index].unshift(item_);
                                _tmp_array.push(_array[index]);
                            }
                        });
                    });
                    /*update _array values*/
                    _set(_tmp_array);
                    /*order matrix [asc|desc]*/
                    _array_ord = _asString(order); /*order array*/
                    _array_ord.forEach(function(item, index, array) {
                        /*reset object-array (ordered)*/
                        _array_ord[index].shift();
                    });
                    _array_ord.forEach(function(_item, _index, _array) {
                        _object_array[_index] = _array_ord[_index];
                    });
                    return _object_array;
                } catch (er) {
                    $$.log("sort() [_asObject] error => " + er).except();
                }
            }
            function _asJson(order = "asc", key_name = "") {
                try {
                    if ($$.dataType(_array) !== 'object/object') {
                        $$.log("sort() [_asJson] error => _data is not a object/object").error();
                        return false;
                    }
                    Object.keys(_array).forEach(function(item, index, array) {
                        _array_object.push(_array[index]);
                    });
                    /*update _array values*/
                    _set(_array_object);
                    _array_ord = _asArray(order, key_name);
                    _array_ord.forEach(function(_item, _index, _array) {
                        _object_object[_index] = _array_ord[_index];
                    });
                    return _object_object;
                } catch (er) {
                    $$.log("sort() [_asJson] error => " + er).except();
                }
            }
            function _asCollection(order = "asc") {
                try {
                    if ($$.dataType(_array) !== 'data/collection') {
                        $$.log("sort() [_asCollection] error => _data is not a data/collection").error();
                        return false;
                    }
                    /*convert collection to array_object*/
                    Object.keys(_array).forEach(function(item, index, array) {
                        _array_object.push({_k_n_: item, _k_v_: _array[item]});
                    });
                    /*update _array values*/
                    _set(_array_object);
                    _array_ord = _asArray(order, '_k_n_');
                    /*revert to collection*/
                    _array_ord.forEach(function(_item, _index, _array) {
                        if (_item['_k_v_'].name === '') {
                            /*fix name item on collection when is not set*/
                            _item['_k_v_'] = {name: _item['_k_n_']};
                        }
                        _collection[_item['_k_n_']] = _item['_k_v_'];
                    });
                    return _collection;
                } catch (er) {
                    $$.log("sort() [_asCollection] error => " + er).except();
                }
            }
            function _asNodes(order = "asc", col = 0) {
                try {
                    if ($$.dataType(_array) !== 'array/array') {
                        $$.log("sort() [_asNodes] error => _data is not a array/array").error();
                        return false;
                    }
                    /*line by line*/
                    _array.forEach(function(item, index, array) {
                        /*column by column*/
                        item.forEach(function(_it, _id, _ar) {
                            /*reference column to order*/
                            if (_id === col) {
                                _array[index].unshift(_it.textContent);
                            }
                        });
                    });
                    /*order HTMLElements nodes [asc|desc]*/
                    _array_ord = _asString(order);
                    _array_ord.forEach(function(item, index, array) {
                        /*reset matrix (ordered)*/
                        _array_ord[index].shift();
                    });
                    return _array_ord;
                } catch (er) {
                    $$.log("sort() [_asNodes] error => " + er).except();
                }
            }
            try {
                _set(arr);
                return {
                    "asNumber":_asNumber,
                    "asIs":_asIs,
                    "asString":_asString,
                    "asMatrix":_asMatrix,
                    "asArray":_asArray,
                    "asObject":_asObject,
                    "asJson":_asJson,
                    "asCollection":_asCollection,
                    "asNodes":_asNodes
                };
            } catch (e) {
                $$.log("sort() error => " + e).except();
            }
        },

        /**
         * @description Get a total number of elements defined by args in current document
         * @param {HTMLElement|object|array} param (HTMLElement|object|array: Optional)
         * @returns {number} (number: The number of counter refer a data parameter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        count: function(param = "") {
            try {
                let _sel = this.sel;
                let keys = Object.keys(_sel);
                let counter = _sel.length;

                if (param !== '') {
                    counter = 0;
                    keys.forEach(function(index) {
                        if (_sel[index][param]) {
                            counter+=1;
                        }
                    });
                }

                return counter;
            } catch (err) {
                console.error("[Exception] count() error, wrong or missing element [selector]");
            }
        },

        /**
         * @description Check if target value is defined with an valid value
         * @param {string|null} val (string|null: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is null or undefined)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        isDefined: function(val) {
            return (val !== null && val !== undefined);
        },

        /**
         * @description Check if target value is empty
         * @param {string|null} value (string|null: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is empty)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        empty: function(value) {
            return (value === null || value === undefined || value === "" || !value);
        },

        /**
         * @description Select, select one or more element in current DOM
         * @param {string} _inter_sel_ (string: Optional)
         * @returns {object} (object: Reference of current instance library)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        select: function(_inter_sel_= "") {
            try {
                if (!$$.empty(_inter_sel_)) {
                    let rs = document.querySelectorAll(_inter_sel_);
                    if (rs.length > 1) {
                        return rs;
                    } else {
                        return rs[0];
                    }
                } else {
                    let _sel = this.sel;

                    if (_sel && _sel.length === 1 && (typeof _sel === "object" || $$.isArray(_sel))) {
                        return this.sel[0];
                    } else if(_sel.length > 1) {
                        return this.sel;
                    } else {
                        $$.log("select() error => wrong or missing element: " + this.selector).error();
                    }
                }
            } catch (err) {
                $$.log("select() error => wrong or missing element: " + this.selector).except();
            }
            return 0;
        },

        /**
         * @description Hunt, get one or more element in current DOM
         * @param {string} _inter_sel_ (string: Optional)
         * @returns {object} (object: Reference of current instance library)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.hunt("#jh-progress-container");
         */
        hunt: function(_inter_sel_= "") {
            return $$.select(_inter_sel_);
        },

        /**
         * @description Hunter(query) one or more element in current DOM and set jh_node vars
         * @param {string} wanted (string: Mandatory)
         * @param {string} nodeType (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        hunter: function(wanted, nodeType) {
            try {
                let hunt = document.querySelectorAll(wanted);
                let keys = Object.keys(hunt);
                jh_nodes    = [];
                jh_node     = "";
                (keys.length > 0) ?
                    (function() {
                        keys.forEach(function(index) {
                            if(nodeType && nodeType === "parent") {
                                jh_nodes.push(hunt[index].parentElement)
                            } else if(nodeType && nodeType === "children") {
                                jh_nodes.push(hunt[index]);
                            } else if(nodeType && nodeType === "self") {
                                jh_nodes.push(hunt[index]);
                            }
                        })
                        jsHunter.fn.jh_nodes = jh_nodes;
                    })() :
                    (hunt) ?
                        (function(){
                            if(nodeType && nodeType === "parent") {
                                jh_node = hunt.parentElement;
                            } else if(nodeType && nodeType === "children"){
                                jh_node = hunt
                            } else if(nodeType && nodeType === "self"){
                                jh_node = hunt
                            }
                            jsHunter.fn.jh_node = jh_node;
                        })() :
                        jsHunter.fn.exception("hunter() error, not found: " + wanted);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Get a node parent from any HTMLElement
         * @param {string} parentItem (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        nodeParent: function(parentItem) {
            try {
                jsHunter.fn.hunter(parentItem + " " + this.selector, "parent");
                (jh_nodes.length <= 0) ?
                    jsHunter.fn.exception("nodeParent() error, not found [" + parentItem + " " + this.selector + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Get a node child from any HTMLElement
         * @param {string} childItem (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        nodeChild: function(childItem) {
            try {
                jsHunter.fn.hunter(this.selector + " " + childItem, "children");
                (jh_nodes.length <= 0) ?
                jsHunter.fn.exception("nodeChild() error, not found [" + this.selector + " " + childItem + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /**
         * @description Compare one Element id and return true or false
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @param {string} id_value (string) (string: Mandatory)
         * @returns {boolean} (boolean: True or False if <HTMLElement> contain the id parameter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        matchId: function(element, id_value) {
            return (
                element.id.search(id_value) >= 0 ||
                element.id.search(" " + id_value) >= 0 ||
                element.id.search(id_value + " ") >= 0
            );
        },

        /**
         * @description Compare one Element by className and return true or false
         * @param {HTMLElement} element (<HTMLElement>: Mandatory)
         * @param {string} classname (string: Mandatory)
         * @returns {boolean} (boolean: True or False if <HTMLElement> contain the className parameter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        matchClass: function(element, classname) {
            return (
                element.className.search(classname) >= 0 ||
                element.className.search(" " + classname) >= 0 ||
                element.className.search(classname + " ") >= 0
            );
        },

        /**
         * @description Find one element by id in current DOM and return a boolean value
         * @param {string} id (string: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is id and exists in current DOM)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        findId: function(id) {
            if(id.search(/^\.|\[/) === -1) {
                return !!document.querySelector('#' + id.replace(/#/g, ''));
            }
            if ($$.jHDebug() === true) {
                $$.log("findId() info: target is not a valid DOM element id").print("cyan");
            }
        },

        /**
         * @description Find one element by className in current DOM and return a boolean value
         * @param {string} classname (string: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is className and exists in current DOM)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        findClass: function(classname) {
            if(classname.search(/^#|\[/) === -1) {
                return !!document.querySelectorAll('.' + classname.replace(/\./g, '')).length;
            }
            if ($$.jHDebug() === true) {
                $$.log("findClass() info: target is not a valid DOM element classname").print("cyan");
            }
        },

        /**
         * @description Find one element by data-set in current DOM and return a boolean value
         * @param {string} element (string: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is a data-content and exists in current DOM)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        findElements: function(element) {
            if(element.search(/^\[(.*)+]$/) !== -1) {
                return !!document.querySelectorAll(element).length;
            }
            if ($$.jHDebug() === true) {
                $$.log("findElements() info: target is not a valid DOM element to data-set []").print("cyan");
            }
        },

        /**
         * @description Find one or more elements (free) in current DOM and return a boolean value
         * @param {string} element (string: Mandatory)
         * @returns {boolean} (boolean: True or False if data parameter is a data-content and exists in current DOM)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        findTarget: function(element) {
            return !!document.querySelectorAll(element).length;
        },

        /**
         * @description Broken any string by any separator and union with other parameter
         * @param {string} param (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.explode("Teste amarelo vermelho").by(" ").union("[", "]");
         */
        explode: function(param) {
            function _by(separator) {
                param = param.toString();
                function _union(start = "", end = "") {
                    return start + param.split(separator).join(end + start) + end;
                }
                function _get(idx = "") {
                    if (idx !== "") {
                        return param.split(separator)[idx];
                    }
                    return param.split(separator);
                }
                return {"get":_get, "union":_union};
            }
            return {"by":_by};
        },

        /**
         * @description Highlight words in any string
         * @param {string} wanted (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.highlight("amarelo").in("Carro amarelo grande").color("yellow");
         */
        highlight: function(wanted) {
            function _in(data) {
                function _color(color = "yellow") {
                    return data.split(wanted).join("<span class='highlight-"+color+"'>"+wanted+"</span>");
                }
                return {"color": _color};
            }
            return {"in":_in};
        },

        /**
         * @description Rand, generate a random number between two number
         * @param {number} min (number: Mandatory)
         * @param {number} max (integer) (number: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.rand(0, 100).inclusive();
         */
        rand: function(min, max) {
            if (!min) min = 0;
            if (!max) max = 1;
            function _between() {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
            function _inclusive() {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            return {"between": _between, "inclusive": _inclusive};
        },

        /**
         * @description Repeat, repeat any char [n] times
         * @param {string|function} char (string|function: Mandatory)
         * @param {number|string} until (number|string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.repeat("A", 3).asString();
         */
        repeat: function(char, until) {
            let num = "";
            let str = "";
            let arr = [];
            let obj = {};
            function _asNumber() {
                if ($$.is(char).function()) {
                    for (let i = 0; i < parseInt(until); i++) {
                        num += char();
                    }
                } else {
                    for (let i = 0; i < parseInt(until); i++) {
                        num += char;
                    }
                }
                return $$.intNumber(num);
            }
            function _asString(sep) {
                if ($$.is(char).function()) {
                    for (let i = 0; i < parseInt(until); i++) {
                        if (i === parseInt(until)-1) {
                            str += char();
                            break;
                        }
                        str += char() + sep;
                    }
                } else {
                    for (let i = 0; i < parseInt(until); i++) {
                        if (i === parseInt(until)-1) {
                            str += char;
                            break;
                        }
                        str += char + sep;
                    }
                }
                return str.toString();
            }
            function _asArray() {
                if ($$.is(char).function()) {
                    for (let i = 0; i < parseInt(until); i++) {
                        arr.push(char());
                    }
                } else {
                    for (let i = 0; i < parseInt(until); i++) {
                        arr.push(char);
                    }
                }
                return arr;
            }
            function _asJson() {
                if ($$.is(char).function()) {
                    for (let i = 0; i < parseInt(until); i++) {
                        obj[i] = char();
                    }
                } else {
                    for (let i = 0; i < parseInt(until); i++) {
                        obj[i] = char;
                    }
                }
                return obj;
            }
            return {"asNumber": _asNumber, "asString": _asString, "asArray": _asArray, "asJson": _asJson};
        },

        /**
         * @description Get number from any value and also substr if needed
         * @param {string|number|object|null} input (string|number|object|null: Mandatory)
         * @param {number} substr (number: Optional)
         * @returns {number|string} (number|string: The result as a Integer Number)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.intNumber("123A90");
         */
        intNumber: function(input, substr = 0) {
            if(isNaN(input)) {
                if (substr === 0) {
                    return parseInt((input).replace(/[^0-9]/gi, ""));
                } else {
                    return (parseInt((input)
                        .replace(/[^0-9]/gi, "")))
                        .toString()
                        .substring(0, input.length-substr);
                }
            }
            return parseInt(input);
        },

        /**
         * @description Convert any data input to float number
         * @param {string|number|object|null} input (string|number|object|null: Mandatory)
         * @param {number} fix (number: Optional)
         * @returns {number} (float: The result as a Float Number)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.floatNumber("10,00");
         */
        floatNumber: function(input, fix = 0) {
            if (fix > 0) {
                return parseFloat(input.toFixed(fix));
            } else {
                return parseFloat(
                    (input)
                        .toString()
                        .replace(/[^0-9.,]/gi, "")
                        .replace(/([.]?)([0-9]+)([,])([0-9]+)$/gi, "$2.$4"));
            }
        },

        /**
         * @description Format, Generic Data Format
         * @param {string} input (string: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        format: function(input) {
            function _money() {

            }
            function _cpf() {

            }
            function _rg() {

            }
            function _cnh() {

            }
            function _date() {

            }
            return  {
                "money": _money,
                "cpf": _cpf,
                "rg": _rg,
                "cnh": _cnh,
                "date": _date
            };
        },

        /**
         * @description Get a higher number from array or collection values
         * @param {number|string|object} param (number|string|object: Mandatory)
         * @returns {number} (number: The higher number from any source values)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        higherNumber: function(param) {
            let higher = 0;
            for (let n = 0; n < param.length; n++) {
                if (parseInt(param[n]) > higher) {
                    higher = parseInt(param[n]);
                }
            }
            return higher;
        },

        /**
         * @description Make clear on value, removing white spaces in the initial and final of the value
         * @param {string} data (string: Mandatory)
         * @returns {string} (string: The string input without spaces on final and initial position)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         * @how-use $$.trim(" test data 123 ");
         */
        trim: function(data) {
            if (!data) return undefined;
            return data
                .replace(/^( +)([0-9a-zA-Z ,'"\\\/_\[\-\].!@#$%&*()]+)( +)?$/gi, '$2')
                .replace(/ +$/, '');
        },

        /**
         * @description To number format with an specific separator
         * @param {number|string|object} data (number|string|object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        number: function(data) {
            function _cut(cut) {
                let exp = $$.explode(data).by('.').get();
                if (exp.length === 2) {
                    data = exp[0] + ".";
                    for (let k = 0; k < exp[1].length; k++) {
                        if (k === cut) break;
                        data += exp[1][k];
                    }
                }
            }
            function _float(cut) {
                if (!$$.is(data).num()) return 0;
                _cut(cut);
                return parseFloat(data);
            }
            function _int() {
                return parseInt(data);
            }
            return {"float":_float, "int": _int};
        },

        /**
         * @description Replace values from any string [from] [to]
         * @param {string} data (string) (string: Mandatory)
         * @param {string} from (string) (string: Mandatory)
         * @param {string} to (string) (string: Mandatory)
         * @returns {string} (string: An string replaced)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        replaceAll: function(data, from, to) {
            try {
                let pos = data.indexOf(from);
                while (pos > -1) {
                    data = data.replace(from, to);
                    pos = data.indexOf(from);
                }
            } catch (er) {
                $$.log().dig("replaceAll() error => ", er);
            }
            return data;
        },

        /**
         * @description Convert string lower case or upper case to only first upper case
         * @param {string} data (string) (string: Mandatory)
         * @param {boolean} iterative (boolean: Optional)
         * @returns {string} (string: The string formatted as upper case first)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        ucFirst: function(data, iterative = true) {
            let ar = data.split(" ");
            let rs = "";
            function _uc(dt) {
                let uc = dt.substring(0, 1).toUpperCase();
                let lc = dt.substring(1, dt.toString().length).toLowerCase();
                return uc + lc + " ";
            }
            if (iterative && ar.length > 0) {
                ar.forEach(function (item, index, array) {
                    rs += _uc(item);
                });
            } else {
                rs += _uc(data);
            }
            return $$.trim(rs);
        },

        /**
         * @description Remove all tags from any source and get only text content
         * @param {HTMLElement|string|object} html (<HTMLElement>|string|object: Mandatory)
         * @returns {string} (string: The result in text only, without html tags)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        htmlClear: function(html) {
            let clear = "";
            function _clearHtml(html) {
                clear = html.toString()
                    .replace(/\n/gi, '')
                    .replace(/<\/.*>/, '')
                    .replace(/<.*>/, '');
            }

            function _tryAltText() {
                clear = html.toString()
                    .replace(/.*(alt=["'])([0-9a-zA-Z ._-]+)['"](.*)/gi, '$2');
            }

            function _tryTitleText() {
                clear = html.toString()
                    .replace(/.*(title=["'])([0-9a-zA-Z ._-]+)['"](.*)/gi, '$2');
            }

            _clearHtml(html);

            if ($$.empty(clear)) _tryAltText();

            if ($$.empty(clear)) _tryTitleText();

            if ($$.empty(clear)) {
                clear = "";
            } else {
                _clearHtml(clear);
            }

            return clear;
        },

        /**
         * @description Convert data <HTMLElement> to Array
         * @param {HTMLElement|object} element (<HTMLElement>|object: Mandatory)
         * @returns {array} (array: An array of  HTMLElements
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        htmlToArray: function(element) {
            let _a_ = [];
            let _e_ = element
                .innerHTML
                .toString()
                .replace(/\n/gi, '')
                .split("</div>");

            for (let k = 0; k < _e_.length; k++) {
                _a_.push($$.trim($$.htmlClear(_e_[k])));
            }
            return _a_;
        },

        /**
         * @description Convert a HEXADECIMAL value to RGB
         * @param {string} color_hex (string: Mandatory)
         * @returns {null|object} (object: When everything fine, get a rgb and rgba color from any hex source color)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        hexToRgb: function(color_hex) {
            let i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_hex);

            if(!i) {
                $$.log("hexToRgb() error => Your hexadecimal color expression is wrong !").except();
                return null;
            }

            return {
                r: parseInt(i[1], 16),
                g: parseInt(i[2], 16),
                b: parseInt(i[3], 16),
                rgb: parseInt(i[1], 16) +','+ parseInt(i[2], 16) +','+ parseInt(i[3], 16),
                rgba: parseInt(i[1], 16) +','+ parseInt(i[2], 16) +','+ parseInt(i[3], 16) + ',0.6',
            }
        },

        /**
         * @description Clone an <HTMLElement> in current DOM
         * @param {string} src (string: Mandatory)
         * @param {number} idx (number: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        clone: function(src, idx = 0) {
            let _e_ = jH(src).select();
            function _into(target) {
                if (idx !== 0) {
                    jH(target).append(_e_[idx].outerHTML);
                } else {
                    jH(target).append(_e_.outerHTML);
                }
            }
            return {"into": _into};
        },

        /**
         * @description Format value in a currency parametrized by language
         * @param {string} data (string: Mandatory)
         * @param {string} lang (string: Mandatory)
         * @returns {string} (string: Currency Formatted Data)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        currency: function(data, lang) {
            let currency_symbol = {
                "ptbr": "R$",
                "pt-br": "R$",
                "en": "$",
                "es": "€",
                "pt": "€"
            };

            let currency_data = data.toLocaleString(lang, {
                        style: 'currency',
                        currency: currency_symbol[lang],
                        minimumFractionDigits: 2
                });

            return currency_symbol[lang] + " " + data;
        },

        /*
         --------------------------------------------------------------------------------
         - TOPIC: DEVELOPERS TOOLS
         --------------------------------------------------------------------------------
         */

        /**
         * @description Test library installation in your application
         * @param {string} param (string: Mandatory)
         * @returns {this} (this: Current instanceOf jsHunter)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        _test_: function(param) {
            console.log("Test is running...", param);
            let _sel = this.sel || jh_nodes;
            let keys = Object.keys(_sel);
            (keys.length > 0) ?
                keys.forEach(function(index) {
                    console.log("test_1", typeof _sel, _sel.length, _sel[index]);
                })
                :
                (_sel) ?
                    console.log("test_2", typeof _sel, _sel.length, _sel)
                    :
                    console.error("test", typeof _sel, _sel.length, _sel);
            $$.log("Your test was performed successfully").log();
            return this;
        },

        /**
         * @description Thrown an exception
         * @param {number|string|object} msg (number|string|object: Mandatory)
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        exception: function(msg){
            throw msg;
        },

        /**
         * @description Log a message error or exception
         * @param {number|string|object} data (number|string|object: Mandatory)
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        log: function(data = undefined){
            function _print(color = "") {
                if (color !== "") {
                    function _colorize(msg, color) {
                        console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
                    }
                    _colorize(data, color);
                } else {
                    console.log(data);
                }
            }
            function _log() {
                console.log(data);
            }
            function _dig() {
                $$.log("[START jsHunter LOG]").print("cyan");
                let args = [].slice.call(arguments);
                if (args.length === 0) {
                    console.log(data);
                } else {
                    args.forEach(function (item, index, array) {
                        console.log(item);
                    });
                }
                $$.log("[END jsHunter LOG]").print("cyan");
            }
            function _error() {
                data = "[Error] " + data;
                _print("red");
            }
            function _critical() {
                data = "[Critical Operation] " + data;
                _print("red");
                throw "[jsHunter Aborted]";
            }
            function _table() {
                console.table(data);
            }
            function _trace() {
                console.trace();
            }
            function _except() {
                jsHunter.fn.exception("[Exception] " + data);
            }
            return {
                "print":_print,
                "log":_log,
                "dig":_dig,
                "error":_error,
                "critical":_critical,
                "table":_table,
                "trace":_trace,
                "except":_except
            };
        },

        /**
         * @description Just simulate /dev/null
         * @returns {null} (null: Alone)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        noth: function() {
            (function(){void(0);})();
        },

        /**
         * @description JH Debug, set and get debug state to library runtime
         * @param {boolean} state (boolean: Mandatory)
         * @returns {boolean} (boolean: The state of debug library in runtime)
         * @status [_TODO][_WORK][_DONE][DOCUMENTED][CANCEL][WAIT]
         */
        jHDebug: function(state = undefined) {
            if (state === true || state === false) {
                jh_debug = state;
            } else {
                return jh_debug
            }
        },

        /**
         * @description See the functions and components that are part of the library
         * @returns {object} (object: All functions for this method)
         * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
         */
        kanban: function() {
            let _TODO_ = [
                {
                    name: "selectCloner",
                    type: "component",
                    description: "Criar um componente para substituir um <select> com opções de pesquisa e filtro"
                },
                {
                    name: "zoom",
                    type: "component",
                    description: "Criar uma funcionalidade que de um zoom em um qualquer elemento no DOM atual"
                },
                {
                    name: "card",
                    type: "component",
                    description: "Criar um componente para gerar um elemento estilo cartão personalizado na tela"
                }
            ];
            let _WORK_ = [
                {
                    name: "grid",
                    type: "component",
                    description: "Um componente robusto para montar uma grid contendo opções para gerenciar e visualizar dados"
                },
                {
                    name: "sort",
                    type: "function",
                    description: "Função para ordenar estrutura de dados: integer, string, array, object"
                }
            ];
            let _WAIT_ = [
                {
                    name: "htmlSort",
                    type: "function",
                    description: "Criar uma função para ordenar elementos HTML em ordem desc e asc"
                }
            ];
            let _TEST_ = [
                {
                    name: "removeChild",
                    type: "function",
                    description: "Remove um ou mais elementos filhos de um ou mais elementos pais"
                }
            ];
            let _DONE_ = jsHunter.fn;
            function todo() {
                $$.log(_TODO_).table();
            }
            function work() {
                $$.log(_WORK_).table();
            }
            function wait() {
                $$.log(_WAIT_).table();
            }
            function test() {
                $$.log(_TEST_).table();
            }
            function done() {
                $$.log(_DONE_).table();
            }
            function all() {
                $$.log("TODO").print();
                $$.kanban().todo();
                $$.log("WORK").print();
                $$.kanban().work();
                $$.log("WAIT").print();
                $$.kanban().wait();
                $$.log("TEST").print();
                $$.kanban().test();
                $$.log("DONE").print();
                $$.kanban().done();
            }
            return {
                "all":all,
                "todo":todo,
                "work":work,
                "wait":wait,
                "test":test,
                "done":done
            };
        }
    };

    window.jH = window.jsHunter = jsHunter;
    window.$$ = jsHunter();

})();

//No Conflict Resolved
const _jsHunter = window.jsHunter, _jH = window.jH;

jsHunter.noConflict = function( digger ) {
    if(window.jH === jsHunter) {
        window.jH = _jH;
    }
    if(digger && window.jsHunter === jsHunter) {
        window.jsHunter = _jsHunter;
    }
    return jsHunter;
};

jsHunter.noConflict();

if ( typeof noGlobal === typeof undefined ) {
    window.jsHunter = window.jH = jsHunter;
}

window.$J = jsHunter.fn;
