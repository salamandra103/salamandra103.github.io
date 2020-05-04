<?php

$post = (!empty($_POST)) ? true : false;

if($post)
{
    $email = trim($_POST['email']);
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $tel = htmlspecialchars($_POST["phone"]);
    $error = '';


    $name_tema = "=?utf-8?b?". base64_encode($name) ."?=";

    $subject ="Новая заявка с сайта domain.name";
    $subject1 = "=?utf-8?b?". base64_encode($subject) ."?=";
    /*
    $message ="\n\nСообщение: ".$message."\n\nИмя: " .$name."\n\nТелефон: ".$tel."\n\n";
    */
    $message1 ="\n\nИмя: ".$name."\n\nТелефон: ".$tel."\n\nE-mail: ".$email;	


    $header = "Content-Type: text/plain; charset=utf-8\n";

    $header .= "From: Новая заявка <example@gmail.com>\n\n";	
    $mail = mail("example@gmail.com", $subject1, $message1, iconv ('utf-8', 'windows-1251', $header));
}
?>