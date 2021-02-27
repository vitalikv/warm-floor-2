<?

$name = $_POST['name'];
$mail = $_POST['mail'];  
$text = $_POST['text'];


$name = work_text($name);
$name = preg_replace('|<.+>|isU','',$name);

$mail = work_text($mail);
$mail = preg_replace('|<.+>|isU','',$mail);

if (!preg_match("|[а-я]+|i", $text)) { $text = '';}
$text = work_text($text);

function work_text($text){
$text = trim($text);
$text = preg_replace('|&nbsp;|i', '', $text); 
$text = preg_replace('|\s{2,}|isU','',$text);
// если текст вставлен из Word, то удаляются все теги
if (preg_match('/class="?Mso|style="[^"]*\bmso-|style=\'[^\'\']*\bmso-|w:WordDocument/', $text)) {
$text = preg_replace('|<br>|isU','[br]',$text);
$text = preg_replace('|<\/p>|isU','[br]',$text);
$text = preg_replace('|\n|isU',' ',$text);
$text = preg_replace('|<!--[\s\S]+-->|isU','',$text);
$text = preg_replace('|<.+>|isU','',$text);
$text = preg_replace('|\[br\]|isU','<br>',$text);
}
return $text;
}



$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@engineering-plan.ru";
$email = 'engineering-plan@mail.ru';
$tema = "Сообщение с сайта ИНЖЕНЕРНЫЙ ПЛАН";
$mess = $name.'<br>'.$mail.'<br><br>'.$text;
mail($email, $tema, $mess, $mail_form);


echo 'Спасибо! Мы приняли ваше сообщение.';



?>





