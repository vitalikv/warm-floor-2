

// кликнули на 3D объект в 2D режиме, подготавляем к перемещению
function clickObject2D( obj, intersect )
{	
	var obj = clickO.move = intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}



// перемещение по 2D плоскости 
function moveObjectPop( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
		
		if(obj.userData.tag == 'boxWF') { hideControlWF(); }
	}	
	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );	
}




function clickMouseUpObject(obj)
{
	if(clickO.actMove)
	{		
		if(obj.userData.tag == 'boxWF') { showToggleGp(); }
	}	
}




// кликнули на 3D объект, ставим pivot/gizmo
function clickObject3D( obj, intersect )
{
	
	obj.updateMatrixWorld();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	if(infProject.settings.active.pg == 'pivot')
	{
		var pivot = infProject.tools.pivot;	
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
	}
	
	if(infProject.settings.active.pg == 'gizmo')
	{
		var gizmo = infProject.tools.gizmo;
					
		gizmo.position.copy( pos );
		
		gizmo.visible = true;
		gizmo.userData.gizmo.obj = obj;
		
		if(camera == cameraTop)
		{
			gizmo.children[1].visible = false;
			gizmo.children[2].visible = false;
			
			gizmo.rotation.set(0,0,0);
		}
		else
		{
			gizmo.children[1].visible = true;
			gizmo.children[2].visible = true;
			
			gizmo.rotation.copy( obj.rotation );
		}		
		
		clippingGizmo360(obj); 		
	}
	
	setScalePivotGizmo();
}



// удаление объекта
function deleteObjectPop(obj)
{
	clickO = resetPop.clickO();
	
	hidePivotGizmo(obj);
	
	deleteValueFromArrya({arr : infProject.scene.array.obj, o : obj});
	
	updateListTubeUI_1({uuid: obj.uuid, type: 'delete'});
	
	scene.remove( obj );	
}



// скрываем Pivot/Gizmo
function hidePivotGizmo(obj)
{
	//if(!obj) return;
	//if(!obj.userData.tag) return;
	//if(obj.userData.tag != 'obj') return;
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	if(clickO.rayhit)
	{
		if(pivot.userData.pivot.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'pivot') return;
		
		if(gizmo.userData.gizmo.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'gizmo') return;		
	}	
	
	pivot.visible = false;
	gizmo.visible = false;
	
	pivot.userData.pivot.obj = null;
	gizmo.userData.gizmo.obj = null;
	
	//clickO.obj = null;
	clickO.last_obj = null;
	
	$('[nameId="obj_b_menu_1"]').hide();
}



// при выделении объекта, показываем меню 
function showObjUI()
{	
	$('[nameId="obj_b_menu_1"]').show();
}



// переключаем Pivot/Gizmo
function switchPivotGizmo(cdm)
{
	var obj = null;
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;	
	
	if(infProject.settings.active.pg == 'pivot'){ obj = pivot.userData.pivot.obj; pivot.visible = false; }	
	if(infProject.settings.active.pg == 'gizmo'){ obj = gizmo.userData.gizmo.obj; gizmo.visible = false; }
	
	if(!obj) return;
	
	infProject.settings.active.pg = cdm.mode;		
	
	clickObject3D( obj, null );
}




