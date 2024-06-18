
// смещение обрешетки
class MyGridMeshOffset
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;
	

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







