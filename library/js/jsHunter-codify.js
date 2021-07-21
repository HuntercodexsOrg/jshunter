/*
*
* Project: jsHunter Codify
* Initial Date: 2019-11-01
* License: MIT
* Description: This is a free source code, please use as best as possible.
*
* This library should be used together with jsHunter and jsHunter-codify.css !
*
*/

;(function(){

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw er = "[Exception]: Error on load jsHunter (Lib NOT FOUND) !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /***
     * Variables codify
     * */

    let codeCtrlC = 0;

    let cl = {/*Code Label*/

        /*aliases*/
        A1: {i: '[__A1__]', f: '[__/A1__]', t: '<span class="alias">', d: 'aliases'},

        /*boolean*/
        B1: {i: '[__B1__]', f: '[__/B1__]', t: '<span class="boolean">', d: 'boolean'},

        /*class*/
        C1: {i: '[__C1__]', f: '[__/C1__]', t: '<span class="class">', d: 'class'},
        /*constructor*/
        C2: {i: '[__C2__]', f: '[__/C2__]', t: '<span class="constructor">', d: 'constructor'},
        /*class-name*/
        C3: {i: '[__C3__]', f: '[__/C3__]', t: '<span class="classname">', d: 'class-name'},

        /*comments-in-block*/
        C4: {i: '[__C4__]', f: '[__/C4__]', t: '<span class="comment-in-block">', d: 'comments-in-block'},
        /*comments-inline*/
        C5: {i: '[__C5__]', f: '[__/C5__]', t: '<span class="comments-inline">', d: 'comments-inline'},

        /*Conditions and Loop*/
        C6: {i: '[__C6__]', f: '[__/C6__]', t: '<span class="loop-condition">', d: 'loop and conditions'},

        /*dom-elements*/
        D1: {i: '[__D1__]', f: '[__/D1__]', t: '<span class="dom-elements">', d: 'dom-elements'},

        /*function*/
        F1: {i: '[__F1__]', f: '[__/F1__]', t: '<span class="function">', d: 'function'},
        /*function-name*/
        F2: {i: '[__F2__]', f: '[__/F2__]', t: '<span class="function-name">', d: 'function-name'},
        /*function in text*/
        F3: {i: '[__F3__]', f: '[__/F3__]', t: '<span class="function-in-text">', d: 'function in text'},
        /*function-name in text*/
        F4: {i: '[__F4__]', f: '[__/F4__]', t: '<span class="function-name-in-text">', d: 'function-name in text'},
        /*function-name in advanced*/
        F5: {
            i: '[__F5__][[[',
            f: ']]][__/F5__]',
            t: '<span class="function-name">',
            d: 'function-name in advanced'
        },

        /*links*/
        L1: {i: '[__L1__]', f: '[__/L1__]', t: '<span class="links">', d: 'links'},
        //two points for url links
        L2: {i: '[__/:/__]', f: '[__/:/__]', t: '', d: 'two points for url links'},
        //two points for url links
        L3: {i: '[__/./__]', f: '[__/./__]', t: '', d: 'point for url links'},

        /*methods of class*/
        M1: {i: '[__M1__]', f: '[__/M1__]', t: '<span class="set-get-methods">', d: 'methods of class'},

        /*number*/
        N1: {i: '[__N1__]', f: '[__/N1__]', t: '<span class="number">', d: 'number'},
        /*number float or long*/
        N2: {i: '[__N2__]', f: '[__/N2__]', t: '<span class="number">', d: 'long or float number'},
        /*separator to float number*/
        N3: {i: '[__[.]__]', f: '[__[.]__]', t: '', d: 'separator to float number'},

        /*object-attributes*/
        O1: {i: '[__O1__]', f: '[__/O1__]', t: '<span class="object-attribute">', d: 'object-attributes'},

        /*params and args*/
        P1: {i: '[__P1__]', f: '[__/P1__]', t: '<span class="param">', d: 'params and args'},

        /*properties*/
        P2: {i: '[__P2__]', f: '[__/P2__]', t: '<span class="property">', d: 'properties of object'},

        /*return*/
        R1: {i: '[__R1__]', f: '[__/R1__]', t: '<span class="return">', d: 'return'},

        /*strings "aaa"*/
        S1: {i: '[__S1__]', f: '[__/S1__]', t: '<span class="string">', d: 'strings "aaa"'},
        /*strings 'aaa'*/
        S2: {i: '[__S2__]', f: '[__/S2__]', t: '<span class="string">', d: 'strings \'aaa\''},
        /* ["] */
        S3: {i: '[[[!!]]]', f: '[[/[!!]/]]', t: '', d: 'the character ["]'},
        /* ['] */
        S4: {i: '[[[!]]]', f: '[[/[!]/]]', t: '', d: "the character [']"},

        /*variables declare*/
        V1: {i: '[__V1__]', f: '[__/V1__]', t: '<span class="variable-declare">', d: 'variables declare'},
        /*variables name*/
        V2: {i: '[__V2__]', f: '[__/V2__]', t: '<span class="variables">', d: 'variables and this'},
        /*value to properties of object*/
        V3: {i: '[__V3__]', f: '[__/V3__]', t: '<span class="value">', d: 'value to properties of object'},

        /*Others*/
        _E: {i: '[__{{ER}}__]', f: '[__{{/ER}}__]', t: '<span class="syntax-error">', d: 'syntax-error'},
        _T: {i: '', f: '', t: '<span class="test">', d: 'for test and development'},
        _X: {i: '', f: '', t: '</span>', d: 'close span'},

    };

    /***
     * Code Format and Filters
     * */

    function _codeMapper(c, l, s) {
        if (l === 'html') {
            return _codeMapper_HTML(c);
        } else if (l === 'css') {
            return _codeMapper_CSS(c);
        } else if (l === 'javascript') {
            return _codeMapper_JAVASCRIPT(c, s);
        } else if (l === 'php') {
            return _codeMapper_PHP(c);
        } else if (l === 'sql') {
            return _codeMapper_SQL(c);
        } else if (l === 'python') {
            return _codeMapper_PYTHON(c);
        } else if (l === 'java') {
            return _codeMapper_JAVA(c);
        }
    }

    function _codeStyler(c, l, s) {
        if (l === 'html') {
            return _codeMapper_HTML(c);
        } else if (l === 'css') {
            return _codeMapper_CSS(c);
        } else if (l === 'javascript') {
            return _codeStyler_JAVASCRIPT(c, s);
        } else if (l === 'php') {
            return _codeMapper_PHP(c);
        } else if (l === 'sql') {
            return _codeMapper_SQL(c);
        } else if (l === 'python') {
            return _codeMapper_PYTHON(c);
        } else if (l === 'java') {
            return _codeMapper_JAVA(c);
        }
    }

    function _codeMapper_HTML(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+"),/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+'),/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeMapper_CSS(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Aliases
            .replace(/\$/gi, '<span class="alias">$</span>')
            .replace(/\$J/gi, '<span class="alias">$J</span>')
            .replace(/jH/, '<span class="alias">jH</span>')
            .replace(/jQuery/gi, '<span class="alias">jQuery</span>')
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeMapper_JAVASCRIPT(code, syntax) {

        let swap = '';

        /*Comment in block*/
        if (code.search(/\/\*(.*)\*\//gi) !== -1) { //Start/End comment in block
            code = (code).replace(/\/\*(.*)\*\//gi, cl.C4.i + '$1' + cl.C4.f);
            codeCtrlC = 0;
        } else if (code.search(/\/\*/gi) !== -1) { //Start comment in block
            code = (code).replace(/\/\*/gi, cl.C4.i);
            codeCtrlC = 1;
        } else if (code.search(/(\*\/)/gi) !== -1) { //End Comment in block
            code = (code).replace(/(\*\/)/gi, cl.C4.f);
            codeCtrlC = 0;
        }

        if (codeCtrlC === 1) {//Control comment in block
            return code + "\n";
        }

        /*Strings*/
        code = (code)
            .replace(/("[0-9a-zA-Z\[\]\\.,'()+\-=\/$?|!@#%&_*:;{}^ ]+")/gi, cl.S1.i + '$1' + cl.S1.f)
            .replace(/('[0-9a-zA-Z\[\]\\.,"()+\-=\/$?|!@#%&_*:;{}^ ]+')/gi, cl.S2.i + '$1' + cl.S2.f);

        /*Links*/
        code = (code)
            .replace(/(\[__S[12]__])"(http[s]?)(:\/\/)([0-9a-zA-Z/ _.?#=-]+)"(\[__\/S[12]__])/gi, cl.L1.i + '$2' + cl.L2.i + '$4' + cl.L1.f);

        /*Comments inline*/
        code = (code).replace(/\/\/(.*)+/g, cl.C5.i + '$1' + cl.C5.f);

        /*Class/ClassName declare*/
        code = (code).replace(/(class)\s([a-zA-Z_]+[0-9]*)\s?{/g, cl.C1.i + '$1' + cl.C1.f + ' ' + cl.C3.i + '$2' + cl.C3.f + ' {');

        /*Constructor declare*/
        code = (code).replace(/(constructor)/g, cl.C2.i + '$1' + cl.C2.f);

        /*Conditions and Loop*/
        code = (code)
            .replace(/(if|switch|while|for)( ?\( ?)/g, cl.C6.i + '$1' + cl.C6.f + '$2')
            .replace(/(}?)(\s?)(else)(?=([ {]))(\s?)({?)/g, '$1$2' + cl.C6.i + '$3' + cl.C6.f + '$4$5');

        /*Methods of class*/
        code = (code).replace(/(set|get)\s([a-zA-Z_]+[0-9]*)\s?(\()/g, cl.M1.i + '$1' + cl.M1.f + ' $2(');

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/(function)(?=( ?\()| [0-9a-zA-Z_]+ ?\()/g, cl.F1.i + '$1' + cl.F1.f);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/(\.|\s?\+\s?|\)\.)?([a-zA-Z_]+[0-9]*)(\()/g, '$1{/::::/$2/::::/}$3')
            .replace(/(\[__\/[A-Z][0-9]+__]\))(\.)(\[__F2__])([a-zA-Z_]+[0-9]*)(\[__\/F2__])(\(\[__[A-Z][0-9]+__])/g, '$1$2' + cl.F5.i + '$4' + cl.F5.f + '$6');

        /*Variable declare*/
        code = (code).replace(/(var |let |const |this\.?)/g, cl.V1.i + '$1' + cl.V1.f);

        /*Variable name*/
        code = (code)
            .replace(/(\[__V1__])(var |let |const |this\.?)(\[__\/V1__])([a-zA-Z_]+[0-9]*)( ?;| ?= ?)/g, '$1$2$3' + cl.V2.i + '$4' + cl.V2.f + '$5')
            .replace(/(\[__V2__][a-zA-Z_]+[0-9]+\[__\/V2__] ?= ?)([a-zA-Z_]+[0-9]*);/g, '$1' + cl.V2.i + '$2' + cl.V2.f + ';')
            .replace(/(\( ?| ?= ?)([a-zA-Z_]+[0-9]*)( ?[<=>+\-/*]+ ?| ?!==)/g, '$1' + cl.V2.i + '$2' + cl.V2.f + '$3');

        /*Return*/
        code = (code).replace(/(return)(?=( ?;| .*;))/g, cl.R1.i + '$1' + cl.R1.f);

        /*DOM elements*/
        code = (code)
            .replace(/(console|document|window)\./g, cl.D1.i + '$1' + cl.D1.f + '.')
            .replace(/(\(\s?)(document|window)(\s?\))/g, '$1' + cl.D1.i + '$2' + cl.D1.f + '$3');

        /*Boolean*/
        code = (code)
            .replace(/,\s?(true|false)\s?\)/g, ', ' + cl.B1.i + '$1' + cl.B1.f + ')')
            .replace(/:\s?(true|false)\s?}/g, ': ' + cl.B1.i + '$1' + cl.B1.f + '}')
            .replace(/(\[__R1__]return\[__\/R1__] )(true|false)\s?;/g, '$1' + cl.B1.i + '$2' + cl.B1.f + ';');

        /*Values (part1)*/
        code = (code)
            .replace(/(:\s?)([0-9a-zA-Z_]+)(\s?,?)/g, '$1' + cl.V3.i + '$2' + cl.V3.f + '$3');

        /*Float Number*/
        if ((code).search(/(.*)?([0-9]+\.[0-9]+)+(\.[0-9]{2})?(.*)?/g) !== -1) {
            let _tmp = code;
            swap = (code).match(/(.*)?([0-9]+\.[0-9]+)+(\.[0-9]{2})?(.*)?/g);
            swap = swap.join('').replace(/([0-9]+)(\.)/g, '$1' + cl.N3.i);
            _tmp = _tmp.split(/(.*)?([0-9]+\.[0-9]+)+(\.[0-9]{2})?(.*)?/g).join('');
            code = code.replace(_tmp, swap);
        }

        /*Number*/
        code = code + "\n";
        code = (code)
            .replace(/([0-9]+)(?=( ?\+ ?[0-9]| ?- ?[0-9]| ?\/ ?[0-9]| ?\* ?[0-9]|\.|;|,| ?\) ?|]| ?>|\n))/g, cl.N1.i + '$1' + cl.N1.f)
            .replace(/([0-9]+)(\[__\[\.]__])(?=((\[__N1__])?[0-9]+))/g, cl.N1.i + '$1' + cl.N1.f + '$2');
        code = (code).replace(/\n/g, '');

        /*Object Attributes*/
        code = (code)
            .replace(/\.([0-9a-zA-Z_]+)(?=([;]|[.]|\s?[=]\s?))/gi, '.' + cl.O1.i + '$1' + cl.O1.f);

        /*Properties*/
        code = (code)
            .replace(/([0-9a-zA-Z_]+)(\s?:\s?)/g, cl.P2.i + '$1' + cl.P2.f + '$2');

        /*Arguments and parameters*/
        code = (code)
            .replace(/(?!.*("|\[__[A-Z][0-9]+__]))(\(|\+ ?|, ?| )([a-zA-Z_$]+[0-9]*)(\)|,?| )(?!.*("|\[__\/[A-Z][0-9]+__]))/g, '$2' + cl.P1.i + '$3' + cl.P1.f + '$4');

        /*Aliases*/
        code = (code)
            .replace(/(\${2}|\$|\$J|jH|jQuery)([.]|[(])/g, cl.A1.i + '$1' + cl.A1.f + '$2');

        /*Object Attributes*/
        code = (code)
            .replace(/\.([0-9a-zA-Z_]+)(?=([;]|[.]|\s?[=]\s?))/g, '.' + cl.O1.i + '$1' + cl.O1.f);

        /*Properties*/
        code = (code)
            .replace(/([0-9a-zA-Z_]+)(\s?:\s?)/g, cl.P2.i + '$1' + cl.P2.f + '$2');

        /*Values*/
        code = (code)
            .replace(/:\s?([0-9]+),?/g, ': ' + cl.V3.i + '$1' + cl.V3.f + ',')
            .replace(/:\s?([0-9a-zA-Z_\-]+)(,)?/g, ': ' + cl.V3.i + '$1' + cl.V3.f + '$2')
            .replace(/:\s?'([0-9a-zA-Z_\- .#%$]+)'/g, ": " + cl.V3.i + "'$1'" + cl.V3.f)
            .replace(/:\s?"([0-9a-zA-Z_\- .#%$]+)"/g, ': ' + cl.V3.i + '"$1"' + cl.V3.f);

        /***
         * Final adjusts
         * */

        /*Comments adjust and clear*/
        if (code.search(/(\[__C[45]__])(.*)(\[__S1__])(.*)(\[__\/S1__])(.*)(\[__\/C[45]__])/g) !== -1) {
            /*Clear comment in block*/
            swap = code.match(/(\[__C[45]__])(.*)(\[__S1__])(.*)(\[__\/S1__])(.*)(\[__\/C[45]__])/g)[0];
            swap = swap.replace(/(\[__[\/]?S1__])/g, '');
            code = code.replace(/(\[__C[45]__].*\[__S1__].*\[__\/S1__].*\[__\/C[45]__])/g, swap);
        } else if (code.search(/\/\/(.*)(\[__S2__])(.*)(\[__\/S2__])(.*)/g) !== -1) {
            /*Clear comment inline*/
            swap = code.match(/\/\/(.*)(\[__S2__])(.*)(\[__\/S2__])(.*)/g)[0];
            swap = swap.replace(/(\[__[\/]?S1__])/g, '');
            code = code.replace(/\/\/(.*\[__S2__].*\[__\/S2__].*)/g, swap);
        }

        if (code.search(/(\[__C[45]__])(.*)(\[__[A-BD-Z][0-9]+__])(.*)(\[__\/[A-BD-Z][0-9]+__])(.*)(\[__\/C[45]__])/g) !== -1) {
            swap = code.match(/(\[__C[45]__])(.*)(\[__[A-BD-Z][0-9]+__])(.*)(\[__\/[A-BD-Z][0-9]+__])(.*)(\[__\/C[45]__])/g)[0];
            swap = swap.replace(/(\[__[\/]?[A-BD-Z][0-9]+__])/g, '');
            code = code.replace(/(\[__C[45]__])(.*)(\[__[A-BD-Z][0-9]+__])(.*)(\[__\/[A-BD-Z][0-9]+__])(.*)(\[__\/C[45]__])/g, swap);
        }

        /*String adjust and clear*/
        if (code.search(/(\[__S1__])"(.*)"(\[__\/S1__])/g) !== -1) {
            /*Clear string S1 removing S2*/
            swap = code.match(/(\[__S1__])"(.*)"(\[__\/S1__])/g)[0];
            swap = swap
                /*Protect the function name before string clear*/
                .replace(/(\[__)(\/?)(F5__])/g, '{{{$2F_5}}}')
                /*Protect the object properties before string clear*/
                .replace(/(\[__)(\/?)(P2__])/g, '{{{$2P_2}}}')
                /*Clear string*/
                .replace(/\[__[\/]?[A-RT-Z][0-9]+__]/g, '')
                .replace(/\[__S1__]"/g, cl.S3.i)
                .replace(/"\[__\/S1__]/g, cl.S3.f)
                .replace(/\[__S2__]'/g, "'")
                .replace(/'\[__\/S2__]/g, "'")
                /*Reset clear*/
                .replace(/([{]{3})(\/?)(F_5}}})/g, '[__$2F5__]')
                .replace(/([{]{3})(\/?)(P_2}}})/g, '[__$2P2__]');
            code = code.replace(/(\[__S1__])"(.*)"(\[__\/S1__])/g, swap);
        }

        //Clear trash
        if (code.search(/(\[\[\[!!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!!]\/]])(?=(["+ ]+))/g) !== -1) {
            swap = code.match(/(\[\[\[!!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!!]\/]])(?=(["+ ]+))/g)[0];
            swap = swap.replace(/\[__[\/]?[A-Z][0-9]+__]/g, '');
            code = code.replace(/(\[\[\[!!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!!]\/]])(?=(["+ ]+))/g, swap);
        }

        if (code.search(/(\[\[\[!!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!!]\/]])(?=(\)|;|\.|,\s?\[\[\[!!]]]))/g) !== -1) {
            swap = code.match(/(\[\[\[!!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!!]\/]])(?=(\)|;|\.|,\s?\[\[\[!!]]]))/g)[0];
            swap = swap.replace(/{\/::::\//g, '');
            swap = swap.replace(/\/::::\/}/g, '');
            code = code.replace(/(\[\[\[!!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!!]\/]])(?=(\)|;|\.|,\s?\[\[\[!!]]]))/g, swap);
        }

        if (code.search(/(\[__S2__])'(.*)'(\[__\/S2__])/g) !== -1) {
            /*Clear string S2 removing S1*/
            swap = code.match(/(\[__S2__])'(.*)'(\[__\/S2__])/g)[0];
            swap = swap
                /*Protect the function name before string clear*/
                .replace(/(\[__)(\/?)(F5__])/g, '{{{$2F_5}}}')
                /*Protect the object properties before string clear*/
                .replace(/(\[__)(\/?)(P2__])/g, '{{{$2P_2}}}')
                /*Clear string*/
                .replace(/\[__[\/]?[A-RT-Z][0-9]+__]/g, '')
                .replace(/\[__S2__]'/g, cl.S4.i)
                .replace(/'\[__\/S2__]/g, cl.S4.f)
                .replace(/\[__S1__]/g, '"')
                .replace(/\[__\/S1__]/g, '"')
                /*Reset clear*/
                .replace(/([{]{3})(\/?)(F_5}}})/g, '[__$2F5__]')
                .replace(/([{]{3})(\/?)(P_2}}})/g, '[__$2P2__]');
            code = code.replace(/(\[__S2__])'(.*)'(\[__\/S2__])/g, swap);
        }

        //Clear trash
        if (code.search(/(\[\[\[!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!]\/]])(?=(["+ ]+))/g) !== -1) {
            swap = code.match(/(\[\[\[!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!]\/]])(?=(["+ ]+))/g)[0];
            swap = swap.replace(/\[__[\/]?[A-Z][0-9]+__]/g, '');
            code = code.replace(/(\[\[\[!]]].*\[__[\/]?[A-Z][0-9]+__].*\[\[\/\[!]\/]])(?=(["+ ]+))/g, swap);
        }

        if (code.search(/(\[\[\[!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!]\/]])(?=(\)|;|\.|,\s?\[\[\[!]]]))/g) !== -1) {
            swap = code.match(/(\[\[\[!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!]\/]])(?=(\)|;|\.|,\s?\[\[\[!]]]))/g)[0];
            swap = swap.replace(/{\/::::\//g, '');
            swap = swap.replace(/\/::::\/}/g, '');
            code = code.replace(/(\[\[\[!]]].*{\/::::\/.*\/::::\/}.*\[\[\/\[!]\/]])(?=(\)|;|\.|,\s?\[\[\[!]]]))/g, swap);
        }

        /*Links adjusts*/
        if (code.search(/(\[__L1__]http[s]?\[__\/:\/__])(.*)(?=(\.))(.*\[__\/L1__])/g) !== -1) {
            swap = code.match(/(\[__L1__]http[s]?\[__\/:\/__])(.*)(?=(\.))(.*\[__\/L1__])/g)[0];
            swap = swap
                .replace(/\[__([\/]?)L1__](http[s]?\[__\/:\/__])?/g, '')
                .replace(/\./g, cl.L3.i)
                .replace(/\[__([\/]?)O1__]/g, '');
            code = code.replace(/(\[__L1__]http[s]?\[__\/:\/__])(.*)(.*\[__\/L1__])/, '$1' + swap + '$3');
        }

        /*Function declare adjusts*/
        if (code.search(/(\[__C[45]__])(.*)(\[__F1__])(function)(\[__\/F1__])(.*)(\[__\/C[45]__])/g) !== -1) {
            swap = code.match(/(\[__C[45]__])(.*)(\[__F1__])(function)(\[__\/F1__])(.*)(\[__\/C[45]__])/g)[0];
            swap = swap.replace(/\[__([\/]?)F1__]/g, '');
            code = code.replace(/(\[__C[45]__])(.*)(\[__F1__])(function)(\[__\/F1__])(.*)(\[__\/C[45]__])/g, swap);
        }

        /*Function name in text*/
        if (code.search(/(\[__C[45]__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/C[45]__])/g) !== -1) {
            swap = code.match(/(\[__C[45]__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/C[45]__])/g)[0];
            swap = swap.replace(/\[__([\/]?)F2__]/g, '');
            code = code.replace(/(\[__C[45]__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/C[45]__])/g, swap);
        } else if (code.search(/(\[__S1__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/S1__])/g) !== -1) {
            swap = code.match(/(\[__S1__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/S1__])/g)[0];
            swap = swap.replace(/\[__([\/]?)F2__]/g, '');
            code = code.replace(/(\[__S1__])(.*)(\[__F2__])([0-9a-zA-Z_]+)(\[__\/F2__])(.*)(\[__\/S1__])/g, swap);
        }

        /*Number clear*/
        if (code.search(/([a-zA-Z\\"')|@#&_;}]+\[__N1__][0-9]+\[__\/N1__])|([\\"')|@#&_;}]+ ?)([+/*-><!=]? ?)(\[__N1__])([0-9]+)(\[__\/N1__])/g) !== -1) {
            swap = code.match(/([a-zA-Z\\"')|@#&_;}]+\[__N1__][0-9]+\[__\/N1__])|([\\"')|@#&_;}]+ ?)([+/!*-><=]? ?)(\[__N1__])([0-9]+)(\[__\/N1__])/g)[0];
            swap = swap.replace(/\[__([\/]?)N1__]/g, '');
            code = code.replace(/([a-zA-Z\\"')|@#&_;}]+\[__N1__][0-9]+\[__\/N1__])|([\\"')|@#&_;}]+ ?)([+/!*-><=]? ?)(\[__N1__])([0-9]+)(\[__\/N1__])/g, swap);
        }

        /*Check Syntax Error*/
        if (syntax) {

            if (code.search(/(;)(\s?)(\[__[A-BD-Z][0-9]+__])([0-9a-zA-Z_+*>=<\-\/'" ]+)(\[__\/[A-BD-Z][0-9]__]+)$/g) !== -1) {
                code = code.replace(/(;)(\s?)(\[__[A-BD-Z][0-9]+__])([0-9a-zA-Z_+*>=<\-\/'" ]+)(\[__\/[A-BD-Z][0-9]__]+)$/g, '$1$2' + cl._E.i + '$4 << Syntax Error: 1' + cl._E.f);
            }

            if (code.search(/^(?!(\/\/|\/\*))(;? ?)([0-9a-zA-Z_+*>=<\-\/'"]+[\s]*)+(?!(;{\())$/g) !== -1) {
                code = code.replace(/^(?!(\/\/|\/\*))(;? ?)([0-9a-zA-Z_+*>=<\-\/'"]+[\s]*)+(?!(;{\())$/g, cl._E.i + '$1$2$3$4 << Syntax Error: 2' + cl._E.f);
            }

            if (code.search(/^(\[\[\[[!]{1,2}]]]|'|")(.*)(\[\[\/\[[!]{1,2}]\/]]|'|")$/g) !== -1) {
                code = code.replace(/^(\[\[\[[!]{1,2}]]]|'|")(.*)(\[\[\/\[[!]{1,2}]\/]]|'"|)$/g, cl._E.i + '$1$2$3 << Syntax Error: 3' + cl._E.f);
            }

            if (code.search(/^(\[__{{ER}}__]\[\[\[[!]{1,2}]]].*\[\[\/\[[!]{1,2}]\/]] << Syntax Error: [0-9]+\[__{{\/ER}}__])$/g) !== -1) {
                code = code
                    .replace(/\[\[\[[!]{1,2}]]]/g, '')
                    .replace(/\[\[\/\[[!]{1,2}]\/]]/g, '');
            }
        }

        return code + "\n";
    }

    function _codeStyler_JAVASCRIPT(code, syntax) {

        /*Comment in block control*/
        if (code.search(/\[__C4__](.*)\[__\/C4__]/g) !== -1) {
            /*Start/End comment in block*/
            code = (code).replace(/(\[__C4__])(.*)(\[__\/C4__])/g, cl.C4.t + '/*$2*/' + cl._X.t);
            codeCtrlC = 0;
        } else if (code.search(/\[__C4__]/g) !== -1) {
            /*Start comment in block*/
            code = (code).replace(/\[__C4__]/g, '/*');
            codeCtrlC = 1;
        } else if (code.search(/\[__\/C4__]/g) !== -1) {
            /*End Comment in block*/
            code = (code).replace(/(.*)?\[__\/C4__]/g, cl.C4.t + '$1*/' + cl._X.t);
            codeCtrlC = 0;
        }

        /*Control comment in block*/
        if (codeCtrlC === 1) {
            return cl.C4.t + code + cl._X.t + "\n";
        }

        if (syntax) {
            /*Syntax Error*/
            code = (code)
                .replace(/\[__{{ER}}__]([0-9a-zA-Z_:+*>=<\-\/'" ]+)/g, cl._E.t + '$1')
                .replace(/\[__{{\/ER}}__]/g, cl._X.t);
        }

        /*Strings*/
        code = (code)
            .replace(/\[\[\[!!]]]/g, cl.S1.t + '"')
            .replace(/\[\[\/\[!!]\/]]/g, '"' + cl._X.t)
            .replace(/\[\[\[!]]]/g, cl.S2.t + "'")
            .replace(/\[\[\/\[!]\/]]/g, "'" + cl._X.t);

        /*Links*/
        code = (code)
            .replace(/\[__\/:\/__]/g, '://')
            .replace(/\[__\/\.\/__]/g, '.')
            .replace(/\[__L1__]/g, cl.L1.t + '"')
            .replace(/\[__\/L1__]/g, '"' + cl._X.t);

        /*Comments inline*/
        code = (code)
            .replace(/\[__C5__]/g, cl.C5.t + '//')
            .replace(/\[__\/C5__]/g, cl._X.t);

        /*Class/ClassName declare*/
        code = (code)
            .replace(/\[__C1__]class\[__\/C1__]/g, cl.C1.t + 'class' + cl._X.t)
            .replace(/\[__C3__]([0-9a-zA-Z_]+)\[__\/C3__]\s?{/g, cl.C3.t + '$1' + cl._X.t + ' {');

        /*Constructor declare*/
        code = (code).replace(/\[__C2__]constructor\[__\/C2__]/g, cl.C2.t + 'constructor' + cl._X.t);

        /*Conditions and Loop*/
        code = (code)
            .replace(/\[__C6__]([a-zA-Z]+)/g, cl.C6.t + '$1')
            .replace(/\[__\/C6__]/g, cl._X.t);

        /*Methods of class*/
        code = (code).replace(/\[__M1__](set|get)\[__\/M1__]/g, cl.M1.t + '$1' + cl._X.t);

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/\[__F1__]function\[__\/F1__]/g, cl.F1.t + 'function' + cl._X.t);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/({\/::::\/)([0-9a-zA-Z_])/g, cl.F2.t + '$2')
            .replace(/(\/::::\/})/g, cl._X.t)
            .replace(/\[__F2__]([0-9a-zA-Z_]+)/g, cl.F2.t + '$1')
            .replace(/\[__\/F2__]/g, cl._X.t)
            .replace(/\[__F5__]\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]\[__\/F5__]/g, cl._X.t)
            .replace(/\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]/g, cl._X.t);

        /*Variable declare*/
        code = (code)
            .replace(/\[__V1__](var |let |const |this\.?)/g, cl.V1.t + '$1')
            .replace(/\[__\/V1__]/g, cl._X.t);

        /*Variable name*/
        code = (code)
            .replace(/\[__V2__]([a-zA-Z_0-9]+)/g, cl.V2.t + '$1')
            .replace(/\[__\/V2__]/g, cl._X.t);

        /*Return*/
        code = (code).replace(/\[__R1__]return\[__\/R1__]/g, cl.R1.t + 'return' + cl._X.t);

        /*DOM elements*/
        code = (code)
            .replace(/\[__D1__]([a-zA-Z]+)/g, cl.D1.t + '$1')
            .replace(/\[__\/D1__]/g, cl._X.t);

        /*Boolean*/
        code = (code)
            .replace(/\[__B1__](true|false)/g, cl.B1.t + '$1')
            .replace(/\[__\/B1__]/g, cl._X.t);

        /*Arguments and parameters*/
        code = (code)
            .replace(/\[__P1__]([0-9a-zA-Z_$]+)/g, cl.P1.t + '$1')
            .replace(/\[__\/P1__]/g, cl._X.t);

        /*Float Number*/
        code = (code)
            .replace(/\[__\[\.]__]([0-9]+|\[__N1__][0-9]+)/g, '.$1');

        /*Number*/
        code = (code)
            .replace(/\[__N1__]([0-9]+)/g, cl.N1.t + '$1')
            .replace(/\[__\/N1__]/g, cl._X.t);

        /*Aliases*/
        code = (code)
            .replace(/\[__A1__]([0-9a-zA-Z_$]+)/g, cl.A1.t + '$1')
            .replace(/\[__\/A1__]/g, cl._X.t);

        /*Object Attributes*/
        code = (code)
            .replace(/\[__O1__]([0-9a-zA-Z_]+)/g, cl.O1.t + '$1')
            .replace(/\[__\/O1__]/g, cl._X.t);

        /*Properties*/
        code = (code)
            .replace(/\[__P2__]([0-9a-zA-Z_]+)/g, cl.P2.t + '$1')
            .replace(/\[__\/P2__]/g, cl._X.t);

        /*Values*/
        code = (code)
            .replace(/\[__V3__]([0-9a-zA-Z_]+)/g, cl.V3.t + '$1')
            .replace(/\[__\/V3__]/g, cl._X.t);

        return (code) + "\n";
    }

    function _codeMapper_PHP(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Function declare
            .replace(/function/gi, '<span class="function">function</span>')
            //Boolean
            .replace(/,\s?(true|false)\s?\)/gi, ',<span class="boolean"> $1</span>)')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Aliases
            /*.replace(/\$/gi, '<span class="alias">$</span>')
            .replace(/\$J/gi, '<span class="alias">$J</span>')
            .replace(/jH/, '<span class="alias">jH</span>')
            .replace(/jQuery/gi, '<span class="alias">jQuery</span>')*/
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeStyler_PHP(code, syntax) {

        /*Comment in block control*/
        if (code.search(/\[__C4__](.*)\[__\/C4__]/g) !== -1) {
            /*Start/End comment in block*/
            code = (code).replace(/(\[__C4__])(.*)(\[__\/C4__])/g, cl.C4.t + '/*$2*/' + cl._X.t);
            codeCtrlC = 0;
        } else if (code.search(/\[__C4__]/g) !== -1) {
            /*Start comment in block*/
            code = (code).replace(/\[__C4__]/g, '/*');
            codeCtrlC = 1;
        } else if (code.search(/\[__\/C4__]/g) !== -1) {
            /*End Comment in block*/
            code = (code).replace(/(.*)?\[__\/C4__]/g, cl.C4.t + '$1*/' + cl._X.t);
            codeCtrlC = 0;
        }

        /*Control comment in block*/
        if (codeCtrlC === 1) {
            return cl.C4.t + code + cl._X.t + "\n";
        }

        if (syntax) {
            /*Syntax Error*/
            code = (code)
                .replace(/\[__{{ER}}__]([0-9a-zA-Z_:+*>=<\-\/'" ]+)/g, cl._E.t + '$1')
                .replace(/\[__{{\/ER}}__]/g, cl._X.t);
        }

        /*Strings*/
        code = (code)
            .replace(/\[\[\[!!]]]/g, cl.S1.t + '"')
            .replace(/\[\[\/\[!!]\/]]/g, '"' + cl._X.t)
            .replace(/\[\[\[!]]]/g, cl.S2.t + "'")
            .replace(/\[\[\/\[!]\/]]/g, "'" + cl._X.t);

        /*Links*/
        code = (code)
            .replace(/\[__\/:\/__]/g, '://')
            .replace(/\[__\/\.\/__]/g, '.')
            .replace(/\[__L1__]/g, cl.L1.t + '"')
            .replace(/\[__\/L1__]/g, '"' + cl._X.t);

        /*Comments inline*/
        code = (code)
            .replace(/\[__C5__]/g, cl.C5.t + '//')
            .replace(/\[__\/C5__]/g, cl._X.t);

        /*Class/ClassName declare*/
        code = (code)
            .replace(/\[__C1__]class\[__\/C1__]/g, cl.C1.t + 'class' + cl._X.t)
            .replace(/\[__C3__]([0-9a-zA-Z_]+)\[__\/C3__]\s?{/g, cl.C3.t + '$1' + cl._X.t + ' {');

        /*Constructor declare*/
        code = (code).replace(/\[__C2__]constructor\[__\/C2__]/g, cl.C2.t + 'constructor' + cl._X.t);

        /*Conditions and Loop*/
        code = (code)
            .replace(/\[__C6__]([a-zA-Z]+)/g, cl.C6.t + '$1')
            .replace(/\[__\/C6__]/g, cl._X.t);

        /*Methods of class*/
        code = (code).replace(/\[__M1__](set|get)\[__\/M1__]/g, cl.M1.t + '$1' + cl._X.t);

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/\[__F1__]function\[__\/F1__]/g, cl.F1.t + 'function' + cl._X.t);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/({\/::::\/)([0-9a-zA-Z_])/g, cl.F2.t + '$2')
            .replace(/(\/::::\/})/g, cl._X.t)
            .replace(/\[__F2__]([0-9a-zA-Z_]+)/g, cl.F2.t + '$1')
            .replace(/\[__\/F2__]/g, cl._X.t)
            .replace(/\[__F5__]\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]\[__\/F5__]/g, cl._X.t)
            .replace(/\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]/g, cl._X.t);

        /*Variable declare*/
        code = (code)
            .replace(/\[__V1__](var |let |const |this\.?)/g, cl.V1.t + '$1')
            .replace(/\[__\/V1__]/g, cl._X.t);

        /*Variable name*/
        code = (code)
            .replace(/\[__V2__]([a-zA-Z_0-9]+)/g, cl.V2.t + '$1')
            .replace(/\[__\/V2__]/g, cl._X.t);

        /*Return*/
        code = (code).replace(/\[__R1__]return\[__\/R1__]/g, cl.R1.t + 'return' + cl._X.t);

        /*DOM elements*/
        code = (code)
            .replace(/\[__D1__]([a-zA-Z]+)/g, cl.D1.t + '$1')
            .replace(/\[__\/D1__]/g, cl._X.t);

        /*Boolean*/
        code = (code)
            .replace(/\[__B1__](true|false)/g, cl.B1.t + '$1')
            .replace(/\[__\/B1__]/g, cl._X.t);

        /*Arguments and parameters*/
        code = (code)
            .replace(/\[__P1__]([0-9a-zA-Z_$]+)/g, cl.P1.t + '$1')
            .replace(/\[__\/P1__]/g, cl._X.t);

        /*Float Number*/
        code = (code)
            .replace(/\[__\[\.]__]([0-9]+|\[__N1__][0-9]+)/g, '.$1');

        /*Number*/
        code = (code)
            .replace(/\[__N1__]([0-9]+)/g, cl.N1.t + '$1')
            .replace(/\[__\/N1__]/g, cl._X.t);

        /*Aliases*/
        code = (code)
            .replace(/\[__A1__]([0-9a-zA-Z_$]+)/g, cl.A1.t + '$1')
            .replace(/\[__\/A1__]/g, cl._X.t);

        /*Object Attributes*/
        code = (code)
            .replace(/\[__O1__]([0-9a-zA-Z_]+)/g, cl.O1.t + '$1')
            .replace(/\[__\/O1__]/g, cl._X.t);

        /*Properties*/
        code = (code)
            .replace(/\[__P2__]([0-9a-zA-Z_]+)/g, cl.P2.t + '$1')
            .replace(/\[__\/P2__]/g, cl._X.t);

        /*Values*/
        code = (code)
            .replace(/\[__V3__]([0-9a-zA-Z_]+)/g, cl.V3.t + '$1')
            .replace(/\[__\/V3__]/g, cl._X.t);

        return (code) + "\n";
    }

    function _codeMapper_SQL(c) {

        let code = (c) + "SQL";

        return code;
    }

    function _codeStyler_SQL(code, syntax) {

        /*Comment in block control*/
        if (code.search(/\[__C4__](.*)\[__\/C4__]/g) !== -1) {
            /*Start/End comment in block*/
            code = (code).replace(/(\[__C4__])(.*)(\[__\/C4__])/g, cl.C4.t + '/*$2*/' + cl._X.t);
            codeCtrlC = 0;
        } else if (code.search(/\[__C4__]/g) !== -1) {
            /*Start comment in block*/
            code = (code).replace(/\[__C4__]/g, '/*');
            codeCtrlC = 1;
        } else if (code.search(/\[__\/C4__]/g) !== -1) {
            /*End Comment in block*/
            code = (code).replace(/(.*)?\[__\/C4__]/g, cl.C4.t + '$1*/' + cl._X.t);
            codeCtrlC = 0;
        }

        /*Control comment in block*/
        if (codeCtrlC === 1) {
            return cl.C4.t + code + cl._X.t + "\n";
        }

        if (syntax) {
            /*Syntax Error*/
            code = (code)
                .replace(/\[__{{ER}}__]([0-9a-zA-Z_:+*>=<\-\/'" ]+)/g, cl._E.t + '$1')
                .replace(/\[__{{\/ER}}__]/g, cl._X.t);
        }

        /*Strings*/
        code = (code)
            .replace(/\[\[\[!!]]]/g, cl.S1.t + '"')
            .replace(/\[\[\/\[!!]\/]]/g, '"' + cl._X.t)
            .replace(/\[\[\[!]]]/g, cl.S2.t + "'")
            .replace(/\[\[\/\[!]\/]]/g, "'" + cl._X.t);

        /*Links*/
        code = (code)
            .replace(/\[__\/:\/__]/g, '://')
            .replace(/\[__\/\.\/__]/g, '.')
            .replace(/\[__L1__]/g, cl.L1.t + '"')
            .replace(/\[__\/L1__]/g, '"' + cl._X.t);

        /*Comments inline*/
        code = (code)
            .replace(/\[__C5__]/g, cl.C5.t + '//')
            .replace(/\[__\/C5__]/g, cl._X.t);

        /*Class/ClassName declare*/
        code = (code)
            .replace(/\[__C1__]class\[__\/C1__]/g, cl.C1.t + 'class' + cl._X.t)
            .replace(/\[__C3__]([0-9a-zA-Z_]+)\[__\/C3__]\s?{/g, cl.C3.t + '$1' + cl._X.t + ' {');

        /*Constructor declare*/
        code = (code).replace(/\[__C2__]constructor\[__\/C2__]/g, cl.C2.t + 'constructor' + cl._X.t);

        /*Conditions and Loop*/
        code = (code)
            .replace(/\[__C6__]([a-zA-Z]+)/g, cl.C6.t + '$1')
            .replace(/\[__\/C6__]/g, cl._X.t);

        /*Methods of class*/
        code = (code).replace(/\[__M1__](set|get)\[__\/M1__]/g, cl.M1.t + '$1' + cl._X.t);

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/\[__F1__]function\[__\/F1__]/g, cl.F1.t + 'function' + cl._X.t);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/({\/::::\/)([0-9a-zA-Z_])/g, cl.F2.t + '$2')
            .replace(/(\/::::\/})/g, cl._X.t)
            .replace(/\[__F2__]([0-9a-zA-Z_]+)/g, cl.F2.t + '$1')
            .replace(/\[__\/F2__]/g, cl._X.t)
            .replace(/\[__F5__]\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]\[__\/F5__]/g, cl._X.t)
            .replace(/\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]/g, cl._X.t);

        /*Variable declare*/
        code = (code)
            .replace(/\[__V1__](var |let |const |this\.?)/g, cl.V1.t + '$1')
            .replace(/\[__\/V1__]/g, cl._X.t);

        /*Variable name*/
        code = (code)
            .replace(/\[__V2__]([a-zA-Z_0-9]+)/g, cl.V2.t + '$1')
            .replace(/\[__\/V2__]/g, cl._X.t);

        /*Return*/
        code = (code).replace(/\[__R1__]return\[__\/R1__]/g, cl.R1.t + 'return' + cl._X.t);

        /*DOM elements*/
        code = (code)
            .replace(/\[__D1__]([a-zA-Z]+)/g, cl.D1.t + '$1')
            .replace(/\[__\/D1__]/g, cl._X.t);

        /*Boolean*/
        code = (code)
            .replace(/\[__B1__](true|false)/g, cl.B1.t + '$1')
            .replace(/\[__\/B1__]/g, cl._X.t);

        /*Arguments and parameters*/
        code = (code)
            .replace(/\[__P1__]([0-9a-zA-Z_$]+)/g, cl.P1.t + '$1')
            .replace(/\[__\/P1__]/g, cl._X.t);

        /*Float Number*/
        code = (code)
            .replace(/\[__\[\.]__]([0-9]+|\[__N1__][0-9]+)/g, '.$1');

        /*Number*/
        code = (code)
            .replace(/\[__N1__]([0-9]+)/g, cl.N1.t + '$1')
            .replace(/\[__\/N1__]/g, cl._X.t);

        /*Aliases*/
        code = (code)
            .replace(/\[__A1__]([0-9a-zA-Z_$]+)/g, cl.A1.t + '$1')
            .replace(/\[__\/A1__]/g, cl._X.t);

        /*Object Attributes*/
        code = (code)
            .replace(/\[__O1__]([0-9a-zA-Z_]+)/g, cl.O1.t + '$1')
            .replace(/\[__\/O1__]/g, cl._X.t);

        /*Properties*/
        code = (code)
            .replace(/\[__P2__]([0-9a-zA-Z_]+)/g, cl.P2.t + '$1')
            .replace(/\[__\/P2__]/g, cl._X.t);

        /*Values*/
        code = (code)
            .replace(/\[__V3__]([0-9a-zA-Z_]+)/g, cl.V3.t + '$1')
            .replace(/\[__\/V3__]/g, cl._X.t);

        return (code) + "\n";
    }

    function _codeMapper_PYTHON(c) {

        let code = (c) + "PY";

        return code;
    }

    function _codeStyler_PYTHON(code, syntax) {

        /*Comment in block control*/
        if (code.search(/\[__C4__](.*)\[__\/C4__]/g) !== -1) {
            /*Start/End comment in block*/
            code = (code).replace(/(\[__C4__])(.*)(\[__\/C4__])/g, cl.C4.t + '/*$2*/' + cl._X.t);
            codeCtrlC = 0;
        } else if (code.search(/\[__C4__]/g) !== -1) {
            /*Start comment in block*/
            code = (code).replace(/\[__C4__]/g, '/*');
            codeCtrlC = 1;
        } else if (code.search(/\[__\/C4__]/g) !== -1) {
            /*End Comment in block*/
            code = (code).replace(/(.*)?\[__\/C4__]/g, cl.C4.t + '$1*/' + cl._X.t);
            codeCtrlC = 0;
        }

        /*Control comment in block*/
        if (codeCtrlC === 1) {
            return cl.C4.t + code + cl._X.t + "\n";
        }

        if (syntax) {
            /*Syntax Error*/
            code = (code)
                .replace(/\[__{{ER}}__]([0-9a-zA-Z_:+*>=<\-\/'" ]+)/g, cl._E.t + '$1')
                .replace(/\[__{{\/ER}}__]/g, cl._X.t);
        }

        /*Strings*/
        code = (code)
            .replace(/\[\[\[!!]]]/g, cl.S1.t + '"')
            .replace(/\[\[\/\[!!]\/]]/g, '"' + cl._X.t)
            .replace(/\[\[\[!]]]/g, cl.S2.t + "'")
            .replace(/\[\[\/\[!]\/]]/g, "'" + cl._X.t);

        /*Links*/
        code = (code)
            .replace(/\[__\/:\/__]/g, '://')
            .replace(/\[__\/\.\/__]/g, '.')
            .replace(/\[__L1__]/g, cl.L1.t + '"')
            .replace(/\[__\/L1__]/g, '"' + cl._X.t);

        /*Comments inline*/
        code = (code)
            .replace(/\[__C5__]/g, cl.C5.t + '//')
            .replace(/\[__\/C5__]/g, cl._X.t);

        /*Class/ClassName declare*/
        code = (code)
            .replace(/\[__C1__]class\[__\/C1__]/g, cl.C1.t + 'class' + cl._X.t)
            .replace(/\[__C3__]([0-9a-zA-Z_]+)\[__\/C3__]\s?{/g, cl.C3.t + '$1' + cl._X.t + ' {');

        /*Constructor declare*/
        code = (code).replace(/\[__C2__]constructor\[__\/C2__]/g, cl.C2.t + 'constructor' + cl._X.t);

        /*Conditions and Loop*/
        code = (code)
            .replace(/\[__C6__]([a-zA-Z]+)/g, cl.C6.t + '$1')
            .replace(/\[__\/C6__]/g, cl._X.t);

        /*Methods of class*/
        code = (code).replace(/\[__M1__](set|get)\[__\/M1__]/g, cl.M1.t + '$1' + cl._X.t);

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/\[__F1__]function\[__\/F1__]/g, cl.F1.t + 'function' + cl._X.t);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/({\/::::\/)([0-9a-zA-Z_])/g, cl.F2.t + '$2')
            .replace(/(\/::::\/})/g, cl._X.t)
            .replace(/\[__F2__]([0-9a-zA-Z_]+)/g, cl.F2.t + '$1')
            .replace(/\[__\/F2__]/g, cl._X.t)
            .replace(/\[__F5__]\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]\[__\/F5__]/g, cl._X.t)
            .replace(/\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]/g, cl._X.t);

        /*Variable declare*/
        code = (code)
            .replace(/\[__V1__](var |let |const |this\.?)/g, cl.V1.t + '$1')
            .replace(/\[__\/V1__]/g, cl._X.t);

        /*Variable name*/
        code = (code)
            .replace(/\[__V2__]([a-zA-Z_0-9]+)/g, cl.V2.t + '$1')
            .replace(/\[__\/V2__]/g, cl._X.t);

        /*Return*/
        code = (code).replace(/\[__R1__]return\[__\/R1__]/g, cl.R1.t + 'return' + cl._X.t);

        /*DOM elements*/
        code = (code)
            .replace(/\[__D1__]([a-zA-Z]+)/g, cl.D1.t + '$1')
            .replace(/\[__\/D1__]/g, cl._X.t);

        /*Boolean*/
        code = (code)
            .replace(/\[__B1__](true|false)/g, cl.B1.t + '$1')
            .replace(/\[__\/B1__]/g, cl._X.t);

        /*Arguments and parameters*/
        code = (code)
            .replace(/\[__P1__]([0-9a-zA-Z_$]+)/g, cl.P1.t + '$1')
            .replace(/\[__\/P1__]/g, cl._X.t);

        /*Float Number*/
        code = (code)
            .replace(/\[__\[\.]__]([0-9]+|\[__N1__][0-9]+)/g, '.$1');

        /*Number*/
        code = (code)
            .replace(/\[__N1__]([0-9]+)/g, cl.N1.t + '$1')
            .replace(/\[__\/N1__]/g, cl._X.t);

        /*Aliases*/
        code = (code)
            .replace(/\[__A1__]([0-9a-zA-Z_$]+)/g, cl.A1.t + '$1')
            .replace(/\[__\/A1__]/g, cl._X.t);

        /*Object Attributes*/
        code = (code)
            .replace(/\[__O1__]([0-9a-zA-Z_]+)/g, cl.O1.t + '$1')
            .replace(/\[__\/O1__]/g, cl._X.t);

        /*Properties*/
        code = (code)
            .replace(/\[__P2__]([0-9a-zA-Z_]+)/g, cl.P2.t + '$1')
            .replace(/\[__\/P2__]/g, cl._X.t);

        /*Values*/
        code = (code)
            .replace(/\[__V3__]([0-9a-zA-Z_]+)/g, cl.V3.t + '$1')
            .replace(/\[__\/V3__]/g, cl._X.t);

        return (code) + "\n";
    }

    function _codeMapper_JAVA(c) {

        let code = (c);

        return code;
    }

    function _codeStyler_JAVA(code, syntax) {

        /*Comment in block control*/
        if (code.search(/\[__C4__](.*)\[__\/C4__]/g) !== -1) {
            /*Start/End comment in block*/
            code = (code).replace(/(\[__C4__])(.*)(\[__\/C4__])/g, cl.C4.t + '/*$2*/' + cl._X.t);
            codeCtrlC = 0;
        } else if (code.search(/\[__C4__]/g) !== -1) {
            /*Start comment in block*/
            code = (code).replace(/\[__C4__]/g, '/*');
            codeCtrlC = 1;
        } else if (code.search(/\[__\/C4__]/g) !== -1) {
            /*End Comment in block*/
            code = (code).replace(/(.*)?\[__\/C4__]/g, cl.C4.t + '$1*/' + cl._X.t);
            codeCtrlC = 0;
        }

        /*Control comment in block*/
        if (codeCtrlC === 1) {
            return cl.C4.t + code + cl._X.t + "\n";
        }

        if (syntax) {
            /*Syntax Error*/
            code = (code)
                .replace(/\[__{{ER}}__]([0-9a-zA-Z_:+*>=<\-\/'" ]+)/g, cl._E.t + '$1')
                .replace(/\[__{{\/ER}}__]/g, cl._X.t);
        }

        /*Strings*/
        code = (code)
            .replace(/\[\[\[!!]]]/g, cl.S1.t + '"')
            .replace(/\[\[\/\[!!]\/]]/g, '"' + cl._X.t)
            .replace(/\[\[\[!]]]/g, cl.S2.t + "'")
            .replace(/\[\[\/\[!]\/]]/g, "'" + cl._X.t);

        /*Links*/
        code = (code)
            .replace(/\[__\/:\/__]/g, '://')
            .replace(/\[__\/\.\/__]/g, '.')
            .replace(/\[__L1__]/g, cl.L1.t + '"')
            .replace(/\[__\/L1__]/g, '"' + cl._X.t);

        /*Comments inline*/
        code = (code)
            .replace(/\[__C5__]/g, cl.C5.t + '//')
            .replace(/\[__\/C5__]/g, cl._X.t);

        /*Class/ClassName declare*/
        code = (code)
            .replace(/\[__C1__]class\[__\/C1__]/g, cl.C1.t + 'class' + cl._X.t)
            .replace(/\[__C3__]([0-9a-zA-Z_]+)\[__\/C3__]\s?{/g, cl.C3.t + '$1' + cl._X.t + ' {');

        /*Constructor declare*/
        code = (code).replace(/\[__C2__]constructor\[__\/C2__]/g, cl.C2.t + 'constructor' + cl._X.t);

        /*Conditions and Loop*/
        code = (code)
            .replace(/\[__C6__]([a-zA-Z]+)/g, cl.C6.t + '$1')
            .replace(/\[__\/C6__]/g, cl._X.t);

        /*Methods of class*/
        code = (code).replace(/\[__M1__](set|get)\[__\/M1__]/g, cl.M1.t + '$1' + cl._X.t);

        /*Function in text*/
        /*code = (code)
            .replace(/([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5');*/

        /*Function declare*/
        code = (code).replace(/\[__F1__]function\[__\/F1__]/g, cl.F1.t + 'function' + cl._X.t);

        /*Function name in text*/
        /*code = (code).replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')*/

        /*Function Name*/
        code = (code)
            .replace(/({\/::::\/)([0-9a-zA-Z_])/g, cl.F2.t + '$2')
            .replace(/(\/::::\/})/g, cl._X.t)
            .replace(/\[__F2__]([0-9a-zA-Z_]+)/g, cl.F2.t + '$1')
            .replace(/\[__\/F2__]/g, cl._X.t)
            .replace(/\[__F5__]\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]\[__\/F5__]/g, cl._X.t)
            .replace(/\[\[\[([0-9a-zA-Z_]+)/g, cl.F5.t + '$1')
            .replace(/]]]/g, cl._X.t);

        /*Variable declare*/
        code = (code)
            .replace(/\[__V1__](var |let |const |this\.?)/g, cl.V1.t + '$1')
            .replace(/\[__\/V1__]/g, cl._X.t);

        /*Variable name*/
        code = (code)
            .replace(/\[__V2__]([a-zA-Z_0-9]+)/g, cl.V2.t + '$1')
            .replace(/\[__\/V2__]/g, cl._X.t);

        /*Return*/
        code = (code).replace(/\[__R1__]return\[__\/R1__]/g, cl.R1.t + 'return' + cl._X.t);

        /*DOM elements*/
        code = (code)
            .replace(/\[__D1__]([a-zA-Z]+)/g, cl.D1.t + '$1')
            .replace(/\[__\/D1__]/g, cl._X.t);

        /*Boolean*/
        code = (code)
            .replace(/\[__B1__](true|false)/g, cl.B1.t + '$1')
            .replace(/\[__\/B1__]/g, cl._X.t);

        /*Arguments and parameters*/
        code = (code)
            .replace(/\[__P1__]([0-9a-zA-Z_$]+)/g, cl.P1.t + '$1')
            .replace(/\[__\/P1__]/g, cl._X.t);

        /*Float Number*/
        code = (code)
            .replace(/\[__\[\.]__]([0-9]+|\[__N1__][0-9]+)/g, '.$1');

        /*Number*/
        code = (code)
            .replace(/\[__N1__]([0-9]+)/g, cl.N1.t + '$1')
            .replace(/\[__\/N1__]/g, cl._X.t);

        /*Aliases*/
        code = (code)
            .replace(/\[__A1__]([0-9a-zA-Z_$]+)/g, cl.A1.t + '$1')
            .replace(/\[__\/A1__]/g, cl._X.t);

        /*Object Attributes*/
        code = (code)
            .replace(/\[__O1__]([0-9a-zA-Z_]+)/g, cl.O1.t + '$1')
            .replace(/\[__\/O1__]/g, cl._X.t);

        /*Properties*/
        code = (code)
            .replace(/\[__P2__]([0-9a-zA-Z_]+)/g, cl.P2.t + '$1')
            .replace(/\[__\/P2__]/g, cl._X.t);

        /*Values*/
        code = (code)
            .replace(/\[__V3__]([0-9a-zA-Z_]+)/g, cl.V3.t + '$1')
            .replace(/\[__\/V3__]/g, cl._X.t);

        return (code) + "\n";
    }

    jsHunter.prototype.codify = function (params) {

        try {
            let _sel = jsHunter.sel;
            let _arr = [];
            let _lan = (params.hasOwnProperty('lang')) ? params.lang : false;
            let _thm = (params.hasOwnProperty('theme')) ? params.theme : 'back-dark-code';
            let _mod = (params.hasOwnProperty('mode')) ? params.mode : 'automatic';
            let _num = (params.hasOwnProperty('number')) ? params.number : true;
            let _stx = (params.hasOwnProperty('syntax')) ? params.syntax : false;

            if (_mod !== 'mapper' && _mod !== 'styler' && _mod !== 'automatic') {
                console.error('[Error] Incorrect Mode for codify() !');
                return;
            }

            if (!_lan) {
                console.error('[Error] Missing Language for codify() !');
                return;
            }

            (_sel && (typeof _sel === "object" || Array.isArray(_sel))) ?

                (function() {

                    /**
                     * THEME APPLY
                     * */
                    jH(jsHunter.selector).addClass(_thm);

                    _sel.forEach(function (a, index, el) {

                        /**
                         * CODE MAPPER
                         * */

                        if (_mod === 'mapper' || _mod === 'automatic') {

                            //Original lines from codes: Array
                            _arr = (jH.fn.getData("text", _sel[index])).split("\n");

                            //Element reset
                            _sel[index].innerHTML = "";

                            //codeMapper: Line to line from codes
                            _arr.forEach(function (node, idx, e) {
                                //Data Append in element + Filters: Mapper
                                _sel[index].innerHTML += _codeMapper(_arr[idx], _lan, _stx);
                            });

                            if (_mod === 'mapper') {
                                return;
                            }
                        }

                        /**
                         * CODE STYLER
                         * */

                        if (_mod === 'styler' || _mod === 'automatic') {

                            //Mapped lines from codes: Array
                            _arr = (jH.fn.getData("text", _sel[index])).split("\n");

                            //Element reset
                            _sel[index].innerHTML = "";

                            //codeMapper: Line to line from codes
                            _arr.forEach(function (node, idx, e) {
                                //Data Append: Styler
                                if (_num === true || _num === 'true') {
                                    _sel[index].innerHTML += "<span class='line-number'>" + (idx + 1) + "</span>";
                                }
                                _sel[index].innerHTML += "<span class='line-code'>" + _codeStyler(_arr[idx], _lan, _stx) + "</span>";
                            });

                        }

                    })

                })() : (_sel) ?

                (function () {
                    console.log("Single: codify()", _sel);
                })() : jsHunter.fn.exception("codify() error " + _sel);

        } catch (err) {
            console.error(err);
        }
        return this;
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
