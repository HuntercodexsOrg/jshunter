
let total_items = 10000;

let _columns_ = [
    "Id",
    "Product Name",
    "Active",
    "Description",
    "Volumes",
    "Stock",
    "Warranty",
    "Number Ref",
    "Code Ref",
    "SAP Number",
    "Delivery",
    "Payment",
    "Status",
    "Order",
    "Customer",
    "Address",
    "Phone",
    "City",
    "Postal Code",
    "Extras",
    "Additional",
    "Restrict",
    "Others",
    "Send",
    "Anchor",
    "Created",
    "Updated",
    "Canceled"
];

/*Column-Name, Column-Size, Column-Money*/
// let _columns_sized_ = [
//     ["Id", 120, false],
//     ["Product Name", 300, false],
//     ["Active", 150, false],
//     ["Description", 400, false],
//     ["Volumes", 200, true],
//     ["Stock", 200, false],
//     ["Warranty", 200, false],
//     ["Number Ref", 200, false],
//     ["Code Ref", 200, false],
//     ["SAP Number", 200, false],
//     ["Delivery", 200, false],
//     ["Payment", 200, false],
//     ["Status", 200, false],
//     ["Order", 200, false],
//     ["Customer", 250, false],
//     ["Address", 400, false],
//     ["Phone", 200, false],
//     ["City", 200, false],
//     ["Postal Code", 200, false],
//     ["Extras", 200, false],
//     ["Additional", 300, false],
//     ["Restrict", 200, false],
//     ["Others", 200, false],
//     ["Send", 200, false],
//     ["Anchor", 200, false],
//     ["Created", 200, false],
//     ["Updated", 200, false],
//     ["Canceled", 120, false]
// ];
let _columns_sized_ = [
    {
        name: "id", width: 120, money: false, required: false
    },
    {
        name: "product_name", width: 300, money: false, required: true
    },
    /*{
        name: "country", width: 150, money: false, required: true
    },*/
    {
        name: "description", width: 400, money: false, required: true
    },
    {
        name: "price", width: 200, money:  true, required: true
    },
    {
        name: "ratings", width: 200, money: false, required: true
    },
    {
        name: "warranty", width: 200, money: false, required: true
    },
    {
        name: "number_ref", width: 200, money: false, required: true
    },
    {
        name: "code_ref", width: 200, money: false, required: true
    },
    {
        name: "sap_number", width: 200, money: false, required: true
    },
    /*{
        name: "delivery", width: 200, money: false, required: true
    },
    {
        name: "payment", width: 200, money: false, required: true
    },*/
    /*{
        name: "status", width: 200, money: false, required: true
    },
    {
        name: "order", width: 200, money: false, required: true
    },*/
    {
        name: "customer", width: 250, money: false, required: true
    },
    {
        name: "address", width: 400, money: false, required: true
    },
    /*{
        name: "phone", width: 200, money: false, required: true
    },
    {
        name: "city", width: 200, money: false, required: true
    },*/
    /*{
        name: "postal_code", width: 200, money: false, required: true
    },
    {
        name: "extras", width: 200, money: false, required: true
    },*/
    {
        name: "additional", width: 300, money: false, required: true
    },
    {
        name: "restrict", width: 200, money: false, required: true
    },
    {
        name: "others", width: 200, money: false, required: true
    },
    {
        name: "send", width: 200, money: false, required: true
    },
    {
        name: "anchor", width: 200, money: false, required: true
    },
    {
        name: "created", width: 200, money: false, required: true
    },
    {
        name: "updated", width: 200, money: false, required: true
    },
    {
        name: "canceled", width: 120,money: false, required: true
    }
];
/*Column-Name, Column-Size, Column-Money*/
/*let _columns_sized_ = [
    ["Column Name 1", 100, false],
    ["Column Name 2", 300, false],
    ["Column Name 3", 80, false],
    ["Column Name 4", 400, false],
    ["Column Name 5", 200, false],
    ["Column Name 6", 200, false],
    ["Column Name 7", 200, false],
    ["Column Name 8", 200, false],
    ["Column Name 9", 200, false],
    ["Column Name 10", 200, false],
    ["Column Name 11", 200, false],
    ["Column Name 12", 200, false]
];*/

let _range_ = [
    null,
    [ 1, 10],
    [ 11, 20 ],
    [ 21, 30 ],
    [ 31, 40 ],
    [ 41, 50 ],
    [ 51, 60 ],
    [ 61, 70 ],
    [ 71, 80 ],
    [ 81, 90 ],
    [ 91, 100 ],
    [ 101, 110 ],
    [ 111, 120 ],
    [ 121, 130 ],
    [ 131, 140 ],
    [ 141, 150 ],
    [ 151, 160 ],
    [ 161, 170 ],
    [ 171, 180 ],
    [ 181, 190 ],
    [ 191, 200 ],
    [ 201, 210 ],
    [ 211, 220 ],
    [ 221, 230 ],
    [ 231, 240 ],
    [ 241, 250 ],
    [ 251, 260 ],
    [ 261, 270 ],
    [ 271, 280 ],
    [ 281, 290 ],
    [ 291, 300 ],
    [ 301, 310 ],
    [ 311, 320 ],
    [ 321, 330 ],
    [ 331, 340 ],
    [ 341, 350 ],
    [ 351, 360 ],
    [ 361, 370 ],
    [ 371, 380 ],
    [ 381, 390 ],
    [ 391, 400 ],
    [ 401, 410 ],
    [ 411, 420 ],
    [ 421, 430 ],
    [ 431, 440 ],
    [ 441, 450 ],
    [ 451, 460 ],
    [ 461, 470 ],
    [ 471, 480 ],
    [ 481, 490 ],
    [ 491, 500 ]
];

let _range2_ = [
    [1,5],
    [6,10],
    [11,15],
    [15,20],
    [91,100],
    [101,110],
    [111,120],
    [121,130],
    [131,140],
    // [501,600],
    [991,1000],
    [1001,1010],
    [20001,20010],
    [100001,100010],
    [1000001, 1000010],
    [9000001, 9000010]
];

