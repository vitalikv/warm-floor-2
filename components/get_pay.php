<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd.php");





$secret = 'bfpLkrbKvuwpaNMiuzIX34jN'; // секрет, который мы получили в первом шаге от яндекс.
// получение данных.
$xdc = array(
	'notification_type' => $_POST['notification_type'], // p2p-incoming / card-incoming - с кошелька / с карты
	'operation_id'      => $_POST['operation_id'],      // Идентификатор операции в истории счета получателя.
	'amount'            => $_POST['amount'],            // Сумма, которая зачислена на счет получателя.
	'withdraw_amount'   => $_POST['withdraw_amount'],   // Сумма, которая списана со счета отправителя.
	'currency'          => $_POST['currency'],            // Код валюты — всегда 643 (рубль РФ согласно ISO 4217).
	'datetime'          => $_POST['datetime'],          // Дата и время совершения перевода.
	'sender'            => $_POST['sender'],            // Для переводов из кошелька — номер счета отправителя. Для переводов с произвольной карты — параметр содержит пустую строку.
	'codepro'           => $_POST['codepro'],           // Для переводов из кошелька — перевод защищен кодом протекции. Для переводов с произвольной карты — всегда false.
	'label'             => $_POST['label'],             // Метка платежа. Если ее нет, параметр содержит пустую строку.
	'sha1_hash'         => $_POST['sha1_hash']          // SHA-1 hash параметров уведомления.
);

// проверка хеш
if (sha1($xdc['notification_type'].'&'.
         $xdc['operation_id'].'&'.
         $xdc['amount'].'&'.
         $xdc['currency'].'&'.
         $xdc['datetime'].'&'.
         $xdc['sender'].'&'.
         $xdc['codepro'].'&'.
         $secret.'&'.
         $xdc['label']) != $xdc['sha1_hash']) 
		 {
	exit; // останавливаем скрипт. у вас тут может быть свой код. exit('Верификация не пройдена. SHA1_HASH не совпадает.');
}

//$xdc['codepro'] = ($xdc['codepro'] === true) ? 1 : 0;

$sql = "UPDATE application SET buy = '1', amount = :amount, codepro = {$_POST['codepro']} WHERE id_order = :id_order";
$r = $db->prepare($sql);
$r->bindValue(':id_order', $xdc['label']);
$r->bindValue(':amount', $xdc['withdraw_amount']);
//$r->bindValue(':codepro', $xdc['codepro']);
$r->execute();





// находим e-mail, Имя, codepro
$sql = "SELECT mail, name, codepro FROM application WHERE id_order = :id_order";
$r = $db->prepare($sql);
$r->bindValue(':id_order', $xdc['label'], PDO::PARAM_INT);
$r->execute();
$res = $r->fetch(PDO::FETCH_ASSOC);


if($res['codepro'] == '1'){exit;}					// платеж с протекцией
//if($xdc['withdraw_amount'] != '1450.00'){exit;}		// сумма не равна нужной


// отправляем сообщение со ссылкой на программу

$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@engineering-plan.ru";

$arrayTo = array($res['mail'].', engineering-plan@mail.ru');
$email = implode(",", $arrayTo);

//$email = $res['mail'];
$tema = "Покупка программы-конструктор «Инженерный план»";
$mess = 'Здравствуйте, '.$res['name'].'.<br>Вы приобрели программу «Инженерный план». Чтобы скачать ее, пройдите по <a href="http://engineering-plan.ru/download">ссылке</a>.<br><br>

Установка:<br>
Программа сжата в zip файл (для уменьшения объема скачивания). <br>
1. Кликните правой кнопкой мыши на скаченный файл и в появившемся списке выберете "Извлечь все" или "Извлечь файлы". <br>
2. Зайдите в извлеченную папку и запустите setup. Начнется установка. 
';
mail($email, $tema, $mess, $mail_form);




?>





