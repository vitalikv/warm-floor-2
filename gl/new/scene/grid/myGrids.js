
// создание сетки для теплого пола
class MyGrids 
{
	indGrid = 0;
	indPoint = 0;
	dataGrids = [];
	geomPoint;
	matPoint;
	defColorPointNumber = 0x222222;
	actColorPointNumber = 0xff0000;
	defColorLineNumber = 0x222222;
	actColorLineNumber = 0xff0000;	
	posY = 0;
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.05, 16, 16 );
		this.matPoint = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColorPointNumber), transparent: true, depthTest: false, lightMap: lightMap_1 });
		
		this.posY = infProject.settings.grid.pos.y;
	}
	
	// точка для контура
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint.clone() ); 

		obj.userData.tag = 'gridPointWf';
		obj.userData.id = this.indPoint;
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.set(pos.x, this.posY, pos.z);		
		scene.add( obj );
		
		this.indPoint++;

		return obj;
	}
	
	// линия для контура
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

	
	// создание нового контура
	crGrid({points, sizeCell = 0.2, offset = new THREE.Vector2(0, 0), modeLink = false})
	{
		this.setPointsClockWise({points});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'gridPointWf';
			points[i].userData.points = points;
			points[i].visible = false;
		}
		 
		const grille = myGridMesh.upGridMeshes({dataGrid: {points, grille: {sizeCell, offset, modeLink}} }); 
		
		console.log(points.map(p => p.userData.id));
		
		const dataGrid = {id: this.indGrid, points, grille};
		this.dataGrids.push(dataGrid);
		
		myGridActivate.setColorMeshGrid({dataGrid});
		
		this.indGrid++;
	}
	
	
	// меняем построение точек в против часавой
	setPointsClockWise({points})
	{
		const arrPos = [];		
		for ( let i = 0; i < points.length; i++ ) arrPos.push(points[i].position.clone());
		
		const result = myMath.checkClockWise(arrPos);	// проверяем последовательность построения точек (по часовой стрелке или нет)
		// если по часовой стрелки, то разворачиваем массив, чтобы был против часовой
		if(result < 0) points.reverse();			
	}
	

	// обновляем линию контура
	upGeometryLine({point})
	{		
		const line = this.getLineFromPoint({point});
		if(!line) return;
		
		const points = this.getPointsFromPoint({point});

		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		if(point.userData.tag !== 'gridPointToolWf') arrP.push(points[0].position.clone());
		
		const geometry = new THREE.Geometry();
		geometry.vertices = arrP;
		//geometry.verticesNeedUpdate = true;
		
		line.geometry.dispose();
		line.geometry = geometry;	
	}	

	
	// определяем кликну ли на точку контура
	clickRayhit({event})
	{
		let rayhit = null;
		
		const points = [];
		for ( let i = 0; i < this.dataGrids.length; i++ )
		{
			const pointsV = this.dataGrids[i].points.filter((p) => p.visible);
			points.push(...pointsV);
		}		
		
		const ray = rayIntersect( event, points, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }

		return rayhit;
	}
	
	
	// определяем кликнули контуру или ищем контур при перетаскивании точки трубы
	mouseDetectContour({event, click = false})
	{
		let dataGrid = null;

		if(click)
		{
			planeMath.position.set( 0, 0, 0 );
			planeMath.rotation.set(-Math.PI/2, 0, 0);
			planeMath.updateMatrixWorld();			
		}
		
		const intersects = rayIntersect(event, planeMath, 'one');
		
		if(intersects.length > 0)
		{
			for ( let i = 0; i < this.dataGrids.length; i++ )
			{
				const inside = myMath.checkPointInsideForm({point: intersects[0].point, arrP: this.getPointsFromDataGrid({dataGrid: this.dataGrids[i]})});	
				if(inside) 
				{
					dataGrid = this.dataGrids[i];
					break;
				}
			}							
		}	

		return dataGrid;
	}	
	
	
	// заворачиваем dataGrid в объект (нужно для выделения)
	getDataGridForRyahit(dataGrid)
	{
		return {object: { dataGrid, userData: {tag: 'dataGrid'} }};
	}

	
	// получаем сетку которая относится к этой точке
	getDataGridFromPoint({point})
	{
		let data = null;
		
		for ( let i = 0; i < this.dataGrids.length; i++ )
		{
			const index = this.dataGrids[i].points.indexOf(point);
			if (index > -1)
			{
				data = this.dataGrids[i];
				break;
			}
		}
		
		return data;		
	}


	// получаем массив точек из dataGrid
	getPointsFromDataGrid({dataGrid})
	{
		return dataGrid.points ? dataGrid.points : [];		
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
	
	
	// получаем массив линий (обрешетка)
	getGridMeshes({dataGrid})
	{
		return dataGrid.grille.meshes;
	}	
	
	getModeOffset({dataGrid})
	{
		return dataGrid.grille.modeOffset;
	}	

	
	getModeLink({dataGrid})
	{
		return dataGrid.grille.modeLink;
	}

	// вкл/выкл режим смещения сетки
	setModeOffset({dataGrid, act = false})
	{
		dataGrid.grille.modeOffset = act;

		myGridActivate.setColorMeshGrid({dataGrid, act});
	}

	// вкл/выкл привязка точки трубы к сетке
	setModeLink({dataGrid, act = false})
	{
		dataGrid.grille.modeLink = act;

		myGridActivate.setColorMeshGrid({dataGrid});
	}	

	// удаление одной точки
	deletePoint({point})
	{
		const points = this.getPointsFromPoint({point});
		scene.remove(point);
		
		const index = points.indexOf(point);
		if (index > -1) points.splice(index, 1);

		// если в контуре стеки меньше 3 точек, то удаляем сетку
		if(points.length < 3)
		{
			const line = this.getLineFromPoint({point: points[0]});
			this.deleteLine({line});
			
			const dataGrid = this.getDataGridFromPoint({point: points[0]});
			
			const meshes = this.getGridMeshes({dataGrid});
			myGridMesh.deleteGridMeshes({meshes});
			
			this.deleteDataGrid({dataGrid});
			
			this.deletePoints({points});
		}
		else
		{
			this.upGeometryLine({point: points[0]});
			
			// обновление обрешетки
			myGridMesh.upGridMeshFromPoint({point: points[0]});			
		}
	}


	// удаляем сетку (с обрешеткой, точками, линиями и из бд) по кнопке или по клавише delete
	deleteGrid({dataGrid = null})
	{
		if(!dataGrid) dataGrid = myGridActivate.getActDataGrid();
		if(!dataGrid) return;	 	
		
		const points = myGrids.getPointsFromDataGrid({dataGrid}); 
		
		const line = myGrids.getLineFromPoint({point: points[0]});
		myGrids.deleteLine({line});

		const meshes = myGrids.getGridMeshes({dataGrid});
		myGridMesh.deleteGridMeshes({meshes});			
		
		myGrids.deleteDataGrid({dataGrid});
		
		myGrids.deletePoints({points}); 
		
		renderCamera();
	}
	

	// удаление всех точек одной сетки
	deletePoints({points})
	{		
		for ( let i = points.length - 1; i > -1; i-- )
		{
			scene.remove(points[i]);
			const index = points.indexOf(points[i]);
			if (index > -1) points.splice(index, 1);			
		}
	}


	deleteLine({line})
	{
		line.geometry.dispose();
		scene.remove(line);
	}
	
	
	deleteDataGrid({dataGrid})
	{
		for ( let i = 0; i < this.dataGrids.length; i++ )
		{
			const index = this.dataGrids.indexOf(dataGrid);
			if (index > -1) 
			{
				myGridActivate.deActivateDataGrid({dataGrid});
				
				this.dataGrids.splice(index, 1);
				break;
			}
		}
	}
	
	

}







