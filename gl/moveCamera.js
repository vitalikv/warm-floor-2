
var type_browser = detectBrowser();
var newCameraPosition = null;


function updateKeyDown() 
{
	//if(docReady) if(infProject.activeInput) return;
	
	var flag = false;
	
	var keys = clickO.keys;  
	if(keys.length == 0) return;
	
	if ( camera == cameraTop )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.z -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.z += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == camera3D ) 
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( -x, 0, -z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 88 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 67 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			centerCam.add( dir );
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == cameraWall )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.y += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.y -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}

	if(flag) { renderCamera(); }
}

var radious = 10, theta = 90, onMouseDownTheta = 0, phi = 75, onMouseDownPhi = 75;
var centerCam = new THREE.Vector3( 0, 0, 0 );


function cameraMove3D( event )
{
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			newCameraPosition = null;
			radious = centerCam.distanceTo( camera.position );
			theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
			phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
			phi = Math.min( 180, Math.max( -80, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( centerCam );  
			camera.lookAt( centerCam );
		}
		if ( isMouseDown3 )    
		{
			newCameraPosition = null;
			
			var intersects = rayIntersect( event, planeMath, 'one' );
			var offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera.position.add( offset );
			centerCam.add( offset );
		}
	}
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( isMouseDown2 )
		{
			newCameraPosition = null;
			var y = ( ( event.clientX - onMouseDownPosition.x ) * 0.006 );
			var x = ( ( event.clientY - onMouseDownPosition.y ) * 0.006 );

			camera.rotation.x -= x;
			camera.rotation.y -= y;
			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;

			var dir = camera.getWorldDirection();			
			//dir.y = 0;
			dir.normalize();
			dir.x *= camera3D.userData.camera.dist;
			dir.z *= camera3D.userData.camera.dist;
			dir.add( camera.position );
			dir.y = 0;
			
			centerCam.copy( dir ); 		
		}
	} 		
	
}



// кликаем левой кнопокой мыши (собираем инфу для перемещения камеры в 2D режиме)
function clickSetCamera2D( event, click )
{
	if ( camera == cameraTop || camera == cameraWall) { }
	else { return; }

	isMouseDown1 = true;
	isMouseRight1 = true;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
	

	if(camera == cameraTop) 
	{
		planeMath.position.set(camera.position.x,0,camera.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		var intersects = rayIntersect( event, planeMath, 'one' );
		
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.z = intersects[0].point.z;	 		
	}
	if(camera == cameraWall) 
	{
		var dir = camera.getWorldDirection();
		dir = new THREE.Vector3().addScaledVector(dir, 10);
		planeMath.position.copy(camera.position);  
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 
		planeMath.updateMatrixWorld();

		var intersects = rayIntersect( event, planeMath, 'one' );	
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.y = intersects[0].point.y;
		onMouseDownPosition.z = intersects[0].point.z;		 		
	}	
}


// 1. кликаем левой кнопокой мыши (собираем инфу для вращения камеры в 3D режиме)
// 2. кликаем правой кнопокой мыши (собираем инфу для перемещения камеры в 3D режиме и устанавливаем мат.плоскость)
function clickSetCamera3D( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				// 1
	{
		//var dir = camera.getWorldDirection();
		var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; }
		phi = dergree;  	
		
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    
		theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;	
		
		
		isMouseDown2 = true;
		onMouseDownTheta = theta;
		onMouseDownPhi = phi;
	}
	else if ( click == 'right' )		// 2
	{
		isMouseDown3 = true;
		planeMath.position.copy( centerCam );
		planeMath.rotation.copy( camera.rotation );
		planeMath.updateMatrixWorld();

		var intersects = rayIntersect( event, planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}





function moveCameraTop( event ) 
{
	if(isMouseRight1 || isMouseDown1) {}
	else { return; }


	newCameraPosition = null;	
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;	
}


// перемещение cameraWall
function moveCameraWall2D( event )
{
	if ( !isMouseRight1 ) { return; }

	var intersects = rayIntersect( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.y += onMouseDownPosition.y - intersects[0].point.y;	
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;
	
	newCameraPosition = null;	
}


// cameraZoom
function mousewheel( e )
{
	
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	if(camera == cameraTop) 
	{ 
		cameraZoomTop( camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) ) ); 
	}
	else if(camera == camera3D) 
	{ 
		cameraZoom3D( delta, 1 ); 
	}
	else if(camera == cameraWall)
	{
		camera.zoom = camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) );
		camera.updateProjectionMatrix();
		
		var k = 1 / camera.zoom;
		if ( k < 1 ) cameraZoomWall();				
	}
	
	setScalePivotGizmo();
	
	renderCamera();
}



// label zoom
function cameraZoomWall()
{				 
	var k = 1 / camera.zoom;
	if ( k > 1 ) k = 1;

	k *= kof_rd;		

	var n1 = 0.25 * k *2;
	var n2 = 0.125 * k *2;	
	var v1 = labelGeometry_1.vertices;
	v1[ 0 ].x = v1[ 1 ].x = -n1;
	v1[ 2 ].x = v1[ 3 ].x = n1;
	v1[ 1 ].y = v1[ 2 ].y = n2;
	v1[ 0 ].y = v1[ 3 ].y = -n2;
	labelGeometry_1.verticesNeedUpdate = true;
	labelGeometry_1.elementsNeedUpdate = true;
}



var zoomLoop = '';
function cameraZoomTopLoop() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoomTop( camera.zoom - ( 0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoomTop( camera.zoom - ( -0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
	}
	else if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoom3D( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoom3D( -0.3, 0.3 ); flag = true; }
	}
	else if ( camera == cameraWall )
	{
		if ( zoomLoop == 'zoomOut' ) { camera.zoom = camera.zoom - ( 0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { camera.zoom = camera.zoom - ( -0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		camera.updateProjectionMatrix();
	}
	
	if(flag) { renderCamera(); }
}






function cameraZoomTop( delta )
{
	if(camera == cameraTop)
	{
		camera.zoom = delta;
		camera.updateProjectionMatrix();		
	}

	var k = 0.085 / delta;

	var n = 0;
	var circle = infProject.geometry.circle;
	var v = infProject.tools.point.geometry.vertices;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[ n ] = new THREE.Vector3().addScaledVector( circle[ i ].clone().normalize(), 0.1 / delta );
		v[ n ].y = 0;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = 0;
		n++;

		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y = height_wall + 0.01;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = height_wall + 0.01;
		n++;
	}
	
	infProject.tools.point.geometry.verticesNeedUpdate = true;
	infProject.tools.point.geometry.elementsNeedUpdate = true;
	
	
	var value = 0.05 / camera.zoom; 
	var v = infProject.geometry.wf_point.vertices;
	v[0].x = v[1].x = v[6].x = v[7].x = -value;
	v[2].x = v[3].x = v[4].x = v[5].x = value;
	v[0].z = v[1].z = v[2].z = v[3].z = value;	
	v[4].z = v[5].z = v[6].z = v[7].z = -value;
	infProject.geometry.wf_point.verticesNeedUpdate = true;
	infProject.geometry.wf_point.elementsNeedUpdate = true;

	// zoom label
	var k = 1 / delta;
	if(k <= infProject.settings.camera.limitZoom) 
	{
		k *= kof_rd;

		var n1 = 0.25 * k *2;
		var n2 = 0.125 * k *2;		
		var v1 = infProject.geometry.labelWall.vertices;
		v1[ 0 ].x = v1[ 1 ].x = -n1;
		v1[ 2 ].x = v1[ 3 ].x = n1;
		v1[ 1 ].z = v1[ 2 ].z = n2;
		v1[ 0 ].z = v1[ 3 ].z = -n2;
		infProject.geometry.labelWall.verticesNeedUpdate = true;
		infProject.geometry.labelWall.elementsNeedUpdate = true;
		upLabelPlan_1( obj_line, true );


		var n1 = 1 * k;
		var n2 = 0.25 * k;
		var v = infProject.geometry.labelFloor.vertices;
		v[ 0 ].x = v[ 1 ].x = -n1;
		v[ 2 ].x = v[ 3 ].x = n1;
		v[ 1 ].z = v[ 2 ].z = n2;
		v[ 0 ].z = v[ 3 ].z = -n2;
		infProject.geometry.labelFloor.verticesNeedUpdate = true;
		infProject.geometry.labelFloor.elementsNeedUpdate = true;
	}
}



function cameraZoom3D( delta, z )
{
	if ( camera != camera3D ) return;

	var vect = ( delta < 0 ) ? z : -z;

	var pos2 = camera.position.clone();

	var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, vect );
	dir.addScalar( 0.001 );
	var pos3 = new THREE.Vector3().addVectors( camera.position, dir );	


	var qt = quaternionDirection( new THREE.Vector3().subVectors( centerCam, camera.position ).normalize() );
	var v1 = localTransformPoint( new THREE.Vector3().subVectors( centerCam, pos3 ), qt );


	var offset = new THREE.Vector3().subVectors( pos3, pos2 );
	var pos2 = new THREE.Vector3().addVectors( centerCam, offset );

	var centerCam_2 = centerCam.clone();
	
	if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
	
	if ( v1.z >= 0.5) 
	{ 
		centerCam.copy(centerCam_2);
		camera.position.copy( pos3 ); 	
	}	
}




// центрируем камеру cameraTop
function centerCamera2D()
{
	if ( camera != cameraTop ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	newCameraPosition = {position2D: new THREE.Vector3(pos.x, cameraTop.position.y, pos.z)};
}


function centerCamera3D()
{
	if ( camera != camera3D ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	newCameraPosition = { position3D: new THREE.Vector3( pos.x, 0, pos.z )};

}


function moveCameraToNewPosition()
{

	if ( !newCameraPosition ) return;

	if (camera === cameraTop && newCameraPosition.position2D) 
	{ 
		var pos = camera.position.clone();
		
		camera.position.lerp(newCameraPosition.position2D, 0.1);
		
		if(camera3D.userData.camera.startProject)
		{
			var pos2 = new THREE.Vector3( camera.position.x - pos.x, 0, camera.position.z - pos.z );
			centerCam.add( pos2 );
			camera3D.position.add( pos2 );			
		}
		
		if(comparePos(camera.position, newCameraPosition.position2D)) { newCameraPosition = null; if(camera3D.userData.camera.startProject) { camera3D.userData.camera.startProject = false; }; };		
	}
	
	else if ( camera === camera3D && newCameraPosition.position3D )
	{
		centerCam.lerp( newCameraPosition.position3D, 0.1 );

		var oldDistance = centerCam.distanceTo( camera.position );

		camera.position.x = oldDistance * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = oldDistance * Math.sin( phi * Math.PI / 360 );
		camera.position.z = oldDistance * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		camera.position.add( centerCam );
		camera.lookAt( centerCam );
		
		if(comparePos(centerCam, newCameraPosition.position3D)) { newCameraPosition = null; };		
	}

	else if ( camera === camera3D && newCameraPosition.positionFirst || camera === camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		camera.lookAt( centerCam ); 
		
		if(comparePos(camera.position, pos)) { newCameraPosition = null; };		
	}
	else
	{
		newCameraPosition = null;
	}
	
	renderCamera();
}


// изменение высоты (через ползунок) камеры в режиме от первого лица 
function changeHeightCameraFirst(value)
{
	if(camera3D.userData.camera.type != 'first') return;
	
	$('.range-slider2').attr("value", value);
	
	camera3D.position.y = (value / 100) * 2 + 0.2;  
}


function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}


console.log( detectBrowser() );
