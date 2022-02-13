<?php
require_once ("../include/bd_1.php");




$url = trim($_SERVER['REQUEST_URI']);
$url = explode("/", $url);
$url = $url[count($url)-1];

$token = addslashes($url);
//if(!preg_match("/^[0-9]+$/i", $id)) { exit; }


// находим e-mail, Имя, codepro
$sql = "SELECT * FROM user WHERE token = :token AND active = 1 LIMIT 1";
$r = $db->prepare($sql);
$r->bindValue(':token', $token, PDO::PARAM_STR);
$r->execute();
$res = $r->fetch(PDO::FETCH_ASSOC);

$mess = "";

if($res['id'])
{
	$pass = rand(100000, 999999);
	
	$sql = "UPDATE user SET pass = :pass WHERE id = :id";
	$r = $db->prepare($sql);
	$r->bindValue(':id', $res['id']);
	//$r->bindValue(':token', NULL);
	$r->bindValue(':pass', $pass);
	$r->execute();

	$mess = "Ваш новый пароль: ".$pass;
}
else
{
	$mess = "Ошибка";
}

?>


<style type="text/css">
body
{
	width: 95%;
	height: 90%;	
}

.block_1
{
	position: fixed;
	left: 50%;
	top: 50%;
	-webkit-transform:  translate(-50%, -50%);
	transform: translate(-50%, -50%);
	
	width: 550px;
	height: 250px;		
	
	border: 1px solid #b3b3b3; 
	border-radius: 3px;

	background-image: -moz-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -o-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -ms-linear-gradient(top, #ffffff 0% ,#e3e3e3 100%); 
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e3e3e3', endColorstr='#e3e3e3',GradientType=0 ); 
	background-image: linear-gradient(top, #ffffff 0% ,#e3e3e3 100%);   
	-webkit-box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; 
	-moz-box-shadow: 0px 0px 2px #bababa,  inset 0px 0px 1px #ffffff;  
	box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;
}


.inf_text
{
	display: flex; /* Флексы */
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */

	margin: auto;
	width: 80%;
	height: 100%;
	
	font-family: arial,sans-serif;
	font-size: 25px;
	color: #666;	
}

</style>



<div class="block_1"> 
	<div class="inf_text">
		<?=$mess?>
	</div>
</div>


								
								
								