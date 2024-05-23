
// создание сетки для теплого пола, через кнопку
class MyGridPointMove 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;
	

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
		
		obj.position.add(offset);
		
		const newPos = this.pointAligning({point: obj});
		this.offset.add(newPos.clone().sub(obj.position));
		obj.position.copy(newPos);		

		myGrids.upGeometryLine({point: obj});
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


	// выравнивание точки к направляющим X/Z
	pointAligning({point})
	{
		let pos = point.position.clone();
		const points = myGrids.getPointsFromPoint({point});
		const axisX = [];
		const axisZ = [];
		
		for ( let i = 0; i < points.length; i++ )
		{
			if(point === points[i]) continue;
			
			const A = points[i].position;
			const B1 = points[i].position.clone().add(new THREE.Vector3(1,0,0));
			const B2 = points[i].position.clone().add(new THREE.Vector3(0,0,1));
			const C = point.position;			
			
			const p1 = myMath.mathProjectPointOnLine2D({A, B: B1, C});	
			const p2 = myMath.mathProjectPointOnLine2D({A, B: B2, C});
			
			const x = Math.abs( points[i].position.x - p1.x );
			const z = Math.abs( points[i].position.z - p2.z );
			
			if(x < 0.06 / camera.zoom) { axisX.push({dist: 0, pos: points[i].position}); }
			if(z < 0.06 / camera.zoom) { axisZ.push({dist: 0, pos: points[i].position}); }	
		}

		
		if(axisX.length > 0)
		{
			for ( let i = 0; i < axisX.length; i++ ) axisX[i].dist = point.position.distanceTo(axisX[i].pos);			
			axisX.sort(function (a, b) { return a.dist - b.dist; });		 
		} 
		
		if(axisZ.length > 0)
		{
			for ( let i = 0; i < axisZ.length; i++ ) axisZ[i].dist = point.position.distanceTo(axisZ[i].pos);			
			axisZ.sort(function (a, b) { return a.dist - b.dist; });		
		}
		
		if(axisX.length > 0 && axisZ.length > 0) 
		{ 
			pos.x = axisX[0].pos.x; 
			pos.z = axisZ[0].pos.z; 		 
		}
		else if(axisX.length > 0) pos.x = axisX[0].pos.x;
		else if(axisZ.length > 0) pos.z = axisZ[0].pos.z;		
		
		return pos;
	}
}







