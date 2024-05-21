
// создание сетки для теплого пола
class MyGrids 
{
	dataGrids = [];
	geomPoint;
	matPoint;
	
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.05, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
	}
	
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint ); 

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
	
	
	saveGrids()
	{
		const data = [];
		
		const points = [];
		for ( let i = 0; i < this.dataGrids.length; i++ )
		{
			const pos = this.dataGrids[i].points.map((p) => p.position);
			data.push({pos});
		}
		
		return data;
	}
	
	loadGrids({data})
	{
		const points = [];
		for ( let i = 0; i < data.length; i++ )
		{
			const arrPos = data[i].pos;
			const points = [];
			
			for ( let i2 = 0; i2 < arrPos.length; i2++ )
			{
				const pos = arrPos[i2];
				const point = this.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				points.push(point);
			}
			
			this.crLine({points});
			this.upGeometryLine({point: points[0]});
			
			this.crGrid({points});
		}
		
		return data;
	}	
}







