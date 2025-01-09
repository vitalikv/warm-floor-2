
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
		this.deleteToolContour();
		
		myGridSprite.hide();
		
		this.render();
	}	


	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		// определяем с чем точка пересеклась и дальнейшие действия
		const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
		
		// последнию точку замкнули на первой
		if(joint) 
		{
			let stop = false;
			
			myGridSprite.hide();
			
			// контур из одной точки нельзя построить, поэтому удаляем
			if(this.arrPoints.length === 2)
			{					
				this.deleteToolContour();
				stop = true;
			}
			else if(this.arrPoints.length === 3)	// контур из 2-х точек нельзя построить, поэтому не даем замкнуть и продолжаем построение
			{					
				stop = false;
			}				
			else	// замкнули контур, создаем grid
			{
				this.deletePoint({obj});
				this.clearPoint();
				
				myGrids.crGrid({points: this.arrPoints});
				stop = true;
			}
			
			if(stop) return null;
		}
		else
		{
			obj = myGrids.crPoint({pos: obj.position.clone()});
			obj.userData.tag = 'gridPointToolWf';
			
			this.arrPoints.push(obj);		
			if(this.arrPoints.length > 1) myGrids.crLine({points: [...this.arrPoints]});

			myGridSprite.hide();
			myGridSprite.show({points: this.arrPoints, loop: false});
		}

		
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
		
		// одна tool точка без линии (только что создана)
		if(!myGrids.getLineFromPoint({point: obj}))
		{
			// здесь сделать нахождение ближайшией линии уже построенных контуров ( также как hoverCursorLineWF() )
			// чтобы было прилипание и при клике this.mousedown(), добавлялась новая точка на контур
		}
		else
		{
			const newPos = myGridPointMove.pointAligning({point: obj});
			this.offset.add(newPos.clone().sub(obj.position));
			obj.position.copy(newPos);			
		}

		myGrids.upGeometryLine({point: obj});
		
		myGridSprite.upGridSprites();
	}
	
	mouseup = () =>
	{
				
	}
	
	
	// проверка, если перетаскиваемая точка находится рядом с первой точкой 
	checkJointToPoint({point, points})
	{
		let joint = false;
		
		if(points.length > 1)
		{
			const dist = point.position.distanceTo(points[0].position);
			joint = (dist < 0.1 / camera.zoom) ? true : false;
			//joint = point.position.distanceTo(points[0].position) < 0.2 ? true : false;	// без привязки к zoom камеры
		}

		return joint;
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


	// удаляем контур (который еще не замкнули и не превратили в сетку)
	deleteToolContour()
	{
		const points = this.arrPoints;
		const line = myGrids.getLineFromPoint({point: points[0]});;
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
		
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
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







