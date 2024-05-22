
// 
class MyGridsSaveLoad 
{	
	saveGrids()
	{
		const data = [];
		
		const points = [];
		for ( let i = 0; i < myGrids.dataGrids.length; i++ )
		{
			const pos = myGrids.dataGrids[i].points.map((p) => p.position);
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
				const point = myGrids.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				points.push(point);
			}
			
			myGrids.crLine({points});
			myGrids.upGeometryLine({point: points[0]});
			
			myGrids.crGrid({points});
		}
		
		return data;
	}	
}







