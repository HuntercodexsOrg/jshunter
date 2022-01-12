
$$.loaded(function() {

    /**[MODEL]
     * Data Samples
     */
    let data_samples = 'off';
    (function DataSamples() {
        if (data_samples === 'off') return;

        /*Object { a: "123", b: "123", c: "123" }*/
        let a = [
            {0:"a", 1:"b", 2:"c"}
        ];

        /*Object { a: "123", b: "123", c: "123" }*/
        let b = {
            0: {0:"a", 1:"b", 2:"c"}
        };

        /*Array(3) [ 1, 2, 3 ]*/
        let c = {
            0: [1,2,3]
        };

        let d = [
            [1,2,3],
        ];

        console.log($$.dataType(a));
        console.log($$.dataType(b));
        console.log($$.dataType(c));
        console.log($$.dataType(d));

        console.log("a", $$.isArray(a), typeof a, $$.dataType(a));
        Object.keys(a).forEach(function(item, index, array) {
            console.log(a[item]);
        });

        console.log("b", $$.isArray(b), typeof b, $$.dataType(b));
        Object.keys(b).forEach(function(item, index, array) {
            console.log(b[item]);
        });

        console.log("c", $$.isArray(c), typeof c, $$.dataType(c));
        Object.keys(c).forEach(function(item, index, array) {
            console.log(c[item]);
        });

        console.log("d", $$.isArray(d), typeof d, $$.dataType(d));
        Object.keys(d).forEach(function(item, index, array) {
            console.log(d[item]);
        });
    })();

    /*-----------------------------------------------------------------------------------
    Methods
    ------------------------------------------------------------------------------------*/

    /**[DONE]
     * Set Theme
     */
    let set_theme = 'off';
    (function SetTheme() {
        if (set_theme === 'off') return;
        $$.setTheme('light');
    })();

    /**[DONE]
     * AJax (with restful support)
     */
    let ajax = 'off';
    (function Ajax() {
        if (ajax === 'off') return;
        $$.ajax({
            url: query_renderize.url,
            async: false,
            cors: true,
            data: query_renderize.params,
            dataType: query_renderize.data_type,
            contentType: query_renderize.content_type,
            restful: false
        }).get(
            function(resp) { /*Callback Success*/
                /*Async Error Response*/
                if (resp.error) {
                    jH("#jh-paged-table-tbody")
                        .html("" +
                            "<tr>" +
                            "<td colspan='10000' class='jh-paged-table-query-error'>" + query_error +": "+ resp.text + "</td>" +
                            "</tr>");
                } else if (typeof resp === 'string' && resp.search(/(fatal error|error)/gi) !== -1) {
                    /*Sync Error Response*/
                    jH("#jh-paged-table-tbody")
                        .html("" +
                            "<tr>" +
                            "<td colspan='10000' class='jh-paged-table-query-error'>" + query_error +": "+ resp + "</td>" +
                            "</tr>");
                } else {
                    //if (resp !== "") {/*Response Text*/
                    if (resp.length > 0) {/*Response JSON*/
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
            },
            function(err) { /*Callback Error*/
                $$.log("pagedTable:_query:ajax() error => " + err).error();
            });
    })();

    /**[DONE]
     * Clone
     */
    let clone = 'off';
    (function Clone() {
        if (clone === 'off') return;
        $$.clone('#jh-paged-table-tbody-tr-0').into("#jh-paged-table-tbody");
    })();

    /**[DONE]
     * Requester
     */
    let requester = 'off';
    (function Requester() {
        if (requester === 'off') return;
        console.log($$.requester("./api/data/index.php?initial=1&final=10000&db=csv"));
    })();

    /**[DONE]
     * On Submit
     */
    let on_submit = 'off';
    (function OnSubmit() {
        if (on_submit === 'off') return;
        jH("#jh-grid-form").on('submit', function() {
            console.log("SUBMIT ABORTED !");
            return false;
        });
    })();

    /**[DONE]
     * Sort
     */
    let sort = 'off';
    (function Sort() {
        if (sort === 'off') return;
        /*Number*/ /*[DONE]*/
        let v_number = [11,34,500,3,0,1,2,3,4,5,6,7,8,9,10];
        // $$.log("NUMBER").print("orange");
        // $$.log(v_number).table();
        // $$.log($$.sort(v_number).asIs()).table();
        // $$.log($$.sort(v_number).asNumber('asc')).table();
        // $$.log($$.sort(v_number).asNumber('desc')).table();

        /*String*/ /*[DONE]*/
        let v_string = ["x","f","E","D","C","B","A","a","z", "B10", "b1", "B8", "X9", "B1"];
        // $$.log("STRING").print("orange");
        // $$.log(v_string).table();
        // $$.log($$.sort(v_string).asIs()).table();
        // $$.log($$.sort(v_string).asString('asc')).table();
        // $$.log($$.sort(v_string).asString('desc')).table();

        /*String: no Ascii*/ /*[DONE]*/
        let v_no_ascii = ["test", "óbvio", "javascript", "boné", "égua", "novo", "album"];
        // $$.log("STRING NO ASC").print("orange");
        // $$.log(v_no_ascii).table();
        // $$.log($$.sort(v_no_ascii).asIs()).table();
        // $$.log($$.sort(v_no_ascii).asString('asc')).table();
        // $$.log($$.sort(v_no_ascii).asString('desc')).table();

        /*String: Mixed Values*/ /*[DONE]*/
        let v_mixed = ["VAL 1", "VAL 10", "VAL 12", "VAL 5", "VAL 20", "E","D","C","B","A","a",5,4,3,2,1,"_","b",0,"é","Á"];
        // $$.log("STRING MIXED").print("orange");
        // $$.log(v_mixed).table();
        // $$.log($$.sort(v_mixed).asIs()).table();
        // $$.log($$.sort(v_mixed).asString('asc')).table();
        // $$.log($$.sort(v_mixed).asString('desc')).table();

        /*Matrix: Array/Array*/ /*[DONE]*/
        let matrix = [
            ["COL 0", "COL 1", "COL 2", "COL 3"],
            ["LINE 9", "COL 10", "LINE 4", "ÓZ 123"],
            ["LINE 5", "COL 12", "LINE 7", 34],
            ["LINE 3", "COL 5", "LINE 5", "_Test"],
            ["LINE D", "COL 20", "LINE Z", "alpha"]
        ];
        // $$.log("MATRIX").print("orange");
        // $$.log(matrix).table();
        // $$.log($$.sort(matrix).asIs()).table();
        // $$.log($$.sort(matrix).asMatrix('asc', 1)).table();
        // $$.log($$.sort(matrix).asMatrix('desc', 1)).table();

        /*Array/Object*/ /*[DONE]*/
        let products = [
            {id: 8, name: "Product 34", price: 6.90, stock: 14, desc: "The milk 10 product test"},
            {id: 2, name: "Product 1", price: 4.20, stock: 25, desc: "Á The 1 coffee product test"},
            {id: 4, name: "Product 13", price: 1.50, stock: 6, desc: "One 3 potato product test"},
        ];
        // $$.log("ARRAY/OBJECT").print("orange");
        // $$.log(products).table();
        // $$.log($$.sort(products).asIs()).table();
        // $$.log($$.sort(products).asArray('asc', 'price')).table();
        // $$.log($$.sort(products).asArray('desc', 'price')).table();

        /*Object/Array*/ /*[DONE]*/
        let obj_array = {
            0: ["COL  0", "COL  1", "COL  2", "COL  3"],
            1: ["LINE 9", "LINE 3", "LINE 4", "ÓZ 123"],
            2: ["LINE 5", "LINE 8", "LINE 7", 34],
            3: ["LINE 3", "LINE 2", "LINE 5", "_Test"],
            4: ["LINE D", "LINE W", "LINE Z", "alpha"]
        };
        // $$.log("OBJECT/ARRAY").print("orange");
        // $$.log(obj_array).table();
        // /*$$.log($$.sort(obj_array).asIs()).table();*/
        // $$.log($$.sort(obj_array).asObject('asc', 2)).table();
        // $$.log($$.sort(obj_array).asObject('desc', 2)).table();

        /*Object/Object*/ /*[DONE]*/
        let obj_obj = {
            0: {id: 8, name: "Product 5", price: 6.90, stock: 14, desc: "The milk product test"},
            1: {id: 5, name: "Product 14", price: 7.10, stock: 3, desc: "Zez test abacate product"},
            2: {id: 2, name: "Product 2", price: 4.20, stock: 25, desc: "Á The coffee product test"},
            3: {id: 4, name: "Product 11", price: 1.50, stock: 6, desc: "One potato product test"}
        };
        // $$.log("OBJECT/OBJECT").print("orange");
        // $$.log(obj_obj).table();
        // /*$$.log($$.sort(obj_obj).asIs()).table();*/
        // $$.log($$.sort(obj_obj).asJson('asc', 'name')).table();
        // $$.log($$.sort(obj_obj).asJson('desc', 'name')).table();

        /*Collection*/ /*[DONE]*/
        let collection = jsHunter.fn;
        // $$.log("Collection").print("orange");
        // $$.log(collection).table();
        // /*$$.log($$.sort(collection).asIs()).table();*/
        // $$.log($$.sort(collection).asCollection('asc')).table();
        // $$.log($$.sort(collection).asCollection('desc')).table();

        $$.await(5).run(function() {
            /*Node (DOM)*/ /*[DONE]*/
            // let nodes_matrix = [];
            // for (let i = 0; i < 20; i++) {
            //     nodes_matrix.push($$.toArray(jH("#jh-grid-container-values #jh-grid-line-"+i+" div").select()));
            // }
            // $$.log("Node (DOM)").print("orange");
            // $$.log(nodes_matrix).table();
            // /*$$.log($$.sort(nodes_matrix).asIs()).table();*/
            // $$.log($$.sort(nodes_matrix).asNodes('asc', 3)).table();
            // $$.log($$.sort(nodes_matrix).asNodes('desc', 3)).table();
        });
    })();

    /**[DONE]
     * LocalStorage: $$.storage
     */
    let local_storage = 'off';
    (function LocalStorage() {
        if (local_storage === 'off') return;
        $$.storage('@dockerized/test_1').set('test123');
        console.log($$.storage('@dockerized/test_1').get());
        $$.storage('@dockerized/test_1').remove();
    })();

    /**[DONE]
     * Copy And Paste: $$.copy
     */
    let copy_paste = 'off';
    (function CopyPaste() {
        if (copy_paste === 'off') return;
        /*Sample Strucutre*/
        /*<textarea id="textarea-copy">Text to test A COPY !</textarea>
        <button id="bt-copy-paste">Copy</button>
        <textarea id="textarea-paste"></textarea>*/
        jH('#bt-copy-paste').on('click', function(){
            $$.copy('#textarea-copy');
            $$.paste('#textarea-paste');
        });
    })();

    /**[DONE]
     * Has (key in object)
     */
    let has_key = 'off';
    (function HasKey() {
        if (has_key === 'off') return;
        let obj = {name:"test", total: 1000};
        console.log($$.has('name').in(obj));
    })();

    /**[DONE]
     * Insert [before,after]
     */
    let insert = 'off';
    (function Insert() {
        if (insert === 'off') return;
        let _new_element_ = $$.create({
            element:  "li",
            attr_type: "id",
            attr_name: "jh-galley-li-101",
        });

        $$.insert(_new_element_).first('#jh-gallery-thumbs-menu');
        $$.insert(_new_element_).last('#jh-gallery-thumbs-menu');
    })();

    /**[DONE]
     * Promise
     */
    let promise = 'off';
    (function Promise() {
        if (promise === 'off') return;
        let resp = true;
        let val = 10;

        /*async*/ function app1(res, rej) {
            setTimeout(function() {
                if (resp === true && val === 10) {
                    res("App1 Number is: " + 1);
                } else {
                    rej("App1 Number Error: " + val);
                }
            }, 3000);
        }

        /*async*/ function app2(res, rej) {
            setTimeout(function() {
                if (resp === true && val === 10) {
                    res("App2 Number is: " + 2);
                } else {
                    rej("App2 Number Error: " + val);
                }
            }, 1300);
        }

        /*async*/ function app3(res, rej) {
            setTimeout(function() {
                if (resp === true && val === 10) {
                    res("App3 Number is: " + 3);
                } else {
                    rej("App3 Number Error: " + val);
                }
            }, 2500);
        }

        /*async*/ function first(val) {
            console.log("First: ", val);
            return $$.intNumber(val);
        }

        /*async*/ function firstAll(arr) {
            console.log("First All: ", arr);
            return $$.replaceArray(arr, /[^0-9]/gi, "");
        }

        /*async*/ function firstIgnore(obj) {
            console.log("First Ignore: ", obj);
            return $$.objectMap(obj).toArray();
        }

        /*async*/ function firstRace(obj) {
            console.log("First Race: ", obj);
            return obj;
        }

        /*async*/ function finalize(val) {
            console.log("Finalizing: ", val);
        }

        /*async*/ function rollback(val) {
            console.log("Rollback: ", val);
        }

        $$.promise({timeout: 5, debug: true})
            .run(app1)
            .then([first, finalize, rollback]);

        $$.promise({timeout: 5, debug: true})
            .all([app1, app2, app3])
            .then([firstAll, finalize, rollback]);

        $$.promise({timeout: 5, debug: true})
            .ignore([app1, app2, app3])
            .then([firstIgnore, finalize, rollback]);

        $$.promise({timeout: 5, debug: true})
            .race([app1, app2, app3])
            .then([firstRace, finalize, rollback]);
    })();

    /**[DONE]
     * Password
     */
    let password = 'off';
    (function Password() {
        if (password === 'off') return;
        $$.password("#jh-pass").mouseover();
        $$.password("#jh-pass").mouseclick();
    })();

    /**[DONE]
     * Rand
     */
    let rand = 'off';
    (function Rand() {
        if (rand === 'off') return;
        $$.rand(0, 100).inclusive();
        $$.rand(0, 100).between();
    })();

    /**[DONE]
     * Repeat
     */
    let repeat = 'off';
    (function Repeat() {
        if (repeat === 'off') return;

        console.log($$.repeat(10, 3).asNumber());
        console.log($$.repeat(function(){return $$.rand(1,100).inclusive()}, 10).asNumber());

        console.log($$.repeat("A", 3).asString());
        console.log($$.repeat("A", 3).asString("."));
        console.log($$.repeat("A", 3).asString(":"));
        console.log($$.repeat(function(){return $$.rand(1,100)}, 3).asString("-"));

        console.log($$.repeat("A", 3).asArray());
        console.log($$.repeat(function(){return $$.rand(1,100).inclusive()}, 3).asArray());

        console.log($$.repeat("A", 3).asJson());
        console.log($$.repeat(function(){return $$.rand(1,100).inclusive()}, 3).asJson());
    })();

    /**[DONE]
     * Form [Serialized]
     */
    let form = 'off';
    (function Form() {
        if (form === 'off') return;

        jH("#bt-test-form").on('click', function() {

            let data_json = $$.form('#app-form-test').json();
            console.log(data_json);

            let data_str = $$.form('#app-form-test').stringify();
            console.log(data_str);

            let data_serial1 = $$.form('#app-form-test').serialize(true); /*true, false*/
            let data_serial2 = $$.form('#app-form-test').serialize(false); /*true, false*/
            console.log(data_serial1);
            console.log(data_serial2);

            let data_form_sub = $$.form('#app-form-test').attach("./api/data/files.php", false); /*send files*/

            let data_form = $$.form('#app-form-test').attach(); /*send files*/

            $$.ajax({
                url: "./api/data/files.php",
                data: data_form,
                dataType: 'json'
            }).post(
                function(resp) {
                    console.log("SUCCESS", resp);
                },
                function(err) {
                    console.log("ERROR", err);
                });
        });
    })();

    /**[DONE]
     * MD5
     */
    let md5 = 'off';
    (function MD5() {
        if (md5 === 'off') return;
        $$.log($$.md5("test")).print("orange");
    })();

    /**[DONE]
     * Basename
     */
    let basename = 'off';
    (function Basename() {
        if (basename === 'off') return;
        $$.log($$.basename("test")).print("yellowgreen");
        $$.log($$.basename("path/test")).print("yellowgreen");
        $$.log($$.basename("test.txt")).print("yellowgreen");
        $$.log($$.basename("/path/test")).print("yellowgreen");
        $$.log($$.basename("/test.txt")).print("yellowgreen");
        $$.log($$.basename("/path/test.txt")).print("yellowgreen");
    })();

    /**[DONE]
     * Matcher
     */
    let matcher = 'off';
    (function Matcher() {
        if (matcher === 'off') return;

        function getItems(item) {
            return [item.name].join(" ");
        }

        $$.matcher({
          min_length: 3,
          pattern: ["bar", "monday"], /*string(mon), array(["money", "month"])*/
          source: ["money", "dev", "tools", "news", "query", "money", "more", "free", "monday", "more", "test", "new", "bar1", "monday", "more", "monday", "more", "many", "monday", "more", "free", "monday", "more", "test", "new", "bar", "monday", "more", "foo", "bar"],
          callback: function(rs) { /*optional*/
            // console.log("callback to matcher", rs);
            // console.log(rs.map(x => x.join(' ')).join('\n') + '\n');
            // console.log(rs.map(getItems).join('\n') + '\n');
          }
        }).getMap();/*getArray, getArray2D, getJSON, getCSV, getENV, getMap*/

        let matrix = [
            [0,94,2,4,5,54356,7,7,5,654,65,65,645,4,4,56,7],
            [0,1,2,4,5,6,7,7,5,654,65,65,645,4,4,56,7],
            [0,768,2,4,5,6,7,7,5,546,65,65,534,4,4,56,7],
            [0,1,45,4,5,6,7,66,5,654,65,65,645,4,565,56,7],
            [0,1,2,4,5,534,7,7,5,4,65,65,645,4,4,56,7],
            [0,1,2,55,5,6,7,7,5,654,65,65,645,4,4,56,7],
            [0,1,2,4,5,6,7,675,5,654,65,65,645,4,4,656,7],
            [0,1,66,4,5,6,7,7,5,654,65,65,645,4,4,56,7],
            [0,1,2,45,56,6,7,7,5,654,65,65,645,4,4,56,7],
            [0,1,2,4,5,6,7,7,5,654,65,65,534,4,4,343,7],
            [0,1,656,4,5,6,7,7,5,654,65,65,645,4,4,56,7],
            [0,1,2,4,65,6,7,7,5,654,65,65,656,4,4,989,7],
        ];

        $$.matcher({
            min_length: 3,
            pattern: [5,6,7,7,5], /*string(mon), array(["money", "month"])*/
            source: matrix,
            callback: function(rs) { /*optional*/
                // console.log("callback to matcher", rs);
                // console.log(rs.map(x => x.join(' ')).join('\n') + '\n');
                // console.log(rs.map(getItems).join('\n') + '\n');
            }
        }).getMap();/*getArray, getArray2D, getJSON, getCSV, getENV, getMap*/

    })();

    /**[DONE]
     * Bubble
     */
    let bubble = 'off';
    (function Bubble() {
        if (bubble === 'off') return;

        let arr1 = [1,1,1,1,0,1,0,1];
        let arr2 = [5,9,8,7,4,4,1,2,0,3,9,4,2,3,0,1,0,2,2];
        let arr3 = ["Z", "A", "I", "Z", "P", "B"];

        let bb = $$.bubble(arr1);

        console.log(bb.result(), bb.changes());
    })();

    /**[DONE]
     * Optimize
     */
    let optimize = 'off';
    (function Optimize() {
        if (optimize === 'off') return;

        let arr1 = [0,0,0,1,0,1,1,1,1,0,1,0,1,0,0,0,0,0,0];
        let arr2 = [5,9,8,7,4,4,1,2,0,3,9,4,2,3,0,1,0,2,2];
        let arr3 = ["Z", "T", "T", "T", "R", "A", "I", "T", "A", "B", "T", "E", "T", "T", "X", "T", "T"];

        console.log("SORT");
        let st = $$.optimize(arr1).sort();
        console.log(st);

        console.log("REVERSE");
        let rv = $$.optimize(st).reverse();
        console.log(rv);

        console.log("BALANCE");
        let bl = $$.optimize(arr3).balance("T", 2);
        console.log(bl.toString());
    })();

    /**[DONE]
     * Array Map
     */
    let array_map = 'off';
    (function ArrayMap() {
        if (array_map === 'off') return;

        let k = ["col1", "col2", "col3", "col4"];
        let v = ["val1", "val2", "val3", "val4"];
        let m = [
            ["val1", "val2", "val3", "val4"],
            ["val5", "val6", "val7", "val8"],
            ["val9", "val10", "val11", "val12"]
        ];

        console.log($$.arrayMap(v).keys(k).json());
        console.log($$.arrayMap(m).keys(k).json());

        console.log($$.arrayMap(v).keys(k).collection());
        console.log($$.arrayMap(m).keys(k).collection());
    })();

    /**[DONE]
     * CSV Map
     */
    let csv_map = 'off';
    (function CSVMap() {
        if (csv_map === 'off') return;

        let array_columns = [
            "id","product_name","country","description","price","ratings","warranty",
            "number_ref","code_ref","sap_number","delivery","payment","status","order",
            "customer","address","phone","city","postal_code","extras","additional",
            "restrict","others","send","anchor","created","updated","canceled;"];

        jH("#bt-test-form").on('click', function () {
            function _loadImport(args) {
                // let csv_map = $$.csvMap({
                //     data: args, /*array, matrix, string*/
                //     delimit: ";",
                //     /*cols: [], 0 = get from data[0]*/
                // }).header(0).matrix(); /*.array(), .json(), .collection(), .matrix(), .run(fn)*/
                // console.log("ARGS", args);
                // console.log("CSV MAP", csv_map);

                /*csv com callback, apenas quando usar [type=file]*/
                $$.csvMap({
                    data: args, /*file*/
                    delimit: ";",
                    format: "matrix" /*matrix, collection, json*/
                }).run(function(_csv_map) {
                    console.log("CSV MAP FILE RUN", _csv_map);
                    /*Retorna uma matriz referente ao arquivo csv carregado*/
                });
            }

            // $$.file({
            //     target: "#app_file_csv",
            //     process: "matrix", /*array, matrix, string, base64, none*/
            //     progress: "#app_file_identity_progress"
            // }).readAsBinaryString(_loadImport);

            /*Obter o arquivo utilizado na instância da classe File*/
            let _f_ = $$.file({
                target: "#app_file_csv"
            }).getFile();
            _loadImport(_f_);
        });
    })();

    /**[DONE]
     * Serialize [Extension]
     */
    let serialize = 'off';
    (function Serialize() {
        if (serialize === 'off') return;

        let args = {
            id: 1,
            name: "Test Drive",
            description: "Testing function serialize"
        };

        $$.serialize(args, false);
    })();

    /**[DONE]
     * Open
     */
    let open = 'off';
    (function Open() {
        if (open === 'off') return;

        $$.open({
            target: "_blank",
            toolbar: false,
            scrollbars: false,
            resize: false,
            top: 0,
            left: 0,
            size: "400x400"
        }).url("https://www.jshunter-lib.com");

        $$.open({
            target: "_blank",
            toolbar: true,
            scrollbars: true,
            resize: true,
            top: 0,
            left: 0,
            size: "400x400"
        }).write("jsHunter is a javascript library...");
    })();

    /**[DONE]
     * Redirect
     */
    let redirect = 'off';
    (function Redirect() {
        if (redirect === 'off') return;
        $$.redirect("http://www.jshunter-lib.com");
    })();

    /**[TODO]
     * Translate [Extension]
     */
    let translate = 'off';
    (function Translate() {
        if (translate === 'off') return;
        $$.translate("Missing Title").to("pt-br");
    })();

    /*-----------------------------------------------------------------------------------
    Components and Extension
    ------------------------------------------------------------------------------------*/

    /**[DONE]
     * Presenter
     */
    let presenter = 'off';
    (function Presenter() {
        if (presenter === 'off') return;
        $$.presenter(
            {
                target: "body",
                message: "Everything Fine !",
                timer: 2000,
                theme: "default", /*default,dark,light*/
                effect: "fade" /*fade,blink,top-down*/
            },
            function(rsp) {
                $$.alert("OK: " + rsp);
            },
            'test');
    })();

    /**[DONE]
     * Typist
     */
    let typist = 'off';
    (function Typist() {
        if (typist === 'off') return;
        $$.typist({
            target: "#jh-typist-container",
            time: 40,
            text: "Text to test a typist of the jsHunter",
            loop: true,
            control_loop: 5000
        }).run();
    })();

    /**[DONE]
     * Alert
     */
    let alert = 'off';
    (function Alert() {
        if (alert === 'off') return;
        $$.alert({
            title: "Error",
            text: "Select a valid CONFIGURATION SETUP (true|false) !",
            theme: "dark", /*default,dark,light*/
            button: "OK"
        });
    })();

    /**[DONE]
     * Confirm
     */
    let confirm = 'off';
    (function Confirm() {
        if (confirm === 'off') return;
        $$.confirm({
            title: "Warning",
            question: "Are you sure that you want to save the data ?",
            theme: "dark", /*default,dark,light*/
            buttons: ["Yes", "No"]
        }, function(args){
            $$.alert("OK: " + args);
        }, "myArgs");
    })();

    /**[DONE]
     * Tooltip
     */
    let tooltip = 'off';
    (function Tooltip() {
        if (tooltip === 'off') return;
        $$.tooltip({
            text: "Javascript Tooltip for Default !",
            timer: 500,
            timeout: 2500,
            theme: "default"
        }).default();

        $$.tooltip({
            text: "Javascript Tooltip for Success !",
            timer: 4000,
            timeout: 2500,
            theme: "default"
        }).success();

        $$.tooltip({
            text: "Javascript Tooltip for Error !",
            timer: 7500,
            timeout: 2500,
            theme: "default"
        }).error();
    })();

    /**[DONE]
     * modalTheme
     */
    let modal_theme = 'off';
    (function ModalTheme() {
        if (modal_theme === 'off') return;
        $$.modalTheme({
            timeout: 0, //time to automatic close
            theme: "default",
            lock_back_color: 'none', //css class defined by library: back-dark-alpha, back-white
            effect: 'inside-out', //inside-out, none
            content: {
                back_color: 'none', //css class defined by library: back-dark-alpha, back-white
                title: 'Title Test 123', //string
                body: 'Content of body', //string
                footer: 'Sample Footer' //string, false
            }
        });
    })();

    /**[DONE]
     * Toaster
     */
    let toaster = 'off';
    (function Toaster() {
        if (toaster === 'off') return;
        let short_text = "" +
        "This is a text test to error sample<br />" +
        "This is a text test to error sample<br />" +
        "This is a text test to error sample<br />" +
        "This is a text test to error sample<br />";

        $$.toaster({
            type: "default",
            text: short_text,
            timeout: 2500
        });

        $$.toaster({
            type: "default",
            text: "This is a text test to default sample 2",
            timeout: 2500
        });

        $$.toaster({
            type: "success",
            text: "This is a text test to success sample",
            timeout: 2500
        });

        let long_text = "" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />" +
            "This is a text test to error sample<br />";
        $$.toaster({
            type: "error",
            text: long_text,
            timeout: 2500
        });

        $$.toaster({
            type: "error",
            text: "This is a text test to error sample",
            timeout: 2500
        }).confirm( function() {
            $$.tooltip({
                text: "Hi, I'm a callback test to error sample",
                timer: 4000,
                timeout: 2500,
                theme: "default"
            }).default();
        });

        $$.toaster({
            type: "info",
            text: "This is a text test to info sample",
            timeout: 2500
        });

        $$.toaster({
            type: "warning",
            text: "This is a text test to warning sample",
            timeout: 2500
        });
    })();

    /**[DONE]
     * Notifier
     */
    let notifier = 'off';
    (function Notifier() {
        if (notifier === 'off') return;
        let loremIpsum = "" +
            "<h3>LGPD</h3>\n" +
            "<br/>\n" +
            "It is a long established fact that a reader will be distracted by the readable content of\n" +
            "a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less\n" +
            "normal distribution of letters, as opposed to using 'Content here, content here', making it look\n" +
            "like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum\n" +
            "as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in\n" +
            "their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on\n" +
            "purpose (injected humour and the like).";
        $$.notifier({
            title: "My Notifier",
            text: loremIpsum,
            theme: "default"
        }).callback(function(rsp) {
            $$.alert("OK: " + rsp);
        }, "myArgs");
    })();

    /**[DONE]
     * Slider
     */
    let slider = 'off';
    (function Slider() {
        if (slider === 'off') return;
        /*Sample Structure*/
        /*<div id="jh-slider-container">
            <div class="jh-slider-images">
                <img alt='' src="../media/img/image-0.jpg" class="slider-images"/>
                <img alt='' src="../media/img/image-1.jpg" class="slider-images"/>
                <img alt='' src="../media/img/image-2.jpg" class="slider-images"/>
                <img alt='' src="../media/img/image-3.jpg" class="slider-images"/>
            </div>
        </div>*/
        $$.slider({
            presenter: false,
            controls: true,
            timeout: 3000,
            timer_fade: 10,
            mode: "fade", //fade, slide, mixed, diagonal
            theme: "default", /*default, dark, light*/
            width: "100%",
            height: "700px",
            /*images: [
                "../media/img/image-0.jpg",
                "../media/img/image-1.jpg",
                "../media/img/image-2.jpg",
                "../media/img/image-3.jpg"
            ]*/
        });
    })();

    /**[DONE]
     * Slider Box
     */
    let slider_box = 'off';
    (function SliderBox() {
        if (slider_box === 'off') return;
        /*Sample Structure*/
        /*.slider-box-person-0 {
            padding-top: 100px;
            text-align: center;
            font-size: 50px;
            color: #FFFFFF !important;
            background: #282931 !important;
        }

        .slider-box-person-0 h1 {
            text-align: left;
            padding: 20px;
            border-bottom: solid #d000ff 5px;
        }

        .slider-box-person-0 p {
            font-size: 40px;
            text-align: left;
            padding: 20px;
            color: #89da3b;
            letter-spacing: 3px;
            line-height: 60px;
        }

        .slider-box-person-1 {
            padding-top: 100px;
            text-align: center;
            font-size: 50px;
            color: #FFFFFF !important;
            background: #a93b14 !important;
        }

        .slider-box-person-2 {
            padding-top: 100px;
            text-align: center;
            font-size: 50px;
            color: #FFFFFF !important;
            background: #801871 !important;
        }
        <div id="jh-slider-container">
            <div className="jh-slider-box">
                <div id="jh-slider-box-0" className="slider-box slider-box-person-0">
                    <h1>Box 1</h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type
                        specimen book.
                    </p>
                </div>
                <div id="jh-slider-box-1" className="slider-box slider-box-person-1">
                    <h1>Box 2</h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                </div>
                <div id="jh-slider-box-2" className="slider-box slider-box-person-2">
                    <h1>Box 3</h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div id="jh-slider-box-3" className="slider-box">
                    <h1>Box 4</h1>
                    <h3>
                        There are many variations of passages of Lorem Ipsum available,
                        but the majority have suffered alteration in some form, by injected
                        humour, or randomised words which don't look even slightly believable.
                    </h3>
                </div>
            </div>
        </div>*/

        $$.sliderBox({
            presenter: false,
            controls: true,
            timeout: 5000,
            timer_fade: 10,
            mode: "fade", //fade, slide, mixed, diagonal
            theme: "default", /*default, dark, light*/
            width: "100%",
            height: "700px"
        });

        $$.typist({
            target: "#target-typist-text",
            speed: 10,
            timeout: 3000,
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
                " when an unknown printer took a galley of type and scrambled it to make a type " +
                " specimen book.",
            loop: true
        }).run();
    })();

    /**[DONE]
     * Viewer
     */
    let viewer = 'off';
    let type = 'image'; /*image, pdf, html*/
    (function Viewer() {
        if (viewer === 'off') return;
        (function ViewerImage() {
            if (type !== 'image') return;
            $$.viewer({
                type: "img",
                src: "../media/img/arara-amarela.jpg",
                alt: "Image Test",
                title: "Image Test",
            }).callback(function() {
                console.log("test image");
            });
        })();
        (function ViewerPdf() {
            if (type !== 'pdf') return;
            $$.viewer({
                type: "pdf",
                file: "../media/pdf/USG_CAROL_ISAAC.pdf"
            });
        })();
        (function ViewerHtml() {
            if (type !== 'html') return;
            let html = '<div id="div-viewer-person">\n' +
                '            <h1>Viewer</h1>\n' +
                '            <img alt="" src="../media/img/idico.jpg" />\n' +
                '            <p>\n' +
                '                There are many variations of passages of Lorem Ipsum available,\n' +
                '                but the majority have suffered alteration in some form, by injected\n' +
                '                humour, or randomised words which don\'t look even slightly believable.\n' +
                '            </p>\n' +
                '        </div>';
            $$.viewer({
                type: "html",
                html: html
            });
        })();
    })();

    /**[DONE]
     * Gallery
     */
    let gallery = 'off';
    (function Gallery() {
        if (gallery === 'off') return;
        $$.gallery({
            use_thumbs: true,
            filepath: "./media/img/original/",
            thumbs_hover: false,
            speed_frames: "default", /*slow: 8000s, moderate|default: 4000s, fast: 1000s*/
            auto_play: true,
            active_thumbs: true,
            auto_close_thumbs: true,
            active_player: true,
            auto_close_player: true,
            theme: 'default'
        });
    })();

    /**[DONE]
     * Paginate
     */
    let paginate = 'off';
    (function Paginate() {
        if (paginate === 'off') return;
        function pageFaker(p) {console.log("pageFaker", p);
            $$.paginate({
                lang: "en",
                target: '#div-container-results',
                pager_info: true,
                total_items: total_items/*_data_.length*/, /*total results*/
                page: p, /*current page*/
                items_show: 40,
                max_pager: 20,
                theme: "default", /*default, dark, light, modern, discreet*/
                use_button: true, /*default, dark, light, modern, discreet*/
            }).callback(function(arg, pag) {
                console.log("pageFaker:Paginate", arg, pag);
                pageFaker(pag);
            }, "myArgs");
        }

        $$.paginate({
            lang: "en",
            target: '#div-container-results',
            pager_info: true,
            total_items: total_items/*_data_.length*/, /*total results*/
            page: 1, /*current page*/
            items_show: 40,
            max_pager: 20,
            theme: "default", /*default, dark, light, modern, discreet*/
            use_button: true, /*default, dark, light, modern, discreet*/
        }).callback(function(arg, pag) {
            console.log("Paginate", arg, pag);
            pageFaker(pag);
        }, "myArgs");
    })();

    /**[DONE]
     * Jumper
     */
    let jumper = 'off';
    (function Jumper() {
        if (jumper === 'off') return;
        $$.jumper({
            jumper_target: "#div-container-results",
            jumper_range: _range_,
            bottom: "0px",
            theme: "dark", /*default,dark,light*/
            lang: "pt-br"
        }).run(function(rsp, idx){
            console.log("Jumper: ", rsp, idx);
        }, "myArgs");
    })();

    /**[DONE]
     * SmartPager
     */
    let smart_pager = 'off';
    (function SmartPager() {
        if (smart_pager === 'off') return;
        function pageFaker(p) {console.log("pageFaker", p);
            $$.smartPager({
                lang: "en",
                theme: "default", /*default, dark, light, modern, discreet*/
                target: '#div-container-results',
                pager_info: true,
                total_items: total_items/*_data_.length*/, /*total results*/
                page: p, /*current page*/
                items_show: 20,
                max_pager: 10,
                jumper: true,
                jumper_fix: true,
                use_button: true, /*default, dark, light, modern, discreet*/
            }).callback(function(arg, pag) {
                console.log("pageFaker:smartPager", arg, pag);
                pageFaker(pag);
            }, "myArgs");
        }

        $$.smartPager({
            lang: "en",
            theme: "default", /*default, dark, light, modern, discreet*/
            target: '#div-container-results',
            pager_info: true,
            total_items: total_items/*_data_.length*/, /*total results*/
            page: 1, /*current page*/
            items_show: 20,
            max_pager: 10,
            jumper: true,
            use_button: true, /*default, dark, light, modern, discreet*/
        }).callback(function(arg, pag) {
            console.log("smartPager", arg, pag);
            pageFaker(pag);
        }, "myArgs");
    })();

    /**[DONE]
     * Paged Table
     */
    let paged_table = 'off';
    (function pagedTable() {
        if (paged_table === 'off') return;
        function _pagedTable(p) {
            let _page_ = p.page;
            let _product_name_ = p.product_name;
            let _limit_ = p.limit;
            let _items_show_ = p.items_show;
            let _max_pager_ = p.max_pager;

            $$.pagedTable({
                    /*Settings*/
                    target: "#div-paged-table-result",
                    table_title: "Title Test",
                    table_caption: "Footer Test",
                    bordered: false,
                    collapsed: true, /*true=collapse or false=no-collapse*/
                    theme: "dark", /*default, dark, light*/
                    lang: "pt-br",
                    items_show: _items_show_, /*Quantity of items per page*/

                    /*If mode Default (processing by application)*/
                    renderize: {
                        active: false,
                        data: "" /*_data_object_, _data_object2_, _data_array_, _data_array2_*/
                    },

                    /*If mode Ajax (automatic query by pagedTable)*/
                    query_renderize: {
                        active: true,

                        /*Query String*/
                        // url: "./api/data/index.php?db=csv&product_name=Product&limit=10000",
                        // params: "db=csv&product_name=Product&limit=10000",

                        /*Json*/
                        url: "./api/data/index.php",
                        params: {db: "csv", product_name: _product_name_, limit: _limit_},

                        data_type: "json", /*Tipo de dado esperado do servidor*/
                        content_type: "application/json" /*Tipo de dados a ser enviado para o servidor*/
                    },

                    /*If search*/
                    search: true,

                    /*If paginate: config*/
                    paginate: {
                        active: true,
                        page: _page_,
                        max_pager: _max_pager_,
                        jumper: true,
                    }
                }, _columns_
            ).run(function (rsp) {
                console.log("[callback] PagedTable", rsp);
            }, "myArgs");
        }

        _pagedTable({
            page: 1,
            product_name: "Product",
            limit: 10000,
            items_show: 20,
            max_pager: 20
        });

        jH("#button-app-send").on('click', function() {
            let search = jH("#input-app-search").val();
            let limit = jH("#input-app-search-limit").val();

            if (search !== "" && limit !== "") {
                _pagedTable({
                    page: 1,
                    product_name: encodeURIComponent(search),
                    limit: limit,
                    items_show: 20,
                    max_pager: 20
                });
            } else {
                $$.alert("Please type a Product Name and Limit !");
            }
        });
    })();

    /**[DONE]
     * Icons
     */
    let icons = 'off';
    (function Icons() {
        if (icons === 'off') return;
        jH("#icon-tests")
            .html($$.icons({
                icon: "like",
                size: "s-32",
                color: "#FFFFFF",
                border: "#888888"
            }).draw());

        jH("#icon-tests")
            .append($$.icons({
                icon: "unlike",
                size: "s-32",
                color: "#FFFFFF",
                border: "#888888"
            }).draw());

        jH("#icon-tests")
            .append($$.icons({
                icon: "like2",
                size: "s-32",
                color: "#281ec0"
            }).draw());

        jH("#icon-tests")
            .append($$.icons({
                icon: "unlike2",
                size: "s-32",
                color: "#281ec0"
            }).draw());

        jH("#icon-tests")
            .append($$.icons({
                icon: "apple",
                size: "s-32",
                color: "#281ec0"
            }).draw());

        jH("#icon-tests")
            .append($$.icons({
                icon: "new",
                size: "s-32",
                color: "#281ec0"
            }).draw());

        jH("#div-container-icons")
            .html($$.icons({
                icon: "star",
                size: "s-32", /*s-32, s-48, s-64, s-72, s-96, s-128, s-256, s-512 [pixels]*/
                color: "#FAC917"
            }).draw());

        jH("#div-container-icons")
            .append($$.icons({
                icon: "half_star",
                size: "s-32", /*s-32, s-48, s-64, s-72, s-96, s-128, s-256, s-512 [pixels]*/
                data: "456",
                color: "#FAC917"
            }).draw());

        jH("#div-container-icons")
            .append($$.icons({
                icon: "half_star2",
                size: "s-32", /*s-32, s-48, s-64, s-72, s-96, s-128, s-256, s-512 [pixels]*/
                data: '123',
                color: "#FAC917"
            }).draw());

        jH("#div-container-icons")
            .append($$.icons({
                icon: "loading",
                size: "s-32", /*s-32, s-48, s-64, s-72, s-96, s-128, s-256, s-512 [pixels]*/
                data: '123',
                color: "#454545"
            }).draw());
    })();

    /**[DONE]
     * Queue
     */
    let queue = 'off';
    (function Queue() {
        if (queue === 'off') return;
        function backEndAppProcessSync(item) {
            console.log("Processing", "Id", item.id, "Status", item.status);
            if (item.status === 'pendent') {
                console.log("APP: ERRO NO PROCESSAMENTO", item.id);
                return {
                    status: false,
                    message: "Erro no processamento do item: " + item.id + ", Status esta pendente !"
                };
            } else {
                console.log("APP: PROCESSADO COM SUCESSO", item.id);
                return {
                    status: true,
                    message: "PROCESSADO COM SUCESSO: "+item.id
                };
            }
        }

        function backEndAppProcessAsync(resolve, reject, item) {
            let timer = 3000;
            if (item.id === '00002' || item.id === '00005') timer = 5000;
            if (item.id === '00003') timer = 2300;
            if (item.id === '00004') timer = 12500;

            console.log("Processando Item", item.id, "Status", item.status);

            setTimeout(function() {
                if (item.status === 'pendent') {
                    console.log("APP-Async: ERRO NO PROCESSAMENTO", item.id);
                    reject({
                        item: item.id,
                        status: false,
                        message: "Erro no processamento do item: " + item.id + ", Status esta pendente !"
                    });
                } else {
                    console.log("APP-Async: PROCESSADO COM SUCESSO", item.id);
                    resolve({
                        item: item.id,
                        status: true,
                        message: "Item Processado com sucesso: "+item.id
                    });
                }
            }, timer);
        }

        $$.queue({
            theme: "default",
            lang: "pt-br",
            target: "box", /*#div-container-queue, log, box*/
            timeout: 75, /*seconds*/
            async: true, /*true[use promise], false*/
            key: "id", /*identity in items*/
            debug: false, /*log, true, false*/
            items: [
                {
                    id: "00001",
                    name: "Item Name 1",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "pay"
                },
                {
                    id: "00002",
                    name: "Item Name 2",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "pendent"
                },
                {
                    id: "00003",
                    name: "Item Name 3",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "processing"
                },
                {
                    id: "00004",
                    name: "Item Name 4",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "pay"
                },
                {
                    id: "00005",
                    name: "Item Name 5",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "pendent"
                },
                {
                    id: "00006",
                    name: "Item Name 6",
                    description: "Test Item in queue: jshunter",
                    price: "$ 19,00",
                    status: "processing"
                },
            ]
        }).run(function(resolve, reject, item) {
            // return backEndAppProcessSync(item);
            return backEndAppProcessAsync(resolve, reject, item);
        });
    })();

    /**[DONE]
     * Rater
     */
    let rater = 'off';
    (function Rater() {
        if (rater === 'off') return;
        let _items_ = {
            "1000001" : [
                {
                    item_id: "1000001",
                    image: "./media/img/audio.png",
                    price: "R$ 300,00",
                    name: 'Rating 1000001',
                    description: "1 Produto Novo 30x30 preto com bordas arredondadas Lorem Ipsum is simply dummy...",
                    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, ' +
                        'when an unknown printer took a galley of type and scrambled it to make a type ' +
                        'specimen book.',
                    /*stars: [{
                        1: "8", 2: "22", 3: "7", 4: "10", 5: "38"
                    }],*/
                    stars: {
                        1: "5", 2: "2", 3: "43", 4: "34", 5: "99"
                    },
                    /*stars: ["8", "22", "7", "10", "38"],*/
                    /*calculate: {
                        result: "4,0",
                        ratings: "10"
                    }*/
                }
            ],
            "1000002" : [
                {
                    item_id: "1000002",
                    price: "R$ 200,00",
                    image: "./media/img/nvidia.png",
                    name: 'Rating 1000002',
                    description: "2 Produto Novo 30x30 preto com bordas arredondadas Lorem Ipsum is simply dummy...",
                    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, ' +
                        'when an unknown printer took a galley of type and scrambled it to make a type ' +
                        'specimen book.',
                    /*stars: [{
                        1: "8", 2: "22", 3: "7", 4: "10", 5: "38"
                    }],*/
                    /*stars: {
                        1: "8", 2: "22", 3: "7", 4: "10", 5: "38"
                    },*/
                    stars: ["8", "45", "7", "10", "15"],
                    calculate: {
                        result: "2.7",
                        ratings: "85"
                    }
                }
            ],
            "1000003" : [
                {
                    item_id: "1000003",
                    image: "./media/img/motherboard.png",
                    price: "R$ 250,00",
                    name: 'Rating 1000003',
                    description: "3 Produto Novo 30x30 preto com bordas arredondadas Lorem Ipsum is simply dummy...",
                    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, ' +
                        'when an unknown printer took a galley of type and scrambled it to make a type ' +
                        'specimen book.',
                    /*stars: [{
                        1: "8", 2: "22", 3: "7", 4: "10", 5: "38"
                    }],*/
                    stars: {
                        1: "11", 2: "22", 3: "5", 4: "10", 5: "25"
                    },
                    /*stars: ["8", "22", "7", "10", "38"],*/
                    /*calculate: {
                        result: "4,0",
                        ratings: "10"
                    }*/
                }
            ],
        };
        let _comments_ = {
            "1000001": [
                {
                    id: "01",
                    title: "Ótimo Produto 01",
                    message: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 3,
                    likes: 1000,
                    unlikes: 100,
                    confused: 10
                },
                {
                    id: "02",
                    title: "Bom 01",
                    message: "I'm fine with this product, but It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 4,
                    likes: 34,
                    unlikes: 2,
                    confused: 2
                },
                {
                    id: "03",
                    title: "Não Gostei 01",
                    message: "The product was broken and it was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 1,
                    likes: 45,
                    unlikes: 20,
                    confused: 7
                }
            ],
            "1000002": [
                {
                    id: "04",
                    title: "Ótimo Produto 02",
                    message: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 3,
                    likes: 1000,
                    unlikes: 100,
                    confused: 4
                },
                {
                    id: "05",
                    title: "Bom 02",
                    message: "I'm fine with this product, but It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 4,
                    likes: 34,
                    unlikes: 2,
                    confused: 9
                },
                {
                    id: "06",
                    title: "Não Gostei 02",
                    message: "The product was broken and it was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 1,
                    likes: 45,
                    unlikes: 20,
                    confused: 19
                }
            ],
            "1000003": [
                {
                    id: "07",
                    title: "Péssimo Produto 03",
                    message: "Sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 3,
                    likes: 20,
                    unlikes: 9,
                    confused: 1
                },
                {
                    id: "08",
                    title: "Satisfeito 03",
                    message: "I'm fine with this product, but It was popularised in the 1960s with the release.",
                    stars: 4,
                    likes: 34,
                    unlikes: 2,
                    confused: 3
                },
                {
                    id: "09",
                    title: "Gostei 03",
                    message: "The product was broken and it was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    stars: 1,
                    likes: 45,
                    unlikes: 20,
                    confused: 2
                }
            ],
        };

        function simulateCommentsLike(args) {
            if (args.reaction === "like") {
                $$.log("App: Like: " + $$.objectMap(args).toString()).print("yellowgreen");
            } else if(args.reaction === "like-cancel") {
                $$.log("App: Like-Cancel: " + $$.objectMap(args).toString()).print("red");
            } else if(args.reaction === "unlike") {
                $$.log("App: Unlike: " + $$.objectMap(args).toString()).print("yellowgreen");
            } else if(args.reaction === "unlike-cancel") {
                $$.log("App: Unlike-Cancel: " + $$.objectMap(args).toString()).print("red");
            } else if(args.reaction === "confused") {
                $$.log("App: Confused: " + $$.objectMap(args).toString()).print("yellowgreen");
            } else if(args.reaction === "confused-cancel") {
                $$.log("App: Confused-Cancel: " + $$.objectMap(args).toString()).print("red");
            }
            return true;
        }

        function simulateAddComment(args) {
            console.log("App: Rate by Comment is Done: ", args);

            let get_counter = simulateCountComments();

            function simulateCountComments() {
                let counter = 0;
                let _comments_fake_ = $$.objectMap(_comments_).toArray();
                for (let i = 0; i < _comments_fake_.length; i++) {
                    counter += _comments_fake_[i][1].length;
                }
                return (counter+1)*15;
            }

            function simulateInsertComment() {
                _comments_[args.item_id].push(
                    {
                        id: get_counter,
                        title: args.title,
                        message: args.message,
                        stars: args.stars,
                        likes: 0,
                        unlikes: 0,
                        confused: 0
                    });
                return true;
            }

            if (simulateInsertComment()) {
                return {
                    id: get_counter,
                    status: true
                };
            }

            return {
                status: false
            };
        }

        function simulateGetComments(item_id) {
            let _comments_fake_ = $$.objectMap(_comments_).toArray();
            for (let i = 0; i < _comments_fake_.length; i++) {
                if (_comments_fake_[i][0] === item_id) {
                    return _comments_fake_[i][1];
                }
            }
        }

        function simulateRaterComment(args) {
            console.log("App: Rater comment is Done: ", args);
            return {
                id: "05", /*id do comentário*/
                status: true /*resultado da action*/
            };
        }

        function simulateQuickRater(args) {
            /*action to execute when click in rater*/
            // $$.alert("Hi! I'm a rating..." + arg);
            // $$.log("Hi! I'm a rating..." + args).print();
            console.log("App: Hi! I'm a rating...", args);
            return true;
        }

        /*Elementos Distintos*/
        $$.raterPlug({
            theme: "default",
            lang: "pt-br", /*pt-br, en, es*/
            target: "#div-container-icons",
            size: "large", /*small, medium, large*/
            background: "#FFFFFF", /*[COLOR_HEXADECIMAL], null*/
            effect: "slide", /*none, slide, fade*/
            shadow: true, /*true,false*/
            preview: true, /*true, false*/
            result: true, /*true, false*/
            ratings: true, /*true, false*/
            rate: true, /*true, false*/
            stars_size: [18, 32, 42],
            star_color: "#FAC917", /*Hexadecimal-Color: #FAC917(default)*/
            data: _items_,
            // data: [{1: "0", 2: "0", 3: "2", 4: "3", 5: "5"}],
            // data: [0, 0, 2, 3, 5],
            // data: {
            //     result: "4,0",
            //     ratings: 10
            // },
            /*action: {
                type: "cookie",
                name: "app-name@stars"
            },*/
            /*action: {
                type: "quick",
                callback: function (args) {
                    return simulateQuickRater(args);
                },
            },*/
            /*action: {
                type: "rate",
                max_digits: 130,
                callback: function (args) {
                    return simulateRaterComment(args);
                }
            },*/
            action: {
                type: "comments",
                item: {
                    active: true
                },
                progress: true,
                rate: {
                    active: true,
                    max_digits: 90,
                    callback: function (args) {
                        return simulateAddComment(args);
                    }
                },
                // comments: {/*comments already loaded*/
                //     active: true,
                //     data: _comments_
                // },
                comments: {/*comment load dynamically*/
                    active: true,
                    callback: function (id) {
                        return simulateGetComments(id);
                    }
                },
                like: {
                    active: true,
                    confused: false, /*true,false*/
                    callback: function (args) {
                        return simulateCommentsLike(args);
                    }
                }, /*true, false*/
            }
        }).run();

    })();

    /**[DONE]
     * Sticker
     */
    let sticker = 'off';
    (function Sticker() {
        if (sticker === 'off') return;

        $$.sticker({
            type: "confirm",
            target: "body",
            text: "Deseja salvar os dados no banco de dados ?" +
                "<br />" +
                "<small>Você ainda poderá executar esta ação posteriormente, " +
                "basta passar o mouse sobre o icone de ajuda desse mensageiro</small>",
            action: function() {
                console.log("Sticker is running...");
            },
            theme: "default",
            lang: "pt-br"
        }).run();
    })();

    /**[DONE]
     * Rollup
     */
    let rollup = 'off';
    (function Rollup() {
        if (rollup === 'off') return;

        $$.rollup({
            theme: "default",
            lang: "pt-br",
            offset: 200 /*optional: pixels*/
        });
    })();

    /**[DONE]
     * File
     */
    let file = 'off';
    (function File() {
        if (file === 'off') return;

        function testImport(args, my_args = "") {
            console.log("testImport", args, my_args);
        }

        jH("#bt-test-form").on('click', function() {
            console.log("Details",
                $$.file({
                    target: "#app_file_identity",
                    process: "string" /*array, matrix, string, base64, none*/
                }).details());

            $$.file({
                target: "#app_file_identity",
                process: "string" /*array, matrix, string, base64, none*/
            }).readAsText(testImport, "My Args");

            $$.file({
                target: "#app_file_identity",
                process: "string" /*array, matrix, string, base64, none*/
            }).readAsBinaryString(testImport);

            $$.file({
                target: "#app_file_identity",
                process: "string" /*array, matrix, string, base64, none*/
            }).readAsDataURL(testImport);

            $$.file({
                target: "#app_file_identity",
                process: "string" /*array, matrix, string, base64, none*/
            }).readAsArrayBuffer(testImport);

            //DONE: PROGRESS

            $$.file({
                target: "#app_file_identity",
                process: "none", /*array, matrix, string, base64, none*/
                progress: "#app_file_identity_progress" /*[optional] target:id*/
            }).readAsArrayBuffer(testImport, "My Args");

            $$.file({
                target: "#app_file_identity",
                process: "array", /*array, matrix, string, base64, none*/
                progress: "#app_file_identity_progress" /*[optional] target:id*/
            }).readAsBinaryString(testImport, "My Args");

            $$.file({
                target: "#app_file_identity",
                process: "array" /*array, matrix, string, base64, none*/
            }).readAsBinaryString(testImport, "My Args");
        });
    })();

    /**[DONE]
     * Draggable
     */
    let draggable = 'off';
    (function Draggable() {
        if (draggable === 'off') return;

        $$.draggable({
            elements: ["#app-draggable-container .app-draggable-container"],
            anime: "slow", /*none, slow, fast*/
            tab_bottom: false /*true = default, false*/
        }).drag(function (args) {
            console.log("Drag is running", args);
        });

        /*$$.draggable({
            target: "#app-draggable-drop",
            elements: ["#app-container-elements .app-elements-drop"],
            effect: "copy",
            append: true
        }).component({
            drop: function(args) {
                console.log("Drop is active..", args);
            },
            enter: function(args) {
                console.log("Enter is active..", args);
            },
            over: function(args) {
                console.log("Over is active..", args);
            },
            exit: function(args) {
                console.log("Exit is active..", args);
            },
        });*/

    })();

    /**[DONE]
     * Progress
     */
    let progress = 'off';
    (function Progress() {
        if (progress === 'off') return;

        let _steps_ = 10;
        let _count_ = 0;

        let pg = $$.progress({
            target: "body", /*target element*/
            draggable: true, /*true, false = default*/
            text: "Progress Message Test", /*any text [optional]*/
            steps: _steps_, /*total steps to finish progress [mandatory]*/
        }).run(function anyFunc(args) {
            console.log("progress is running...", args);
        }, "Testing args...");

        let _time_ = setInterval(function() {
            _count_++;
            if (_count_ === _steps_) {
                clearInterval(_time_);
                /*setTimeout(function() {
                    pg.close();
                }, 2000);*/
            }
            pg.update();
        }, 100);
    })();

    /**[WORK]
     * Grid
     */
    let grid = 'on';
    (function Grid() {
        if (grid === 'off') return;

        function _buildGrid(p) {
            let _page_ = p.page;
            let _product_name_ = p.product_name;
            let _limit_ = p.limit;
            let _items_show_ = p.items_show;
            let _max_pager_ = p.max_pager;
            let instance_grid = null;

            $$.grid({
                /*Settings*/
                debug: true,
                theme: "default", /*default, dark, light*/
                lang: "en",
                target: "#div-app-grid-container", /*jh-container-fixed, div-paged-table-result*/
                loading: true,

                /*Identify the PK in data structure grid*/
                identify_key: {
                    active: true,
                    col: 0,
                    id: 'id'
                },

                /*If mode Default (processing by application)*/
                renderize: {
                    active: false,
                    data: "" /*_data_object_, _data_object2_, _data_array_, _data_array2_*/
                },

                /*If mode Ajax (automatic query by smartPager)*/
                query_renderize: {
                    active: false,

                    /*Query String*/
                    // url: "./api/data/index.php?db=csv&product_name=Product&limit=10000",
                    // params: "db=csv&product_name=Product&limit=10000",

                    /*Json*/
                    url: "./api/data/index.php",
                    params: {db: "csv", product_name: _product_name_, limit: _limit_},

                    data_type: "json", /*Tipo de dado esperado do servidor*/
                    content_type: "application/json" /*Tipo de dados a ser enviado para o servidor*/
                },

                /*When paginate.backend_paginate is true, use this*/
                query_paginate: {
                    active: true,

                    /*Query String*/
                    // url: "./api/data/paginate.php?db=csv&product_name=Product",
                    // params: "db=csv&product_name=Product",

                    /*Json*/
                    url: "./api/data/paginate.php",
                    params: {db: "csv", product_name: _product_name_, page: _page_, limit: _limit_},
                    url_export: "./api/data/index.php",

                    data_type: "json", /*Tipo de dado esperado do servidor*/
                    content_type: "application/json" /*Tipo de dados a ser enviado para o servidor*/
                },

                /*If filter : Search Box in Grid Left Top*/
                filter: true,

                /*Set which controls should be shown*/
                controls: {
                    active: true,
                    items: [
                        {
                            name: "new",
                            action: function(resolve, reject, args) {
                                $$.ajax({
                                    url: "./api/data/new.php",
                                    data: JSON.stringify(args),
                                    dataType: 'json',
                                    contentType: "application/json"
                                }).post(
                                    function(resp) {
                                        if (resp.status.toString() === "1") {
                                            $$.log("Application Ok: " + resp).print("cyan");
                                            resolve(resp);
                                        } else {
                                            $$.log("Application Error: " + resp).print("orange");
                                            reject(resp);
                                        }
                                    },
                                    function(err) {
                                        $$.log("Application Error: " + err).print("orange");
                                        resolve(false);
                                    });
                            }
                            // action: "https://localhost.test/product"
                        },
                        {
                            name: "search",
                            action: function(args) {
                                /**
                                 * Essa funcionalidade só é usada quando o modo usado é renderize
                                 */
                                console.log(args);
                                $$.alert("SEND: SEARCH CONTROL CLICKED");
                            }
                        },
                        {
                            name: "import",
                            action: function(resolve, reject, args) {
                                $$.ajax({
                                    url: "./api/data/save.php",
                                    data: JSON.stringify(args),
                                    dataType: 'json',
                                    contentType: "application/json"
                                }).post(
                                    function(resp) {
                                        if (resp.status.toString() === "1") {
                                            $$.log("[OK] Application: " + resp).print("cyan");
                                            resolve(resp);
                                        } else {
                                            $$.log("[ERROR] Application: " + resp).print("orange");
                                            reject(resp);
                                        }
                                    },
                                    function(err) {
                                        $$.log("[ERROR] Application: " + err).print("orange");
                                        resolve(false);
                                    });
                            },
                            rollback: function(resolve, reject, args) {
                                $$.ajax({
                                    url: "./api/data/rollback.php",
                                    data: JSON.stringify(args),
                                    dataType: 'json',
                                    contentType: "application/json"
                                }).delete(
                                    function(resp) {
                                        if (resp.status.toString() === "1") {
                                            $$.log("[OK] Application: " + resp).print("yellowgreen");
                                            resolve(resp);
                                        } else {
                                            $$.log("[ERROR] Application: " + resp).print("yellow");
                                            reject(resp);
                                        }
                                    },
                                    function(err) {
                                        $$.log("[ERROR] Application: " + err).print("yellow");
                                        resolve(false);
                                    });
                            }
                        },
                        {
                            name: "export",
                            action: function(args) {
                                /**
                                 * Essa funcionalidade é opcional, pode ser usada como callback
                                 */
                                $$.alert("EXPORT CONTROL WAS CLICKED");
                            }
                        },
                        {
                            name: "reload",
                            action: function(args) {
                                /**
                                 * Essa funcionalidade só é usada quando o modo usado é o renderize
                                 */
                                $$.alert("RELOAD CONTROL CLICKED");
                            }
                        },
                        {
                            name: "previous",
                            action: function(args) {
                                /**
                                 * Funcionalidade extra genérica
                                 */
                                $$.alert("PREVIOUS CONTROL WAS CLICKED");
                            }
                        },
                        {
                            name: "next",
                            action: function(args) {
                                /**
                                 * Funcionalidade extra genérica
                                 */
                                $$.alert("NEXT CONTROL WAS CLICKED");
                            }
                        }
                    ],
                },

                /*Set if More Controls should be used*/
                more: { /*more controls*/
                    active: true,
                    items: [
                        {
                            name: "continue",
                            label: "Process Items",
                            text: 'Na próxima etapa você poderá executar os procedimentos permitidos...',
                            action: function(args) {
                                $$.log("APP: TEST CONTINUE CALLBACK ACTION").print("cyan");
                                $$.log(args).log();
                                $$.await(150).run(instance_grid.reload);
                            }
                        },
                        {
                            name: "delete",
                            label: "Remove Items",
                            text: 'Serão removidos todos registros e dados relacionados',
                            action: function(args) {
                                $$.log("APP: TEST DELETE CALLBACK ACTION").print("cyan");
                                $$.log(args).log();
                                $$.await(3).run(instance_grid.reload);
                            },
                        },
                        {
                            name: "lock",
                            label: "Lock Items",
                            text: 'Bloquear temporariamente os registros selecionados, esse processo poderá ser desfeito a qualquer momento',
                            action: function(args) {
                                $$.log("APP: TEST LOCK CALLBACK ACTION").print("cyan");
                                $$.log(args).log();
                                $$.await(3).run(instance_grid.reload);
                            },
                        },
                        {
                            name: "execute",
                            label: "Execute Items",
                            text: 'Executar outras ações.',
                            action: function(args) {
                                $$.log("APP: TEST EXECUTE CALLBACK ACTION").print("cyan");
                                $$.log(args).log();
                                $$.await(3).run(instance_grid.reload);
                            },
                        }
                    ],
                },

                /*Set which actions should be allowed*/
                actions: {
                    active: true,
                    items: [
                        {
                            name: "update",
                            action: function(args) {
                                $$.log("APP: UPDATE CALLBACK ACTION").print("cyan");
                                $$.log(args).log();
                                $$.await(3).run(instance_grid.reload);
                            }
                        },
                        {
                            name: "delete",
                            action: function(id) {
                                $$.log("APP: DELETE CALLBACK ACTION").print("cyan");
                                $$.log(id).log();
                                $$.await(3).run(instance_grid.reload);
                            }
                        },
                        {
                            name: "read",
                            action: function(item) {
                                $$.log("APP: READ CALLBACK ACTION").print("cyan");
                                $$.log(item).log();
                            }
                        },
                    ],
                },

                /*Set if checkbox should be shown*/
                checkbox: true,

                /*Set if grid can be ordered*/
                ordering: true,

                /*Set if any column should be use link to exec any procedure*/
                links: {
                    active: true,
                    columns: [
                        /*use: url (https://open-src.com/docs?file=) or function (_exeAnyProcedure, function() {alert('OK');})*/
                        {
                            col: 0,
                            // action: "https://jshunter-lib.com/docs?id="
                            action: "https://jshunter-lib.com/docs"
                            // action: "https://jshunter-lib.com"
                            // action: "https://jshunter-lib.com/"
                        },
                        {
                            col: 1,
                            action: function(args) {
                                $$.alert("APP: TEST LINK CALLBACK FUNCTION");
                                $$.log("COL 1").print("cyan");
                                console.log(args);
                            }
                        },
                        {
                            col: 8,
                            action: function(args) {
                                $$.alert("APP: TEST LINK CALLBACK FUNCTION COL 8");
                                $$.log("COL 8").print("cyan");
                                console.log(args);
                            }
                        }
                    ],
                },

                icons: {
                    active: false,
                    columns: [
                        // {col: 2},
                        // {col: 2, src: "./media/icon"},
                        // {col: 2, src: ""},
                        {col: 2, src: "./media/icon/"},
                    ]
                },

                rating: {
                    active: false,
                    column: 5,
                    star_size: 14,
                    star_color: "#ff4400",
                    allow_rate: true, /*true, false*/
                    action: {
                        type: "cookie",
                        name: "app-name@stars"
                    },
                    /*action: {
                        type: "quick",
                        callback: function(args) {
                            console.log("Hi! I'm a rating...", args);
                        }
                    }*/
                },

                /*If paginate: config*/
                paginate: {
                    active: true,
                    backend_paginate: true, /*(true, false) Essa opção indica que o backend ira fornecer os dados sobre a paginação*/
                    page: _page_,
                    items_show: _items_show_, /*Quantity of items per page*/
                    max_pager: _max_pager_, /*Quantity of pagers in page*/
                    jumper: true,
                    jumper_fix: true
                },

                /*Set Grid Columns*/
                columns: _columns_sized_

            }).run(function(obj) {
                instance_grid = obj;
            });
        }

        _buildGrid({
            page: 1,
            product_name: "Product",
            limit: 10000,
            items_show: 20,
            max_pager: 20
        });

    })();

    /**[TODO]
     * selectCloner
     */
    let select_cloner = 'off';
    (function SelectCloner() {
        if (select_cloner === 'off') return;
    })();

});
