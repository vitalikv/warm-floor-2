

var param_win = { click : false };


function clickWD( intersect )
{	
	var obj = intersect.object;

	clickO.move = obj;
	
	var pos = intersect.point;
	
	if(camera != cameraWall) { pos.y = obj.position.y; }
	
	if(camera == cameraTop) 
	{
		planeMath.position.set( 0, pos.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	else
	{
		planeMath.position.copy( pos );
		planeMath.rotation.set( 0, obj.rotation.y, 0 );					
	}	
	
	planeMath.updateMatrixWorld();  //  (для того, что бы при первом клике, окно не улетало на старое место, где до этого стояла мат.плоскость)	

	param_win.click = true;

	obj.userData.door.offset = new THREE.Vector3().subVectors( obj.position, pos );	
	
	findOnWallWD(obj);	
}




// находим у окна/двери ближайшие объекты (ограничевающие перемещение)
// если их нету, то находим концы стены
function findOnWallWD(wd)
{
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.0;	// отступы от краев
	var off_2 = 0.0;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off_2 }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	//var arrWD = wallLeftRightWD_2(wd);
	var arrWD = {};
	if(arrWD.left && 1==2)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right && 1==2)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
	
	var v = wd.geometry.vertices;
	var f = wd.userData.door.form.v;
	wd.userData.door.last.x = v[f.maxX[0]].x - v[f.minX[0]].x;
	wd.userData.door.last.y = v[f.maxY[0]].y - v[f.minY[0]].y;
}




// определяем есть ли между окном другие окна/двери и находим ближайшие
function wallLeftRightWD_2(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	// позиция главного окна относительно стены
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}




// находим ближайшую точку к выброанной позиции
function getMinDistanceVertex(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}


 

function moveWD( event, wd ) 
{
	if(camera == camera3D) { return; }
	
	var intersects = rayIntersect( event, planeMath, 'one' ); 	
	if ( intersects.length > 0 ) { moveWD_2( wd, intersects[ 0 ].point ); }	
}


var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();

function moveWD_2( wd, pos )
{
	var wall = wd.userData.door.wall;
	
	if(param_win.click)  
	{ 
		param_win.click = false; 

		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };
		
		// меняем цвет у wd
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	

		// полностью восстанавливаем кирпичную стену
		var arrB = wall.userData.wall.brick.arr;
		for ( var i = 0; i < arrB.length; i++ )
		{
			arrB[i].geometry = wall.userData.wall.brick.geometry.clone();
		} 

		cutSideBlockWall({wall:wall});
		
		// верзаем в кирпичах wd, кроме того wd которое мы перетаскиваем
		var arrO = wall.userData.wall.arrO;
		for ( var i = 0; i < arrO.length; i++ )
		{
			if(arrO[i] == wd) continue;
			
			cutMeshBlockBSP( arrO[i] );	
		}
		
	}
	
	pos = new THREE.Vector3().addVectors( wd.userData.door.offset, pos );			
	pos = wall.worldToLocal( pos.clone() );
	
	var x_min = wd.geometry.boundingBox.min.x;
	var x_max = wd.geometry.boundingBox.max.x;
	var y_min = wd.geometry.boundingBox.min.y;
	var y_max = wd.geometry.boundingBox.max.y;
	
	var bound = wd.userData.door.bound;
	
	if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
	else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }	
	
	// ограничение по высоте при перемещении wd
	if(camera != cameraTop)
	{
		if(pos.y + y_min < bound.min.y){ pos.y = bound.min.y - y_min; }
		else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }
	}	
	
	if(camera == cameraTop){ pos.z = 0; }	
	
	var pos = wall.localToWorld( pos.clone() );
	
	var pos2 = new THREE.Vector3().subVectors( pos, wd.position );
	
	wd.position.copy( pos );	

	wd.userData.door.h1 += pos2.y;
	//UI('window_above_floor_1').val(Math.round(wd.userData.door.h1 * 100) * 10);
	
	for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].position.add( pos2 ); } 	// меняем расположение контроллеров
	
	showRulerWD_2D(wd); 	// перемещаем линейки и лайблы
	showRulerWD_3D(wd);
}




// скрываем размеры и котнроллеры у окна/двери
function hideSizeWD( obj )
{	
	if(clickO.rayhit) 
	{
		if(clickO.rayhit.object == obj) return;	// кликнули на один и тот же активный объект
		
		if(clickO.rayhit.object.userData.tag == 'controll_wd')
		{
			if(clickO.rayhit.object.userData.controll_wd.obj == obj) { return; }
		}		
	}		
		
	if(camera == cameraTop || camera == camera3D) 
	{ 		
		if(obj)
		{
			if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
			{
				if(camera == camera3D)
				{
					obj.userData.door.wall.label[0].visible = true; 
					obj.userData.door.wall.label[1].visible = true;	 
				}
				else
				{
					for ( var i = 0; i < arrWallFront.wall.length; i++ )
					{
						arrWallFront.wall[i].obj.label[0].visible = true;
						arrWallFront.wall[i].obj.label[1].visible = true;		
					}					
				}
			}			
		}
	}
	
	for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].visible = false; }
	for ( var i = 0; i < arrSize.format_2.line.length; i++ ) { arrSize.format_2.line[i].visible = false; }
	for ( var i = 0; i < arrSize.format_2.label.length; i++ ){ arrSize.format_2.label[i].visible = false; }
	//for ( var i = 0; i < arrSize.cutoff.length; i++ ) { arrSize.cutoff[i].visible = false; }	
  	for ( var i = 0; i < arrSize.cutoff.length; i++ ){ arrSize.cutoff[i].visible = false; }
}


// кликнули на окно/дверь (показываем/скрываем таблицу, длина/ширина/высота )
function showTableWD(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			

	var wall = wd.userData.door.wall;
	var pos = wd.localToWorld( new THREE.Vector3(0,minY,0) );
	var h = wall.worldToLocal( pos.clone() ).y;	
	
	wd.userData.door.h1 = h; 

	$('[nameId="wd_menu_1"]').show();
	
	$('[nameId="size-wd-length"]').val(Math.round(d1 * 100) / 100);
	$('[nameId="size-wd-height"]').val(Math.round(d2 * 100) / 100);

}



// измененяем ширину и высоту окна/двери, высоту над полом
function inputWidthHeightWD(wd)
{  
	if(!wd) return;
	if(wd.userData.tag == 'window' || wd.userData.tag == 'door'){}
	else { return; }
	
	var wall = wd.userData.door.wall;
	
	var x = $('[nameId="size-wd-length"]').val();		// ширина окна	
	var y = $('[nameId="size-wd-height"]').val();		// высота окна
	var h = 0;					// высота над полом	
	
	
	// если знаначения ввели с ошибкой, то исправляем
	if(1==1)
	{
		x = x.replace(",", ".");
		y = y.replace(",", ".");
		
		wd.geometry.computeBoundingBox();
		var x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
		var y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));		
		
		x = (isNumeric(x)) ? x : x2;
		y = (isNumeric(y)) ? y : y2;		
	}
	
	
	// ограничение размеров
	if(1==1)
	{
		if(x > 10) { x = 10; }
		else if(x < 0.1) { x = 0.1; }

		if(y > 5) { y = 5; }
		else if(y < 0.1) { y = 0.1; }	
	}
	
	
	//var h = Number(UI('window_above_floor_1').val()) / 1000 - wd.userData.door.h1;		// высота над полом	
	
	h += (y - Math.abs( wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y )) / 2;    // вычитаем изменение высоты окна/двери  
	
	var pos = wd.position.clone();
	pos.y += h;		// вычитаем изменение высоты окна/двери
	wd.userData.door.h1 += h;
	
	сhangeSizePosWD( wd, pos, x, y );	// изменяем размер окна/двери, а также перемещаем
	
	wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );		

	MeshBSP( wd, { wall : wallClone, wd : createCloneWD_BSP( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	showRulerWD(wd);	// показываем линейки и контроллеры для окна/двери
	
	showTableWD(wd);		// обновляем меню
	
	renderCamera();
}




// изменяем размер окна/двери, а также перемещаем
function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var f = wd.userData.door.form.v;
	
	for ( var i = 0; i < f.minX.length; i++ ) { v[f.minX[i]].x = -x / 2; }
	for ( var i = 0; i < f.maxX.length; i++ ) { v[f.maxX[i]].x = x / 2; }
	for ( var i = 0; i < f.minY.length; i++ ) { v[f.minY[i]].y = -y / 2; }
	for ( var i = 0; i < f.maxY.length; i++ ) { v[f.maxY[i]].y = y / 2; }


	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
}




// сняли клик с мышки после токо как кликнули на WD
function clickWDMouseUp(wd)
{
	if(param_win.click) { param_win.click = false; return; }
	
	MeshBSP( wd, objsBSP );
	 
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}	
	
	cutMeshBlockBSP( wd );
	
	//if(comparePos(wd.userData.door.last.pos, wd.position)) { return; }		// не двигали	
}


