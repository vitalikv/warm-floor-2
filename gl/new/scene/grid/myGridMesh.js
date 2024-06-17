
// обрешетка
class MyGridMesh 
{
	defColorNumber = 0x009dff;
	actColorNumber = 0xff0000;
	
	constructor()
	{
		
	}
	
	
	// создание или обновление (через удаление старой) обрешетки
	upGridMeshes({dataGrid, sizeCell, offset = new THREE.Vector2(0, 0), upCross = true})
	{
		const points = dataGrid.points;
		let meshes = (dataGrid.grille.meshes) ? dataGrid.grille.meshes : null;
		sizeCell = (sizeCell) ? sizeCell : dataGrid.grille.sizeCell;
		if(dataGrid.grille.offset) offset = dataGrid.grille.offset;
		const modeOffset = (dataGrid.grille.modeOffset) ? dataGrid.grille.modeOffset : false;
		
		const arrPos = points.map(p => p.position.clone());
		arrPos.push(arrPos[0]);
		
		const posY = arrPos[0].y;

		const result = this.calcBoundGrid({arrPos});
		
		const result2 = this.calcLinesGrid({x: result.x, z: result.z, centerPos: result.centerPos, sizeCell, offset});
		const arrLines = result2.arrLines;
		offset = result2.offset;
		
		const arrVectors = this.calcVectorsLines({arrLines, arrPos});	// массив линий с точками

		const crossP = (upCross) ? this.calcCrossPointLines({lines: arrVectors, sizeCell}) : [];
		
		let material = null;
		if(meshes) 
		{
			if(meshes.length > 0) material = meshes[0].material;
		
			this.deleteGridMeshes({meshes});
		}			
		
		meshes = this.crGridMeshes({arrVectors, posY, material});
			
		return { meshes, v: arrVectors, crossP, sizeCell, offset, modeOffset };
	}
	
	
	// создание обрешетки
	crGridMeshes({arrVectors, posY, material = null})
	{
		const meshes = [];
		if(!material) material = new THREE.LineBasicMaterial({color: this.defColorNumber});
		
		for ( let i = 0; i < arrVectors.length; i++ )
		{	
			const v1 = new THREE.Vector3(arrVectors[i][0].x, posY, arrVectors[i][0].z);
			const v2 = new THREE.Vector3(arrVectors[i][1].x, posY, arrVectors[i][1].z);
			
			const geometry = new THREE.Geometry();
			geometry.vertices = [v1, v2];
			const line = new THREE.Line( geometry, material );	
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
	calcLinesGrid({x, z, centerPos, sizeCell, offset = new THREE.Vector2(0, 0) })
	{
		let size = sizeCell;	// размер ячейки
		
		const countX = Math.floor(x/size);
		const countZ = Math.floor(z/size);
		
		let centerX = (countX * size) / 2;	// ширина от начала до конца сетки, деленная на 2
		let centerZ = (countZ * size) / 2;
		
		offset = this.calcOffsetLines({x, z, countX, countZ, size, offset });
		
		centerX -= offset.x;
		centerZ -= offset.y;
		
		const arrLines = [];
		const help = false;		// показываем линии (help)
		
		
		for ( let i = 0; i <= countX; i ++ ) 
		{		
			const v1 = new THREE.Vector3(0,0,0).add(centerPos).add(new THREE.Vector3(( i * size ) - centerX, 0, -z/2));
			const v2 = new THREE.Vector3(0,0,z).add(centerPos).add(new THREE.Vector3(( i * size ) - centerX, 0, -z/2));
			arrLines.push({dir: 'z', points: [v1.clone(), v2.clone()]});
		}
		
		for ( let i = 0; i <= countZ; i ++ ) 
		{			
			const v1 = new THREE.Vector3(0,0,0).add(centerPos).add(new THREE.Vector3(-x/2, 0, ( i * size ) - centerZ));
			const v2 = new THREE.Vector3(x,0,0).add(centerPos).add(new THREE.Vector3(-x/2, 0, ( i * size ) - centerZ));
			arrLines.push({dir: 'x', points: [v1.clone(), v2.clone()]});
		}

		if(help)
		{
			const obj = new THREE.Mesh( myGrids.geomPoint, myGrids.matPoint.clone() );
			obj.position.copy(centerPos);
			scene.add( obj );
			
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

		return { arrLines, offset };
	}


	// рассчет смещения линий обрешетки, чтобы линии всегда были в контуре
	calcOffsetLines({x, z, countX, countZ, size, offset})
	{
		let offsetX = offset.x;
		let offsetZ = offset.y;
		
		if(x < (countX * size + offsetX))
		{
			let countZaLimit = Math.floor(((countX * size + offsetX) - x) / size);
			countZaLimit += 1;			
			const dlinaOffset = countZaLimit * size;
			offsetX -= dlinaOffset;
		}
		else if(0 > offsetX)
		{
			let countZaLimit = Math.floor(Math.abs(offsetX) / size);			
			const dlinaOffset = countZaLimit * size;			
			offsetX += dlinaOffset;			
		}

		if(z < (countX * size + offsetZ))
		{
			let countZaLimit = Math.floor(((countZ * size + offsetZ) - z) / size);
			countZaLimit += 1;			
			const dlinaOffset = countZaLimit * size;
			offsetZ -= dlinaOffset;
		}
		else if(0 > offsetZ)
		{
			let countZaLimit = Math.floor(Math.abs(offsetZ) / size);			
			const dlinaOffset = countZaLimit * size;
			offsetZ += dlinaOffset;
		}

		return new THREE.Vector2(offsetX, offsetZ);
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
					const pt = myMath.intersectionTwoLines_1({line1: {start: p1, end: p2}, line2: {start: arrPos[i2], end: arrPos[i2+1]}});
					//const pt = myMath.intersectionTwoLines_2(p1, p2, arrPos[i2], arrPos[i2+1]);
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


	// рассчитываем точки пересечения линий
	calcCrossPointLines({lines, sizeCell})
	{
		let crossP = [];
		const help = false;
		
		for ( let i = 0; i < lines.length; i++ )
		{
			for ( let i2 = 0; i2 < lines.length; i2++ )
			{
				if(lines[i] === lines[i2]) continue;
				
				const index = crossP.findIndex((o) => o.i2 === i);
				if (index > -1) continue;
			
				const cross = myMath.checkCrossLine(lines[i][0], lines[i][1], lines[i2][0], lines[i2][1]);
				if(!cross) continue;
				
				const pt = myMath.intersectionTwoLines_2(lines[i][0], lines[i][1], lines[i2][0], lines[i2][1]);
				
				if(pt)
				{
					crossP.push({i, i2, pt});
				}								
			}
		}

		if(crossP.length > 0) crossP = crossP.map(p => p.pt);
		
		if(help)
		{
			for ( let i = 0; i < crossP.length; i++ )
			{
				const obj = new THREE.Mesh( myGrids.geomPoint, myGrids.matPoint.clone() );
				obj.position.copy(crossP[i]);
				scene.add(obj);					
			}
		}
		
		return crossP;
	}


	// обновление обрешетки по одной точки из контура
	upGridMeshFromPoint({point, upCross = true})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});		
		if(!dataGrid) return;
		
		dataGrid.grille = this.upGridMeshes({dataGrid, upCross});		
	}

	// получаем размера ячейки обрешетки активированной сетки
	getGridMeshSizeCell()
	{
		const dataGrid = myGridActivate.getActDataGrid();
		if(!dataGrid) return;
		
		return dataGrid.grille.sizeCell;
	}
	

	// изменение размера ячейки обрешетки
	changeGridMeshSizeCell({sizeCell})
	{
		const dataGrid = myGridActivate.getActDataGrid();
		if(!dataGrid) return;
		
		dataGrid.grille = this.upGridMeshes({dataGrid, sizeCell});
	}
	
	
	// смещение обрешетки
	offsetGridMeshes({dataGrid, offset, upCross = true})
	{
		dataGrid.grille.offset.add(offset);
		
		dataGrid.grille = this.upGridMeshes({dataGrid, upCross});		
	}
	

	// находим ближайшую позицию (когда тащим трубу, находим ближайшую точку ячейки)
	getClosestPos({pos, arrPos})
	{
		let result = {minDist: Infinity, pos: pos};	
		
		for ( let i = 0; i < arrPos.length; i++ )
		{						
			const dist = pos.distanceTo(arrPos[i]);
			
			if (dist < result.minDist) 
			{
				result.minDist = dist;
				result.pos = arrPos[i].clone();
			}			
		}
		
		return result.pos; 
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







