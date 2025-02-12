
// 
class MyNoteRouletteTool
{
	arrPoints = [];
	
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;

	

	crToolPoint({pos, event})
	{
		this.arrPoints = [];
		
		const obj = myNoteRoulette.crPoint({pos: pos});
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
		this.deleteTool();
	}	


	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		
		obj = myNoteRoulette.crPoint({pos: obj.position.clone()});
		obj.userData.tag = 'noteRouletteToolPoint';
		
		this.arrPoints.push(obj);		
		if(this.arrPoints.length > 1) myNoteRoulette.crLine({points: [...this.arrPoints]});				

		
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

		myNoteRoulette.upGeometryLine({point: obj});
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
	
	deletePoint({obj})
	{
		scene.remove(obj);
		
		const index = this.arrPoints.indexOf(obj);
		if (index > -1) this.arrPoints.splice(index, 1);
	}


	// удаляем последний участок рулетки (по правой кнопки мыши)
	deleteTool()
	{
		const points = this.arrPoints;
		const line = myNoteRoulette.getLineFromPoint({point: points[0]});
		
		this.deletePoint({obj: points[points.length - 1]});
		
		if(line)
		{
			if(points.length < 2)
			{
				myNoteRouletteSprite.deleteSprites({points});
				
				scene.remove(points[0]);
				line.geometry.dispose();
				scene.remove(line);
			}		
			else
			{
				const sprites = myNoteRouletteSprite.show({points});
				line.userData.sprites = sprites;				
				
				myNoteRoulette.setPointsForPoint({points});							
				myNoteRoulette.upGeometryLine({point: points[0]});
				this.addNoteRoulette();
			}
		}
		
		this.clearPoint();

		this.render();		
	}
	
	
	// после того как закончили построение, превращаем tool в объект рулетка
	addNoteRoulette()
	{
		const points = this.arrPoints;
		
		myNoteRoulette.setPointsRouletteTag({points});
		
		const structureRuler = myNoteRoulette.getStructure({obj: points[0]});
		if(!structureRuler) return;
		
		myNotes.addDataNote({data: structureRuler});		
	}	
	
	render()
	{
		renderCamera();
	}
}







