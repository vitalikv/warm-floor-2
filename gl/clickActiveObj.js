

// при наведение мыши над объектом (без клика) меняем цвет
function activeHover2D( event )
{
	if (camera != cameraTop) { return; }
	if (isMouseDown1) { return; }

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }
		if (tag == 'wf_point') { if (clickO.move.userData.wf_point.type == 'tool') return; }		
	}
	
	var rayhit = null;
		
	var ray = rayIntersect( event, arrSize.cube, 'arr' );
	if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }	
		
	if(!infProject.scene.block.hover.tube)
	{
		var ray = hoverCursorLineWF(event);	
		if(ray) { rayhit = ray; }		
	}

	if(!infProject.scene.block.hover.door)
	{
		var ray = rayIntersect( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.hover.window)
	{
		var ray = rayIntersect( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.hover.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.hover.wall)
	{
		var ray = rayIntersect( event, infProject.scene.array.wall, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}	
	

	if ( rayhit ) 
	{
		// выделяем объект
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		if ( clickO.last_obj == object ) { activeHover2D_2(); return; }	// объект активирован (крансый цвет), поэтому не подсвечиваем
		if ( clickO.hover == object ) { return; }				// объект уже подсвечен

		if ( tag == 'window' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'door' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'point' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'wf_point' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'wall' ) { object.material[ 3 ].color = new THREE.Color(infProject.listColor.hover2D); }		
		else if ( tag == 'controll_wd' ) { if(clickO.last_obj == object.obj) { activeHover2D_2(); return; } }
		else if ( tag == 'wf_line' ) 
		{ 
			object.material.color = new THREE.Color(infProject.listColor.hover2D); 
			
			var tube = object.userData.wf_line.tube;
			if(tube) { tube.material.color = new THREE.Color(infProject.listColor.hover2D); }
		}		
		activeHover2D_2();

		clickO.hover = object;
	}
	else
	{
		activeHover2D_2();
	}
}



// возращаем стандартный цвет
function activeHover2D_2()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if ( tag == 'window' ) { object.material.color = object.userData.door.color; } 
	else if ( tag == 'door' ) { object.material.color = object.userData.door.color; }	
	else if ( tag == 'wall' ) { object.material[ 3 ].color = object.userData.material[ 3 ].color; }
	else if ( tag == 'wf_point' ) { object.material.color = object.userData.wf_point.color; }
	else if ( tag == 'point' ) { object.material.color = object.userData.point.color; }
	else if ( tag == 'wf_line' ) 
	{ 
		object.material.color = object.userData.wf_line.color; 
		
		var tube = object.userData.wf_line.tube;
		if(tube) { tube.material.color = tube.userData.wf_tube.color; }
	}
	
	clickO.hover = null;
}



// выделяем/активируем объект
// кликнули на объект (выделение) (cameraTop)
function objActiveColor_2D(obj)
{ 
	if(!obj) { return; }   
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'window'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }
	else if(tag == 'point'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }	
	else if(tag == 'wall'){ obj.material[3].color = new THREE.Color(infProject.listColor.active2D); } 	
	else if(tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }	
	else if(tag == 'wf_point'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }
	else if(tag == 'wf_line')
	{ 
		obj.material.color = new THREE.Color(infProject.listColor.active2D);

		var tube = obj.userData.wf_line.tube;
		if(tube) { tube.material.color = new THREE.Color(infProject.listColor.active2D); }		
	}
	
	if(clickO.hover == obj) { clickO.hover = null; }
}
 

	
 
// возращаем стандартный цвет объекта
function objDeActiveColor_2D() 
{			
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.rayhit)
	{    
		if(clickO.rayhit.object.userData.tag == 'controll_wd'){ if(clickO.rayhit.object.userData.controll_wd.obj == o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ o.material[3].color = o.userData.material[3].color; }	
	else if(o.userData.tag == 'point'){ o.material.color = o.userData.point.color; }	
	else if(o.userData.tag == 'window'){ o.material.color = new THREE.Color(infProject.listColor.window2D); }
	else if(o.userData.tag == 'door'){ o.material.color = new THREE.Color(infProject.listColor.door2D); }	
	else if(o.userData.tag == 'room'){ scene.remove(o.userData.room.outline); o.userData.room.outline = null; } 
	else if(o.userData.tag == 'wf_point'){ o.material.color = o.userData.wf_point.color; }
	else if(o.userData.tag == 'wf_line')
	{ 
		o.material.color = o.userData.wf_line.color; 
		
		var tube = o.userData.wf_line.tube;
		if(tube) { tube.material.color = tube.userData.wf_tube.color; }
	}
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
} 





// кликнули на стену в 3D режиме
function clickWall_3D( intersect )
{
	//if(camera != cameraWall) return;
	if(!intersect) return;
	if(!intersect.face) return;
	var index = intersect.face.materialIndex;	
	
	if(index == 1 || index == 2) { } 
	else { return; }
	
	var object = intersect.object;	
	
	clickO.obj = object;
	clickO.index = index;  	
}






