/*
*
* Project: jsHunter Icons For UI
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
     - INITIALIZER OF ICONS EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in icons extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /**[THEME]
     * @description Rater Plug, create a component to rating data information
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: File Handler Methods)
     * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
     */
    jsHunter.prototype.icons = function(params) {

        /**
         * Settings/Configurations by args
         */
        let icon = ($$.has('icon').in(params)) ? params.icon : "";
        let size = ($$.has('size').in(params)) ? params.size : "s-32";
        let color = ($$.has('color').in(params)) ? params.color : "#000000";
        let stroke = ($$.has('stroke').in(params)) ? params.stroke : "none";
        let data = ($$.has('data').in(params)) ? params.data : "";
        let id = ($$.has('id').in(params)) ? params.id : "";

        /**
         * General Adjust
         */
        (function adjustSize() {
            if (size.toLowerCase().search(/%$/) !== -1) {
                size = size.replace("s-", "");
            } else {
                size = size.replace("s-", "") + "px";
            }
        })();

        /**
         * Available Icons
         */
        let _icons_ = {
            _UNDEF_:  (function() {
                return '<svg version="1.1" baseProfile="tiny" id="_undef1_" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"\n' +
                    '\t xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"\n' +
                    '\t x="0px" y="0px" width="' + size + '" height="' + size + '" viewBox="0 0 42 42" xml:space="preserve">\n' +
                    '<path d="M29.582,8.683l-0.129,0.12L8.3,29.954c-0.249,0.249-0.428,0.478-0.547,0.688c-2.04-2.639-3.233-6-3.233-9.701\n' +
                    '\tc0-8.797,6.626-15.482,15.421-15.482C23.632,5.459,26.955,6.644,29.582,8.683z M10.937,33.704c0.189-0.117,0.388-0.287,0.606-0.507\n' +
                    '\tl21.151-21.151l0.041-0.04c1.74,2.518,2.746,5.602,2.746,8.994c0,8.785-6.696,15.541-15.481,15.541\n' +
                    '\tC16.568,36.541,13.454,35.506,10.937,33.704z M0.5,21c0,10.775,8.735,19.5,19.5,19.5c10.767,0,19.501-8.725,19.501-19.5\n' +
                    '\tc0-10.775-8.734-19.5-19.5-19.5C9.235,1.5,0.5,10.225,0.5,21z" style="fill:#D8D8D8;"/>\n' +
                    '</svg>';
            })(),
            star: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
                '     width="'+size+'" height="'+size+'" viewBox="0 0 510 510" xml:space="preserve">\n' +
                '<g>\n' +
                '    <g id="'+id+'_star_' +
                    '">\n' +
                '        <path data-content="'+data+'" d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l0,0l0,0l139.103,120.539L97.41,497.25L255,402.186l0,0\n' +
                '\t\t\tl157.59,95.039l-41.692-179.239L510" style="fill:'+color+';"/>\n' +
                '    </g>\n' +
                '</g>\n' +
                '</svg>';
            })(),
            half_star: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
                '     width="' + size + '" height="' + size + '" viewBox="0 0 510 510" xml:space="preserve">\n' +
                '<g>\n' +
                '    <g id="'+id+'_half_star_">\n' +
                '        <path data-content="'+data+'" d="M510,197.472l-183.37-15.734L255,12.75l-71.629,168.988L0,197.472l0,0l0,0l139.103,120.539L97.41,497.25L255,402.186l0,0\n' +
                '\t\t\tl157.59,95.039l-41.692-179.239L510,197.472z M255,354.348V117.172l43.605,102.918l111.689,9.588l-84.711,73.389l25.398,109.166\n' +
                '\t\t\tL255,354.348z" style="fill:'+color+';"/>\n' +
                '    </g>\n' +
                '</g>\n' +
                '</svg>';
            })(),
            eye: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 32 32" height="'+size+'" width="'+size+'"\n' +
                    '     xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xml:space="preserve">\n' +
                    '    <g id="'+id+'_eye_">\n' +
                    '        <rect fill="none" height="'+size+'" width="'+size+'" />\n' +
                    '    </g>\n' +
                    '    <g id="'+id+'_eye_1">\n' +
                    '        <circle cx="16" cy="16" r="6" style="fill:'+color+';" />\n' +
                    '        <path data-content="'+data+'" d="M16,6C6,6,0,15.938,0,15.938S6,26,16,26s16-10,16-10S26,6,16,6z M16,24c-8.75,\n' +
                    '        0-13.5-8-13.5-8S7.25,8,16,8s13.5,8,13.5,8   S24.75,24,16,24z" style="fill:'+color+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            confused: (function() {
                return '<svg viewBox="0 0 64 64" id="'+id+'" data-content="'+data+'"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <g id="'+id+'_confused_1" data-content="'+data+'">\n' +
                    '        <g id="'+id+'_confused_2" data-content="'+data+'">\n' +
                    '            <path id="'+id+'_confused_3" data-content="'+data+'" d="M44,2A17.94,17.94,0,0,0,30.89,7.7,24,24,0,0,0,25,7C14.35,7,5.92,14.16,4,24.84l-2,12a1,1,0,0,0,\n' +
                    '            .23.81A1,1,0,0,0,3,38H8V51a1,1,0,0,0,1,1H24v9a1,1,0,0,0,1,1H44a1,1,0,0,0,1-1V38A18,18,0,0,0,44,2ZM17,\n' +
                    '            47a1,1,0,0,1-1-1c0-2.61-3.76-3-6-3V41c7.22,0,8,3.5,8,5A1,1,0,0,1,17,47Zm2-16H12a1,1,0,0,1,0-2h7a1,\n' +
                    '            1,0,0,1,0,2Zm25,5A16,16,0,1,1,60,20,16,16,0,0,1,44,36Z"\n' +
                    '                  style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '            <path id="'+id+'_confused_4" data-content="'+data+'" d="M44,7.07a8,8,0,0,0-9,7.8,1,1,0,0,0,1,1h4.68a1,1,0,0,0,1-1,1.34,1.34,0,0,1,2.67,\n' +
                    '            0c0,.47-.25.82-1,1.34-2.18,1.91-2.72,5-2.54,7.77a1,1,0,0,0,1,1h4.68a1,1,0,0,0,1-1V22A1.3,\n' +
                    '            1.3,0,0,1,48,21C53.57,16.75,50.85,7.81,44,7.07Z"\n' +
                    '                  style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '            <circle id="'+id+'_confused_5" data-content="'+data+'" cx="44" cy="30" r="3.5" style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '        </g>\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            like: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 32 32"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <g id="'+id+'_like_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_like_1" data-content="'+data+'" d="M29.845,17.099l-2.489,8.725C26.989,27.105,25.804,28,24.473,28H11c-0.553,0-1-0.448-1-1V13\n' +
                    '        c0-0.215,0.069-0.425,0.198-0.597l5.392-7.24C16.188,4.414,17.05,4,17.974,4C19.643,4,21,5.357,21,7.026V12h5.002\n' +
                    '        c1.265,0,2.427,0.579,3.188,1.589C29.954,14.601,30.192,15.88,29.845,17.099z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '        <path id="'+id+'_like_2" data-content="'+data+'" d="M7,12H3c-0.553,0-1,0.448-1,1v14c0,0.552,0.447,1,1,1h4c0.553,0,1-0.448,1-1V13C8,12.448,7.553,12,7,12z\n' +
                    '        M5,25.5c-0.828,0-1.5-0.672-1.5-1.5c0-0.828,0.672-1.5,1.5-1.5c0.828,0,1.5,0.672,1.5,1.5C6.5,24.828,5.828,25.5,5,25.5z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            unlike: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 32 32"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <g id="'+id+'_unlike_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_unlike_1" data-content="'+data+'" d="M2.156,14.901l2.489-8.725C5.012,4.895,6.197,4,7.528,4h13.473C21.554,4,22,4.448,22,5v14\n' +
                    '        c0,0.215-0.068,0.425-0.197,0.597l-5.392,7.24C15.813,27.586,14.951,28,14.027,28c-1.669,0-3.026-1.357-3.026-3.026V20H5.999\n' +
                    '        c-1.265,0-2.427-0.579-3.188-1.589C2.047,17.399,1.809,16.12,2.156,14.901z" \n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '        <path id="'+id+'_unlike_2" data-content="'+data+'" d="M25.001,20h4C29.554,20,30,19.552,30,19V5c0-0.552-0.446-1-0.999-1h-4c-0.553,0-1,0.448-1,1v14\n' +
                    '        C24.001,19.552,24.448,20,25.001,20z M27.001,6.5c0.828,0,1.5,0.672,1.5,1.5c0,0.828-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.672-1.5-1.5\n' +
                    '        C25.501,7.172,26.173,6.5,27.001,6.5z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            like2: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 512 512"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <title/>\n' +
                    '    <g id="'+id+'_like2_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_like2_1" data-content="'+data+'" d="M348.45,432.7H261.8a141.5,141.5,0,0,1-49.52-8.9l-67.5-25.07a15,15,0,0,1,10.45-28.12l67.49,25.07a111.79,111.79,0,0,0,39.08,7h86.65a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30H368.9a14.21,14.21,0,1,0,0-28.42,15,15,0,0,1,0-30h20.44a14.21,14.21,0,0,0,10.05-24.26,14.08,14.08,0,0,0-10.05-4.16,15,15,0,0,1,0-30h20.45a14.21,14.21,0,0,0,10-24.26,14.09,14.09,0,0,0-10-4.17H268.15A15,15,0,0,1,255,176.74a100.2,100.2,0,0,0,9.2-29.33c3.39-21.87-.79-41.64-12.42-58.76a12.28,12.28,0,0,0-22.33,7c.49,51.38-23.25,88.72-68.65,108a15,15,0,1,1-11.72-27.61c18.72-8,32.36-19.75,40.55-35.08,6.68-12.51,10-27.65,9.83-45C199.31,77,211,61,229.18,55.34s36.81.78,47.45,16.46c24.71,36.36,20.25,74.1,13.48,97.21H409.79a44.21,44.21,0,0,1,19.59,83.84,44.27,44.27,0,0,1-20.44,58.42,44.27,44.27,0,0,1-20.45,58.43,44.23,44.23,0,0,1-40,63Z" style="fill:'+color+'" />\n' +
                    '        <path id="'+id+'_like2_2" data-content="'+data+'" d="M155,410.49H69.13a15,15,0,0,1-15-15V189.86a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V395.49A15,15,0,0,1,155,410.49Zm-70.84-30H140V204.86H84.13Z" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            unlike2: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 512 512"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <title/>\n' +
                    '    <g id="'+id+'_unlike2_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_unlike2_1" data-content="'+data+'" d="M242.28,427.39a43.85,43.85,0,0,1-13.1-2c-18.22-5.69-29.87-21.64-29.69-40.62.16-17.35-3.15-32.5-9.83-45-8.19-15.33-21.83-27.13-40.55-35.08A15,15,0,1,1,160.83,277c45.4,19.26,69.14,56.6,68.65,108a12.28,12.28,0,0,0,22.33,7c28.34-41.71,3.47-87.63,3.22-88.09a15,15,0,0,1,13.12-22.27H409.79a14.22,14.22,0,0,0,0-28.43H389.34a15,15,0,1,1,0-30,14.2,14.2,0,0,0,14.21-14.21,14.23,14.23,0,0,0-14.21-14.21H368.9a15,15,0,0,1,0-30,14.21,14.21,0,1,0,0-28.42H348.45a15,15,0,0,1,0-30,14.21,14.21,0,1,0,0-28.42H261.8a111.69,111.69,0,0,0-39.07,7l-67.5,25.07A15,15,0,0,1,144.78,82l67.5-25.07A141.5,141.5,0,0,1,261.8,48h86.65a44.25,44.25,0,0,1,40,63,44.27,44.27,0,0,1,20.45,58.43,44.27,44.27,0,0,1,20.44,58.42,44.21,44.21,0,0,1-19.59,83.84H290.11c6.77,23.11,11.23,60.85-13.48,97.22A41.21,41.21,0,0,1,242.28,427.39Z" style="fill:'+color+'" />\n' +
                    '        <path id="'+id+'_unlike2_2" data-content="'+data+'" d="M155,305.85H69.13a15,15,0,0,1-15-15V85.21a15,15,0,0,1,15-15H155a15,15,0,0,1,15,15V290.85A15,15,0,0,1,155,305.85Zm-70.84-30H140V100.21H84.13Z" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            heart: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 512 512"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <g id="'+id+'_heart_" data-content="'+data+'">\n' +
                    '       <path id="'+id+'_heart_1" data-content="'+data+'" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256\n' +
                    '       96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5\n' +
                    '       199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            apple: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 56.693 56.693"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve"\n' +
                    '     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <g id="'+id+'_apple_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_apple_1" data-content="'+data+'" d="M41.777,30.517c-0.062-6.232,5.082-9.221,5.312-9.372c-2.891-4.227-7.395-4.807-8.998-4.873\n' +
                    '        c-3.83-0.389-7.477,2.256-9.42,2.256c-1.939,0-4.941-2.199-8.117-2.143c-4.178,0.062-8.029,2.43-10.179,6.17\n' +
                    '        c-4.339,7.527-1.11,18.682,3.118,24.791c2.067,2.986,4.532,6.346,7.766,6.223c3.117-0.123,4.293-2.016,8.061-2.016\n' +
                    '        s4.826,2.016,8.123,1.953c3.352-0.061,5.477-3.043,7.527-6.041c2.373-3.469,3.35-6.828,3.408-6.998\n' +
                    '        C48.305,40.433,41.844,37.958,41.777,30.517z" style="fill:'+color+'" />\n' +
                    '        <path id="'+id+'_apple_2" data-content="'+data+'" d="M35.582,12.229c1.715-2.082,2.877-4.975,2.561-7.855c-2.475,0.1-5.471,1.645-7.248,3.725\n' +
                    '        c-1.592,1.846-2.984,4.785-2.611,7.613C31.045,15.926,33.861,14.307,35.582,12.229z" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            new: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 23.429 22.144"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve"\n' +
                    '     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <g id="'+id+'_new_" data-content="'+data+'">\n' +
                    '        <polygon id="'+id+'_new_1" data-content="'+data+'" points="16.946,0 5.019,0 0,4.489 0,22.083 11.935,22.083\n' +
                    '        11.935,20.504 1.777,20.504 1.777,6.209 6.926,6.209 6.926,1.578\n' +
                    '        15.169,1.578 15.169,6.468 16.946,6.468  "\n' +
                    '                 style="fill-rule:evenodd;clip-rule:evenodd;fill:'+color+';" />\n' +
                    '        <polygon id="'+id+'_new_2" data-content="'+data+'" points="14.438,13.729 14.438,8.852 18.224,8.852\n' +
                    '        18.224,13.729 23.429,13.729 23.429,17.266 18.224,17.266 18.224,22.144\n' +
                    '        14.438,22.144 14.438,17.266 9.242,17.266 9.242,13.729     "\n' +
                    '                 style="fill-rule:evenodd;clip-rule:evenodd;fill:'+color+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            eraser: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 28 28"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <path id="'+id+'_eraser1_" data-content="'+data+'" d="M14.0783 11.9751C13.7956 11.6956 13.7956 11.2423 \n' +
                    '    14.0783 10.9628L14.3342 10.7097C14.6169 10.4301 15.0752 10.4301 15.3579 10.7097L17.4054 12.7346L19.4526 \n' +
                    '    10.71C19.7353 10.4304 20.1936 10.4304 20.4763 10.71L20.7322 10.9631C21.0149 11.2426 21.0149 11.6959 20.7322 \n' +
                    '    11.9755L18.685 14L20.7322 16.0245C21.0149 16.3041 21.0149 16.7574 20.7322 17.0369L20.4763 17.29C20.1936 17.5696\n' +
                    '    19.7353 17.5696 19.4526 17.29L17.4054 15.2654L15.3579 17.2903C15.0752 17.5699 14.6169 17.5699\n' +
                    '    14.3342 17.2903L14.0783 17.0372C13.7956 16.7577 13.7956 16.3044 14.0783 16.0249L16.1258\n' +
                    '    14L14.0783 11.9751Z" \n' +
                    '          style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '    <path id="'+id+'_eraser2_" data-content="'+data+'"  clip-rule="evenodd" d="M8.06096 5.5C7.46476 5.5 6.89965 5.76598 6.5197 6.22544L1.46069 \n' +
                    '    12.343C0.874809 13.0515 0.84738 14.0681 1.39421 14.8072L6.48659 21.6896C6.86374 22.1993 7.46026 \n' +
                    '    22.5 8.09434 22.5H25C26.1046 22.5 27 21.6046 27 20.5V7.5C27 6.39543 26.1046 5.5 25 5.5H8.06096ZM8.06096 \n' +
                    '    7.5L25 7.5V20.5H8.09434L3.00196 13.6176L8.06096 7.5Z" \n' +
                    '          style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '</svg>';
            })(),
            delete: (function() {
                return '<svg></svg>';
            })(),
            update: (function() {
                return '<svg></svg>';
            })(),
            create: (function() {
                return '<svg></svg>';
            })(),
            fix: (function() {
                return '<svg></svg>';
            })(),
            move: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 48 48"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <title/>\n' +
                    '    <g id="'+id+'_move_" data-content="'+data+'" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">\n' +
                    '        <path id="'+id+'_move_1" data-content="'+data+'" d="M3.58077819,25.7275058 L3.54130289,25.800225 C3.39947856,26.1207263 3.63161808,26.5\n' +
                    '        4,26.5 L8.5,26.5 L8.5,32 C8.5,32.2761424 8.72385763,32.5 9,32.5 L12,32.5 L12.0898756,32.4919443\n' +
                    '        C12.3231248,32.4496084 12.5,32.2454599 12.5,32 L12.5,26.5 L17,26.5 C17.396719,26.5 17.635429,26.0601323\n' +
                    '        17.4192218,25.7275058 L10.9192218,15.7275058 C10.7220501,15.4241647 10.2779499,15.4241647\n' +
                    '        10.0807782,15.7275058 L3.58077819,25.7275058 Z"\n' +
                    '              fill-rule="nonzero" style="fill:'+color+'"\n' +
                    '              transform="translate(10.500000, 24.000000) rotate(-90.000000) translate(-10.500000, -24.000000) " />\n' +
                    '        <path id="'+id+'_move_2" d="M30.5807782,25.7275058 L30.5413029,25.800225 C30.3994786,26.1207263 30.6316181,26.5\n' +
                    '        31,26.5 L35.5,26.5 L35.5,32 C35.5,32.2761424 35.7238576,32.5 36,32.5 L39,32.5 L39.0898756,32.4919443\n' +
                    '        C39.3231248,32.4496084 39.5,32.2454599 39.5,32 L39.5,26.5 L44,26.5 C44.396719,26.5 44.635429,26.0601323\n' +
                    '        44.4192218,25.7275058 L37.9192218,15.7275058 C37.7220501,15.4241647 37.2779499,15.4241647\n' +
                    '        37.0807782,15.7275058 L30.5807782,25.7275058 Z"\n' +
                    '              fill-rule="nonzero" style="fill:'+color+'"\n' +
                    '              transform="translate(37.500000, 24.000000) scale(-1, 1) rotate(-90.000000) translate(-37.500000, -24.000000) " />\n' +
                    '        <path id="'+id+'_move_3" data-content="'+data+'" d="M17.0807782,39.2268571 L17.0413029,39.2995763 C16.8994786,39.6200776 17.1316181,39.9993513\n' +
                    '        17.5,39.9993513 L22,39.999 L22,45.4993513 C22,45.7754937 22.2238576,45.9993513 22.5,45.9993513\n' +
                    '        L25.5,45.9993513 L25.5898756,45.9912956 C25.8231248,45.9489597 26,45.7448112 26,45.4993513 L26,39.999 L30.5,39.9993513\n' +
                    '        C30.896719,39.9993513 31.135429,39.5594836 30.9192218,39.2268571 L24.4192218,29.2268571 C24.2220501,28.923516 23.7779499,28.923516\n' +
                    '        23.5807782,29.2268571 L17.0807782,39.2268571 Z"\n' +
                    '              fill-rule="nonzero" style="fill:'+color+'"\n' +
                    '              transform="translate(24.000000, 37.499351) scale(1, -1) translate(-24.000000, -37.499351) " />\n' +
                    '        <path id="'+id+'_move_4" data-content="'+data+'" d="M17.0807782,12.2268571 L17.0413029,12.2995763 C16.8994786,12.6200776 17.1316181,12.9993513 17.5,12.9993513 L22,12.999\n' +
                    '        L22,18.4993513 C22,18.7754937 22.2238576,18.9993513 22.5,18.9993513 L25.5,18.9993513 L25.5898756,18.9912956 C25.8231248,18.9489597\n' +
                    '        26,18.7448112 26,18.4993513 L26,12.999 L30.5,12.9993513 C30.896719,12.9993513 31.135429,12.5594836 30.9192218,12.2268571\n' +
                    '        L24.4192218,2.22685711 C24.2220501,1.92351601 23.7779499,1.92351601 23.5807782,2.22685711 L17.0807782,12.2268571 Z"\n' +
                    '              fill-rule="nonzero" style="fill:'+color+'" />\n' +
                    '        <path  id="'+id+'_move_5" data-content="'+data+'" d="M24,21 C22.3431458,21 21,22.3431458 21,24 C21,25.6568542 22.3431458,27 24,27 C25.6568542,27 27,25.6568542\n' +
                    '        27,24 C27,22.3431458 25.6568542,21 24,21 Z"\n' +
                    '              fill-rule="nonzero" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            lock: (function() {
                return '<svg></svg>';
            })(),
            unlock: (function() {
                return '<svg></svg>';
            })(),
            page: (function() {
                return '<svg></svg>';
            })(),
            graph: (function() {
                return '<svg></svg>';
            })(),
            hamburger: (function() {
                return '<svg></svg>';
            })(),
            close: (function() {
                return '<svg></svg>';
            })(),
            finish: (function() {
                return '<svg></svg>';
            })(),
            help: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" fill="none" viewBox="0 0 24 24"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <path id="'+id+'_help_" data-content="'+data+'" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3596\n' +
                    '    22 8.77516 21.6039 7.35578 20.8583L3.06538 21.9753C2.6111 22.0937 2.1469 21.8213\n' +
                    '    2.02858 21.367C1.99199 21.2266 1.99198 21.0791 2.02855 20.9386L3.1449 16.6502C2.3972\n' +
                    '    15.2294 2 13.6428 2 12C2 6.47715 6.47715 2 12 2ZM12 15.5C11.4477 15.5 11\n' +
                    '    15.9477 11 16.5C11 17.0523 11.4477 17.5 12 17.5C12.5523 17.5 13 17.0523 13\n' +
                    '    16.5C13 15.9477 12.5523 15.5 12 15.5ZM12 6.75C10.4812 6.75 9.25 7.98122 9.25\n' +
                    '    9.5C9.25 9.91421 9.58579 10.25 10 10.25C10.3797 10.25 10.6935 9.96785 10.7432\n' +
                    '    9.60177L10.7565 9.37219C10.8205 8.74187 11.3528 8.25 12 8.25C12.6904 8.25 13.25\n' +
                    '    8.80964 13.25 9.5C13.25 10.0388 13.115 10.3053 12.6051 10.8322L12.3011 11.1414C11.5475\n' +
                    '    11.926 11.25 12.4892 11.25 13.5C11.25 13.9142 11.5858 14.25 12 14.25C12.4142 14.25\n' +
                    '    12.75 13.9142 12.75 13.5C12.75 12.9612 12.885 12.6947 13.3949 12.1678L13.6989\n' +
                    '    11.8586C14.4525 11.074 14.75 10.5108 14.75 9.5C14.75 7.98122 13.5188 6.75 12 6.75Z"\n' +
                    '          style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '</svg>';
            })(),
            rollup: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 256 256"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <path id="'+id+'_rollup_" data-content="'+data+'" d="M184.746,156.373c-1.639,0-3.275-0.625-4.525-1.875L128,102.278l-52.223,52.22c-2.497,2.5-6.55,2.5-9.05,0  \n' +
                    '    c-2.5-2.498-2.5-6.551,0-9.05l56.749-56.747c1.2-1.2,2.828-1.875,4.525-1.875l0,0c1.697,0,3.325,0.675,4.525,1.875l56.745,56.747  \n' +
                    '    c2.5,2.499,2.5,6.552,0,9.05C188.021,155.748,186.383,156.373,184.746,156.373z M256,128C256,57.42,198.58,0,128,0  \n' +
                    '    C57.42,0,0,57.42,0,128c0,70.58,57.42,128,128,128C198.58,256,256,198.58,256,128z M243.2,128c0,63.521-51.679,115.2-115.2,115.2  \n' +
                    '    c-63.522,0-115.2-51.679-115.2-115.2C12.8,64.478,64.478,12.8,128,12.8C191.521,12.8,243.2,64.478,243.2,128z"\n' +
                    '          style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '</svg>';
            })(),
            info: (function() {
                return '<svg></svg>';
            })(),
            play: (function() {
                return '<svg></svg>';
            })(),
            stop: (function() {
                return '<svg></svg>';
            })(),
            pause: (function() {
                return '<svg></svg>';
            })(),
            previous: (function() {
                return '<svg></svg>';
            })(),
            next: (function() {
                return '<svg></svg>';
            })(),
            save: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 48 48"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <path id="'+id+'_save_" data-content="'+data+'" d="M0 0h48v48H0z" fill="none"/>\n' +
                    '    <path id="'+id+'_save_" data-content="'+data+'" d="M34 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79\n' +
                    '    4-4V14l-8-8zM24 38c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6\n' +
                    '    6zm6-20H10v-8h20v8z" style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '</svg>';
            })(),
            cancel: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 48 48"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <g id="'+id+'_cancel_" data-content="'+data+'">\n' +
                    '        <path id="'+id+'_cancel_" data-content="'+data+'" d="M24,0C10.745,0,0,10.745,0,24s10.745,24,24,24s24-10.745,24-24S37.255,0,24,0z M4,24\n' +
                    '        C4,12.954,12.954,4,24,4c4.85,0,9.293,1.727,12.755,4.597L8.597,36.755C5.727,33.293,4,28.85,4,24z\n' +
                    '        M24,44   c-4.756,0-9.119-1.667-12.552-4.439l28.112-28.111C42.333,14.881,44,19.244,44,24C44,35.046,35.046,44,24,44z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            cancel2: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 30 30"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '    <path id="'+id+'_cancel2_2_" data-content="'+data+'" d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16.414,15  \n' +
                    '    c0,0,3.139,3.139,3.293,3.293c0.391,0.391,0.391,1.024,0,1.414c-0.391,0.391-1.024,0.391-1.414,0C18.139,19.554,15,16.414,15,16.414  \n' +
                    '    s-3.139,3.139-3.293,3.293c-0.391,0.391-1.024,0.391-1.414,0c-0.391-0.391-0.391-1.024,0-1.414C10.446,18.139,13.586,15,13.586,15  \n' +
                    '    s-3.139-3.139-3.293-3.293c-0.391-0.391-0.391-1.024,0-1.414c0.391-0.391,1.024-0.391,1.414,0C11.861,10.446,15,13.586,15,13.586  \n' +
                    '    s3.139-3.139,3.293-3.293c0.391-0.391,1.024-0.391,1.414,0c0.391,0.391,0.391,1.024,0,1.414C19.554,11.861,16.414,15,16.414,15z"\n' +
                    '          style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '</svg>';
            })(),
            enter: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 96 96"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve"  xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <g>\n' +
                    '        <path id="'+id+'_enter1_" data-content="'+data+'" d="M43.7578,61.7578a5.9994,5.9994,0,1,0,8.4844,8.4844l18-18a5.9979,5.9979,0,0,0,0-8.4844l-18-18a5.9994,5.9994,0,0,0-8.4844,8.4844L51.5156,42H6A6,6,0,0,0,6,54H51.5156Z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '        <path id="'+id+'_enter2_" data-content="'+data+'" d="M90,0H30a5.9966,5.9966,0,0,0-6,6V18a6,6,0,0,0,12,0V12H84V84H36V78a6,6,0,0,0-12,0V90a5.9966,5.9966,0,0,0,6,6H90a5.9966,5.9966,0,0,0,6-6V6A5.9966,5.9966,0,0,0,90,0Z"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            search: (function() {
                return '<svg></svg>';
            })(),
            reset: (function() {
                return '<svg></svg>';
            })(),
            submit: (function() {
                return '<svg></svg>';
            })(),
            import: (function() {
                return '<svg></svg>';
            })(),
            export: (function() {
                return '<svg></svg>';
            })(),
            file: (function() {
                return '<svg></svg>';
            })(),
            loading: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" viewBox="0 0 32 32"\n' +
                    '     height="'+size+'" width="'+size+'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <g id="'+id+'_loading_" data-content="'+data+'">\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(0 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0" dur="1s" from="1" repeatCount="indefinite" to=".1" />\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(45 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.125s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(90 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.25s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(135 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.375s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(180 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.5s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(225 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.675s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(270 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.75s" dur="1s" from="1" repeatCount="indefinite" to=".1"/>\n' +
                    '        </path>\n' +
                    '        <path d="M14 0 H18 V8 H14 z" opacity=".1" transform="rotate(315 16 16)"\n' +
                    '              style="fill:'+color+'; stroke: '+stroke+';">\n' +
                    '            <animate attributeName="opacity" begin="0.875s" dur="1s" from="1" repeatCount="indefinite" to=".1" />\n' +
                    '        </path>\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            download: (function() {
                return '<svg></svg>';
            })(),
            database: (function() {
                return '<svg></svg>';
            })(),
            grid: (function() {
                return '<svg></svg>';
            })(),
            table: (function() {
                return '<svg></svg>';
            })(),
            man: (function() {
                return '<svg></svg>';
            })(),
            woman: (function() {
                return '<svg></svg>';
            })(),
            error: (function() {
                return '<svg></svg>';
            })(),
            success: (function() {
                return '<svg></svg>';
            })(),
            done: (function() {
                return '<svg></svg>';
            })(),
            system: (function() {
                return '<svg></svg>';
            })(),
            terminal: (function() {
                return '<svg></svg>';
            })(),
            code: (function() {
                return '<svg></svg>';
            })(),
            image: (function() {
                return '<svg></svg>';
            })(),
            video: (function() {
                return '<svg></svg>';
            })(),
            music: (function() {
                return '<svg></svg>';
            })(),
            login: (function() {
                return '<svg></svg>';
            })(),
            logout: (function() {
                return '<svg></svg>';
            })(),
            user: (function() {
                return '<svg></svg>';
            })(),
            admin: (function() {
                return '<svg></svg>';
            })(),
            news: (function() {
                return '<svg></svg>';
            })(),
            tools: (function() {
                return '<svg></svg>';
            })(),
            key: (function() {
                return '<svg></svg>';
            })(),
            facebook: (function() {
                return '<svg version="1.1" id="'+id+'" data-content="'+data+'" aria-labelledby="simpleicons-facebook-icon" role="img" viewBox="0 0 24 24"\n' +
                    '     height="'+size+'" width="'+size+'" xmlns="http://www.w3.org/2000/svg">\n' +
                    '    <title id="simpleicons-facebook-icon"/>\n' +
                    '    <g id="'+id+'_facebook_" data-content="'+data+'">\n' +
                    '       <path id="'+id+'_facebook_1" data-content="'+data+'" d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9\n' +
                    '       .294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796\n' +
                    '       .141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c\n' +
                    '       .733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0" style="fill:'+color+'" />\n' +
                    '    </g>\n' +
                    '</svg>';
            })(),
            instagram: (function() {
                return '<svg></svg>';
            })(),
            whatsapp: (function() {
                return '<svg></svg>';
            })(),
            youtube: (function() {
                return '<svg></svg>';
            })(),
            blogger: (function() {
                return '<svg></svg>';
            })(),
            microsoft: (function() {
                return '<svg></svg>';
            })(),
            twitter: (function() {
                return '<svg></svg>';
            })(),
            reddit: (function() {
                return '<svg></svg>';
            })(),
            amazon: (function() {
                return '<svg></svg>';
            })(),
        };

        /**
         * Main Functions
         */
        function _draw() {
            if ($$.is(_icons_[icon]).undef() || _icons_[icon] === '') {
                return _icons_._UNDEF_;
            }
            return _icons_[icon];
        }

        return {"draw":_draw};
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));