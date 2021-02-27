


// пускаем луч и определяем к какой комнате принадлежит объект
function rayFurniture( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	//var pos = obj.position.clone();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



 


// если point.userData.point.type != null , то добавляем точку/создаем стену
function clickCreateWall(point) 
{
	var obj = point.userData.point.cross;
	
	if(!obj) return;
	
	if(point.userData.point.type == 'create_wall')
	{ 
		if(obj.userData.tag == 'planeMath') { addPoint_6( point ); } 
		else if(obj.userData.tag == 'point') { addPoint_4( point ); }
		else if(obj.userData.tag == 'wall') { addPoint_5( obj, point ); } 
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(obj.userData.tag == 'planeMath') { addPoint_4( point ); }
		else if(obj.userData.tag == 'wall') { addPoint_5( obj, point ); }
		else if(obj.userData.tag == 'point') { addPoint_4( point ); }
	}	
	else if(point.userData.point.type == 'add_point')
	{  
		if(obj.userData.tag == 'wall') { addPoint_5( obj, point ); } 
	}
	else
	{   
		if(!turnBackPosPoint(point))
		{ 
			if(obj.userData.tag == 'planeMath') { movePointWallPlaneMath(point); }
			else if(obj.userData.tag == 'point') { addPoint_4( point ); }
			else if(obj.userData.tag == 'wall') { addPoint_5( obj, point ); }	 		
		}
	}
	
	point.userData.point.cross = null;
}


// отпускаем перетаскиваемую точку на planeMath
function movePointWallPlaneMath(point) 
{
	updateShapeFloor(point.zone); 
	
	clickPointUP_BSP(param_wall.wallR);
}


// возращаем перетаскиваемую точку на прежнее место
function turnBackPosPoint(point)
{
	var flag = false;
	var crossObj = point.userData.point.cross;
	
	if(crossObj.userData.tag == 'point' || crossObj.userData.tag == 'wall')
	{  
		if(point.w.length > 1)
		{
			if(Math.abs(point.position.y - crossObj.position.y) < 0.3) { flag = true; }			// у перетаскиваемой точки больше одной стены
		}		
	}
		
	
	if(crossLineOnLine_1(point)) { flag = true; }	// стена пересекласть с другой стеной
	
	
	if(flag)
	{
		undoRedoChangeMovePoint( point, param_wall.wallR ); 			
		
		console.log('возращаем точку в прежнее положение');		
	}
	
	return flag;
}




// находим общую стену у двух точек
function findCommmonWallPoint(point1, point2)
{
	var wall = null;
	
	for ( var i = 0; i < point1.p.length; i++ )
	{
		if(point1.p[i] == point2) { wall = point1.w[i]; break; }
	}

	return wall;
}



// разделение стены на две половины по центру 
function addPointCenterWall()
{
	var wall = clickO.obj;
	clickO.obj = null;
	objDeActiveColor_2D();
	
	var pos1 = wall.userData.wall.p[0].position;
	var pos2 = wall.userData.wall.p[1].position;
	
	var pos = new THREE.Vector3().subVectors( pos2, pos1 ).divideScalar( 2 ).add(pos1); 
	var point = createPoint( pos, 0 );
	
	addPoint_1( wall, point );
}


// добавляем точку на стену (разбиваем стену)
function addPoint_1( wall, point )
{	 
	clickO.move = null;					
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;																
	  
	point.userData.point.last.cdm = 'add_point';
	
	var walls = splitWalls( wall, point )	

	point.userData.point.type = null; 

	return point;
}



// определяем с какой стороны окна/двери на стене (в момент, когда мы разделяем стену точкой)
function wallLeftRightWD(wall, posx)
{
	var arrL = [], arrR = [];
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		if (v.x <= posx){ arrL[arrL.length] = wall.userData.wall.arrO[i]; }
		else { arrR[arrR.length] = wall.userData.wall.arrO[i]; }
	}	

	return { wall_1 : arrL, wall_2 : arrR };
}



// разбиваем стену точкой, на 2 стены
// разбиваему стену удаляем, на её месте создаем 2 новых стены
function splitWalls( wall, point )
{
	// собираем данные о стене
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;   
	var p1 = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	var p2 = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	
	 
	var arrW_2 = [];
	var point1 = wall.userData.wall.p[0];
	var point2 = wall.userData.wall.p[1];
	for ( var i = 0; i < point1.w.length; i++ ) { if(point1.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point1.w[i]; }
	for ( var i = 0; i < point2.w.length; i++ ) { if(point2.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point2.w[i]; }
	
	if(point.p.length > 0)
	{ 
		for ( var i = 0; i < point.p[0].w.length; i++ )
		{
			for ( var i2 = 0; i2 < arrW_2.length; i2++ )
			{
				if(point.p[0].w[i] == arrW_2[i2]) continue;
				
				arrW_2[arrW_2.length] = point.p[0].w[i]; break;
			}
		}		
	}
	var wallC = point.w[0];
	var point_0 = point.p[0];
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall] : detectChangeArrWall_3(wallC);
	clickMovePoint_BSP( arrW );	
	
	// определяем с какой стороны (справа/слева) окна/двери (если есть) относительно точки
	wall.updateMatrixWorld();
	var ps = wall.worldToLocal( point.position.clone() );	
	var wd = wallLeftRightWD(wall, ps.x);	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 

	// замыкаем стену (а не просто создаем точку на стене)  
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point')
	{	
		var zone = rayFurniture( point.w[0] ).obj;
		var oldZ_1 = findNumberInArrRoom(zone);
	}

	var v2 = wall.userData.wall.v;
	for ( var i2 = 0; i2 < wall.userData.wall.v.length; i2++ ) { v2[i2] = wall.userData.wall.v[i2].clone(); }

	var oldZones = detectCommonZone_1( wall );   	// определяем с какими зонами соприкасается стена
	var oldZ = findNumberInArrRoom( oldZones );
	deleteArrZone( oldZones );						// удаляем зоны  с которыми соприкасается стена					
	
	deleteWall_3( wall, {dw : 'no delete'} );  							// удаляем разделяемую стену (без удаления зон)(без удаления окон/дверей)	
	
	// находим точки (если стена была отдельна, то эти точки удалены и их нужно заново создать)
	var point1 = findObjFromId( 'point', p1.id );
	var point2 = findObjFromId( 'point', p2.id );	
	
	if(point1 == null) { point1 = createPoint( p1.pos, p1.id ); }
	if(point2 == null) { point2 = createPoint( p2.pos, p2.id ); }		
	
	// создаем 2 новых стены
	var wall_1 = createOneWall3( point1, point, width, { offsetZ : offsetZ, height : height } );	 			
	var wall_2 = createOneWall3( point, point2, width, { offsetZ : offsetZ, height : height } );

	// накладываем материал
	wall_1.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];  
	wall_2.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];
	wall_1.userData.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall_2.userData.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	
	for ( var i = 0; i < v2.length/2; i++ ) { wall_1.userData.wall.v[i] = v2[i].clone(); wall_1.geometry.vertices[i] = v2[i].clone(); }
	
	var sub = v2[8].x - wall_2.userData.wall.v[8].x;
	for ( var i = v2.length/2; i < v2.length; i++ ) { v2[i].x -= sub; } 
	for ( var i = v2.length/2; i < v2.length; i++ ) { wall_2.userData.wall.v[i] = v2[i].clone(); wall_2.geometry.vertices[i] = v2[i].clone(); }
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall_1, wall_2] : detectChangeArrWall_3(wallC);
	
	if(point.userData.point.last.cdm == 'add_point')
	{
		upLineYY_2(point, point.p, point.w, point.start);
	}
	else
	{
		upLineYY_2(point, point.p, point.w, point.start);
		upLineYY_2(point_0, point_0.p, point_0.w, point_0.start);
	}
	
	upLabelPlan_1(arrW); 	
	clickPointUP_BSP( arrW );
	
	var newZones = detectRoomZone();		// создаем пол, для новых помещений	
	
	// передаем параметры старых зон новым	(название зоны)	
	var flag = false;
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point') { if(zone) { flag = true; } }	// если замыкаем стену, то проверяем, есть ли пересечение с помещением
	
	if(flag) { assignOldToNewZones_2(newZones, oldZ_1[0], true); } 
	else { assignOldToNewZones_1(oldZ, newZones, 'add'); }		
	
	
	// вставляем окна/двери
	for ( var i = 0; i < wd.wall_1.length; i++ ) 
	{ 
		var obj = wd.wall_1[i];
		
		obj.userData.door.wall = wall_1;
		wall_1.userData.wall.arrO[wall_1.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_1, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 
		cutMeshBlockBSP( obj );		
	} 
	
	for ( var i = 0; i < wd.wall_2.length; i++ ) 
	{ 
		var obj = wd.wall_2[i];
		
		obj.userData.door.wall = wall_2;
		wall_2.userData.wall.arrO[wall_2.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_2, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 
		cutMeshBlockBSP( obj );		
	} 	
	
	
	return [wall_1, wall_2];
}





// 1. кликнули на точку, создаем новую стену из этой точки (создаем стену: от точки)
// 2. продолжаем создавать новую стену
// 3. заканчиваем создание новой стены на точке 
// 4. замыкание старой точки с другой точкой
function addPoint_4( point )
{ 	
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { movePointWallPlaneMath(point); return; }
	
	if(point.userData.point.type == 'create_wall')			// 1
	{		 	
		var wall = createOneWall3( point, point.userData.point.cross, width_wall, {} ); 		 
		point.userData.point.type = 'continue_create_wall';
		point.userData.point.cross.userData.point.last.cdm = 'new_wall_from_point';
		clickO.move = point;
		clickMovePoint_BSP( point.userData.point.cross.w );	
		console.log('1. кликнули на точку, создаем новую стену из этой точки');
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(point.userData.point.cross == planeMath)		// 2
		{	
			if(crossLineOnLine_1(point)) return; 	// произошло пересечение с другой стеной
			
			var inf = infProject.settings.calc.fundament;
			if(inf == 'lent' || inf == 'svai')  
			{				
				if(!point.w[0].userData.wall.zone) { createWallZone(point.w[0]); }
			}
			
			
			point.userData.point.type = null; 			
			var point2 = createPoint( point.position, 0 );			
			var wall = createOneWall3( point, point2, width_wall, {} ); 			
			clickO.move = point2;
			upLabelPlan_1( point.p[0].w );			
			point2.userData.point.type = 'continue_create_wall'; 

			if(point.p[0].userData.point.last.cdm == 'new_point_1' || point.p[0].userData.point.last.cdm == 'new_wall_from_point')
			{
				clickPointUP_BSP( point.p[0].w );				
			}			
			
			console.log('2. продолжаем создавать новую стену');
		} 
		else if(point.userData.point.cross.userData.tag == 'point')		// 3
		{			
			if(point.userData.point.cross.userData.point.last.cdm == 'new_point_1' && clickO.move.userData.point.cross == point || point.userData.point.cross == point.p[0])
			{ 
				deleteWall_2(point.w[0]);
				clickO.move = null;
				clickO = resetPop.clickO();
			}						
			else
			{
				addPointOption_4(point);
			}			
		}
	} 
	else if(!point.userData.point.type) 	// 4
	{ 	
		addPointOption_4(point);		
	}

	param_wall.wallR = point.w;
}


function addPointOption_4(point)
{	
	if(turnBackPosPoint(point)) { return; }		// стена пересекласть с другой стеной				

	clickMovePoint_BSP( point.userData.point.cross.w );
	
	var wall = point.w[0];
	var point1 = point.userData.point.cross;
	var point2 = point.p[0];								

	var m = point1.p.length; 
	point1.p[m] = point2;
	point1.w[m] = wall;
	point1.start[m] = point.start[0];
	
	var m = point2.p.length; 
	point2.p[m] = point1;
	point2.w[m] = wall;
	point2.start[m] = (point.start[0] == 0) ? 1 : 0;
			
	var m = (wall.userData.wall.p[0] == point) ? 0 : 1;	
	wall.userData.wall.p[m] = point1;
	
	deleteOneOnPointValue(point2, wall);			
	deletePointFromArr(point);
	scene.remove(point);

	upLineYY_2(point1, point1.p, point1.w, point1.start);
	upLabelPlan_1( point1.w ); 

	splitZone(wall);   
	
	if(!point.userData.point.type) 
	{ 
		console.log('4. замыкание старой точки с другой точкой'); 		
		
		if(wall.userData.wall.p[0] == point1) { var p1 = [point1, point2]; var p2 = [point, point2]; }
		else { var p1 = [point2, point1]; var p2 = [point2, point]; }							 
	} 
	else if(point.userData.point.cross.userData.tag == 'point') 
	{ 
		console.log('3. заканчиваем создание новой стены на точке (от точки к точке)'); 
	}	
	
	var arrW = [];
	for ( var i = 0; i < point1.w.length; i++ ) { arrW[arrW.length] = point1.w[i]; }
	
	//if(!point.userData.point.type)
	if(1==1)	
	{
		for ( var i = 0; i < point2.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW.length; i2++ ) 
			{
				if(point2.w[i] == arrW[i2]) { flag = false; break; }
			}
			
			if(flag) arrW[arrW.length] = point2.w[i];
		}		
	}
	
	clickPointUP_BSP( arrW );
	
	if(point.w.length > 0) { createWallZone(point.w[0]); }
	
	clickO.move = null;
}


 


// 1. разбиваем стену (вкл режим резбить стену)
// 2. заканчиваем создание стены пересекаясь с другой стеной, отключаем режим создания стены 
// 3. создаем новую стену: от стены
// 4. перетаскиваем старую стену и соединяем с другой стеной
function addPoint_5( wall, point )
{ 
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { movePointWallPlaneMath(point); return; }
	
	if(point.userData.point.type == 'add_point')			// 1 
	{    
		addPoint_1( wall, point ); 
		console.log('создали точку');
	}
	else if(point.userData.point.type == 'continue_create_wall')			// 2
	{
		console.log('заканчиваем создание стены на стене');				 

		point.userData.point.last.cdm = 'new_point_2'; 
		
		var arrW = splitWalls( wall, point );
		
		// для undo/redo и для отмены правой кнопкой 
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		point.userData.point.type = null; 		
		
		clickO.move = null; 		
	}
	else if(point.userData.point.type == 'create_wall')		// 3
	{	
		console.log('создаем новую стену: от стены');
		point.userData.point.type = null;
		point.userData.point.last.cdm = 'new_point_1'; 
		var point1 = point;		
		var point2 = createPoint( point.position.clone(), 0 );			 							
		
		point2.userData.point.cross = point1;
		
		var newWall = createOneWall3( point1, point2, width_wall, {} ); 
		var arrW = splitWalls( wall, point1 );
		
		// для undo/redo и для отмены правой кнопкой 
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		clickMovePoint_BSP( point1.w );

		clickO.move = point2;
		point2.userData.point.type = 'continue_create_wall'; 				 
	}
	else if(!point.userData.point.type)		// 4
	{		
		console.log('перетаскиваем старую точку и соединяем с другой стеной'); 			
		
		var p1 = point.p[0];
		var selectWall = point.w[0];
		
		point.userData.point.last.cdm = 'new_point';
		
		var arrW = splitWalls( wall, point );		 
		
		var arrW2 = p1.w;
		
		for ( var i = 0; i < p1.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW2.length; i2++ ) 
			{
				if(p1.w[i] == arrW2[i2]) { flag = false; break; }
			}
			
			if(flag) arrW2[arrW2.length] = p1.w[i];
		}
		
		clickPointUP_BSP( arrW2 );	

		// для undo/redo и для отмены правой кнопкой 
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};		  	  
		
		clickO.move = null;
	}

	param_wall.wallR = point.w;
	
	if(point.w.length > 0) { createWallZone(point.w[0]); } 
}





//создаем стену: в любом месте (не на стене и не на точке)
function addPoint_6( point1 )
{  		
	point1.userData.point.type = null;		
	var point2 = createPoint( point1.position.clone(), 0 );			
	point2.userData.point.type = 'continue_create_wall';
	
	var wall = createOneWall3( point1, point2, width_wall, {} );		
	
	clickO.move = point2; 
	
	param_wall.wallR = [wall];
}





 



