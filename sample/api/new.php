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

$random_test = rand(0, 10);

if ($random_test > 5) {
    $response = [
        "status" => 1,
        "data" => $data_save_post,
        "random_test" => $random_test,
        "message" => "Data saved successfully"
    ];
} else {
    $response = [
        "status" => 0,
        "data" => $data_save_post,
        "random_test" => $random_test,
        "message" => "Invalid Random Test haha"
    ];
}
sleep(5);
echo json_encode($response,JSON_UNESCAPED_UNICODE);
exit;

?>
