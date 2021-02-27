

// создаем контроллеры для изменения ширины/высоты окна (при клике на оконо они появляются)
function createControllWD() 
{
	var arr = []; 
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( new THREE.BoxGeometry( 0.15, 0.15, 0.15 ), new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 } ) );
		
		obj.userData.tag = 'controll_wd';
		obj.userData.controll_wd = { id : i, obj : null };		
		obj.visible = false;
		
		
		var child = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshLambertMaterial( { color : 'rgb(17, 255, 0)', transparent: true, opacity: 1, depthTest: false } ) );
		child.renderOrder = 2;
		obj.add( child );
		 
		arr[i] = obj;
		scene.add( arr[i] );
	}		
	
	return arr;
}





// показываем контроллеры
function showControllWD( wall, obj )
{	
	var p = [];	
	
	obj.geometry.computeBoundingBox(); 
	obj.geometry.computeBoundingSphere(); 	
	
	var bound = obj.geometry.boundingBox;
	var center = obj.geometry.boundingSphere.center; 


	var arrVisible = [true, true, true, true];
	
	if(camera == cameraTop) { arrVisible = [true, true, false, false]; }
	else if(camera == camera3D) { arrVisible = [false, false, false, false]; }
	
	if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
	{
		if(!obj.userData.door.topMenu) { arrVisible = [false, false, false, false]; }
		
		// позиция котроллеров 
		p[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, center.y, center.z) );
		p[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, center.y, center.z) );
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}
	else
	{
		arrVisible = [false, false, false, false];
		
		// позиция котроллеров
		var p3 = [];
		p3[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.min.z)) );	
		p3[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.max.z)) );		
		p3[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.min.z)) );
		p3[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.max.z)) );

		var min = { vx: p3[0].x, vz: p3[0].z };
		var max = { vx: p3[0].x, vz: p3[0].z };
		
		for ( var i = 0; i < p3.length; i++ )
		{
			if(min.vx > p3[i].x) { min.vx = p3[i].x; }
			if(max.vx < p3[i].x) { max.vx = p3[i].x; }
			if(min.vz > p3[i].z) { min.vz = p3[i].z; }
			if(max.vz < p3[i].z) { max.vz = p3[i].z; }			
		}
		
		p[0] = wall.localToWorld( new THREE.Vector3(min.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		p[1] = wall.localToWorld( new THREE.Vector3(max.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}

	var arr = arrSize.cube;
	for ( var i = 0; i < arr.length; i++ )
	{		
		arr[i].position.copy( p[i] );	
		arr[i].rotation.copy( wall.rotation );
		arr[i].visible = arrVisible[i];
		arr[i].obj = obj; 
		arr[i].userData.controll_wd.obj = obj;
	}
}


		
		

// показываем линейки и контроллеры для окна/двери (собираем инфу, для перемещения линеек) 
function showRulerWD(obj)
{
	var wall = obj.userData.door.wall;   

	showControllWD( wall, obj );		// показываем контроллеры 
	
	
	var boundPos = [];
	
	if(camera == cameraWall)
	{
		var arr = detectDirectionWall_1(wall, arrWallFront.wall[0].index, detectRoomWallSide(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();		
	}
	else	
	{
		// находим (границы) позиции от выбранного окна/двери до ближайших окон/дверей/края стены
		var arr = detectDirectionWall_1(wall, 1, detectRoomWallSide(wall, 1));	
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();
		
		var arr = detectDirectionWall_1(wall, 2, detectRoomWallSide(wall, 0));
		boundPos[2] = arr[0].clone();
		boundPos[3] = arr[2].clone();  		
	}	
	
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		arrWallFront.wall[i].obj.label[0].visible = false;
		arrWallFront.wall[i].obj.label[1].visible = false;		
	}
	
	var v = wall.userData.wall.v;
	var vZ = v[0].z + (v[4].z - v[0].z) / 2; 
	
	for ( var i = 0; i < boundPos.length; i++ ){ boundPos[i].z = vZ; boundPos[i].y = 0; wall.localToWorld( boundPos[i] ); } 

	// инфа для перемещения линеек	
	obj.userData.door.ruler.boundPos = boundPos;	
	
	// может быть clickO.rayhit.object.userData.tag == 'controll_wd' ( когда кликнули на контроллер, а потом ввели значение в input и нажали enter )
	if(clickO.rayhit.object.userData.tag == 'window' || clickO.rayhit.object.userData.tag == 'door') 
	{ 
		//obj.userData.door.ruler.faceIndex = clickO.rayhit.faceIndex; 		
		obj.userData.door.ruler.faceIndex = clickO.rayhit.face.normal.z;
	}	 
	
	showRulerWD_2D(obj);  
	showRulerWD_3D(obj);
}



// перемещаем линейки и лайблы 2D
function showRulerWD_2D(wd)
{
	if(camera != cameraTop) return;
	
	var wall = wd.userData.door.wall;
	var boundPos = wd.userData.door.ruler.boundPos;
	var p = [];
	for ( var i = 0; i < arrSize.cube.length; i++ ) { p[i] = arrSize.cube[i].position; }
	
	var x1 = wall.userData.wall.p[1].position.z - wall.userData.wall.p[0].position.z;
	var z1 = wall.userData.wall.p[0].position.x - wall.userData.wall.p[1].position.x;	
	var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены
	
	var width = Number(wall.userData.wall.width) / 2 + 0.05;	

	var dz_1 = dir.clone().multiplyScalar( -width );
	var dz_2 = dir.clone().multiplyScalar( width );
	var dz_3 = dir.clone().multiplyScalar( -0.1 );
	var dz_4 = dir.clone().multiplyScalar( 0.1 );	
	
	var dirZ = [];
	dirZ[0] = dz_3;
	dirZ[1] = dz_4;
	dirZ[2] = dz_3;	
	dirZ[3] = dz_4;
	dirZ[4] = dz_3;
	dirZ[5] = dz_4;
		
	
	var p2 = [];	
	p2[0] = new THREE.Vector3().addVectors(boundPos[0], dz_1);	
	p2[1] = new THREE.Vector3().addVectors(boundPos[2], dz_2);
	p2[2] = new THREE.Vector3().addVectors(p[1], dz_1);
	p2[3] = new THREE.Vector3().addVectors(p[1], dz_2);
	p2[4] = new THREE.Vector3().addVectors(p[0], dz_1);
	p2[5] = new THREE.Vector3().addVectors(p[0], dz_2);

	var w2 = [];	
	w2[0] = p2[4];
	w2[1] = p2[5];
	w2[2] = new THREE.Vector3().addVectors(boundPos[1], dz_1);	
	w2[3] = new THREE.Vector3().addVectors(boundPos[3], dz_2);
	w2[4] = p2[2];
	w2[5] = p2[3];	


	var wp = [];
	wp[0] = p2[0];
	wp[1] = p2[1];
	wp[2] = p2[2];
	wp[3] = p2[3];
	wp[4] = w2[0];
	wp[5] = w2[1];
	wp[6] = w2[2];
	wp[7] = w2[3];
	
	for ( var i = 0; i < wp.length; i++ ) { wp[i].y = 0; }
	for ( var i = 0; i < p2.length; i++ ) { p2[i].y = 0; }

	var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position );  		
	var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir.clone().normalize()) );  // из кватерниона в rotation

	var rotY2 = Math.atan2(dir.x, dir.z); 
	if(rotY2 <= 0.001){ rotY2 -= Math.PI / 2; }
	else { rotY2 += Math.PI / 2; }	
	
	var line = arrSize.format_2.line;
	var label = arrSize.format_2.label;	
	
	// линейки показывающие длину
	for ( var i = 0; i < 6; i++ )
	{ 
		var d = w2[i].distanceTo(p2[i]); 
		var v = line[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		line[i].geometry.verticesNeedUpdate = true;
				
		line[i].position.copy( p2[i] );
		line[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);
		line[i].visible = true;
				
		var dir = new THREE.Vector3().subVectors( w2[i], p2[i] );
		label[i].position.copy( p2[i] );	
		label[i].position.add( dirZ[i] );
		label[i].position.add( dir.divideScalar( 2 ) ); 
		label[i].rotation.set( -Math.PI / 2, 0, rotY2 - Math.PI );
		label[i].visible = true;
		
		upLabelCameraWall({label : label[i], text : Math.round(d * 100) * 10, color : 'rgba(0,0,0,1)', border : 'border line'});
	}	

	// линейки отсечки
	var arr = arrSize.cutoff;	
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].position.copy( wp[i] );
		arr[i].rotation.set(rotation.x, rotation.y, 0);
		arr[i].material.color.set(0x222222);
		arr[i].visible = true;
	}	
}


// перемещаем линейки и лайблы в режиме cameraWall 
function showRulerWD_3D(wd)
{
	if(camera != cameraWall) return;
	
	var wall = wd.userData.door.wall;
	var boundPos = wd.userData.door.ruler.boundPos;
	var index = wd.userData.door.ruler.faceIndex;
	var rt = 0;
	
	var p = [];
	for ( var i = 0; i < arrSize.cube.length; i++ ) { p[i] = arrSize.cube[i].position; }
	
	//for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].visible = true; }
	
	if(wd.userData.door.topMenu)
	{
		for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].visible = true; }
	}	
	
	var w2 = [];
	if(index > 0.98) 
	{
		w2[0] = new THREE.Vector3(boundPos[0].x, p[0].y, boundPos[0].z); 
		w2[1] = new THREE.Vector3(boundPos[1].x, p[1].y, boundPos[1].z);		
	}
	else if(index < -0.98) 	
	{
		w2[0] = new THREE.Vector3(boundPos[0].x, p[0].y, boundPos[0].z); 
		w2[1] = new THREE.Vector3(boundPos[1].x, p[1].y, boundPos[1].z);
		rt = Math.PI;
	}
	
	w2[2] = new THREE.Vector3(p[2].x, arrWallFront.bounds.min.y.y, p[2].z);
	w2[3] = new THREE.Vector3(p[3].x, arrWallFront.bounds.max.y.y, p[3].z);

	
	var line = arrSize.format_2.line;
	var label = arrSize.format_2.label;	
	
	// линейки показывающие длину
	for ( var i = 0; i < p.length; i++ )
	{
		var d = w2[i].distanceTo(p[i]); 
		var v = line[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		line[i].geometry.verticesNeedUpdate = true;		
		
		line[i].position.copy( p[i] );
		line[i].visible = true;
				
		var dir = new THREE.Vector3().subVectors( w2[i], p[i] );  		
		var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir.clone().normalize()) );  // из кватерниона в rotation
		line[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);
		
		
		label[i].position.copy( p[i] );
		label[i].position.add( dir.divideScalar( 2 ) );	
		
		label[i].rotation.set( 0, wall.rotation.y + rt, 0 );    
		label[i].visible = true;			
		upLabelCameraWall({label : label[i], text : Math.round(d * 100) / 100, color : 'rgba(0,0,0,1)', border : 'border line'});
	}
	
	// боковые отсечки для линейки
	var arr = [];
	for ( var i = 0; i < p.length; i++ ) { arr[i] = { p1 : p[i], p2 : w2[i] }; }		
	showSizeCutoff(arr);	
}
 






// кликнули на контроллер
function clickToggleChangeWin( intersect, cdm )
{
	clickO.move = intersect.object; 
	var controll = intersect.object;	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;
	var pos2 = new THREE.Vector3();
	
	
	var m = controll.userData.controll_wd.id;
	
	if(camera == cameraTop)
	{
		planeMath.position.set( 0, intersect.point.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
		var v = wall.userData.wall.v;
		var z = v[0].z + (v[4].z - v[0].z) / 2;
	
		if(m == 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		else if(m == 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }				
	}
	else if(camera == cameraWall)
	{
		//clickO.obj = null;
		planeMath.position.copy( intersect.point );
		planeMath.rotation.set( 0, controll.rotation.y, 0 );
		
		var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position ).normalize();
		
		if(m == 0) { pos2 = new THREE.Vector3().addVectors( controll.position, dir ); }
		else if(m == 1) { pos2 = new THREE.Vector3().subVectors( controll.position, dir ); }	
		else if(m == 2) { pos2 = controll.position.clone(); pos2.y = -9999; }
		else if(m == 3) { pos2 = controll.position.clone(); pos2.y = 9999; }
	}

	
	var offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point ); 
	var dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();  
	var qt = quaternionDirection( dir );

	
	wd.userData.door.wall.controll = {  }; 
	wd.userData.door.wall.controll.obj = controll;
	wd.userData.door.wall.controll.pos = controll.position.clone();
	wd.userData.door.wall.controll.dir = dir;
	wd.userData.door.wall.controll.qt = qt;
	wd.userData.door.wall.controll.offset = offset;
	
	var ps = [];
	var arr = arrSize.cube;
	ps[ps.length] = wall.worldToLocal( arr[0].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[1].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[2].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[3].position.clone() );
	
	wd.userData.door.wall.controll.arrPos = ps;
	
	wd.updateMatrixWorld();	// окно/дверь
	wall.updateMatrixWorld();
	
	param_win.click = true;
}

 

 
// перемещаем контроллер
function moveToggleChangeWin( event, controll )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 	
	if ( intersects.length < 1 ) return; 
	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;

	
	if(param_win.click) 
	{ 
		param_win.click = false; 

		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };
		
		// меняем цвет у wd
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 

		// полностью восстанавливаем кирпичную стену
		var arrB = wall.userData.wall.brick.arr;
		for ( var i = 0; i < arrB.length; i++ )
		{
			arrB[i].geometry = wall.userData.wall.brick.geometry.clone();
		}

		cutSideBlockWall({wall:wall});
		
		// верзаем в кирпичах wd, кроме того wd которое мы перетаскиваем
		var arrO = wall.userData.wall.arrO;
		for ( var i = 0; i < arrO.length; i++ )
		{
			if(arrO[i] == wd) continue;
			
			cutMeshBlockBSP( arrO[i] );	
		}		
	}	
	
	var pos = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.offset, intersects[ 0 ].point );	
	var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos, wd.userData.door.wall.controll.pos ), wd.userData.door.wall.controll.qt );
	v1 = new THREE.Vector3().addScaledVector( wd.userData.door.wall.controll.dir, v1.z );  
	v1 = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.pos, v1 );	


	// ограничитель до ближайших окон/дверей/края стены
	if(1==2)
	{		
		var pos2 = wall.worldToLocal( v1.clone() );	

		function discreteShift(pos, pos2)
		{
			var res = Math.floor((pos2 - pos) * 10)/10;
			
			return pos2 - res;
		}		
 
		if(controll.userData.controll_wd.id == 0)
		{  
			pos2.x = discreteShift(pos2.x, wd.userData.door.wall.controll.arrPos[1].x);
			
			var x_min = wd.userData.door.bound.min.x;  
			if(pos2.x < x_min){ pos2.x = x_min; } 	
			else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 1)
		{
			pos2.x = discreteShift(pos2.x, wd.userData.door.wall.controll.arrPos[0].x);
			
			var x_max = wd.userData.door.bound.max.x;
			if(pos2.x > x_max){ pos2.x = x_max; }
			else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
		}
		else if(controll.userData.controll_wd.id == 2)
		{
			pos2.y = discreteShift(pos2.y, wd.userData.door.wall.controll.arrPos[3].y);
			
			var y_min = wd.userData.door.bound.min.y + 0.1;
			if(pos2.y < y_min){ pos2.y = y_min; }
			else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 3)
		{
			pos2.y = discreteShift(pos2.y, wd.userData.door.wall.controll.arrPos[2].y);
			
			var y_max = wd.userData.door.bound.max.y;
			if(pos2.y > y_max){ pos2.y = y_max; }
			else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
		}		
		
		v1 = wall.localToWorld( pos2 );			
	}
	
	var pos2 = new THREE.Vector3().subVectors( v1, controll.position );  
	controll.position.copy( v1 ); 	

	// обновляем форму окна/двери и с новыми размерами вырезаем отверстие в стене
	if(1==1)
	{
		var arr = arrSize.cube;
		
		var x = arr[0].position.distanceTo(arr[1].position);
		var y = arr[2].position.distanceTo(arr[3].position);
		
		var pos = pos2.clone().divideScalar( 2 ).add( wd.position.clone() );
		
		сhangeSizePosWD( wd, pos, x, y );
	}
	
	// устанавливаем второстепенные контроллеры, в правильное положение
	var arr = arrSize.cube;	
	if(controll.userData.controll_wd.id == 0 || controll.userData.controll_wd.id == 1)
	{ 
		arr[2].position.add( pos2.clone().divideScalar( 2 ) );
		arr[3].position.add( pos2.clone().divideScalar( 2 ) );
	}
	else if(controll.userData.controll_wd.id == 2 || controll.userData.controll_wd.id == 3)
	{ 
		arr[0].position.add( pos2.clone().divideScalar( 2 ) );
		arr[1].position.add( pos2.clone().divideScalar( 2 ) );
	}	
	
	 // изменяем знаечние ширину/высоту окна в input (при перемещении контроллера)
	showTableWD(wd);
	
	showRulerWD_2D(wd);
	showRulerWD_3D(wd);
}




function clickMouseUpToggleWD( controll )
{
	if(param_win.click) { param_win.click = false; return; }
	
	var wd = controll.userData.controll_wd.obj;
	
	objsBSP.wd = createCloneWD_BSP( wd );
	
	MeshBSP( wd, objsBSP );
	
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}

	cutMeshBlockBSP( wd );
	
	clickO.last_obj = wd;
}


