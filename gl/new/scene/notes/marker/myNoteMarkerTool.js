
// инструмент для создании выноски с текстом через кнопку из интерфейса
class MyNoteMarkerTool
{
	arrPoints = [];
	
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;

	

	crToolPoint({pos, event})
	{
		this.arrPoints = [];
		
		const obj = myNoteMarker.crPoint({pos: pos});
		obj.userData.tag = 'noteMarkerToolPoint';
		
		this.arrPoints.push(obj);		
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		
		
		this.actObj = obj;
		this.isDown = true;
		
		return obj;
	}
	
	
	clickRight()
	{
		this.deleteTool();
	}	


	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		// закончили построение линейки
		if(this.arrPoints.length === 2) 
		{
			this.addNoteMarker();
			return null;
		}
		
		obj = myNoteMarker.crPoint({pos: obj.position.clone()});
		obj.userData.tag = 'noteMarkerToolPoint';
		
		this.arrPoints.push(obj);		
		if(this.arrPoints.length > 1) myNoteMarker.crLine({points: [...this.arrPoints]});				

		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		
		
		this.actObj = obj;
		this.isDown = true;

		return this.actObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		this.isMove = true;
		
		const obj = this.actObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		obj.position.add( offset );	

		myNoteMarker.upGeometryLine({point: obj});
	}
	
	mouseup = () =>
	{
				
	}	


	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
		
		this.arrPoints = [];
	}

	
	// после того как закончили построение, превращаем tool в объект линейка
	addNoteMarker()
	{
		const points = this.arrPoints;
		
		myNoteMarker.setPointsMarkerTag({points});
		
		this.clearPoint();
		
		const structure = myNoteMarker.getStructure({obj: points[0]});
		if(!structure) return;
		
		myNotes.addDataNote({data: structure});		
	}

	// удаляем (по правой кнопки мыши)
	deleteTool()
	{
		const points = this.arrPoints;
		const line = myNoteMarker.getLineFromPoint({point: points[0]});
		
		myNoteMarkerSprite.deleteSprite({points});
				
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
		}						
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
		
		this.clearPoint();

		this.render();		
	}
	
	render()
	{
		renderCamera();
	}
}







