
// инструмент для установки выхода труб
class MyGeneratorWFToolP 
{
	posY = infProject.settings.grid.pos.y;
	isDown = false;
	isMove = false;
	toolObj = null;	
	actObj = null;
	
	dirLine = null;
	
	
	init()
	{
		this.toolObj = this.crTool();
		
		this.dirLine = this.crDirLine();
	}
	
	// создание инструмента стрелка
	crTool()
	{
		const arrP = [];
		arrP.push(new THREE.Vector2(0, 0));
		arrP.push(new THREE.Vector2(-0.5, 0.5));
		arrP.push(new THREE.Vector2(-0.3, 0.5));
		arrP.push(new THREE.Vector2(-0.3, 1.5));
		
		arrP.push(new THREE.Vector2(0.3, 1.5));
		arrP.push(new THREE.Vector2(0.3, 0.5));
		arrP.push(new THREE.Vector2(0.5, 0.5));
		
		for ( let i = 0; i < arrP.length; i++ ) 
		{  
			arrP[i].x /= 4;	
			arrP[i].y /= 4;			
		}	 
		
		const shape = new THREE.Shape( arrP );
		//const geometry = new THREE.ShapeGeometry( shape );
		const geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: 0.01 } );
		geometry.rotateX(-Math.PI / 2);
		
		const material = new THREE.MeshLambertMaterial({ color: 'rgb(17, 255, 0)', lightMap: lightMap_1, depthTest: false, transparent: true });
		
		const obj = new THREE.Mesh(geometry, material); 
		obj.userData.tag = 'arrowContourWf';
		obj.position.set( 0, infProject.settings.floor.posY, 0 );
		obj.visible = false;

		scene.add(obj);
		
		return obj;
	}
	
	
	// линия для показа направления куда повернута точка
	crDirLine()
	{		
		const geometry = new THREE.Geometry();
		geometry.vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)];
		
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
		
		const line = new THREE.Line( geometry, material );
		line.visible = false;
		scene.add(line);
		
		return line;
	}
	
	dirLineGeometry({pos, normal})
	{
		const line = this.dirLine;
		
		line.geometry.dispose();
		
		const geometry = new THREE.Geometry();
		geometry.vertices = [pos.clone(), pos.clone().add(normal.clone().multiplyScalar(0.3))];
		
		line.geometry = geometry;
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
		
		// точки выхода и разрыв линий контуров
		if(myGeneratorWF.dataWF)
		{
			const dataWF = myGeneratorWF.dataWF;
			const type = dataWF.type;
			const contours = dataWF.contours;
			const sizeCell = dataWF.sizeCell;
			const pGrid = dataWF.pGrid;
			
			
			if(type === 'ulitka')
			{
				myGeneratorWFUlitka.crExits({newPos: newPos.clone(), dir, contours, sizeCell});
			}
			else
			{
				myGeneratorWFZmyka.detectCrossLines({startPos: newPos.clone(), dir, contours, pGrid});
			}		
		}		
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
	setToolObj({startPos})
	{		
		const dataWF = myGeneratorWF.dataWF;
		if(!dataWF) return;
		
		const pGrid = dataWF.pGrid;
		
		let newPos = new THREE.Vector3();
		let dir = null;
		const obj = this.toolObj;
		
		const arrP = [];
		
		const v = [...pGrid];
		v.push(v[0]);
		
		
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const dist = v[i].distanceTo(startPos);
			const pos = v[i].clone().sub(startPos);
			
			pos.y = this.posY;
			
			const normal = pos.normalize();
			arrP.push({pos: v[i], dist, normal});					
		}
		
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], startPos);
			if(!onLine) continue;
			
			pos.y = this.posY;
			
			const dist = pos.distanceTo(startPos);
			const normal = myMath.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
			arrP.push({pos, dist, normal});				
		}
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; });
			obj.position.copy(arrP[0].pos);
			newPos = arrP[0].pos.clone();
			dir = arrP[0].normal;

			const angle = Math.atan2(dir.x, dir.z);
			obj.rotation.set(0, angle, 0);
			
			this.dirLineGeometry({pos: arrP[0].pos, normal: arrP[0].normal});
		}
		
		obj.position.copy(newPos);		
		
		return { newPos, dir };
	}
	
	
	showToolP()
	{
		this.toolObj.visible = true;		
		this.dirLine.visible = true;		
	}
	
	hideToolP()
	{
		this.toolObj.visible = false;		
		this.dirLine.visible = false;		
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


}







