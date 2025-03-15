

class MyFloorActivate 
{
	activated = false;
	
	init()
	{
		if(this.activated) return; // уже активирована кнопка
		
		this.activated = true;
	}
	
	// кликнули на пол
	clickFloor({obj})
	{
		if(!this.activated) return;
		
		myFloorOutline.deleteOutline();
		myFloorOutline.crFloorOutline({obj});
		
		myUiPanelFloor.showPanel();	
	}	

	
	// создаем по выделеному полу сетку
	crGridAuto()
	{
		const outline = myFloorOutline.getOutline();
		if(!outline) return;
		
		myFloorOutline.deleteOutline();
		myUiPanelFloor.hidePanel();
		
		const arrP = outline.userData.arrP;
		const points = [];
		
		for ( let i = 0; i < arrP.length; i++ )
		{
			const pos = arrP[i].clone();
			const point = myGrids.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
			points.push(point);
		}
		
			
		myGrids.crLine({points});
		myGrids.upGeometryLine({point: points[0]});
		
		myGrids.crGrid({points}); 		
	}
	
	render()
	{
		renderCamera();
	}
}







