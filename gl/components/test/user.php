<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");

$mail = trim($_POST['mail']);
$mail = addslashes($mail);


function getUser($db, $mail)
{
	$sql = "SELECT * FROM user WHERE mail = :mail";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);	

	return $res;
}


function getSubscription($db, $user_id)
{
	$sql = "SELECT * FROM subscription WHERE user_id = :user_id";
	$r = $db->prepare($sql);
	$r->bindValue(':user_id', $user_id);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);	

	return $res;	
}

function getPayments($db, $user_token)
{
	$sql = "SELECT * FROM payment WHERE user_token = :user_token";
	$r = $db->prepare($sql);
	$r->bindValue(':user_token', $user_token, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetchAll(PDO::FETCH_ASSOC);

	return $res;	
}

function getProjects($db, $user_id)
{
	$sql = "SELECT * FROM project WHERE user_id = :user_id ORDER BY id";
	$r = $db->prepare($sql);
	$r->bindValue(':user_id', $user_id, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetchAll(PDO::FETCH_ASSOC);

	return $res;	
}



$dataUser = getUser($db, $mail);
$dataSubs = getSubscription($db, $dataUser['id']);
$dataPayments = getPayments($db, $dataUser['token']);
$dataProjects = getProjects($db, $dataUser['id']);

// addslashes экранирует вторые ковычки, это нужно при ответе в php файле (не через js)
//$dataUser = json_encode($dataUser);
//$dataSubs = addslashes(json_encode($dataSubs));
//$dataPayments = addslashes(json_encode($dataPayments));
//$dataProjects = addslashes(json_encode($dataProjects));

$data = [];
$data['dataUser'] = $dataUser;
$data['dataSubs'] = $dataSubs;
$data['dataPayments'] = $dataPayments;
$data['dataProjects'] = $dataProjects;


echo json_encode($data);




								
								
								