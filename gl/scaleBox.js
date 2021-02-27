





function createTubeBox()
{
	var cube = new THREE.Mesh( createGeometryCube(1.0, 0.02, 1.0), new THREE.MeshLambertMaterial( { color : 0xcccccc } ) );
	scene.add( cube ); 	
	cube.userData.tag = 'obj';
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = cube;
	
	return cube;
}

 




// создаем пустой куб, для масштабирования приметивов
function createPlaneWF()
{
	var material = new THREE.MeshLambertMaterial({ color: 0xcccccc, transparent: true, opacity: 1.0, lightMap : lightMap_1 }); 
	var box = new THREE.Mesh( createGeometryWD(1, 0.02, 1), material ); 	
	box.userData.tag = 'boxWF';
	box.userData.boxPop = {};
	box.userData.boxPop.popObj = null;
	box.userData.line = [];
	box.renderOrder = 1;
	box.visible = false;
	scene.add( box );

	box.position.y = 0.2;
	
	//infProject.scene.array.obj[infProject.scene.array.obj.length] = box;

	return box;
}



// создаем 6 контроллеров для изменения длины/ширины box (для camera3D)
function createControlBoxPop3D()
{
	var arr = [];
	
	var geometry = createGeometryCube( 0.15, 0.15, 0.15 );
	geometry.faces[6].materialIndex = 1;
	geometry.faces[7].materialIndex = 1;		
	//var materials = [ new THREE.MeshLambertMaterial({ color : 0x3DBA3D }), new THREE.MeshLambertMaterial({ color : 0x43D843 }) ];
	
	for ( var i = 0; i < 6; i++ )
	{		
		var materials = new THREE.MeshLambertMaterial({ color : 0x3DBA3D, lightMap : lightMap_1 });
		arr[i] = new THREE.Mesh( geometry, materials );		
		arr[i].userData.tag = 'scaleBox_control';
		arr[i].userData.contrBP = {};
		arr[i].userData.contrBP.number = i;
		arr[i].userData.contrBP.dir = [];
		arr[i].userData.contrBP.pos = new THREE.Vector3();
		arr[i].userData.contrBP.pos2 = [];
		arr[i].userData.contrBP.offset = new THREE.Vector3();
		arr[i].userData.contrBP.qt = [];		
		arr[i].visible = false;
		arr[i].renderOrder = 1;
		scene.add( arr[i] );
	}	
	
	// act - номера контроллеров, который перетаскиваются в месте с выбранным контроллером
	arr[0].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [6,7] } };
	arr[1].userData.contrBP.act = { cam3D : [2,3,4,5], cam2D : { half : [2,3], total : [4,5] } };
	arr[2].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [6,5] } };
	arr[3].userData.contrBP.act = { cam3D : [0,1,4,5], cam2D : { half : [0,1], total : [7,4] } };
	arr[4].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } };
	arr[5].userData.contrBP.act = { cam3D : [0,1,2,3], cam2D : { half : [], total : [] } }; 	
	
	return arr;
}





// устанавливаем контроллеры
function showToggleGp()
{
	var boxPop = infProject.tools.wf.plane;
	boxPop.updateMatrixWorld();
	
	var v = boxPop.geometry.vertices;
	
	var x_left = boxPop.localToWorld( new THREE.Vector3(v[0].x, 0, 0) );
	var x_right = boxPop.localToWorld( new THREE.Vector3(v[3].x, 0, 0) );
	
	var z_left = boxPop.localToWorld( new THREE.Vector3(0, 0, v[0].z) ); 
	var z_right = boxPop.localToWorld( new THREE.Vector3(0, 0, v[7].z) );
	
	var arrGp = infProject.tools.wf.cube;
	
	arrGp[0].position.copy(x_left);
	arrGp[1].position.copy(x_right);
	arrGp[2].position.copy(z_left);	
	arrGp[3].position.copy(z_right);

	
	arrGp[0].material.color.set( new THREE.Color( 0xf54961 ) ); 
	arrGp[1].material.color.set( new THREE.Color( 0xf54961 ) ); 
	arrGp[2].material.color.set( new THREE.Color( 0x5a72ff ) ); 
	arrGp[3].material.color.set( new THREE.Color( 0x5a72ff ) ); 	
	

	var y_min = boxPop.localToWorld( new THREE.Vector3(0, v[0].y, 0) ); 
	var y_max = boxPop.localToWorld( new THREE.Vector3(0, v[1].y, 0) );		
	arrGp[4].position.copy(y_min);
	arrGp[5].position.copy(y_max);
	arrGp[4].material.color.set( new THREE.Color( 0x78ca8a ) ); 
	arrGp[5].material.color.set( new THREE.Color( 0x78ca8a ) ); 		
	
	
	
	for ( var i = 0; i < 6; i++ )
	{
		arrGp[i].quaternion.copy( boxPop.quaternion );
	}	
	
	arrGp[0].rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI / 2);
	arrGp[1].rotateOnAxis(new THREE.Vector3(0,0,1), -Math.PI / 2);
	arrGp[2].rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI / 2);
	arrGp[3].rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI / 2);
	
	arrGp[4].rotation.set( boxPop.rotation.x, boxPop.rotation.y, boxPop.rotation.z + Math.PI );

	for ( var i = 0; i < 4; i++ )
	{
		arrGp[i].visible = true;
	}	

}
 
 
 
  


// находим normal  
function showHelperNormal(obj)
{
	scene.add(new THREE.ArrowHelper( obj.getWorldDirection(new THREE.Vector3()), obj.position, 1, 0xff0000 ));
	
	obj.updateMatrixWorld();
	var normalMatrix = new THREE.Matrix3().getNormalMatrix( obj.matrixWorld );
	var newNoraml = new THREE.Vector3(1,0,0).applyMatrix3( normalMatrix ).normalize();

	scene.add(new THREE.ArrowHelper( newNoraml, obj.position, 1, 0x1E90FF ));
}



// кликнули на контроллер
function clickToggleGp( intersect )
{
	var obj = clickO.obj = clickO.move = intersect.object;  
	
	var arrGp = infProject.tools.wf.cube; 	
	
	
	var n = [];
	var n2 = [];
	var num = obj.userData.contrBP.number;
	
	if(num == 0) { n[0] = 1; }		
	else if(num == 1) { n[0] = 0; }
	else if(num == 2) { n[0] = 3; }		
	else if(num == 3) { n[0] = 2; }	
	else if(num == 4) { n[0] = 5; }		
	else if(num == 5) { n[0] = 4; }
	
	
	obj.userData.contrBP.limitScale = [];
	
	
	var limit = null;
	
	if(!limit)
	{		
		var limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };				
	}	
	
	if(num == 0) { obj.userData.contrBP.limitScale[0] = { min : limit.x_min, max : limit.x_max }; }		
	else if(num == 1) { obj.userData.contrBP.limitScale[0] = { min : limit.x_min, max : limit.x_max }; }
	else if(num == 2) { obj.userData.contrBP.limitScale[0] = { min : limit.z_min, max : limit.z_max }; }		
	else if(num == 3) { obj.userData.contrBP.limitScale[0] = { min : limit.z_min, max : limit.z_max }; }	
	else if(num == 4) { obj.userData.contrBP.limitScale[0] = { min : limit.y_min, max : limit.y_max }; }		
	else if(num == 5) { obj.userData.contrBP.limitScale[0] = { min : limit.y_min, max : limit.y_max }; }						
	
	
	
	for ( var i = 0; i < arrGp.length; i++ ) { arrGp[i].userData.contrBP.pos = arrGp[i].position.clone(); }
	
	obj.userData.contrBP.pos2 = [];
	obj.userData.contrBP.dir = [];
	obj.userData.contrBP.qt = [];
	
	for ( var i = 0; i < n.length; i++ )
	{
		var pos2 = arrGp[n[i]].position.clone();
		obj.userData.contrBP.pos2[i] = pos2;
		obj.userData.contrBP.pos = obj.position.clone();	
		obj.userData.contrBP.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	 
		obj.userData.contrBP.dir[i] = new THREE.Vector3().subVectors( pos2, obj.position ).normalize(); 
		obj.userData.contrBP.qt[i] = quaternionDirection( obj.userData.contrBP.dir[i].clone() );

		if(obj.userData.contrBP.number > 3) { obj.userData.contrBP.act.cam2D = n2; }
	}
	
	planeMath.position.copy( intersect.point );
	planeMath.rotation.set( Math.PI / 2, 0, 0 );
	

	if(obj.userData.contrBP.number == 4 || obj.userData.contrBP.number == 5)
	{
		var dir = new THREE.Vector3().subVectors( planeMath.position, camera.position ).normalize();
		var angle = Math.atan2( dir.x, dir.z );
		planeMath.rotation.set( 0, 0, Math.PI / 2 );
		planeMath.rotation.y = angle ;
	}		

	
}


// меняем ширину/длину/высоту объекта через input
function inputScaleObjPop(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return;
	if(!obj.userData.obj3D.boxPop) return;
	
 	
	obj.geometry.computeBoundingBox();
	var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
	var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y));
	var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));
	// поправка на масштаб объекта
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z;		


	var x2 = UI( 'object_scale_X' ).val();
	var z2 = UI( 'object_scale_Y' ).val();
	var y2 = UI( 'object_scale_Z' ).val(); 

	x2 = x2.replace(",", ".");
	y2 = y2.replace(",", ".");
	z2 = z2.replace(",", ".");	
	
	x2 = (!isNumeric(x2)) ? x : Number(x2/1000);
	y2 = (!isNumeric(y2)) ? y : Number(y2/1000);
	z2 = (!isNumeric(z2)) ? z : Number(z2/1000);		

	
	var limit = obj.userData.obj3D.sizeMinMaxLimit;
	
	if(!limit)
	{		
		var limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };				
	}
	
	if(x2 < limit.x_min) { x2 = limit.x_min; }
	else if(x2 > limit.x_max) { x2 = limit.x_max; }
	
	if(y2 < limit.y_min) { y2 = limit.y_min; }
	else if(y2 > limit.y_max) { y2 = limit.y_max; }

	if(z2 < limit.z_min) { z2 = limit.z_min; }
	else if(z2 > limit.z_max) { z2 = limit.z_max; }			
	
	
	var scale = obj.userData.obj3D.sizeStart; 
	 
	obj.scale.set(x2/scale.x, y2/scale.y, z2/scale.z);	
	obj.updateMatrixWorld();	
	
	renderCamera();
}


// перемещаем контроллер
function moveToggleGp( event )
{
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if (!intersects) return;
	if (intersects.length == 0) return;
	
	var obj = clickO.move;
	
	// положение контроллера с ограничениями
	var posNew = new THREE.Vector3();
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, obj.userData.contrBP.offset );	
	var posOff2 = [];	
	
	
	for ( var i = 0; i < obj.userData.contrBP.pos2.length; i++ )
	{
		var pos2 = obj.userData.contrBP.pos2[i].clone();		
		var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos2, pos ), obj.userData.contrBP.qt[i] );
		
		if(v1.z < obj.userData.contrBP.limitScale[i].min) { v1.z = obj.userData.contrBP.limitScale[i].min; }	
		if(v1.z > obj.userData.contrBP.limitScale[i].max) { v1.z = obj.userData.contrBP.limitScale[i].max; } 
		
		v1 = new THREE.Vector3().addScaledVector( obj.userData.contrBP.dir[i], -v1.z );
		
		if(i == 1) 
		{ 
			var posOff = new THREE.Vector3().subVectors( posNew, obj.userData.contrBP.pos );
			pos2.add( posOff );		// для смещения диагонального контроллера по второй оси
			posOff2[0] = posOff;	// для подсчета смещения второстепенных 2D контроллеров (который по диагонали)
		}
		
		posNew = new THREE.Vector3().addVectors( pos2, v1 );

		// для подсчета смещения второстепенных 2D контроллеров (который по диагонали)
		if(i == 1) { posOff2[1] = new THREE.Vector3().subVectors( new THREE.Vector3().addVectors( obj.userData.contrBP.pos2[i].clone(), v1 ), obj.userData.contrBP.pos ); }		
	}
	var pos2 = new THREE.Vector3().subVectors( posNew, obj.position );	
	obj.position.copy(posNew);		

	var arrGp = infProject.tools.wf.cube;
	
	// перетаскиваем второстепенные контроллеры
	pos2.divideScalar( 2 );
	var arr = obj.userData.contrBP.act.cam3D; 
	for ( var i = 0; i < arr.length; i++ ) { arrGp[arr[i]].position.add(pos2); }		

	
	
	// центруем Cube относительно контроллеров
	var sumPos = new THREE.Vector3();
	for ( var i = 0; i < 4; i++ ) { sumPos.add(arrGp[i].position); }
	
	var boxPop = infProject.tools.wf.plane;
	boxPop.position.copy( sumPos.divideScalar( 4 ) );
	
	// находим ширину/длину/высоту куба с помощью расстояний между контроллерами
	var x = arrGp[0].position.distanceTo(arrGp[1].position);
	var z = arrGp[2].position.distanceTo(arrGp[3].position);
	var y = arrGp[4].position.distanceTo(arrGp[5].position);
	
	changeSizeBoxPop(x, y, z);
	

}


// меняем размеры boxPop
function changeSizeBoxPop(x, y, z)
{	
	var boxPop = infProject.tools.wf.plane;
	
	var v = boxPop.geometry.vertices;
	v[0].x = v[1].x = v[7].x = v[6].x = -x / 2;
	v[3].x = v[2].x = v[4].x = v[5].x = x / 2;
	v[0].y = v[3].y = v[7].y = v[4].y = -y / 2;
	v[1].y = v[2].y = v[5].y = v[6].y = y / 2;	
	v[4].z = v[5].z = v[6].z = v[7].z = -z / 2;
	v[0].z = v[1].z = v[2].z = v[3].z = z / 2;
	
	boxPop.geometry.verticesNeedUpdate = true;
	boxPop.geometry.elementsNeedUpdate = true;
	boxPop.geometry.computeBoundingBox();
	boxPop.geometry.computeBoundingSphere();
}



// скрываем контроллеры
function hideControlWF()
{
	if(clickO.rayhit)
	{
		if(clickO.rayhit.object.userData.tag == 'scaleBox_control') return;
	}
	
	for ( var i = 0; i < infProject.tools.wf.cube.length; i++ ) { infProject.tools.wf.cube[i].visible = false; }	
}


// скрываем контроллеры
function hideBoxWF_UI()
{
	if(clickO.rayhit)
	{
		if(clickO.rayhit.object.userData.tag == 'scaleBox_control') return;
	}
	
	$('[nameId="box_wf_b1"]').hide();	
}




// при выделении точки, показываем меню
function showBoxWF_UI()
{		
	$('[nameId="box_wf_b1"]').show();
}



