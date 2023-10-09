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

$response = [];

for ($i = 0; $i < count($_FILES); $i++) {

    //$fakepath = @$_FILES['app_file_identity']['tmp_name'];
    //$fakepath = @$_FILES['jh-form-input-file']['tmp_name'];
    $fakepath = @$_FILES['files_send-'.$i]['tmp_name'];
    //$filename = @$_FILES['app_file_identity']['name'];
    //$filename = @$_FILES['jh-form-input-file']['name'];
    $filename = @$_FILES['files_send-'.$i]['name'];
    $final_filename = rand()."-".basename($filename);

    if(!empty($fakepath)) {
        if(move_uploaded_file($fakepath, "./files/".$final_filename)) {
            $response['files_send-'.$i] = [
                'retorno'=>'ok',
                'mensagem' => 'Arquivo enviado com sucesso',
                'linkFile' => "./files/".$final_filename,
            ];
        } else {
            $response['files_send-'.$i] = [
                'retorno'=>'nok',
                'mensagem' => 'Houve um erro ao tentar enviar o arquivo'
            ];
        }
    }
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);
exit;

?>

