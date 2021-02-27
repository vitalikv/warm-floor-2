



// кликнули на стену (в таблице показываем длину стены)
function showLengthWallUI( wall ) 
{
	$('[nameId="wall_menu_1"]').show();
		
	var v = wall.userData.wall.v; 		
	var x = Math.abs( v[6].x - v[0].x );		
	var y = Math.abs( v[1].y - v[0].y );	
	var z = Math.abs( v[4].z - v[0].z );
	
	//$('[nameId="size-wall-length"]').val(Math.round(x * 100)/100);
	//$('[nameId="size-wall-height"]').val(Math.round(y * 100)/100);
	//$('[nameId="size-wall-width"]').val(Math.round(z * 100)/100);

	$('[nameId="size_wall_width_1"]').val(wall.userData.wall.width);
	
	//toggleButtonMenuWidthWall(wall);
}




// после изменения на панели длины стены, нажали enter и миняем длину стены
function inputChangeWall_1(cdm)
{
	var wall = infProject.scene.array.wall[0];
	//if(!clickO.obj){ return; } 
	//if(clickO.obj.userData.tag != 'wall'){ return; } 	
	//var wall = clickO.obj; 
	 
	cdm.wall = wall;
	cdm.type = 'wallRedBlue';
	cdm.side = 'wall_length_1';
	
	var x = $('[nameId="size-wall-length"]').val();
	var y = $('[nameId="size-wall-height"]').val();
	var z = $('[nameId="size-wall-width"]').val();
	
	// если знаначения ввели с ошибкой, то исправляем
	if(1==1)
	{
		var v = wall.userData.wall.v;
		
		if(x == undefined) { x = '' + (v[6].x - v[0].x); }
		if(y == undefined) { y = '' + (v[1].y - v[0].y); }		
		if(z == undefined) { z = '' + (Math.abs(v[4].z) + Math.abs(v[0].z)); }		
		
		x = x.replace(",", ".");
		y = y.replace(",", ".");
		z = z.replace(",", ".");
		
		var x2 = v[6].x - v[0].x;
		var y2 = v[1].y - v[0].y;		
		var z2 = Math.abs(v[4].z) + Math.abs(v[0].z);
		
		x = (isNumeric(x)) ? x : x2;
		y = (isNumeric(y)) ? y : y2;
		z = (isNumeric(z)) ? z : z2;  
	}
	
	
	// ограничение размеров
	if(1==1)
	{
		if(x > 30) { x = 30; }
		else if(x < 0.5) { x = 0.5; }

		if(y > 10) { y = 10; }
		else if(y < 0.1) { y = 0.1; }	
		
		if(z > 10) { z = 10; }
		else if(z < 0.02) { z = 0.02; }		
	}	
	
	cdm.length = x;
	cdm.height = y;
	cdm.width = z;	
	
	
	inputLengthWall_1(cdm);	// меняем только длину стены 
	
	showRuleCameraWall();	// обновляем размеры стены
	
	resetSideBlockWall({wall:wall});	// обновляем кирпичи
	cutSideBlockWall({wall:wall});		// обрезаем кирпичи по бокам стены	
	for(var i = 0; i < wall.userData.wall.arrO.length; i++) { cutMeshBlockBSP( wall.userData.wall.arrO[i] ); }	// вырезаем wd в кирпичах 
	
	renderCamera();
}


// миняем через input длину/высоту/ширину стены 
function inputLengthWall_1(cdm)
{
	var wall = cdm.wall;
	var value = cdm.length;
	
	var wallR = detectChangeArrWall_2(wall);
	clickMovePoint_BSP(wallR);

	var p1 = wall.userData.wall.p[1];
	var p0 = wall.userData.wall.p[0];

	var walls = [...new Set([...p0.w, ...p1.w])];	// получаем основную и соседние стены
	
	
	// высота стены
	if(cdm.height)
	{
		var h2 = Number(cdm.height);
		
		var v = wall.geometry.vertices;	
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;

		wall.userData.wall.height_1 = Math.round(h2 * 100) / 100;
	}
 
	// ширина стены
	if(cdm.width)
	{
		var z = cdm.width/2;
		
		var v = wall.geometry.vertices;	
		v[0].z = v[1].z = v[6].z = v[7].z = z;
		v[4].z = v[5].z = v[10].z = v[11].z = -z;	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;
		
		
		// меняем ширину wd
		for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
		{ 
			var wd = wall.userData.wall.arrO[i];	
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
			var v2 = wall.geometry.vertices;
			
			for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
			for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

			wd.geometry.verticesNeedUpdate = true; 
			wd.geometry.elementsNeedUpdate = true;
			wd.geometry.computeBoundingSphere();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeFaceNormals();		
		}

		wall.userData.wall.width = Math.round(cdm.width * 100) / 100;;
	}
 
	
	var ns = 0;
	var flag = true;
	while ( flag )
	{	 
		var v = wall.userData.wall.v;

		var d = 0;
		
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x );  } 
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x );  }
		//d = Math.round(d * 1000);
		
		var sub = (value - d) / 1;
		if(cdm.type == 'wallRedBlue') { sub /= 2; }	
		
		var dir = new THREE.Vector3().subVectors(p1.position, p0.position).normalize();
		var dir = new THREE.Vector3().addScaledVector( dir, sub );	

		if(cdm.type == 'wallBlueDot')
		{ 
			var offset = new THREE.Vector3().addVectors( p1.position, dir ); 
			p1.position.copy( offset ); 
		}
		else if(cdm.type == 'wallRedDot')
		{ 
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset ); 
			wall.position.copy( offset );
		}
		else if(cdm.type == 'wallRedBlue')
		{ 			
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset );
			wall.position.copy( offset );
			
			p1.position.copy( new THREE.Vector3().addVectors( p1.position, dir ) );				
		}

		
		for ( var i = 0; i < walls.length; i++ )
		{
			updateWall(walls[i]);
		}			 		 
		
		upLineYY(p0);
		upLineYY(p1);
		upLabelPlan_1( [wall] );
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); }
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); }
		

		if(value - d == 0){ flag = false; }
		
		if(ns > 5){ flag = false; }
		ns++;
	} 	
	 
	upLabelPlan_1( wallR );		
	updateShapeFloor( compileArrPickZone(wall) );  				 			
	
	showLengthWallUI(wall);
	
	
	
	if(wall.userData.wall.plaster.o)
	{	
		var wall_2 = wall.userData.wall.plaster.o;
		
		var index = 1;
		
		wall.updateMatrixWorld();
		
		var v = wall.userData.wall.v;		
		
		if(index == 1) { var x = v[v.length - 6].x - v[0].x; }
		else if(index == 2) { var x = v[v.length - 2].x - v[4].x; }			
		
		var geometry = createGeometryCube(1, wall.userData.wall.height_1, 1, {material:true});	// обновляем стену до простой стены
		var v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = 0;
		v[2].x = v[3].x = v[4].x = v[5].x = x;
		v[0].z = v[1].z = v[2].z = v[3].z = wall_2.userData.wall_2.width;	// index 1
		v[4].z = v[5].z = v[6].z = v[7].z = 0;				
		
		wall_2.geometry = geometry;
		
		var num = (index == 1) ? 0 : 4;
		var pos = wall.localToWorld( wall.userData.wall.v[ num ].clone() );		
		wall_2.position.copy(pos);
		wall_2.rotation.copy(wall.rotation);		
		
		wall_2.userData.wall_2.height_1 = wall.userData.wall.height_1;
		wall_2.userData.wall_2.width = wall.userData.wall.width;
		
		upUvs_1( wall_2 );		
	}

	clickPointUP_BSP(wallR);
}



// изменяем ширину у всех стену
function changeWidthWall( value )
{
	if(!isNumeric(value)) return;
	value = Number(value);
	value /= 100;

	if(value < 0.005) { value = 0.005; }
	if(value > 1) { value = 1; }	
	
	
	//clickMovePoint_BSP( obj_line );
	value /= 2;
	
	for(var i = 0; i < obj_line.length; i++)
	{
		var wall = obj_line[i];
		console.log(wall.userData.id); 
		var v = wall.geometry.vertices;
						
		var z = [value, -value];

		v[0].z = v[1].z = v[6].z = v[7].z = z[0];
		v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;
		
		wall.geometry.computeBoundingSphere();
		wall.geometry.computeBoundingBox();
		wall.geometry.computeFaceNormals();	
	}
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY(obj_point[i]); }	
	upLabelPlan_1(obj_line);
	calculationAreaFundament_2();
	//clickPointUP_BSP(obj_line);
	
	renderCamera();
}	



// изменение длины стены
function updateWall(wall, cdm) 
{
	//wall.updateMatrixWorld(); перенес на момент клика
	var v = wall.geometry.vertices;
	var p = wall.userData.wall.p;
	
	
	var f1 = false;	// точку p0 не двигали
	var f2 = false;	// точку p1 не двигали
	
	f1 = !comparePos(p[0].userData.point.last.pos, p[0].position); 	// true - точку p0 двигали
	f2 = !comparePos(p[1].userData.point.last.pos, p[1].position); 	// true - точку p1 двигали	
	
	// перемещаются сразу 2 точки
	if(f1 && f2)
	{
		var offset_1 = new THREE.Vector3().subVectors(p[0].position, p[0].userData.point.last.pos);
		var offset_2 = new THREE.Vector3().subVectors(p[1].position, p[1].userData.point.last.pos);
		
		var equal = comparePos(offset_1, offset_2);
		
		// стену просто переместили, без изменении длины
		if(equal)
		{
			var offset = new THREE.Vector3().subVectors(p[0].position, wall.position);
			
			wall.position.copy(p[0].position);
						
			for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
			{
				wall.userData.wall.arrO[i].position.add(offset);
			}
			
			return;
		}
	}	
	
	
	var dist = p[0].position.distanceTo(p[1].position);
	
	v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = 0;
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = dist;
 
	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	wall.geometry.computeBoundingBox();	
	wall.geometry.computeBoundingSphere();	
	wall.geometry.computeFaceNormals();	

	var dir = new THREE.Vector3().subVectors(p[0].position, p[1].position).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);

	wall.position.copy( p[0].position );


	// ------- 
	// устанавливаем wd	
	if(cdm)
	{
		if(cdm.point)	// точка которая двигалась
		{
			if(cdm.point == p[0]) { f1 = true; }
			if(cdm.point == p[1]) { f2 = true; }
		}
	}
	
	
	if(f2){ var dir = new THREE.Vector3().subVectors( p[0].position, p[1].position ).normalize(); }
	else { var dir = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize(); }
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var wd = wall.userData.wall.arrO[i];	

		if(f2)
		{
			var startPos = new THREE.Vector3(p[0].position.x, 0, p[0].position.z);
			var p1 = p[0].position;			
		}
		else
		{
			var startPos = new THREE.Vector3(p[1].position.x, 0, p[1].position.z);
			var p1 = p[1].position;
		}
		
		var dist = startPos.distanceTo(new THREE.Vector3(wd.position.x, 0, wd.position.z));
		
		
		var pos = new THREE.Vector3().addScaledVector( dir, -dist );
		pos = new THREE.Vector3().addVectors( p1, pos );
		
		wd.position.x = pos.x;
		wd.position.z = pos.z;
		wd.rotation.copy( wall.rotation );
	}			
}





// изменение ширины выбранной стены
function inputWidthOneWall(cdm) 
{
	var wall = cdm.wall;
	//var unit = cdm.width.unit;
	var width = cdm.width.value;
	var offset = cdm.offset;
	console.log(width);
	if(!wall){ return; } 
	if(wall.userData.tag != 'wall'){ return; } 
	
	var width = checkNumberInput({ value: width, unit: 1, limit: {min: 0.01, max: 1} });
	
	if(!width) 
	{
		$('[nameid="size_wall_width_1"]').val(wall.userData.wall.width);
		
		return;
	}		

	var wallR = detectChangeArrWall_2(wall);
	
	clickMovePoint_BSP(wallR);
			
	var v = wall.geometry.vertices;
	
	var z = [0,0];
	
	if(offset == 'wallRedBlueArrow')
	{ 	
		width = (width < 0.01) ? 0.01 : width;
		width /= 2;		
		z = [width, -width];		
		var value = Math.round(width * 2 * 1000);
	}
	else if(offset == 'wallBlueArrow')
	{ 
		width = (Math.abs(Math.abs(v[4].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[4].z) : width;   		
		z = [width, v[4].z];
		var value = width * 1000;
	}
	else if(offset == 'wallRedArrow')
	{		 
		width = (Math.abs(Math.abs(v[0].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[0].z) : width;    		
		z = [v[0].z, -width];
		var value = width * 1000;
	}

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = (v[0].z + v[4].z)/2;	 

	
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	upLineYY_2(p0, p0.p, p0.w, p0.start);	
    upLineYY_2(p1, p1.p, p1.w, p1.start);	
	
	// меняем ширину wd
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		var v2 = wall.geometry.vertices;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals();		
	}	
	
	upLabelPlan_1( wallR );	 				
	getYardageSpace( compileArrPickZone(wall) );
	
	clickPointUP_BSP(wallR);
	
	$('[nameId="size_wall_width_1"]').val(wall.userData.wall.width);
	
	renderCamera();
}






// изменение высоты всех стен при переключении камеры cameraTop/camera3D 
function changeAllHeightWall_1(cdm)
{  
	if(infProject.scene.array.wall.length == 0) return;
	
	var wall = infProject.scene.array.wall[0];
	
	var height = cdm.height;
	
	var height = checkNumberInput({ value: height, unit: 1, limit: {min: 0.1, max: 5} });
	
	if(!height) 
	{
		return;
	}		
	
	clickMovePoint_BSP( infProject.scene.array.wall );
	
	for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
	{
		var v = infProject.scene.array.wall[i].geometry.vertices;
		
		v[1].y = height;
		v[3].y = height;
		v[5].y = height;
		v[7].y = height;
		v[9].y = height;
		v[11].y = height;
		infProject.scene.array.wall[i].geometry.verticesNeedUpdate = true;
		infProject.scene.array.wall[i].geometry.elementsNeedUpdate = true;
		
		infProject.scene.array.wall[i].userData.wall.height_1 = Math.round(height * 100) / 100;
	}
	
	upLabelPlan_1( infProject.scene.array.wall );
	clickPointUP_BSP( infProject.scene.array.wall );
	
	renderCamera();
}
	
	




