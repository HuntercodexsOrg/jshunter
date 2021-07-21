/*
*
* Project: jsHunter Javascript Library
* Initial Date: 2019-11-01
* License: MIT
* Description: This is a free source code, please use as best as possible.
*
*/

;(function(){

    /***
     * Constructor of lib
     * */

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
            console.error(err);
        } finally {
            if(_selector && !this.sel) {
                console.error("[Exception] jsHunter is not done, check your selector calling !");
            } else {
                this.selector = jsHunter.selector = _selector;
                this.args     = jsHunter.args = _args;
            }
        }
    }

    let
        userAgent = navigator.userAgent.toLowerCase(),
        nodes     = [],
        node      = "",
        fadeCtrl  = null, /*FadeIn FadeOut Effects Controls*/
        sizeCtrl  = null;

    /***
     * Private Generic Functions
     * */

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

    function _setAttributesStyles(e, p) {

        let s = "";
        if(p.hasOwnProperty("text_color")) { s += "color: "+p.text_color+";"; }
        if(p.hasOwnProperty("text_align")) { s += "text-align: "+p.text_align+";"; }
        if(p.hasOwnProperty("font_size"))  { s += "font-size: "+p.font_size+";"; }
        if(p.hasOwnProperty("width"))     { s += "width: "+p.width+";"; }
        if(p.hasOwnProperty("height"))    { s += "height: "+p.height+";"; }
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
        if(p.hasOwnProperty("transition")){ s += "transition: "+p.transition+";"; }
        if(p.hasOwnProperty("display"))   { s += "display: "+p.display+";"; }
        if(p.hasOwnProperty("overflow"))  { s += "overflow: "+p.overflow+";"; }
        if(p.hasOwnProperty("border_radius"))  { s += "border-radius: "+p.border_radius+";"; }
        if(p.hasOwnProperty("box_shadow"))  { s += "box-shadow: "+p.box_shadow+";"; }
        if(p.hasOwnProperty("box_sizing"))  { s += "box-sizing: "+p.box_sizing+";"; }

        /*RGBA*/
        if(p.hasOwnProperty("back_color") && p.hasOwnProperty("opacity") && p.opacity !== "1") {
            s += "background: rgba("+jsHunter.fn.hexToRgb(p.back_color).rgb+","+p.opacity+");";
            /*HEXADECIMAL*/
        } else {
            s += "background-color: "+p.back_color+";";
        }

        e.setAttribute("style", s);
    }

    function _createHtmlElement(params) {

        let htmlElement = document.createElement(params.element);
        htmlElement.setAttribute(params.attr_type, params.attr_name.replace("#", ""));

        if(params.hasOwnProperty('styles')) {
            _setAttributesStyles(htmlElement, params.styles);
        }

        let _el_ = document.querySelectorAll(params.append);
        let keys = Object.keys(_el_);

        keys.forEach(function(index) {
            _el_[index].appendChild(htmlElement);
        });

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
                    _sel.forEach(function (a, index) {
                        _sel[index].attributes.src.value = value;
                    })
                    break;
                case "disabled":
                    _sel.forEach(function (a, index) {
                        _sel[index].disabled = value;
                    })
                    break;
                case "href":
                    _sel.forEach(function (a, index) {
                        _sel[index].href = value;
                    })
                    break;
                default:
                    jsHunter.fn.exception("attr() error " + type);
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
                default:
                    jsHunter.fn.exception("attr() error " + type);
            }
        }
    }

    jsHunter.fn = jsHunter.prototype = {

        /***
         * Testing Installation
         * */

        /*for more details please, see of documentation below:
        http://www.jshunter-lib.com/#_test_-installation*/
        _test_: function(param) {
            console.log("Test is running...", param);
            let _sel = this.sel || nodes;
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
            console.log("Your test was performed successfully");
            return this;
        },

        /***
         * Internal Functions
         * */

        exception: function(msg){
            throw msg;
        },

        noth: function() {
            (function(){void(0);})();
        },

        /***
         * Using
         * */

        loaded: function(callback) {
            window.onload = function() {
                if (typeof callback === "function") {
                    callback();
                } else {
                    console.info("[Warning] callback is:", typeof callback);
                }
            }
        },

        /***
         * Requesters and Responses
         * */

        ajax: function(args){

            let browserAgent = navigator.userAgent.toLowerCase();
            let xhr          = null;
            let response     = null;
            let responseText = null;
            let accessctrl   = 1;

            function xhrinit() {
                // Internet Explorer
                if( browserAgent.indexOf( 'msie' ) !== -1 ) {
                    // IE Version >= 5
                    let ieBrowser = ( browserAgent.indexOf( 'msie 5' ) !== -1 ) ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP';

                    try {
                        throw xhr = new ActiveXObject( ieBrowser );
                    } catch (xhr) {
                        console.error("[Exception] ajax() XMLHttpRequest failed: " + xhr);
                        return false;
                    }

                } else {
                    // Firefox, Safari, Mozilla
                    xhr = new XMLHttpRequest();
                }

                if( xhr === null ) {
                    console.error("[Error] ajax() XMLHttpRequest failed !");
                    return false;
                }
            }

            function init(args) {

                if(xhrinit() === false) {return}

                let ajaxMethod = args.method;
                let ajaxUrl    = args.url;
                let ajaxData   = args.data;
                let ajaxType   = args.dataType;
                let ajaxContentType = args.contentType;

                if(ajaxMethod === "POST" || ajaxMethod === "PUT" || ajaxMethod === "DELETE") {
                    console.log("POST ?", ajaxMethod)

                    if(ajaxData && ajaxMethod === "POST") ajaxContentType = 'application/x-www-form-urlencoded';

                    xhr.open(ajaxMethod, ajaxUrl, true);
                    xhr.setRequestHeader("Content-type", ajaxContentType);
                    xhr.send(ajaxData);

                    xhr.onreadystatechange = function () {
                        if(
                            xhr.readyState === 4 ||
                            xhr.readyState === 0 ||
                            xhr.readyState === "complete"
                        ) {
                            if (xhr.status === 200) {
                                if(args.hasOwnProperty('success') && typeof args.success === 'function') {
                                    args.success(xhr.response);
                                }
                            } else {
                                if(args.hasOwnProperty('error') && typeof args.error === 'function') {
                                    args.error(xhr.responseText);
                                }
                            }
                        }
                    }
                }

                if(ajaxMethod === "GET") {
                    console.log("GET ?", ajaxMethod);
                    xhr.open(ajaxMethod, ajaxUrl + "?" + ajaxData, true);
                    xhr.send(ajaxData);
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            if(args.hasOwnProperty('success') && typeof args.success === 'function') {
                                args.success(xhr.response);
                            }
                        } else {
                            if(args.hasOwnProperty('error') && typeof args.error === 'function') {
                                args.error(xhr.responseText);
                            }
                        }
                    }
                }

                return this;
            }

            try {
                init(args);
            } catch (err) {
                console.error("[Exception] ajax() => " + err);
            }

        },

        requester: function(){
        },

        receiver: function(){
        },

        /***
         * Properties Handler
         * */

        props: function(type, value) {
            return this.attr(type, value);
        },

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

        screenSizer: function(params) {
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
                    console.exception("Invalid value to parameter width in function screenSizer()");
                }
                /*Height*/
                if(params.hasOwnProperty('height') && params.height.hasOwnProperty('calc')) {
                    h = Math.ceil(100 - (($$.intNumber(params.height.calc) / s.height) * 100)) + (params.height.adjust || 0);
                    h = h + "%";
                } else if(params.hasOwnProperty('height') && params.height.hasOwnProperty('fixed')) {
                    h = params.height.fixed;
                } else {
                    console.exception("Invalid value to parameter height in function screenSizer()");
                }

                jH(params.target).width(w);
                jH(params.target).height(h);

                console.log("screenSizer", w, h);
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

        screenSizerStop: function() {
            clearInterval(sizeCtrl);
            return null;
        },

        /***
         * Events Listener
         * */

        click: function(param = "", callback) {
            let _sel = this.sel;
            let keys = Object.keys(_sel);
            (keys.length > 0) ?
                keys.forEach(function(index) {
                    try {
                        _sel[index].removeEventListener("click", jsHunter.fn.noth);
                    } catch (ex) {
                        console.exception("exception...");
                    }
                    _sel[index].addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.log("click-1");
                    });
                }) : (_sel) ? (function (){
                    try {
                        _sel.removeEventListener("click", jsHunter.fn.noth);
                    } catch (ex) {
                        console.exception("exception...");
                    }
                    _sel.addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.log("click-2");
                    })
                })()
                 : jsHunter.fn.exception("click() error " + _sel);
            return this;
        },

        isOn: function(params, index) {
            let _sel    = this.sel;
            let keys    = Object.keys(_sel);
            let state   = "";
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
                                jsHunter.fn.exception("isOn() error: invalid params -> " + params.type);
            } catch(err) {
                console.error(err);
            }
            return state;
        },

        on: function(ev, callback) {
            let _sel = this.sel;
            let args = this.args;
            let keys = (_sel) ? Object.keys(_sel) : "";
            try {
                (keys.length > 0) ?
                    keys.forEach(function(index) {
                        try {
                            _sel[index].removeEventListener(ev, jsHunter.fn.noth);
                        } catch (ex) {
                            console.exception("exception...");
                        }
                        _sel[index].addEventListener(ev, function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            callback((args === undefined) ? "" : (args.rsp === 'eventTarget') ? jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel[index]));
                        });
                    }) : (_sel) ?
                    (function(){
                        try {
                            _sel.removeEventListener(ev, jsHunter.fn.noth);
                        } catch (ex) {
                            console.exception("exception...");
                        }
                        _sel.addEventListener(ev, function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            callback((args === undefined) ? "" : (args.rsp === 'eventTarget') ? jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel));
                        })
                    })() : jsHunter.fn.exception("on() error: check you calling: "+ev);

            } catch(err) {
                console.error(err);
            }
            return this;
        },

        /***
         * Writers And Modifiers
         * */

        html: function(text) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML = text;
                    }) : (_sel) ?
                    _sel.innerHTML = text : jsHunter.fn.exception("html() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        append: function(text) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML += text;
                    }) : (_sel) ?
                    _sel.innerHTML += text : jsHunter.fn.exception("append() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        addClass: function(classname, index) { //console.log("addClass::classname", classname);
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >=0) && nodes.length > 0) { //console.log("IF1");
                    if(!jsHunter.fn.matchClass(nodes[index], classname)) {
                        nodes[index].className += " " + classname;
                        nodes[index].className = jsHunter.fn.trim(nodes[index]);
                    }
                } else if(nodes.length > 0 && !index) { //console.log("IF2");
                    nodes.forEach(function(inode) {
                        if(!jsHunter.fn.matchClass(inode, classname)) {
                            inode.className += " " + classname;
                            inode.className = jsHunter.fn.trim(inode.className);
                        }
                    });
                } else if(node) { //console.log("IF3");
                    if(!jsHunter.fn.matchClass(node, classname)) {
                        node.className += " " + classname;
                        node.className = jsHunter.fn.trim(node.className);
                    }
                } else if(element.length > 0) { //console.log("IF4");
                    keys.forEach(function(inode) {
                        if(!jsHunter.fn.matchClass(element[inode], classname)) {
                            element[inode].className += " " + classname;
                            element[inode].className = jsHunter.fn.trim(element[inode].className);
                        }
                    });
                } else if(element && element.length > 0) { //console.log("IF5");
                    if(!jsHunter.fn.matchClass(element, classname)) {
                        element.className += " " + classname;
                        element.className = jsHunter.fn.trim(element.className);
                    }
                } else { //console.log("ELSE");
                    jsHunter.fn.exception("addClass() error, nodes and selector is undefined !");
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        removeClass: function(classname, index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                (index || index >= 0) && (nodes.length > 0) ?
                    nodes[index].classList.remove(classname) :
                    (nodes.length > 0) && (!index) ?
                        nodes.forEach(function(inode) {
                            inode.classList.remove(classname);
                        }) : (node) ?
                        node.classList.remove(classname) :
                        (element.length > 0) ?
                            keys.forEach(function(inode) {
                                element[inode].classList.remove(classname);
                            }) :
                            (element) ?
                                element.classList.remove(classname) :
                                jsHunter.fn.exception("removeClass() error, nodes is undefined !");
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        setClass: function(classname, index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >=0) && nodes.length > 0) { console.log("IF1");
                    nodes[index].className = classname;
                } else if(nodes.length > 0 && !index) { console.log("IF2");
                    nodes.forEach(function(inode) {
                        inode.className = classname;
                    });
                } else if(node) { console.log("IF3");
                    node.className = classname;
                } else if(element.length > 0) { console.log("IF4");
                    keys.forEach(function(inode) {
                        element[inode].className = classname;
                    });
                } else if(element) { console.log("IF5");
                    element.className = classname;
                } else { console.log("ELSE");
                    jsHunter.fn.exception("setClass() error, nodes and selector is undefined !");
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        resetStyle: function(index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >= 0) && nodes.length >0) {
                    nodes[index].className = "";
                } else if(nodes.length > 0 && !index) {
                    nodes.forEach(function(inode) {
                        inode.className = "";
                    });
                } else if(node) {
                    node.className = "";
                } else if(element.length > 0) {
                    keys.forEach(function(inode) {
                        element[inode].className = "";
                    });
                } else if(element) {
                    element.className = "";
                } else {
                    jsHunter.fn.exception("resetStyle() error, nodes is undefined !")
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        create: function(params) {
            let el = _createHtmlElement(params);
            (params.hasOwnProperty('timeout') && params.timeout > 0) ?
                (function(){
                    setTimeout(function(){
                        jsHunter.fn.remove(params.append, params.attr_name);
                    }, params.timeout);
                })() : jsHunter.fn.noth();
            return el;
        },

        remove: function(parent, children) {
            let _el_ = document.querySelectorAll(parent);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].removeChild(document.querySelector(children));
            });

            return this;
        },

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

        /***
         * Information Data
         * */

        text: function(i) {
            return (i >= 0) ? this.sel[i].textContent || this.sel[i].text :
                (this.sel[0].textContent || this.sel[0].text) ? this.sel[0].textContent || this.sel[0].text :
                    jsHunter.fn.exception("text() error " + this.sel);

        },

        getData: function(a, e) {
            switch(a) {
                case "undefined":
                    return e;
                case "text":
                    return e.text || e.textContent || e.innerText;
                case "textContent":
                    return e.textContent || e.text || e.innerText;
                case "value":
                    return e.value;
                case "html":
                    return e.innerHTML;
                case "outer":
                    return e.outerHTML;
                case "src":
                    return e.src;
                case "attr":
                    return e.attributes;
                case "href":
                    return e.href;
                case "eventTarget":
                    return e.target.id;
                case "hash":
                    return e.hash;
                default:
                    throw "Invalid argument [" + a + "] on getData !";
            }
        },

        screen: function() {
            return {width: window.innerWidth, height: window.innerHeight};
        },

        computedCss: function(element) {
            try {
                return _getStyles(element);
            } catch (err) {
                console.error("[Exception]: styles() => " + err);
            }
        },

        val: function(dt) {
            try {

                let _sel = this.sel;
                nodes = [];/*Reset nodes state*/

                if(!_sel) {
                    jsHunter.fn.exception("Wrong or missing selector!");
                } else if(!dt) {console.log("!dt", _sel);
                    //Get value
                    _sel.forEach(function(a, index, el) {
                        nodes.push(_sel[index].value);
                    });
                } else {console.log("else", _sel);
                    //Set Value
                    _sel.forEach(function(a, index, el) {
                        _sel[index].value = dt;
                    })
                }

            } catch (err) {
                console.error("[Exception] val() => " + err);
            }
            return (nodes.length === 1) ? nodes[0] : (nodes.length > 1) ? nodes : null;
        },

        /***
         * Visual Handlers
         * */

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

        fadeIn: function(p) {
            clearInterval(fadeCtrl); /*Bug Fix*/
            let _opacity  = 0; /*0....100*/
            let _element  = this.sel; /*Copy current target tag (Conflict Fix)*/
            let _keys     = Object.keys(_element);
            let _selector = this.selector; /*Save current selector (fadeOut())*/
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 10;
            let _timeout = (p.hasOwnProperty("timeout")) ? p.timeout : 0;

            _keys.forEach(function(index){

                /*CSS Reset Element*/
                _element[index].style.display = "block";

                /*Cross Browser CSS > IE*/
                if( userAgent.indexOf( 'msie' ) !== -1 ) {
                    _element[index].style.filter  = "alpha(opacity=0)";
                } else { _element[index].style.opacity = "0"; }

            });

            fadeCtrl = setInterval(function(){

                _keys.forEach(function(index){

                    if((_opacity >= 100)) {
                        clearInterval(fadeCtrl);

                        /*Automatic Close*/
                        if(parseInt(_timeout) > 0) {

                            setTimeout(function(){
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

        fadeOut: function(p) {
            clearInterval(fadeCtrl); /*Bug Fix*/
            let _opacity  = 100; /*100....0*/
            let _element  = this.sel; /*copy current target tag (noConflict)*/
            let _keys     = Object.keys(_element);
            /*let _selector = this.selector;*/
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 1;

            fadeCtrl = setInterval(function(){

                _keys.forEach(function(index){

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

        height: function(value) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.height = value;
                    }) : (_sel) ?
                    _sel.style.height = value : jsHunter.fn.exception("[Exception] height() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        width: function(value) {
            try {
                let _sel = this.sel;
                (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.width = value;
                    }) : (_sel) ?
                    _sel.style.width = value : jsHunter.fn.exception("[Exception] width() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        hidden: function(element) {
            let _el_ = document.querySelectorAll(element);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].style.display = 'none';
            });
        },

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

        sizer: function(element, orientation, value, type) {
            try {
                _changeElementSize(element, orientation, value, type);
            } catch(err) {
                console.error("[Exception] sizer() => " + err);
            }
            return this;
        },

        opacity: function(element, opacity) {
            try {
                _opacityElement(element, opacity);
            } catch(err) {
                console.error("[Exception] opacity() => " + err);
            }
            return this;
        },

        centralize: function(element, element_width, element_height) {
            try {
                _middlePositionConfigure(element, element_width, element_height);
            } catch(err) {
                console.error("[Exception] centralize() => " + err);
            }
            return this;
        },

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

        /***
         * Css Handler
         * */

        /*css: function(jhuntercss, val) {
            try {

                let _sel = this.sel;

                if(!prop || !val) {
                    jsHunter.fn.exception("Wrong or missing css parameters");
                } else if(_sel) {
                    let keys = Object.keys(_sel);

                    keys.forEach(function(index) {
                        _sel[index].style.display = 'none';
                        _setAttributesStyles(_sel[index], {prop: val});
                    });

                } else {
                    jsHunter.fn.exception("Wrong or missing target selector");
                }

            } catch (err) {
                console.error("[Exception] css() error " + err);
            }
            return this;
        },*/ //TODO: DEVELOP

        /***
         * Data Structure
         * */

        jsonMap: function() {
            return this;
        },

        arrayMap: function() {
            return this;
        },

        listMap: function() {
            return this;
        },

        objectMap: function() {
            return this;
        },

        csvMap: function() {
            return this;
        },

        envMap: function() {
            return this;
        },

        /***
         * Utils And Others
         * */

        select: function() {
            try {
                let _sel = this.sel;

                if (_sel && _sel.length === 1 && (typeof _sel === "object" || Array.isArray(_sel))) {
                    return this.sel[0];
                } else if(_sel.length > 1) {
                    return this.sel;
                } else {
                    console.error("[Exception] select() error, wrong or missing element [sel]");
                }
            } catch (err) {
                console.error("[Exception] select() error, wrong or missing element [sel]");
            }
            return this;
        },

        hunter: function(wanted, nodeType) {
            try {
                let hunt = document.querySelectorAll(wanted);
                let keys = Object.keys(hunt);
                nodes    = [];
                node     = "";
                (keys.length > 0) ?
                    (function () {
                        keys.forEach(function(index) {
                            if(nodeType && nodeType === "parent") {
                                nodes.push(hunt[index].parentElement)
                            } else if(nodeType && nodeType === "children") {
                                nodes.push(hunt[index]);
                            } else if(nodeType && nodeType === "self") {
                                nodes.push(hunt[index]);
                            }
                        })
                        jsHunter.fn.nodes = nodes;
                    })() :
                    (hunt) ?
                        (function (){
                            if(nodeType && nodeType === "parent") {
                                node = hunt.parentElement;
                            } else if(nodeType && nodeType === "children"){
                                node = hunt
                            } else if(nodeType && nodeType === "self"){
                                node = hunt
                            }
                            jsHunter.fn.node = node;
                        })() :
                        jsHunter.fn.exception("hunter() error, not found: " + wanted);
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        nodeParent: function(parentItem) { console.log("NODEPARENT", parentItem + " " + this.selector);
            try {
                jsHunter.fn.hunter(parentItem + " " + this.selector, "parent");
                (nodes.length <= 0) ? 
                    jsHunter.fn.exception("nodeParent() error, not found [" + parentItem + " " + this.selector + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        nodeChild: function(childItem) {
            try {
                jsHunter.fn.hunter(this.selector + " " + childItem);
                (nodes.length <= 0) ? 
                jsHunter.fn.exception("nodeChild() error, not found [" + this.selector + " " + childItem + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        },

        matchId: function(element, id_value) {
            return (
                element.id.search(id_value) >= 0 ||
                element.id.search(" " + id_value) >= 0 ||
                element.id.search(id_value + " ") >= 0
            );
        },

        matchClass: function(element, classname) {
            return (
                element.className.search(classname) >= 0 ||
                element.className.search(" " + classname) >= 0 ||
                element.className.search(classname + " ") >= 0
            );
        },

        findId: function(id) {
            return !!document.querySelector('#'+id.replace(/#/g, ''));
        },

        findClass: function(classname) {
            return !!document.querySelectorAll('.'+classname.replace(/\./g, '')).length;
        },

        findElements: function(element) {
            if(element.search(/^\[(.*)+\]$/) !== -1) {
                return !!document.querySelectorAll(element).length;
            }
            jsHunter.fn.exception("findElements() error: target is not a valid DOM element to data-set []");
        },

        joinSplit: function(args) {
        },

        intNumber: function(data) {
            if(isNaN(data)) {
                return parseInt((data).replace(/[^0-9]/gi, ""));
            }
            return parseInt(data);
        },

        trim: function(data) {
            return data
                .replace(/^( +)([0-9a-zA-Z ,'"\\\/_\[\-\].!@#$%&*()]+)( +)?$/gi, '$2')
                .replace(/ +$/, '');
        },

        hexToRgb: function(color_hex) {
            let i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_hex);

            if(!i) {
                console.log("Your hexadecimal color expression is wrong !");
                return null;
            }

            return {
                r: parseInt(i[1], 16),
                g: parseInt(i[2], 16),
                b: parseInt(i[3], 16),
                rgb: parseInt(i[1], 16) +','+ parseInt(i[2], 16) +','+ parseInt(i[3], 16)
            }
        },
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
