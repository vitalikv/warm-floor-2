


function clickPoint( intersect )
{
	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'free_dw') { return; }	// кликнули на точку, когда добавляем окно
	}	 
	
	var obj = intersect.object;	
	clickO.move = obj;
	

	offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.wallR = detectChangeArrWall([], clickO.move);

	// запоминаем последнее положение точки и дверей/окон
	if(1==1)
	{  
		obj.userData.point.last.pos = obj.position.clone(); 		
		
		for ( var i = 0; i < param_wall.wallR.length; i++ )
		{						
			for ( var i2 = 0; i2 < param_wall.wallR[i].userData.wall.arrO.length; i2++ )
			{
				var wd = param_wall.wallR[i].userData.wall.arrO[i2];
				 
				wd.userData.door.last.pos = wd.position.clone();
				wd.userData.door.last.rot = wd.rotation.clone(); 
			}
		}		 			
	}	
}



function getWallArrOUR()
{
	var arr = [];
	
	for ( var i = 0; i < clickO.move.w.length; i++ )
	{
		arr[i] = { id : clickO.move.w[i].userData.id, arrO : [] };
		
		for ( var i2 = 0; i2 < clickO.move.w[i].userData.wall.arrO.length; i2++ )
		{
			arr[i].arrO[i2] = { pos : '', rot : '' };
			arr[i].arrO[i2].pos = clickO.move.w[i].userData.wall.arrO[i2].position.clone();
			arr[i].arrO[i2].rot = clickO.move.w[i].userData.wall.arrO[i2].rotation.clone();			 
		}
	}

	return arr;
}





function movePoint( event, obj )
{
	if(obj.userData.point.type) 
	{ 
		if(obj.userData.point.type == 'continue_create_wall') {  } 
		else { dragToolPoint( event, obj ); return; } 
	}	
	
	if(param_win.click) 
	{
		clickMovePoint_BSP(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = rayIntersect( event, planeMath, 'one' ); 
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );				
		pos.y = obj.position.y; 
		
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		
		obj.position.copy( pos );				
		dragToolPoint( event, obj );	// направляющие
				
		 
		for ( var i = 0; i < obj.w.length; i++ )
		{			
			updateWall(obj.w[i]);	
		}		
	
		upLineYY(obj);			
		
		upLabelPlan_1(param_wall.wallR); 
	}
	
}


function limitMovePoint(point, point2, wall, side, pos2)
{
	var v = wall.userData.wall.v;
	
	var offX = 0; 
	
	if(side == 0)
	{
		var x1 = v[6].x - (v[0].x + offX);
		var x2 = v[10].x - (v[4].x + offX);	
		var xmin = (x1 < x2) ? x1 : x2;		
	}
	if(side == 1)
	{
		var n = v.length;
		var x1 = (v[n - 6].x - offX) - v[n - 12].x;
		var x2 = (v[n - 2].x - offX) - v[n - 8].x;	
		var xmin = (x1 < x2) ? x1 : x2;			
	}

	
	
	if(xmin <= 0.1)
	{		
		var dir = new THREE.Vector3().subVectors( point.position, point2.position ).normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, Math.abs(xmin - 0.1) + 0.1 );		
		point.position.add( v1 );
	}
	
	return point.position;
}



// перетаскиваем точку (определяем с чем пересекается)
function dragToolPoint( event, obj )
{	
	var arrDp = [];
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; }  
	arrDp[arrDp.length] = planeMath;
	
	var intersects = rayIntersect( event, arrDp, 'arr' );
	
	var plane = null;
	var point = null;
	var wall = null;	
	var dw = null;
	var pos = new THREE.Vector3();	
	
	for ( var i = 0; i < intersects.length; i++ ) 
	{
		var object = intersects[ i ].object;
		
		if(object.userData.tag == 'planeMath')
		{ 
			pos = intersects[i].point; 
			obj.position.set( pos.x, obj.position.y, pos.z ); 
			plane = object; 
		} 			
		else if(object.userData.tag == 'wall')
		{ 			
			var flag = true;
			for ( var i2 = 0; i2 < object.userData.wall.p.length; i2++ ) 
			{				
				if(object.userData.wall.p[i2].userData.id == obj.userData.id) { flag = false; break; }									
			}
			if(flag) { wall = object; }			
		}
		else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ dw = object; } 
	}
	
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == obj) { continue; }		

		var p1 = new THREE.Vector3( obj.position.x, 0, obj.position.z ); 
		var p2 = new THREE.Vector3( obj_point[i].position.x, 0, obj_point[i].position.z ); 
		
		if(p1.distanceTo( p2 ) < 0.2 / camera.zoom)
		{ 
			obj.position.set( obj_point[i].position.x, obj.position.y, obj_point[i].position.z );
			obj.userData.point.cross = point = obj_point[i];
			break;
		}	
	}	
 
	  
	if(point) 
	{
		
	} 
	else if(dw)
	{
		obj.userData.point.cross = null; 
	}
	else if(!wall) 
	{ 
		obj.userData.point.cross = plane;
		
		showLineAxis( obj );		
	}
	else
	{ 
		wall.updateMatrixWorld();			
		var pos = wall.worldToLocal( pos.clone() );	
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, 0, 0 ) ); 		
		obj.position.set( pos.x, obj.position.y, pos.z ); 
		obj.userData.point.cross = wall; 
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false; 
	}
}

  



// направляющие X/Z к точекам
function showLineAxis( point )
{ 
	var pX = [];
	var pZ = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == point) { continue; }		

		var p1 = spPoint(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(10,0,0)), point.position);	
		var p2 = spPoint(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(0,0,10)), point.position);
		
		var x = Math.abs( obj_point[i].position.x - p1.x );
		var z = Math.abs( obj_point[i].position.z - p2.z );
		
		if(x < 0.06 / camera.zoom){ pX[pX.length] = i; }
		if(z < 0.06 / camera.zoom){ pZ[pZ.length] = i; }			
	}
	
	
	if(pX.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pX.length; i++ ){ v[i] = obj_point[pX[i]].position; }
		var n1 = pX[getMinDistanceVertex(v, point.position)];		 
	} 
	
	if(pZ.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pZ.length; i++ ){ v[i] = obj_point[pZ[i]].position; }
		var n2 = pZ[getMinDistanceVertex(v, point.position)]; 		
	}	
	
	
	if(pX.length > 0 && pZ.length > 0) 
	{ 
		point.position.x = obj_point[n1].position.x; 
		point.position.z = obj_point[n2].position.z; 		
		dopFunct1(point, obj_point[n1].position, infProject.tools.axis[0], 'xz'); 
		dopFunct1(point, obj_point[n2].position, infProject.tools.axis[1], 'xz'); 
	}
	else
	{
		(pX.length > 0) ? dopFunct1(point, obj_point[n1].position, infProject.tools.axis[0], 'x') : infProject.tools.axis[0].visible = false;
		(pZ.length > 0) ? dopFunct1(point, obj_point[n2].position, infProject.tools.axis[1], 'z') : infProject.tools.axis[1].visible = false;
	}
}

 


// устанвливаем и показываем красные линии
function dopFunct1(point, pos2, lineAxis, axis)
{
	//point.position.y = 0;
	if(axis == 'x') { point.position.x = pos2.x; }
	if(axis == 'z') { point.position.z = pos2.z; } 
	
	var pos2 = new THREE.Vector3(pos2.x, point.position.y, pos2.z);
	var d = point.position.distanceTo( pos2 );	
	
	var v = lineAxis.geometry.vertices;		
	v[3].x = v[2].x = v[5].x = v[4].x = d;		
	lineAxis.geometry.verticesNeedUpdate = true;

	var dir = new THREE.Vector3().subVectors( point.position, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	lineAxis.rotation.set(0, angleDeg + Math.PI / 2, 0);		
	lineAxis.position.copy( point.position );
	lineAxis.visible = true;	
}


 


// определяем ближайшие стены, которые будут менять длину 
function detectChangeArrWall(arr, point) 
{	
	for ( var i = 0; i < point.p.length; i++ )
	{				
		for ( var j = 0; j < point.p[i].w.length; j++ )
		{
			var flag = false;
			for ( var i2 = 0; i2 < arr.length; i2++ )
			{
				if(point.p[i].w[j] == arr[i2]){ flag = true; break; }
			}
			
			if(flag){ continue; }				

			arr[arr.length] = point.p[i].w[j];
		}		
	}
	
	return arr;	
}


// определяем ближайшие стены, которые будут менять длину (входное значение стена) 
function detectChangeArrWall_2(wall) 
{	
	var arr = [];

	for ( var j = 0; j < wall.userData.wall.p.length; j++ )
	{
		for ( var i = 0; i < wall.userData.wall.p[j].p.length; i++ )
		{ 
			for ( var i2 = 0; i2 < wall.userData.wall.p[j].p[i].w.length; i2++ ) 
			{ 	
				var flag = true;
				for ( var i3 = 0; i3 < arr.length; i3++ )
				{
					if(arr[i3] == wall.userData.wall.p[j].p[i].w[i2]) { flag = false; }
				}

				if(flag) { arr[arr.length] = wall.userData.wall.p[j].p[i].w[i2]; }
			} 
		}		
	}
	
	return arr;	
}



// определяем соседние стены
function detectChangeArrWall_3(wall) 
{	
	var arr = [];

	for ( var i = 0; i < wall.userData.wall.p.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[i].w.length; i2++ )
		{ 
			var flag = true;
			for ( var i3 = 0; i3 < arr.length; i3++ )
			{
				if(arr[i3] == wall.userData.wall.p[i].w[i2]) { flag = false; }
			}

			if(flag) { arr[arr.length] = wall.userData.wall.p[i].w[i2]; } 
		}		
	}
	
	return arr;	
}



// пересечение углов (часть 1)
function upLineYY(point)
{		
	// пересечение цетрального угла (который перетаскиваем)
	upLineYY_2(point, point.p, point.w, point.start);	

	
	// пересечение боковых углов (соседи цетральной точки)
	var arrP = point.p;
	for ( var j = 0; j < arrP.length; j++ )
	{
		//if(!arrP[j]) { continue; }		
		if(arrP[j].p.length > 1) { upLineYY_2(arrP[j], arrP[j].p, arrP[j].w, arrP[j].start); }		
	}
	
}


function upLineYY_2(point, arrP, arrW, arrS)
{
	var arrD = [];
	
	var n = 0;
	for ( var i = 0; i < arrP.length; i++ )
	{
		if(point.position.distanceTo(arrP[i].position) < 0.1)
		{ 
			arrW[i].geometry.vertices[0].x = 0;
			arrW[i].geometry.vertices[1].x = 0;	
			arrW[i].geometry.vertices[2].x = 0;	
			arrW[i].geometry.vertices[3].x = 0;	
			arrW[i].geometry.vertices[4].x = 0;	
			arrW[i].geometry.vertices[5].x = 0;			
			arrW[i].geometry.vertices[6].x = 0;
			arrW[i].geometry.vertices[7].x = 0;	
			arrW[i].geometry.vertices[8].x = 0;	
			arrW[i].geometry.vertices[9].x = 0;	
			arrW[i].geometry.vertices[10].x = 0;	
			arrW[i].geometry.vertices[11].x = 0;	
			continue; 
		}
		
		arrD[n] = [];
		arrD[n][1] = i;
		arrD[n][0] = new THREE.Vector3().subVectors( point.position, arrP[i].position ).normalize();
		arrD[n][0] = Math.atan2(arrD[n][0].x, arrD[n][0].z);
		
		if(arrD[n][0] < 0){ arrD[n][0] += Math.PI * 2; }		
		n++;
	}
	
	arrD.sort(function (a, b) { return a[0] - b[0]; });
	
	for ( var i = 0; i < arrD.length - 1; i++ )
	{ 
		upLineUU(arrW[arrD[i][1]], arrW[arrD[i + 1][1]], arrS[arrD[i][1]], arrS[arrD[i + 1][1]], point.position); 
	}	
	var i2 = arrD.length - 1; 
	if(arrD[i2]) 
	{
		upLineUU(arrW[arrD[i2][1]], arrW[arrD[0][1]], arrS[arrD[i2][1]], arrS[arrD[0][1]], point.position);		
	}
}


// пересечение углов (часть 2)
function upLineUU(line1, line2, s1, s2, pointC)
{
	var v1 = line1.geometry.vertices;
	var v2 = line2.geometry.vertices;
	
	if(s1 == 1){ var n1 = 0; var n2 = 6; var n3 = 7; var n4 = 8; var n5 = 9; }
	else { var n1 = 10; var n2 = 4; var n3 = 5; var n4 = 2; var n5 = 3; }
	
	if(s2 == 1){ var f1 = 4; var f2 = 10; var f3 = 11; var f4 = 8; var f5 = 9; }
	else { var f1 = 6; var f2 = 0; var f3 = 1; var f4 = 2; var f5 = 3; }


	//console.log(line1.tag_2 + " " + s1 + " | " + line2.tag_2 + " " + s2);
	
	line1.updateMatrixWorld();
	var m1a = line1.localToWorld( v1[n1].clone() );
	var m1b = line1.localToWorld( v1[n2].clone() );

	line2.updateMatrixWorld();
	var m2a = line2.localToWorld( v2[f1].clone() );
	var m2b = line2.localToWorld( v2[f2].clone() );

	
	var crossP = crossPointTwoLine_2(m1a, m1b, m2a, m2b);

	var cross = false;
	
	if(!crossP[1]) { if(intersectWall_2(m1a, m1b, m2a, m2b)) { cross = true; } }	// стенки стен пересекаются	 
	
	if(cross)
	{		
		var per1 = line1.worldToLocal( crossP[0].clone() ).x;
		var per2 = line2.worldToLocal( crossP[0].clone() ).x;
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;
	}
	else
	{
		var vpc = line1.worldToLocal( pointC.clone() );
		vpc.z = m1a.z;
		
		crossP[0] = vpc;
		crossP[0] = line1.localToWorld( crossP[0].clone() );
		 
		var rs = line1.userData.wall.width - line2.userData.wall.width;
		
		if(rs < -0.1) 
		{
			var per1 = line1.worldToLocal( crossPointTwoLine_2(m1a, m1b, pointC, m2b)[0] ).x;
			var per2 = line2.worldToLocal( pointC.clone() ).x;
		}
		else if(rs > 0.1)
		{
			var per1 = line1.worldToLocal( pointC.clone() ).x;
			var per2 = line2.worldToLocal( crossPointTwoLine_2(pointC, m1b, m2a, m2b)[0] ).x;
		}
		else 
		{ 
			var per1 = line1.worldToLocal( crossP[0].clone() ).x; 
			var per2 = line2.worldToLocal( crossP[0].clone() ).x;			
		}		
		
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;	
	}


	v1[n2].x = v1[n3].x = per1;
	v2[f2].x = v2[f3].x = per2;
	
	v1[n4].x = v1[n5].x = per3;
	v2[f4].x = v2[f5].x = per4;	

	line1.geometry.verticesNeedUpdate = true;	
	line2.geometry.verticesNeedUpdate = true;
	
	line1.geometry.computeBoundingBox(); 	
	line1.geometry.computeBoundingSphere();	
	
	line2.geometry.computeBoundingBox(); 	
	line2.geometry.computeBoundingSphere();	
}






 
 // проверка пересечения отрезков (углов стен), если один из отрезков выходит за длину другого отрезка, то пересечения не будет 
function intersectWall_2(p0, p1, p2, p3)
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
	var p1 = new THREE.Vector3().addVectors( p1, v1 );		
		
	var dir = new THREE.Vector3().subVectors( p3, p2 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
	var p3 = new THREE.Vector3().addVectors( p3, v1 );	
	
	if( !CrossLine(p0, p1, p2, p3) ) { /*console.log(false);*/ return false; }		
	
	return true;
}



 // проверка пересечения 2-х отрезков
function intersectWall_3(p0, p1, p2, p3) 
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.01 );
	var p0 = new THREE.Vector3().addVectors( p0, v1 );		
	var p1 = new THREE.Vector3().subVectors( p1, v1 );
	
	if( !CrossLine(p0, p1, p2, p3) ) { /*console.log(false);*/ return false; }		
	
	return true;
}




// undo/redo при перемещении точки 
function undoRedoChangeMovePoint( point, walls )
{
	point.position.copy( point.userData.point.last.pos );
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		updateWall(point.w[i], {point:point});		
	}		
	
	upLineYY(point);  
	upLabelPlan_1(walls);
	updateShapeFloor(point.zone); 
	
	clickPointUP_BSP(walls);
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;		
}


function clickPointMouseUp(obj)
{  
	if(obj.w.length > 0) createWallZone(obj.w[0]);
	
	obj.userData.point.last.pos = obj.position.clone();
}




