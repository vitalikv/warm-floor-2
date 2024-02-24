<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");



$type = trim($_POST['type']);
$mail = trim($_POST['mail']); 
$pass = trim($_POST['pass']); 
$date = date("Y-m-d-G-i");



// проверка mail на правильность
if(!filter_var($mail, FILTER_VALIDATE_EMAIL)) { exit; }


// проверка pass на правильность
if(!preg_match("/^[a-z0-9]{4,20}$/i", $pass)) { exit; }



// вход нового пользователя
if($type == 'reg_1')
{
	$sql = "SELECT * FROM user WHERE mail = :mail AND pass = :pass LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->bindValue(':pass', $pass, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);


	
	$inf = array();
	$inf['pass'] = $pass;
	$inf['mail'] = $mail;
	
	if($res)
	{ 		
		if($res['active'])
		{
			$inf['success'] = true;
			$inf['info'] = $res;

			$sql = "SELECT * FROM subscription WHERE user_id = :user_id LIMIT 1";
			$r = $db->prepare($sql);
			$r->bindValue(':user_id', $res['id'], PDO::PARAM_INT);
			$r->execute();
			$res2 = $r->fetch(PDO::FETCH_ASSOC);

			if($res2)
			{
				$inf['subs'] = [];
				$inf['subs']['days'] = $res2['days'];
			}			
		}
		else
		{
			$inf['success'] = false;
			$inf['err']['code'] = 2;
			$inf['err']['desc'] = 'Регистрация не завершена<br><br>на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)';

			sendMess($res);
		}
	}
	else
	{ 
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'неверная почта или пароль';
	}

	echo json_encode( $inf );
}


// регистрация нового пользователя
if($type == 'reg_2')
{
	$sql = "SELECT * FROM user WHERE mail = :mail LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);	
	
	
	$inf = array();
	$inf['pass'] = $pass;
	$inf['mail'] = $mail;
	$inf['date'] = $date;
	
	$token = md5($mail.''.$pass);
	
	if($res)	// такой mail, уже есть в базе
	{
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'такой mail, уже есть в базе';
	}
	else		// mail в базе нет, можно записывть нового пользователя  
	{
		$sql = "INSERT INTO user (pass, mail, date, token) VALUES ( :pass, :mail, :date, :token)";

		$r = $db->prepare($sql);
		$r->bindValue(':pass', $pass);
		$r->bindValue(':mail', $mail);
		$r->bindValue(':date', $date);
		$r->bindValue(':token', $token);
		$r->execute();

		$count = $r->rowCount();


		if($count==1)
		{ 
			$inf['success'] = true;
			$inf['id'] = $db->lastInsertId();

			$cdm = array();
			$cdm['mail'] = $mail;
			$cdm['token'] = $token;
			sendMess($cdm);
		}
		else
		{ 
			$inf['success'] = false;
			$inf['err']['code'] = 2;
		}		
	}
	

	echo json_encode( $inf );
}



// отправляем сообщение активации почты 
function sendMess($inf)
{
	$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@".$_SERVER['HTTP_HOST'];
	
	$arrayTo = array($inf['mail'].', otoplenie-doma-1@mail.ru');
	$email = implode(",", $arrayTo);
	
	$url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
	
	$tema = "Программа теплый пол «активация почты»";
	$mess = 'Здравствуйте, вы зарегистрировались на сайте отопление-дома-своими-руками.рф (программа теплый пол). Чтобы закончить регистрацию, пройдите по <a href="'.$url.'/active_1/'.$inf['token'].'">ссылке</a>.<br><br>';	
	
	mail($email, $tema, $mess, $mail_form);	
}

?>





