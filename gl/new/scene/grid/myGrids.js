
// создание сетки для теплого пола
class MyGrids 
{
	dataGrids = [];
	geomPoint;
	matPoint;
	colorPoint;
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.05, 16, 16 );
		this.colorPoint = new THREE.Color(0x222222);
		this.matPoint = new THREE.MeshLambertMaterial({ color: this.colorPoint, lightMap: lightMap_1 });
	}
	
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint.clone() ); 

		obj.userData.tag = 'gridPointWf';
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.copy(pos);		
		scene.add( obj );

		return obj;
	}
	
	
	crLine({points})
	{
		
		let line = null;
		
		if(!points[0].userData.line)
		{	
			const arrP = [];
			
			for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
			const geometry = new THREE.Geometry();
			geometry.vertices = arrP;
	
			line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000}) );	
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


	crGrid({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'gridPointWf';
			points[i].userData.points = points;
		}
		
		this.dataGrids.push({points});
	}

	upGeometryLine({point})
	{		
		const line = point.userData.line;
		if(!line) return;
		
		const points = point.userData.points;

		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		if(point.userData.tag !== 'gridPointToolWf') arrP.push(points[0].position.clone());
		
		var geometry = new THREE.Geometry();
		geometry.vertices = arrP;
		//geometry.verticesNeedUpdate = true;
		
		line.geometry.dispose();
		line.geometry = geometry;	
	}	


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
	

	// удаление одной точки
	deletePoint({point})
	{
		const points = this.getPointsFromPoint({point});
		scene.remove(point);
		
		const index = points.indexOf(point);
		if (index > -1) points.splice(index, 1);

		if(points.length < 3)
		{
			const line = this.getLineFromPoint({point: points[0]});
			this.deleteLine({line});
			
			const dataGrid = this.getDataGridFromPoint({point: points[0]});
			this.deleteDataGrid({dataGrid});
			
			this.deletePoints({points});
		}
		else
		{
			this.upGeometryLine({point: points[0]});
		}
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
				this.dataGrids.splice(index, 1);
				break;
			}
		}
	}
	
	

}







