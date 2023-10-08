/*
*
* Project: jsHunter UI
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
     - INITIALIZER OF UI EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in ui extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /*
     --------------------------------------------------------------------------------
     - VARIABLES UI
     --------------------------------------------------------------------------------
     */

    let
        /*Global Themes*/
        __themes__ = [
            'default',
            'dark',
            'light',
            'green',
            'red',
            'blue',
            'pink',
            'yellow',
            'silver',
            'brown',
            'material',
            'opacity',
            'adapted',
            'modern',
            'discreet'
        ],
        __theme__ = null,
        __lang__ = null,

        /*Modal controls*/
        modalCtrl = null,
        loopCtrl  = 0,

        /*ProgressBar controls*/
        $progressBar = null,

        /*Tooltip controls*/
        tooltipCtrl = null,

        /*Toaster controls*/
        toasterCount = 0,
        lastPosition = null,
        currentHeight = null,
        confirmQuestion = false,
        arrayQuestion = [],

        /*Slider Controls*/
        ctrlSlider = null,
        slideInCtrl = null,
        slideInBoxCtrl = null,
        ctrlControls = null,
        slide_play = true,
        slide_stop = false,

        /*Typist Controls*/
        ctrlTypist = null;

    /*
     --------------------------------------------------------------------------------
     - PRIVATE GLOBAL FUNCTIONS
     --------------------------------------------------------------------------------
     */

    function _setGlobalTheme(t) {
        __theme__ = t;
    }

    function _getTheme(theme){
        theme = theme.replace(/[-]/g, '');
        if (theme === "default") {theme = "";}
        if (!$$.empty(theme)) {
            if (!$$.inArray(__themes__, theme, true)) {
                $$.log("Incorrect Theme ("+theme+"), see the documentation").except();
                return false;
            }
        }
        if (__theme__ !== null) {theme = __theme__; }
        if (!$$.empty(theme)) { theme = "-"+theme; }
        return theme;
    }

    function _setGlobalLang(l) {
        __lang__ = l;
    }

    function _getLang(lang){
        lang = lang.replace(/[-]/g, '');

        if (lang.search(/ptbr|en|es/) === -1) {
            lang = "en";
        }
        return lang;
    }

    /*
     --------------------------------------------------------------------------------
     - PRIVATE MODAL FUNCTIONS
     --------------------------------------------------------------------------------
     */

    function _lockScreenClicked(params) {
        jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
            if(rsp === params.lock_screen.replace(/[#.]g/, '')) {
                _modalClose(params);
            }
        });
    }

    function _modalInit(params) {

        switch (params.effect) {

            case 'accordion':
                _modalAccordion(params);
                break;

            case 'normal':
                _modalNormal(params);
                break;

            case 'fade':
                _modalFade(params);
                break;

            case 'elastic':
                _modalElastic(params);
                break;

            case 'inside-out':
                _modalInsideOut(params);
                break;

            default:
                $$.log("Error on _modalInit(), invalid parameters !").error();
        }
    }

    function _modalAccordion(params) {

        switch (params.action) {

            case "open":

                jsHunter(params.selector).margin('left', params.margin_left, 'px');
                jsHunter(params.selector).height(params.css_height);

                setTimeout(function(){

                    jsHunter(params.selector).margin('left', params.css_margin_left, 'px');

                    setTimeout(function(){
                        jsHunter(params.selector).height(params.effect_height);
                    }, 800);

                    //Button Event for modal close
                    jsHunter("[data-close-modalX]").on('click', function(){
                        params.action = 'close';
                        _modalAccordion(params);
                    });

                    //Event target when lock screen is clicked
                    jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                        if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                            params.action = 'close';
                            _modalAccordion(params);
                        }
                    });

                    //Automatic close when configured
                    if(params.timeout > 0) {
                        params.action = 'close';

                        setTimeout(function(){
                            _modalAccordion(params);
                        }, params.timeout);
                    }

                }, 200);

                break;

            case "close":

                jsHunter(params.selector).height(params.css_height);

                setTimeout(function() {

                    jsHunter(params.selector).margin('left', params.margin_left, 'px');

                    //Time to close lock screen
                    setTimeout(function(){
                        _modalUnLockScreen(params);
                    }, 500);

                }, 800);

                break;
        }
    }

    function _modalNormal(params) {

        let _more_width_ = (params.styles.width / params.speed);
        let _end_width_ = params.styles.width;
        let _opacity_ = ((params.opacity + params.opacdiv) / 100);

        modalCtrl = setInterval(function() {

            params.more_width += _more_width_;

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                params.more_width = _end_width_;
                _modalFinish(params);

            } else {

                params.opacity += _opacity_;

                jsHunter.fn.sizer(params.element,'width', params.more_width,'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    jsHunter.fn.sizer(params.element, 'height', params.more_width, 'px');
                }

                jsHunter.fn.opacity(params.element, params.opacity)

                jsHunter.fn.centralize(params.element, params.more_width, params.more_width);
            }

        }, 1);
    }

    function _modalFade(params) {

        let _opacity_ = 0.1;

        jsHunter.fn.sizer(params.element, 'width', params.styles.width, 'px');
        jsHunter.fn.sizer(params.element, 'height', params.styles.height, 'px');

        if(params.wide === true) {
            jsHunter.fn.sizer(params.element, 'width', params.wide_width, 'px');
            jsHunter.fn.sizer(params.element, 'height', params.max_height, 'px');
        }

        jsHunter.fn.centralize(params.element, params.element.style.width, params.element.style.height);

        modalCtrl = setInterval(function() {

            if(parseInt(params.opacity.toString()) >= 1) {

                clearInterval(modalCtrl);
                jsHunter.fn.opacity(params.element, '1');

                //Event target when lock screen is clicked
                _lockScreenClicked(params);

                //Button Event for modal close
                jsHunter("[data-close-modalX]").on('click', function(){
                    _modalClose(params);
                });

                //Automatic Modal Close
                if(parseInt(params.timeout) > 0) {
                    _modalAutoClose(params);
                }

            } else {
                params.opacity += _opacity_;

                jsHunter.fn.opacity(params.element, params.opacity);
            }

        }, 30);
    }

    function _modalElastic(params) {

        loopCtrl = 0; /*Reset control*/

        let _more_width_ = 50;
        let _end_width_ = params.styles.width + 100;
        let _opacity_ = (params.opacity + params.opacdiv) / 100;

        modalCtrl = setInterval(function() {

            params.more_width += _more_width_;

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                _modalDecrease(params);

            } else {

                params.opacity += _opacity_;

                jsHunter.fn.opacity(params.element, params.opacity);
                jsHunter.fn.sizer(params.element, 'width', params.more_width, 'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    jsHunter.fn.sizer(params.element, 'height', params.more_width, 'px');
                }

                jsHunter.fn.centralize(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);
    }

    function _modalInsideOut(params) {

        clearInterval(modalCtrl);

        let _element = jsHunter(params.modal).select();/*Get element target*/
        let _styles = jsHunter.fn.computedCss(_element);/*Get css styles of element*/
        let _width = _styles.all.width;/*Get initial width (px, %)*/
        let _height = _styles.all.height;/*Get initial height (px, %)*/
        let _end_width = parseInt(_width);/*Store origin width of element*/
        let _end_height = parseInt(_height);/*Store origin height of element*/
        let _measure = "px";/*Type of measure, can be pixels or percentage*/
        let _add_width = 0;/*Initial value to increase width*/
        let _add_height = 0;/*Initial value to increase height*/

        /*Initial sizer at element*/
        jsHunter.fn.sizer(_element, 'width', 0, _measure);
        jsHunter.fn.sizer(_element, 'height', 0, _measure);

        /*Check measure type used in element*/
        if(_width.search(/%$/) !== -1) {//Percentage
            _add_width = _add_height = 1;
            _width = _end_width - 20;
            _height = _end_height - 20;
            _measure = "%";
        } else if(_width.search(/px$/) !== -1) {//Pixels
            _add_width = _add_height = 20;
            _width = _end_width - 200;
            _height = _end_height - 200;
        }

        /*Check default timer to fade effect*/
        if(!params.hasOwnProperty('timer_fade') || params.timer_fade > 10) {
            params.timer_fade = 5;
        }

        if(!params.hasOwnProperty('replacer')) {
            jsHunter(params.selector).fadeIn(params);
            /*Update margin element*/
            jsHunter(params.modal).margin('all', 0);
        } else {
            jsHunter(params.replacer).fadeIn(params);

            let local = {
                closeModal: function() {
                    jsHunter.fn.remove(params.replacer, params.selector);
                    jsHunter.fn.remove("body", params.replacer);
                }
            }

            //Event target when lock screen is clicked
            _lockScreenClicked(params);

            /*Button Event for modal close*/
            jsHunter("[data-close-modalX]").on('click', function(){
                local.closeModal();
            });

            /*Automatic Modal Close*/
            if(params.timeout > 0) {
                setTimeout(function(){
                    local.closeModal();
                }, parseInt(params.timeout));
            }
        }

        /*Loop to handler and view the element target - modal*/
        modalCtrl = setInterval(function() {

            _width += _add_width;/*Increase width*/

            if(_width >= _end_width) {/*Check if element reached the width limit*/
                clearInterval(modalCtrl);
                jsHunter.fn.sizer(_element, 'width', _end_width, _measure);
                jsHunter.fn.sizer(_element, 'height', _end_height, _measure);
            } else {

                /*Apply the increase width*/
                jsHunter.fn.sizer(_element, 'width', _width, _measure);

                /*Apply the increase height (only element height)*/
                if(jsHunter.fn.intNumber(_element.style.height) <= _end_height) {
                    _height += _add_height;
                    jsHunter.fn.sizer(_element, 'height', _height, _measure);
                }

                /*Centralize element target on screen*/
                jsHunter.fn.centralize(_element, _element.offsetWidth, _element.offsetHeight);

            }
        }, 10);
    }

    function _modalResize(params, option) {
        if (option === 'sum') {
            params.more_width += 10;
        } else if(option === 'sub') {
            params.more_width -= 10;
        }
        jsHunter.fn.sizer(params.element, 'width', params.more_width, 'px');
        return params.more_width;
    }

    function _modalDecrease(params) {

        let _end_width_ = params.styles.width - 100;

        modalCtrl = setInterval(function(){

            if(params.more_width <= _end_width_) {

                clearInterval(modalCtrl);
                _modalIncrease(params);

            } else {

                params.more_width = _modalResize(params, 'sub');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    jsHunter.fn.sizer(params.element, 'height', params.styles.height, 'px');
                }

                jsHunter.fn.centralize(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);

    }

    function _modalIncrease(params) {

        let _end_width_ = params.styles.width + 100;

        modalCtrl = setInterval(function(){

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                jsHunter.fn.sizer(params.element, 'width', _end_width_, 'px');
                _modalFinish(params);

            } else {

                params.more_width = _modalResize(params, 'sum');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    jsHunter.fn.sizer(params.element, 'height', params.styles.height, 'px');
                }

                jsHunter.fn.centralize(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);
    }

    function _modalFinish(params) {

        if(params.effect === 'elastic') {

            loopCtrl++;

            if(loopCtrl < params.loop) {
                _modalDecrease(params);
            } else {

                /*Event target when lock screen is clicked*/
                jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                    if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                        _modalClose(params);
                    }
                });

                /*Button Event for modal close*/
                jsHunter("[data-close-modalX]").on('click', function(){
                    _modalClose(params);
                });

                /*Automatic Modal Close*/
                if(params.timeout > 0) {
                    _modalAutoClose(params);
                }
            }

        } else {

            modalCtrl = setInterval(function(){

                if(params.more_width <= params.styles.width) {

                    clearInterval(modalCtrl);

                    /*When wide is configured*/
                    if(params.wide && params.styles.width) {
                        _modalDoWide(params);
                    }

                    /*Button Event for modal close*/
                    jsHunter("[data-close-modalX]").on('click', function(){
                        _modalClose(params);
                    });

                    /*Event target when lock screen is clicked*/
                    jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                        if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                            _modalClose(params);
                        }
                    });

                    /*Automatic Modal Close*/
                    if(parseInt(params.timeout) > 0) {
                        _modalAutoClose(params);
                    }

                } else {
                    params.more_width -= 5;

                    jsHunter.fn.sizer(params.element, 'width', params.more_width, 'px');
                    jsHunter.fn.centralize(params.element, params.more_width, params.more_width);
                }

            }, 1);
        }
    }

    function _modalAutoClose(params) {
        setTimeout(function(){
            _modalClose(params);
        }, parseInt(params.timeout));
    }

    function _modalDoWide(params) {

        let _wf_ = parseInt(params.more_width);

        modalCtrl = setInterval(function(){

            if(_wf_ >= parseInt(params.wide_width)) {
                clearInterval(modalCtrl);
            } else {
                _wf_ += 15;

                jsHunter.fn.sizer(params.element, 'width', _wf_, 'px');
                jsHunter.fn.centralize(params.element, _wf_, params.more_width);
            }

        }, 1);
    }

    function _modalClose(params) {

        clearInterval(modalCtrl);

        let _width_down_ = 0;
        let _opacity_ = 100;
        let _opacdiv_ = 15;
        let _element_ = params.element;
        let _styles_ = jsHunter.fn.computedCss(_element_);

        params.width = _styles_.width;
        params.height = _styles_.height;
        params.element = _element_;
        params.width_down = _width_down_;
        params.save_width = _styles_.save_width;
        params.opacity = _opacity_;
        params.opacdiv = _opacdiv_;

        if(params.effect === 'fade') {
            _modalCloseFade(params);
        } else if(params.effect === 'normal') {
            _modalCloseWide(params);
        } else if(params.effect === 'elastic') {
            jsHunter("#"+_element_.id || "."+_element_.className).hide();
            _modalUnLockScreen(params);
        } else {
            _modalCloseDefault(params);
        }
    }

    function _modalCloseWide(params) {

        modalCtrl = setInterval(function() {

            params.width -= 15;

            if(params.width <= params.height) {
                clearInterval(modalCtrl);
                _modalCloseDefault(params);
            } else {
                jsHunter.fn.sizer(params.element, 'width', params.width, 'px');
                jsHunter.fn.centralize(params.element, params.width, params.height);
            }

        }, 1);
    }

    function _modalCloseDefault(params) {

        modalCtrl = setInterval(function() {

            params.width -= 15;

            if(params.width <= params.width_down) {

                clearInterval(modalCtrl);
                /*CSS Reset to Element Original Size*/
                jsHunter.fn.sizer(params.element, 'width', params.save_width, 'px');
                jsHunter.fn.sizer(params.element, 'height', params.save_width, 'px');
                jsHunter(params.selector).display('none');
                _modalUnLockScreen(params);

            } else {

                params.opacity -= 2;
                jsHunter.fn.sizer(params.element, 'width', params.width, 'px');
                jsHunter.fn.sizer(params.element, 'height', params.width, 'px');
                jsHunter.fn.opacity(params.element, (params.opacity / 100).toString());
                jsHunter.fn.centralize(params.element, params.width, params.width);

            }

        }, 1);
    }

    function _modalCloseFade(params) {

        let _opacity_ = 1;

        modalCtrl = setInterval(function() {

            if(_opacity_ <= 0) {

                clearInterval(modalCtrl);
                _modalUnLockScreen(params);

            } else {
                _opacity_ -= 0.1;
                jsHunter.fn.opacity(params.element, _opacity_)
            }

        }, 30);
    }

    function _modalLockScreen(_name_, _back_color_, _opacity_) {

        $$.create({
            element: "div",
            attr_type: "id",
            attr_name: _name_,
            append: "body",
            styles: {
                back_color: _back_color_,
                width: "100%",
                height: "100%",
                position: "fixed",
                z_index: "1000",
                top: "0px",
                left: "0px",
                opacity: _opacity_,
                display: "block"
            }
        });
    }

    function _modalUnLockScreen(params) {
        jsHunter.fn.hidden(params.selector);
        jsHunter.fn.remove(params.lock_screen, params.selector);
        jsHunter.fn.remove("body", params.lock_screen);
    }

    function _modalBody(target, _title_, _body_) {

        let body = "PGgxIGlkPSJoMV9tb2RhbFgiPg0KCTxzcGFuIGlkPSJtb2RhbFhfdGl0bGUiPk1vZGFsIFRpdGxlPC9zcGFuPg0KCTxzcGFuIGlkPSJzcGFuX21vZGFsWF90aXRsZSI+DQogIAkJPGEgaWQ9ImFfbW9kYWxYX2Nsb3NlIiBkYXRhLWNsb3NlLW1vZGFseD0iIj5YPC9hPg0KCTwvc3Bhbj4NCjwvaDE+DQo8ZGl2IGlkPSJtb2RhbFhfY29udGVudCI+DQoJPHAgaWQ9InBfbW9kYWxYIj5Nb2RhbCBDb250ZW50PC9wPg0KPC9kaXY+";

        jH(target).html(atob(body));

        if(_title_ !== '') {
            jH("#modalX_title").html(_title_);
        }

        if(_body_ !== '') {
            jH("#modalX_content").html(_body_);
        }

    }

    /*
     --------------------------------------------------------------------------------
     - MODALS COMPONENTS
     --------------------------------------------------------------------------------
     */

    /**[NO_THEME]
     * @description Modal, show a simple modal
     * @param {object} params (object: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.modal = function(params = {}) {
        try {
            if(typeof  params === "undefined") {
                throw "Modal params missing !";
            } else {
                let ef = params.effect;
                let _selector = jsHunter.selector;/*copy current target tag (noConflict)*/

                if(params.action === "open") {
                    switch (ef) {
                        case "fade":
                            jsHunter(_selector).fadeIn(params);
                            break;
                        case "show":
                            jsHunter(_selector).display("block");
                            break;
                        case "inside-out":
                            params.selector = _selector;
                            _modalInit(params);
                            break;
                        default:
                            throw "Wrong params to modal effect !";
                    }

                    /*Event Listener for close whe clicked in locks screen element*/
                    jsHunter(_selector, {rsp: "eventTarget"}).on('click', function(rsp) {
                        if(rsp === _selector.replace("#", '').replace(".", "")) {
                            if(ef === "inside-out") {
                                jsHunter(_selector).display("none");
                            } else {
                                jsHunter(_selector).fadeOut(params);
                            }
                        }
                    });
                }

                if(params.action === "close") {
                    switch (ef) {
                        case "fade":
                            jsHunter(_selector).fadeOut(params);
                            break;
                        case "hide":
                            jsHunter(_selector).display("none");
                            break;
                        default:
                            throw "Wrong params to modal effect !";
                    }
                }
            }

        } catch(err) {
            $$.log("modal() error => "+err).error();
        }

        return this;
    }

    /**[NO_THEME]
     * @description ModalFX, show an modal flyer
     * @param {object} params (object: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.modalFX = function(params = {}) {

        let _configFX_ = (params.hasOwnProperty('config')) ? params.config : '';
        let _c_action_ = (_configFX_.hasOwnProperty("action")) ? _configFX_.action : false;
        let _c_timeout_ = (_configFX_.hasOwnProperty("timeout")) ? _configFX_.timeout : 0;
        let _c_speed_ = (_configFX_.hasOwnProperty("speed")) ? _configFX_.speed : 40;
        let _c_effect_ = (_configFX_.hasOwnProperty("effect")) ? _configFX_.effect : 'accordion';

        let _elementFX_ = (params.hasOwnProperty("element")) ? params.element : '';
        let _e_name_ = (_elementFX_.hasOwnProperty("name")) ? _elementFX_.name : "#box";
        let _e_width_ = (_elementFX_.hasOwnProperty("width")) ? _elementFX_.width : "900px";
        let _e_height_ = (_elementFX_.hasOwnProperty("height")) ? _elementFX_.height : "405px";
        let _e_back_color_ = (_elementFX_.hasOwnProperty("back_color")) ? _elementFX_.back_color : "#FFFFFF";
        let _e_text_color_ = (_elementFX_.hasOwnProperty("text_color")) ? _elementFX_.text_color : "#000000";
        let _e_ini_margin_left_ = (_elementFX_.hasOwnProperty("ini_margin_left")) ? _elementFX_.ini_margin_left : "-4000px";
        let _e_css_margin_left_ = (_elementFX_.hasOwnProperty("css_margin_left")) ? _elementFX_.css_margin_left : "-450px";
        let _e_css_height_ = (_elementFX_.hasOwnProperty("css_height")) ? _elementFX_.css_height : "#100px";
        let _e_effect_transition_ = (_elementFX_.hasOwnProperty("effect_transition")) ? _elementFX_.effect_transition : "all .5s ease-in";
        let _e_effect_height_ = (_elementFX_.hasOwnProperty("effect_height")) ? _elementFX_.effect_height : "600px";

        let _lock_screenFX_ = (params.hasOwnProperty("lock_screen")) ? params.lock_screen : '';
        let _ls_state_ = (_lock_screenFX_.hasOwnProperty("state")) ? _lock_screenFX_.state : true;
        let _ls_name_ = (_lock_screenFX_.hasOwnProperty("name")) ? _lock_screenFX_.name : "#bg";
        let _ls_back_color_ = (_lock_screenFX_.hasOwnProperty("back_color")) ? _lock_screenFX_.back_color : "#000000";
        let _ls_opacity_ = (_lock_screenFX_.hasOwnProperty("opacity") && _lock_screenFX_.opacity !== false) ? _lock_screenFX_.opacity : "1";

        let _contentFX_ = (params.hasOwnProperty("content")) ? params.content : '';
        let _stateFX_ = (_contentFX_.hasOwnProperty("state")) ? _contentFX_.state : false;
        let _titleFX_ = (_contentFX_.hasOwnProperty("title")) ? _contentFX_.title : '';
        let _bodyFX_ = (_contentFX_.hasOwnProperty("body")) ? _contentFX_.body : '';
        let _stylizeX_ = (_contentFX_.hasOwnProperty("stylize")) ? _contentFX_.stylize : 'modal_default';

        /*Max Size for this element*/
        let _max_width_ = 900;
        let _max_height_ = 405;

        /*Fix size for widget width/height*/
        _e_width_ = (jsHunter.fn.intNumber(_e_width_) > _max_width_) ? _max_width_+"px" : _e_width_ ;
        _e_height_ = (jsHunter.fn.intNumber(_e_height_) > _max_height_) ? _max_height_+"px" : _e_height_ ;

        if(_ls_state_ === true) {
            _modalLockScreen(_ls_name_, _ls_back_color_, _ls_opacity_);
        }

        /*CREATE A HTML ELEMENT (ModalFX Box)*/
        _elementFX_ = $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: _e_name_,
            append: (_ls_state_) ? _ls_name_ : "body",
            styles: {
                back_color: _e_back_color_,
                text_color: _e_text_color_,
                width: _e_width_,
                height: _e_height_,
                margin: '0px',
                margin_left: _e_ini_margin_left_,
                margin_bottom: '100px',
                left: '50%',
                top: '50px',
                border_radius: '10px',
                box_shadow: '2px 3px 16px #000000',
                overflow: 'hidden',
                position: 'absolute',
                transition: _e_effect_transition_,
            }
        });

        /*Init body modal with a html data fake*/
        if(_stateFX_ === false) {
            _modalBody(_e_name_, '', '');
        } else {
            _modalBody(_e_name_, _titleFX_, _bodyFX_);
        }

        /*Stylized*/
        if(_stylizeX_ !== "modal_default") {
            jsHunter('#div_modal').resetStyle().addClass(_stylizeX_);
        }

        /*Init Modal Presentation and controls*/
        _modalInit({
            action: _c_action_,
            element: _elementFX_, /*id.selector*/
            timeout: _c_timeout_, /*time*/
            speed: _c_speed_, /*40*/
            effect: _c_effect_, /*accordion*/
            selector: _e_name_, /*ref*/
            lock_screen: _ls_name_,
            wide_width: _max_width_, /*max-wide-width*/
            max_height: _max_height_, /*max height for modal*/
            margin_left: _e_ini_margin_left_,
            css_margin_left: _e_css_margin_left_,
            css_height: _e_css_height_,
            effect_height: _e_effect_height_,
        });

        return this;

    }

    /**[NO_THEME]
     * @description ModalX, show an modal and use any themes available in library
     * @param {object} params (object: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.modalX = function(params = {}) {

        (modalCtrl !== null) ? clearInterval(modalCtrl) : void(0);

        let _more_width_ = 0;
        let _opacity_ = 0;
        let _opacdiv_ = 15;

        let _config_ = (params.hasOwnProperty('config')) ? params.config : '';
        let _c_timeout_ = (_config_.hasOwnProperty("timeout")) ? _config_.timeout : 0;
        let _c_speed_ = (_config_.hasOwnProperty("speed")) ? _config_.speed : 40;
        let _c_wide_ = (_config_.hasOwnProperty("wide")) ? _config_.wide : false;
        let _c_effect_ = (_config_.hasOwnProperty("effect")) ? _config_.effect : 'normal';
        let _c_loop_ = (_config_.hasOwnProperty("loop")) ? _config_.loop : 3;
        let _c_force_ = (_config_.hasOwnProperty("force")) ? _config_.force : false;

        if((_c_effect_ !== "elastic" && _c_speed_ < 40) || _c_speed_ > 40) {
            _c_speed_ = 40;
        }

        let _element_ = (params.hasOwnProperty("element")) ? params.element : '';
        let _e_name_  = (_element_.hasOwnProperty("name")) ? _element_.name : "#div_modal";
        let _e_width_ = (_element_.hasOwnProperty("width")) ? _element_.width : "800px";
        let _e_height_ = (_element_.hasOwnProperty("height")) ? _element_.height : "400px";
        let _e_margin_ = (_element_.hasOwnProperty("margin")) ? _element_.margin : "5% auto";
        let _e_padding_ = (_element_.hasOwnProperty("padding")) ? _element_.padding : "15px";
        let _e_back_color_ = (_element_.hasOwnProperty("back_color")) ? _element_.back_color : "#FFFFFF";
        let _e_text_color_ = (_element_.hasOwnProperty("text_color")) ? _element_.text_color : "#000000";
        let _e_border_color_ = (_element_.hasOwnProperty("border_color")) ? _element_.border_color : "#EEEEEE";
        let _e_opacity_ = (_element_.hasOwnProperty("opacity") && _element_.opacity !== false) ? _element_.opacity : "1";

        let _lock_screen_ = (params.hasOwnProperty("lock_screen")) ? params.lock_screen : '';
        let _ls_state_ = (_lock_screen_.hasOwnProperty("state")) ? _lock_screen_.state : true;
        let _ls_name_ = (_lock_screen_.hasOwnProperty("name")) ? _lock_screen_.name : "#div_lock_screen";
        let _ls_back_color_ = (_lock_screen_.hasOwnProperty("back_color")) ? _lock_screen_.back_color : "#000000";
        let _ls_opacity_ = (_lock_screen_.hasOwnProperty("opacity") && _lock_screen_.opacity !== false) ? _lock_screen_.opacity : "1";

        let _contentX_ = (params.hasOwnProperty("content")) ? params.content : '';
        let _stateX_ = (_contentX_.hasOwnProperty("state")) ? _contentX_.state : false;
        let _titleX_ = (_contentX_.hasOwnProperty("title")) ? _contentX_.title : '';
        let _bodyX_ = (_contentX_.hasOwnProperty("body")) ? _contentX_.body : '';
        let _stylizeX_ = (_contentX_.hasOwnProperty("stylize")) ? _contentX_.stylize : 'modal_default';

        /*Max Height for html element according window size*/
        let _max_width_ = window.innerWidth - 200;
        let _max_height_ = window.innerHeight - 200;

        if(_ls_state_ === true) {
            _modalLockScreen(_ls_name_, _ls_back_color_, _ls_opacity_);
        }

        /*CREATE A HTML ELEMENT (Modal Box)*/
        _element_ = $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: _e_name_,
            append: (_ls_state_) ? _ls_name_ : "body",
            styles: {
                back_color: _e_back_color_,
                text_color: _e_text_color_,
                width: _e_width_,
                height: _e_height_,
                margin: _e_margin_,
                padding: _e_padding_,
                opacity: _e_opacity_,
                display: "block"
            }
        });

        /*Init body modal with a html data fake*/
        if(_stateX_ === false) {
            _modalBody(_e_name_, '', '');
        } else {
            _modalBody(_e_name_, _titleX_, _bodyX_);
        }

        let _styles_ = jsHunter.fn.computedCss(_element_);

        /*Fix size for widget width/height*/
        _styles_.width = (_styles_.width > _max_width_ || !_c_force_ && _c_wide_) ? _max_width_ : _styles_.width ;
        _styles_.height = (_styles_.height > _max_height_ || !_c_force_ && _c_wide_) ? _max_height_ : _styles_.height ;

        if(_c_effect_ !== 'inside-out') {
            /*CSS Reset Element*/
            _element_.style.width = "0px";
            _element_.style.height = "0px";
            _element_.style.display = "block";
            _element_.style.color = _e_text_color_ || "#FEFEFE";
            _element_.style.background = "rgba(" + jsHunter.fn.hexToRgb(_e_back_color_).rgb + ", " + _e_opacity_ + ")";
            _element_.style.borderRadius = "2px";
            _element_.style.boxShadow = "3px 4px 10px #222222";
            _element_.style.opacity = "0";
            _element_.style.border = "solid " + _e_border_color_ + " 1px";
            _element_.style.transition = "all 1ms ease-out";
        }

        /*Without Lock Screen*/
        if (!_ls_state_) {
            _element_.style.position = "fixed";
            _element_.style.zIndex = "5000";
            _element_.style.top = "0px";
            _element_.style.left = "0px";
            _element_.style.margin = "0px";
            _styles_.width = _max_width_ = window.innerWidth;
            _styles_.height = _max_height_ = window.innerHeight;
        }

        /*Stylized*/
        if(_stylizeX_ !== "modal_default") {
            jsHunter('#div_modal').resetStyle().addClass(_stylizeX_);
        }

        /*Init Modal Presentation and controls*/
        _modalInit({
            more_width: _more_width_, /*0*/
            opacity: _opacity_, /*0*/
            opacdiv: _opacdiv_, /*15*/
            element: _element_, /*id.selector*/
            styles: _styles_, /*all, width, height, width_save*/
            timeout: _c_timeout_, /*time*/
            speed: _c_speed_, /*40*/
            wide: _c_wide_, /*true|false*/
            effect: _c_effect_, /*type and number of exec*/
            loop: _c_loop_,
            selector: _e_name_, /*ref*/
            lock_screen: _ls_name_,
            wide_width: _max_width_, /*max-wide-width*/
            max_height: _max_height_, /*max height for modal*/
            /*To inside-out effect*/
            modal: _e_name_,
            replacer: _ls_name_
        });

        return this;

    }

    /**[THEME]
     * @description ModalTheme, a complete and customizable modal with themes  available in the library
     * @param {object} params (object: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.modalTheme = function(params = {}) {

        let _timeout_ = (params.hasOwnProperty('timeout')) ? params.timeout : 0;
        let _theme_ = (params.hasOwnProperty('theme')) ? params.theme : '';
        let _lock_back_color_ = (params.hasOwnProperty('lock_back_color')) ? params.lock_back_color : 'none';
        let _effect_ = (params.hasOwnProperty('effect') && params.effect === "inside-out") ? params.effect : 'none';
        let _content_ = (params.hasOwnProperty('content')) ? params.content : '';
        let _back_color_ = (_content_.hasOwnProperty('back_color')) ? _content_.back_color : 'none';
        let _title_ = (_content_.hasOwnProperty('title')) ? _content_.title : 'Sample Title';
        let _body_ = (_content_.hasOwnProperty('body')) ? _content_.body : 'Sample Body';
        let _footer_ = (_content_.hasOwnProperty('footer')) ? (_content_.footer === false) ? false : _content_.footer : false;

        /*Check if element already exists in DOM*/
        if(document.querySelector("#modal-container__thematic")) {
            return;
        }

        /*Global Theme ?*/
        if (_theme_.search(/__thematic$/) === -1) {
            _theme_ = _getTheme(_theme_);
            _theme_ = "jh-modal-theme" + _theme_;
        }

        /*CREATE STRUCTURE HTML OF ELEMENTS (modalTheme)*/

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "#modal-container__thematic",
            append: "body"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "#modal-box",
            append: "#modal-container__thematic"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "#modal-close",
            append: "#modal-box"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "#modal-title",
            append: "#modal-box"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "#modal-content",
            append: "#modal-box"
        });

        if(_footer_ !== false) {
            $$.create({
                element: "div",
                attr_type: "id",
                attr_name: "#modal-footer",
                append: "#modal-box"
            });
            jsHunter('#modal-footer').html(_footer_);
        } else {
            jsHunter('#modal-content').height('90%');
        }

        /*Writer in box*/
        jsHunter('#modal-close').html('X');
        jsHunter('#modal-title').html(_title_);
        jsHunter('#modal-content').html(_body_);
        jsHunter('#modal-container__thematic').addClass(_theme_);

        if(_lock_back_color_ !== 'none') {
            jsHunter('#modal-container__thematic').addClass(_lock_back_color_);
        }

        if(_back_color_ !== 'none') {
            jsHunter('#modal-content').addClass(_back_color_);
        }

        /*Show box*/
        if(_effect_ === 'none') {
            jsHunter('#modal-box').fadeIn({timer_fade: 10});
        } else {
            params.selector = "#modalcontainer__thematic";
            params.modal = "#modal-box";
            _modalInsideOut(params);
        }

        /*
        * Close Modal
        * */

        /*Event Listener for close by button X modal-close*/
        jsHunter('#modal-close').on('click', function(){
            jsHunter('#modal-container__thematic')
                .fadeOut({
                    timer_fade: 10,
                    remove: true,
                    parent: 'body',
                    children: '#modal-container__thematic'
                });
        });

        /*Event Listener for close whe clicked in locks screen element*/
        jsHunter('#modal-container__thematic', {rsp: "eventTarget"}).on('click', function(rsp) {
            if(rsp === 'modal-container__thematic') {
                jsHunter('#modal-container__thematic')
                    .fadeOut({
                        timer_fade: 10,
                        remove: true,
                        parent: 'body',
                        children: '#modal-container__thematic'
                    });
            }
        });

        /*Automatic Modal Close*/
        if(parseInt(_timeout_) > 0) {
            setTimeout(function(){
                jsHunter('#modal-container__thematic')
                    .fadeOut({
                        timer_fade: 10,
                        remove: true,
                        parent: 'body',
                        children: '#modal-container__thematic'
                    });
            }, parseInt(_timeout_));
        }

        return this;

    }

    /*
     --------------------------------------------------------------------------------
     - MESSAGE COMPONENTS
     --------------------------------------------------------------------------------
     */

    /**[NO_THEME]
     * @description Tooltip, show a temporary message to error or success on process
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.tooltip = function(params = {}) {

        let text = ($$.has('text').in(params)) ? params.text : "";
        let timer = ($$.has('timer').in(params)) ? params.timer : 3500;
        let timeout = ($$.has('timeout').in(params)) ? params.timeout : 1000;
        let theme = ($$.has('theme').in(params)) ? "-"+params.theme : "";

        let tooltip_container;
        let tooltip_message_close;

        function _error() {
            tooltip_container = "jh-tooltip-container-error"+theme;
            tooltip_message_close = "jh-tooltip-message-close-error";
            _run();
        }

        function _success() {
            tooltip_container = "jh-tooltip-container-success"+theme;
            tooltip_message_close = "jh-tooltip-message-close-success";
            _run();
        }

        function _default() {
            tooltip_container = "jh-tooltip-container-default"+theme;
            tooltip_message_close = "jh-tooltip-message-close-default";
            _run();
        }

        function _run() {
            setTimeout(function() {
                _create();
                _exec();
            }, timer);
        }

        function _create() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: tooltip_container,
                append: "body"
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: tooltip_message_close,
                append: "#"+tooltip_container
            });

            jH("#"+tooltip_container).addClass('jh-tooltip-container');
            jH("#"+tooltip_message_close).addClass('jh-tooltip-message-close');
        }

        function _exec() {

            jH("#"+tooltip_message_close).html(text);
            jH("#"+tooltip_container).fadeIn({timer_fade: 10});

            clearTimeout( tooltipCtrl );
            tooltipCtrl = setTimeout(function(){
                jH("#"+tooltip_container).fadeOut({timer_fade: 10});
                setTimeout(function() {
                    $$.remove('body', "#"+tooltip_container);
                }, timeout + 500);
                clearTimeout( tooltipCtrl );
            }, timeout);
        }

        return {"default": _default, "success": _success, "error": _error};
    }

    /**[THEME]
     * @description Toaster, to show a fast messages to any purposes
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.toaster = function(params = {}) {

        let type = ($$.has('type').in(params)) ? "-"+params.type : "default";
        let text = ($$.has('text').in(params)) ? params.text : "Missing text...";
        let timeout = ($$.has('timeout').in(params)) ? params.timeout : 2500;
        let buttons = ($$.has('buttons').in(params)) ? params.buttons : [];

        /*Set a default theme*/
        if (type === "-default" || type === "default") {
            type = "";
        }

        /*ClassName Themes*/
        let toaster_container_class = "jh-toaster-container";
        let toaster_container_theme_class = "jh-toaster-container"+type;
        let toaster_content_class = "jh-toaster-content";
        let toaster_content_text_class = "jh-toaster-content-text";
        let toaster_question_class = "jh-toaster-question";
        let toaster_question_button_yes_class = "jh-toaster-question-button-yes";
        let toaster_question_button_no_class = "jh-toaster-question-button-no";

        /*Uniq Ids Elements*/
        let toaster_container_id = "jh-toaster-container"+type+"-"+toasterCount;
        let toaster_content_id = toaster_content_class+type+"-"+toasterCount;
        let toaster_text_content_id = toaster_content_text_class+type+"-"+toasterCount;
        let toaster_question_id = toaster_question_class+type+"-"+toasterCount;
        let toaster_question_bt1_id = toaster_question_button_yes_class+type+"-"+toasterCount;
        let toaster_question_bt2_id = toaster_question_button_no_class+type+"-"+toasterCount;

        toasterCount+=1;

        function _getLastPositionTop() {
            lastPosition = $$.higherNumber(jH('.jh-toaster-container').cssCurrent('top'));
            if(lastPosition === 0 || !lastPosition) {
                lastPosition = 30;
            } else {
                lastPosition += currentHeight;
            }

            /*Adjust position when confirm is requested*/
            if (confirmQuestion) {
                lastPosition += 5;
                confirmQuestion = false;
            }
        }

        function _run() {
            _getLastPositionTop();
            _create();
            _exec();
        }

        function _create() {

            /*Container*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: toaster_container_id,
                append: "body",
                styles: {
                    top: lastPosition+"px"
                }
            });

            /*Content*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: toaster_content_id,
                append: "#"+toaster_container_id
            });

            /*Text Content*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: toaster_text_content_id,
                append: "#"+toaster_content_id
            });

            jH("#"+toaster_container_id).addClass(toaster_container_class);
            jH("#"+toaster_container_id).addClass(toaster_container_theme_class);
            jH("#"+toaster_content_id).addClass(toaster_content_class);
            jH("#"+toaster_text_content_id).addClass(toaster_content_text_class);
            jH("#"+toaster_text_content_id).html(text);

            currentHeight = parseInt(jH("#"+toaster_container_id).cssCurrent('height')[0]) + 50;
        }

        function _question() {

            /*Question*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: toaster_question_id,
                append: "#"+toaster_content_id
            });

            /*Question Button YES*/
            $$.create({
                element:  "button",
                attr_type: "id",
                attr_name: toaster_question_bt1_id,
                append: "#"+toaster_question_id
            });

            /*Question Button NO*/
            $$.create({
                element:  "button",
                attr_type: "id",
                attr_name: toaster_question_bt2_id,
                append: "#"+toaster_question_id
            });

            /*Question Buttons Show*/
            let bt_lb1 = (buttons[0]) ? buttons[0] : "Yes";
            let bt_lb2 = (buttons[1]) ? buttons[1] : "No";
            jH("#"+toaster_question_id).addClass(toaster_question_class);
            jH("#"+toaster_question_bt1_id).addClass(toaster_question_button_yes_class);
            jH("#"+toaster_question_bt1_id).html(bt_lb1).val('1');
            jH("#"+toaster_question_bt2_id).addClass(toaster_question_button_no_class);
            jH("#"+toaster_question_bt2_id).html(bt_lb2).val('0');
            jH("#"+toaster_question_id).display("block");
        }

        function _finalize() {
            /*Toaster Destroyer*/
            $$.move("#"+toaster_container_id).to("right", "-500px");

            setTimeout(function () {
                $$.remove("body", "#" + toaster_container_id);
            }, 1200);
        }

        function _exec() {

            setTimeout(function() {
                /*Toaster Viewer*/
                $$.move("#"+toaster_container_id).to("right", "0px");

                setTimeout(function() {
                    if (!arrayQuestion[toaster_container_id] === true) {
                        _finalize();
                    }
                }, timeout + (toasterCount * 300));

            }, 1 + (toasterCount * 300));
        }

        function confirm(callback, args) {

            confirmQuestion = true;
            arrayQuestion[toaster_container_id] = true;
            _question();

            jH("#"+toaster_question_bt1_id).on('click', function(){
                if (typeof callback === "function") {
                    callback(args);
                    _finalize();
                }
            });

            jH("#"+toaster_question_bt2_id).on('click', function(){
                _finalize();
            });
        }

        try {
            _run();
        } catch (er) {
            $$.log('toaster() => ' + er).except();
        }

        return {"confirm":confirm}
    }

    /**[THEME]
     * @description Alert, dialog box to show any information about any process
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.alert = function(params = {}) {

        let title = ($$.has('title').in(params)) ? params.title : "Title";
        let text = ($$.has('text').in(params)) ? params.text : "Hi, I'm a test !";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let button = ($$.has('button').in(params)) ? params.button : "Close";
        let exception = ($$.has('exception').in(params)) ? params.exception : false;

        let jh_alert_block_screen = "jh-alert-block-screen";
        let jh_alert_container = "jh-alert-container";

        /*Accept Shortcut Use*/
        if (typeof params === "string") {
            title = "Alert";
            text = params;
            theme = "default";
            button = "OK";
        }

        theme = _getTheme(theme);

        /*Create Elements*/
        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: jh_alert_block_screen,
            append: "body"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: jh_alert_container,
            append: "body"
        });

        if (exception === false) {
            $$.create({
                element: "div",
                attr_type: "id",
                attr_name: "jh-alert-button-x-close",
                append: "#" + jh_alert_container
            });
        }

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "jh-alert-title",
            append: "#"+jh_alert_container
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "jh-alert-content",
            append: "#"+jh_alert_container
        });

        $$.create({
            element:  "p",
            attr_type: "id",
            attr_name: "jh-alert-content-text",
            append: "#jh-alert-content"
        });

        if (exception === false) {
            $$.create({
                element: "button",
                attr_type: "id",
                attr_name: "jh-alert-button",
                append: "#" + jh_alert_container
            });
        }

        jH("#"+jh_alert_block_screen).addClass(jh_alert_block_screen+theme);
        jH("#"+jh_alert_container).addClass(jh_alert_container+theme);

        /*Show content*/
        jH("#jh-alert-title").html(title);
        jH("#jh-alert-content-text").html(text);

        if (exception === false) {

            jH("#jh-alert-button-x-close").html("x");
            jH("#jh-alert-button").html(button);

            /*Events Apply*/
            let bts = "#jh-alert-button, #jh-alert-button-x-close";
            jH(bts).on('click', function () {
                $$.remove("body", "#" + jh_alert_block_screen);
                $$.remove("body", "#" + jh_alert_container);
            });
        }

        return null;
    }

    /**[THEME]
     * @description Confirm, dialog box to confirm operations
     * @param {object} params (object: Mandatory)
     * @param {function} callback (function: Mandatory)
     * @param {string} args (mixed: Optional)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.confirm = function(params, callback, args) {

        let title = ($$.has('title').in(params)) ? params.title : "Confirm";
        let question = ($$.has('question').in(params)) ? params.question : "Are you sure ?";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let buttons = ($$.has('buttons').in(params)) ? params.buttons : ["Ok", "Cancel"];

        theme = _getTheme(theme);

        let jh_confirm_block_screen = "jh-confirm-block-screen";
        let jh_confirm_container = "jh-confirm-container";

        /*Bug Prevent*/
        if (buttons.length !== 2) {
            buttons[0] = "Ok";
            buttons[1] = "Cancel";
        }

        /*Create Elements*/
        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: jh_confirm_block_screen,
            append: "body"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: jh_confirm_container,
            append: "body"
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "jh-confirm-title",
            append: "#"+jh_confirm_container
        });

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: "jh-confirm-content",
            append: "#"+jh_confirm_container
        });

        $$.create({
            element:  "p",
            attr_type: "id",
            attr_name: "jh-confirm-content-text",
            append: "#jh-confirm-content"

        });

        $$.create({
            element:  "button",
            attr_type: "id",
            attr_name: "jh-confirm-button-yes",
            append: "#"+jh_confirm_container
        });

        $$.create({
            element:  "button",
            attr_type: "id",
            attr_name: "jh-confirm-button-no",
            append: "#"+jh_confirm_container
        });

        jH("#"+jh_confirm_block_screen).addClass(jh_confirm_block_screen+theme);
        jH("#"+jh_confirm_container).addClass(jh_confirm_container+theme);

        /*Show content*/
        jH("#jh-confirm-title").html(title);
        jH("#jh-confirm-content-text").html(question);
        jH("#jh-confirm-button-yes").html(buttons[0]);
        jH("#jh-confirm-button-no").html(buttons[1]);

        /*Events Apply*/
        jH("#jh-confirm-button-yes").on('click', function() {
            if (typeof callback === "function") {
                callback(args);
                $$.remove("body", "#"+jh_confirm_block_screen);
                $$.remove("body", "#"+jh_confirm_container);
            }
        });

        jH("#jh-confirm-button-no").on('click', function() {
            $$.remove("body", "#"+jh_confirm_block_screen);
            $$.remove("body", "#"+jh_confirm_container);
        });

        return null;
    }

    /**[THEME]
     * @description Typist, make automatic digital text
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.typist = function(params = {}) {

        let target = (params.hasOwnProperty('target')) ? params.target : "";
        let speed = (params.hasOwnProperty('speed')) ? params.speed : 75;
        let timeout = (params.hasOwnProperty('timeout')) ? params.timeout : 5000;
        let text = (params.hasOwnProperty('text')) ? params.text : "jsHunter-ui is working...";
        let loop = (params.hasOwnProperty('loop')) ? params.loop : false;
        let array_text = text.split('');
        let n = 0;/*Loop Control*/

        function typistWriter() {
            clearInterval(ctrlTypist);
            ctrlTypist = setInterval(function() {
                if (n === array_text.length) {
                    if (loop) {
                        clearInterval(ctrlTypist);
                        setTimeout(function() {
                            jH(target).html("");
                            n = 0;
                            typistWriter();
                        }, timeout);
                    } else {
                        clearInterval(ctrlTypist);
                    }
                } else {
                    jH(target).append(array_text[n]);
                    n += 1;
                }
            }, speed);
        }

        function run() {
            jH(target).addClass('jh-typist-blink');
            jH(target).html("");
            typistWriter();
        }

        return {"run": run};
    }

    /**[THEME]
     * @description Notifier, a small notifier to inform any things on the application
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.notifier = function(params = {}) {

        let title = (params.hasOwnProperty('title')) ? params.title : "Notifier";
        let text = (params.hasOwnProperty('text')) ? params.text : "notifier is working but without text";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";

        theme = _getTheme(theme);

        let jh_notifier_container = "jh-notifier-container";
        let jh_notifier_header = "jh-notifier-header";
        let jh_notifier_header_title = "jh-notifier-header-title";
        let jh_notifier_header_close = "jh-notifier-header-close";
        let jh_notifier_content = "jh-notifier-content";
        let jh_notifier_content_text = "jh-notifier-content-text";
        let jh_notifier_content_button = "jh-notifier-content-button";
        let jh_notifier_content_button_ok = "jh-notifier-content-button-ok";

        function _exec() {
            _create();
            setTimeout(function () {
                _active();
            }, 300);
        }

        function _create() {

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_container,
                append: "body"
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_header,
                append: "#"+jh_notifier_container
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_header_title,
                append: "#"+jh_notifier_header
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_header_close,
                append: "#"+jh_notifier_header
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_content,
                append: "#"+jh_notifier_container
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_content_text,
                append: "#"+jh_notifier_content
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: jh_notifier_content_button,
                append: "#"+jh_notifier_container
            });

            $$.create({
                element:  "button",
                attr_type: "id",
                attr_name: jh_notifier_content_button_ok,
                append: "#"+jh_notifier_content_button
            });

            jH("#"+jh_notifier_container).addClass(jh_notifier_container+theme);

            jH('#'+jh_notifier_header_title).html(title);
            jH('#'+jh_notifier_header_close).html("x");
            jH('#'+jh_notifier_content_text).html(text);
            jH('#'+jh_notifier_content_button_ok).html("OK").val("1");

        }

        function _active() {
            $$.move("#"+jh_notifier_container).to("bottom", "5px");

            jH("#"+jh_notifier_content_button_ok ).on('click', function(){
                $$.move("#"+jh_notifier_container).to("bottom", "-1000px");
            });

            jH("#"+jh_notifier_header_close ).on('click', function(){
                jH("#"+jh_notifier_container).hide();
            });
        }

        function _callback(fn, args) {
            if (typeof fn === "function") {
                jH("#"+jh_notifier_content_button_ok ).on('click', function(){
                    fn(args);
                    $$.move("#"+jh_notifier_container).to("bottom", "-1000px");
                });
            }
        }

        try {
            _exec();
        } catch (er) {
            $$.log('notifier() => ' + er).except();
        }

        return {"callback": _callback};
    }

    /**[THEME]
     * @description Box, create a generic box element to show any data
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.box = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let size = ($$.has('size').in(params)) ? params.size : "";
        let box_id = ($$.has('box_id').in(params)) ? params.box_id : "";
        let box_title = ($$.has('title').in(params)) ? params.title : "";
        let border = ($$.has('border').in(params)) ? params.border : false;
        let target = ($$.has('target').in(params)) ? params.target : "";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";

        /**
         * Global Settings
         */
        let sizes = ["-small", "-medium", "-large", "-full"];

        /**
         * Adjusts
         */
        if (size !== "") size = "-" + size;
        if (box_id !== "") box_id = "-" + box_id;
        if (!border || border === "") border = false;
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * Generic Functions
         * */
        function _checkin() {

            if (!$$.inArray(sizes, size)) {
                $$.log("box() error => Wrong size to box: " + size).error();
                return false;
            }

            if (!$$.findId(target) && target !== "body") {
                $$.log("box() error => Wrong target to box: " + target).error();
                return false;
            }

            return true;
        }

        function _boxClose() {
            jH("#jh-box-lock-screen"+box_id).fadeOut();

            setTimeout(function() {
                $$.remove('body', "#jh-box-lock-screen"+box_id);
            }, 1000);
        }

        function _boxOpen() {
            try {
                if (_checkin()) {
                    _create();
                }
            } catch (er) {
                $$.log().except("box() error => " + er);
            }
        }

        /**
         * Main Functions
         */
        function _create() {

            (function lockScreenBox() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-lock-screen"+box_id, "jh-box-lock-screen"],
                    append: target
                });
            })();

            (function boxContainer() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-container"+box_id, "jh-box-container"],
                    append: "#jh-box-lock-screen"+box_id
                });
                jH("#jh-box-container"+box_id).addClass("jh-box-container"+size);
            })();

            (function boxTitle() {
                if (box_title === "") return;

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-title"+box_id, "jh-box-title"],
                    append: "#jh-box-container"+box_id
                }, box_title);
            })();

            (function boxContent() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-content"+box_id, "jh-box-content"],
                    append: "#jh-box-container"+box_id
                });
            })();

            (function closeBoxContent() {
                if (size === "-large" || size === "-full") {
                    target = "#jh-box-content"+box_id;
                } else {
                    target = "#jh-box-lock-screen"+box_id;
                }

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-close"+box_id, "jh-box-close"],
                    append: target
                });

                $$.create({
                    element: "a",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-box-close-a"+box_id, "jh-box-close-a"],
                    append: "#jh-box-close"+box_id
                }, "X");

                jH("#jh-box-content"+box_id).fadeIn();
            })();

            (function eventBox() {
                jH("#jh-box-close-a"+box_id).on('click', function() {
                    _boxClose();
                });
            })();

            (function finish() {
                if (border === false) {
                    jH("#jh-box-container"+box_id).css("border", "none");
                }
            })();

        }

        return {"open": _boxOpen,"close": _boxClose};
    }

    /**[THEME]
     * @description Progress Bar, create a progress bar in the current document
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.dialog = function(params = {}) {

    }

    /*
     --------------------------------------------------------------------------------
     - WIDGET COMPONENTS
     --------------------------------------------------------------------------------
     */

    /**[THEME]
     * @description Progress Bar, create a progress bar in the current document
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.progressBar = function(params = {}) {

        let append_on = (params.hasOwnProperty('append_on')) ? params.append_on : "body";
        let controlled = (params.hasOwnProperty('controlled')) ? params.controlled : false;
        let theme = (params.hasOwnProperty('theme')) ? params.theme : "default";
        let progress = (params.hasOwnProperty('progress')) ? params.progress : 0;
        let total = (params.hasOwnProperty('total')) ? params.total : 100;
        let time = (params.hasOwnProperty('time')) ? params.time : 1000;
        let initializing = (params.hasOwnProperty('initializing')) ? params.initializing : false;
        let show_info = (params.hasOwnProperty('show_info')) ? params.show_info : false;
        let info = (params.hasOwnProperty('info')) ? params.info : [];
        let callback = (params.hasOwnProperty('callback')) ? params.callback : null;
        let steps = params.callback.length || 0;
        let step = 0;

        theme = _getTheme(theme);

        /*HTMLElement<structure>*/
        let progress_bar_container = "progress-bar-container";
        let progress_bar = "progress-bar";
        let progress_bar_info = "progress-bar-info";
        let progress_bar_info_steps = "progress-bar-info-steps";

        function createProgressBar() {

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: progress_bar_container,
                append: append_on
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: progress_bar,
                append: "#"+progress_bar_container
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: progress_bar_info,
                append: "#"+progress_bar
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: progress_bar_info_steps,
                append: "#"+progress_bar_container
            });

            jH("#"+progress_bar_container).addClass(progress_bar_container+theme);

        } createProgressBar();

        function checkSteps() {
            return steps !== 0;
        }

        function checkCallback() {
            return !(show_info === true && callback.length !== info.length);
        }

        function addStep() {
            step += 1;
        }

        function addProgress() {
            progress = total / steps * step;
        }

        function applyProgress() {
            jH("#"+progress_bar).anime("all 1s ease-out").width(progress+"%");
        }

        function showInfo() {
            if (show_info) {
                jH("#"+progress_bar_info).html(info[step-1]);
                jH("#"+progress_bar_info_steps).html(step+"/"+steps);
            }
        }

        function execProcess() {
            addStep();
            showInfo();
            addProgress();
            applyProgress();
        }

        function next() {
            if (controlled === true) {
                window.__jh_next__ += 1;
                let fn = callback[window.__jh_next__];
                setTimeout(function(){
                    fn();
                    execProcess();
                }, 1000);
            } else {
                $$.log("jsHunter-ui next() error: controlled is false").except();
            }
        }

        function last() {
            if (controlled === true) {
                window.__jh_next__ += 1;
                let fn = callback[window.__jh_next__];
                execProcess();
                setTimeout(function() {
                    fn();
                    if ($$.findId(progress_bar_container)) {
                        $$.remove(append_on, "#"+progress_bar_container);
                    }
                }, 1500);
            } else {
                $$.log("jsHunter-ui last() error: controlled is false").except();
            }
        }

        function makeProgress() {

            if (controlled === true) {

                window.__jh_next__ = 0;
                let fn = callback[window.__jh_next__];
                fn();
                execProcess();

            } else {

                for (let s = 0; s < steps; s++) {
                    if (typeof callback[s] === "function") {
                        let fn = callback[s];
                        setTimeout(function() {
                            fn();
                            execProcess();
                        }, time * (s*2));
                    }
                }
            }
        }

        function run(){
            if (!checkSteps()) {
                $$.log("jsHunter-ui progressBar() error: check steps").except();
                return false;
            }

            if (!checkCallback()) {
                $$.log("jsHunter-ui checkCallback() error: check callbacks").except();
                return false;
            }

            if (initializing) {
                jH("#"+progress_bar_info).html("Initializing...");

                setTimeout(function(){
                    makeProgress();
                }, 1500);

            } else {
                makeProgress();
            }

            return window.$progressBar = this;
        }

        return {"run":run, "next": next, "last": last};
    }

    /**[THEME]
     * @description Presenter, make a small presentation to welcome contents
     * @param {object} params (object: Mandatory)
     * @param {string} callback (string[:function]: Optional)
     * @param {string} args (mixed: Optional)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.presenter = function(params, callback, args) {

        let target = (params.hasOwnProperty('target')) ? params.target : "body";
        let message = (params.hasOwnProperty('message')) ? params.message : "Welcome to Presenter";
        let timer = (params.hasOwnProperty('timer')) ? params.timer : 3000;
        let theme = (params.hasOwnProperty('theme')) ? params.theme : "default";
        let effect = (params.hasOwnProperty('effect')) ? params.effect : "fade";

        theme = _getTheme(theme);

        let presenter = "jh-presenter-container";

        let presentation = [
            "<div class='jh-presenter-message'><h1 id='_h1_1_presenter_'>" + message + "</h1></div>",
            "<div class='jh-presenter-message'><h1 id='_h1_2_presenter_'>Please Wait</h1></div>"
        ];

        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: presenter,
            append: target
        });

        jH("#"+presenter).addClass(presenter+theme);

        if (typeof callback === "function") {

            if (effect === "fade") {
                jH("#"+presenter).html(presentation[0]);
                jH("#_h1_1_presenter_").fadeIn({timer_fade: 20});
                setTimeout(function () {
                    jH("#"+presenter).html(presentation[1]);
                    jH("#_h1_2_presenter_").fadeIn({timer_fade: 20});
                    setTimeout(function () {
                        jH("#"+presenter).fadeOut({timer_fade: 8});
                        setTimeout(function(){
                            $$.remove(target, "#"+presenter);
                            callback(args || "");
                        }, 1500);
                    }, timer + 1000);
                }, 2000);
            }

            if (effect === "blink") {/*TODO*/
            }

            if (effect === "top-down") {/*TODO*/
            }
        }

        return null;
    }

    /**[THEME]
     * @description MPlayer (Mini Player), create a simple player to control media components
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.mplayer = function(params = {}) {

        let target = (params.hasOwnProperty('target')) ? params.target : "";
        let theme = (params.hasOwnProperty('theme')) ? params.theme : "";
        let sampleEvents = {
            prev: function(){_ex("Missing Previous Control");},
            play: function(){_ex("Missing Play Control");},
            stop: function(){_ex("Missing Stop Control");},
            next: function(){_ex("Missing Next Control");}
        };
        let callbacks = (params.hasOwnProperty('callbacks')) ? params.callbacks : sampleEvents;

        target = target.replace(/[#.]/g, '');
        theme = _getTheme(theme);

        let mplayer = "jh-mplayer";
        let container = mplayer+"-container";

        function _ex(er){
            $$.log("mplayer() error => " + er).except();
        }

        function _showControls() {
            clearInterval(ctrlControls);
            jH("#"+container).show();
        }

        function _hideControls(){
            ctrlControls = setTimeout(function() {
                jH("#"+container).hide();
            }, 2000);
        }

        /*Create MPlayer Controls*/
        $$.create({
            element:  "div",
            attr_type: "id",
            attr_name: container,
            /*Is mandatory use id to append mplayer*/
            append: "#"+target
        });

        $$.create({
            element:  "ul",
            attr_type: "id",
            attr_name: mplayer+"-controls",
            /*Is mandatory use class to create player controls*/
            append: "#"+container
        });

        $$.create({
            element:  "li",
            attr_type: "id",
            attr_name: mplayer+"-control-prev",
            append: "#"+mplayer+"-controls"
        });

        $$.create({
            element:  "li",
            attr_type: "id",
            attr_name: mplayer+"-control-play",
            append: "#"+mplayer+"-controls"
        });

        $$.create({
            element:  "li",
            attr_type: "id",
            attr_name: mplayer+"-control-stop",
            append: "#"+mplayer+"-controls"
        });

        $$.create({
            element:  "li",
            attr_type: "id",
            attr_name: mplayer+"-control-next",
            append: "#"+mplayer+"-controls"
        });

        jH("#"+container).addClass(container+theme);

        _showControls();

        /*Content Player Controls*/
        jH('#'+mplayer+'-control-prev').html('<a class="">&#9665;</a>');
        jH('#'+mplayer+'-control-play').html('<a class="">&#9654;</a>');
        jH('#'+mplayer+'-control-stop').html('<a class="">&#9632;</a>');
        jH('#'+mplayer+'-control-next').html('<a class="">&#9655;</a>');

        /*Event Player Controls*/
        jH('#'+mplayer+'-control-prev').on('click', function() {
            if (typeof callbacks.prev === "function") {
                callbacks.prev();
            }
        });

        jH('#'+mplayer+'-control-play').on('click', function() {
            if (typeof callbacks.play === "function") {
                callbacks.play();
            }
        });

        jH('#'+mplayer+'-control-stop').on('click', function() {
            if (typeof callbacks.stop === "function") {
                callbacks.stop();
            }
        });

        jH('#'+mplayer+'-control-next').on('click', function() {
            if (typeof callbacks.next === "function") {
                callbacks.next();
            }
        });

        jH("#"+target).on('mouseenter', function() {
            _showControls();
        });

        jH("#"+target).on('mouseleave', function() {
            _hideControls();
        });

        return null;
    }

    /**[THEME]
     * @description slideIn, create a generic element slide in
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.slideIn = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let target = ($$.has('target').in(params)) ? params.target : "body";
        let identify = ($$.has('identify').in(params)) ? params.identify : "jh-slide-in";
        let origin = ($$.has('origin').in(params)) ? params.origin : "left";
        let position = ($$.has('position').in(params)) ? params.position : "absolute";
        let size = ($$.has('size').in(params)) ? params.size : "absolute";

        /**
         * Global Settings
         */
        let accepted_origin = ["top", "right", "bottom", "left"];
        let accepted_position = ["relative", "absolute", "fixed"];
        let accepted_sizes = ["small", "medium", "large", "full"];

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(theme);
        identify = identify.replace(/#/, "");

        /**
         * Generic Functions
         */
        function _checkin() {
            if (!$$.inArray(accepted_origin, origin)) {
                $$.log("slideIn() error => Wrong origin parameter: " + origin).error();
                return false;
            }

            if (!$$.inArray(accepted_position, position)) {
                $$.log("slideIn() error => Wrong position parameter: " + position).error();
                return false;
            }

            if (!$$.inArray(accepted_sizes, size)) {
                $$.log("slideIn() error => Wrong size parameter: " + size).error();
                return false;
            }

            if (target !== "body") {
                if (!$$.findId(target)) {
                    $$.log("slideIn()  error => Missing target element: " + target).error();
                    return false;
                }
            }
            return true;
        }

        function _show() {
            if (origin === "top") {
                jH('#'+identify).top("0px");
            } else if (origin === "right") {
                jH('#'+identify).right("0px");
            } else if (origin === "bottom") {
                jH('#'+identify).bottom("0px");
            } else if (origin === "left") {
                jH('#'+identify).left("0px");
            }
        }

        function _hide(ori = undefined) {
            if (ori) origin = ori;
            if (origin === "top") {
                jH('#'+identify).top("-2000px");
            } else if (origin === "right") {
                jH('#'+identify).right("-4000px");
            } else if (origin === "bottom") {
                jH('#'+identify).bottom("-2000px");
            } else if (origin === "left") {
                jH('#'+identify).left("-4000px");
            }
        }

        function _toggle() {
            if (origin === "top") {
                if (jH('#'+identify).top() === "-2000px" || jH('#'+identify).top() === "") {
                    jH('#'+identify).top("0px");
                } else {
                    jH('#'+identify).top("-2000px");
                }
            } else if (origin === "right") {
                if (jH('#'+identify).right() === "-4000px" || jH('#'+identify).right() === "") {
                    jH('#'+identify).right("0px");
                } else {
                    jH('#'+identify).right("-4000px");
                }
            } else if (origin === "bottom") {
                if (jH('#'+identify).bottom() === "-2000px" || jH('#'+identify).bottom() === "") {
                    jH('#'+identify).bottom("0px");
                } else {
                    jH('#'+identify).bottom("-2000px");
                }
            } else if (origin === "left") {
                if (jH('#'+identify).left() === "-4000px" || jH('#'+identify).left() === "") {
                    jH('#'+identify).left("0px");
                } else {
                    jH('#'+identify).left("-4000px");
                }
            }
        }

        /**
         * Main Functions
         */
        function _create() {
            /*Prevent Duplicated Element*/
            if ($$.findId(identify)) return;

            (function createSlideIn() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: [identify, "jh-slide-in"+theme],
                    append: target
                });

                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: [identify+"-close", "jh-slide-in-close"],
                    append: "#"+identify
                });

                $$.create({
                    element:  "a",
                    attr_type: ["id", "class"],
                    attr_name: [identify+"-close-a", "jh-slide-in-close-a"],
                    append: "#"+identify+"-close"
                }, "X");
            })();

            (function activeClose() {
                jH("#"+identify+"-close-a").on('click', function() {
                    _hide(origin);
                });
            })();

            (function adjustSlideIn() {
                jH("#"+identify).addClass("jh-slide-in-"+position);
                jH("#"+identify).addClass("jh-slide-in-"+origin);
                jH("#"+identify).addClass("jh-slide-in-"+size);
            })();
        }

        function _run() {
            try {
                if (_checkin()) {
                    _create();
                }
            } catch (er) {
                $$.log("slideIn() error => " + er).except();
            }
        }

        return {"run": _run, "hide": _hide, "show": _show, "toggle": _toggle};
    }

    /**[THEME]
     * @description Slider, show a custom and simple presentation slider from IMAGES
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.slider = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let presenter = (params.hasOwnProperty('presenter')) ? params.presenter : false;
        let controls = (params.hasOwnProperty('controls')) ? params.controls : false;
        let timeout = (params.hasOwnProperty('timeout')) ? params.timeout : 6000;
        let timer_fade = (params.hasOwnProperty('timer_fade')) ? params.timer_fade : 10;
        let mode = (params.hasOwnProperty('mode')) ? params.mode : "fade";
        let theme = (params.hasOwnProperty('theme')) ? params.theme : "default";
        let width = (params.hasOwnProperty('width')) ? params.width : "99.9";
        let height = (params.hasOwnProperty('height')) ? params.height : "700";
        let images = (params.hasOwnProperty('images')) ? params.images : null;
        let measure_width = width.replace(/[0-9]/g, '');
        let measure_height = height.replace(/[0-9]/g, '');

        /*Images List*/
        let image_list = [];
        let image_list_len = 0;

        /*Slider Control*/
        let n = 0;

        /**
         * Adjusts and tests
         */

        function _checkin() {

            /*Themes*/
            theme = _getTheme(theme);

            /*Times*/
            if (timeout < 6000) { timeout = 6000; }
            if (timer_fade <= 10) { timer_fade = 10; }
            if (!measure_width) { measure_width = "%"; }
            if (!measure_height) { measure_height = "%"; }

            /*Size Fix*/
            width = $$.intNumber(width);
            height = $$.intNumber(height);
        }

        function _create() {
            _checkin();
            /*Show Player Controls If Requested*/
            if (controls) {
                jsHunter.prototype.mplayer({
                    target: 'jh-slider-container',
                    theme: theme,
                    callbacks: {
                        prev: _prev,
                        play: _play,
                        stop: _stop,
                        next: _next
                    }
                });
            }
            jH("#jh-slider-container").addClass('jh-slider-container'+theme);
            _initImages();
        }

        function _initImages() {

            /*Convert Images List To Array*/
            if (!$$.isArray(images)) {

                let e = $$.objectMap(jH(".jh-slider-images img")).toArray('sel');

                for (let i = 0; i < e.length; i++) {
                    image_list.push(e[i].getAttribute('src'));
                }
                /*Hidden elements*/
                jH('.jh-slider-images img').hide();

            } else {
                image_list = images;
            }

            image_list_len = (image_list.length - 1);

            /*Run Presenter If Requested*/
            if (presenter) {
                $$.presenter(
                    {
                        target: ".jh-slider-images",
                        message: "Slider is loading...",
                        timer: 400,
                        theme: "adapted",
                        effect: "fade"
                    },
                    function() {
                        _runner();
                    });
            } else {
                _runner();
            }
        }

        function _runner() {

            /*Run First Element Viewer*/
            _first();

            /*Run Slider*/
            ctrlSlider = setInterval(function() {
                _slideNext();
            }, timeout);
        }

        function _first() {

            /*In this point: n = 0*/
            let first_img = '<img alt="" src="'+image_list[n]+'" id="jh-slider-image-'+n+'" />';

            /*Apply Effect To First Image*/
            _effect(first_img);
        }

        function _slidePrevious() {
            _set('prev');
            let dynamic_img = '<img alt="" src="'+image_list[n]+'" id="jh-slider-image-'+n+'" />';
            _effect(dynamic_img);
        }

        function _slideNext() {
            _set('next');
            let dynamic_img = '<img alt="" src="'+image_list[n]+'" id="jh-slider-image-'+n+'" />';
            _effect(dynamic_img);
        }

        function _effect(img) {

            /*Slider Image View*/
            jH('.jh-slider-images').html(img);

            /*For Fade Effect*/
            if (mode === "fade") {
                jH('#jh-slider-image-'+n).height(height+measure_height);
                jH('#jh-slider-image-'+n).fadeIn({timer_fade: timer_fade});
            }

            /*For Slide Effect*/
            if (mode === "slide") {
                try {
                    _slideIn('#jh-slider-image-'+n);
                } catch (er) {
                    clearInterval(slideInCtrl);
                    clearInterval(ctrlSlider);
                    $$.log("slider() error => " + er).except();
                }
            }

            /*For Mixed Effect*/ /*TODO*/
            /*if(mode === "mixed") {
                _slideMixIn('#jh-slider-image-'+n);
            }*/

            /*For Diagonal Effect*/ /*TODO*/
            /*if(mode === "diagonal") {
                _slideDiagonal('#jh-slider-image-'+n);
            }*/
        }

        function _slideIn(element) {

            clearInterval(slideInCtrl);

            let _width = 0;
            let _opacity = 0;
            let _element = jH(element).select();

            _element.style.width = _width+measure_width;
            _element.style.height = height+measure_height;
            _element.style.display = "block";

            slideInCtrl = setInterval(function() {

                if(_width >= width) {
                    clearInterval(slideInCtrl);
                    _background();
                } else {
                    _width += 10;
                    _opacity += ((_opacity + 10) / 100);

                    _element.style.width = _width + measure_width;
                    _element.style.opacity = _opacity;
                    _element.style.transition = "all 1ms ease-in";
                }

            }, 60);
        }

        function _background() {
            let s = "" +
                "background: url('"+image_list[n]+"'); " +
                "background-repeat: no-repeat; " +
                "background-size: "+width+measure_width+" "+height+measure_height+"; " +
                "background-position: center center;";
            jH('.jh-slider-images').css(s);
        }

        function _set(op) {
            if (op === 'next') {
                n += 1;
            } else if(op === 'prev') {
                n -= 1;
            }
            /*Image List Reset*/
            if (n > image_list_len) n = 0;
            if (n < 0) n = image_list_len;
        }

        /*Player Controls*/
        function _prev() {
            clearInterval(ctrlSlider);
            _slidePrevious();
        }

        function _play() {
            slide_play = true;
            slide_stop = false;
            _runner();
        }

        function _stop() {
            clearInterval(ctrlSlider);
            slide_play = false;
            slide_stop = true;
        }

        function _next() {
            clearInterval(ctrlSlider);
            _slideNext();
        }

        try {
            _create();
        } catch (e) {
            $$.log("slider() error => " + e).except();
        }

        return null;
    }

    /**[THEME]
     * @description SliderBox, show a custom and simple presentation slider from DIV
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.sliderBox = function(params = {}) {

        let presenter = (params.hasOwnProperty('presenter')) ? params.presenter : false;
        let controls = (params.hasOwnProperty('controls')) ? params.controls : false;
        let timeout = (params.hasOwnProperty('timeout')) ? params.timeout : 5000;
        let timer_fade = (params.hasOwnProperty('timer_fade')) ? params.timer_fade : 10;
        let mode = (params.hasOwnProperty('mode')) ? params.mode : "slide";
        let theme = (params.hasOwnProperty('theme')) ? params.theme : "default";
        let width = (params.hasOwnProperty('width')) ? params.width : 100;
        let height = (params.hasOwnProperty('height')) ? params.height : 700;
        let measure_width = width.replace(/[0-9]/g, '');
        let measure_height = height.replace(/[0-9]/g, '');

        /*Box List*/
        let box_list = [];
        let box_list_len = 0;

        /*Slider Controls*/
        let n = 0;

        /**
         * Adjusts and tests
         */

        function _checkin() {

            /*Themes*/
            theme = _getTheme(theme);

            /*Times*/
            if (timeout < 5000) { timeout = 5000; }
            if (timer_fade < 11) { timer_fade = 10; }
            if (!measure_width) { measure_width = "%"; }
            if (!measure_height) { measure_height = "%"; }

            /*Size Fix*/
            width = $$.intNumber(width);
            height = $$.intNumber(height);
        }

        function _createBox() {
            _checkin();
            /*Show Player Controls If Requested*/
            if (controls) {
                jsHunter.prototype.mplayer({
                    target: 'jh-slider-container',
                    theme: theme,
                    callbacks: {
                        prev: _prev,
                        play: _play,
                        stop: _stop,
                        next: _next
                    }
                });
            }
            jH("#jh-slider-container").addClass('jh-slider-container'+theme);
            _initBox();
        }

        function _initBox() {

            let selector = ".jh-slider-box > .jh-slider-box-slide";
            let e = $$.objectMap(jH(selector)).toArray('sel');

            for (let i = 0; i < e.length; i++) {
                box_list.push(e[i]);
            }
            /*Hidden elements*/
            jH(selector).hide();

            box_list_len = (box_list.length - 1);

            /*Run Presenter If Requested*/
            if (presenter) {
                $$.presenter(
                    {
                        target: ".jh-slider-box",
                        message: "Slider is loading...",
                        timer: 400,
                        theme: "adapted",
                        effect: "fade"
                    },
                    function() {
                        _runnerBox();
                    });
            } else {
                _runnerBox();
            }
        }

        function _runnerBox() {

            /*Run First Element Viewer*/
            _firstBox();

            /*Run Slider*/
            ctrlSlider = setInterval(function() {
                _slideBoxNext();
            }, timeout);
        }

        function _firstBox() {
            /*Apply Effect To First Box*/
            _effectBox(box_list[n].outerHTML);
        }

        function _slideBoxPrevious() {
            _setBox('prev');
            _effectBox(box_list[n].outerHTML);
        }

        function _slideBoxNext() {
            _setBox('next');
            _effectBox(box_list[n].outerHTML);
        }

        function _effectBox(html) {

            /*Slider Image View*/
            jH('.jh-slider-box').html(html);

            /*For Fade Effect*/
            if (mode === "fade") {
                jH('#jh-slider-box-'+n).height(height+measure_height);
                jH('#jh-slider-box-'+n).fadeIn({timer_fade: timer_fade});
            }

            /*For Slide Effect*/
            if (mode === "slide") {
                try {
                    _slideInBox('#jh-slider-box-'+n);
                } catch (er) {
                    clearInterval(slideInBoxCtrl);
                    clearInterval(ctrlSlider);
                    $$.log("sliderBox() error => " + er).except();
                }
            }

            /*For Mixed Effect*/ /*TODO*/
            /*if(mode === "mixed") {
                _slideMixIn('#jh-slider-image-'+n);
            }*/

            /*For Diagonal Effect*/ /*TODO*/
            /*if(mode === "diagonal") {
                _slideDiagonal('#jh-slider-image-'+n);
            }*/
        }

        function _slideInBox(element) {

            let _width = 0;
            let _opacity = 0;
            let _element = jH(element).select();

            _element.style.width = _width+measure_width;
            _element.style.height = height+measure_height;
            _element.style.display = "block";

            slideInBoxCtrl = setInterval(function() {

                if(_width >= width) {
                    clearInterval(slideInBoxCtrl);
                } else {
                    _width += 10;
                    _opacity += ((_opacity + 10) / 100);

                    _element.style.width = _width + measure_width;
                    _element.style.opacity = _opacity;
                    _element.style.transition = "all 1ms ease-in";
                }

            }, 60);
        }

        function _setBox(op) {
            if (op === 'next') {
                n += 1;
            } else if(op === 'prev') {
                n -= 1;
            }
            /*Image List Reset*/
            if (n > box_list_len) n = 0;
            if (n < 0) n = box_list_len;
        }

        /*Player Controls*/
        function _prev() {
            clearInterval(ctrlSlider);
            _slideBoxPrevious();
        }

        function _play() {
            slide_play = true;
            slide_stop = false;
            _runnerBox();
        }

        function _stop() {
            clearInterval(ctrlSlider);
            slide_play = false;
            slide_stop = true;
        }

        function _next() {
            clearInterval(ctrlSlider);
            _slideBoxNext();
        }

        try {
            _createBox();
        } catch (e) {
            $$.log("sliderBox() error => " + e).except();
        }

        return null;
    }

    /**[THEME]
     * @description Gallery, create a simple and elegant media gallery
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.gallery = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let use_thumbs = ($$.has('use_thumbs').in(params)) ? params.use_thumbs : false;
        let filepath = ($$.has('filepath').in(params)) ? params.filepath : "";
        let thumbs_hover = ($$.has('thumbs_hover').in(params)) ? params.thumbs_hover : false;
        /*slow: 8000, moderate|default: 4000, fast: 1000*/
        let speed_frames = ($$.has('speed_frames').in(params)) ? params.speed_frames : "default";
        let auto_play = ($$.has('auto_play').in(params)) ? params.auto_play : false;
        let active_thumbs = ($$.has('active_thumbs').in(params)) ? params.active_thumbs : false;
        let auto_close_thumbs = ($$.has('auto_close_thumbs').in(params)) ? params.auto_close_thumbs : false;
        let active_player = ($$.has('active_player').in(params)) ? params.active_player : false;
        let auto_close_player = ($$.has('auto_close_player').in(params)) ? params.auto_close_player : false;
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';

        /**
         * General Settings
         */
        let first_time = false;
        let no_play = false;

        /**
         * Time Controls
         */
        let setIntervalThumbsMenu = null;
        let setIntervalThumbsAnime = null;
        let setTimeoutPrev = null;
        let setTimeoutNext = null;
        let setTimeoutWidth = null;

        /**
         * Player Controls
         */
        let ctrlThumbnailPlay = true;
        let ctrlThumbnailPause = false;
        let ctrlThumbnailStop = false;
        let ctrlThumbnailPrev = false;
        let ctrlThumbnailNext = false;

        /**
         * Data Handler Items
         */
        let initial_items = null;
        let created_items = null;
        let array_images = [];
        let total_images = 0;
        let n = 0; /*items|iterator|counter*/

        /**
         * Structure
         */

        /*Container*/
        let gallery_container = "jh-gallery-container";

        /*Viewer*/
        let viewer_container = "jh-gallery-images-viewer";
        let viewer_image = "jh-gallery-image-view";

        /*Thumbnails*/
        let thumbs_container = "jh-gallery-thumbs-container";
        let thumbs_container_menu = "jh-gallery-menu-container";
        let thumbs_menu = "jh-gallery-thumbs-menu";
        let thumbs_base_left = "jh-gallery-player-base-left";
        let thumbs_image = "jh-gallery-thumbs-images";
        let thumbs_base_right = "jh-gallery-player-base-right";

        /*Player*/
        let container_controls_gallery = "container-controls-gallery";
        let prev_gallery = "prev-gallery";
        let a_prev_gallery = "a-prev-gallery";
        let play_gallery = "play-gallery";
        let a_play_gallery = "a-play-gallery";
        let pause_gallery = "pause-gallery";
        let a_pause_gallery = "a-pause-gallery";
        let stop_gallery = "stop-gallery";
        let a_stop_gallery = "a-stop-gallery";
        let next_gallery = "next-gallery";
        let a_next_gallery = "a-next-gallery";
        let view_gallery = "view-gallery";
        let a_view_gallery = "a-view-gallery";
        let info_gallery = "info-gallery";
        let steps_gallery = "steps-gallery";
        let gallery_info = "jh-gallery-info";
        let gallery_step = "jh-gallery-step";

        /**
         * Checkin and Definitions
         */
        if (use_thumbs !== false && use_thumbs !== true) {
            use_thumbs = false;
        }
        if (auto_play !== false && auto_play !== true) {
            auto_play = false;
        }
        if (active_thumbs !== false && active_thumbs !== true) {
            active_thumbs = false;
        }
        if (auto_close_thumbs !== false && auto_close_thumbs !== true) {
            auto_close_thumbs = false;
        }
        if (active_player !== false && active_player !== true) {
            active_player = false;
        }
        if (auto_close_player !== false && auto_close_player !== true) {
            auto_close_player = false;
        }
        if (thumbs_hover !== false && thumbs_hover !== true) {
            thumbs_hover = false;
        }

        if (speed_frames === 'slow') {
            speed_frames = 8000;
        } else if(speed_frames === 'moderate' || speed_frames === 'default') {
            speed_frames = 4000;
        } else if(speed_frames === 'fast') {
            speed_frames = 1000;
        } else {
            speed_frames = 4000; /*moderate|default*/
        }

        theme = _getTheme(theme);

        /*Generic and Helper Functions*/
        function _clearContainer() {
            jH('#'+gallery_container).html("");
            jH('#'+gallery_container).addClass("jh-gallery-container"+theme);
        }

        function _updateViewer(data) {
            let img_source = data.getAttribute('src');
            if (use_thumbs) {
                img_source = filepath
                    .replace(/\/$/, '') +"/"+ img_source
                    .split("/")
                    .pop();
            }
            $$.set({
                src: img_source,
                alt: data.getAttribute('alt'),
                title: data.getAttribute('title')
            }).in('#'+viewer_image);
            jH("#"+viewer_image).fadeIn();
            jH("#"+gallery_info).html(data.getAttribute('alt')||data.getAttribute('title'));
            jH("#"+gallery_step).html(n+1);
        }

        function _setItemsCreated() {
            created_items = $$.toArray(jH('#'+thumbs_menu+' li').select());
        }

        function _galleryCharger() {
            initial_items = $$.toArray(jH('#' + gallery_container + ' img').select());
            if (!use_thumbs) {
                for (let t = 0; t < initial_items.length; t++) {
                    array_images.push(initial_items[t].getAttribute('src'));
                }
            } else {
                let tmp_file = null;
                for (let t = 0; t < initial_items.length; t++) {
                    array_images.push(filepath.replace(/\/$/, '') +"/"+ (initial_items[t]
                        .getAttribute('src'))
                        .split("/")
                        .pop());
                }
            }
            total_images = array_images.length;
        }

        /*Gallery Specific Functions*/
        function _createViewer() {
            _clearContainer();

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: viewer_container,
                append: "#"+gallery_container
            });

            let img_source = initial_items[0].getAttribute("src");

            if (use_thumbs) {
                img_source = filepath
                    .replace(/\/$/, '') +"/"+ (initial_items[0]
                    .getAttribute('src'))
                    .split("/")
                    .pop();
            }

            $$.create({
                element:  "img",
                attr_type: ["id", "class", "src", "alt", "title"],
                attr_name: [
                    viewer_image,
                    viewer_container,
                    img_source,
                    initial_items[0].getAttribute("alt"),
                    initial_items[0].getAttribute("title")
                ],
                append: "#"+viewer_container
            });
        }

        function _createThumbsContainer() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: thumbs_container,
                append: "#"+gallery_container
            });
        }

        function _createLeftCurtain() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: thumbs_base_left,
                append: "#"+thumbs_container
            });
        }

        function _createRightCurtain() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: thumbs_base_right,
                append: "#"+thumbs_container
            });
        }

        function _createThumbsMenuContainer() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: thumbs_container_menu,
                append: "#"+thumbs_container
            });
        }

        function _createThumbsMenu() {
            $$.create({
                element:  "ul",
                attr_type: "id",
                attr_name: thumbs_menu,
                append: "#"+thumbs_container_menu
            });
        }

        function _createThumbsItems() {
            for (let t = 0; t < initial_items.length; t++) {
                _createThumbsItem({
                    source: initial_items[t].getAttribute('src'),
                    alt: initial_items[t].getAttribute('alt') || "",
                    title: initial_items[t].getAttribute('title') || ""
                }, t, true, false);
            }
        }

        function _createThumbsItem(data, index, anime_width = false, back = false) {

            if (!back) {
                $$.create({
                    element: "li",
                    attr_type: "id",
                    attr_name: "jh-galley-li-" + index,
                    append: "#" + thumbs_menu
                });
            } else {
                let _el_ = $$.create({
                    element: "li",
                    attr_type: "id",
                    attr_name: "jh-galley-li-" + index
                });
                $$.insert(_el_).first('#'+thumbs_menu);
            }

            $$.create({
                element:  "a",
                attr_type: "id",
                attr_name: "jh-galley-a-"+index,
                append: "#jh-galley-li-"+index,
            });

            $$.create({
                element:  "img",
                attr_type: ["id", "class", "src", "alt", "title"],
                attr_name: ["jh-galley-img-"+index, thumbs_image, data.source, data.alt, data.title],
                append: "#jh-galley-a-"+index
            });

            jH("#jh-galley-li-"+index).anime('width 300ms ease-in-out');

            if (anime_width) {
                jH("#jh-galley-li-"+index).width('0px');
                setTimeout(function() {
                    jH("#jh-galley-li-"+index).width('150px');
                }, 200);
            }

            if (thumbs_hover) {
                jH("#jh-galley-img-" + index).on('mouseenter', function () {
                    _updateViewer($$this);
                });
            } else {
                jH("#jh-galley-img-" + index).on('click', function () {
                    _updateViewer($$this);
                });
            }
        }

        function _createGalleryPlayer() {

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: container_controls_gallery,
                append: "#"+gallery_container
            });

            /*Previous*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: prev_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_prev_gallery, "Previous", "Previous"],
                append: "#"+prev_gallery
            });

            /*Play*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: play_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_play_gallery, "Play", "Play"],
                append: "#"+play_gallery
            });

            /*Pause*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: pause_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_pause_gallery, "Pause", "Pause"],
                append: "#"+pause_gallery
            });

            /*Stop*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: stop_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_stop_gallery, "Stop", "Stop"],
                append: "#"+stop_gallery
            });

            /*Next*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: next_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_next_gallery, "Next", "Next"],
                append: "#"+next_gallery
            });

            /*View*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: view_gallery,
                append: "#"+container_controls_gallery
            });

            $$.create({
                element:  "a",
                attr_type: ["id", "title", "alt"],
                attr_name: [a_view_gallery, "View Image in Fullscreen", "View Image in Fullscreen"],
                append: "#"+view_gallery
            });

            /*Info*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: info_gallery,
                append: "#"+container_controls_gallery
            });

            /*Steps*/
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: steps_gallery,
                append: "#"+container_controls_gallery
            });

            jH("#"+a_prev_gallery).html("&laquo;"); /*&#9665;*/
            jH("#"+a_play_gallery).html("&#9654;");
            jH("#"+a_pause_gallery).html("||");
            jH("#"+a_stop_gallery).html("&#9632;");
            jH("#"+a_next_gallery).html("&raquo;"); /*&#9655;*/
            jH("#"+a_view_gallery).html("&#9705;");

            let name = initial_items[0].getAttribute("alt") || initial_items[0].getAttribute("title");
            jH("#"+info_gallery).html("<span id='jh-gallery-info'>"+name+"</span>");
            if (total_images > 0) {
                jH("#" + steps_gallery).html("<span id='jh-gallery-step'>"+(n+1)+"</span>/" + total_images);
            }
        }

        function _toggleThumbsPlayer(option) {
            clearInterval(setIntervalThumbsMenu);

            if (no_play) {
                return false;
            }

            jH("#"+thumbs_container).anime("all 0.4s ease-in-out");
            jH("#"+container_controls_gallery).anime("all 0.4s ease-in-out");

            function _show() {
                if (active_thumbs === false) {
                    jH("#" + thumbs_container).display("none");
                } else {
                    if (active_player === true) {
                        jH("#" + thumbs_container).height("120px");
                    } else {
                        jH("#" + thumbs_container).height("80px");
                    }
                }
                if (active_player === false) {
                    jH("#"+container_controls_gallery).display("none");
                } else {
                    jH("#"+container_controls_gallery).height("auto");
                }
            }

            function _close() {
                if (active_thumbs && active_player && auto_close_thumbs && auto_close_player) {
                    setIntervalThumbsMenu = setTimeout(function() {
                        jH("#"+thumbs_container).height("0px");
                        jH("#"+container_controls_gallery).height("0px");
                    }, 1500);
                } else if (active_thumbs && active_player && !auto_close_player && auto_close_thumbs) {
                    setIntervalThumbsMenu = setTimeout(function() {
                        jH("#"+thumbs_container).height("0px");
                        jH("#"+container_controls_gallery).height("auto");
                    }, 1500);
                } else if (active_thumbs && active_player && auto_close_player && !auto_close_thumbs) {
                    setIntervalThumbsMenu = setTimeout(function() {
                        jH("#"+thumbs_container).height("80px");
                        jH("#"+container_controls_gallery).height("0px");
                    }, 1500);
                } else if (active_thumbs && !active_player && auto_close_thumbs) {
                    setIntervalThumbsMenu = setTimeout(function() {
                        jH("#"+thumbs_container).height("0px");
                    }, 1500);
                } else if (!active_thumbs && active_player && auto_close_player) {
                    setIntervalThumbsMenu = setTimeout(function() {
                        jH("#"+container_controls_gallery).height("0px");
                    }, 1500);
                }
            }

            if (option === 'show') {
                _show();
            } else if (option === 'hide') {
                _close();
            }
            if ((auto_close_thumbs || auto_close_player) && first_time === false) {
                _close();
                first_time = true;
            }
        }

        function _slideRun() {
            if (ctrlThumbnailPlay) {
                clearInterval(setIntervalThumbsAnime);
                setIntervalThumbsAnime = setInterval(function () {
                    _nextThumb();
                }, speed_frames);
            }
        }

        function _slideThumbs() {
            _setItemsCreated();
            clearInterval(setIntervalThumbsAnime);

            if (created_items.length > 8 && auto_play === true) {
                _slideRun();
            }
        }

        function _prevThumb() {

            n-=1;

            if (n < 0) {
                n = (initial_items.length-1);
                _setItemsCreated();
            }
            created_items[n].style.width = "0px";

            setTimeoutPrev = setTimeout(function () {

                _updateViewer(initial_items[n]);
                $$.remove('#' + thumbs_menu, '#' + created_items[n].id);

                _createThumbsItem({
                    source: initial_items[n].getAttribute('src'),
                    alt: initial_items[n].getAttribute('alt') || "",
                    title: initial_items[n].getAttribute('title') || ""
                }, n, true, true);

                ctrlThumbnailPrev = false;
                ctrlThumbnailNext = false;

                if (ctrlThumbnailStop || ctrlThumbnailPause) {
                    clearInterval(setIntervalThumbsAnime);
                }

            }, 500);
        }

        function _nextThumb() {

            /*<HTMLElement:li>*/
            setTimeoutWidth = setTimeout(function() {
                created_items[n].style.width = "0px";

                /*<HTMLElement:li(id)>*/
                setTimeoutNext = setTimeout(function () {

                    $$.remove('#' + thumbs_menu, '#' + created_items[n].id);

                    /*Push <HTMLElement:li>*/
                    _createThumbsItem({
                        source: initial_items[n].getAttribute('src'),
                        alt: initial_items[n].getAttribute('alt') || "",
                        title: initial_items[n].getAttribute('title') || ""
                    }, n, true, false);

                    n += 1;

                    if (n >= total_images) {
                        n = 0;
                        _setItemsCreated();
                    }

                    _updateViewer(initial_items[n]);

                    ctrlThumbnailPrev = false;
                    ctrlThumbnailNext = false;

                    if (ctrlThumbnailStop || ctrlThumbnailPause) {
                        clearInterval(setIntervalThumbsAnime);
                    }

                }, 500);

            }, 150);
        }

        function _playThumbs(_play) {
            if (no_play && _play) {
                no_play = false;
            }
            if (no_play) {
                return false;
            } else {
                if (_play) {
                    ctrlThumbnailStop = false;
                    ctrlThumbnailPause = false;
                    ctrlThumbnailPlay = true;
                    _slideRun();
                }
            }
        }

        function _pauseThumbs(_no_play = false) {
            no_play = _no_play;
            ctrlThumbnailPlay = false;
            ctrlThumbnailStop = false;
            ctrlThumbnailPause = true;
            _clearTimes();
        }

        function _stopThumbs() {
            /*This function reset all settings from player gallery*/
            n = 0;
            no_play = true;
            ctrlThumbnailPlay = false;
            ctrlThumbnailStop = true;
            $$.remove("#"+thumbs_container_menu, "#"+thumbs_menu);
            _clearTimes();
            _createThumbsMenu();
            _createThumbsItems();
            _updateViewer(initial_items[n]);
        }

        function _clearTimes() {
            clearInterval(setIntervalThumbsAnime);
            clearTimeout(setTimeoutPrev);
            clearTimeout(setTimeoutNext);
            clearTimeout(setTimeoutWidth);
        }

        function _activeButton(el) {
            jH("#" + stop_gallery).removeClass('player-active-button');
            jH("#" + play_gallery).removeClass('player-active-button');
            jH("#" + pause_gallery).removeClass('player-active-button');
            jH(el).addClass('player-active-button');
        }

        function _activeEvents() {

            jH("#"+play_gallery).addClass('player-active-button');

            /*Show Thumbs Container, Thumbs Carrossel Stop*/
            jH("#"+gallery_container).on('mouseenter', function() {
                _toggleThumbsPlayer('show');
                _clearTimes();
                ctrlThumbnailPlay = false;

                if (!no_play) {
                    _activeButton("#" + pause_gallery);
                }
            });

            /*Hide Thumbs Container, Thumbs Carrossel Play*/
            jH("#"+gallery_container).on('mouseleave', function() {
                if (ctrlThumbnailPlay || ctrlThumbnailPause || ctrlThumbnailStop) {
                    return false;
                }
                _toggleThumbsPlayer('hide');
                if (!no_play) {
                    _playThumbs(true);
                    _activeButton("#" + play_gallery);
                }
            });

            /*Previous Button*/
            jH('#'+prev_gallery).on('click', function() {
                if (ctrlThumbnailPrev || ctrlThumbnailNext) {
                    return false;
                }
                ctrlThumbnailPrev = true;
                _prevThumb();
            });

            /*Next Button*/
            jH('#'+next_gallery).on('click', function() {
                if (ctrlThumbnailPrev || ctrlThumbnailNext) {
                    return false;
                }
                ctrlThumbnailNext = true;
                _nextThumb();
            });

            /*Play Button*/
            jH("#"+a_play_gallery).on('click', function() {
                if (ctrlThumbnailPlay === true) {
                    return false;
                }

                if (no_play) no_play = false;
                _playThumbs(true);
                _activeButton("#" + play_gallery);
            });

            /*Pause Button*/
            jH("#"+a_pause_gallery).on('click', function() {
                _pauseThumbs(true);
                _activeButton("#" + pause_gallery);
            });

            /*Stop Button*/
            jH("#"+a_stop_gallery).on('click', function() {
                _stopThumbs();
                _activeButton("#" + stop_gallery);
            });

            /*Button Player Image Fullscreen Click*/
            jH("#"+view_gallery).on('click', function() {
                if (!$$.fullscreen().run()) {
                    $$.fullscreen().force();
                }
                _pauseThumbs(true);
                let img = jH("#"+viewer_image).select();
                $$.viewer({
                    type: "img",
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    title: img.getAttribute('title'),
                }).callback(function() {
                    no_play = false;
                    _playThumbs(false);
                    if (!$$.fullscreen().run()) {
                        $$.fullscreen().force();
                    }
                });
            });

            /*Image on Viewer Click*/
            jH("#"+viewer_image).on('click', function() {
                _pauseThumbs(true);
                $$.viewer({
                    type: "img",
                    src: $$this.getAttribute('src'),
                    alt: $$this.getAttribute('alt'),
                    title: $$this.getAttribute('title'),
                }).callback(function() {
                    no_play = false;
                    _playThumbs(false);
                });
            });
        }

        function _create() {
            _galleryCharger();
            _createViewer();
            _createThumbsContainer();
            _createLeftCurtain();
            _createThumbsMenuContainer();
            _createThumbsMenu();
            _createThumbsItems();
            _createRightCurtain();
            _createGalleryPlayer();
            _toggleThumbsPlayer('show');
            _slideThumbs();
            _activeEvents();
        }

        try {
            if ($$.findId(gallery_container)) {
                _create();
            } else {
                $$.log("gallery() error => Missing " + gallery_container).error();
            }
        } catch (e) {
            $$.log("gallery() error => " + e).except();
        }

        return null;
    }

    /**[NO-THEME]
     * @description Viewer, visualize various medias types in a uniq component
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.viewer = function(params = {}) {

        function _create() {

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-viewer-lock-screen",
                append: "body"
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-viewer-container",
                append: "#jh-viewer-lock-screen"
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-viewer-close",
                append: "#jh-viewer-container"
            });

            jH("#jh-viewer-close").html('X');

            if (params.type === 'img') {
                $$.create({
                    element:  "img",
                    attr_type: ["id", "src", "alt", "title"],
                    attr_name: ["jh-viewer-img", params.src, params.alt, params.title],
                    append: "#jh-viewer-container"
                });
            }

            if (params.type === 'pdf') {
                $$.create({
                    element:  "object",
                    attr_type: ["id", "data", "type"],
                    attr_name: ["jh-viewer-pdf", params.file, "application/pdf"],
                    append: "#jh-viewer-container"
                });

                $$.create({
                    element:  "p",
                    attr_type: "id",
                    attr_name: "jh-viewer-pdf-p",
                    append: "#jh-viewer-pdf"
                });
                jH("#jh-viewer-pdf-p").html('Seu navegador não tem um plugin pra PDF');
            }

            if (params.type === 'html') {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-viewer-html",
                    append: "#jh-viewer-container"
                });
                jH("#jh-viewer-html").html(params.html);
            }

            jH("#jh-viewer-lock-screen").fadeIn();
            jH("#jh-viewer-close").on('click', function() {
                jH("#jh-viewer-lock-screen").fadeOut({
                    remove: true,
                    parent: "body",
                    children: "#jh-viewer-lock-screen"
                });
            });
        }

        function _callback(fn, args) {
            jH("#jh-viewer-close").on('click', function() {
                jH("#jh-viewer-lock-screen").fadeOut({
                    remove: true,
                    parent: "body",
                    children: "#jh-viewer-lock-screen"
                });
                if (typeof fn === "function") {
                    fn(args);
                }
            });
        }

        try {
            _create();
        } catch (er) {
            $$.log("viwer() error => " + er).except();
        }
        return {"callback": _callback};
    }

    /**[THEME]
     * @description Editor, data edit from any <HTMLElement>
     * @param {object} params (object: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.editor = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let type = ($$.has('type').in(params)) ? params.type : "table";
        let fields = ($$.has('fields').in(params)) ? params.fields : "";
        let values = ($$.has('values').in(params)) ? params.values : "";
        let target = ($$.has('target').in(params)) ? params.target : "";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let callback = ($$.has('callback').in(params)) ? params.callback : "";

        /**
         * Get Global Settings
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * General Adjust
         */
        if (!fields || !values || !target) {
            $$.exception("editor() error => Check the Parameters !");
        }

        /**
         * General Functions
         */
        function _editorValues() {
            let _v_ = [];
            fields.forEach(function(item, index, array) {
                _v_[index] = {
                    field_name: item,
                    field_value: jH("#jh-editor-table-td-input-"+index).val()
                };
            });
            return _v_;
        }

        function _editorReset() {
            fields.forEach(function(item, index, array) {
                jH("#jh-editor-table-td-input-"+index).val(values[index]);
            });
        }

        function _editorClose() {
            jH("#jh-editor-lock-screen").fadeOut({
                remove: true,
                parent: target,
                children: "#jh-editor-lock-screen"
            });
        }

        function _editorTable() {

            $$.create({
                element:  "table",
                attr_type: ["id", "class"],
                attr_name: ["jh-editor-table", "jh-editor-table"],
                append: "#jh-editor-container-content"
            });

            fields.forEach(function(item, index, array) {

                $$.create({
                    element:  "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-editor-table-tr-"+index, "jh-editor-tr"],
                    append: "#jh-editor-table"
                });

                $$.create({
                    element:  "th",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-editor-table-th-"+index, "jh-editor-th"],
                    append: "#jh-editor-table-tr-"+index
                }, item);

                $$.create({
                    element:  "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-editor-table-td-"+index, "jh-editor-td"],
                    append: "#jh-editor-table-tr-"+index
                });

                $$.create({
                    element:  "input",
                    attr_type: ["type", "id", "class", "value", "placeholder"],
                    attr_name: ["text", "jh-editor-table-td-input-"+index, "jh-editor-input", values[index]||"", values[index]||undefined],
                    append: "#jh-editor-table-td-"+index
                });

                $$.create({
                    element:  "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-editor-table-td-lb-"+index, "jh-editor-td-lb"],
                    append: "#jh-editor-table-tr-"+index
                });

                $$.create({
                    element:  "label",
                    attr_type: ["id", "for"],
                    attr_name: ["jh-editor-table-td-lb-"+index, "jh-editor-table-td-input-"+index],
                    append: "#jh-editor-table-td-lb-"+index
                }, "&#9998;");

            });
        }

        function _container() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-lock-screen",
                append: target
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-container"+theme,
                append: "#jh-editor-lock-screen"
            });

            $$.create({
                element:  "h3",
                attr_type: ["id", "class"],
                attr_name: ["jh-editor-h3", "jh-editor-title"],
                append: "#jh-editor-container"+theme
            }, "Editor");

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-close",
                append: "#jh-editor-container"+theme
            }, 'X');
        }

        function _controls() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-container-controls",
                append: "#jh-editor-container"+theme
            });

            $$.create({
                element:  "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-editor-controls-save", "jh-editor-controls-save-cancel"],
                append: "#jh-editor-container-controls"
            });

            $$.create({
                element:  "button",
                attr_type: ["type", "id", "class", "title"],
                attr_name: ["button", "jh-editor-bt-save", "jh-editor-bts", "Save"],
                append: "#jh-editor-controls-save"
            }, "&#10004;");

            $$.create({
                element:  "button",
                attr_type: ["type", "id", "class", "title"],
                attr_name: ["reset", "jh-editor-bt-cancel", "jh-editor-bts", "Undo"],
                append: "#jh-editor-controls-save"
            }, "&#8630;");
        }

        function _content() {
            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-container-content",
                append: "#jh-editor-container"+theme
            });

            $$.create({
                element:  "div",
                attr_type: "id",
                attr_name: "jh-editor-content",
                append: "#jh-editor-container-content"
            });

            if (type === 'table') {
                _editorTable();
            } else if(type === 'editor') {
                //TODO: Create a text editor
                //_editorText();
            }
        }

        function _activate() {
            jH("#jh-editor-lock-screen").fadeIn();

            /*Editor Close*/
            jH("#jh-editor-close").on('click', function() {
                _editorClose();
            });

            /*Reset State*/
            jH("#jh-editor-bt-cancel").on('click', function() {
                _editorReset();
            });

            /*Data Save*/
            jH("#jh-editor-bt-save").on('click', function() {
                $$.confirm({
                    title: "Warning",
                    question: "Are you sure that you want save the data ?",
                    theme: "default", /*default,dark,light*/
                    buttons: ["Yes", "No"]
                }, function(){
                    _editorClose();
                    _callback();
                });
            });
        }

        function _create() {
            _container();
            _controls();
            _content();
            _activate();
        }

        function _callback() {
            if (typeof callback === "function") {
                callback(_editorValues());
            }
        }

        try {
            _create();
        } catch (er) {
            $$.log("editor() error => " + er).except();
        }
        return this;
    }

    /**[THEME]
     * @description Jumper, create a simple jumper to choose views from result in array structure
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.jumper = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let jumper_target = ($$.has('jumper_target').in(params)) ? params.jumper_target : "";
        let jumper_range = ($$.has('jumper_range').in(params)) ? params.jumper_range : [];
        let bottom = ($$.has('bottom').in(params)) ? params.bottom : "0px";
        let theme = ($$.has('theme').in(params)) ? params.theme : "";
        let lang = ($$.has('lang').in(params)) ? params.lang : "";

        /**
         * Global Settings
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * Component Settings
         */
        let jumper_title = "<h3>Jumper <span>X</span></h3>";
        let jh_jumper_container = "jh-jumper-container";
        let jh_jumper_title_h3 = "jh-jumper-container h3";
        let jh_jumper_body = "jh-jumper-body";
        let jh_jumper_menu_ul = "jh-jumper-menu-ul";
        let jh_jumper_action = "jh-jumper-body ul li a";

        /**
         * Jumper Functions
         */
        function _jumperAppend(ri, _r_) {
            let _li_ = "<li><a data-content='"+ri+"' data-jumper-a>"+_r_+"</a></li>";
            jH('#'+jh_jumper_menu_ul).append(_li_);
        }

        function _jumperTo(index, ri, rf) {
            let _r_ = "";
            _r_ += "<span class='jh-jumper-span-index'>"+index+"</span>";
            _r_ += "<span class='jh-jumper-span-initial'>"+ri+"</span>";
            _r_ += "<span class='jh-jumper-span-dashed'>- - -</span>";
            _r_ += "<span class='jh-jumper-span-final'>"+rf+"</span>";
            _jumperAppend(ri, _r_);
        }

        /**
         * General Functions
         */
        function _jumperBody(fn, args) {
            let ri = 0;
            let rf = 0;

            $$.loading({
                text: "Jumper is loading...",
                target: jumper_target,
                theme: theme,
                lang: lang,
                // size: "contain"
                size: {/*contain, full, specific{}*/
                    specific: "80px"
                }
            }).start();

            setTimeout(function() {

                Object.keys(jumper_range).forEach(function(item, index, array) {
                    if (jumper_range[item]) {/*Bug Prevent*/
                        ri = jumper_range[item][0]; /*initial range*/
                        rf = jumper_range[item][1]; /*final range*/
                        _jumperTo(item, ri, rf);
                    }
                });

                _jumperActive(fn, args);

                setTimeout(function () {
                    $$.move('#' + jh_jumper_container).to('bottom', bottom);

                    $$.loading({
                        target: jumper_target
                    }).finish();

                }, 40);

            }, 2000);
        }

        function _jumperActive(fn, args) {
            jH('#'+jh_jumper_action, {rsp: 'data'}).on('click', function(pag) {
                if (typeof fn ==='function') {
                    if (args) {
                        fn(args, $$.intNumber(pag));
                    } else {
                        fn($$.intNumber(pag));
                    }
                }
            });
        }

        function _create() {

            /*Jumper Container*/
            $$.create({
                element: "div",
                attr_type: ["id", "class"],
                attr_name: [jh_jumper_container, jh_jumper_container + theme],
                append: jumper_target
            }, jumper_title);

            /*Jumper Close*/
            jH("#" + jh_jumper_title_h3).on('click', function (pag) {
                $$.move('#' + jh_jumper_container).to('bottom', '-1000px');
                /*setTimeout(function () {
                    $$.remove(jumper_target, '#' + jh_jumper_container);
                }, 800);*/
            });

            /*Jumper Body Content (Range's)*/
            $$.create({
                element: "div",
                attr_type: "id",
                attr_name: jh_jumper_body,
                append: "#" + jh_jumper_container
            });

            /*Jumper Menu*/
            $$.create({
                element: "ul",
                attr_type: "id",
                attr_name: jh_jumper_menu_ul,
                append: "#" + jh_jumper_body
            });
        }

        /**
         * Runner
         */
        function _run(fn, args) {
            try {
                if (!$$.findId(jh_jumper_container)) {
                    _create();
                    _jumperBody(fn, args);
                } else {
                    $$.move('#'+jh_jumper_container).to('bottom', bottom);
                    /*$$.move('#'+jh_jumper_container).to('bottom', '-500px');
                    setTimeout(function () {
                        $$.remove(jumper_target, '#'+jh_jumper_container);
                    }, 800);*/
                }
            } catch (er) {
                $$.log("jumper:run() error => " + er).except();
            }
        }

        return {"run": _run};
    }

    /**[THEME]
     * @description Loading, inform on screen any current process
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.loading = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let text = ($$.has('text').in(params)) ? params.text : "Loading... Please Wait...";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let size = ($$.has('size').in(params)) ? params.size : "full";

        /**
         * Get Global Settings
         */
        theme = _getTheme(theme);

        /**
         * General Functions
         */
        function _create() {
            if (!$$.findId("jh-loading-widget")) {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-loading-widget", "jh-loading-widget" + theme],
                    append: target
                }, "<span>"+text+"</span>");
            }
            if (!$$.findId("jh-loading-widget")) {
                $$.log("loading() error => Is not possible create #jh-loading-widget !").except();
            }
        }

        function _start() {
            if (size === 'contain') {
                let _h_ = jH(target).height();
                jH("#jh-loading-widget").addClass('jh-loading-widget-contain');
                jH("#jh-loading-widget").height(_h_);
            } else if (size === 'full') {
                jH("#jh-loading-widget").addClass('jh-loading-widget-full');
            } else if ($$.has('specific').in(size)) {
                jH("#jh-loading-widget").addClass('jh-loading-widget-specific');
                jH("#jh-loading-widget").height(size.specific);
            }
        }

        function _finish() {
            $$.remove(target, "#jh-loading-widget");
        }

        try {
            _create();
        } catch (er) {
            $$.log("loading() error => " + er).except();
        }

        return {"start": _start, "finish": _finish};
    }

    /**[NO_THEME]
     * @description Progress, show a progress bar and percent + item/total on current progress
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.progress = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let target = ($$.has('target').in(params)) ? params.target : "body";
        let draggable = ($$.has('draggable').in(params)) ? params.draggable : false;
        let text = ($$.has('text').in(params)) ? params.text : "";
        let steps = ($$.has('steps').in(params)) ? params.steps : 0;
        let abort = ($$.has('abort').in(params)) ? params.abort : {active: false, action: null};

        /**
         * Global Settings
         */
        let step = 0;
        let pg_step = 0;
        let pg_append = 100 / steps;

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(lang);

        /**
         * Generic Functions
         */
        function _checkin() {
            if (target !== "body" && !$$.findTarget(target)) {
                $$.log("progress() error => Missing target: " + target)
                    .print("red");
                return false;
            }

            if (!steps || steps <= 0) {
                $$.log("progress() error => Missing steps to progress calculate!")
                    .print("red");
                return false;
            }
            return true;
        }

        /**
         * Main Functions
         */
        function _create() {

            (function removeProgressIfExists() {
                if ($$.findId("jh-progress-container")) {
                    $$.remove(target, "#jh-progress-container");
                }
            })();

            (function createContainer() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-container", "jh-progress-container" + theme],
                    append: target
                });
            })();

            (function createText() {
                if (text !== "") {
                    (function createText() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-progress-text", "jh-progress-text"],
                            append: "#jh-progress-container"
                        }, "<p>"+text+"</p>");
                    })();
                }
            })();

            (function createSteps() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-container-steps", "jh-progress-container-steps"],
                    append: "#jh-progress-container"
                });

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-step-text", "jh-progress-step-text"],
                    append: "#jh-progress-container-steps"
                }, "<p>Step</p>");

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-step-current", "jh-progress-step-current"],
                    append: "#jh-progress-container-steps"
                }, step);

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-step-total", "jh-progress-step-total"],
                    append: "#jh-progress-container-steps"
                }, steps);
            })();

            (function createStepsProgress() {
                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-container-box", "jh-progress-container-box"],
                    append: "#jh-progress-container"
                });

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-content", "jh-progress-content"],
                    append: "#jh-progress-container-box"
                });

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-progress-content-percent", "jh-progress-content-percent"],
                    append: "#jh-progress-container-box"
                }, "0%");
            })();

            (function createAbortControls() {
                if (
                    $$.has("active").in(abort) &&
                    $$.has("action").in(abort) &&
                    $$.is(abort.action).function() &&
                    abort.active === true
                ) {
                    setTimeout(function() {
                        $$.create({
                            element: "div",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-progress-abort-controls", "jh-progress-abort-controls"],
                            append: "#jh-progress-container"
                        });

                        $$.create({
                            element: "button",
                            attr_type: ["id", "class"],
                            attr_name: ["jh-progress-abort-bt", "jh-progress-abort-bt"],
                            append: "#jh-progress-abort-controls"
                        }, "Abort");

                        if ($$.findId("jh-progress-abort-bt")) {
                            jH('#jh-progress-abort-bt').on('click', function () {
                                $$.confirm({
                                    title: "Warning",
                                    question: "Are you sure to cancel this operation ?",
                                    theme: theme,
                                    buttons: ["Yes", "No"]
                                }, function () {
                                    abort.action();
                                });
                            });
                        }
                    }, 5000); /*After 5 seconds is possible abort the operation*/
                }
            })();

            (function applyDraggable() {
                if (draggable === true) {
                    $$.draggable({
                        elements: ["#jh-progress-container"],
                        tab_bottom: true
                    }).drag();
                }
            })();
        }

        function _patch(txt) {
            jH("#jh-progress-text").html(txt);
        }

        function _update() {
            step++;
            pg_step += pg_append;
            /*Prevent Bug In Runtime Progress*/
            if (step === steps || pg_step > 100) pg_step = 100;
            jH("#jh-progress-step-current").html(step.toString());
            jH("#jh-progress-content").width(pg_step+"%");
            jH("#jh-progress-content-percent").html($$.floatNumber(pg_step, 2)+"%");

        }

        function _down() {
            step--;
            /*Prevent Bug In Runtime Progress*/
            if (step < 0) step = 0;
            pg_step -= pg_append;
            /*Prevent Bug In Runtime Progress*/
            if (pg_step < 0) pg_step = 0;
            jH("#jh-progress-step-current").html(step.toString());
            jH("#jh-progress-content").width(pg_step+"%");
            jH("#jh-progress-content-percent").html($$.floatNumber(pg_step, 2)+"%");
        }

        function _close() {
            setTimeout(function() {
                jH("#jh-progress-container").fadeOut({
                    remove: true,
                    parent: "body",
                    children: "#jh-progress-container"
                });
            }, 2000);
        }

        function _run(fn, args) {
            try {
                if (_checkin()) {
                    _create();
                    if ($$.is(fn).function()) {
                        fn(args || "");
                    }
                }
                return this;
            } catch (er) {
                $$.log("progress() error => " + er).except();
            }
        }

        return {
            "run": _run,
            "patch": _patch,
            "update": _update,
            "down": _down,
            "close": _close
        };
    }

    /**[THEME]
     * @description On Off, create a element checker on/off to forms
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.onOff = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let callback = ($$.has('callback').in(params)) ? params.callback : "";

        /**
         * Global Settings
         */

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(theme);

        /**
         * Generic Functions
         */
        function _checkin() {
            return true;
        }

        /**
         * Main Functions
         */
        function _create() {
            $$.create({
                element: "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-model-container", "jh-model-container" + theme],
                append: target
            });
        }

        function _run() {
            try {
                if (_checkin()) {
                    _create();
                }
            } catch (er) {
                $$.log("_METHOD_NAME_MODEL_() error => " + er).except();
            }
        }

        return {"run": _run}
    }

    /**
     * @description Media Player, crate a complete media player
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.mediaPlayer = function(params = {}) {
    }

    /*
     --------------------------------------------------------------------------------
     - DATA ELEMENTS
     --------------------------------------------------------------------------------
     */

    /**[THEME]
     * @description Textarea, create a generic element textarea to input data
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.textarea = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let size = ($$.has('size').in(params)) ? params.size : "full";
        let id = ($$.has('id').in(params)) ? params.id : "jh-textarea";
        let max_digits = ($$.has('max_digits').in(params)) ? params.max_digits : 100;
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";

        /**
         * Global Settings
         */
        let qty_digit = 0;
        let sizes = ["-small", "-medium", "-large", "-full"];

        /**
         * Adjusts
         */
        if (size !== "") size = "-" + size;
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * Generic Functions
         * */
        function _checkin() {
            if (!$$.inArray(sizes, size)) {
                $$.log("textarea() error => Wrong size to box: " + size).error();
                return false;
            }

            if (!$$.findId(target) && target !== "body") {
                $$.log("textarea() error => Wrong target to box: " + target).error();
                return false;
            }
            return true;
        }

        /**
         * Main Functions
         */
        function _create() {
            $$.create({
                element: "textarea",
                attr_type: ["id", "class", "name", "value"],
                attr_name: [id, "jh-textarea", "", ""],
                append: target
            });

            if (id !== "jh-textarea") {
                jH("#" + id).addClass("jh-textarea" + size);
            }

            $$.create({
                element: "span",
                attr_type: ["id", "class"],
                attr_name: ["jh-textarea-span", "jh-textarea-span", "", ""],
                append: target
            }, "0/"+max_digits);
        }

        function _event() {
            jH("#"+id).on('keyup', function(e) {
                qty_digit = jH("#"+id).val();
                if (qty_digit.length > max_digits) {
                    jH("#"+id).val(qty_digit.substring(0, max_digits));
                    jH("#jh-textarea-span").html(max_digits+"/"+max_digits);
                    return false;
                } else {
                    jH("#jh-textarea-span").html(qty_digit.length + "/" + max_digits);
                }
            });
        }

        try {
            if (_checkin()) {
                _create();
                _event();
            }
        } catch (er) {
            $$.log().except("textarea() error => " + er);
        }

        return null;
    }

    /**[THEME]
     * @description Paginate, create a simple paginate to handler result from on requests and queries
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.paginate = function (params) {

        /**
         * Settings/Configurations by args
         */
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let pager_target = ($$.has('target').in(params)) ? params.target : "";
        let pager_info = ($$.has('pager_info').in(params)) ? params.pager_info : false;
        let page = ($$.has('page').in(params)) ? params.page : 1;
        let total_items = ($$.has('total_items').in(params)) ? params.total_items : 1;
        let items_show = ($$.has('items_show').in(params)) ? params.items_show : "";
        let max_pager = ($$.has('max_pager').in(params)) ? params.max_pager : 1;
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let use_button = ($$.has('use_button').in(params)) ? params.use_button : true;

        /**
         * Global Settings to paginate
         */
        let range = [];
        let active = "";
        let from_item = 1;
        let current_page = 0;
        let to_item = items_show;
        let pagers = Math.ceil(total_items / items_show);

        /**
         * Button Settings
         */
        let lb_button_first = "&laquo;";
        let lb_button_prev = "&lsaquo;";
        let lb_button_next = "&rsaquo;";
        let lb_button_last = "&raquo;";

        /**
         * Get Global Settings
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * General Adjust
         */
        if (page <= 0) page = pagers;
        if (page > pagers) page = 1;
        if (theme === '-modern') {
            if (lang === 'en') {
                lb_button_first = "First";
                lb_button_prev = "Prev";
                lb_button_next = "Next";
                lb_button_last = "Last";
            } else if(lang === 'ptbr') {
                lb_button_first = "Primeiro";
                lb_button_prev = "Anterior";
                lb_button_next = "Proximo";
                lb_button_last = "Ultimo";
            } else if(lang === 'es') {
                lb_button_first = "Primeiro";
                lb_button_prev = "Anterior";
                lb_button_next = "Proximo";
                lb_button_last = "Ultimo";
            }
        }

        /**
         * General Functions
         */
        function _flushTarget() {
            if ($$.findId('jh-paginate-container')) {
                $$.remove(pager_target, "#jh-paginate-container");
            }
        }

        function _setFromTo() {
            from_item = (items_show * page) - items_show || 1;
            if (items_show === 1) {
                from_item = items_show * page;
            }
            to_item = items_show * page;
            if (to_item > total_items) {
                to_item = total_items;
            }
        }

        function _createItem(label, icon, prefix, value, active) {

            $$.create({
                element:  "li",
                attr_type: ["id", "class"],
                attr_name: ["li-page-item-"+prefix, "page-item "+active],
                append: "#jh-paginate-ul"
            });

            if (!use_button) {
                $$.create({
                    element: "a",
                    attr_type: ["id", "class", "title", "data-content", "data-paginate-result"],
                    attr_name: ["a-page-link-" + prefix, "page-link", label, value, "data-paginate-result"],
                    append: "#li-page-item-" + prefix
                }, icon);
            } else {
                $$.create({
                    element:  "button",
                    attr_type: ["id", "class", "title", "data-content", "data-paginate-result"],
                    attr_name: ["button-page-link-"+prefix, "page-link", label, value, "data-paginate-result"],
                    append: "#li-page-item-"+prefix
                }, icon);
            }
        }

        /**
         * Main Functions
         */
        function _create() {

            _flushTarget();

            $$.create({
                element:  "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-paginate-container", "jh-paginate-container"+theme],
                append: pager_target
            });

            $$.create({
                element:  "ul",
                attr_type: "id",
                attr_name: "jh-paginate-ul",
                append: "#jh-paginate-container"
            });

            if (pager_info) {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: "jh-pager-info",
                    append: "#jh-paginate-container"
                });
            }
        }

        function _createFirstControls() {
            let previous_page = (page-1 <= 0) ? pagers : (page-1);
            _createItem("First", lb_button_first, "first", (current_page+1), "");
            _createItem("Previous", lb_button_prev, "prev", previous_page, "");
        }

        function _createInitialPager() {
            let mxp = pagers;
            if (pagers > max_pager) {
                mxp = max_pager;
            }

            for(let k = 0; k <= mxp; k++) {

                if (k === page) {
                    active = "active";
                } else {
                    active = "";
                }

                if(k >= 1) {
                    current_page = k;
                    _createItem("", current_page, k, current_page, active);
                }
            }
            _setFromTo();
        }

        function _createFinalPager() {
            let start_in = pagers - (max_pager-1);

            for(let k = start_in; k <= pagers; k++) {

                if (k === page) {
                    active = "active";
                } else {
                    active = "";
                }

                if(k >= 1) {
                    current_page = k;
                    _createItem("", current_page, k, current_page, active);
                }
            }
            _setFromTo();
        }

        function _createCustomPager() {
            let get_num = $$.intNumber(page.toString().split('').pop());
            let start_in = 1;

            if (get_num !== 0) {
                start_in = page - get_num + 1;
            } else {
                start_in = page - max_pager + 1;
            }

            if (start_in < max_pager) {
                start_in = max_pager + 1;
            } else {
                start_in = page - Math.ceil(max_pager / 2);
            }

            let end_in = (start_in + max_pager) - 1;

            for (let k = start_in; k <= end_in; k++) {

                if (k === page) {
                    active = "active";
                } else {
                    active = "";
                }

                if(k >= 1) {
                    current_page = k;
                    _createItem("", current_page, k, current_page, active);
                }
            }
            _setFromTo();
        }

        function _createLastControls() {
            let next_page = (page+1 > pagers) ? 1 : (page+1);
            _createItem("Next", lb_button_next, "next", next_page, "");
            _createItem("Last", lb_button_last, "last", pagers);
        }

        function _createPagerInfo() {
            let text = null;

            if (pager_info) {
                switch (lang) {
                    case "ptbr":
                        text = "Exibindo resultados de " + from_item + " a " + to_item + " para " + total_items + " iten(s)";
                        break;
                    case "en":
                        text = "Showing results of " + from_item + " to " + to_item + " at " + total_items + " item(s)";
                        break;
                    case "es":
                        text = "Mostrando resultados de " + from_item + " a " + to_item + " para " + total_items + " elemento(s)";
                        break;
                    default:
                        text = "Ops! Showing results of " + from_item + " to " + to_item + " at " + total_items + " item(s)";
                }
                jH("#jh-pager-info").html(text);
            }
        }

        /**
         * Callback Functions
         */
        function _callback(fn , args) {
            if (typeof fn === "function") {
                jH("[data-paginate-result]", {rsp: 'data'}).on('click', function(pag) {
                    if(page !== pag) {
                        if (args) {
                            fn(args, $$.intNumber(pag));
                        } else {
                            fn($$.intNumber(pag));
                        }
                    }
                });
            }
        }

        /**
         * Runner
         */
        function _run() {
            _create();
            _createFirstControls();

            if (page <= max_pager) {
                _createInitialPager();
            } else if (page + max_pager > pagers) {
                _createFinalPager();
            } else {
                _createCustomPager();
            }

            _createLastControls();
            _createPagerInfo();
        }

        /**
         * Execute
         * */
        try {
            _run();
        } catch (er) {
            $$.log("paginate() error => " + er).except();
        }

        return {"callback": _callback};
    }

    /**[THEME]
     * @description Paginate Range, create a simple paginate to handler result from on requests and queries
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.smartPager = function (params) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let pager_target = ($$.has('target').in(params)) ? params.target : "";
        let pager_info = ($$.has('pager_info').in(params)) ? params.pager_info : false;
        let page = ($$.has('page').in(params)) ? params.page : 1;
        let total_items = ($$.has('total_items').in(params)) ? params.total_items : 1;
        let items_show = ($$.has('items_show').in(params)) ? params.items_show : "";
        let max_pager = ($$.has('max_pager').in(params)) ? params.max_pager : 1;
        let jumper = ($$.has('jumper').in(params)) ? params.jumper : false;
        let jumper_fix = ($$.has('jumper_fix').in(params)) ? params.jumper_fix : false;
        let use_button = ($$.has('use_button').in(params)) ? params.use_button : true;

        /**
         * Global Settings to paginate
         */
        let range = [];
        let start_in = 0;
        let end_in = 0;
        let active = "";
        let from_item = 1;
        let current_page = 0;
        let to_item = items_show;
        let pagers = Math.ceil(total_items / items_show);
        let allow_jumper = 10; /*qty pagers, default value: 10*/

        /**
         * Component Settings
         */
        let jh_smartpager_container = "jh-smartpager-container";
        let jh_smartpager_ul = "jh-smartpager-ul";
        let jh_pager_info = "jh-pager-info";

        /**
         * Button Settings
         */
        let lb_button_first = "&laquo;";
        let lb_button_prev = "&lsaquo;";
        let lb_button_next = "&rsaquo;";
        let lb_button_last = "&raquo;";
        let lb_button_void = "&hellip;";
        let lb_button_jumper = "&#8631;";
        let data_button_pager = "data-smartpager-result";
        let data_button_jumper = "data-smartpager-jumper";

        /**
         * Get Global Settings
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * General Functions
         */
        function _configure() {
            if (page <= 0) page = pagers;
            if (page > pagers) page = 1;

            if (theme === '-modern') {
                if (lang === 'en') {
                    lb_button_first = "First";
                    lb_button_prev = "Prev";
                    lb_button_next = "Next";
                    lb_button_last = "Last";
                } else if(lang === 'ptbr') {
                    lb_button_first = "Primeiro";
                    lb_button_prev = "Anterior";
                    lb_button_next = "Próximo";
                    lb_button_last = "Ultimo";
                } else if(lang === 'es') {
                    lb_button_first = "Primeiro";
                    lb_button_prev = "Anterior";
                    lb_button_next = "Próximo";
                    lb_button_last = "Ultimo";
                }
            }
        }

        function _setPaginateRange() {
            let range_qty = Math.ceil(pagers / max_pager);
            let range_ini = 1;
            let range_fin = 1;

            for (let r = 1; r <= range_qty; r++) {
                range_ini = (max_pager*r)-max_pager+1;
                // range_fin = ((max_pager*r) > pagers) ? pagers : (max_pager*r);
                range_fin = (max_pager*r);
                range[r] = [range_ini, range_fin];
            }

            for (let t = 1; t < range.length; t++) {
                if (page >= range[t][0] && page <= range[t][1]) {
                    start_in = range[t][0];
                    end_in = range[t][1];
                    break;
                }
            }
        }

        function _flushTarget() {
            if ($$.findId(jh_smartpager_container)) {
                $$.remove(pager_target, "#"+jh_smartpager_container);
            }
        }

        function _setFromTo() {
            from_item = (items_show * page) - items_show || 1;
            if (items_show === 1) {
                from_item = items_show * page;
            }
            to_item = items_show * page;
            if (to_item > total_items) {
                to_item = total_items;
            }
        }

        function _createItem(label, icon, prefix, value, active) {

            $$.create({
                element:  "li",
                attr_type: ["id", "class"],
                attr_name: ["li-page-item-"+prefix, "page-item "+active],
                append: "#"+jh_smartpager_ul
            });

            if (use_button !== true) {

                $$.create({
                    element: "a",
                    attr_type: ["id", "class", "title", "data-content", data_button_pager],
                    attr_name: ["a-page-link-" + prefix, "page-link", label, value, data_button_pager],
                    append: "#li-page-item-" + prefix
                }, icon);

            } else {

                /*Button to access Jumper Component*/
                if (label === 'Jumper' && pagers > allow_jumper) {

                    $$.create({
                        element: "button",
                        attr_type: ["id", "class", "title", "data-content", data_button_jumper],
                        attr_name: ["button-page-" + prefix, "page-link", label, value, data_button_jumper],
                        append: "#li-page-item-" + prefix
                    }, icon);

                } else {

                    if (active === 'disabled') {
                        $$.create({
                            element: "button",
                            attr_type: ["id", "class", "disabled"],
                            attr_name: ["button-page-link-" + prefix, "page-link-disabled", "disabled"],
                            append: "#li-page-item-" + prefix
                        }, icon);
                    } else {
                        $$.create({
                            element: "button",
                            attr_type: ["id", "class", "title", "data-content", data_button_pager],
                            attr_name: ["button-page-link-" + prefix, "page-link", label, value, data_button_pager],
                            append: "#li-page-item-" + prefix
                        }, icon);
                    }
                }
            }
        }

        /**
         * Main Functions
         */
        function _createSmartPager() {

            $$.create({
                element:  "div",
                attr_type: ["id", "class"],
                attr_name: [jh_smartpager_container, jh_smartpager_container+theme],
                append: pager_target
            });

            $$.create({
                element:  "ul",
                attr_type: "id",
                attr_name: jh_smartpager_ul,
                append: "#"+jh_smartpager_container
            });

            if (pager_info) {
                $$.create({
                    element:  "div",
                    attr_type: "id",
                    attr_name: jh_pager_info,
                    append: "#"+jh_smartpager_container
                });
            }
        }

        function _createFirstControls() {
            let previous_page = (page-1 <= 0) ? pagers : (page-1);
            _createItem("First", lb_button_first, "first", (current_page+1), "");
            _createItem("Previous", lb_button_prev, "prev", previous_page, "");
        }

        function _createPagers() {
            for (let k = start_in; k <= end_in; k++) {

                if (k === page) {
                    active = "active";
                } else {
                    active = "";
                }

                if(k >= 1 && k <= pagers) {
                    current_page = k;
                    _createItem("", current_page, k, current_page, active);
                } else {
                    _createItem("", lb_button_void, "fill-"+k, "X", "disabled");
                }
            }
            _setFromTo();
        }

        function _createLastControls() {
            let next_page = (page+1 > pagers) ? 1 : (page+1);
            _createItem("Next", lb_button_next, "next", next_page, "");
            _createItem("Last", lb_button_last, "last", pagers, "");
        }

        function _createPagerInfo() {
            let text = null;

            if (pager_info) {
                switch (lang) {
                    case "ptbr":
                        text = "Exibindo resultados de " + from_item + " a " + to_item + " para " + total_items + " iten(s)";
                        break;
                    case "en":
                        text = "Showing results of " + from_item + " to " + to_item + " at " + total_items + " item(s)";
                        break;
                    case "es":
                        text = "Mostrando resultados de " + from_item + " a " + to_item + " para " + total_items + " elemento(s)";
                        break;
                    default:
                        text = "Ops! Showing results of " + from_item + " to " + to_item + " at " + total_items + " item(s)";
                }
                jH("#"+jh_pager_info).html(text);
            }
        }

        function _createPagerJumper() {
            if (jumper === true && pagers > allow_jumper) {
                _createItem("Jumper", lb_button_jumper, "jumper", "jumper", "");
                if (jumper_fix === true) {
                    jH(pager_target).css("position", "unset !important");
                }
            }
        }

        /**
         * Callback Functions
         */
        function _callback(fn , args) {
            /*Item paginate*/
            jH("["+data_button_pager+"]", {rsp: 'data'}).on('click', function(pag) {
                if (typeof fn === "function") {
                    if(page !== pag) {
                        if (args) {
                            fn(args, $$.intNumber(pag));
                        } else {
                            fn($$.intNumber(pag));
                        }
                    }
                }
            });
            /*Open Jumper*/
            if (jumper === true && pagers > allow_jumper) {
                jH("["+data_button_jumper+"]").on('click', function () {
                    $$.jumper({
                        jumper_target: pager_target,
                        jumper_range: range,
                        bottom: "80px",
                        theme: theme,
                        lang: lang
                    }).run(fn, args);
                });
            }
        }

        /**
         * Runner
         */
        function _run() {
            _configure();
            _setPaginateRange();
            _flushTarget();

            _createSmartPager();
            _createFirstControls();
            _createPagers();
            _createLastControls();
            _createPagerInfo();
            _createPagerJumper();
        }

        /**
         * Execute
         * */
        try {
            _run();
        } catch (er) {
            $$.log("smartPager() error => " + er).except();
        }

        return {"callback": _callback};
    }

    /**[THEME]
     * @description Paged Table, create a table with pagination and input text to search the results from any query
     * @param {object} params (object: Mandatory)
     * @param {array} columns (array: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.pagedTable = function(params, columns) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let bordered = ($$.has('bordered').in(params)) ? params.bordered : false;
        let collapsed = ($$.has('collapsed').in(params)) ? params.collapsed : false;
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let items_show = ($$.has('items_show').in(params)) ? params.items_show : 1;
        let renderize = ($$.has('renderize').in(params)) ? params.renderize : {};
        let query_renderize = ($$.has('query_renderize').in(params)) ? params.query_renderize : {};
        let search = ($$.has('search').in(params)) ? params.search : false;
        let paginate = ($$.has('paginate').in(params)) ? params.paginate : false;

        /**
         * Global Settings to pagedTable
         */
        let data = [];
        let data_len = 0;
        let data_type = "";
        let process_type = "renderize";
        let no_results = "";
        let query_error = "";

        /**
         * Get Global Settings
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * General Adjust
         */
        if (lang === 'ptbr') {
            no_results = "Nenhum resultado encontrado";
            query_error = "Ocorreu um erro durante a consulta";
        } else if(lang === 'en') {
            no_results = "No results found";
            query_error = "An error occurred during the query";
        }  else if(lang === 'es') {
            no_results = "Ningún resultado encontrado";
            query_error = "Ocurrió un error durante la consulta";
        }

        if (target === "") {
            $$.log("pagedTable() error => Missing target element...").error();
            return false;
        }

        if (renderize.active === true) {
            if (!$$.has('data').in(renderize)) {
                $$.log("pagedTable() error => Wrong parameters to renderize mode !").error();
                return false;
            }
            data = renderize.data;
            process_type = "renderize";
            data_type = $$.dataType(data);
        }

        if (query_renderize.active === true) {
            if (
                !$$.has('url').in(query_renderize) ||
                !$$.has('params').in(query_renderize) ||
                !$$.has('data_type').in(query_renderize) ||
                !$$.has('content_type').in(query_renderize)
            ) {
                $$.log("pagedTable() error => Wrong parameters to query_renderize mode !").error();
                return false;
            }
            process_type = "query_renderize";
        }

        if (paginate.active === true) {
            if (
                !$$.has('page').in(paginate) ||
                !$$.has('max_pager').in(paginate) ||
                !$$.has('jumper').in(paginate)
            ) {
                $$.log("pagedTable() error => Wrong parameters to paginate !").error();
                return false;
            }
        }

        if (columns.length === 0 || !columns) {
            $$.log("pagedTable() warning => Missing columns name !").log();
        }

        /**
         * Begin Functions
         */
        function _setDataLen() {
            data_len = 0;
            Object.keys(data).forEach(function (item, index, array) {
                data_len += 1;
            });
        }

        function _mapperArray() {
            for (let j = ((items_show * paginate.page) - items_show); j < (items_show * paginate.page); j++) {
                $$.create({
                    element: "tr",
                    attr_type: "id",
                    attr_name: "jh-paged-table-tbody-tr-" + j,
                    append: "#jh-paged-table-tbody"
                });

                if ($$.isDefined(data[j])) {
                    Object.keys(data[j]).forEach(function (item, index, array) {
                        $$.create({
                            element: "td",
                            attr_type: "class",
                            attr_name: "jh-paged-table-tbody-td",
                            append: "#jh-paged-table-tbody-tr-" + j
                        }, data[j][item]);
                    });
                }
            }
        }

        function _mapperObject() {
            for (let j = (1+(items_show * paginate.page) - items_show); j <= (items_show * paginate.page); j++) {
                if ($$.isDefined(data[j])) {
                    $$.create({
                        element: "tr",
                        attr_type: "id",
                        attr_name: "jh-paged-table-tbody-tr-" + j,
                        append: "#jh-paged-table-tbody"
                    });
                    Object.keys(data[j]).forEach(function (item, index, array) {
                        $$.create({
                            element: "td",
                            attr_type: "class",
                            attr_name: "jh-paged-table-tbody-td",
                            append: "#jh-paged-table-tbody-tr-" + j
                        }, data[j][item]);
                    });
                }
            }
        }

        function _renderize() {
            if (data_type === 'array/object') {
                data_len = data.length;
                _mapperArray();
            }
            if (data_type === 'array/array') {
                _setDataLen();
                _mapperArray();
            }
            if (data_type === 'object/object') {
                _setDataLen();
                _mapperObject();
            }
            if (data_type === 'object/array') {
                _setDataLen();
                _mapperObject();
            }
        }

        function _query() {
            $$.ajax({
                url: query_renderize.url,
                async: true,
                cors: true,
                data: query_renderize.params,
                dataType: query_renderize.data_type,
                contentType: query_renderize.content_type,
                restful: false
            }).get(function(resp) {

                if (resp.error) {
                    jH("#jh-paged-table-tbody")
                        .html("" +
                            "<tr>" +
                            "<td colspan='10000' class='jh-paged-table-query-error'>" + query_error +": "+ resp.text + "</td>" +
                            "</tr>");
                } else {

                    if (resp.length > 0) {
                        data = resp;
                        data_type = $$.dataType(data);
                        _renderize();
                        _finalize();
                    } else {
                        jH("#jh-paged-table-tbody")
                            .html("" +
                                "<tr>" +
                                "<td colspan='10000' class='jh-paged-table-not-found'>" + no_results + "</td>" +
                                "</tr>");
                    }
                }

            }, function(err) {
                $$.log("pagedTable:_query:ajax() error => " + err).error();
            });
        }

        function _createHeader() {
            /*Prevent Bug*/
            if (!columns) {
                return false;
            }

            $$.create({
                element:  "tr",
                attr_type: "id",
                attr_name: "jh-paged-table-thead-tr",
                append: "#jh-paged-table-thead"
            });

            for (let k = 0; k < columns.length; k++) {
                $$.create({
                    element:  "th",
                    attr_type: "class",
                    attr_name: "jh-paged-table-thead-tr-th",
                    append: "#jh-paged-table-thead-tr"
                }, columns[k]);
            }
        }

        function _createBody() {
            if (process_type === 'renderize') {
                _renderize();
            } else if (process_type === 'query_renderize') {
                _query();
            }
        }

        function _finalize() {

            if (bordered) {
                jH("#jh-paged-table>tbody>tr>td").css("border: solid 1px;");
            }

            if (collapsed) {
                jH("#jh-paged-table").css("border-collapse: collapse;");
            }

            if (paginate.active === true && paginate.jumper === false) {

                $$.paginate({
                    lang: lang,
                    target: '#jh-paged-table-container',
                    pager_info: true,
                    total_items: data_len,
                    page: paginate.page,
                    items_show: items_show,
                    max_pager: paginate.max_pager,
                    theme: theme,
                    use_button: true,
                }).callback(function(pag) {
                    _paginateTable(pag);
                });

            } else if (paginate.active === true && paginate.jumper === true) {
                /*The Jumper is available only smartPager*/
                $$.smartPager({
                    lang: lang,
                    target: '#jh-paged-table-container',
                    pager_info: true,
                    jumper: true,
                    total_items: data_len, /*total items*/
                    page: paginate.page, /*current page*/
                    items_show: items_show,
                    max_pager: paginate.max_pager,
                    theme: theme, /*default, dark, light, modern, discreet*/
                    use_button: true, /*default, dark, light, modern, discreet*/
                }).callback(function(pag) {
                    _paginateTable(pag);
                });

            }

            if (search) {
                /**
                 * [TODO]
                 * If active search box, show the input text to enter a
                 * word to search result in body table
                 */
            }
        }

        function _paginateTable(new_page) {
            jH("#jh-paged-table-tbody").html("");
            paginate.page = new_page;
            process_type = "renderize";
            _createBody();
            _finalize();
        }

        function _create() {
            jH(target).html("");

            $$.create({
                element:  "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-paged-table-container", "jh-paged-table-container"+theme],
                append: target
            });

            $$.create({
                element:  "table",
                attr_type: "id",
                attr_name: "jh-paged-table",
                append: "#jh-paged-table-container"
            });

            $$.create({
                element:  "thead",
                attr_type: "id",
                attr_name: "jh-paged-table-thead",
                append: "#jh-paged-table"
            });

            $$.create({
                element:  "tbody",
                attr_type: "id",
                attr_name: "jh-paged-table-tbody",
                append: "#jh-paged-table"
            });

            _createHeader();
            _createBody();
            _finalize();
        }

        function _run(fn, args) {

            try {
                _create();

                if (typeof fn === 'function') {
                    fn(args||"");
                }

            } catch (er) {
                $$.log("pagedTable() error => " + er).except();
            }
        }

        return {"run": _run};
    }

    /**[NO_THEME]
     * @description Select Over, clone, destroy and replace an <HTMLElement:select> with optimized options
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.selectOver = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let callback = ($$.has('callback').in(params)) ? params.callback : "";

        /**
         * Global Settings
         */

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(theme);

        /**
         * Generic Functions
         */
        function _checkin() {
            return true;
        }

        /**
         * Main Functions
         */
        function _create() {
            $$.create({
                element: "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-model-container", "jh-model-container" + theme],
                append: target
            });
        }

        function _run() {
            try {
                if (_checkin()) {
                    _create();
                }
            } catch (er) {
                $$.log("_METHOD_NAME_MODEL_() error => " + er).except();
            }
        }

        return {"run": _run}
    }

    /*
     --------------------------------------------------------------------------------
     - UTIL AND TOOLS
     --------------------------------------------------------------------------------
     */

    /**
     * @description Draggable, Drag and Drop events handlers
     * @param {string|object} params (string|object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.draggable = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let target = ($$.has('target').in(params)) ? params.target : "";
        let elements = ($$.has('elements').in(params)) ? params.elements : [];
        let anime = ($$.has('anime').in(params)) ? params.anime : "none";
        let effect = ($$.has('effect').in(params)) ? params.effect : "copy";
        let append = ($$.has('append').in(params)) ? params.append : false;
        let tab_bottom = ($$.has('tab_bottom').in(params)) ? params.tab_bottom : true;

        /**
         * Global Settings
         */
        let drag_of_x = 0;
        let drag_of_y = 0;
        let z_index = 10;
        let body_drop = null;
        let draggable = null;
        let droppable = null;
        let drag_event = null;
        let drop_events = {};
        let data_handler = {};
        let data_response = {};
        let transition = {
            none: "none",
            slow: "all 3s ease-in-out",
            fast: "all 0.5s ease-in-out"

        };
        let effects = {
            copy: "copy",
            move: "move",
            link: "link"
        };
        let accepted_animes = ["none", "slow", "fast"];
        let accepted_effects = ["copy", "move", "link"];

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(lang);

        /**
         * Generic Functions
         */
        function _checkin() {
            if (elements.length === 0) {
                $$.log("draggable() error => Missing parameters elements").error();
                return false;
            }

            for (let i = 0; i < elements.length; i++) {
                if (!$$.findId(elements[i])) {
                    $$.log("draggable() error => Missing target element: " + elements[i]).error();
                    return false;
                }
            }

            if (!$$.inArray(accepted_animes, anime)) {
                $$.log("draggable() error => Wrong anime type: " + anime).error();
                return false;
            }

            if (!$$.inArray(accepted_effects, effect)) {
                $$.log("draggable() error => Wrong handler event effect drop: " + effect).error();
                return false;
            }

            return true;
        }

        /**
         * Drag Functions
         */
        function _dragRun(id, e) {
            draggable = $$.select(id);
            // drag_of_x = e.clientX - draggable.offsetLeft;
            drag_of_x = e.clientX - draggable.getBoundingClientRect().left;
            // drag_of_y = e.clientY - draggable.offsetTop;
            drag_of_y = e.clientY - draggable.getBoundingClientRect().top;

            addEventListener("mousemove", _dragMove);
            addEventListener("mouseup", _dragEnd);
        }

        function _dragMove(e) {
            draggable.style.marginLeft = "0px";
            draggable.style.left = (e.clientX - drag_of_x) + 'px';
            draggable.style.top = (e.clientY - drag_of_y) + 'px';

            if ($$.is(drag_event).function()) {
                drag_event({
                    drag: true,
                    id: draggable.id,
                    text: draggable.textContent,
                    data: draggable.dataset.content,
                    value: draggable.value,
                    x: draggable.offsetLeft,
                    y: draggable.offsetTop
                });
            }
        }

        function _dragEnd() {
            removeEventListener("mousemove", _dragMove);
            removeEventListener("mouseup", _dragEnd);

            if ($$.is(drag_event).function()) {
                drag_event({
                    drag: false,
                    id: draggable.id,
                    text: draggable.textContent,
                    data: draggable.dataset.content,
                    value: draggable.value,
                    x: draggable.offsetLeft,
                    y: draggable.offsetTop
                });
            }
        }

        function _setDraggable() {
            elements.forEach(function(item, index, array) {
                _setAbsPosition(item);
                _insertDraggableTab(item);
            });
        }

        function _setAbsPosition(item) {
            jH(item).css({
                styles: {
                    position: "absolute !important",
                    user_drag: "element !important",
                    z_index: z_index.toString() + " !important",
                    transition: transition[anime],
                    padding_top: "0 !important",
                    padding_bottom: "0 !important"
                }
            });
            z_index++;
        }

        function _insertDraggableTab(item) {
            let _get_items_ = jH(item).select();

            function _insertTab(item_id) {
                let _id_ = item_id;
                let aux = $$.select("#"+_id_).innerHTML;
                jH("#"+_id_).erase();

                $$.create({
                    element: "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-draggable-puller-top-"+_id_, "jh-draggable-puller-top"],
                    append: "#"+_id_
                }, $$.icons({
                    icon: 'move',
                    size: 's-22',
                    data: "",
                    color: "#FFFFFF",
                    id: "jh-draggable-1-"+_id_
                }).draw());

                jH("#"+_id_).append(aux);

                if (tab_bottom === true) {
                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-draggable-puller-bottom-" + _id_, "jh-draggable-puller-bottom"],
                        append: "#" + _id_
                    }, $$.icons({
                        icon: 'move',
                        size: 's-22',
                        data: "",
                        color: "#FFFFFF",
                        id: "jh-draggable-1-"+_id_
                    }).draw());
                }
            }

            if (_get_items_.length > 0) {
                _get_items_.forEach(function(item, index, array) {
                    _insertTab(item.id);
                });
            } else {
                _insertTab(_get_items_.id);
            }
        }

        function _setZIndex(item) {
            try {
                $$.select(item).style.zIndex = z_index.toString();
                z_index++;
                return true;
            } catch (er) {
                $$.log("draggable() error => Missing id: " + er).print("red");
            }
            return false;
        }

        function _activeDrag(drag) {
            elements.forEach(function(item, index, array) {
                _setDragItem(item, drag);
            });
        }

        function _setDragItem(item, drag) {
            let _get_items_ = jH(item).select();

            function _setItem(item_id) {
                let _id_ = item_id;
                let _elem_ = "#jh-draggable-puller-top-"+_id_;

                if (tab_bottom === true) {
                    _elem_ = "#jh-draggable-puller-top-"+_id_+", "+"#jh-draggable-puller-bottom-"+_id_;
                }

                jH(_elem_).on('mousedown', function(e) {
                    try {
                        if (_setZIndex("#" + $$this.offsetParent.id) === true) {
                            _dragRun("#" + $$this.offsetParent.id, e);
                            if ($$.is(drag).function()) {
                                drag_event = drag;
                            }
                        }
                    } catch (er) {
                        $$.log("draggable() err => " + er).print("silver");
                    }
                });
            }

            if (_get_items_.length > 0) {
                _get_items_.forEach(function(item, index, array) {
                    _setItem(item.id);
                });
            } else {
                _setItem(_get_items_.id);
            }
        }

        function _drag(drag = undefined) {
            if (_checkin()) {
                _setDraggable();
                _activeDrag(drag);
            }
        }

        /**
         * Component Functions
         */
        function _setDataHandler(e) {
            data_handler = {
                id: e.target || undefined,
                origin: e.target.parentElement || e.target.parentElement || undefined
            };
            data_response = {
                id: e.target.id || undefined,
                id_origin: e.target.parentElement.id || "#"+e.target.parentElement.id || undefined,
                html: e.target.outerHTML || undefined,
                text: e.target.textContent || undefined,
                data: e.target.dataset.content || undefined,
                val: e.target.value || undefined,
                type: e.target.tagName || undefined,
                file: undefined
            };
        }

        function _disableDrop(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        function _activeComponent(events) {

            (function dragStart() {
                elements.forEach(function(item, index, array) {
                    let _get_ = $$.select(item);
                    _get_.forEach(function(item_, index_, array_) {
                        item_.addEventListener('dragstart', _setDataHandler, false);
                    })
                });
            })();

            (function dropHandler() {
                if ($$.has("drop").in(events)) {
                    droppable.addEventListener('drop', _handleDrop, false);
                    drop_events["drop"] = events.drop;
                }

                if ($$.has("enter").in(events)) {
                    droppable.addEventListener('dragenter', _handleDragover, false);
                    drop_events["enter"] = events.enter;
                }

                if ($$.has("over").in(events)) {
                    droppable.addEventListener('dragover', _handleDragover, false);
                    drop_events["over"] = events.over;
                }

                if ($$.has("exit").in(events)) {
                    droppable.addEventListener('dragexit', _handleExit, false);
                    drop_events["exit"] = events.exit;
                }
            })();
        }

        function _handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();

            e.dataTransfer.dropEffect = effects[effect];

            if (e.dataTransfer.files.length) {
                data_response['file'] = e.dataTransfer.files;
            }

            if (append === true) {
                try {
                    droppable.appendChild(data_handler.id);
                    jH("#"+data_response.id).props("draggable", "false");

                    $$.create({
                        element: "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-draggable-drop-remove-"+data_response.id, "jh-draggable-drop-remove"],
                        append: "#"+data_response.id
                    }, "X");

                    jH(".jh-draggable-drop-remove").on('click', function(e) {
                        try {
                            jH("#"+$$this.parentElement.id).props("draggable", "true");
                            data_handler.origin.appendChild($$this.parentElement);
                            $$this.parentElement.removeChild($$this);
                        } catch (er) {
                            $$.noth();
                        }
                    });

                } catch (er) {
                    $$.log("Ops! draggable(drop) found an error in application").print("yellowgreen");
                }
            }

            droppable.style.borderColor = "#888888";
            droppable.style.color = "#888888";

            if ($$.is(drop_events.drop).function()) {
                drop_events.drop(data_response);
            }
        }

        function _handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();

            e.dataTransfer.dropEffect = effects[effect];

            droppable.style.borderColor = "#29a5c0";
            droppable.style.color = "#29a5c0";

            if ($$.is(drop_events.enter).function()) {
                drop_events.enter(data_response);
            }

            if ($$.is(drop_events.over).function()) {
                drop_events.over(data_response);
            }
        }

        function _handleExit(e) {
            e.stopPropagation();
            e.preventDefault();

            droppable.style.borderColor = "#888888";
            droppable.style.color = "#888888";

            if ($$.is(drop_events.exit).function()) {
                drop_events.exit(data_response);
            }
        }

        function _prepareDrop() {

            body_drop = document.getElementsByTagName('body')[0];

            if (!body_drop.addEventListener) {
                $$.log("draggable() error => addEventListener is not supported on " + body_drop).error();
                return false;
            }

            body_drop.addEventListener('dragenter', _disableDrop, false);
            body_drop.addEventListener('dragover', _disableDrop, false);
            body_drop.addEventListener('drop', _disableDrop, false);

            if (!$$.findId(target)) {
                $$.log("draggable() error => Missing target drop: " + target).error();
                return false;
            }

            $$.create({
                element: "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-draggable-container-drop", "jh-draggable-container-drop"+theme],
                append: target
            });

            try {
                droppable = $$.select("#jh-draggable-container-drop");
                return true;
            } catch (er) {
                return false;
            }
        }

        function _component(events = {}) {
            if (_checkin() && _prepareDrop()) {
                _activeComponent(events);
            }
        }

        return {"drag": _drag, "component": _component};
    }

    /**[THEME]
     * @description Sticker, show a little helper localized in left side of screen
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.sticker = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "body";
        let type = ($$.has('type').in(params)) ? params.type : "confirm";
        let text = ($$.has('text').in(params)) ? params.text : "Missing text...";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let action = ($$.has('action').in(params)) ? params.action : "";

        /**
         * Global Settings
         */
        let sticker_close = false;
        let accepted_types = ["confirm", "info"];

        /**
         * Adjusts
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * Generic Functions
         * */
        function _checkin() {
            if (!$$.is(action).function()) {
                $$.log("sticker() error => action is not a function !").error();
                return false;
            }

            if (!$$.inArray(accepted_types, type)) {
                $$.log("sticker() error => Wrong type: " + type).error();
                return false;
            }
            return true;
        }

        function _activeSticker() {
            (function typeConfirm() {
                if (type !== "confirm") return;

                jH("#jh-sticker-bt-confirm").on('click', function() {
                    $$.confirm({
                        title: "Warning",
                        question: "Tem certeza que deseja executar esta ação ?",
                        theme: theme,
                        buttons: ["Yes", "No"]
                    }, function() {
                        _stickerHide();
                        action();
                    });
                });

                jH("#jh-sticker-bt-cancel").on('click', function() {
                    _stickerHide();
                });
            })();

            (function typeInfo() {
                if (type !== "info") return;

                jH("#jh-sticker-bt-close").on('click', function() {
                    _stickerHide();
                });
            })();

            _stickerShow();

            setTimeout(function() {
                $$.move("#jh-sticker-container").to("left", "0px");
            }, 1000);
        }

        function _stickerClose() {
            if ($$.findId("jh-sticker-container")) {
                $$.remove(target, "#jh-sticker-container");
            }
        }

        function _stickerShow() {
            jH("#jh-sticker-puller").on('mouseover', function() {
                if (sticker_close === true) {
                    $$.move("#jh-sticker-container").to("left", "0px");
                    sticker_close = false;
                }
            });
        }

        function _stickerHide() {
            if ($$.findId("jh-sticker-container")) {
                $$.move("#jh-sticker-container").to("left", "-670px");
                sticker_close = true;
                _stickerShow();
            }
        }

        /**
         * Main Functions
         */
        function _create() {
            _stickerClose();

            (function stickerContainer() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-container", "jh-sticker-container"+theme],
                    append: target
                });
            })();

            (function stickerContent() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-content", "jh-sticker-content"],
                    append: "#jh-sticker-container"
                });
            })();

            (function stickerContentForm() {
                $$.create({
                    element:  "form",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-content-form", "jh-sticker-content-form"],
                    append: "#jh-sticker-content"
                });
            })();

            (function stickerContentForm() {
                $$.create({
                    element:  "p",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-content-form-message", "jh-sticker-content-form-message"],
                    append: "#jh-sticker-content-form"
                }, text);
            })();

            (function stickerContainerButtons() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-container-buttons", "jh-sticker-container-buttons"],
                    append: "#jh-sticker-content-form"
                });
            })();

            (function stickerTypeConfirm() {
                if (type !== "confirm") return;

                $$.create({
                    element:  "button",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-bt-confirm", "jh-sticker-bt-confirm"],
                    append: "#jh-sticker-container-buttons"
                }, $$.icons({
                    icon: 'save', size: 's-22', data: "", color: "#FFFFFF", id: "jh-sticker-icon-confirm"
                }).draw() + "  <p>Yes</p>");

                $$.create({
                    element:  "button",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-bt-cancel", "jh-sticker-bt-cancel"],
                    append: "#jh-sticker-container-buttons"
                }, $$.icons({
                    icon: 'cancel2', size: 's-22', data: "", color: "#FFFFFF", id: "jh-sticker-icon-cancel"
                }).draw() + "  <p>No</p>");
            })();

            (function stickerTypeInfo() {
                if (type !== "info") return;

                $$.create({
                    element:  "button",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-bt-close", "jh-sticker-bt-close"],
                    append: "#jh-sticker-container-buttons"
                }, $$.icons({
                    icon: 'cancel', size: 's-22', data: "", color: "#FFFFFF", id: "jh-sticker-icon-close"
                }).draw() + " <p>Close</p>");
            })();

            (function stickerPuller() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-sticker-puller", "jh-sticker-puller"],
                    append: "#jh-sticker-container"
                }, $$.icons({
                    icon: 'help', size: 's-21', data: "", color: "#FFFFFF", id: "jh-sticker-icon"
                }).draw()||"?");
            })();
        }

        function _stickerRun() {
            try {
                if (_checkin()) {
                    _create();
                    _activeSticker();
                }
            } catch (er) {
                $$.log("sticker() error => " + er).except();
            }
        }

        return {"run": _stickerRun, "close": _stickerClose, "hide": _stickerHide};
    }

    /**[THEME]
     * @description Roll Up, got to the top screen
     * @param {object} params (object: Mandatory)
     * @returns {null} (null: Alone)
     */
    jsHunter.prototype.rollup = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let offset = ($$.has('offset').in(params)) ? params.offset : 200;

        /**
         * Global Settings
         */
        let control_rollup = null;
        let insert_rollup = false;

        /**
         * Adjusts
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * Generic Functions
         * */
        function _checkin() {
            return true;
        }

        function _activeRollup() {
            jH("#jh-rollup-container").on('click', function() {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                _destroy();
            });
        }

        /**
         * Main Functions
         */
        function _create() {
            $$.create({
                element:  "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-rollup-container", "jh-rollup-container"+theme],
                append: "body"
            }, $$.icons({
                icon: 'rollup', size: 's-56', data: "", color: "#BABABA", id: "jh-rollup-icon"
            }).draw());
        }

        function _destroy() {
            jH("#jh-rollup-container").fadeOut({
                remove: true,
                parent: "body",
                children: "#jh-rollup-container"
            });
        }

        function _monitorRollup() {
            control_rollup = setInterval(function() {
                if ((window.scrollY + window.innerHeight) > (window.innerHeight + offset)) {
                    if (insert_rollup === false) {
                        insert_rollup = true;
                        _create();
                        _activeRollup();
                    }
                } else {
                    if (insert_rollup === true) {
                        insert_rollup = false;
                        _destroy();
                    }
                }
            }, 1000);
        }

        try {
            if (_checkin()) {
                _monitorRollup();
            }
        } catch (er) {
            $$.log("rollup() error => " + er).except();
        }

        return null;
    }

    /**[THEME]
     * @description Create a queue process to handler items
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     */
    jsHunter.prototype.queue = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let target = ($$.has('target').in(params)) ? params.target : "";
        let timeout = ($$.has('timeout').in(params)) ? params.timeout : 60;/*seconds*/
        let async = ($$.has('async').in(params)) ? params.async : false;
        let identify = ($$.has('key').in(params)) ? params.key : "id";
        let debug = ($$.has('debug').in(params)) ? params.debug : false;

        /**
         * Global Settings
         */
        let ctrl_queue = null;
        let current_item = null;
        let total_items = params.items.length;
        let timeout_queue = 1;
        let counter_queue = 1;
        let counter_finished = 1;
        let counter_error = 0;
        let counter_success = 0;
        let id_ide = "jh-queue-table-tr-td-identify-";
        let id_gen = "jh-queue-table-tr-td-generic-";
        let queue_container = "jh-queue-container";
        let _current_class = "jh-queue-table-tr-td-current";
        let _generic_class = "jh-queue-table-tr-td-generic";
        let _identify_class = "jh-queue-table-tr-td-identify";
        let app_response = {};

        /**
         * Adjusts
         */
        theme = _getTheme(theme);
        lang = _getLang(lang);

        /**
         * General Adjust
         */
        _resetResponse();

        function _checkin() {
            if (params.items.length === 0) {
                $$.log("queue() error => Missing Items to processing...").error();
                return false;
            }

            params.items.forEach(function(item, index, array) {
                if (!$$.has(identify).in(item)) {
                    $$.log("queue() error => Missing identify: " + identify).error();
                    return false;
                }
            });

            if (target.search(/^#/) !== -1 && !$$.findId(target)) {
                $$.log("queue() error => Missing target element: " + target).error();
                return false;
            }

            if (target === 'box') {
                try {
                    $$.box({
                        box_id: "queue",
                        size: "small", /*small, medium, large, full*/
                        title: "Queue Process",
                        border: false,
                        target: "body",
                        theme: theme,
                        lang: lang
                    }).open();
                    target = "#jh-box-content-queue";
                } catch(er) {
                    return false;
                }
            }

            if (target === 'log') {
                $$.log("queue() is running...").print("green");
            }

            return true;
        }

        function _resetResponse() {
            app_response = {
                status: null,
                message: null
            };
        }

        function _drawStructure() {
            if (target === 'log') return;

            (function queueContainer() {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: [queue_container, queue_container],
                    append: target
                });
            })();

            (function queueTableCounter() {
                $$.create({
                    element:  "table",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-table-counter", "jh-queue-table-counter"],
                    append: "#"+queue_container
                });
                $$.create({
                    element:  "tr",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-table-counter-tr", "jh-queue-table-counter-tr"],
                    append: "#jh-queue-table-counter"
                });

                $$.create({
                    element:  "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-td-counter-1", "jh-queue-td-counter"],
                    append: "#jh-queue-table-counter-tr"
                }, counter_queue);

                $$.create({
                    element:  "td",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-td-counter-2", "jh-queue-td-counter"],
                    append: "#jh-queue-table-counter-tr"
                }, params.items.length);
            })();

            (function queueTableContent() {
                $$.create({
                    element:  "table",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-table", "jh-queue-table"],
                    append: "#"+queue_container
                });

                for (let i = 0; i < params.items.length; i++) {
                    $$.create({
                        element:  "tr",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-queue-table-tr-"+params.items[i][identify], "jh-queue-table-tr"],
                        append: "#jh-queue-table"
                    });

                    $$.create({
                        element:  "td",
                        attr_type: ["id", "class", "alt", "title"],
                        attr_name: [id_ide+params.items[i][identify], _identify_class, "", ""],
                        append: "#jh-queue-table-tr-"+params.items[i][identify]
                    }, (params.items[i][identify]).toString());

                    $$.create({
                        element:  "td",
                        attr_type: ["id", "class"],
                        attr_name: [id_gen+params.items[i][identify], _generic_class],
                        append: "#jh-queue-table-tr-"+params.items[i][identify]
                    }, "WAIT");
                }
            })();
        }

        function _handlerItem(item, status, msg = "") {
            if (target === 'log') return;

            let text = "OK";
            let class_name = "jh-queue-table-tr-td-success";

            if (status === false) {
                text = "ERROR";
                class_name = "jh-queue-table-tr-td-error";
            }

            jH("#"+id_ide+item).removeClass(_current_class);
            jH("#"+id_ide+item).addClass(_identify_class);
            jH("#"+id_ide+item).html(item.toString());

            jH("#"+id_gen+item).removeClass(_generic_class);
            jH("#"+id_gen+item).addClass(class_name);
            jH("#"+id_gen+item).html(text);

            jH("#jh-queue-td-counter-1").html(counter_queue);
            counter_queue++;

            if (msg !== "") {
                $$.create({
                    element:  "div",
                    attr_type: ["id", "class"],
                    attr_name: ["jh-queue-error-details-"+item, "jh-queue-error-details"],
                    append: "#jh-queue-table-tr-td-identify-"+item
                }, msg);

            }
        }

        function _setItemProcessing() {
            if (target === 'log') return;
            jH("#"+id_ide+current_item[identify]).removeClass(_identify_class);
            jH("#"+id_ide+current_item[identify]).addClass(_current_class);
        }

        function _setCurrentItem(item = null) {
            if ($$.isDefined(item)) {
                return current_item = item;
            }
            return current_item = params.items.shift();
        }

        function _itemResponse() {
            setTimeout(function() {
                if (app_response.status === true) {
                    if (target === 'box' || target !== 'log') {
                        _handlerItem(current_item[identify], true);
                    } else if (target === 'log') {
                        $$.log("[Queue Log]").print("yellow");
                        $$.log({
                            status: "SUCCESS",
                            app_response: app_response.message,
                            item: current_item
                        }).print();
                    }
                } else if (app_response.status === false) {
                    if (target === 'box' || target !== 'log') {
                        _handlerItem(current_item[identify], false, app_response.message);
                    } else if (target === 'log') {
                        $$.log("[Queue Log]").print("yellow");
                        $$.log({
                            status: "ERROR",
                            app_response: app_response.message,
                            item: current_item
                        }).print();
                    }
                }
            }, 500);
        }

        /*Sync Resources*/
        function _runSync(fn) {
            app_response = fn(_setCurrentItem());
            _setItemProcessing();
            _itemResponse();
            ctrl_queue = setInterval(function () {
                if (params.items.length === 0) {
                    clearInterval(ctrl_queue);
                    _resetResponse();
                    timeout_queue = 1;
                    $$.log("jsHunter: Queue Processing is finished !").print("cyan");
                    return;
                }

                if (timeout_queue >= parseInt(timeout)) {
                    timeout_queue = 1;
                    $$.log("queue() error => Item is not processed: "
                        + JSON.stringify(current_item)).error();
                }

                if ($$.isDefined(app_response.status)) {
                    app_response = fn(_setCurrentItem());
                    _setItemProcessing();
                    _itemResponse();
                    timeout_queue = 1;
                }
                timeout_queue++;
            }, 1000);
        }

        /*Async Resources*/
        function _first(data) {
            if (debug) {
                $$.log("First").print("cyan");
                console.log(data);
            }
            if (data.status === true) {
                _handlerItem(data.item, true);
            } else if (data.status === false) {
                _handlerItem(data.item, false, data.message);
            }
        }

        function _success(data) {
            _first(data);
            if (debug) {
                $$.log("Finalizing Item:").print("cyan");
                console.log(data.item);
            }
            counter_finished++;
            counter_success++;
            _finalize();
        }

        function _exception(data) {
            _first(data);
            if (debug) {
                $$.log("Rollback: ").print("cyan");
                console.log(data);
            }
            counter_finished++;
            counter_error++;
            _finalize();
        }

        function _finalize() {

            if (counter_finished >= total_items) {
                if (debug) {
                    $$.log("Finalizing All Items").print("cyan");
                }
                if (counter_error > 0 && counter_success > 0) {
                    $$.toaster({
                        type: "warning",
                        text: "One or more item are not been processed",
                        timeout: 4500
                    });
                } else if (counter_error > 0 && counter_success === 0) {
                    $$.toaster({
                        type: "error",
                        text: "All items has been reject",
                        timeout: 4500
                    });
                } else {
                    $$.toaster({
                        type: "success",
                        text: "All items are been processed",
                        timeout: 4500
                    });
                }
            }
        }

        function _runAsync(fn) {
            $$.log("_runAsync is running...").print("yellowgreen");
            /*Loader Items in Promise*/
            while (params.items.length > 0) {
                let item = params.items.shift();
                _setCurrentItem(item);
                if (debug === 'log') {
                    $$.promise({timeout: 0, debug: true})
                        .run(fn, item)
                        .log();
                } else {
                    _setItemProcessing();
                    $$.promise({timeout: 0, debug: debug})
                        .run(fn, item)
                        .then([_success, _exception]);
                }
            }
        }

        /*Method Run*/
        function _run(fn) {
            try {
                if (_checkin()) {
                    if (params.items.length > 0 && $$.is(fn).function()) {
                        if (target !== 'log') {
                            _drawStructure();
                        }
                        setTimeout(function () {
                            if (async === true) {
                                _runAsync(fn);
                            } else {
                                _runSync(fn);
                            }
                        }, 1500);
                    }
                }
            } catch(er) {
                $$.log("queue() error => " + er).except();
            }
        }

        return {"run": _run};
    }

    /**[NO_THEME]
     * @description Show a exception in your application when need
     * @param {string} text (string: Mandatory)
     * @param {boolean} execute (boolean: Optional)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.exceptBox = function(text, execute = false) {
        if (text && execute) {
            $$.alert({
                title: "&#10006; Application Error",
                text: text,
                theme: "red",
                exception: true
            });
            throw "Process Aborted...";
        }
        return this;
    }

    /**
     * @description Set a default Theme to global use
     * @param {string} theme (string: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.setTheme = function(theme) {
        _setGlobalTheme(theme);
        return this;
    }

    /**
     * @description Get Theme to global use
     * @param {string} theme (string: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.getTheme = function(theme) {
        return _getTheme(theme);
    }

    /**
     * @description Set a default Language to global use
     * @param {string} lang (string: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.setLang = function(lang) {
        _setGlobalLang(lang);
        return this;
    }

    /**
     * @description Get Language to global use
     * @param {string} lang (string: Mandatory)
     * @returns {this} (this: Current instanceOf jsHunter)
     */
    jsHunter.prototype.getLang = function(lang) {
        return _getLang(lang);
    }

    /**[NO_THEME]
     * @description MethodName, Description method
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: Description)
     */
    jsHunter.prototype._METHOD_NAME_MODEL_ = function(params = {}) {

        /**
         * Settings/Configurations by args
         */
        let target = ($$.has('target').in(params)) ? params.target : "";
        let theme = ($$.has('theme').in(params)) ? params.theme : "default";
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let callback = ($$.has('callback').in(params)) ? params.callback : "";

        /**
         * Global Settings
         */

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(theme);

        /**
         * Generic Functions
         */
        function _checkin() {
            return true;
        }

        /**
         * Main Functions
         */
        function _create() {
            $$.create({
                element: "div",
                attr_type: ["id", "class"],
                attr_name: ["jh-model-container", "jh-model-container" + theme],
                append: target
            });
        }

        function _run() {
            try {
                if (_checkin()) {
                    _create();
                }
            } catch (er) {
                $$.log("_METHOD_NAME_MODEL_() error => " + er).except();
            }
        }

        return {"run": _run}
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));