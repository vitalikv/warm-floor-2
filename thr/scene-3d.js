var container = document.getElementById( 'scene-3d' );

container.addEventListener('contextmenu', function(event) { event.preventDefault() });
container.addEventListener( 'mousedown', onDocumentMouseDown, false );
container.addEventListener( 'mousemove', onDocumentMouseMove, false );
container.addEventListener( 'mouseup', onDocumentMouseUp, false );

container.addEventListener( 'touchstart', onDocumentMouseDown, false );
container.addEventListener( 'touchmove', onDocumentMouseMove, false );
container.addEventListener( 'touchend', onDocumentMouseUp, false );


var w_w = container.clientWidth;
var w_h = container.clientHeight;
var aspect = w_w/w_h;
var d = 5;
var infProject = { settings : {}, scene : {}, cam: { mirror : [] } };

var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2', { antialias: true } );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );

//var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, /*antialias : true*/});
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( w_w, w_h );


container.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

//----------- Light 
var light_1 = new THREE.AmbientLight( 0xffffff, 1.7 );
scene.add( light_1 ); 
 

var light_2 = new THREE.DirectionalLight( 0xcccccc, 1.3 );
light_2.position.set(0,15,0);
light_2.lookAt(scene.position);
light_2.castShadow = true;
light_2.shadow.mapSize.width = 2048;
light_2.shadow.mapSize.height = 2048;
light_2.shadow.camera.left = - d;
light_2.shadow.camera.right = d;
light_2.shadow.camera.top = d;
light_2.shadow.camera.bottom = - d;
light_2.shadow.camera.near = 0;
light_2.shadow.camera.far = 3500;
scene.add( light_2 );

//----------- camera
var camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
camera.position.set(5, 3, 5);
camera.lookAt(new THREE.Vector3(0,2,0));
camera.userData.tag = 'cameraTop';

var camera = new THREE.PerspectiveCamera( 65, w_w / w_h, 0.2, 1000 );  
camera.rotation.order = 'YZX';		//'ZYX'
camera.position.set(8, 6, 8);
camera.lookAt(new THREE.Vector3(0,2,-2));
camera.userData.tag = 'camera3D';
//----------- camera



var theta = 0;
var radius = 14;
function animate() 
{
	requestAnimationFrame( animate );
	
	theta += 0.1;
	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt(new THREE.Vector3(0,2,-2));
	
	renderer.render(scene, camera);
}



createGrid();

function createGrid() 
{
	var geom_line = new THREE.Geometry();
	var count_grid1 = 100;
	var count_grid2 = (count_grid1 * 1) / 2;
	geom_line.vertices.push(new THREE.Vector3( - count_grid2, 0, 0 ) );
	geom_line.vertices.push(new THREE.Vector3( count_grid2, 0, 0 ) );
	linesMaterial = new THREE.LineBasicMaterial( { color: 0xd6d6d6, opacity: 1, linewidth: .1 } );

	for ( var i = 0; i <= count_grid1; i ++ ) 
	{
		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.z = ( i * 1 ) - count_grid2;
		line.position.y = -0.01;
		scene.add( line );

		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.x = ( i * 1 ) - count_grid2;
		line.position.y = -0.01;
		line.rotation.y = 90 * Math.PI / 180;
		scene.add( line );
	}	
}





new THREE.MTLLoader().load
( 
	'js/house_2.mtl',
	
	function ( materials ) 
	{
		materials.preload();
		
		new THREE.OBJLoader().setMaterials( materials ).load						
		( 
			'js/house_2.obj', 
			function ( object ) 
			{		console.log(333333, object);
				object.position.set(-7,0,4);
				//object.scale.set(0.001, 0.001, 0.001);
				scene.add( object );
			} 
		);
	}
);


var vk_click = '';
var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var planeMath = createPlaneMath();
var onMouseDownPosition = {x:0, y:0};
var onMouseDownPhi = 0;
var onMouseDownTheta = 0;
var raycaster = new THREE.Raycaster();
var centerCam = new THREE.Vector3(0,2,-2);



function onDocumentMouseDown( event ) 
{
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}
	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right'; /*middle*/ break;
		case 2: vk_click = 'right'; break;
	}

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if (vk_click == 'left')				// 1
	{		
		var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; }
		onMouseDownPhi = dergree;  	
		
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    
		onMouseDownTheta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;			
		
		isMouseDown2 = true;
	}
	else if(vk_click == 'right')		// 2
	{
		isMouseDown3 = true;
		planeMath.position.copy( centerCam );
		planeMath.rotation.copy( camera.rotation );
		planeMath.updateMatrixWorld();		
		
		var intersects = rayIntersect( event, planeMath, 'one' );	
		//camera3D.userData.camera.click.pos = intersects[0].point;  			
	}
}



function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}

	cameraMove3D( event );
}


function onDocumentMouseUp( event )  
{
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
}



function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide } );
	mat_pm.visible = false; 
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}


function rayIntersect( event, obj, t ) 
{
	var mouse = {x:0, y:0};
	mouse.x = ( event.clientX / w_w ) * 2 - 1;
	mouse.y = - ( event.clientY / w_h ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); }
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }	
	
	return intersects;
}



function cameraMove3D( event )
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



animate();