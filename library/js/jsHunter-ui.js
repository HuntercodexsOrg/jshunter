/*
*
* Project: jsHunter UI
* Initial Date: 2019-11-01
* License: MIT
* Description: This is a free source code, please use as best as possible.
*
* This library should be used together with jsHunter and jsHunter-ui.css !
*
*/

;(function(){

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib NOT FOUND) !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /***
     * Variables UI
     * */

    let
        /*Modal controls*/
        modalCtrl = null,
        loopCtrl  = 0;

    /***
     * Private Modal Functions
     * */

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
                console.log('Error on _modalInit(), invalid parameters !');
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
                jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                    if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                        _modalClose(params);
                    }
                });

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
        let _measure = "px";/*Type of measure, can be pixels or percentange*/
        let _add_width = 0;/*Initial value to increase width*/
        let _add_height = 0;/*Initial value to increase height*/

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

        /*Initial sizer at element*/
        jsHunter.fn.sizer(_element, 'width', _width, _measure);
        jsHunter.fn.sizer(_element, 'height', _height, _measure);

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

            /*Event target when lock screen is clicked*/
            jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                    local.closeModal();
                }
            });

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

    function _modalDecrease(params) {

        let _end_width_ = params.styles.width - 100;

        modalCtrl = setInterval(function(){

            if(params.more_width <= _end_width_) {

                clearInterval(modalCtrl);
                _modalIncrease(params);

            } else {

                params.more_width -= 10;

                jsHunter.fn.sizer(params.element, 'width', params.more_width, 'px');

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

                params.more_width += 10;
                jsHunter.fn.sizer(params.element, 'width', params.more_width, 'px');

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

        jsHunter(target).html(atob(body));

        if(_title_ !== '') {
            jsHunter("#modalX_title").html(_title_);
        }

        if(_body_ !== '') {
            jsHunter("#modalX_content").html(_body_);
        }

    }

    /**
     * Modals Prototype
     * */

    jsHunter.prototype.modal = function(params) {
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
            console.error(err);
        }

        return this;
    }

    jsHunter.prototype.modalFX = function(params) {

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

    jsHunter.prototype.modalX = function(params) {

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

    jsHunter.prototype.modalTheme = function(params) {

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
            jsHunter('#modal-content').height('83%');
        }

        /*Writer in box*/
        jsHunter('#modal-close').html('X');
        jsHunter('#modal-title').html(_title_);
        jsHunter('#modal-content').html(_body_);
        jsHunter('#modal-container__thematic').resetStyle().addClass(_theme_);

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

    /**
     * Message Prototype
     * */

    jsHunter.prototype.tooltip = function(params) {
        return null;
    }

    jsHunter.prototype.toast = function(params) {

    }

    jsHunter.prototype.dialog = function(params) {

    }

    jsHunter.prototype.alert = function(params) {

    }

    jsHunter.prototype.confirm = function(params) {

    }

    jsHunter.prototype.adapterBox = function(params) {

    }

    /**
     * Widgets Elements
     * */

    jsHunter.prototype.progressBar = function(params) {

    }

    jsHunter.prototype.progress = function(params) {

    }

    jsHunter.prototype.slider = function(params) {

    }

    /**
     * Data Elements
     * */

    jsHunter.prototype.tableRender = function(params) {

    }

    jsHunter.prototype.tableCloner = function(params) {

    }

    jsHunter.prototype.selectCloner = function(params) {

    }



})((typeof jsHunter !== "undefined" ? jsHunter: ''));
