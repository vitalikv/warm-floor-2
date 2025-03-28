

var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';





function mouseDownRight()
{
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	var obj = clickO.move;
	
	if(obj)
	{
		if(obj.userData.tag == 'free_dw') { scene.remove(obj); }
		
		if(obj.userData.tag == 'point') 
		{ 	
			if(obj.w.length == 0){ deleteOnePoint(obj); }  
			else 
			{ 
				if(obj.userData.point.type == 'continue_create_wall')
				{
					var point = obj.p[0]; 
					deleteWall_2(obj.w[0]); 
					//upLabelPlan_1([point.w[0]]);					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { deletePoint( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if (obj.userData.tag == 'wf_point' ) 
		{
			if(obj.userData.wf_point.type == 'tool') { deletePointWF(obj); }			
		}
		else if(obj.userData.tag == 'obj')
		{
			deleteObjectPop(obj);
		}
		else if(obj.userData.tag == 'gridPointToolWf')
		{
			myGridPointTool.clickRight();
		}		
		else if(obj.userData.tag == 'noteRulerToolPoint')
		{
			myNoteRulerTool.clickRight();
		}
		else if(obj.userData.tag == 'noteRouletteToolPoint')
		{
			myNoteRouletteTool.clickRight();
		}		
		else if(obj.userData.tag == 'noteMarkerToolPoint')
		{
			myNoteMarkerTool.clickRight();
		}
		else if(obj.userData.tag == 'noteTextToolPoint')
		{
			myNoteTextTool.clickRight();
		}		
		
		clickO = resetPop.clickO();
	}	
	
	clickO.move = null;	
}



function onDocumentMouseDown( event ) 
{
	//event.preventDefault();

	if (window.location.hostname == 'otop-rf' || window.location.hostname == 'warm-floor-2' || window.location.hostname == 'xn------6cdcklga3agac0adveeerahel6btn3c.xn--p1ai'){} 
	else { return; }
 
	long_click = false;
	lastClickTime = new Date().getTime();

	
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


	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;

	clickSetCamera2D( event, vk_click );
	clickSetCamera3D( event, vk_click );


	if ( vk_click == 'right' ) { mouseDownRight( event ); return; } 

	// вкл режим перемещения grid
	if(infProject.scene.grid.active) { clickDownGrid(event); return; }


	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'point') 
		{			
			if(clickO.move.userData.point.type) { clickCreateWall( clickO.move ); return; }  
		}
		if(clickO.move.userData.tag == 'wf_point')
		{
			if(clickO.move.userData.wf_point.type == 'tool') { clickPointToolsWF( clickO.move ); return; }
		}
		if(clickO.move.userData.tag == 'gridPointToolWf')
		{
			clickO.move = myGridPointTool.mousedown({event, obj: clickO.move}); 
			return;
		}
		if(clickO.move.userData.tag == 'noteRulerToolPoint')
		{
			clickO.move = myNoteRulerTool.mousedown({event, obj: clickO.move});
			if(!clickO.move) clickO = resetPop.clickO();			
			return;
		}
		if(clickO.move.userData.tag == 'noteRouletteToolPoint')
		{
			clickO.move = myNoteRouletteTool.mousedown({event, obj: clickO.move}); 
			return;
		}
		if(clickO.move.userData.tag == 'noteMarkerToolPoint')
		{
			clickO.move = myNoteMarkerTool.mousedown({event, obj: clickO.move});
			if(!clickO.move) clickO = resetPop.clickO(); 
			return;
		}
		if(clickO.move.userData.tag == 'noteTextToolPoint')
		{
			clickO.move = myNoteTextTool.mousedown({event, obj: clickO.move});
			if(!clickO.move) clickO = resetPop.clickO(); 
			return;
		}		
	}
	 
	clickO.obj = null; 	
	clickO.actMove = false;	
	clickO.rayhit = clickRayHit(event); 

	if(clickO.rayhit) clickO.obj = clickO.rayhit.object;
	
	if ( camera == cameraTop ) { hideMenuObjUI_2D( clickO.last_obj ); }
	//else if ( camera == camera3D ) { hideMenuObjUI_3D( clickO.last_obj ); }
	//else if ( camera == cameraWall ) { hideMenuObjUI_Wall(clickO.last_obj); }
	
	clickMouseActive({type: 'down'});
	
	renderCamera();
}





function clickRayHit(event)
{ 
	var rayhit = null;	
	
	if(infProject.tools.pivot.visible)
	{
		var ray = rayIntersect( event, infProject.tools.pivot.children, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}
	
	if(infProject.tools.gizmo.visible)
	{
		var arr = [];
		for ( var i = 0; i < 3; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
		
		var ray = rayIntersect( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}

	if(infProject.tools.wf.cube[0].visible)
	{
		var ray = rayIntersect( event, infProject.tools.wf.cube, 'arr' );  
		if(ray.length > 0) { rayhit = ray[0]; }		
	}	
	
	// чтобы подсветка работала, нужно чтобы не было активировано создание сетки, также проверяем существует ли класс myGridPointTool
	let go1 = (myGridPointTool && myGridPointTool.getActGridPointTool()) ? false : true;	
	if(!infProject.scene.block.click.tube && go1)
	{
		var ray = hoverCursorLineWF(event);	
		if(ray) { rayhit = ray; }		
	}


	// ищем линейки, рулетки
	if(!rayhit) 
	{
		var ray = myNotes.clickRayhit({event})
		if(ray) { rayhit = ray; return rayhit; }
	}		
	
	// ищем точку контура сетки
	if(!rayhit) 
	{
		var ray = myGrids.clickRayhit({event});
		if(ray) { rayhit = ray; return rayhit; }
	}	
	

	if(!infProject.scene.block.click.controll_wd)
	{
		var ray = rayIntersect( event, arrSize.cube, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.door)
	{
		var ray = rayIntersect( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.window)
	{
		var ray = rayIntersect( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.click.wall)
	{
		var ray = rayIntersect( event, infProject.scene.array.wall, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	
	if(!infProject.scene.block.click.obj)
	{
		var ray = rayIntersect( event, infProject.scene.array.obj, 'arr' );
		
		if(ray.length > 0)
		{   
			if(rayhit)
			{
				if(rayhit.distance > ray[0].distance) { rayhit = ray[0]; }				
			}
			else 
			{
				rayhit = ray[0];
			}
		}			
	}

	if(!rayhit) 
	{
		rayhit = myGeneratorWFToolP.clickRayhit({event});
		if(rayhit) return rayhit;		
	}
	

	// ищем контур сетки
	if(!rayhit) 
	{
		const dataGrid = myGrids.mouseDetectContour({event, click: true});
		
		if(dataGrid) 
		{ 
			rayhit = myGrids.getDataGridForRyahit(dataGrid);
			return rayhit;
		}
	}	

	
	// ищем пол
	if(!infProject.scene.block.click.room && !rayhit) 
	{
		// проверяем чтобы не кликнули на стены, т.к. часть пола располагается под стенами
		var ray = rayIntersect( event, infProject.scene.array.wall, 'arr' );	
		if(ray.length === 0)
		{
			var ray = rayIntersect( event, infProject.scene.array.room , 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; }						
		}		
	}
	
	
	return rayhit;
}


function clickMouseActive(cdm)
{
	if(!clickO.rayhit) return;

	var obj = clickO.obj = clickO.rayhit.object;
	
	var tag = obj.userData.tag;
	var rayhit = clickO.rayhit;
	var flag = true;
	
	if(cdm.type == 'down')
	{  
		if(clickToolWD(clickO.move)) { flag = false; }
		else if( tag == 'pivot' ) { clickPivot( rayhit ); }
		else if( tag == 'gizmo' ) { clickGizmo( rayhit ); } 
		else if( tag == 'wall' && camera == cameraTop ) { clickWall_2D( rayhit ); }
		else if( tag == 'wall' && camera == cameraWall ) { clickWall_3D( rayhit ); }
		else if( tag == 'point' ) { clickPoint( rayhit ); }
		else if( tag == 'wf_point' ) { clickWFPoint( rayhit ); }
		else if( tag == 'wf_line' ) {  }
		else if( tag == 'window' ) { clickWD( rayhit ); }
		else if( tag == 'door' ) { clickWD( rayhit ); }
		else if( tag == 'room' ) { /* myFloorActivate.clickFloor({obj}); */ }
		else if( tag == 'controll_wd' ) { clickToggleChangeWin( rayhit ); }
		else if( tag == 'scaleBox_control' && camera == cameraTop ) { clickToggleGp( rayhit ); }
		else if( tag == 'obj' && camera == cameraTop ) { clickObject3D( obj, rayhit ); }
		else if( tag == 'boxWF' && camera == cameraTop ) { clickObject2D( obj, rayhit ); }
		//else if( tag == 'gridPointToolWf' && camera == cameraTop ) { myGridPointTool.mousedown({event, obj}); }
		else if( tag == 'gridPointWf' && camera == cameraTop ) { clickO.move = myGridPointMove.mousedown({event, obj}); }
		else if( tag == 'dataGrid' && camera == cameraTop ) 
		{ 
			myGridActivate.activateDataGrid({dataGrid: obj.dataGrid});
			if(myGridMeshOffset.mousedown({event, dataGrid: obj.dataGrid})) { clickO.move = obj; }
		}
		else if( tag == 'noteRulerPoint' && camera == cameraTop  ) { clickO.move = myNoteRuler.mousedown({event, obj}); }
		else if ( tag == 'noteRoulettePoint' && camera == cameraTop  ) { clickO.move = myNoteRoulette.mousedown({event, obj}); }
		else if ( tag == 'noteMarkerPoint' && camera == cameraTop  ) { clickO.move = myNoteMarker.mousedown({event, obj}); }
		else if ( tag == 'noteMarkerSprite' && camera == cameraTop  ) { clickO.move = myNoteMarkerSprite.mousedown({event, obj}); }
		else if ( tag == 'noteTextSprite' && camera == cameraTop  ) { clickO.move = myNoteTextSprite.mousedown({event, obj}); }
		else if ( tag == 'noteTubeHelp' && camera == cameraTop  ) { myNotesInstance.act({tube: obj}); }
		else if( tag == 'arrowContourWf' && camera == cameraTop ) { clickO.move = myGeneratorWFToolP.mousedown({event, obj}); }
		else { flag = false; }
	}
	else if(cdm.type == 'up')
	{		
		if ( tag == 'wall' && camera == camera3D ) {  }
		else if ( tag == 'obj' && camera == camera3D ) { clickObject3D( obj, rayhit ); }
		else if ( tag == 'noteRulerPoint' && camera == camera3D  ) { myNoteRuler.mousedown({event, obj}); setPivotOnObj({obj}); }
		else if ( tag == 'noteRoulettePoint' && camera == camera3D  ) { myNoteRoulette.mousedown({event, obj}); setPivotOnObj({obj}); }
		else if ( tag == 'noteMarkerPoint' && camera == camera3D  ) { myNoteMarker.mousedown({event, obj}); setPivotOnObj({obj}); }
		else if ( tag == 'noteMarkerSprite' && camera == camera3D  ) { myNoteMarkerSprite.mousedown({event, obj}); setPivotOnObj({obj}); }
		else if ( tag == 'noteTextSprite' && camera == camera3D  ) { myNoteTextSprite.mousedown({event, obj}); setPivotOnObj({obj}); }
		else if ( tag == 'noteTubeHelp' && camera == camera3D  ) { myNotesInstance.act({tube: obj}); }
		else { flag = false; }
	}	
	else 
	{ 
		flag = false; 
	}
	
	if(flag) 
	{
		if(camera == cameraTop)
		{
			objActiveColor_2D(obj);
			
			if(tag == 'wall') { showLengthWallUI( obj ); }
			else if(tag == 'point') { $('[nameId="point_menu_1"]').show(); }
			else if(tag == 'door') { showRulerWD( obj ); showTableWD( obj ); }
			else if(tag == 'window') { showRulerWD( obj ); showTableWD( obj ); }
			else if(tag == 'wf_line') { showWF_line_UI( obj ); }
			else if(tag == 'wf_point') { showWF_point_UI( obj ); }
			else if(tag == 'boxWF') { showToggleGp(); showBoxWF_UI(); }
			else if(tag == 'obj') { showObjUI( obj ); }
			else if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
			else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }			
		}		
		else if(camera == camera3D)
		{
			if(tag == 'wall') {  }
			else if(tag == 'obj') { showObjUI( obj ); }	
			else if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
			else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }
		}
		else if(camera == cameraWall)
		{
			if(tag == 'wall') { showLengthWallUI( obj ); }
			else if(tag == 'controll_wd') { obj = obj.userData.controll_wd.obj; }
			else if(tag == 'window') { showRulerWD( obj ); showTableWD( obj ); }
			else if(tag == 'door') { showRulerWD( obj ); showTableWD( obj ); }						
		}
		
		
		
		setLastSelectObj({obj});
		
		consoleInfo( obj );
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

	clickButton( event );
	
	if(infProject.scene.grid.active)	// вкл режим перемещения grid
	{
		if(moveGrid(event)) renderCamera();
		
		return;
	}	

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	var obj = clickO.move;
	
	
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
		
		if( tag == 'pivot' ) { movePivot( event ); }
		else if ( tag == 'gizmo' ) { moveGizmo( event ); }
		else if ( tag == 'wall' ) { moveWall( event, obj ); }
		else if ( tag == 'window' ) { moveWD( event, obj ); }
		else if ( tag == 'door' ) { moveWD( event, obj ); }
		else if ( tag == 'controll_wd' ) { moveToggleChangeWin( event, obj ); }
		else if ( tag == 'point' ) { movePoint( event, obj ); }
		else if ( tag == 'wf_point' ) { moveWFPoint( event, obj ); }
		else if ( tag == 'move_control' ) { moveObjectControls( event ); }
		else if ( tag == 'scaleBox_control' ) { moveToggleGp( event ); }
		else if ( tag == 'room' ) { cameraMove3D( event ); }		
		else if ( tag == 'free_dw' ) { dragWD_2( event, obj ); }
		else if ( tag == 'boxWF' && camera == cameraTop ) { moveObjectPop( event ); }
		else if ( tag == 'obj' ) { moveObjectPop( event ); }
		else if ( tag == 'gridPointToolWf' ) { myGridPointTool.mousemove( event ); }
		else if ( tag == 'gridPointWf' ) { myGridPointMove.mousemove( event ); }
		else if ( tag == 'dataGrid' ) { myGridMeshOffset.mousemove( event ); }
		else if ( tag == 'noteRulerToolPoint' ) { myNoteRulerTool.mousemove( event ); }
		else if ( tag == 'noteRouletteToolPoint' ) { myNoteRouletteTool.mousemove( event ); }
		else if ( tag == 'noteMarkerToolPoint' ) { myNoteMarkerTool.mousemove( event ); }
		else if ( tag == 'noteTextToolPoint' ) { myNoteTextTool.mousemove( event ); }
		else if ( tag == 'noteRulerPoint' ) { myNoteRuler.mousemove( event ); }
		else if ( tag == 'noteRoulettePoint' ) { myNoteRoulette.mousemove( event ); }
		else if ( tag == 'noteMarkerPoint' ) { myNoteMarker.mousemove( event ); }
		else if ( tag == 'noteMarkerSprite' ) { myNoteMarkerSprite.mousemove( event ); }
		else if ( tag == 'noteTextSprite' ) { myNoteTextSprite.mousemove( event ); }
		else if ( tag == 'arrowContourWf' ) { myGeneratorWFToolP.mousemove(event); }
	}
	else 
	{
		if ( camera == camera3D ) { cameraMove3D( event ); }
		else if ( camera == cameraTop ) { moveCameraTop( event ); }
		else if ( camera == cameraWall ) { moveCameraWall2D( event ); }
	}
	

	activeHover2D( event );

	renderCamera();
}


function onDocumentMouseUp( event )  
{
	if(camera == camera3D)
	{
		if(!long_click) 
		{ 	
			hideMenuObjUI_3D( clickO.last_obj );
			clickMouseActive({type: 'up'}); 
		}
	}

	
	var obj = clickO.move;	
	
	if(obj)  
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') 
		{  		
			var point = clickO.move;
			if(!clickO.move.userData.point.type) { clickCreateWall(clickO.move); }			
			clickPointMouseUp(point);
		}
		else if(tag == 'wall') { clickWallMouseUp(obj); }
		else if(tag == 'window' || obj.userData.tag == 'door') { clickWDMouseUp(obj); }	
		else if(tag == 'controll_wd') { clickMouseUpToggleWD(obj); } 
		else if(tag == 'boxWF' || tag == 'obj') { clickMouseUpObject(obj); }
		else if(tag == 'scaleBox_control') { clickO.last_obj = infProject.tools.wf.plane; }
		
		if(tag == 'free_dw') {  }
		else if (tag == 'point') 
		{
			if(obj.userData.point.type) {  } 
			else { clickO.move = null; }
		}
		else if (tag == 'wf_point') 
		{ 
			if(obj.userData.wf_point.type == 'tool') 
			{ 
				upLineWF(obj);
			}
			else 
			{ 
				clickWFPointUp(obj); 
			}			
		}
		else if(tag == 'gridPointToolWf') {  }
		else if(tag == 'gridPointWf') 
		{
			myGridPointMove.mouseup();
			clickO.move = null;
		}
		else if(tag == 'dataGrid') 
		{
			myGridMeshOffset.mouseup();
			clickO.move = null;
		}
		else if(tag == 'noteRulerToolPoint') {  }
		else if(tag == 'noteRouletteToolPoint') {  }
		else if(tag == 'noteMarkerToolPoint') {  }
		else if(tag == 'noteTextToolPoint') {  }
		else if(tag == 'arrowContourWf') { myGeneratorWFToolP.mouseup(); }
		else { clickO.move = null; }		
	}

	if(infProject.scene.grid.active) { clickUpGrid(); }		// вкл режим перемещения grid
	
	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	
	
	clickO.offset = new THREE.Vector3();
	
	renderCamera();
}


// нужен только для того чтобы потом при down клик понять, чтобы было последнее активарованно
// также нужно при удалении
// т.к. перетаскиваемый объект может отличаться от выбраннаого (например точки для изменения размера окна) 
function setLastSelectObj({obj = null})
{
	clickO.last_obj = obj;
}


function hideMenuObjUI_2D( o )
{
	if(o)
	{ 
		objDeActiveColor_2D(); 
		console.log(o.userData.tag);
		switch ( o.userData.tag ) 
		{  
			case 'wall': hideMenuUI(o);  break;
			case 'point': hideMenuUI(o);  break;
			case 'door': hideSizeWD(o); hideMenuUI(o); break;
			case 'window': hideSizeWD(o); hideMenuUI(o); break;
			case 'wf_line': hideMenuUI(o); break;
			case 'wf_point': hideMenuUI(o); break;
			case 'boxWF': hideControlWF(); hideMenuUI(o); break;
			case 'obj': hidePivotGizmo(); break;
		}
	}
	
	setLastSelectObj({obj: null});
}



function hideMenuObjUI_3D( o )
{
	if(o && o.userData.tag)
	{  
		if(o.userData.tag === 'obj')
		{
			hidePivotGizmo();
		}
		if(o.userData.tag === 'noteRulerPoint')
		{			
			const pivot = infProject.tools.pivot;
			
			if(!(clickO.rayhit && clickO.rayhit.object.userData.tag === 'pivot' && pivot.userData.pivot.obj === clickO.last_obj))
			{
				myNoteRuler.deActivateNoteRuler({obj: o}); 
				hidePivotGizmo();					
			}			
		}
		if(o.userData.tag === 'noteRoulettePoint')
		{
			const pivot = infProject.tools.pivot;
			
			if(!(clickO.rayhit && clickO.rayhit.object.userData.tag === 'pivot' && pivot.userData.pivot.obj === clickO.last_obj))
			{
				myNoteRoulette.deActivateNoteRoulette({obj: o}); 
				hidePivotGizmo();					
			}
		}
		if(o.userData.tag === 'noteMarkerPoint')
		{
			const pivot = infProject.tools.pivot;
			
			if(!(clickO.rayhit && clickO.rayhit.object.userData.tag === 'pivot' && pivot.userData.pivot.obj === clickO.last_obj))
			{
				myNoteMarker.deActivateNoteMarker({obj: o}); 
				hidePivotGizmo();				
			}
		}
		if(o.userData.tag === 'noteMarkerSprite')
		{
			const pivot = infProject.tools.pivot;
			
			if(!(clickO.rayhit && clickO.rayhit.object.userData.tag === 'pivot' && pivot.userData.pivot.obj === clickO.last_obj))
			{
				const point = myNoteMarkerSprite.getPointFromSprite({sprite: o});
				myNoteMarker.deActivateNoteMarker({obj: point}); 
				hidePivotGizmo();				
			}
		}		
		if(o.userData.tag === 'noteTextSprite')
		{
			const pivot = infProject.tools.pivot;
			
			if(!(clickO.rayhit && clickO.rayhit.object.userData.tag === 'pivot' && pivot.userData.pivot.obj === clickO.last_obj))
			{
				const point = myNoteTextSprite.getPointFromSprite({sprite: o});
				myNoteText.deActivateNoteText({obj: point}); 
				hidePivotGizmo();				
			}
		}
		if(o.userData.tag === 'noteTubeHelp')
		{
			myNotesInstance.deAct({tube: o});
		}		
	}
}




// скрываем меню (cameraWall)
function hideMenuObjUI_Wall(o)
{  
	if(!o) return;
	if(clickO.last_obj == clickO.obj) return;
	
	
	if(clickO.obj)
	{
		if(clickO.obj.userData.tag == 'controll_wd')
		{ 			
			if(clickO.obj.userData.controll_wd.obj == clickO.last_obj) { return; } 
		} 
	}	
	
	if(o.userData.tag)
	{
		var tag = o.userData.tag;
		
		if(tag == 'wall') { hideMenuUI(o); }
		else if(tag == 'window') { hideSizeWD(o); hideMenuUI(o); }
		else if(tag == 'door') { hideSizeWD(o); hideMenuUI(o); }	
	}
	
	clickO.last_obj = null;
}





function hideMenuUI(obj) 
{
	if(!obj) return;  console.log('hideMenuUI', obj);
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { $('[nameId="wall_menu_1"]').hide(); }
	else if(tag == 'point') { $('[nameId="point_menu_1"]').hide(); }
	else if(tag == 'window') { $('[nameId="wd_menu_1"]').hide(); }
	else if(tag == 'door') { $('[nameId="wd_menu_1"]').hide(); }	
	else if(tag == 'wf_line') { $('[nameId="tube_menu_1"]').hide(); }
	else if(tag == 'wf_point') { $('[nameId="wf_point_menu_1"]').hide(); }
	else if(tag == 'boxWF') { hideBoxWF_UI(); } 
}




// по клику получаем инфу об объекте
function consoleInfo( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	console.log(obj.userData.tag);
	if ( tag == 'room' ) 
	{
		var txt = '';
		//for ( var i = 0; i < obj.w.length; i++ ) { txt += '| ' + obj.w[i].userData.id; }
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		console.log( "room id : " + obj.userData.id + " | point : " + txt, " | userData : ", obj.userData, obj );
	}
	else if( tag == 'wall' )
	{ 
		console.log(obj);
		console.log( "wall id : " + obj.userData.id + " index : " + clickO.index + " | point : " + obj.userData.wall.p[0].userData.id + " | " + obj.userData.wall.p[1].userData.id + " | userData : ", obj.userData ); 
	}
	else if( tag == 'point' )
	{ 
		console.log( "point id : " + obj.userData.id + " | userData : ", obj.userData, obj ); 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};		
		console.log( tag + " id : " + obj.userData.id + " | lotid : " + obj.userData.door.lotid + " | " + " type : " + obj.userData.door.type, txt, " | userData : ", obj.userData, obj ); 
	}
	else if ( tag == 'controll_wd' ) 
	{
		console.log( "controll_wd number : " + obj.userData.controll_wd.id, obj );
	}
	else if ( tag == 'obj' ) 
	{
		console.log( "obj : " + obj.userData.id + " | lotid : " + obj.lotid  + " | userData : ", obj.userData, obj );
	}	
	else if ( tag == 'wf_line' ) 
	{
		console.log( tag + " id : " + obj.userData.id + " | userData : ", obj.userData, obj );
	}	
	else 
	{
		console.log( "pr_id : " + obj.userData.id + " | lotid : " + obj.lotid + " | caption : " + obj.caption, obj );
	}	
}

