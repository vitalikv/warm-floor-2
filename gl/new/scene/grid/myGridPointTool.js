
// создание сетки для теплого пола, через кнопку
class MyGridPointTool 
{
	arrPoints = [];
	
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;
	
	
	constructor()
	{
		
	}
	
	addPointFromBtn({pos, event})
	{
		this.arrPoints = [];
		
		const obj = myGrids.crPoint({pos});
		obj.userData.tag = 'gridPointToolWf';
		
		this.arrPoints.push(obj);		
		
		this.mousedown({event, obj, clickBtn: true});
		
		return obj;
	}


	mousedown = ({event, obj, clickBtn = false}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		if(!clickBtn)
		{
			// определяем с чем точка пересеклась и дальнейшие действия
			const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
			if(joint) 
			{
				this.deletePoint({obj});
				this.clearPoint();
				console.log(this.arrPoints, [...obj.userData.points])
				myGrids.crGrid({points: this.arrPoints});
				
				return null;
			}
			else
			{
				obj = myGrids.crPoint({pos: obj.position.clone()});
				obj.userData.tag = 'gridPointToolWf';
				
				this.arrPoints.push(obj);		
				if(this.arrPoints.length > 1) myGrids.crLine({points: [...this.arrPoints]});				
			}
		}

		
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
		
		obj.position.add( offset );	
		
		const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
		if(joint)
		{
			obj.position.copy(this.arrPoints[0].position.clone());
			this.offset = obj.position.clone();
		}

		myGrids.upGeometryLine({point: obj});
	}
	
	mouseup = () =>
	{
				
	}
	
	
	// проверка, если перетаскиваемая точка находится рядом с первой точкой 
	checkJointToPoint({point, points})
	{
		let joint = false;
		
		if(points.length > 2)
		{
			joint = point.position.distanceTo(points[0].position) < 0.2 ? true : false;
		}

		return joint;
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
}







