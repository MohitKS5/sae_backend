<?php
$writedir = "../angular-app/src/assets/json/";
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD']==="GET") {
    $file = fopen($sheet.".json","w");
    $contents = file_get_contents("https://spreadsheets.google.com/feeds/list/1mK2zvp6ouN5r7kh0StqkULr32l9MyO0suBpMJUL4QeM/" . $sheet . "/public/values?alt=json");
    fwrite($file,$contents);
    fclose($file);
}