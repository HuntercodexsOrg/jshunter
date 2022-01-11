/*
*
* Project: jsHunter Payment for UI
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
     - INITIALIZER OF PAYMENT EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in payment extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /**
     * @description Payment
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: All functions for this method)
     * @status [TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
     */
    jsHunter.prototype.payment = function(params) {
        return this;
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
