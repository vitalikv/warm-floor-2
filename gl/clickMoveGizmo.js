

 

// создаем Gizmo360
function createGizmo360()
{
	var count = 68; 
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle)*0.5;
		circle[i].z = Math.cos(angle)*0.5;
		//circle[i].y = 0;
	}	

	
	var pipeSpline = new THREE.CatmullRomCurve3(circle);
	pipeSpline.curveType = 'catmullrom';
	pipeSpline.tension = 0;
	
	var geometry_1 = new THREE.TubeBufferGeometry( pipeSpline, circle.length, 0.03, 12, true );	
	var geometry_2 = new THREE.TubeBufferGeometry( pipeSpline, circle.length, 0.01, 12, true );
	
	
	var gizmo = new THREE.Object3D();
	gizmo.userData.gizmo = {};
	gizmo.userData.gizmo.obj = null;
	gizmo.userData.gizmo.active = { axis: '', startPos: new THREE.Vector3(), rotY: 0 };

	
	var param = [];
	param[0] = {axis: 'x', rot: new THREE.Vector3(0, 0, 0), color: 'rgb(17, 255, 0)'};
	param[1] = {axis: 'y', rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(247, 72, 72)'};
	param[2] = {axis: 'z', rot: new THREE.Vector3(Math.PI/2, 0, 0), color: 'rgb(72, 116, 247)'};	
	
	for ( var i = 0; i < param.length; i++ )
	{
		var material = new THREE.MeshBasicMaterial({ color: param[i].color, depthTest: false, transparent: true, opacity: 1.0 });
		material.visible = false;
		//var material = new THREE.MeshBasicMaterial({ color: param[i].color });
		var obj = new THREE.Mesh( geometry_1, material );
		obj.userData.tag = 'gizmo'; 
		obj.userData.axis = param[i].axis;		
		obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );	
		
	
		var obj2 = new THREE.Mesh( geometry_2, new THREE.MeshLambertMaterial({ color: param[i].color, depthTest: false, clippingPlanes : [ new THREE.Plane() ], lightMap : lightMap_1 }) );
		obj2.renderOrder = 3;
		//obj2.visible = false;
		obj2.material.clippingPlanes[0].copy(new THREE.Plane());
		obj.add( obj2 );
		
		
		gizmo.add( obj );
	}
	
	scene.add( gizmo );

	
	gizmo.visible = false;
	
	// Sphere
	var geometry = new THREE.SphereGeometry( 0.98*0.5, 32, 32 );
	var material = new THREE.MeshLambertMaterial( {color: 0x000000, depthTest: false, transparent: true, opacity: 0.1} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.renderOrder = 3;
	gizmo.add( sphere );
	
	return gizmo;
}





// прячем текстуру если она находится за плоскостью 
function clippingGizmo360( objPop )
{
	var plane = new THREE.Plane();	
	
	if(camera == cameraTop)
	{
		plane = new THREE.Plane(new THREE.Vector3(0,1,0), 100);
		infProject.tools.gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);		
	}
	else
	{
		var group = new THREE.Group();
		group.position.copy(objPop.position);
		group.lookAt(camera.position);
		group.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);
		group.updateMatrixWorld();
		
		
		//var dir = new THREE.Vector3().subVectors( camera.position, objPop.position ).normalize();
		//var qt = quaternionDirection(dir.clone());
		//var mx = new THREE.Matrix4().compose(objPop.position, qt, new THREE.Vector3(1,1,1));
		//plane.applyMatrix4(mx);	
		plane.applyMatrix4(group.matrixWorld);	
		
		infProject.tools.gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);
		infProject.tools.gizmo.children[1].children[0].material.clippingPlanes[0].copy(plane);
		infProject.tools.gizmo.children[2].children[0].material.clippingPlanes[0].copy(plane);	
		
		//showHelperNormal(objPop)		
	}

}





// кликнули на gizmo
function clickGizmo( intersect )
{	
	
	
	var gizmo = infProject.tools.gizmo;
	
	clickO.move = intersect.object; 	// gizmo

	var obj = gizmo.userData.gizmo.obj;			// objPop
	var axis = intersect.object.userData.axis;
	gizmo.userData.gizmo.active.axis = axis;
	
	obj.updateMatrixWorld();
	gizmo.userData.gizmo.active.startPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	
	if(axis == 'y')
	{
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = -Math.PI/2;
	}	
	else if(axis == 'z')
	{	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI;
	}
	else if(axis == 'x')
	{
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	planeMath.position.copy( gizmo.position );		
	
	if(camera == cameraTop)
	{
		planeMath.rotation.set(Math.PI/2, 0, 0);
	}
	else
	{
		var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );								// создаем Quaternion повернутый на выбранную ось	
		var q2 = new THREE.Quaternion().setFromEuler( obj.rotation ).multiply( quaternion );// конвертируем rotation в Quaternion и умножаем на предведущий Quaternion			
		planeMath.quaternion.copy( q2 );										
	}

	
	planeMath.updateMatrixWorld();
	var dir = planeMath.worldToLocal( intersect.point.clone() );	
	gizmo.userData.gizmo.active.rotY = Math.atan2(dir.x, dir.y);	
}




function moveGizmo( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' );	 	 
	if(intersects.length == 0) return;
	
	
	var gizmo = infProject.tools.gizmo;
	
	var obj = gizmo.userData.gizmo.obj;  
	var axis = gizmo.userData.gizmo.active.axis;
	
	if(axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
	else if(axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
	else if(axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
	
	
	
	var dir = planeMath.worldToLocal( intersects[ 0 ].point.clone() );	
	var rotY = Math.atan2(dir.x, dir.y);
	
	
	
	if(camera == cameraTop) 
	{ 
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - gizmo.userData.gizmo.active.rotY); 
	}
	else 
	{ 
		var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY - gizmo.userData.gizmo.active.rotY );
		obj.quaternion.multiply( quaternion ); 
	}		
	

	obj.updateMatrixWorld();
	var newPosCenter = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );		
	obj.position.add( new THREE.Vector3().subVectors( gizmo.userData.gizmo.active.startPos, newPosCenter ) );		
	
	gizmo.userData.gizmo.active.rotY = rotY; 
	
	if(camera != cameraTop) { gizmo.rotation.copy( obj.rotation ); }
}




// обновляем в меню rotate
function upMenuRotateObjPop(obj)
{	
	//var rot = new THREE.Euler().setFromQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()));
	//console.log(rot);
	
	UI( 'object_rotate_X' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.x) ) );
	UI( 'object_rotate_Y' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.y) ) );
	UI( 'object_rotate_Z' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.z) ) );	
}


