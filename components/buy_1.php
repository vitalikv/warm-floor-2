<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd.php");



$name = trim($_POST['name']);
$mail = trim($_POST['mail']);
$pay = $_POST['pay_method'];  
$date = date("Y-m-d-G-i");

$pay = $pay == 'buy_yandex' ? 'yandex' : 'card';


$id_oder = '-1';

if (empty($mail)){ echo $id_oder; exit;}


$sql = "INSERT INTO application (name, mail, pay, date) VALUES ( :name, :mail, :pay, :date)";

$r = $db->prepare($sql);
$r->bindValue(':name', $name);
$r->bindValue(':mail', $mail);
$r->bindValue(':pay', $pay);
$r->bindValue(':date', $date);
$r->execute();


$count = $r->rowCount();

if($count==1){ echo $db->lastInsertId(); }
else{ echo $id_oder; }



?>





