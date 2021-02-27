

function detectDeleteObj()
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(camera == camera3D)
	{
		if ( tag == 'wall' ) return;
	}
	else if(camera == cameraWall)
	{
		if ( tag == 'wall' ) return;
	}	
		
	if ( tag == 'wall' ) { deleteWall_1( obj ).room; }
	else if ( tag == 'point' ) { if(obj.p.length == 2) { deletePoint( obj ); } }
	else if ( tag == 'wf_point' ) { deletePointWF(obj); }
	else if ( tag == 'wf_line' ) { deleteLineWF(obj); }
	else if ( tag == 'window' || tag == 'door' ) { deleteWinDoor( obj ); }
	else if ( tag == 'obj' ) { deleteObjectPop(obj); }
	
	 renderCamera();
}


function deleteWall_1( wall )
{	
	//hideMenuObjUI_2D(wall);
//calculationZoneFundament_1(wall)
	hideMenuUI(wall);
	
	var points = wall.userData.wall.p;

	var arrZone = detectCommonZone_1( wall );
	var oldZ = findNumberInArrRoom(arrZone);
	deleteArrZone(arrZone); 
	
	var zone = (arrZone.length == 0) ? rayFurniture( wall ).obj : null; 
	
	deleteWall_2(wall);
	
	var newZones = [];
	
	// новые зоны, после удаления стены 
	if(oldZ.length > 0) 
	{ 
		var area = oldZ[0].floor.userData.room.areaTxt;
		var n = 0;
		for ( var i = 0; i < oldZ.length; i++ ) { if(oldZ[i].floor.userData.room.areaTxt > area) { n = i; } }
		
		newZones = detectRoomZone();

		if(newZones.length > 0) { assignOldToNewZones_2([newZones[0]], oldZ[n], false); } // если есть новая зона после удаления стены		
	}
	else
	{	
		if(zone) { getYardageSpace([zone]); }				
	}
	
	
	var inf = infProject.settings.calc.fundament;
	if(inf == 'lent' || inf == 'svai')	
	{
		if(points[0].w.length > 0)
		{
			createWallZone(points[0].w[0]); 
		}
		
		if(points[1].w.length > 0)
		{
			createWallZone(points[1].w[0]);
		}

		if(points[0].w.length == 0 && points[1].w.length == 0) { scene.remove(wall.userData.wall.zone.label); }
	}

	return { room : newZones }; 
}


// здесь только удаление стены, без обновления зон/площади/пола
function deleteWall_2(wall)
{
	objDeActiveColor_2D();
	
	var arr = wall.userData.wall.arrO;

	for(var i = 0; i < arr.length; i++)
	{
		if(arr[i].userData.tag == 'window') { deleteValueFromArrya({arr : infProject.scene.array.window, o : arr[i]}); }
		if(arr[i].userData.tag == 'door') { deleteValueFromArrya({arr : infProject.scene.array.door, o : arr[i]}); }
		scene.remove( arr[i] );
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	deleteOneOnPointValue(p0, wall);
	deleteOneOnPointValue(p1, wall);
	deleteValueFromArrya({arr : infProject.scene.array.wall, o : wall});;
	
	for ( var i = 0; i < wall.label.length; i ++ ){ scene.remove(wall.label[i]); } 
	scene.remove( wall );
	
	if(p0.w.length == 0){ deletePointFromArr( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ deletePointFromArr( p1 ); scene.remove( p1 ); }


	var arrW = [];
	for ( var i = 0; i < p0.w.length; i++ ) { arrW[arrW.length] = p0.w[i]; }
	for ( var i = 0; i < p1.w.length; i++ ) { arrW[arrW.length] = p1.w[i]; }  
	clickMovePoint_BSP( arrW );	
	
	if(p0.w.length > 0){ upLineYY_2(p0, p0.p, p0.w, p0.start); }
	if(p1.w.length > 0){ upLineYY_2(p1, p1.p, p1.w, p1.start); }

	upLabelPlan_1(arrW);
	
	clickPointUP_BSP( arrW );
}


// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)
function deleteWall_3(wall, cdm)
{
	if(!cdm) { cdm = {}; }
	if(!cdm.dw) { cdm.dw = ''; }
	
	objDeActiveColor_2D();
	
	if(cdm.dw == 'no delete') {}
	else
	{
		var arr = wall.userData.wall.arrO;
		
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i].userData.tag == 'window') { deleteValueFromArrya({arr : infProject.scene.array.window, o : arr[i]}); }
			if(arr[i].userData.tag == 'door') { deleteValueFromArrya({arr : infProject.scene.array.door, o : arr[i]}); }
			scene.remove( arr[i] );
		}		
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	deleteOneOnPointValue(p0, wall);
	deleteOneOnPointValue(p1, wall);
	deleteValueFromArrya({arr : infProject.scene.array.wall, o : wall});;
	
	for ( var i = 0; i < wall.label.length; i ++ ){ scene.remove(wall.label[i]); }	
	scene.remove( wall );
	
	if(p0.w.length == 0){ deletePointFromArr( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ deletePointFromArr( p1 ); scene.remove( p1 ); }

}


// удаляем одну единственную точку (без стен), которая привязанна к мыши
function deleteOnePoint( point )
{
	deletePointFromArr(point); 
	scene.remove(point);
}

// удаление точки
function deletePoint( point )
{
	if(!point){ return [ null, null ]; }
	if(point.p.length != 2){ return [ null, null ]; }
	
	hideMenuUI(point);
	
	var wall_1 = point.w[0];
	var wall_2 = point.w[1];
		
	var arrW_2 = detectChangeArrWall([], point);
	
	clickMovePoint_BSP( arrW_2 );
	 
	var point1 = point.p[0];
	var point2 = point.p[1];
	
	var p1 = { id : point1.userData.id, pos : point1.position.clone() };
	var p2 = { id : point2.userData.id, pos : point2.position.clone() };	

	var dir1 = new THREE.Vector3().subVectors( point.position, point1.position ).normalize();
	var dir2 = new THREE.Vector3().subVectors( point2.position, point.position ).normalize();
	
	var d1 = wall_1.userData.wall.p[0].position.distanceTo( wall_1.userData.wall.p[1].position );
	var d2 = wall_2.userData.wall.p[0].position.distanceTo( wall_2.userData.wall.p[1].position );
	
	var wall = (d1 > d2) ? wall_1 : wall_2;	
	var res = (d1 > d2) ? 1 : 2;
	
	
	// собираем данные о стене
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;
	var userData_material = wall.userData.material;
	
	// переварачиваем текстуру, если текструа была на одной стороне, то переносим ее на другую сторону стены
	if(res == 1)
	{
		if(point.start[0] != 1)		
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}
	if(res == 2)
	{
		if(point.start[1] != 0)
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}	
	
	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 
	var arrO = [];
	for ( var i = 0; i < wall_1.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_1.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}

	for ( var i = 0; i < wall_2.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_2.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = detectCommonZone_1( wall_1 );   	// определяем с какиеми зонами соприкасается стена
	var oldZ = findNumberInArrRoom( oldZones );
	deleteArrZone( oldZones );						// удаляем зоны  с которыми соприкасается стена									

	
	deleteWall_3( wall_1 );		// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)		
	deleteWall_3( wall_2 );		// удаляем разделяемую стену и окна/двери, которые принадлежат ей (без удаления зон)	
	 

	// находим точки (если стена была отдельна, то эти точки удалены и их нужно заново создать)
	var point1 = findObjFromId( 'point', p1.id );
	var point2 = findObjFromId( 'point', p2.id );	
	
	if(point1 == null) { point1 = createPoint( p1.pos, p1.id ); }
	if(point2 == null) { point2 = createPoint( p2.pos, p2.id ); }	
	
	var wall = createOneWall3( point1, point2, width, { offsetZ : offsetZ, height : height } ); 

	upLineYY_2(point1, point1.p, point1.w, point1.start);
	upLineYY_2(point2, point2.p, point2.w, point2.start);
	
	var arrW = [];
	for ( var i = 0; i < arrW_2.length; i++ ) { arrW[arrW.length] = arrW_2[i]; }
	arrW[arrW.length] = wall;
	
	upLabelPlan_1( arrW );	
	
	var newZones = detectRoomZone();		// создаем пол, для новых помещений	
	assignOldToNewZones_1(oldZ, newZones, 'delete');		// передаем параметры старых зон новым	(название зоны)			
	
	
	// вставляем окна/двери (если стены параллельны)
	if(comparePos(dir1, dir2)) 
	{
		for ( var i = 0; i < arrO.length; i++ ) { arrO[i].wall = wall; } 
	}
	
	// накладываем материал
	wall.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall.userData.material = userData_material; 
	
	clickPointUP_BSP( arrW );
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false; 

	createWallZone(wall);
	calculationAreaFundament_2();
	
	return { point : { id : point.userData.id }, wall : wall }; 
} 



// удаление объекта (окно/дверь) из сцены
function deleteWinDoor( obj )
{	
	var wall = obj.userData.door.wall; 		
	
	clickMoveWD_BSP( obj );		
		
	deleteValueFromArrya({arr : wall.userData.wall.arrO, o : obj});	
	
	if(obj.userData.tag == 'window') { hideMenuUI(obj); }
	if(obj.userData.tag == 'door') { hideMenuUI(obj); }
	
	clickO = resetPop.clickO();
	hideSizeWD( obj ); 

	if(camera == camera3D)
	{
		wall.label[0].visible = false; 
		//wall.label[1].visible = false;	 			
	}
	
	
	if(obj.userData.tag == 'window') { deleteValueFromArrya({arr : infProject.scene.array.window, o : obj}); }
	if(obj.userData.tag == 'door') { deleteValueFromArrya({arr : infProject.scene.array.door, o : obj}); }
	
	scene.remove( obj );	
}






// удаление значения из массива 
function deleteValueFromArrya(cdm)
{
	var arr = cdm.arr;
	var o = cdm.o;
	
	for(var i = arr.length - 1; i > -1; i--) { if(arr[i] == o) { arr.splice(i, 1); break; } }
}


// удаление у точки 3 параметров
function deleteOneOnPointValue(point, wall)
{
	var n = -1;
	for ( var i = 0; i < point.w.length; i++ ){ if(point.w[i].userData.id == wall.userData.id) { n = i; break; } }
	
	point.p.splice(n, 1);
	point.w.splice(n, 1);
	point.start.splice(n, 1);	
}




// удаление точки из массива точек
function deletePointFromArr(point)
{
	var n = -1;
	for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == point.userData.id) { n = i; break; } }
	
	if(obj_point[n].userData.point.pillar) { scene.remove( obj_point[n].userData.point.pillar ); }
		
	obj_point.splice(n, 1);	
}




