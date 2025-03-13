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

$path = 't/tw5.js';
$contentOld = '';

// Разделяем строку по переводам строк и пробелам, удаляем пустые элементы
$arr = preg_split("/\s+/", $list, -1, PREG_SPLIT_NO_EMPTY);

// Открываем файл для записи
$newFile = fopen($path, 'w');

foreach ($arr as $file) {
    // Проверяем, существует ли файл
    if (!file_exists($file)) {
        echo "Файл $file не найден.<br>";
        continue;
    }

    // Читаем содержимое файла
    $content = file_get_contents($file);
	$contentOld .= $content;

    // Удаляем console.log
    $content = preg_replace("/console\.log\(.*?\);/s", "", $content);

    // Удаляем однострочные комментарии //, но не трогаем http:// и https://
    $content = preg_replace("/(?<!http:|https:)\/\/.*$/m", "", $content);	

    // Удаляем многострочные комментарии (/* ... */)
    $content = preg_replace('/\/\*.*?\*\//s', '', $content);	

    // Переименовываем функции (пример)
    //$content = preg_replace("/function\s+(\w+)\s*\(/", "function new_$1(", $content);

    // Записываем содержимое в новый файл
    fwrite($newFile, $content);
}

// Закрываем файл
fclose($newFile);

echo "Файлы успешно объединены и обработаны.<br><br>";

getSizeFile1($contentOld);
getSizeFile2($path);



function getSizeFile1($fileContent)
{
	// Получаем размер содержимого в байтах
	$fileSizeBytes = mb_strlen($fileContent, '8bit');

	// Переводим размер в килобайты (1 КБ = 1024 байта)
	$fileSizeKB = $fileSizeBytes / 1024;

	// Выводим размер с округлением до двух знаков после запятой
	echo "Размер старого файла: " . round($fileSizeKB, 2) . " КБ<br><br>";	
}

// Получаем размер записанного файла на диске
function getSizeFile2($path)
{
	$fileSizeBytes = filesize($path);
	$fileSizeKB = $fileSizeBytes / 1024;
	echo "Размер нового файла: " . round($fileSizeKB, 2) . " КБ<br>";	
}

