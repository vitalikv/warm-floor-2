<?php
// скрипт создает новое поле с нулевой оплатой (пользователь нажал на кнопку подписка, но еще не факт, что оплатит)

header('Content-Type: application/json; charset=utf-8');

require_once ("../include/bd_1.php");



// только для теста, ввод значения через url
// пример payment.php?token=23vdgd
if(1===2)
{
	if($_GET['token']) $user_token = addslashes(trim($_GET['token']));
}

// входные данные
if($_POST['token']) $user_token = addslashes(trim($_POST['token']));  
$date = date("Y-m-d-G-i");

// данные на выход
$data = [];
$data['result'] = false;
$data['id'] = -1;

// проверка, на входные данные
if(!empty($user_token))
{
	$exists = checkExistsUser($db, $user_token);
	
	if($exists)
	{
		$sql = "INSERT INTO payment (user_token, date) VALUES (:user_token, :date)";
		$r = $db->prepare($sql);
		$r->bindValue(':user_token', $user_token);
		$r->bindValue(':date', $date);
		$r->execute();

		$count = $r->rowCount();

		if($count === 1)
		{ 
			$data['result'] = true;
			$data['id'] = $db->lastInsertId();
			$data['token'] = $user_token;
		}		
	}
}


// проверить существует ли юзер
function checkExistsUser($db, $user_token)
{
	$exists = false;
	
	$sql = "SELECT * FROM user WHERE token = :token LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':token', $user_token);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);

	if($res) $exists = true;
	
	return $exists;
}

// отдаем результат в json
echo json_encode( $data );




