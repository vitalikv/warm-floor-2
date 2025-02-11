
// инструмент для создании линейки через кнопку из интерфейса
class MyNoteRulerTool
{
	arrPoints = [];
	
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;

	

	crToolPoint({pos, event})
	{
		this.arrPoints = [];
		
		const obj = myNoteRuler.crPoint({pos: pos});
		obj.userData.tag = 'noteRulerToolPoint';
		
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
			this.addNoteRule();
			return null;
		}
		
		obj = myNoteRuler.crPoint({pos: obj.position.clone()});
		obj.userData.tag = 'noteRulerToolPoint';
		
		this.arrPoints.push(obj);		
		if(this.arrPoints.length > 1) myNoteRuler.crLine({points: [...this.arrPoints]});				

		
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

		myNoteRuler.upGeometryLine({point: obj});
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
	addNoteRule()
	{
		const points = this.arrPoints;
		
		myNoteRuler.setPointsRulerTag({points});
		
		this.clearPoint();
		
		const structureRuler = myNoteRuler.getStructure({obj: points[0]});
		if(!structureRuler) return;
		
		myNotes.addDataNote({data: structureRuler});		
	}

	// удаляем линейку (по правой кнопки мыши)
	deleteTool()
	{
		const points = this.arrPoints;
		const line = myNoteRuler.getLineFromPoint({point: points[0]});
				
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







