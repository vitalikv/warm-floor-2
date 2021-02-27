



// создаем точку для теплого пола
function createPointWF(cdm)
{
	var point = new THREE.Mesh( infProject.geometry.wf_point, new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 0.6, depthTest: false } ) ); 
	point.position.copy( cdm.pos );		
	point.position.y = infProject.settings.wf_tube.pos.y;	
	
	point.renderOrder = 1;
	
	if(!cdm.id) { var id = countId; countId++; }
	else { var id = cdm.id; }
	
	point.userData.id = id;	
	point.userData.tag = 'wf_point';
	point.userData.wf_point = {};
	point.userData.wf_point.color = point.material.color.clone();
	point.userData.wf_point.type = (cdm.type) ? cdm.type : '';
	point.userData.wf_point.line = { o : (!cdm.line) ? null : cdm.line }
	point.userData.wf_point.cross = { o : null, point : [] };
	scene.add( point );
	
	return point;	
}


// кликнули на точку
function clickWFPoint(intersect)
{
	if(clickO.move)
	{
		if(clickO.move.userData.wf_point.type == 'tool') { return; }	// вкл режим создания линии
	}		
	
	var obj = intersect.object;	
	clickO.move = obj;	
	clickO.actMove = false;
	
	clickO.offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
}




// перетаскиваем точку/tool, обновляем форму линии
function moveWFPoint(event, obj)
{
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
		
		var line = obj.userData.wf_point.line.o;
		
		if(line) 
		{ 
			//line.material.color = new THREE.Color(infProject.listColor.active2D);
			
			if(line.userData.wf_line.tube)
			{
				line.userData.wf_line.tube.visible = false;
			}			 
		}
	}
	
	var pos = new THREE.Vector3().addVectors( intersects[0].point, clickO.offset );
	obj.position.copy(pos);	
	obj.position.y = infProject.settings.wf_tube.pos.y;
	
	dragToolWFPoint({obj : clickO.move});	// проверяем соединения с другими теплыми полами
	
	if(!obj.userData.wf_point.cross.o) { posLinkGrid({point: obj}); } 	// привязка к сетке
	
	// обновляем geometry линии
	if(obj.userData.wf_point.line.o)
	{
		var line = obj.userData.wf_point.line.o;
		
		line.geometry.verticesNeedUpdate = true; 
		line.geometry.elementsNeedUpdate = true;

		// обновляем geometry трубы
		if(line.userData.wf_line.tube)
		{
			//geometryTubeWF({line : line});
		}
	}
	
	showWF_point_UI(obj);
}



// привязка мышки к сетки
function posLinkGrid(cdm)
{
	if(!infProject.scene.grid.show) return;
	if(!infProject.scene.grid.link) return;
	
	var point = cdm.point;
	
	var grid = infProject.scene.grid.obj;
	
	var size = grid.userData.size;
	var count = grid.userData.count;
	
	
	var arr = [];
	
	for(var i = 0; i <= count; i++)
	{
		var value = ( i * size ) - (count * size) / 2;
		
		var posX = value + grid.position.x;
		var posZ = value + grid.position.z;
		
		arr[i] = {};
		arr[i].x = Math.abs(posX - point.position.x);
		arr[i].z = Math.abs(posZ - point.position.z);
		arr[i].posX = posX;
		arr[i].posZ = posZ;
	}
	
	var min = { x: arr[0].x, z: arr[0].z, posX: arr[0].posX, posZ: arr[0].posZ };
	
	for(var i = 1; i < arr.length; i++)
	{
		if(min.x > arr[i].x) { min.x = arr[i].x; min.posX = arr[i].posX; }
		if(min.z > arr[i].z) { min.z = arr[i].z; min.posZ = arr[i].posZ; }
	}
	
			
	
	//if(min.x > 0.04) { min.posX = spPoint(new THREE.Vector3(-10, 0, min.posZ), new THREE.Vector3(10, 0, min.posZ), point.position).x; }
	//if(min.z > 0.04) { min.posZ = spPoint(new THREE.Vector3(min.posX, 0, 10), new THREE.Vector3(min.posX, 0, -10), point.position).z; }
	
	
	point.position.x = min.posX;
	point.position.z = min.posZ;
}



// перетаскиваем точку (определяем пересекается ли с первой/последней точки линий теплого пола)
function dragToolWFPoint(cdm)
{	
	var obj = cdm.obj;
	
	//if(obj.userData.wf_point.line.o) return;
	
	var line_1 = (obj.userData.wf_point.line.o) ? obj.userData.wf_point.line.o : null;
	
	var posMouse = obj.position;	
	posMouse.y = infProject.settings.wf_tube.pos.y;	
	obj.userData.wf_point.cross = { o : null, point : [] };
	
	if(line_1 && line_1.material.color != new THREE.Color(0xff0000)) line_1.material.color = new THREE.Color(0xff0000);
		
	var arr = [];	
	var z = 0.1 / camera.zoom;
	
	for(var i = 0; i < infProject.scene.array.tube.length; i++)
	{ 		
		var line = infProject.scene.array.tube[i];
		
		if(line_1 == line) continue;	// пропускаем свою трубу
		
		var v = line.geometry.vertices;
		
		if(v.length < 2) continue;
		
		var dist1 = v[0].distanceTo(obj.position);
		var dist2 = v[v.length - 1].distanceTo(obj.position);
		
		if(dist1 < dist2)
		{
			var pos = v[0];
			var dist = dist1;
			var cross = line.userData.wf_line.point[0];
		}
		else
		{
			var pos = v[v.length - 1];
			var dist = dist2;
			var cross = line.userData.wf_line.point[line.userData.wf_line.point.length - 1];
		}
		
		if(dist < z) 
		{ 
			arr[arr.length] = {dist: dist, p1: pos, p2: obj.position, cross: cross};
			continue; 
		}
		
		if(!obj.userData.wf_point.line.o)
		{
			// пускаем перпендикуляр от точки на прямую
			for(var i2 = 0; i2 < v.length - 1; i2++)
			{
				if(!calScal(v[i2], v[i2 + 1], posMouse)) continue;	// проверяем попадает ли перпендикуляр от точки на прямую
				
				var pos = spPoint(v[i2], v[i2 + 1], posMouse);  
				var pos = new THREE.Vector3(pos.x, posMouse.y, pos.z);	// получаем точку пересечения точки на прямую
				
				var dist = pos.distanceTo(posMouse);
				
				if(dist > z) continue;	// расстояние от точки пересечения до перетаскиваемой точки				
				
				var point_1 = line.userData.wf_line.point[i2];
				var point_2 = line.userData.wf_line.point[i2];
				arr[arr.length] = {dist: dist, p1: pos, p2: posMouse, cross: line, point: [point_1, point_2]};
			}			
		}		
	}
		
		
	if(arr.length > 1) arr.sort(function (a, b) { return a.dist - b.dist; });

	if(arr.length > 0) 
	{  
		obj.userData.wf_point.cross = {o: arr[0].cross, point: arr[0].point};
		obj.position.copy(arr[0].p1);  
	}
	
	//renderCamera();
}






// подсвечиваем линию или точку, когда наводим рядом мышь 
function hoverCursorLineWF()
{	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return null;
	
	var posMouse = intersects[0].point;	
	posMouse.y = infProject.settings.wf_tube.pos.y;
	
	var arr = [];	
	var z = 0.1 / camera.zoom;
	
	for(var i = 0; i < infProject.scene.array.tube.length; i++)
	{ 		
		var line = infProject.scene.array.tube[i];
		var v = line.geometry.vertices;
		
		if(v.length < 2) continue;

		var flag = false;
		
		for(var i2 = 0; i2 < line.userData.wf_line.point.length; i2++)
		{
			var point = line.userData.wf_line.point[i2];
			
			var dist = point.position.distanceTo(posMouse);
			
			if(dist > z) continue;
			
			arr[arr.length] = {dist: dist, p1: point.position.clone(), p2: posMouse, cross: point};
			
			flag = true;
		}
		
		if(flag) continue;
		
		// пускаем перпендикуляр от точки на прямую
		for(var i2 = 0; i2 < v.length - 1; i2++)
		{
			if(!calScal(v[i2], v[i2 + 1], posMouse)) continue;	// проверяем попадает ли перпендикуляр от точки на прямую
			
			var pos = spPoint(v[i2], v[i2 + 1], posMouse);  
			var pos = new THREE.Vector3(pos.x, posMouse.y, pos.z);	// получаем точку пересечения точки на прямую
			
			var dist = pos.distanceTo(posMouse);
			
			if(dist > z) continue;	// расстояние от точки пересечения до перетаскиваемой точки				
			
			var point_1 = line.userData.wf_line.point[i2];
			var point_2 = line.userData.wf_line.point[i2];
			arr[arr.length] = {dist: dist, p1: pos, p2: posMouse, cross: line};
		}
	}
		
	var result = null;
	
	if(arr.length > 1) arr.sort(function (a, b) { return a.dist - b.dist; });
	
	if(arr.length > 0) 
	{  
		//getNearLineWF(arr[0]);
		result = { object : arr[0].cross, point : posMouse };
	}
	
	renderCamera();
	
	return result;
}




  
// устанвливаем и показываем красные линии
function getNearLineWF(cdm)
{
	var d = cdm.dist;	
	
	var v = infProject.tools.axis[0].geometry.vertices;		
	v[3].x = v[2].x = v[5].x = v[4].x = d;		
	infProject.tools.axis[0].geometry.verticesNeedUpdate = true;

	var dir = new THREE.Vector3().subVectors( cdm.p1, cdm.p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	infProject.tools.axis[0].rotation.set(0, angleDeg + Math.PI / 2, 0);		
	infProject.tools.axis[0].position.copy( cdm.p1 );
	
	infProject.tools.axis[0].visible = true;	
}



// создаем линию
function createLineWF(cdm)
{
	var point = cdm.point;
	
	var geometry = new THREE.Geometry();
	
	for(var i = 0; i < point.length; i++)
	{
		geometry.vertices.push(point[i].position);
	}		
	
	var color = (cdm.color) ? cdm.color : new THREE.Color(infProject.listColor.lineTube2D);
	
	
	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2 }) );
	//line.material.color = color;
	 
	line.userData.tag = 'wf_line';
	line.userData.wf_line = {};
	line.userData.wf_line.tube = null;
	line.userData.wf_line.point = point;
	line.userData.wf_line.color = color;
	line.userData.wf_line.diameter = cdm.diameter;
	scene.add( line );
	
	infProject.scene.array.tube[infProject.scene.array.tube.length] = line;
	
	for(var i = 0; i < point.length; i++)
	{
		point[i].userData.wf_point.line.o = line;
	}			
	
	updateListTubeUI_1({o: line, type: 'add'}); // обновляем список материалов

	return line;
}



// создаем или продолжаем прокладывать линию
function upLineWF(point)
{
	if(point.userData.wf_point.cross.o) { point.userData.wf_point.cross = { o : null, point : [] }; return; }
	
	point.userData.wf_point.type = '';
	
	var line = point.userData.wf_point.line.o;
	
	// создаем новую линию
	if(!line)
	{
		line = createLineWF({point: [point], diameter: infProject.settings.wf_tube.d});
	}	
	
	var point_2 = createPointWF({ pos : point.position.clone(), type : 'tool', line : line }); 
			
	var geometry = new THREE.Geometry();
	geometry.vertices = line.geometry.vertices;	
	geometry.vertices.push(point_2.position);
	
	line.geometry = geometry;
	line.geometry.verticesNeedUpdate = true; 
	line.geometry.elementsNeedUpdate = true;	
	
	line.userData.wf_line.point.push(point_2);

	clickO.move = point_2;
}



// сняли клик, когда перетаскивали точку
function clickWFPointUp(point)
{
	if(point.userData.wf_point.cross.o) { clickPointToolsWF(point); clickO.move = null; return; }
	
	if(clickO.actMove)
	{		
		var line = point.userData.wf_point.line.o;
		
		if(line) 
		{ 
			//line.material.color = new THREE.Color(infProject.listColor.active2D);
			
			if(line.userData.wf_line.tube)
			{
				geometryTubeWF({line : line});
				line.userData.wf_line.tube.visible = true;
			}			 
		}
	}
	
	clickO.move = null;
}



// добавляем точку/создаем линию/объединяем линии
function clickPointToolsWF(obj)
{
	//if(obj.userData.wf_point.line.o) return;
	
	var cross = obj.userData.wf_point.cross.o;
	
	if(!cross) return;
	
	var tag = cross.userData.tag;	
	
	if(tag == 'wf_line' && !obj.userData.wf_point.line.o) 
	{		
		obj.userData.wf_point.type = '';
		clickO.move = null;	
		
		var p = obj.userData.wf_point.cross.point;
		var arrP = cross.userData.wf_line.point;  
		
		for(var i = 0; i < arrP.length; i++) { if(arrP[i] == p[0]) { arrP.splice(i+1, 0, obj); break; } }
		
		obj.userData.wf_point.line.o = cross;
		
		// обновляем geometry линии
		var line = cross;
		
		var geometry = new THREE.Geometry();
		
		for(var i = 0; i < arrP.length; i++)
		{
			geometry.vertices[i] = arrP[i].position;
		}
		
		line.geometry = geometry;	
		line.geometry.verticesNeedUpdate = true; 
		line.geometry.elementsNeedUpdate = true;
		
		obj.userData.wf_point.cross = { o : null, point : [] };	

		hideMenuUI(obj);
		
		clickO = resetPop.clickO();
	}
	if(tag == 'wf_point')
	{		
		var line = cross.userData.wf_point.line.o;
		var p = line.userData.wf_line.point;
		
		var geometry = new THREE.Geometry();
		
		if(cross == p[0])	// добавляем все в обратном порядке
		{		
			var arrP = [];
			
			for(var i = p.length - 1; i > -1; i--) 
			{ 
				geometry.vertices[geometry.vertices.length] = p[i].position; 
				arrP[arrP.length] = p[i];
			}  
			
			line.userData.wf_line.point = arrP;
		}
		else if(cross == p[p.length - 1])	// добавляем все
		{
			geometry.vertices = line.geometry.vertices; 
		}

		var line_1 = obj.userData.wf_point.line.o;
		
		if(line_1)	// у точки есть линия (последнюю точку не добавляем)
		{	
			var p = line_1.userData.wf_line.point;
			
			if(obj == p[0])
			{ 
				for(var i = 0; i < line_1.userData.wf_line.point.length; i++)
				{ 
					var point = line_1.userData.wf_line.point[i];
					
					if(obj == point) continue;
					
					geometry.vertices[geometry.vertices.length] = point.position;
					point.userData.wf_point.line.o = line;							// задаем линию для выделенной точки
					line.userData.wf_line.point.push(point); 						// назначаем линии выделенную точку					
				}				
			}
			
			if(obj == p[p.length - 1])
			{
				for(var i = line_1.userData.wf_line.point.length - 1; i > -1; i--)
				{
					var point = line_1.userData.wf_line.point[i];
					
					if(obj == point) continue;
					
					geometry.vertices[geometry.vertices.length] = point.position;
					point.userData.wf_point.line.o = line;							// задаем линию для выделенной точки
					line.userData.wf_line.point.push(point); 						// назначаем линии выделенную точку					
				}					
			}
			
			updateListTubeUI_1({uuid: line_1.uuid, type: 'delete'});
			
			deleteValueFromArrya({arr : infProject.scene.array.tube, o : line_1});
			scene.remove(line_1);
			scene.remove(obj);	
			
			hideMenuUI(obj);
			clickO = resetPop.clickO();
		}
		else	// у точки нет линии, это tool
		{
			geometry.vertices[geometry.vertices.length] = obj.position;
			
			obj.userData.wf_point.line.o = line;	// задаем линию для выделенной точки
			line.userData.wf_line.point.push(obj); 	// назначаем линии выделенную точку	
			
			if(line.userData.wf_line.tube) { scene.remove(line.userData.wf_line.tube); }
		}		
		
		line.geometry = geometry;	
		line.geometry.verticesNeedUpdate = true; 
		line.geometry.elementsNeedUpdate = true;

	}
	
	// обновляем geometry трубы
	if(line)
	{
		if(line.userData.wf_line.tube) { geometryTubeWF({line : line}); }
	}	
	
	//obj.userData.wf_point.cross = { o : null, point : [] };
}



// создаем или обновляем форму трубы
function geometryTubeWF(cdm)
{
	var line = cdm.line;
	
	var points = [];
		
	for(var i = 0; i < line.geometry.vertices.length; i++)
	{
		points[i] = line.geometry.vertices[i].clone();
	}
	
	var pipeSpline = new THREE.CatmullRomCurve3(points);
	pipeSpline.curveType = 'catmullrom';
	pipeSpline.tension = 0;
	
	var length = 0;
	var v = line.geometry.vertices;	
	for(var i = 0; i < v.length - 1; i++) { length += v[i].distanceTo(v[i + 1]); }		
	
	var params = { extrusionSegments: Math.round(length * 30), radiusSegments: 12, closed: false };
	
	var geometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, line.userData.wf_line.diameter, params.radiusSegments, params.closed );	
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();			

	if(cdm.createLine)
	{
		var tube = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: line.userData.wf_line.color.getHex(), wireframe: false, lightMap : lightMap_1 } ) );	
		line.userData.wf_line.tube = tube;
		tube.userData.wf_tube = {}
		tube.userData.wf_tube.color = line.material.color.clone();
		scene.add( tube );
	}
	else
	{
		line.userData.wf_line.tube.geometry.dispose();
		line.userData.wf_line.tube.geometry = geometry;
	}
	
	updateListTubeUI_1({o: line, type: 'update'});	// обновляем список материалов 
	
	renderCamera();
}



// удаляем точку
function deletePointWF(obj)
{
	//arr_wf.point.pop();	// удаляем последнее значение в массиве
	
	hideMenuUI(obj);
	
	var line = obj.userData.wf_point.line.o;
	
	if(line)
	{
		// если у линии 2 точки, то удаляем точки и линию
		if(line.userData.wf_line.point.length == 2)
		{		
			deleteValueFromArrya({arr : infProject.scene.array.tube, o : line});
			
			disposeNode(line.userData.wf_line.point[0]);
			disposeNode(line.userData.wf_line.point[1]);
			
			scene.remove(line.userData.wf_line.point[0]);
			scene.remove(line.userData.wf_line.point[1]);
			
			if(line.userData.wf_line.tube) 
			{ 
				disposeNode(line.userData.wf_line.tube);
				scene.remove(line.userData.wf_line.tube); 
			}
			
			updateListTubeUI_1({uuid: line.uuid, type: 'delete'});
			
			disposeNode(line);
			scene.remove(line);	
			line = null;			
		}
		else	// удаляем точку
		{
			deleteValueFromArrya({arr : line.userData.wf_line.point, o : obj});

			var geometry = new THREE.Geometry();
			
			for(var i = 0; i < line.userData.wf_line.point.length; i++)
			{
				geometry.vertices[i] = line.userData.wf_line.point[i].position;
			}
			
			line.geometry = geometry;
			line.geometry.verticesNeedUpdate = true; 
			line.geometry.elementsNeedUpdate = true;

			line.material.color = line.userData.wf_line.color.clone();
			
			if(line.userData.wf_line.tube) 
			{ 
				disposeNode(line.userData.wf_line.tube);
				scene.remove(line.userData.wf_line.tube); 
			}
			
			// создаем трубу
			geometryTubeWF({line : line, createLine : true});
		}
	}
	
	disposeNode(obj);
 	scene.remove(obj);	// удаляем точку
	
	clickO = resetPop.clickO();
}




// удаляем линию
function deleteLineWF(line)
{
	hideMenuUI(line);
	
	deleteValueFromArrya({arr : infProject.scene.array.tube, o : line});	
	
	for ( var i = line.userData.wf_line.point.length - 1; i > -1; i-- )
	{
		disposeNode(line.userData.wf_line.point[i]);
		scene.remove(line.userData.wf_line.point[i]);		
	}
	
	if(line.userData.wf_line.tube) 
	{ 
		disposeNode(line.userData.wf_line.tube);
		scene.remove(line.userData.wf_line.tube); 
	}

	updateListTubeUI_1({uuid: line.uuid, type: 'delete'});
	
	disposeNode(line);
	scene.remove(line);
	
	clickO = resetPop.clickO();
}


// при выделении точки, показываем меню
function showWF_point_UI(point)
{
	var line = point.userData.wf_point.line.o;
	
	var length = 0;
	
	if(line)
	{
		var v = line.geometry.vertices;
		
		for(var i = 0; i < v.length - 1; i++)
		{
			length += v[i].distanceTo(v[i + 1]);
		}		
	}

	$('[nameId="size_tube_dist_3"]').text(Math.round(length * 100)/100);
	
	$('[nameId="wf_point_menu_1"]').show();
}


// при выделении трубы, показываем меню
function showWF_line_UI(line)  
{
	$('[nameId="tube_menu_1"]').show();
		
	var v = line.geometry.vertices;
	var length = 0;
	
	for(var i = 0; i < v.length - 1; i++)
	{
		length += v[i].distanceTo(v[i + 1]);
	}
	
	$('[nameId="size_tube_diameter_2"]').val(line.userData.wf_line.diameter * 1000);
	//$('[nameId="size-wall-height"]').val(Math.round(length * 100)/100);
	$('[nameId="size_tube_dist_2"]').text(Math.round(length * 100)/100);
	
	$('[nameId="color_tube_1_default"]').css('background-color', '#'+line.userData.wf_line.color.clone().getHexString()); 
}


// input меняем диаметр трубы
function inputWF_tubeDiametr(cdm)
{
	var line = cdm.line;
	
	if(!line) return;	
	if(line.userData.tag != 'wf_line') return;
	
	var size = checkNumberInput({ value: cdm.size, unit: 0.001, limit: {min: 0.003, max: 0.05}, int: true });
	
	if(!size) 
	{
		var size = line.userData.wf_line.diameter; // перводим в мм
		$('[nameId="size_tube_diameter_2"]').val(size);
		
		return;
	}
	
	infProject.settings.wf_tube.d = size;
	line.userData.wf_line.diameter = size;
	$('[nameId="size_tube_diameter_2"]').val(size * 1000);
	if(line.userData.wf_line.tube) geometryTubeWF({line : line});
}



// меняем цвет трубы input
$('[color_tube_1_change]').on('mousedown', function(e) 
{  
	var line = clickO.last_obj;
	
	if(!line) return;	
	if(line.userData.tag != 'wf_line') return;
	
	
	var color = $(this).attr('color_tube_1_change');
	
	$('[nameId="color_tube_1_default"]').css('background-color', '#'+color);
	$('[nameId="bb_menu_tube_menu_1"]').show();
	$('[nameId="bb_menu_tube_menu_2"]').hide();
	
	
	var color = Number('0x'+color); 
	
	line.material.color = new THREE.Color(color);
	line.userData.wf_line.color = line.material.color.clone();
	
	var tube = line.userData.wf_line.tube;
	
	if(tube) 
	{ 
		tube.material.color = new THREE.Color(color); 
		tube.userData.wf_tube.color = tube.material.color.clone();
	}
	
	updateListTubeUI_1({o: line, type: 'update'});
	
	renderCamera();
	
	return false; 
});









