<?
$upass = '';
if($_SERVER['SERVER_NAME']=='xn------6cdcklga3agac0adveeerahel6btn3c.xn--p1ai') $upass = 'ns62QYhqMf';

try
{
	$db = new PDO('mysql:host=localhost;dbname=eng_1', 'root', $upass);
	$db->exec("set names utf8");
}
catch(PDOException $e)
{
    echo 'Ошибка 1';
}








