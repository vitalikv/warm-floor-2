<? 
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");




$url = $_SERVER['REQUEST_URI'];

$path = "/gl/";

$title = '';
$h1 = '';
$description = '';
$interface['wall_1'] = 0;
$interface['wall_2'] = ['top'=>[], 'left'=>[], 'right'=>[], 'bottom'=>[]];
$interface['tube_1'] = 0;
$interface['mode_1'] = 0;
$interface['estimate'] = 0;
$interface['click_wall_2D'] = 0;
$interface['wd_1'] = 0;
$interface['wd_2'] = 0;
$interface['wd_3'] = 0;
$interface['form_1'] = 0;
$interface['wall_plaster_width_1'] = 0;
$interface['monolit_fundament'] = 0;
$interface['lentochnii_fundament'] = 0;
$interface['svaynyy_fundament'] = 0;
$interface['ploshchad_uchastka'] = 0;
$interface['obyem_pomeshcheniya'] = 0;
$interface['raschet_kirpicha'] = 0;
$interface['raschet_blokov'] = 0;
$interface['wall_b1'] = 0;
$interface['grid_tube_1'] = 0;
$interface['tube_b1'] = 0;
$interface['box_wf_b1'] = 0;
$interface['obj_b1'] = 0;
	

if($url == '/calculator/monolit_fundament' || $url == '/calculator/monolit_fundament1')	
{ 
	$title = 'Калькулятор монолитного фундамента 3D'; 
	$nameId = 'монолитный фундамент'; 
	$interface['monolit_fundament'] = 1; 
	$interface['wall_1'] = 1;
	$interface['click_wall_2D'] = 1;
	$interface['form_1'] = 1;
}
if($url == '/calculator/lentochnii_fundament')	
{ 
	$title = 'Калькулятор ленточного фундамента 3D'; 
	$nameId = 'ленточный фундамент'; 
	$interface['lentochnii_fundament'] = 1;
	$interface['wall_1'] = 1;
	$interface['click_wall_2D'] = 1;
	$interface['form_1'] = 1;
}
if($url == '/calculator/svaynyy_fundament')	
{ 
	$title = 'Свайный фундамент калькулятор 3D'; 
	$nameId = 'свайный фундамент';
	$interface['svaynyy_fundament'] = 1;
	$interface['wall_1'] = 1;
	$interface['click_wall_2D'] = 1;
	$interface['form_1'] = 1;
}
if($url == '/calculator/obyem_pomeshcheniya')	
{ 
	$title = 'Калькулятор объема и площади помещения 3D'; 
	$nameId = 'объем и площадь помещения'; 
	$interface['wall_1'] = 1;
	$interface['obyem_pomeshcheniya'] = 1;
	$interface['click_wall_2D'] = 1;
	$interface['form_1'] = 1;
}
if($url == '/calculator/ploshchad_uchastka')	
{ 
	$title = 'Расчет площади участка 3D'; 
	$nameId = 'площадь участка'; 
	$interface['estimate'] = 0;	
	$interface['click_wall_2D'] = 1;
}
if($url == '/calculator/shtukaturka_na_stene')	
{ 
	$title = 'Расчет штукатурки на стене 3D'; 
	$nameId = 'штукатурка на стене'; 
	$interface['wall_1'] = 0;
	$interface['wall_plaster_width_1'] = 1;
	$interface['wd_1'] = 1;
}
if($url == '/calculator/raschet_kirpicha')	
{ 
	$title = 'Расчет кирпича для стены 3D'; 
	$nameId = 'расчет кирпича'; 
	$interface['wall_1'] = 0;
	$interface['wd_1'] = 1;
	$interface['raschet_kirpicha'] = 1;
}
if($url == '/calculator/raschet_blokov')	
{ 
	$title = 'Расчет блоков для стены 3D'; 
	$nameId = 'расчет блоков'; 
	$interface['wall_1'] = 0;
	$interface['wd_1'] = 1;
	$interface['raschet_blokov'] = 1;
}
if($url == '/calculator/warm_floor')	
{ 
	$title = 'Программа теплый пол 3D калькулькулятор';
	$h1 = 'Расчет теплого пола 3D';
	$description = 'Программа теплый пол позволяет быстро спроектировать и подсчитать количество труб. Она рассчитана на людей, которые хотят самостоятельно сделать теплый пол на даче, в загородном доме или в квартире. В программе есть 3D режим который наглядно покажет, то что вы спроектировали.';
	$nameId = 'теплый пол';
	$interface['mode_1'] = 1;
	$interface['wall_1'] = 1;
	$interface['tube_1'] = 1;
	$interface['wd_1'] = 1;	
	$interface['wd_2'] = 1;
	$interface['wd_3'] = 1;
	$interface['grid_tube_1'] = 1;	
	$interface['tube_b1'] = 1;
	$interface['box_wf_b1'] = 1;
	$interface['wall_2']['bottom'] = ['width_1' => 1];
	$interface['wall_2']['top'] = ['showHideWall_1' => 1];
	$interface['obj_b1'] = 1;
}



$infProject = array('url' => $url, 'title' => $title, 'nameId' => $nameId, 'path' => $path, 'load' => [ img => [] ]);

$infProject['activeInput'] = '';
$infProject['activeDiv'] = null;

$infProject['user'] = [];
$infProject['user']['id'] = null;
$infProject['user']['mail'] = null;
$infProject['user']['pass'] = null;

$infProject['settings']['project'] = '';
$infProject['settings']['height'] = 2.5;
$infProject['settings']['floor'] = [ 'o' => false, 'posY' => 0.1, 'height' => 0.1, 'changeY' => false, 'areaPoint' => 'center', 'material' => null, 'label'=> true ];
$infProject['settings']['wall'] = [ 'width' => 0.3, 'label' => '', 'dist' => 'center', 'material' => null, 'block' => null ];
$infProject['settings']['wf_tube'] = [];
$infProject['settings']['calc'] = [ 'fundament' => '' ];
$infProject['settings']['land'] = [ 'o' => false ];
$infProject['settings']['unit'] = [ 'wall' => 1, 'floor' => 1 ];
$infProject['settings']['camera'] = [ 'type' => '2d', 'zoom' => 1, 'limitZoom' => 1 ];
$infProject['settings']['grid'] = [ 'count' => 30, 'size' => 0.5, 'pos' => [ 'y' => -0.1 ] ];
$infProject['settings']['interface']['button'] = [ 'cam2d' => '2d' ];

$infProject['scene'] = [ 'tool' => [] ];
$infProject['scene']['load'] = '';

$infProject['ui']['list_wf'] = [];
$infProject['ui']['main_menu'] = [];



if($url == '/calculator/monolit_fundament') 
{ 
	$infProject['scene']['load'] = 'shape3';
	$infProject['settings']['calc']['fundament'] = 'monolit';
	$infProject['settings']['wall']['label'] = 'outside';
	$infProject['settings']['wall']['width'] = 0.03;
	$infProject['settings']['height'] = 0.2;
	$infProject['settings']['floor']['o'] = true;
	$infProject['settings']['floor']['posY'] = 2.5 - 0.01;
	$infProject['settings']['floor']['height'] = 2.5 - 0.01;
	$infProject['settings']['floor']['changeY'] = true;
}
else if($url == '/calculator/lentochnii_fundament')
{ 
	$infProject['scene']['load'] = 'shape3';
	$infProject['settings']['wall']['label'] = 'outside';
	$infProject['settings']['calc']['fundament'] = 'lent';
	$infProject['settings']['height'] = 0.2;
}
else if($url == '/calculator/svaynyy_fundament') 
{ 
	$infProject['scene']['load'] = 'shape3';
	$infProject['settings']['wall']['label'] = 'outside';
	$infProject['settings']['calc']['fundament'] = 'svai';
	$infProject['settings']['height'] = 0.2;
}
else if($url == '/calculator/ploshchad_uchastka') 
{ 
	$infProject['scene']['load'] = 'land';
	$infProject['load']['img'] = ['img/load/grass.jpg']; 
	$infProject['settings']['project'] = 'land';
	$infProject['settings']['floor']['material'][0] = ['img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.2, 'y' => 0.2]];
	$infProject['settings']['land']['o'] = true; 
	$infProject['settings']['height'] = 0.2;
	$infProject['settings']['floor']['o'] = true;
	$infProject['settings']['floor']['posY'] = $infProject['settings']['height'] - 0.01;
	$infProject['settings']['floor']['height'] = $infProject['settings']['height'] - 0.01;
	$infProject['settings']['floor']['changeY'] = true;
	$infProject['settings']['wall']['label'] = 'outside';
	$infProject['settings']['wall']['width'] = 0.1;
	$infProject['settings']['wall']['color'][0] = ['index' => 3, 'o' => 0x222222];
	$infProject['settings']['unit']['floor'] = 0.01; 
	$infProject['settings']['camera']['zoom'] = 0.25;
	$infProject['settings']['camera']['limitZoom'] = 5; 	
	$infProject['settings']['grid'] = ['count' => 100, 'size' => 1];
	$infProject['settings']['interface']['estimate'] = 0;		
}
else if($url == '/calculator/obyem_pomeshcheniya') 
{ 
	$infProject['scene']['load'] = 'plan_area';	
	$infProject['load']['img'] = ['img/load/kirpich.jpg'];
	$infProject['settings']['project'] = 'plan_area';
	$infProject['settings']['wall']['label'] = 'inside';
	$infProject['settings']['wall']['dist'] = 'inside';
	$infProject['settings']['wall']['material'][0] = ['index' => 1, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]];
	$infProject['settings']['wall']['material'][1] = ['index' => 2, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]];
	$infProject['settings']['floor']['o'] = true;
	$infProject['settings']['floor']['areaPoint'] = 'inside';
}	
else if($url == '/calculator/shtukaturka_na_stene') 
{ 
	$infProject['scene']['load'] = 'wall_kirpich';
	$infProject['load']['img'] = ['img/load/kirpich.jpg', 'img/load/beton.jpg'];
	$infProject['settings']['project'] = 'wall_plaster';
	$infProject['settings']['camera']['type'] = 'front';
	$infProject['settings']['interface']['button']['cam2d'] = 'front';
	$infProject['settings']['wall']['material'][0] = ['index' => 1, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]];
	$infProject['settings']['wall']['material'][1] = ['index' => 2, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]];
	$infProject['settings']['wall']['length'] = 6;
	$infProject['settings']['wall']['width'] = 0.3;
	$infProject['settings']['wall']['height'] = 2.5;
	$infProject['settings']['wall']['plaster'] = ['width' => 0.03];
}
else if($url == '/calculator/raschet_kirpicha') 
{ 
	$infProject['scene']['load'] = 'wall_kirpich';
	$infProject['load']['img'] = ['img/load/beton.jpg', 'img/load/one_kirpich.jpg'];
	$infProject['settings']['project'] = 'wall_kirpich';
	$infProject['settings']['camera']['type'] = 'front';
	$infProject['settings']['interface']['button']['cam2d'] = 'front';
	$infProject['settings']['wall']['material'][0] = ['index' => 1, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]]; 
	$infProject['settings']['wall']['material'][1] = ['index' => 2, 'img' => $infProject['load']['img'][0], 'repeat' => ['x' => 0.6, 'y' => 0.6]];
	
	$infProject['settings']['wall']['block']['size'] = ['x' => 0.25, 'y' => 0.065, 'z' => 0.120];		// размер блока кирпича
	$infProject['settings']['wall']['block']['seam'] = 0.01;
	$infProject['settings']['wall']['block']['layer'] = '0.5';
	$infProject['settings']['wall']['block']['material'] = ['o' => null, 'link' => 'img/load/one_kirpich.jpg'];
}	
else if($url == '/calculator/raschet_blokov') 
{ 
	$infProject['scene']['load'] = 'wall_block';
	$infProject['load']['img'] = ['img/load/block_1.jpg', 'img/load/block_1.jpg'];
	$infProject['settings']['project'] = 'wall_block';
	$infProject['settings']['camera']['type'] = 'front';
	$infProject['settings']['interface']['button']['cam2d'] = 'front';
	
	$infProject['settings']['wall']['block']['size'] = ['x' => 0.6, 'y' => 0.2, 'z' => 0.3];		// размер блока кирпича
	$infProject['settings']['wall']['block']['seam'] = 0.005;
	$infProject['settings']['wall']['block']['layer'] = '0.5';
	$infProject['settings']['wall']['block']['material'] = ['o' => null, 'link' => 'img/load/block_1.jpg'];
}
else if($url == '/calculator/warm_floor')
{
	//$infProject['scene']['load'] = 'shape3';	
	$infProject['settings']['project'] = 'warm_floor';
	$infProject['settings']['floor']['o'] = true;
	$infProject['settings']['floor']['areaPoint'] = 'inside';
	$infProject['settings']['floor']['label'] = false;
	$infProject['settings']['floor']['color'] = 0xf7f2d5;
	$infProject['settings']['wf_tube'] = [ 'd'=> 0.02 ];
	$infProject['settings']['wf_tube']['pos'] = [ 'y' => 0.2 ];
	$infProject['settings']['wall']['label'] = 'double';
	$infProject['settings']['wall']['color']['top'] = 0xded3b8;
	$infProject['settings']['wall']['color']['front'] = 0xada186;
	$infProject['settings']['grid']['size'] = 0.2;
	$infProject['settings']['grid']['count'] = null;
	$infProject['settings']['grid']['pos'] = [ 'y' => 0.19 ];
	$infProject['settings']['grid']['color'] = 0x009dff;
	$infProject['settings']['interface']['button']['mode_1'] = ['mode' => ['План', 'Монтаж'], 'active' => 'План'];
	$infProject['settings']['interface']['button']['showHideWall_1'] = ['active' => 'Спрятать стены'];
}



$jsonPhp = json_encode($infProject);


//getFindValue_1([['wall_2'],['bottom'],['width_1']]);

function getFindValue_1($array)
{
	$arr = [];
	
	for ($i = 0; $i<count($array); $i++) 
	{
		$arr[$array[$i][0]] = [];
		//if(!isset($infProject[$arr[$i]])) { $arr = []; break; }
		
	}
	
	echo '<pre>'; 
	print_r($arr); 
	echo '</pre>';
	
	//var_dump($arr);
}




?>