
// инструмент для установки выхода труб
class MyGeneratorWFToolP 
{
	isDown = false;
	isMove = false;
	toolObj = null;	
	actObj = null;
	
	helpLines = [];	// временное, потом удалить
	
	
	constructor()
	{
		this.toolObj = this.crPoint({pos: new THREE.Vector3()});
		
		this.helpLines = this.testLines();
	}
	
	crPoint({pos})
	{
		const geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000, lightMap: lightMap_1 });		
		const obj = new THREE.Mesh( geometry, material ); 

		obj.userData.tag = 'arrowContourWf';
		obj.position.copy(pos);		
		scene.add( obj );

		return obj;
	}
	
	
	
	testLines()
	{
		const lines = [];
		
		for ( let i = 0; i < 2; i++ )
		{
			const geometry = new THREE.Geometry();
			geometry.vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)];
			
			const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
			
			const line = new THREE.Line( geometry, material );
			scene.add(line);

			lines.push(line);
		}
		
		return lines;
	}
	
	testGeometryLines({pos, normal})
	{
		const lines = this.helpLines;
		
		for ( let i = 0; i < lines.length; i++ )
		{
			lines[i].geometry.dispose();
			
			const geometry = new THREE.Geometry();
			geometry.vertices = [pos.clone(), pos.clone().add(normal)];
			
			lines[i].geometry = geometry;
		}
		
		return lines;
	}	
	
	
	// проверка куда кликнули
	clickRayhit({event})
	{
		let rayhit = null;		
		
		if(this.toolObj)
		{
			const ray = rayIntersect( event, this.toolObj, 'one' );
			if(ray.length > 0) { rayhit = ray[0]; }			
		}

		return rayhit;
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

		//myComposerRenderer.outlineAddObj({arr: [obj]});
		//myPanelR.myContentObj.activeObjRightPanelUI_1({obj}); 	// UI
		
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
		
		//obj.position.add( offset );

		const { newPos, dir } = this.setToolObj({startPos: intersects[0].point});
		
		//const arrP = myWarmFloor.myGridContourWf.getActContourPointsPos();		
		//const formSteps = myWarmFloor.myUlitkaWf.drawFrom({points: arrP, offsetStart: -0.2, offsetNext: -0.3});				
		//myWarmFloor.myJoinContourWf.joinForms({startPos: newPos.clone(), dir, formSteps});
	}
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}
	
	
	getPosToolObj()
	{
		const obj = this.toolObj;
		if(!obj) return;
		
		return obj.position.clone();
	}
	
	// ставим стрелку на контур в зависимости от ближайшей грани 
	setToolObj({startPos, actDataGrid = null})
	{
		if(actDataGrid) this.actDataGrid = actDataGrid;
		
		let newPos = new THREE.Vector3();
		let dir = null;
		const obj = this.toolObj;
		
		const arrP = [];
		let v = this.getActContourPointsPos();
		v = [...v];
		v.push(v[0]);
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			const onLine = this.checkPointOnLine(v[i], v[i + 1], startPos);
			
			if(onLine)
			{
				const dist = pos.distanceTo(startPos);
				const normal = this.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
				arrP.push({pos, dist, normal});				
			}
		}
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; });
			obj.position.copy(arrP[0].pos);
			newPos = arrP[0].pos.clone();
			dir = arrP[0].normal;
			
			this.testGeometryLines({pos: arrP[0].pos, normal: arrP[0].normal});
		}
		
		obj.position.copy(newPos);
		
		

		return { newPos, dir };
	}


	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	render()
	{
		renderCamera();
	}


	//-------
	
	// получаем точки активного контура
	getActContourPointsPos()
	{
		if(!this.actDataGrid) return;
		
		const points = this.actDataGrid.points;
				
		const arrPos = [];		
		for ( let i = 0; i < points.length; i++ ) arrPos.push(points[i].position.clone());

		return arrPos;		
	}


	// опредяляем, надодится точка D за пределами прямой или нет (точка D пересекает прямую АВ, идущая перпендикулярна от точки С)  
	checkPointOnLine(A,B,C)
	{	
		let AB = { x : B.x - A.x, y : B.z - A.z };
		let CD = { x : C.x - A.x, y : C.z - A.z };
		const r1 = AB.x * CD.x + AB.y * CD.y;				// скалярное произведение векторов

		AB = { x : A.x - B.x, y : A.z - B.z };
		CD = { x : C.x - B.x, y : C.z - B.z };
		const r2 = AB.x * CD.x + AB.y * CD.y;

		const cross = (r1 < 0 | r2 < 0) ? false : true;	// если true , то точка D находится на отрезке AB	
		
		return cross;
	}


	// перпендикуляр линии (2D)
	calcNormal2D({p1, p2, reverse = false})
	{
		let x = p1.z - p2.z;
		let z = p2.x - p1.x;

		// нормаль вывернуть в обратное напрвление
		if(reverse)
		{
			x *= -1;
			z *= -1;
		}
		
		return new THREE.Vector3(x, 0, z).normalize();								
	}	
	
	// проекция точки(С) на прямую (A,B) (2D)
	mathProjectPointOnLine2D({A,B,C})
	{
		const x1 = A.x;
		const y1 = A.z; 
		const x2 = B.x; 
		const y2 = B.z; 
		const x3 = C.x; 
		const y3 = C.z;
		
		const px = x2 - x1;
		const py = y2 - y1; 
		const dAB = px * px + py * py;
		
		const u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
		const x = x1 + u * px;
		const z = y1 + u * py;
		
		return new THREE.Vector3(x, 0, z); 
	} 	
}







