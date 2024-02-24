<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");




//$id = trim($_POST['id']);
//$id = addslashes($id);
//if(!preg_match("/^[0-9]+$/i", $id)) { exit; }

$id = 3;


// находим e-mail, Имя, codepro
$sql = "SELECT * FROM object WHERE id = :id";
$r = $db->prepare($sql);
$r->bindValue(':id', $id, PDO::PARAM_STR);
$r->execute();
$res = $r->fetch(PDO::FETCH_ASSOC);


$count = $r->rowCount();

echo $res['fbx'];
