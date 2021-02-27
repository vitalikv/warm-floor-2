

// линейки для окон/мебели (создается при старте)
// линейки для отображения длины/высоты стены в режиме cameraWall
function createRulerWin(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( createGeometryCube(1, 0.025, 0.025), new THREE.LineBasicMaterial( mat ) );
		var v = arr[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = 0;
		
		v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
		
		arr[i].geometry.verticesNeedUpdate = true;			
		arr[i].visible = false;	 
		arr[i].renderOrder = 1;
		scene.add( arr[i] );
	}
	
	return arr;
}




// label размера длины/высоты стены в режиме cameraWall
// label размера окна/двери/объекты
function createLabelCameraWall(cdm) 
{	
	var arr = [];

	if(!Array.isArray(cdm.text)) 
	{
		var text = [];
		
		for ( var i = 0; i < cdm.count; i++ )
		{
			text[i] = cdm.text;
		}
		
		cdm.text = text;
	}
	

	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var canvs = document.createElement("canvas");
		var ctx = canvs.getContext("2d");
		
		canvs.width = 256;
		canvs.height = 256/2;
		
		if(cdm.ratio) { canvs.width = cdm.ratio.x; canvs.height = cdm.ratio.y; }
		
		ctx.font = cdm.size + 'pt Arial';
		if(cdm.border == 'border line')
		{
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillRect(0, 0, canvs.width, canvs.height);
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	 	
		}
		else if(cdm.border == 'white')
		{
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(0, 0, canvs.width, canvs.height);	 			
		}

		ctx.fillStyle = 'rgba(82,82,82,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(cdm.text[i], canvs.width / 2, canvs.height / 2 );	
		
		var texture = new THREE.Texture(canvs);
		texture.needsUpdate = true;	
		
		if(cdm.materialTop == 'no') { var material = { transparent: true }; }
		else { var material = { transparent: true, depthTest: false }; }

		if(cdm.opacity) { material.opacity = cdm.opacity; }
		
		material.map = texture;
		var material = new THREE.MeshBasicMaterial(material);
		
		
		var label = new THREE.Mesh(cdm.geometry, material);	
		label.visible = false;
		label.renderOrder = 1.1;
		arr[i] = label;
		scene.add( label );			
	}
	
	return arr;
}




// создаем вертикальные линии для линейки
function createRulerCutoff() 
{
	var arr = [];
	
	for ( var i = 0; i < 8; i++ )
	{
		arr[i] = new THREE.Mesh( createGeometryCube(0.05, 0.005, 0.005), new THREE.MeshLambertMaterial( { color : 0xff0000, transparent: true, depthTest : false } ) );
		
		var v = arr[i].geometry.vertices; 
		v[0].y = v[3].y = v[4].y = v[7].y = -0.0025;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.0025;
		
		v[0].z = v[1].z = v[2].z = v[3].z = -0.0025;
		v[4].z = v[5].z = v[6].z = v[7].z = 0.0025;		
		arr[i].geometry.verticesNeedUpdate = true;			
		
		arr[i].renderOrder = 1;
		arr[i].visible = false;
		
		scene.add( arr[i] );
	}		
	
	return arr;	
}




// обновляем label 
function upLabelCameraWall(cdm)  
{		
	//if(!label){ return; }
	var canvs = cdm.label.material.map.image; 
	var ctx = canvs.getContext("2d");
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	ctx.font = (cdm.sizeText) ? cdm.sizeText+'pt Arial' : '50pt Arial';
	
	if(cdm.border == 'border line')
	{
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);		
	}
	else if(cdm.border == 'white')
	{
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);		
	}
	
	var str = '';
	var value = cdm.text * infProject.settings.unit.wall;
	if(infProject.settings.unit.wall == 1) { str = ' м'; } 
	
	ctx.fillStyle = cdm.color;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(value + str, canvs.width / 2, canvs.height / 2 );
	
	cdm.label.material.map.needsUpdate = true;
}






// room
function upLabelArea2(label, area, text2, size, color, border) 
{		
	if(!label){ return; }
	var canvs = label.material.map.image; 
	var ctx = canvs.getContext("2d");
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	ctx.font = size + 'pt Arial';
	
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	
	
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	
	if(infProject.settings.unit.floor == 1) 
	{
		ctx.fillText('площадь : '+area+ ' м2', canvs.width / 2, canvs.height / 2 - 10 );
		ctx.fillText('объем : '+Math.round((area * height_wall) * 100) / 100 +' м3', canvs.width / 2, canvs.height / 2 + 110 );			
	}
	else if(infProject.settings.unit.floor == 0.01)
	{
		var value = Math.round(area*infProject.settings.unit.floor * 100) / 100;
		ctx.fillText('площадь участка', canvs.width / 2, canvs.height / 2 - 10 );
		ctx.fillText(value+' (сотка)', canvs.width / 2, canvs.height / 2 + 110 );			
	}
	
	label.material.map.needsUpdate = true;
}






// показываем (линейки) нижние размеры между мебелью в режиме cameraWall 
function showSizeFormat_3() 
{
	if(camera != cameraWall) return;
	
	deleteSizeFormat_3(); 
	
	var arr = [];
	
	// находим объекты, которые находятся на полу
	for ( var i = 0; i < arrWallFront.objPop.obj_1.length; i++ ) 
	{
		var obj = arrWallFront.objPop.obj_1[i];
		
		if ( !obj.geometry.boundingBox ) obj.geometry.computeBoundingBox(); 
		//if ( !obj.geometry.boundingSphere ) obj.geometry.computeBoundingSphere(); 
		
		var y = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) ).y;
		
		if(y < 0.1) arr[arr.length] = { obj : obj };
	}
	
	// находим крайние точки POP объектов относительно стены 
	var wall = arrWallFront.wall[0].obj; 
	var index = arrWallFront.wall[0].index;
	var rt = (index == 1) ? 0 : Math.PI;
	
	for ( var i = 0; i < arr.length; i++ ) 
	{
		var obj = arr[i].obj;
		var bound = obj.geometry.boundingBox;
		
		var p = [];
		p[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.min.z)) );	
		p[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.max.z)) );		
		p[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.min.z)) );
		p[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.max.z)) );

		var min = p[0].x;
		var max = p[0].x;
		
		for ( var i2 = 0; i2 < p.length; i2++ )
		{
			if(min > p[i2].x) { min = p[i2].x; }
			if(max < p[i2].x) { max = p[i2].x; }		
		}
		
		arr[i].center = (max - min)/2 + min;
		
		arr[i].pos = [wall.localToWorld( new THREE.Vector3(min, 0, 0)), wall.localToWorld( new THREE.Vector3(max, 0, 0))];		
	}
	
	arr.sort(function (a, b) { return a.center - b.center; });		// сортируем по возрастанию (по параметру center)	
	
		
	
	// утсанавливаем линейки
	if(arr.length > 0)
	{
		var startPos = wall.worldToLocal( arrWallFront.bounds.min.x.clone() );
		startPos = wall.localToWorld(new THREE.Vector3(startPos.x, 0, 0));
		

		
		var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.y, arrWallFront.bounds.min.y ).normalize();
		var rot_2 = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation
		
		for ( var i = 0; i < arr.length + 1; i++ )
		{		
			if(i == arr.length)
			{
				var endPos = wall.worldToLocal( arrWallFront.bounds.max.x.clone() );
				endPos = wall.localToWorld(new THREE.Vector3(endPos.x, 0, 0));					
			}
			else 
			{
				var endPos = arr[i].pos[0];
			}
			
			startPos.y = 0;
			endPos.y = 0;
			
			var d = startPos.distanceTo(endPos);
			
			var dir = new THREE.Vector3().subVectors( endPos, startPos ).normalize();
			var rot_1 = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation			
			
			var line = createRulerWin({count : 1, color : 0xcccccc})[0];
			arrSize.format_3.line[arrSize.format_3.line.length] = line;			
			var v = line.geometry.vertices; 	
			v[3].x = v[2].x = v[5].x = v[4].x = d;
			line.geometry.verticesNeedUpdate = true;					
			line.position.copy( startPos );
			line.position.y -= 0.2;
			line.rotation.set(rot_1.x, rot_1.y - Math.PI / 2, 0);					
			line.visible = true;
			
			var label = createLabelCameraWall({ count : 1, text : Math.round(d * 100) * 10, size : 50, border : 'white', geometry : labelGeometry_1 })[0];
			arrSize.format_3.label[arrSize.format_3.label.length] = label;	
			label.position.copy( new THREE.Vector3().subVectors( endPos, startPos ).divideScalar( 2 ).add( startPos ) );
			label.position.y = line.position.y;			
			label.rotation.set( 0, wall.rotation.y + rt, 0 );    
			label.visible = true;


			// боковые черточки 
			var pos = [startPos, endPos];
			var y = line.position.y;
			for ( var i2 = 0; i2 < pos.length; i2++ )
			{
				var line = createRulerWin({count : 1, color : 0xcccccc})[0];
				arrSize.format_3.line[arrSize.format_3.line.length] = line;			
				var v = line.geometry.vertices; 	
				v[0].x = v[1].x = v[6].x = v[7].x = -0.05;
				v[3].x = v[2].x = v[5].x = v[4].x = 0.05;
				line.geometry.verticesNeedUpdate = true;					
				line.position.copy( pos[i2] );
				line.position.y = y;
				line.rotation.set(rot_2.x, rot_2.y - Math.PI / 2, 0);					
				line.visible = true;				
			}
			
			
			if(i < arr.length) { startPos = arr[i].pos[1] };
		}
		
	}	
}





// удаляем нижние размеры между мебелью в режиме cameraWall 
function deleteSizeFormat_3() 
{	
	for ( var i = 0; i < arrSize.format_3.line.length; i++ ) { scene.remove(arrSize.format_3.line[i]); }
	for ( var i = 0; i < arrSize.format_3.label.length; i++ ) { scene.remove(arrSize.format_3.label[i]); }
	
	arrSize.format_3 = { line : [], label : [] };
}





// из массива объектов, находим ближайший левый и правый объект от выбранного объекта
// 1. находим ближайший левый и правый объект
// 2. находим ближайшую точку к выбранному объекту
function getNearlyWinV(arr, obj, wall, z)
{
	var hitL = null;
	var hitR = null;
	
	var xL = -999999;
	var xR = 999999;
	
	var posL = false;
	var posR = false;
	
	// 1
	wall.updateMatrixWorld();
	var pos = wall.worldToLocal( obj.position.clone() );
	
	for ( var i = 0; i < arr.length; i++ )
	{ 
		var v = wall.worldToLocal( arr[i].position.clone() );

		if (v.x < pos.x){ if(xL <= v.x) { hitL = arr[i]; xL = v.x; } } 
		else { if(xR >= v.x) { hitR = arr[i]; xR = v.x; } }	
	}

	// 2	
	if(hitL != null)
	{
		hitL.updateMatrixWorld();
		var pos = hitL.worldToLocal( obj.position.clone() );
		var v = hitL.geometry.vertices;
			
		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist >= pos.x - v[i].x){ dist = pos.x - v[i].x; posL = v[i].clone(); }
		}
		
		posL.z = z;
		posL = hitL.localToWorld( posL.clone() );
	}
	if(hitR != null)
	{
		hitR.updateMatrixWorld();
		var pos = hitR.worldToLocal( obj.position.clone() );
		var v = hitR.geometry.vertices;

		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist <= pos.x - v[i].x){ dist = pos.x - v[i].x; posR = v[i].clone(); }
		}
		posR.z = z;
		posR = hitR.localToWorld( posR.clone() );
	}	

	return [posR, posL];
}










// показываем длину/высоту между 2 объектами, когда наводим курсор на объект (cameraWall) 
function showSizeFormat_4(obj)  
{ 
	if ( camera != cameraWall ) { return; }
	
	var last_obj = clickO.last_obj;
	
	var wall = arrWallFront.wall[0].obj; 
	var index = arrWallFront.wall[0].index; 
	var rt = (index == 1) ? 0 : Math.PI;	 
	
	var activeO = { pos : [] };
	var hoverO = { pos : [], dir : [] };	 

	
	//if ( !last_obj.geometry.boundingBox ) last_obj.geometry.computeBoundingBox();
	if ( !obj.geometry.boundingBox ) obj.geometry.computeBoundingBox();  
	if ( !obj.geometry.boundingSphere ) obj.geometry.computeBoundingSphere(); 
	
	
	var p = [];
	var bound = obj.geometry.boundingBox;
	var center = obj.geometry.boundingSphere.center; 
	
	// находим крайние точки у POP объекта (над которым находится мышь) относительно стены 
	p[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.min.z)) );	
	p[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.max.z)) );		
	p[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.min.z)) );
	p[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.max.z)) );

	var min = p[0].x;
	var max = p[0].x;
	
	for ( var i2 = 0; i2 < p.length; i2++ )
	{
		if(min > p[i2].x) { min = p[i2].x; }
		if(max < p[i2].x) { max = p[i2].x; }		
	}
	
	p[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(center.x, bound.min.y, center.z)) );	
	p[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(center.x, bound.max.y, center.z)) );	
  
	hoverO.pos[0] = wall.localToWorld( new THREE.Vector3(min, 0, 0));
	hoverO.pos[1] = wall.localToWorld( new THREE.Vector3(max, 0, 0));
	hoverO.pos[2] = wall.localToWorld( new THREE.Vector3(p[0].x, p[0].y, 0));
	hoverO.pos[3] = wall.localToWorld( new THREE.Vector3(p[1].x, p[1].y, 0));
	
	
	// находим крайние точки у POP объекта (который выделен) относительно стены 
	p[0] = wall.worldToLocal( arrSize.cube[0].position.clone() );
	p[1] = wall.worldToLocal( arrSize.cube[1].position.clone() );
	p[2] = wall.worldToLocal( arrSize.cube[2].position.clone() );
	p[3] = wall.worldToLocal( arrSize.cube[3].position.clone() );
	
	activeO.pos[0] = wall.localToWorld(new THREE.Vector3(p[0].x, p[0].y, 0));
	activeO.pos[1] = wall.localToWorld(new THREE.Vector3(p[1].x, p[1].y, 0));
	activeO.pos[2] = wall.localToWorld(new THREE.Vector3(p[2].x, p[2].y, 0));
	activeO.pos[3] = wall.localToWorld(new THREE.Vector3(p[3].x, p[3].y, 0));
	
	var active_2 = [activeO.pos[0].clone(), activeO.pos[1].clone(), activeO.pos[2].clone(), activeO.pos[3].clone()]; // для расчета длины отсечек 
	
	// устанавливаем activeO под один уровень с hoverO (чтобы правильно расчитать длину)
	activeO.pos[0].y = wall.position.y;
	activeO.pos[1].y = wall.position.y;
	
	activeO.pos[2].x = hoverO.pos[2].x;
	activeO.pos[2].z = hoverO.pos[2].z;
	activeO.pos[3].x = hoverO.pos[3].x;
	activeO.pos[3].z = hoverO.pos[3].z;
	
	
	// dir
	hoverO.dir[0] = new THREE.Vector3().subVectors( hoverO.pos[1], hoverO.pos[0] ).normalize();
	hoverO.dir[1] = new THREE.Vector3().subVectors( hoverO.pos[0], hoverO.pos[1] ).normalize();
	hoverO.dir[2] = new THREE.Vector3().subVectors( hoverO.pos[3], hoverO.pos[2] ).normalize();
	hoverO.dir[3] = new THREE.Vector3().subVectors( hoverO.pos[2], hoverO.pos[3] ).normalize(); 
	
	
	// определяем сколько будет линеек по горизонтали
	var arrLine = [];	
	for ( var i = 0; i < 2; i++ ) 
	{
		var inf = [];
		
		for ( var i2 = 0; i2 < 2; i2++ )
		{
			var dir = new THREE.Vector3().subVectors( activeO.pos[i2], hoverO.pos[i] ).normalize();
			
			if(comparePos(dir, hoverO.dir[i])) continue;
			
			var d = hoverO.pos[i].distanceTo( activeO.pos[i2] );
			
			inf[inf.length] = {dist : d, pos : activeO.pos[i2], active_2 : active_2[i2]};
		}
		
		if(inf.length == 1) { arrLine[arrLine.length] = { dist : inf[0].dist, pos : [hoverO.pos[i], inf[0].pos], active_2 : inf[0].active_2 } } 
		else if(inf.length == 2) 
		{
			var n = (inf[0].dist < inf[1].dist) ? 0 : 1;
			arrLine[arrLine.length] = { dist : inf[n].dist, pos : [hoverO.pos[i], inf[n].pos], active_2 : inf[n].active_2 }
		}
	}
	
	// выставляем горизонтальные линейки на высоту центра hover объекта
	if(!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
	var center = obj.geometry.boundingSphere.center;
	var height = obj.localToWorld( new THREE.Vector3(0, center.y, 0) ).y;		
	for ( var i = 0; i < arrLine.length; i++ ) { arrLine[i].pos[0].y = arrLine[i].pos[1].y = height; }	
	
	// определяем сколько будет линеек по вертикали
	for ( var i = 2; i < 4; i++ ) 
	{
		var inf = [];
		
		for ( var i2 = 2; i2 < 4; i2++ )
		{
			var dir = new THREE.Vector3().subVectors( activeO.pos[i2], hoverO.pos[i] ).normalize();
			
			if(comparePos(dir, hoverO.dir[i])) continue;
			
			var d = hoverO.pos[i].distanceTo( activeO.pos[i2] );
			
			inf[inf.length] = {dist : d, pos : activeO.pos[i2], active_2 : active_2[i2]};
		}
		
		if(inf.length == 1) { arrLine[arrLine.length] = { dist : inf[0].dist, pos : [hoverO.pos[i], inf[0].pos], active_2 : inf[0].active_2 } } 
		else if(inf.length == 2) 
		{
			var n = (inf[0].dist < inf[1].dist) ? 0 : 1;
			arrLine[arrLine.length] = { dist : inf[n].dist, pos : [hoverO.pos[i], inf[n].pos], active_2 : inf[n].active_2 }
		}
	}	
	

	
	var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.y, arrWallFront.bounds.min.y ).normalize();
	var rot_2 = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation
		
	var rot = [];

	
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var startPos = arrLine[i].pos[0];
		var endPos = arrLine[i].pos[1];
		var d = arrLine[i].dist;
		
		var dir = new THREE.Vector3().subVectors( endPos, startPos ).normalize();
		rot[i] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation

		var line = arrSize.format_2.line[i];
		var label = arrSize.format_2.label[i];
		
		 
		var v = line.geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		line.geometry.verticesNeedUpdate = true;					
		line.position.copy( startPos );
		//line.position.y = height; 
		line.rotation.set(rot[i].x, rot[i].y - Math.PI / 2, 0);					
		line.visible = true; 

		
		label.position.copy( new THREE.Vector3().subVectors( endPos, startPos ).divideScalar( 2 ).add( startPos ) );
		//label.position.y = line.position.y;			
		label.rotation.set( 0, wall.rotation.y + rt, 0 );
		upLabelCameraWall({label : label, text : Math.round(d * 100) * 10, color : 'rgba(0,0,0,1)', border : 'border line'});
		label.visible = true;
	}
	
	var arr = [];
	for ( var i = 0; i < arrLine.length; i++ )
	{
		arr[i] = { p1 : arrLine[i].pos[0], p2 : arrLine[i].pos[1], active_2 : arrLine[i].active_2 };
	}
	
	showSizeCutoff(arr); 	
}



// боковые отсечки для линейки (cameraWall)
function showSizeCutoff(arrP)
{
	// получаем rotation как у стены
	var rot = [];
	var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).normalize();
	rot[0] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation	

	var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.y, arrWallFront.bounds.min.y ).normalize();
	rot[1] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation		
	
	var n = 0;
	var arr = arrSize.cutoff;	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var startPos = arrP[i].p1;
		var endPos = arrP[i].p2;		 
		
		var rotation = new THREE.Vector3();						
		var dir = new THREE.Vector3().subVectors( endPos, startPos ).normalize();			
		
		var rotation = (dir.y > 0.98 || dir.y < -0.98) ? rot[0] : rot[1];
		
		arr[n].position.copy( startPos );
		arr[n].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);  
		arr[n].material.color.set(0x222222);
		arr[n].visible = true; 

		n++;
		
		arr[n].position.copy( endPos );
		arr[n].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);		
		arr[n].visible = true;
		
		if(arrP[i].active_2)
		{		
			var dir = new THREE.Vector3().subVectors( arrP[i].active_2, endPos ).normalize();
			var r = new THREE.Euler().setFromQuaternion( quaternionDirection(dir) );  // из кватерниона в rotation							
			arr[n].rotation.set(r.x, r.y - Math.PI / 2, 0);		
			
			var d = endPos.distanceTo(arrP[i].active_2);
			
			var v = arr[n].geometry.vertices; 
			v[0].x = v[1].x = v[6].x = v[7].x = 0;
			v[2].x = v[3].x = v[4].x = v[5].x = d;
			arr[n].geometry.verticesNeedUpdate = true;
			arr[n].material.color.set('rgb(17, 255, 0)');  
			
			//console.log(d); console.log('endPos', endPos); console.log('active_2', arrP[i].active_2);			
		}
		else
		{
			var v = arr[n].geometry.vertices; 
			v[0].x = v[1].x = v[6].x = v[7].x = -0.025;
			v[2].x = v[3].x = v[4].x = v[5].x = 0.025;
			arr[n].geometry.verticesNeedUpdate = true;
			arr[n].material.color.set(0x222222);
		}

		n++;
	}		
}



// получаем rotation стены по горизонтали и вертикали (cameraWall)
function getRotationHorVertCamWall()
{
	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).normalize();
	dir[1] = new THREE.Vector3().subVectors( arrWallFront.bounds.min.x, arrWallFront.bounds.max.x ).normalize();
	dir[2] = new THREE.Vector3().subVectors( arrWallFront.bounds.max.y, arrWallFront.bounds.min.y ).normalize();
	dir[3] = new THREE.Vector3().subVectors( arrWallFront.bounds.min.y, arrWallFront.bounds.max.y ).normalize();
	
	var rot = [];
	rot[0] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir[0]) ); 
	rot[1] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir[1]) );
	rot[2] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir[2]) );
	rot[3] = new THREE.Euler().setFromQuaternion( quaternionDirection(dir[3]) ); 
	
	arrWallFront.vector = {horiz: [{dir: dir[0], rot: rot[0]}, {dir: dir[1], rot: rot[1]}], vert: [{dir: dir[2], rot: rot[2]}, {dir: dir[3], rot: rot[3]}]};
}


// показываем линейки длины/высоты стены в режиме cameraWall
function showRuleCameraWall()
{
	if(camera != cameraWall) return;
	
	arrWallFront.wall = [];
	arrWallFront.wall = [{ obj : infProject.scene.array.wall[0], index : 1 }];
	detectDirectionWall_1(infProject.scene.array.wall[0], 1, detectRoomWallSide(wall, 1));			
	
	var wall = arrWallFront.wall[0].obj;
	var index = arrWallFront.wall[0].index;
	var rt = (index == 1) ? 0 : Math.PI;
	
	
	var room = detectRoomWallSide(wall, index);
	var offset = (room) ? 0.1 : 0;
	
	var d = [arrWallFront.bounds.max.x.distanceTo(arrWallFront.bounds.min.x), (arrWallFront.bounds.max.y.y - arrWallFront.bounds.min.y.y - offset)];

	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).normalize();
	dir[1] = new THREE.Vector3().subVectors( arrWallFront.bounds.max.y, arrWallFront.bounds.min.y ).normalize(); 
	console.log('---------333');
	
	var pos = [];
	pos[0] = new THREE.Vector3(arrWallFront.bounds.min.x.x, arrWallFront.bounds.min.y.y - 0.5, arrWallFront.bounds.min.x.z);
	
	if(index == 1)
	{
		pos[1] = new THREE.Vector3(arrWallFront.bounds.min.x.x, arrWallFront.bounds.min.y.y + offset, arrWallFront.bounds.min.x.z);	
		pos[1].add( dir[0].clone().multiplyScalar( -0.8 ) );		
	}
	else
	{
		pos[1] = new THREE.Vector3(arrWallFront.bounds.max.x.x, arrWallFront.bounds.min.y.y + offset, arrWallFront.bounds.max.x.z);	
		pos[1].add( dir[0].clone().multiplyScalar( 0.8 ) );			
	}
	
	
	var pos2 = [];
	pos2[0] = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).divideScalar( 2 ).add( arrWallFront.bounds.min.x );	
	pos2[0].y = pos[0].y;
	pos2[1] = pos[1].clone();
	pos2[1].y = (( arrWallFront.bounds.max.y.y - arrWallFront.bounds.min.y.y ) / 2 + arrWallFront.bounds.min.y.y) + offset;
		
	
	var line = arrSize.format_1.line;
	var label = arrSize.format_1.label;
	for ( var i = 0; i < 2; i++ ) 
	{
		var v = line[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d[i];
		line[i].geometry.verticesNeedUpdate = true;		
		
		line[i].position.copy( pos[i] );

		var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir[i]) );  // из кватерниона в rotation
		line[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);		
		
		line[i].visible = true;
		
		
		label[i].position.copy( pos2[i] );		
		label[i].rotation.set( 0, wall.rotation.y + rt, 0 );    
		label[i].visible = true;		
		upLabelCameraWall({label : label[i], text : Math.round(d[i] * 100) / 100, sizeText : 85, color : 'rgba(82,82,82,1)', border : 'white'}); 			
	}
	
	// устанавливаем боковые черточки для линеек 
	if(index == 1)
	{
		pos[2] = new THREE.Vector3(arrWallFront.bounds.min.x.x, pos[0].y, arrWallFront.bounds.min.x.z);
		pos[3] = new THREE.Vector3(arrWallFront.bounds.max.x.x, pos[0].y, arrWallFront.bounds.max.x.z);
	}
	else
	{
		pos[2] = new THREE.Vector3(arrWallFront.bounds.max.x.x, pos[0].y, arrWallFront.bounds.max.x.z);
		pos[3] = new THREE.Vector3(arrWallFront.bounds.min.x.x, pos[0].y, arrWallFront.bounds.min.x.z);
	}	
	
	
	pos[4] = pos[1].clone();
	pos[5] = pos[1].clone();
	pos[5].y = arrWallFront.bounds.max.y.y;
	
	var rot = [];
	rot[2] = line[1].rotation.clone();
	rot[3] = rot[2];
	rot[4] = line[0].rotation.clone();
	rot[5] = rot[4];
	
	// боковые черточки
	for ( var i = 2; i < 6; i++ )
	{
		var v = line[i].geometry.vertices; 	
		v[0].x = v[1].x = v[6].x = v[7].x = -0.05;
		v[3].x = v[2].x = v[5].x = v[4].x = 0.05;
		line[i].geometry.verticesNeedUpdate = true;
		line[i].position.copy( pos[i] );
		line[i].rotation.copy( rot[i] );
		line[i].visible = true;
	}
}


// скрываем линейки длины/высоты стены в режиме cameraWall
function hideRuleCameraWall()
{
	var line = arrSize.format_1.line;
	var label = arrSize.format_1.label;
	 
	for ( var i = 0; i < line.length; i++ ) { line[i].visible = false; }
	for ( var i = 0; i < label.length; i++ ) { label[i].visible = false; }
	
	deleteSizeFormat_3();
}



// устанвливаем и показываем красные линии
function showNavigateLineCameraWall( cdm )
{
	var pos1 = cdm.pos.start;
	var pos2 = cdm.pos.end;
	
	var dir = new THREE.Vector3().subVectors( pos2, pos1 ).normalize();
	
	if(Math.abs(dir.y) > 0.98) 
	{ 
		var line = infProject.tools.axis[0];
		var vert = arrWallFront.vector.vert;
		if(comparePos(dir, vert[0].dir)) { var rot = vert[0].rot; }
		else { var rot = vert[1].rot; }		
	}  
	else 
	{ 
		var line = infProject.tools.axis[1];
		var horiz = arrWallFront.vector.horiz;
		if(comparePos(dir, horiz[0].dir)) { var rot = horiz[0].rot; }
		else { var rot = horiz[1].rot; }
	}
	 
	
	var d = pos1.distanceTo( pos2 );	 
	
	var v = line.geometry.vertices;		
	v[3].x = v[2].x = v[5].x = v[4].x = d;		
	line.geometry.verticesNeedUpdate = true;
 
	line.rotation.set(rot.x, rot.y - Math.PI / 2, 0);		
	line.position.copy( pos1 );
	line.visible = true;	
}



