<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

ini_set("memory_limit",-1);
ini_set('max_execution_time', 0);

//var_dump('<pre>', $_REQUEST, '</pre>');
//var_dump('<pre>', $_FILES, '</pre>');
//die;

$data_save_post = json_decode(file_get_contents("php://input"), true);

if (count($data_save_post) > 0 && $data_save_post["id"] !== "#3" && $data_save_post["id"] !== "#8") {
    $response = [
        "status" => 1,
        "data" => $data_save_post,
        "message" => "Data saved successfully"
    ];
} else {
    $response = [
        "status" => 0,
        "data" => $data_save_post,
        "message" => "Invalid ID"
    ];
}
sleep(0.5);
echo json_encode($response,JSON_UNESCAPED_UNICODE);
exit;

?>

