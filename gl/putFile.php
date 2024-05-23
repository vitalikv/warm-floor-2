<? 




$list = 'meshBSP.js 	
calculationArea.js
block/createWallBlock.js
block/createWallPlaster.js
block/createGrid.js
crossWall.js
addPoint.js
addWD.js
mouseClick.js
changeCamera.js
moveCamera.js
clickChangeWD.js
clickMovePoint.js
clickMoveWall.js
clickMoveWD.js
deleteObj.js
floor.js
detectZone.js
inputWall.js
label.js  	
clickActiveObj.js    
saveLoad.js
script.js
block/floorWarm.js
eventClick.js
clickMovePivot.js
clickObj.js
clickMoveGizmo.js
scaleBox.js
loadObj.js
new/ui/divUserActive.js
new/ui/divSubs.js
new/ui/myLeftPanel.js
new/ui/topPanel/myBtnGrid.js
new/scene/core/myMath.js
new/scene/grid/myGrids.js
new/scene/grid/myGridPointMove.js
new/scene/grid/myGridPointTool.js
new/scene/grid/myGridMesh.js
new/scene/grid/myGridsSaveLoad.js
uiInterface.js
uiInterface_user_1.js
';


$arr = explode(".js", $list);


for ($i = 0; $i < count($arr); $i++)
{
	$arr[$i] = trim($arr[$i]).'.js';
}


// Открываем файл, флаг W означает - файл открыт на запись
$newFile = fopen('t/test.js', 'w');


// Записываем в файл $text
for ($i = 0; $i < count($arr)-1; $i++)
{
	echo $arr[$i].'<br>';
	$file = file_get_contents($arr[$i]);
	$file = preg_replace("|console.log\((.*)\);|i","",$file);
	fwrite($newFile, $file);	
}

//$file2 = preg_replace('#(\/\/(.*?)(\n|$|\r|(\r\n)))|(\/\*(.*?)\*\/)#i','',$file2);	// удаляем комменты

// Закрывает открытый файл
fclose($newFile);


echo 11;


