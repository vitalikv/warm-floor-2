


// получаем параметры стены и кирпичей/блоков из input
function getFormWallR_1() 
{
	if(infProject.settings.project == 'wall_block' || infProject.settings.project == 'wall_kirpich'){}
	else return;
	
	//--------------------
	
	var seam = $('input[name="block_seam"]:checked').val();	// толщина шва
	infProject.settings.wall.brick.seam = Number(seam);
	
	//--------------------
	
	var size = $('input[name="block_size"]:checked').val();		// размер блока 
	
	if(infProject.settings.project == 'wall_kirpich')
	{
		if(size == "250х120х65") { size = {x:0.25, y:0.065, z:0.120}; }
		else if(size == "250х120х88") { size = {x:0.25, y:0.088, z:0.120}; }
		else if(size == "250х120х140") { size = {x:0.25, y:0.140, z:0.120}; }
		else { size = {x:0.25, y:0.065, z:0.120}; }
	}
	else if(infProject.settings.project == 'wall_block')
	{
		if(size == "600х200х200") { size = {x:0.6, y:0.2, z:0.2}; }
		else if(size == "600х250х200") { size = {x:0.6, y:0.2, z:0.25}; }
		else if(size == "600х300х200") { size = {x:0.6, y:0.2, z:0.3}; }
		else { size = {x:0.6, y:0.2, z:0.2}; }		
	}
	
	infProject.settings.wall.brick.size = size;
	
	//--------------------
	
	
	if(infProject.settings.project == 'wall_kirpich')
	{
		infProject.settings.wall.brick.layer = $('input[name="block_layer"]:checked').val();		// тип укладки	
	}
	
		
}


// проверяем в input изменили ли параметры стены по сравнению со старыми значениями
function checkChangeFormWallR()
{
	if(infProject.settings.project == 'wall_block' || infProject.settings.project == 'wall_kirpich'){}
	else return;

	var size = infProject.settings.wall.brick.size;
	var seam = infProject.settings.wall.brick.seam;
	var layer = infProject.settings.wall.brick.layer;
	
	
	getFormWallR_1();
	
	var size_2 = infProject.settings.wall.brick.size;
	var seam_2 = infProject.settings.wall.brick.seam;
	var layer_2 = infProject.settings.wall.brick.layer;
	
	var up = false;
	
	if(size.x != size_2.x) { up = true; }
	else if(size.y != size_2.y) { up = true; }
	else if(size.z != size_2.z) { up = true; }
	else if(seam != seam_2) { up = true; }
	else if(layer != layer_2) { up = true; }
	
	if(up)
	{
		if(infProject.scene.array.wall.length > 0) 
		{
			resetScene(); 
			createFormWallR(); 
			if(camera == cameraWall) changeCamera(cameraWall);
		}
	}
	
}


// создаем кирпичную стену
function createFormWallR()
{	
	
		
	var size = infProject.settings.wall.brick.size;		// размер блока кирпича
	var seam = infProject.settings.wall.brick.seam;		// толщина шва

	// создаем стену
	var point1 = createPoint( new THREE.Vector3(-3,0,0), 0 );
	var point2 = createPoint( new THREE.Vector3(3,0,0), 0 );
	
	var layer = infProject.settings.wall.brick.layer;
	
	if(layer == '0.5'){ var width = size.z - seam; }
	else if(layer == '1'){ var width = size.x - seam; }
	else if(layer == '1.5'){ var width = size.x + size.z; }
	else if(layer == '2'){ var width = size.x + size.x - seam/2; }			
		
	var height = 2;
	
	
	// создаем инструмент для резки кирпичей по бокам стены и сверху
	var geometry = createGeometryWall(1, 1, 1, 0);
	var material = new THREE.MeshLambertMaterial( { color : 0xffff00 } );
	
	var cutWall = [];
	
	for(var i = 0; i < 3; i++)
	{
		cutWall[i] = new THREE.Mesh( geometry.clone(), material );	
		cutWall[i].visible = false;
		scene.add(cutWall[i]);		
	}
	
	infProject.tools.cutWall = cutWall;
	// создаем инструмент для резки кирпичей по бокам стены и сверху
	
	
	var wall = createOneWall3( point1, point2, width, {height: height, texture : infProject.settings.wall.material} );

	// кирпич
	var geometry = createGeometryCube(size.x, size.y, size.z);
	var v = geometry.vertices;
	v[3].x = v[2].x = v[5].x = v[4].x = size.x;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	geometry.verticesNeedUpdate = true; 
	geometry.elementsNeedUpdate = true;		
	
	var material = new THREE.MeshLambertMaterial( { color : 0xffffff } );

	// загружаем текстуру кирпича
	new THREE.TextureLoader().load(infProject.path+infProject.settings.wall.brick.material.link, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		texture.repeat.x = 1;
		texture.repeat.y = 1;			

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});	
	
	wall.userData.wall.brick.size = size;
	wall.userData.wall.brick.seam = seam;
	wall.userData.wall.brick.geometry = geometry;
	wall.userData.wall.brick.material = material;
	
	resetSideBlockWall({start:true,wall:wall});
	cutSideBlockWall({wall:wall});	// обрезаем кирпичи по краям стены
	
	renderCamera();
}



// обновляем стену. полностью удаляем все блоки и заново строим
function resetSideBlockWall(cdm)
{
	if(cdm.start){}
	else if(cdm.wall.userData.wall.brick.arr.length > 0){}
	else { return; }

	
	var wall = cdm.wall;
	var p = wall.userData.wall.p;
	var dist = p[0].position.distanceTo(p[1].position);	
	
	for(var i = wall.userData.wall.brick.arr.length - 1; i > -1; i--)
	{
		var block = wall.userData.wall.brick.arr[i];
		scene.remove(block);
		if(block.geometry) { block.geometry.dispose(); }
	}	
	
	wall.userData.wall.brick.arr = [];
	var geometry = wall.userData.wall.brick.geometry;
	var material = wall.userData.wall.brick.material;
	var size = wall.userData.wall.brick.size;
	var height = wall.userData.wall.height_1;
	var seam = wall.userData.wall.brick.seam;
	var layer = infProject.settings.wall.brick.layer;
	

	
	
	if(1==1)
	{
		var res = pickBrickLaying(layer, size, seam);
		var qt = res.qt;
		var row = res.row;
		
		var startPos = p[0].position.clone();
		var endPos = p[1].position.clone();
		
		var v = geometry.vertices;

		// поворачиваем точку на заданный угол, получаем новую позицию после поворота
		function rotateV2(pos, angle)
		{
			var pos2 = new THREE.Vector3();
			
			pos2.x = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
			pos2.z = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);	
			
			return pos2;
		}

		var v2 = [];
		
		for(var n2 = 0; n2 < v.length; n2++)
		{
			v2[n2] = rotateV2(v[n2], Math.PI/2);
		}	
	
		
		var sum = 0;	// кол-во кирпичей у стены
		var stopY = false;
		var numY = 0;		
		while(!stopY)
		{
			stopY = true;
			
			for(var n = 0; n < qt.length; n++)
			{
				if(qt[n].stop.y) continue;
				
				var pos = qt[n].pos.clone();
				
				if(numY > 0) pos.y += (size.y + seam) * row;

				var count = 0;
				
				for(var n2 = 0; n2 < v.length; n2++)
				{
					if(v[n2].y + pos.y > height) { count++; }
				}	

				if(count == v.length) 
				{ 
					qt[n].stop.y = true;
				}
				else
				{
					qt[n].pos.y = pos.y;
				}
				
				qt[n].lastY = (count > 0) ? true : false;

				stopY = false;
			}
			
			
			
			lineX( JSON.parse(JSON.stringify( qt )), v ); 
				
			numY++;
			
			
			//if(numY > 100) stopY = true;
		}
		
		
		function lineX(qt, v)
		{
			//console.log('Y', qt);
			
			var stop = false;
			var numX = 0;
			while(!stop)
			{			
				stop = true;
				
				for(var n = 0; n < qt.length; n++)
				{
					if(qt[n].stop.x) continue;
					if(qt[n].stop.y) continue;
					
					var pos = JSON.parse(JSON.stringify(qt[n].pos));
					
					pos.x += (size.x + 0.01) * numX;
									
					var count = 0;
					
					for(var n2 = 0; n2 < v.length; n2++)
					{
						if(qt[n].rotY) 
						{
							if(v2[n2].x + pos.x + startPos.x > endPos.x) { count++; }
						}
						else if(v[n2].x + pos.x + startPos.x > endPos.x) { count++; }						
					}	

					if(count == v.length) 
					{ 
						qt[n].stop.x = true;
					}
					else
					{
						var block = new THREE.Mesh( geometry, material );
						
						block.position.copy(pos);
						block.position.add(startPos);
						if(qt[n].rotY) { block.rotation.y = qt[n].rotY; }
						
						wall.userData.wall.brick.arr[wall.userData.wall.brick.arr.length] = block;
						scene.add(block);
						
						block.userData.tag = 'block_1';
						block.userData.setX = { num : numX, last : (count > 0) ? true : false };  
						block.userData.setY = { num : numX, last : qt[n].lastY };
						
						qt[n].stop.x = (count > 0) ? true : false;
						
						sum++;
					}									
					
					stop = false;
				}
				
				numX++;  
			}
			
			console.log('numX', numX-1);
		}
		
		
		console.log('numY', numY);
		
		console.log(sum);
	}			
	
	
}



// обрезаем кирпичей по краям и сверху стены
function cutSideBlockWall(cdm)
{
	var wall = cdm.wall;
	
	if(wall.userData.wall.brick.arr.length == 0) return;
	
	var p = wall.userData.wall.p;
	
	var dist = p[0].position.distanceTo(p[1].position);
	
	// инструмент для резки кирпичей
	var cutWall = infProject.tools.cutWall;
	
	var resize = [{x1: 0, x2 : 1, y1 : -1, y2 : wall.userData.wall.height_1 + 1}];
	resize[1] = {x1: 0, x2 : 1, y1 : -1, y2 : wall.userData.wall.height_1 + 1};
	resize[2] = {x1: -1, x2 : dist + 1, y1 : 0, y2 : 1};
	
	for(var i = 0; i < cutWall.length; i++)
	{
		var v = cutWall[i].geometry.vertices;
		v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = resize[i].x1;
		v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = resize[i].x2;
		
		v[0].y = v[2].y = v[4].y = v[6].y = v[8].y = v[10].y = resize[i].y1;
		v[1].y = v[3].y = v[5].y = v[7].y = v[9].y = v[11].y = resize[i].y2;

		v[0].z = v[1].z = v[6].z = v[7].z = wall.userData.wall.width + 0.5;
		v[4].z = v[5].z = v[10].z = v[11].z = -wall.userData.wall.width - 0.5;
		
		cutWall[i].geometry.verticesNeedUpdate = true; 
		cutWall[i].geometry.elementsNeedUpdate = true;			
	}
	
	var dir = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();
	var dir1 = new THREE.Vector3().addScaledVector ( dir, -0.001 );
	var dir2 = new THREE.Vector3().addScaledVector ( dir, 0.001 );
	
	cutWall[0].position.copy(p[0].position);
	cutWall[0].position.add(dir1);
	cutWall[0].rotation.copy(wall.rotation);
	cutWall[0].position.y -= 0.1;
	cutWall[0].rotation.y += Math.PI;
	
	cutWall[1].position.copy(p[1].position);
	cutWall[1].position.add(dir2);
	cutWall[1].rotation.copy(wall.rotation);
	cutWall[1].position.y -= 0.1; 
	
	cutWall[2].position.copy(wall.position);	
	cutWall[2].rotation.copy(wall.rotation);
	cutWall[2].position.y = wall.userData.wall.height_1;
	cutWall[2].position.y += 0.001;	
	// инструмент для резки кирпичей
	
	
	// обрезаем кирпичи по бокам стены
	var arrB = wall.userData.wall.brick.arr;
	
	for ( var i = 0; i < arrB.length; i++ )
	{
		if(arrB[i].geometry.vertices.length == 0) continue;		
		
		var wd2 = null;
		
		if(arrB[i].userData.setX.num == 0) { wd2 = infProject.tools.cutWall[0]; }
		else if(arrB[i].userData.setX.last) { wd2 = infProject.tools.cutWall[1]; }
		else { continue; }
		
		var wdBSP = new ThreeBSP( wd2 );    
		var wallBSP = new ThreeBSP( arrB[i] ); 			// копируем выбранную стену	
		var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы		
		
		arrB[i].geometry = newBSP.toGeometry();
	} 

	// обрезаем края сверху
	for ( var i = 0; i < arrB.length; i++ )
	{
		if(arrB[i].geometry.vertices.length == 0) continue;		
		
		var wd2 = null;
		
		if(arrB[i].userData.setY.last) { wd2 = infProject.tools.cutWall[2]; }
		else { continue; }
		
		var wdBSP = new ThreeBSP( wd2 );    
		var wallBSP = new ThreeBSP( arrB[i] ); 			// копируем выбранную стену	
		var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы		
		
		arrB[i].geometry = newBSP.toGeometry();
	}		
}




function pickBrickLaying(type, size, seam)
{
	var qt = [];
	var row = 2;	
	
	if(type == '0.5')	// 0.5 ряд
	{
		qt[0] = { pos : new THREE.Vector3(-0.01, 0, 0), stop : { x : false, y : false } };
		qt[1] = { pos : new THREE.Vector3(-0.01 - size.x/2, size.y + seam, 0), stop : { x : false, y : false } };		
	}
	
	if(type == '1-1')	// 1 ряд
	{
		qt[0] = { pos : new THREE.Vector3(-0.01,0, (size.z + seam)/2), stop : { x : false, y : false } };	
		qt[1] = { pos : new THREE.Vector3(-0.01 - size.x/2, 0, (-size.z - seam)/2), stop : { x : false, y : false } };			
		qt[2] = { pos : new THREE.Vector3(-0.01 - size.x/2, size.y + seam, (size.z + seam)/2), stop : { x : false, y : false } };
		qt[3] = { pos : new THREE.Vector3(-0.01, size.y + seam, (-size.z - seam)/2), stop : { x : false, y : false } };					
	}


	if(type == '1')		// 1 ряд
	{
		qt[0] = { pos : new THREE.Vector3(-0.01, 0, (size.z + seam)/2), stop : { x : false, y : false } };
		qt[1] = { pos : new THREE.Vector3(-0.01, 0, (-size.z - seam)/2), stop : { x : false, y : false } };			
		qt[2] = { pos : new THREE.Vector3(-0.01 + size.z/2, size.y + seam, size.x/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[3] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + 0.01, size.y + seam, size.x/2), rotY : Math.PI/2, stop : { x : false, y : false } };		
	}


	if(type == '1.5')	// 1.5 ряда
	{
		qt[0] = { pos : new THREE.Vector3(-0.01, 0, size.z + seam), stop : { x : false, y : false } };		
		qt[1] = { pos : new THREE.Vector3(-0.01 + size.z/2, 0, size.z/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[2] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + seam, 0, size.z/2), rotY : Math.PI/2, stop : { x : false, y : false } };			
		qt[3] = { pos : new THREE.Vector3(-0.01, size.y + seam, -size.z - seam), stop : { x : false, y : false } };		
		qt[4] = { pos : new THREE.Vector3(-0.01 + size.z/2, size.y + seam, size.z + size.z/2 + seam), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[5] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + seam, size.y + seam, size.z + size.z/2 + seam), rotY : Math.PI/2, stop : { x : false, y : false } };	
	}
	
	
	if(type == '2')		// 2 ряда
	{
		qt[0] = { pos : new THREE.Vector3(-0.01, 0, size.x - size.z/2 + seam/2), stop : { x : false, y : false } };		
		qt[1] = { pos : new THREE.Vector3(-0.01 + size.z/2, 0, size.z + seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[2] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + seam, 0, size.z + seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[3] = { pos : new THREE.Vector3(-0.01, 0, -size.x + size.z/2 - seam/2), stop : { x : false, y : false } };		
		qt[4] = { pos : new THREE.Vector3(-0.01 + size.z/2, size.y + seam, size.x + seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };		
		qt[5] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + seam, size.y + seam, size.x + seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[6] = { pos : new THREE.Vector3(-0.01 + size.z/2, size.y + seam, -seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };
		qt[7] = { pos : new THREE.Vector3(-0.01 + size.z + size.z/2 + seam, size.y + seam, -seam/2), rotY : Math.PI/2, stop : { x : false, y : false } };					
	}
	
	
	return { qt : qt, row : row };
}
