
// инструмент текст
class MyNoteText
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;

	indPoint = 0;
	

	// точка
	crPoint({pos})
	{
		const obj = new THREE.Mesh( myNotesInstance.geomPoint, myNotesInstance.matDef.clone() );
		//const obj = new THREE.Mesh( myNotesInstance.geomCone, myNotesInstance.matDef.clone() ); 
		
		obj.userData.tag = 'noteTextPoint';
		obj.userData.id = this.indPoint;
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.set(pos.x, pos.y, pos.z);		
		scene.add( obj );
		
		this.indPoint++;

		return obj;
	}
	
	// линия 
	crLine({points})
	{		
		let line = null;
		
		if(!points[0].userData.line)
		{	
			const arrP = [];
			
			for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
			const geometry = new THREE.Geometry();
			geometry.vertices = arrP;
	
			line = new THREE.Line( geometry, myNotesInstance.matDef.clone() );	
			scene.add( line );					
		}
		else
		{
			line = points[0].userData.line;			
		}
		
		for ( let i = 0; i < points.length; i++ )
		{				
			points[i].userData.line = line;
			points[i].userData.points = points;
			
			this.changeGeometryPoint({point: points[i], type: 'cone'});	// заменяем geometry точки на стрелку
		}
		
		this.setRotCone({points});		
		
		const sprite = myNoteTextSprite.show({points});
		line.userData.sprite = sprite;
	}


	// обновляем линию линейки
	upGeometryLine({point})
	{		
		const line = this.getLineFromPoint({point});
		if(!line) return;
		
		const points = this.getPointsFromPoint({point});

		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		
		const geometry = new THREE.Geometry();
		geometry.vertices = arrP;
		//geometry.verticesNeedUpdate = true;
		
		line.geometry.dispose();
		line.geometry = geometry;
		
		this.setRotCone({points});
		
		const sprite = myNoteTextSprite.getSpriteFromPoint({point});
		if(sprite) myNoteTextSprite.upSprite({sprite});		
	}


	// поворачиваем конусы(стерлки) с учетом расположения линии
	setRotCone({points})
	{
		const p1 = points[0];
		const p2 = points[points.length - 1];
		
		p1.lookAt(p2.position);
		p2.lookAt(p1.position);
	}
	

	// получаем массив точек из точки
	getPointsFromPoint({point})
	{
		return point.userData.points;		
	}
	
	// получаем линию из точки
	getLineFromPoint({point})
	{
		return point.userData.line;		
	}	

	// назначаем tag для точек, когда превращаем их из tool в линейку
	setPointsTextTag({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'noteTextPoint';
		}		
	}
	
	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	
		
		this.actObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		

		this.activateNoteText({obj});
		
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

		this.upGeometryLine({point: obj});		
	}	
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}


	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	
	activateNoteText({obj})
	{
		this.setColorNoteText({obj, color: myNotesInstance.actColor});
	}
	
	deActivateNoteText({obj})
	{
		this.setColorNoteText({obj, color: myNotesInstance.defColor});
	}	
	
	
	// получаем структуру data (для создания, удаления, выделения) линийки
	getStructure({obj})
	{
		let detect = false;
		const structure = { tag: 'noteText', points: [], line: null };
		
		if(obj.userData.tag === 'noteTextPoint')
		{
			detect = true;
			structure.points = this.getPointsFromPoint({point: obj});
			structure.line = this.getLineFromPoint({point: obj});
			structure.sprite = myNoteTextSprite.getSpriteFromPoint({point: obj});
		}

		return (!detect) ? null : structure;
	}
	
	
	// ставим цвет для линейки
	setColorNoteText({obj, color})
	{
		const structure = this.getStructure({obj});		
		if(!structure) return;
		
		const points = structure.points;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			points[i].material.color = new THREE.Color(color);
		}
		
		structure.line.material.color = new THREE.Color(color);
	}
	

	// заменяем geometry точки на точку или стрелку
	changeGeometryPoint({point, type = 'cone'})
	{
		if(type === 'cone')
		{
			point.geometry = myNotesInstance.geomCone;
		}
		if(type === 'point')
		{
			point.geometry = myNotesInstance.geomPoint;
		}		
	}
	
	
	deleteNoteText({obj})
	{
		const structure = this.getStructure({obj});
		if(!structure) return;
		
		myNotes.deleteDataNote({data: structure});
		
		const points = structure.points;
		const line = structure.line;
		const sprite = structure.sprite;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			scene.remove(points[i]);
		}
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
		
		myNoteTextSprite.deleteSprite({points});			
	}


}







