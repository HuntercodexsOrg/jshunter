/*
*
* Project: jsHunter File for UI
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
     - INITIALIZER OF FILE EXTENSION
     --------------------------------------------------------------------------------
     */

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw "[Exception]: Error on load jsHunter (Lib Not Found) in file extension !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /**
     * @description File, read a file from an <HTMLElement:input[type=file]>
     * @param {object} params (object: Mandatory)
     * @returns {object} (object: File Handler Methods)
     * @status [_TODO][WORK][DONE][DOCUMENTED][CANCEL][WAIT]
     */
    jsHunter.prototype.file = function(params) {

        /**
         * Settings/Configurations by args
         */
        let theme = ($$.has('theme').in(params)) ? params.theme : 'default';
        let lang = ($$.has('lang').in(params)) ? params.lang : "en";
        let _target_ = ($$.has('target').in(params)) ? params.target : null;
        let _process_ = ($$.has('process').in(params)) ? params.process : "none";
        let _progress_ = ($$.has('progress').in(params)) ? params.progress : "";
        let _export_ = ($$.has('export').in(params)) ? params.export : {};

        /**
         * Global Settings
         */
        let _file_ = null;
        let file_reader = null;
        let file_progress = null;
        let file_abort = false;
        let arr_content = [];
        let filename = null;
        let last_modified = null;
        let file_size = null;
        let file_type = null;
        let webkit_relative_path = null;
        let accepted_process = ["array", "matrix", "string", "base64", "none"];

        /**
         * File Types
         */
        let _file_types_ = {
            csv: "text/csv",
            txt: "text/plain",
            html: "text/html"
        };

        /**
         * Adjusts
         */
        theme = jsHunter.fn.getTheme(theme);
        lang = jsHunter.fn.getLang(lang);

        /**
         * Generic Functions
         * */
        function _isDownload() {
            /*When download is requested*/
            return (
                $$.has("active").in(_export_) && _export_.active === true &&
                $$.has("content").in(_export_) && _export_.content.length > 0 &&
                $$.has("type").in(_export_) && _export_.type !== ""
            );
        }

        function _checkin() {

            if (!$$.is(_target_).file()) {
                if (!_target_ || (!$$.findElements(_target_) && !$$.findClass(_target_) && !$$.findId(_target_))) {
                    $$.log("file() error => Missing Target Element").error();
                    return false;
                }
            }

            if (!$$.inArray(accepted_process, _process_)) {
                $$.log("file() error => Wrong process type: " + _process_).error();
                return false;
            }

            if (!$$.empty(_progress_)) {
                if (!$$.findId(_progress_)) {
                    $$.log("file() error => Missing Target Progress").error();
                    return false;
                }
            }

            return true;
        }

        function _prepare() {

            try {
                _file_ = document.querySelectorAll(_target_)[0].files[0];
            } catch (er) {
                try {
                    _file_ = document.querySelectorAll(_target_)[0].files;
                } catch (er) {
                    try {
                        _file_ = document.querySelectorAll(_target_)[0];
                    } catch (er) {
                        try {
                            _file_ = document.querySelectorAll(_target_);
                        } catch (er) {
                            if ($$.is(_target_).file()) {
                                _file_ = _target_;
                            } else {
                                _file_ = null;
                            }
                        }
                    }
                }
            }

            if (!_file_ || !$$.is(_file_).object()) {
                $$.log("file() error => Missing File in target: " + _target_).error();
                return false;
            }

            /*Set File Details*/
            filename = _file_.name;
            last_modified = _file_.lastModified;
            file_size = _file_.size;
            file_type = _file_.type;
            webkit_relative_path = _file_.webkitRelativePath;

            if (!$$.empty(_progress_)) {
                (function resetTarget() {
                    if ($$.findId("jh-file-progress-bar-container")) {
                        $$.remove(_progress_, "#jh-file-progress-bar-container");
                    }
                })();

                (function containerProgress() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-file-progress-bar-container", "jh-file-progress-bar-container"+theme],
                        append: "#"+_progress_.replace(/^#/, '')
                    });
                })();

                (function percentProgress() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-file-percent-container", "jh-file-percent-container"],
                        append: "#jh-file-progress-bar-container"
                    });

                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-file-percent", "jh-file-percent"],
                        append: "#jh-file-percent-container"
                    }, "0%");
                })();

                (function cancelLoader() {
                    $$.create({
                        element:  "div",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-file-progress-cancel", "jh-file-progress-cancel"],
                        append: "#jh-file-progress-bar-container"
                    });

                    $$.create({
                        element:  "button",
                        attr_type: ["id", "class"],
                        attr_name: ["jh-file-progress-bt-cancel", "jh-file-progress-bt-cancel"],
                        append: "#jh-file-progress-cancel"
                    }, "X");

                    jH('#jh-file-progress-bt-cancel').on('click', function(e) {
                        _abort();
                    });
                })();

                file_progress = document.querySelector('.jh-file-percent');
            }

            return true;
        }

        function _abort(event) {
            if (file_abort === true) return;
            file_abort = true;
            file_reader.abort();
            $$.alert("Aborted");
            $$.log("Aborted").print("red");
        }

        function _error(event) {
            file_abort = true;
            switch(event.target.error.code) {
                case event.target.error.NOT_FOUND_ERR:
                    $$.alert('File Not Found!');
                    $$.log("File Not Found!").print("red");
                    break;
                case event.target.error.NOT_READABLE_ERR:
                    $$.alert('File is not readable');
                    $$.log("File is not readable!").print("red");
                    break;
                case event.target.error.ABORT_ERR:
                    $$.alert('Aborted by Application Error');
                    $$.log("Aborted by Application Error!").print("red");
                    break;
                default:
                    $$.alert('An error occurred reading this file.');
                    $$.log("An error occurred reading this file!").print("red");
            }
            _abort();
        }

        function _updateProgress(event) {
            // event is an ProgressEvent.
            if (event.lengthComputable) {
                let percentLoaded = Math.round((event.loaded / event.total) * 100);
                // Increase the progress bar length.
                if (percentLoaded < 100) {
                    file_progress.style.width = percentLoaded + '%';
                    file_progress.textContent = percentLoaded + '%';
                }
                if ($$.jHDebug() === true) {
                    $$.log("file() info => Update Progress is running...").print("cyan");
                }
            }
        }

        /**
         * Main Functions
         */
        function _new() {
            file_reader = new FileReader();

            if (!$$.empty(_progress_)) {
                file_reader.onerror = _error;
                file_reader.onprogress = _updateProgress;
                file_reader.onabort = _abort;
                file_reader.onloadstart = function() {
                    $$.opacity($$.select('#jh-file-progress-bar-container'), "1.0");
                }
            }
        }

        function _progressFinish() {
            if (!$$.empty(_progress_)) {
                file_progress.style.width = '100%';
                file_progress.textContent = '100%';
                /*'Hide' Progress Bar*/
                setTimeout(function () {
                    $$.opacity($$.select('#jh-file-progress-bar-container'), "0");
                    setTimeout(function () {
                        $$.remove(_progress_, '#jh-file-progress-bar-container');
                    }, 2000);
                }, 1000);
            }
        }

        function _details() {
            return {
                filename: filename,
                last_modified: last_modified,
                file_size: file_size,
                file_type: file_type,
                webkit_relative_path: webkit_relative_path
            };
        }

        function _getFile() {
            return _file_;
        }

        function _load(fn, args) {
            file_reader.onload = function(file_event) {
                if (file_abort === true) return;

                switch (_process_) {
                    case "array":
                        arr_content = (file_event.target.result)
                            .replaceAll('\r', '')
                            .split('\n');
                        break;
                    case "matrix":
                        let aux = (file_event.target.result)
                            .replaceAll('\r', '')
                            .split('\n');
                        aux.forEach(function(item, index, array) {
                            arr_content.push([item]);
                        });
                        break;
                    case "string":
                        arr_content = (file_event.target.result);
                        break;
                    case "base64":
                        arr_content = btoa(file_event.target.result);
                        break;
                    case "none":
                        arr_content = (file_event.target.result);
                        break;
                }

                _progressFinish();

                if ($$.is(fn).function()) {
                    fn(arr_content, args);
                }
            }
        }

        function _loadPromise(fn, args) {

            function _promise(resolve, reject, args) {
                file_reader.onload = function(file_event) {
                    _progressFinish()
                    try {
                        resolve(new Int8Array(file_event.target.result));
                    } catch (er) {
                        try {
                            resolve(new Int16Array(file_event.target.result));
                        } catch (er) {
                            try {
                                resolve(new Int32Array(file_event.target.result));
                            } catch (er) {
                                try {
                                    resolve(new BigInt64Array(file_event.target.result));
                                } catch (er) {
                                    try {
                                        resolve(file_event.target.result);
                                    } catch (er) {
                                        reject(er);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function _finalize(data) {
                fn(data, args);
            }

            function _exception(data) {
                $$.log("file():promise error: " + data).except();
            }

            $$.promise({
                timeout: 60,
                debug: true
            }).run(function(resolve, reject, fn) {
                return _promise(resolve, reject, fn);
            }).then([_finalize, _exception]);
        }

        function _readAsText(fn, args) {
            if (!file_reader) return;
            _load(fn, args);
            file_reader.readAsText(_file_);
        }

        function _readAsBinaryString(fn, args) {
            if (!file_reader) return;
            _load(fn, args);
            file_reader.readAsBinaryString(_file_);
        }

        function _readAsDataURL(fn, args) {
            if (!file_reader) return;
            _load(fn, args);
            file_reader.readAsDataURL(_file_);
        }

        function _readAsArrayBuffer(fn, args) {
            if (!file_reader) return;
            _process_ = "none"; /*Prevent Bug*/
            _loadPromise(fn, args);
            file_reader.readAsArrayBuffer(_file_);
        }

        function _getTypeFile(t) {
            return _file_types_[t.replace(".", "")] || undefined;
        }

        function _downloadFile() {
            try {
                let _file_ = new Blob([_export_.content], {type: _getTypeFile(_export_.type)});
                let _date_ = $$.date().stamp();
                let _down_ = "jh-grid-data-export-"+_date_+"."+_export_.type.replace(".", "");
                let _href_ = window.URL.createObjectURL(_file_);

                let tmp_link = $$.create({
                    element: "a",
                    attr_type: ["id", "class", "href", "download"],
                    attr_name: ["jh-file-download-"+_date_, "jh-file-download", _href_, _down_],
                    append: _export_.target || "body"
                }, "Download");

                if (_export_.automatic === true) {
                    tmp_link.style.display = "none";
                    tmp_link.click();
                }

                if (_export_.remove === true && _export_.automatic === true) {
                    $$.await(2).run(function () {
                        $$.remove(_export_.target || "body", "#jh-file-download-"+_date_);
                    });
                }

            } catch (er) {
                $$.log("file()_downloadFile() error => " + er).error();
            }
        }

        try {
            if (!_isDownload()) {
                if (_checkin()) {
                    if (_prepare()) {
                        _new();
                    }
                }
            }
        } catch (er) {
            $$.log("file() error => " + er).error();
        }

        return {
            "getFile": _getFile,
            "details": _details,
            "readAsText": _readAsText,
            "readAsBinaryString": _readAsBinaryString,
            "readAsDataURL": _readAsDataURL,
            "readAsArrayBuffer": _readAsArrayBuffer,
            "download": _downloadFile
        };
    }

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
