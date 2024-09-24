
// 
class MyNoteRoulette
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;

	indPoint = 0;
	geomPoint;
	matDef;
	defColor = 0x000000;
	actColor = 0xff0000;
	

	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.02, 16, 16 );
		this.matDef = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), transparent: true, lightMap: lightMap_1 });
	}	
	
	

	// точка
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matDef.clone() ); 

		obj.userData.tag = 'noteRoulettePoint';
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
	
			line = new THREE.Line( geometry, this.matDef.clone() );	
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
		}
		
		//this.upGeometryLine({point: points[0]});
	}


	// обновляем линию контура
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


	// назначаем все точкам рулетки, массив точек
	setPointsForPoint({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.points = points;
		}		
	}


	// назначаем tag для точек, когда превращаем их из tool в линейку
	setPointsRouletteTag({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'noteRoulettePoint';
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

		this.activateNoteRoulette({obj});
		
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


	activateNoteRoulette({obj})
	{
		this.setColorNoteRoulette({obj, color: this.actColor});
	}
	
	deActivateNoteRoulette({obj})
	{
		this.setColorNoteRoulette({obj, color: this.defColor});
	}	
	

	// получаем структуру data (для создания, удаления, выделения) рулетки
	getStructure({obj})
	{
		let detect = false;
		const structureRuler = { tag: 'noteRoulette', points: [], line: null };
		
		if(obj.userData.tag === 'noteRoulettePoint')
		{
			detect = true;
			structureRuler.points = this.getPointsFromPoint({point: obj});
			structureRuler.line = this.getLineFromPoint({point: obj});
		}

		return (!detect) ? null : structureRuler;
	}
	

	// ставим цвет для линейки
	setColorNoteRoulette({obj, color})
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
	

	deleteNoteRoulette({obj})
	{
		const structure = this.getStructure({obj});
		if(!structure) return;
		
		myNotes.deleteDataNote({data: structure});
		
		const points = structure.points;
		const line = structure.line;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			scene.remove(points[i]);
		}
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
	}	
}







