<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");



$id = trim($_POST['id']);
$id = addslashes($id);
if(!preg_match("/^[0-9]+$/i", $id)) { exit; }



// находим проекты для пользователя id
$sql = "SELECT * FROM project WHERE user_id = :id ORDER BY id";
$r = $db->prepare($sql);
$r->bindValue(':id', $id, PDO::PARAM_STR);
$r->execute();
$res = $r->fetchAll(PDO::FETCH_ASSOC);


$count = $r->rowCount();

echo json_encode( $res );

