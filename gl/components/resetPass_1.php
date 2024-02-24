<?php
require_once ("../include/bd_1.php");



$type = 'reset_1';
$mail = trim($_POST['mail']);  



// проверка mail на правильность
if(!filter_var($mail, FILTER_VALIDATE_EMAIL)) { exit; }


// отправка сообщения на почту, чтобы обновил пароль
if($type == 'reset_1')
{
	$sql = "SELECT * FROM user WHERE mail = :mail LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);


	
	$inf = array();
	$inf['mail'] = $mail;
	
	if($res)
	{ 		
		if($res['active'])
		{
			$inf['success'] = true;
			$inf['info'] = $res;
			
			$cdm = array();
			$cdm['mail'] = $mail;
			$cdm['token'] = $res['token'];
			sendMess($cdm);			
		}
		else
		{
			$inf['success'] = false;
			$inf['err']['code'] = 2;
			$inf['err']['desc'] = 'регистрация не завершена<br><br>на вашу почту было отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)';						
		}
	}
	else
	{ 
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'такой почты не существует';
	}

	echo json_encode( $inf );
}






// отправляем сообщение активации почты 
function sendMess($inf)
{
	//$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@xn------6cdcklga3agac0adveeerahel6btn3c.xn--p1ai";
	$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@".$_SERVER['HTTP_HOST'];
	
	$arrayTo = array($inf['mail'].', otoplenie-doma-1@mail.ru');
	$email = implode(",", $arrayTo);
	
	$url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
	
	// получаем директорию скрипта на сайте
	//$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
	//$url .= $_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']).'/'.basename(__DIR__);
	//echo $url;	
	
	$tema = "Обновление пароля";
	$mess = 'Здравствуйте, вы забыли пароль на сайте отопление-дома-своими-руками.рф (Расчет теплого пола 3D). Чтобы обновить пароль, пройдите по <a href="'.$url.'/reset_pass_1/'.$inf['token'].'">ссылке</a>.<br><br>';
	
	mail($email, $tema, $mess, $mail_form);	
}


?>





