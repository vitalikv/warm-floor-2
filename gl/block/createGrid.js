




function createGrid(cdm)
{
	var lineGrid = new THREE.Group();
	
	var size = (cdm.size) ? cdm.size : 0.2;
	size = Math.round(size * 100)/100; 
	var count = (cdm.count) ? cdm.count : (15/size);
	
	var color = 0xd6d6d6;	
	if(cdm.color) { color = cdm.color; }	
	
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: color, opacity: 1 } );
	
	var ofsset = (count * size) / 2;
	
	// длина линии, центр по середине
	geometry.vertices.push(new THREE.Vector3( -ofsset, 0, 0 ) );	
	geometry.vertices.push(new THREE.Vector3( ofsset, 0, 0 ) );


	for ( var i = 0; i <= count; i ++ ) 
	{
		var line = new THREE.Line( geometry, material );
		line.position.z = ( i * size ) - ofsset;
		lineGrid.add( line );

		var line = new THREE.Line( geometry, material );
		line.position.x = ( i * size ) - ofsset;
		line.rotation.y = 90 * Math.PI / 180;
		lineGrid.add( line );
		
		//console.log(( i * size ) - (count * size) / 2);
	}
	
	scene.add( lineGrid );	

	
	lineGrid.userData.mouse = { down: false, move: false, up: false, startPos: new THREE.Vector3() };
	lineGrid.userData.size = size;
	lineGrid.userData.count = count;
	lineGrid.userData.color = (cdm.uColor) ? cdm.uColor : lineGrid.children[0].material.color.clone();

	
	$('[nameid="size-grid-tube-xy-1"]').val(Math.round(size * 100));	// перводим в см	
	
	
	if(cdm.pos)
	{
		if(cdm.pos.x) lineGrid.position.x = cdm.pos.x;
		if(cdm.pos.y) lineGrid.position.y = cdm.pos.y;
		if(cdm.pos.z) lineGrid.position.z = cdm.pos.z;
	}
	
	return lineGrid;
}


// обновляем размер ячейки
function updateGrid(cdm)
{
	var grid = infProject.scene.grid.obj;
	
	var size = checkNumberInput({ value: cdm.size, unit: 0.01, limit: {min: 0.05, max: 5} });
	
	if(!size) 
	{
		var size = grid.userData.size * 100; // перводим в см
		$('[nameid="size-grid-tube-xy-1"]').val(size);
		
		return;
	}
	
	
	var pos = grid.position.clone();
	var color = grid.children[0].material.color.clone();
	var uColor = grid.userData.color.clone();
	var count = grid.userData.count;
	
	scene.remove( grid );
	
	infProject.scene.grid.obj = createGrid({pos: pos, color: color, size: size, uColor : uColor});
	
	renderCamera();
}


// показываем скрываем сетку
function showHideGrid()
{
	var grid = infProject.scene.grid.obj;
	
	if(grid.visible)
	{
		grid.visible = false;
		
		if(infProject.scene.grid.active) { startEndMoveGrid(); }
		
		infProject.scene.grid.show = false;
	}
	else
	{
		grid.visible = true;
		infProject.scene.grid.show = true;
	}
}



// вкл/выкл режим перемещения grid
function startEndMoveGrid()
{
	var grid = infProject.scene.grid.obj;
	
	if(!infProject.scene.grid.active)
	{
		for(var i = 0; i < grid.children.length; i++)
		{
			grid.children[i].material.color = new THREE.Color(infProject.listColor.active2D);
		}
		
		infProject.scene.grid.active = true;		
	}
	else
	{
		for(var i = 0; i < grid.children.length; i++)
		{
			grid.children[i].material.color = grid.userData.color.clone();
		}

		infProject.scene.grid.active = false;
	}
}



function clickDownGrid(event)
{
	var grid = infProject.scene.grid.obj;
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;

	//grid.userData.mouse.startPos = intersects[0].point.clone();
	grid.userData.mouse.offset = new THREE.Vector3().subVectors( intersects[0].point, grid.position );
	grid.userData.mouse.down = true;
}


function moveGrid(event)
{
	var grid = infProject.scene.grid.obj;
	
	if(!grid.userData.mouse.down) return;
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;

	grid.position.x = intersects[0].point.x - grid.userData.mouse.offset.x;
	grid.position.z = intersects[0].point.z - grid.userData.mouse.offset.z;

	return true;
}



// сняли клик после перемещения grid
function clickUpGrid()
{
	var grid = infProject.scene.grid.obj;
	
	grid.userData.mouse.down = false;
}



// вкл/выкл привязке к сетки
function linkGrid()
{
	var flag = !infProject.scene.grid.link;
	
	infProject.scene.grid.link = flag;
}




