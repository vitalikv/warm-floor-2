<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");




$info = array();
$info["name"] = 'насос';
$info["size"] = 23;
$info = json_encode($info);

$fbx = file_get_contents($_SERVER['DOCUMENT_ROOT']."/gl/export/kran2.fbx");

//$fbx = addslashes($fbx);
//$fbx = null;	

$sql = "INSERT INTO object (info, fbx) VALUES (:info, :fbx)";

$r = $db->prepare($sql);
$r->bindValue(':info', $info);
$r->bindValue(':fbx', $fbx);
$r->execute();


$count = $r->rowCount();


//echo json_encode( $inf );

echo $db->lastInsertId();

//echo $fbx;

?>