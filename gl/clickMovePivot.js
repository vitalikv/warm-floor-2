



// создаем Pivot
function createPivot()
{
	var pivot = new THREE.Object3D();
	pivot.userData.pivot = {};
	pivot.userData.pivot.active = { axis: '', startPos: new THREE.Vector3(), dir: new THREE.Vector3(), qt: new THREE.Quaternion() };
	pivot.userData.pivot.obj = null;
	
	var param = [];
	param[0] = {axis: 'x', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, 0, 0), color: 'rgb(247, 72, 72)', opacity: 0};
	param[1] = {axis: 'y', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(17, 255, 0)', opacity: 0};
	param[2] = {axis: 'z', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, Math.PI/2, 0), color: 'rgb(72, 116, 247)', opacity: 0};
	param[3] = {axis: 'xz', size_1: new THREE.Vector3(0.3, 0.001, 0.3), pos: new THREE.Vector3(0.01, 0.0, -0.16), color: 'rgb(194, 194, 194)', opacity: 0.4};
	param[4] = {axis: 'center', size_1: new THREE.Vector3(0.03, 0.03, 0.03), pos: new THREE.Vector3(-0.015, 0.0, 0.0), color: 'rgb(102, 102, 102)', opacity: 1};
	
	
	for ( var i = 0; i < param.length; i++ )
	{
		var geometry = createGeometryPivot(param[i].size_1.x, param[i].size_1.y, param[i].size_1.z);
		
		var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: param[i].color, transparent: true, opacity: param[i].opacity, depthTest: false, lightMap : lightMap_1 }) );
		obj.userData.tag = 'pivot';
		obj.userData.axis = param[i].axis;	
		obj.renderOrder = 2;
		
		if(param[i].pos) obj.position.set( param[i].pos.x, param[i].pos.y, param[i].pos.z );
		if(param[i].rot) obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );
		
		pivot.add( obj );
		
		if(param[i].size_2)
		{
			var axis = new THREE.Mesh( createGeometryPivot(0.6, 0.02, 0.02), new THREE.MeshLambertMaterial({ color: param[i].color, depthTest: false, lightMap : lightMap_1 }) );	
			axis.renderOrder = 2;
			//axis.rotation.set( arr[i][1].x, arr[i][1].y, arr[i][1].z );		
			obj.add( axis );					
		}
	}	
		
	pivot.add( createCone({axis: 'z', pos: new THREE.Vector3(0,0,-0.6), rot: new THREE.Vector3(-Math.PI/2,0,0), color: 0x0000ff}) );
	pivot.add( createCone({axis: 'x', pos: new THREE.Vector3(0.6,0,0), rot: new THREE.Vector3(0,0,-Math.PI/2), color: 0xff0000}) );
	pivot.add( createCone({axis: 'y', pos: new THREE.Vector3(0,0.6,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00}) );
	
	scene.add( pivot );

	//pivot.rotation.set(0.2, 0.5, 0);
	pivot.visible = false;
	
	return pivot;
}



function createGeometryPivot(x, y, z)
{
	var geometry = new THREE.Geometry();
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(0,-y,z),
				new THREE.Vector3(0,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(0,y,-z),
				new THREE.Vector3(0,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


// создаем конусы для Pivot
function createCone(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
		v[n].y = 0.25;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.25;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshLambertMaterial( { color : cdm.color, wireframe:false, depthTest: false, lightMap : lightMap_1 } ) ); 
	obj.userData.tag = 'pivot';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);
	//obj.visible = false;	
	scene.add( obj );
	
	return obj;
}


// кликнули на pivot
function clickPivot( intersect )
{
	var obj = clickO.move = intersect.object;  
	
	var pivot = infProject.tools.pivot;
	
	var pos = pivot.position.clone();
	
	pivot.userData.pivot.active.startPos = pos;
	
	clickO.offset = new THREE.Vector3().subVectors( pos, intersect.point );
	
	var axis = obj.userData.axis;
	pivot.userData.pivot.active.axis = axis;	
		
	
	if(axis == 'x')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 );
		var dir = new THREE.Vector3();
		var dir = pivot.getWorldDirection(dir); 		
		pivot.userData.pivot.active.dir = new THREE.Vector3(-dir.z, 0, dir.x).normalize();	
		pivot.userData.pivot.active.qt = quaternionDirection( pivot.userData.pivot.active.dir ); 
	}
	else if(axis == 'z')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
		var dir = new THREE.Vector3();
		pivot.userData.pivot.active.dir = pivot.getWorldDirection(dir); 
		pivot.userData.pivot.active.qt = quaternionDirection( pivot.userData.pivot.active.dir ); 
	}
	else if(axis == 'y')
	{ 
		planeMath.rotation.set( 0, 0, 0 ); 
		pivot.userData.pivot.active.dir = dir_y.clone(); 
		pivot.userData.pivot.active.qt = qt_plus_y.clone();

		var mx = new THREE.Matrix4().compose(pivot.position, obj.quaternion, new THREE.Vector3(1,1,1));
				
	}	
	else if(axis == 'xz' || axis == 'center')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
	}		 
	
	
	planeMath.position.copy( intersect.point );
} 





function movePivot( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var pivot = infProject.tools.pivot;
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );

	if(pivot.userData.pivot.active.axis == 'xz')
	{
		
	}		
	else
	{
		var subV = new THREE.Vector3().subVectors( pos, pivot.userData.pivot.active.startPos );
		var locD = localTransformPoint(subV, pivot.userData.pivot.active.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( pivot.userData.pivot.active.dir, locD.z );
		pos = new THREE.Vector3().addVectors( pivot.userData.pivot.active.startPos, v1 );			
	}
	
	 
	
	
	var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
	pivot.position.add( pos2 );
	
	const obj = pivot.userData.pivot.obj;
	
	if(obj) 
	{ 
		obj.position.add( pos2 ); 
		
		if(obj.userData.tag === 'noteRulerPoint')
		{
			myNoteRuler.upGeometryLine({point: obj});
		}
		
		if(obj.userData.tag === 'noteRoulettePoint')
		{
			myNoteRoulette.upGeometryLine({point: obj});
		}

		if(obj.userData.tag === 'noteMarkerPoint')
		{
			myNoteMarker.upGeometryLine({point: obj});
			
			myNoteMarkerSprite.rayDetectObj({targetObj: obj});	// определяем объект на который указывает и меняем текст sprite
		}

		if(obj.userData.tag === 'noteMarkerSprite')
		{
			const point = myNoteMarkerSprite.getPointFromSprite({sprite: obj});
			point.position.add( pos2 );				
			myNoteMarker.upGeometryLine({point}); 
		}
		
		if(obj.userData.tag === 'noteTextSprite')
		{
			const point = myNoteTextSprite.getPointFromSprite({sprite: obj});
			const points = myNoteText.getPointsFromPoint({point});
			
			for ( let i = 0; i < points.length; i++ )
			{
				points[i].position.add( pos2 );
			}			
			myNoteText.upGeometryLine({point});
		}		
	}
		
	//gizmo.position.add( pos2 );

}



// масштаб Pivot/Gizmo
function setScalePivotGizmo()
{
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var pVis = false;
	var gVis = false;
	
	if(pivot.visible) pVis = true;
	if(gizmo.visible) gVis = true;	
	if(!pVis && !gVis) { return; }
	
	var obj = null;
	
	if(pVis) obj = pivot.userData.pivot.obj;
	if(gVis) obj = gizmo.userData.gizmo.obj;
	if(!obj) return;
	
	if(camera == cameraTop)
	{		
		var scale = 1/camera.zoom+0.5;	
		
		if(pVis) pivot.scale.set( scale,scale,scale );
		if(gVis) gizmo.scale.set( scale,scale,scale );
	}
	else
	{
		var dist = camera.position.distanceTo(obj.position);
		
		var scale = dist/6;	
		
		if(pVis) pivot.scale.set( scale,scale,scale );
		if(gVis) gizmo.scale.set( scale,scale,scale );		
	}
}


// ставим pivot
function setPivotOnObj({obj})
{	
	obj.updateMatrixWorld();
	const pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	const pivot = infProject.tools.pivot;	
	pivot.visible = true;	
	pivot.userData.pivot.obj = obj;
	pivot.position.copy(pos);

	if(camera == cameraTop)
	{
		pivot.children[1].visible = false;
		pivot.children[7].visible = false;
	}
	else
	{
		pivot.children[1].visible = true;
		pivot.children[7].visible = true;
	}
	
	setScalePivotGizmo();
	
	return pivot;
}

