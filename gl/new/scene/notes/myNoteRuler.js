
// 
class MyNoteRuler
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;

	indPoint = 0;
	geomPoint;
	matPoint;
	defColorPointNumber = 0x222222;
	defColorLineNumber = 0x000000;
	posY = 0;

	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.02, 16, 16 );
		this.matPoint = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColorPointNumber), transparent: true, depthTest: false, lightMap: lightMap_1 });
		
		this.posY = infProject.settings.grid.pos.y;
	}	
	
	crObj({pos})
	{
		this.crPoint({pos: pos[0]});
		this.crPoint({pos: pos[1]});
	}
	

	// точка
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint.clone() ); 

		obj.userData.tag = 'noteRulerPoint';
		obj.userData.id = this.indPoint;
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.set(pos.x, this.posY, pos.z);		
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
	
			line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: this.defColorLineNumber, lightMap: lightMap_1}) );	
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

	mousedown = ({event, dataGrid}) =>
	{
		const meshes = myGrids.getGridMeshes({dataGrid});
		const points = dataGrid.points;		
		if(meshes.length === 0) return;
		
		if(!myGrids.getModeOffset({dataGrid})) return;
		
		this.isDown = false;
		this.isMove = false;	
		
		this.actObj = dataGrid;
		
		planeMath.position.set( 0, points[0].position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		
		
		this.isDown = true;

		return this.actObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		this.isMove = true;
		
		const dataGrid = this.actObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		myGridMesh.offsetGridMeshes({dataGrid, offset: new THREE.Vector2(offset.x, offset.z), upCross: false});
		//obj.position.add(offset);		

		//myGrids.upGeometryLine({point: obj});
		
		// обновление обрешетки
		//myGridMesh.upGridMeshFromPoint({point: obj, upCross: false});
	}
	
	mouseup = () =>
	{
		const dataGrid = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		if(dataGrid) myGridMesh.offsetGridMeshes({dataGrid, offset: new THREE.Vector2(0, 0), upCross: true});
		
		this.clearPoint();		
	}


	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
}







