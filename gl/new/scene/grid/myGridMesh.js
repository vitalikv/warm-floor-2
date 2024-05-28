
// обрешетка
class MyGridMesh 
{	
	// создание или обновление (через удаление старой) обрешетки
	upGridMeshes({points, meshes = null, sizeCell = 0.2})
	{
		const arrPos = points.map(p => p.position.clone());
		arrPos.push(arrPos[0]);

		const result = this.calcBoundGrid({arrPos});

		const arrLines = this.calcLinesGrid({x: result.x, z: result.z, centerPos: result.centerPos, sizeCell});
		
		const arrVectors = this.calcVectorsLines({arrLines, arrPos});	// массив линий с точками

		if(meshes) this.deleteGridMeshes({meshes});	
		
		meshes = this.crGridMeshes({arrVectors});
			
		return { meshes, arrVectors, sizeCell };
	}
	
	
	// создание обрешетки
	crGridMeshes({arrVectors})
	{
		const meshes = [];
		
		for ( let i = 0; i < arrVectors.length; i++ )
		{	
			const geometry = new THREE.Geometry();
			geometry.vertices = [arrVectors[i][0].clone(), arrVectors[i][1].clone()];
			const line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000}) );	
			scene.add( line );
			meshes.push(line);
		}

		return meshes;
	}
	

	// расчитываем box по форме
	calcBoundGrid({arrPos})
	{
		const bound = { min : { x : Infinity, z : Infinity }, max : { x : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < arrPos.length; i++)
		{
			if(arrPos[i].x < bound.min.x) { bound.min.x = arrPos[i].x; }
			if(arrPos[i].x > bound.max.x) { bound.max.x = arrPos[i].x; }			
			if(arrPos[i].z < bound.min.z) { bound.min.z = arrPos[i].z; }
			if(arrPos[i].z > bound.max.z) { bound.max.z = arrPos[i].z; }		
		}
		
		const centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), 0, ((bound.max.z - bound.min.z)/2 + bound.min.z));
		const x = (bound.max.x - bound.min.x);
		const y = 0.5;
		const z = (bound.max.z - bound.min.z);	

		const heplBox = false;
		
		if(heplBox)
		{
			const geometry = new THREE.BoxGeometry(x, y, z);
			const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, depthTest: false });			
			const box = new THREE.Mesh( geometry, material );
			box.position.add(centerPos);
			scene.add(box);			
		}

		return {x, z, centerPos};
	}


	// рассчет прямоугольной сетки из линий
	calcLinesGrid({x, z, centerPos, sizeCell})
	{
		let size = sizeCell;	// размер ячейки
		
		const countX = Math.floor(x/size);
		const countZ = Math.floor(z/size);
		
		const ofssetX = (countX * size) / 2;
		const ofssetZ = (countZ * size) / 2;
		
		const arrLines = [];
		const help = false;		// показываем линии (help)
		
		
		for ( let i = 0; i <= countX; i ++ ) 
		{		
			const v1 = new THREE.Vector3(0,0,0).add(centerPos).add(new THREE.Vector3(( i * size ) - ofssetX, 0, -z/2));
			const v2 = new THREE.Vector3(0,0,z).add(centerPos).add(new THREE.Vector3(( i * size ) - ofssetX, 0, -z/2));
			arrLines.push({dir: 'z', points: [v1.clone(), v2.clone()]});
		}
		
		for ( let i = 0; i <= countZ; i ++ ) 
		{
			
			const v1 = new THREE.Vector3(0,0,0).add(centerPos).add(new THREE.Vector3(-x/2, 0, ( i * size ) - ofssetZ));
			const v2 = new THREE.Vector3(x,0,0).add(centerPos).add(new THREE.Vector3(-x/2, 0, ( i * size ) - ofssetZ));
			arrLines.push({dir: 'x', points: [v1.clone(), v2.clone()]});
		}

		if(help)
		{
			for ( let i = 0; i < arrLines.length; i++ )
			{
				const v1 = arrLines[i].points[0].clone();
				const v2 = arrLines[i].points[1].clone();
				
				const geometry = new THREE.Geometry();
				geometry.vertices = [v1, v2];
				const line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000}) );	
				scene.add( line );							
			}			
		}

		return arrLines;
	}
	
	
	// рассчет окончательной сетки из линий
	calcVectorsLines({arrLines, arrPos})
	{
		const arrVectors = [];
		
		for ( let i = 0; i < arrLines.length; i++ )
		{
			// линия должна быть чуть длиние, чтобы выходила за контру (так лучше для расчета)
			const dir = (arrLines[i].dir === 'x') ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
			const p1 = arrLines[i].points[0].clone().sub(dir);	
			const p2 = arrLines[i].points[1].clone().add(dir);
			
			// точки пересечения одной линии сетки с контуром (точек может быть больше 2)
			const arrPos2 = [];		 			
			for ( let i2 = 0; i2 < arrPos.length - 1; i2++ )
			{
				const cross = myMath.checkCrossLine(p1, p2, arrPos[i2], arrPos[i2+1]);
				
				if(cross)
				{
					//const pt = myMath.intersectionTwoLines_1({line1: {start: p1, end: p2}, line2: {start: arrPos[i2], end: arrPos[i2+1]}});
					const pt = myMath.intersectionTwoLines_2(p1, p2, arrPos[i2], arrPos[i2+1]);
					arrPos2.push(pt);
				}
			}
			
			// сортировка нужна, чтобы потом правильно найти центры между точками
			// для этого сортируем, чтобы они шли последовательно друг за другом
			if(arrLines[i].dir === 'x') arrPos2.sort(function (a, b) { return a.x - b.x; });
			if(arrLines[i].dir === 'z') arrPos2.sort(function (a, b) { return a.z - b.z; });
			
			const arrlinePos = [];
			
			const helpPoints_1 = false;	// точки пересечения линии с контуром
			const helpPoints_2 = false;	// точки центров линий
			
			if(arrPos2.length > 1) 
			{
				if(helpPoints_1)
				{
					for ( let i2 = 0; i2 < arrPos2.length; i2++ )
					{	
						const obj = new THREE.Mesh( myGrids.geomPoint, myGrids.matPoint.clone() );
						obj.position.copy(arrPos2[i2]);
						scene.add(obj);						
					}					
				}
				
				for ( let i2 = 0; i2 < arrPos2.length - 1; i2++ )
				{	
					const centerPos = arrPos2[i2+1].clone().sub(arrPos2[i2]).divideScalar( 2 ).add(arrPos2[i2]);
					arrlinePos.push({centerPos, points: [arrPos2[i2], arrPos2[i2+1]]});					
				}
				
				if(helpPoints_2)
				{
					for ( let i2 = 0; i2 < arrlinePos.length; i2++ )
					{	
						const obj = new THREE.Mesh( myGrids.geomPoint, myGrids.matPoint.clone() );
						obj.position.copy(arrlinePos[i2].centerPos);
						scene.add(obj);						
					}					
				}				
			}

			// после сортировки arrPos2, мы знаем правильный центр линий 
			// удаляем прямые, у которых центр за придела контура
			for ( let i2 = arrlinePos.length - 1; i2 > -1; i2-- )
			{	
				const inside = myMath.checkPointInsideForm({point: arrlinePos[i2].centerPos, arrP: arrPos});				
				if(!inside) arrlinePos.splice(i2, 1);
			}
			
			for ( let i2 = 0; i2 < arrlinePos.length; i2++ )
			{	
				arrVectors.push([arrlinePos[i2].points[0], arrlinePos[i2].points[1]]);							
			}			
		}
		
		return arrVectors;
	}


	// обновление обрешетки по одной точки из контура
	upGridMeshFromPoint({point})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});
		
		if(dataGrid)
		{
			const points = myGrids.getPointsFromPoint({point});
			const meshes = dataGrid.grille.meshes;
			const sizeCell = dataGrid.grille.sizeCell;
			
			const result = this.upGridMeshes({points, meshes, sizeCell});
			dataGrid.grille.meshes = result.meshes;
			dataGrid.grille.v = result.arrVectors;
		}		
	}

	// удаление обрешетки
	deleteGridMeshes({meshes})
	{
		for ( let i = 0; i < meshes.length; i++ )
		{	
			meshes[i].geometry.dispose();
			scene.remove(meshes[i]);
		}
	}	
}







