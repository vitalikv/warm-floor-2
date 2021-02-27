<? 




$array = $_POST['myarray']; 



// Открываем файл, флаг W означает - файл открыт на запись
$f_hdl = fopen('t/fileJson.json', 'w');

// Записываем в файл $text
fwrite($f_hdl, $array);

// и $text2
//fwrite($f_hdl, $text2);

// Закрывает открытый файл
fclose($f_hdl);

echo $array;


