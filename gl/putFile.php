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
new/ui/mainMenu/myUiMainMenu.js
new/ui/mainMenu/myUiPanelRegister.js
new/ui/mainMenu/myUiListProjects.js
new/ui/mainMenu/divUserActive.js
new/ui/mainMenu/divSubs.js
new/ui/topPanel/myUiBtnGrid.js
new/ui/topPanel/myUiInfoModalWindGrid.js
new/ui/rightPanel/myUiRightPanel.js
new/ui/leftPanel/myUiGridGlobalPanel.js
new/ui/leftPanel/myUiGridUserPanel.js
new/ui/leftPanel/myUiGeneratorWFPanel.js
new/ui/bottomPanel/myUiPanelFloor.js
new/scene/core/myMath.js
new/scene/house/floor/myFloorActivate.js
new/scene/house/floor/myFloorOutline.js
new/scene/grid/myGrids.js
new/scene/grid/myGridPointMove.js
new/scene/grid/myGridPointTool.js
new/scene/grid/myGridMesh.js
new/scene/grid/myGridMeshOffset.js
new/scene/grid/myGridActivate.js
new/scene/grid/myGridSprite.js
new/scene/grid/myGridsSaveLoad.js
new/scene/notes/myNotes.js
new/scene/notes/myNotesInstance.js
new/scene/notes/ruler/myNoteRuler.js
new/scene/notes/ruler/myNoteRulerTool.js
new/scene/notes/ruler/myNoteRulerSprite.js
new/scene/notes/roulette/myNoteRoulette.js
new/scene/notes/roulette/myNoteRouletteTool.js
new/scene/notes/roulette/myNoteRouletteSprite.js
new/scene/notes/marker/myNoteMarker.js
new/scene/notes/marker/myNoteMarkerTool.js
new/scene/notes/marker/myNoteMarkerSprite.js
new/scene/notes/marker/myNoteMarkerInput.js
new/scene/notes/text/myNoteText.js
new/scene/notes/text/myNoteTextTool.js
new/scene/notes/text/myNoteTextSprite.js
new/scene/notes/text/myNoteTextInput.js
new/scene/notes/myNotesSaveLoad.js
new/scene/generatorWF/myGeneratorWF.js
new/scene/generatorWF/myGeneratorWFToolP.js
new/scene/generatorWF/myGeneratorWFJoinForms.js
new/scene/generatorWF/myGeneratorWFUlitka.js
new/scene/generatorWF/myGeneratorWFZmyka.js
new/scene/generatorWF/myGeneratorWFOffsetStep.js
uiInterface.js
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


