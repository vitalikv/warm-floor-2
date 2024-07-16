
// 
class MyNoteRouletteTool
{
	arrPoints = [];
	
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;

	

	crToolRulerPoint({pos, event})
	{
		this.arrPoints = [];
		
		const obj = myNoteRuler.crPoint({pos: pos});
		obj.userData.tag = 'noteRouletteToolPoint';
		
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
		this.deleteRulerTool();
	}	


	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		
		obj = myNoteRuler.crPoint({pos: obj.position.clone()});
		obj.userData.tag = 'noteRouletteToolPoint';
		
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

	
	getActGridPointTool()
	{
		return this.actObj;
	}

	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	deletePoint({obj})
	{
		scene.remove(obj);
		
		const index = this.arrPoints.indexOf(obj);
		if (index > -1) this.arrPoints.splice(index, 1);
	}


	// удаляем последний участок рулетки (по правой кнопки мыши)
	deleteRulerTool()
	{
		let points = this.arrPoints;
		const line = myNoteRuler.getLineFromPoint({point: points[0]});
		
		this.deletePoint({obj: points[points.length - 1]});
		
		points = this.arrPoints;
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'noteRoulettePoint';
			points[i].userData.points = points;
		}		
		
		if(line)
		{
			if(points.length < 2)
			{
				scene.remove(points[0]);
				line.geometry.dispose();
				scene.remove(line);
			}		
			else
			{
				myNoteRuler.upGeometryLine({point: points[0]});
			}
		}
		
		this.arrPoints = [];
		
		this.clearPoint();

		this.render();		
	}
	
	render()
	{
		renderCamera();
	}
}







