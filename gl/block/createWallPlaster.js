


// получаем параметры стены и кирпичей/блоков из input
function getFormWallR_12() 
{
	if(infProject.settings.project == 'wall_block' || infProject.settings.project == 'wall_kirpich'){}
	else return;
	
	//--------------------
	
	var seam = $('input[name="block_seam"]:checked').val();	// толщина шва
	infProject.settings.wall.brick.seam = Number(seam);
	
	//--------------------
	
	var size = $('input[name="block_size"]:checked').val();		// размер блока 
	
	if(infProject.settings.project == 'wall_kirpich')
	{
		if(size == "250х120х65") { size = {x:0.25, y:0.065, z:0.120}; }
		else if(size == "250х120х88") { size = {x:0.25, y:0.088, z:0.120}; }
		else if(size == "250х120х140") { size = {x:0.25, y:0.140, z:0.120}; }
		else { size = {x:0.25, y:0.065, z:0.120}; }
	}
	else if(infProject.settings.project == 'wall_block')
	{
		if(size == "600х200х200") { size = {x:0.6, y:0.2, z:0.2}; }
		else if(size == "600х250х200") { size = {x:0.6, y:0.2, z:0.25}; }
		else if(size == "600х300х200") { size = {x:0.6, y:0.2, z:0.3}; }
		else { size = {x:0.6, y:0.2, z:0.2}; }		
	}
	
	infProject.settings.wall.brick.size = size;
	
	//--------------------
	
	
	if(infProject.settings.project == 'wall_kirpich')
	{
		infProject.settings.wall.brick.layer = $('input[name="block_layer"]:checked').val();		// тип укладки	
	}
	
		
}


// проверяем в input изменили ли параметры стены по сравнению со старыми значениями
function checkChangeFormWallR2()
{
	if(infProject.settings.project == 'wall_block' || infProject.settings.project == 'wall_kirpich'){}
	else return;

	var size = infProject.settings.wall.brick.size;
	var seam = infProject.settings.wall.brick.seam;
	var layer = infProject.settings.wall.brick.layer;
	
	
	getFormWallR_1();
	
	var size_2 = infProject.settings.wall.brick.size;
	var seam_2 = infProject.settings.wall.brick.seam;
	var layer_2 = infProject.settings.wall.brick.layer;
	
	var up = false;
	
	if(size.x != size_2.x) { up = true; }
	else if(size.y != size_2.y) { up = true; }
	else if(size.z != size_2.z) { up = true; }
	else if(seam != seam_2) { up = true; }
	else if(layer != layer_2) { up = true; }
	
	if(up)
	{
		if(infProject.scene.array.wall.length > 0) 
		{
			resetScene(); 
			createFormWallR(); 
			if(camera == cameraWall) changeCamera(cameraWall);
		}
	}
	
}


// создаем стену и штукатурку при первом запуске
function createWallPlaster()
{	
	if(1==2)
	{
		var value = $('input[data-input="wall_plaster_width_1"]').val();	
		if(!isNumeric(value)) value = 3;		
		value = Math.round(value) / 100;				
	}
	
	height_wall = infProject.settings.wall.height;
	
	var inf = { height : infProject.settings.wall.height, plaster : { width : infProject.settings.wall.plaster.width } };
	
	createPoint( new THREE.Vector3(-3,0,0), 0 );
	createPoint( new THREE.Vector3(3,0,0), 0 );
	
	var wall = createOneWall3( obj_point[0], obj_point[1], width_wall, JSON.parse( JSON.stringify( inf ) ) );	
	
	var v = wall.userData.wall.v; 		
	var x = Math.abs( v[6].x - v[0].x );		
	var y = Math.abs( v[1].y - v[0].y );	
	
	$('[nameId="size-wall-length"]').val(Math.round(x * 100)/100);
	$('[nameId="size-wall-height"]').val(Math.round(y * 100)/100);
	
	var plaster = wall.userData.wall.plaster.o;
	var z = plaster.userData.wall_2.width;
	
	$('input[data-input="wall_plaster_width_1"]').val(z * 100);	
	
	console.log(z * 100);
	
	renderCamera();
}



// изменение ширины штукатурки на стене
function inputWidthOneWallPlaster(cdm) 
{
	var wall = cdm.wall;
	var unit = cdm.width.unit;
	var width = cdm.width.value;
	var index = cdm.index; 	

	var wall_2 = wall.userData.wall.plaster.o;
	
	if(!isNumeric(width)) 
	{
		width = wall_2.userData.wall_2.width;	
	}
	else
	{
		if(unit == 'cm'){ width /= 100; }
		else if(unit == 'mm'){ width /= 1000; }		
	}		

	var index = 1;
	
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	if(index == 1) { var x = v[v.length - 6].x - v[0].x; }
	else if(index == 2) { var x = v[v.length - 2].x - v[4].x; }	

	
	var geometry = createGeometryCube(1, wall_2.userData.wall_2.height_1, 1, {material:true});
	var v = geometry.vertices;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	v[2].x = v[3].x = v[4].x = v[5].x = x;
	v[0].z = v[1].z = v[2].z = v[3].z = width;	// index 1
	v[4].z = v[5].z = v[6].z = v[7].z = 0;		

	wall_2.geometry = geometry;
	wall_2.userData.wall_2.width = Math.round(width * 100) / 100;
	
	wall_2.geometry.verticesNeedUpdate = true; 
	wall_2.geometry.elementsNeedUpdate = true;	
	wall_2.geometry.computeBoundingSphere();
	wall_2.geometry.computeBoundingBox();
	wall_2.geometry.computeFaceNormals();		

	upUvs_1( wall_2 );
	
	
	
	if(wall.userData.wall.arrO.length > 0) clickMoveWD_BSP( null, wall );
	
	renderCamera();
}



