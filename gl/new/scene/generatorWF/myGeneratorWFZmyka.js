
// построенного пола змейка
class MyGeneratorWFZmyka 
{
	pointsObj = [];
	linesObj = [];

	// создаем змейку
	crZmyka({dataGrid})
	{
		const pGrid = [];
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		
		for ( let i = 0; i < points.length; i++ )
		{
			pGrid.push(points[i].position.clone());
		}
		
		const sizeCell = dataGrid.grille.sizeCell;
		
		// расчитываем контуры
		const forms = myGeneratorWF.calc({forms: [], points: pGrid, offset: sizeCell * -1});

		const contours = [];
		
		for ( let i = 0; i < forms.length; i++ )
		{
			contours.push({path: [...forms[i][0].paths]});

			if(i === 0) break;			
		}			

		// рисуем линии контуров
		for ( let i = 0; i < contours.length; i++ )
		{
			let color = 0x0000ff;
			
			if (i % 2 === 0) { console.log(`${i} - четное число.`); color = 0x0000ff; } 
			else { console.log(`${i} - нечетное число.`); color = 0xff0000; }
	
			const line = myGeneratorWF.crForm({arrPos: contours[i].path, color});
			contours[i].line = line;
			line.visible = false;
		}
		
		myGeneratorWF.contours = contours;

		// определяем место входа тепл.пола
		const n = 1;
		const startPos = pGrid[0].clone().sub(pGrid[n + 0]).divideScalar( 2 ).add(pGrid[n + 0]);
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: dataGrid, contours, sizeCell});
		myGeneratorWFToolP.showToolP();
		
		// создаем выходы у труб для тепл.пола для каждего шага
		//myGeneratorWFExits.crExits({newPos: newPos.clone(), contours, sizeCell});
		
		this.detectCrossLines({startPos: newPos, dir, contours, pGrid});
		
		this.render();		
	}
	
	
	detectCrossLines({startPos, dir, contours, sizeCell = 0.2, pGrid})
	{
		this.delete();
		if(contours.length === 0) return;
		
		// определяем границы, чтобы построить центральную линию на всю длину box
		const vPath = [...contours[0].path];
		const arrP = [];
		
		const vBox = this.getBox({v: vPath});
		
		for ( let i = 0; i < vBox.length; i++ )
		{
			const v1 = vBox[i];
			const v2 = (i + 1 > vBox.length - 1) ? vBox[0] : vBox[i + 1];
			
			const pos = myMath.getIntersection(startPos, startPos.clone().add(dir), v1, v2);
			if(!pos) continue;
			
			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});
			
			if(onLine)
			{				
				const dist = pos.distanceTo(startPos);				
				arrP.push({dist, pos});
			}				
		}

		// центральная линия
		const lineProject = [];
		
		if(arrP.length > 1)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; }); 
			
			const v1 = arrP[0].pos;
			const v2 = arrP[arrP.length - 1].pos;
			
			lineProject.push(v1, v2);
			
			this.crHelpLine({v: [v1, v2]});
		}
		
		if(lineProject.length === 0) return;
		
		// создаем точки по всей длине центральной линии
		// и от этих точек перпендикульрно создаем линии, которые нужны для расчета точек по контуру 
		const arrL = [];
		
		if(1===1)
		{
			const v = lineProject;
			const dist = v[1].distanceTo(v[0]);
			const dir = v[1].clone().sub(v[0]).normalize();
			
			const arrP = []; 
			const count = myMath.numberRound({value: dist/sizeCell, type: 'floor'});
			
			for ( let i = 0; i < count; i++ )
			{
				const pos = myMath.multiVector3({dir, num: sizeCell * i});
				pos.add(v[0]);
				arrP.push(pos);
				
				//this.crHelpBox({pos});
			}
			
			
			
			const normal = myMath.calcNormal2D({p1: v[0], p2: v[1], reverse: false})
			
			for ( let i = 0; i < arrP.length; i++ )
			{
				const pos = arrP[i].clone().add(normal);
				
				arrL.push({v: [arrP[i], pos]});
				
				//this.crHelpLine({v: [arrP[i], pos]});
			}	
		}
		
		if(arrL.length === 0) return;
		
		
		// создаем точки по краю контура, которые будут соединены и образует змейку
		if(1===1)
		{
			const arrL2 = [];
			const arrP2 = [];
			
			for ( let i = 0; i < arrL.length; i++ )
			{
				let vL = [];
				const v1 = arrL[i].v[0];
				const v2 = arrL[i].v[1];
				
				for ( let i2 = 0; i2 < vPath.length; i2++ )
				{
					const v3 = vPath[i2];
					const v4 = (i2 + 1 > vPath.length - 1) ? vPath[0] : vPath[i2 + 1];

					const pos = myMath.getIntersection(v1, v2, v3, v4);
					if(!pos) continue;
					
					const onLine = myMath.isPointOnSegment2({point1: v3, point2: v4, targetPoint: pos});
					
					if(onLine)
					{				
						const dist = pos.distanceTo(startPos);
						
						arrP2.push({dist, pos});

						vL.push(pos);
						
						//this.crHelpBox({pos});
					}				
					
				}

				// выстраиваем точки в одну линию
				if(vL.length > 0)
				{
					if(vL.length > 2)
					{
						const arrP = [];
						const bBox = this.getBox({v: vL});
						
						for ( let i2 = 0; i2 < vL.length; i2++ )
						{
							const dist = vL[i2].distanceTo(bBox[0]);				
							arrP.push({dist, pos: vL[i2]});

							this.crHelpBox({pos: vL[i2]});
						}
						
						arrP.sort((a, b) => { return a.dist - b.dist; });
						
						vL = [];
						
						for ( let i2 = 0; i2 < arrP.length; i2++ )
						{
							vL.push(arrP[i2].pos);
						}
						
					}
					
					arrL2.push({v: vL});
				}
			}

			const arrL3 = [];
			
			for ( let i = 0; i < arrL2.length; i++ )
			{
				const crossL = [];
				let breakL = false;
				
				for ( let i2 = 0; i2 < arrL2[i].v.length - 1; i2++ )
				{
					const v1 = arrL2[i].v[i2];
					const v2 = arrL2[i].v[i2 + 1];
					
					let cross = false;
					
					for ( let i3 = 0; i3 < pGrid.length; i3++ )
					{
						const v3 = pGrid[i3];
						const v4 = (i3 + 1 > pGrid.length - 1) ? pGrid[0] : pGrid[i3 + 1];						
						
						cross = myMath.checkCrossLine(v1, v2, v3, v4);
						
						if(cross) 
						{
							breakL = true;
							break;
						}
					}
					
					if(!cross)
					{
						if(breakL)
						{
							crossL.push([v1, v2]);
						}
						else
						{
							if(crossL.length === 0) crossL.push([v1, v2]);
							else crossL[crossL.length - 1].push(v1, v2);
						}
					}
				}

				if(crossL.length > 0)
				{
					for ( let i2 = 0; i2 < crossL.length; i2++ )
					{
						//console.log(crossL[i2]);
						arrL3.push({v: [crossL[i2][0], crossL[i2][crossL[i2].length - 1]]});
					}					
				}				
			}
			
			let color = 0xff0000;
			for ( let i = 0; i < arrL3.length; i++ )
			{
				color = (color === 0xff0000) ? 0x00ff00 : 0xff0000;
				//Math.random() * 0xff0000
				//this.crHelpLine({v: arrL3[i].v, color});
			}
			
			//this.crHelpBox({pos: arrL3[0].v[0], color: 0xff0000, size: 0.1});
			
			if(1===1)
			{
				console.log(arrL3.length);
				
				let ind = 0;
				let n = 1;
				const newLine = [];

				while (arrL3.length > 0) 
				{
					const vv = (n === 1) ? arrL3[ind].v : arrL3[ind].v.reverse();
					newLine.push(...vv);
					const result = this.jointLines({ind, n, arrL3, pGrid});
					if(result)
					{
						ind = result.ind;
						n = result.n;						
					}
				}
				
				
				this.crHelpLine({v: newLine});
				//console.log(arrL3.length, newLine);				
			}
		}
		
		

		
		if(1===2)
		{
			this.crHelpBox({pos: arrP2[0].pos, color: 0xff0000, size: 0.1});
			this.crHelpBox({pos: arrP2[arrP2.length - 1].pos, color: 0x00ff00, size: 0.1});			
			
			const arrP3 = [];
			let n = 0;
			for ( let i = 0; i < arrP2.length - 1; i+=2 )
			{
				// четное число 0, 2, 4 и т.д.
				if(n % 2 === 0) 
				{
					arrP3.push(arrP2[i].pos, arrP2[i+1].pos);
					if(i + 3 < arrP2.length) arrP3.push(arrP2[i+3].pos);
				}
				else
				{
					arrP3.push(arrP2[i+1].pos, arrP2[i].pos);
				}
				
				n++;
			}
			
			this.crHelpLine({v: arrP3});			
		}
	}


	getBox({v})
	{		
		let bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		let x = (bound.max.x - bound.min.x);
		let y = (bound.max.y - bound.min.y);
		let z = (bound.max.z - bound.min.z);

		const arrV = [];
		arrV.push(new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z));
		arrV.push(new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z));
		arrV.push(new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z));
		arrV.push(new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z));
		
		for(let i = 0; i < arrV.length; i++)
		{
			const v1 = arrV[i];
			const v2 = (i + 1 > arrV.length - 1) ? arrV[0] : arrV[i + 1];
			
			//this.crHelpLine({v: [v1, v2], color: 0x00ff00});
		}			

		return arrV;
	}


	jointLines({ind, arrL3, n, pGrid})
	{
		const vLine = arrL3[ind].v;
		
		arrL3.splice(ind, 1);
		
		const ind1 = (n === 1) ? vLine.length - 1 : 0;
		const pos1 = vLine[ind1];
		
		const arrP1 = [];
		
		for ( let i = 0; i < arrL3.length; i++ )
		{
			const pos2 = arrL3[i].v[0];
			const pos3 = arrL3[i].v[arrL3[i].v.length - 1];
			
			const dist1 = pos1.distanceTo(pos2);
			const dist2 = pos1.distanceTo(pos3);
			
			const n2 = (n !== 1) ? 1 : 2;
			const n1 = (n !== 1) ? 2 : 1;
			
			arrP1.push({dist: dist1, ind: i, pos: pos2, n: n1});
			arrP1.push({dist: dist2, ind: i, pos: pos3, n: n2});
		}

		let result = null;
		
		if(arrP1.length > 0)
		{
			arrP1.sort((a, b) => { return a.dist - b.dist; }); 

			for ( let i = 0; i < arrP1.length; i++ )
			{
				const ind = arrP1[i].ind;
				const pos = arrP1[i].pos;
				const n = arrP1[i].n;
				
				const v1 = pos1;
				const v2 = pos;
				
				let cross = false;
				
				for ( let i3 = 0; i3 < pGrid.length; i3++ )
				{
					const v3 = pGrid[i3];
					const v4 = (i3 + 1 > pGrid.length - 1) ? pGrid[0] : pGrid[i3 + 1];						
					
					cross = myMath.checkCrossLine(v1, v2, v3, v4);
					
					if(cross) break;
				}
				
				if(!cross)
				{
					result = {ind, pos, n};
					break;
				}
				
			}
			
			
			//this.crHelpBox({pos: pos, color: 0xff0000, size: 0.1});
			
			
		}

		return result;		
	}
	

	crHelpBox({pos, size = 0.04, color = 0x0000ff})
	{
		const geometry = new THREE.BoxGeometry( size, size, size );
		const material = new THREE.MeshBasicMaterial({color});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );
		
		this.pointsObj.push(mesh);

		return mesh;
	}	


	crHelpLine({v, color = 0xff0000})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = v;			
		const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color, lightMap: lightMap_1}) );	
		scene.add( line );

		this.linesObj.push(line);
		
		return line;
	}


	delete()
	{
		const points = this.pointsObj;
		
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
			points[i].geometry.dispose();
		}
		
		const lines = this.linesObj;
		
		for ( let i = 0; i < lines.length; i++ )
		{
			scene.remove(lines[i]);
			lines[i].geometry.dispose();
		}		
		
		this.pointsObj = [];
		this.linesObj = [];
	}
	
	
	render()
	{
		renderCamera();
	}

 	
}







