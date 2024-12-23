
// класс для расчета и создание выходов у тепл.пола
class MyGeneratorWFExits
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		this.mode = 'V';
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => 
	{
		if (event.code === 'KeyV') 
		{
			this.mode = (this.mode === '') ? 'V' : '';
		}		
	};
	

	crExits({newPos, dir = null, contours, sizeCell})
	{
		const dataExits = [];
		let posF = newPos.clone();
		let del = true;
		
		if(dir)
		{
			posF = this.calcStartPoint({posF, dir, contours});
		}
		
		for ( let i = 0; i < contours.length; i++ )
		{
			const posExits = this.calcExits({id: i, startPos: posF, contour: contours[i], sizeCell, del});
			posF = posExits.a;
			del = false;
			
			dataExits.push(posExits);
		}
		
		if(dataExits.length > 0) this.upForms({startPos: newPos.clone(), dataExits, contours, sizeCell});		
	}
	
	
	calcStartPoint({posF, dir, contours})
	{
		const v = contours[0].path;
		const arrP = [];

		for ( let i = 0; i < v.length; i++ )
		{
			const dist = v[i].distanceTo(posF);
			arrP.push({pos: v[i], dist});					
		}
	
		for ( let i = 0; i < v.length; i++ )
		{
			const v1 = v[i];
			const v2 = (i + 1 > v.length - 1) ? v[0] : v[i + 1];
			
			const pos = this.getIntersection(posF, posF.clone().add(dir), v1, v2);
			if(!pos) continue;
			
			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});
			
			if(onLine)
			{				
				const dist = pos.distanceTo(posF);
				
				arrP.push({dist, pos});				
			}				
		}

		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; }); 
			
			posF = arrP[0].pos;
		}

		return posF;
	}
	
	
	// находим для одного из конутров, позицию для 2-х точек выходов и одну центральную
	calcExits({id, startPos, contour, sizeCell, del = false})
	{
		if(del) this.delete();
		
		let posExits = {a: null, b: null, c: null, ind: -1};
		
		const arrP = [];
		const formPoints = contour.path;
		const v = [...formPoints];

		// 1. добавляем точки контура (нужно, если на на шаге 2, не было пересечения)
		for ( let i = 0; i < v.length; i++ )
		{
			const dist = v[i].distanceTo(startPos);
			arrP.push({ind: i, pos: v[i], dist});					
		}
		
		// 2. ищем точку пересечения с входной точкой и контуром
		for ( let i = 0; i < v.length; i++ )
		{
			const v1 = v[i];
			const v2 = (i + 1 > v.length - 1) ? v[0] : v[i + 1];
			
			const pos = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: startPos});
			
			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});
			
			if(onLine)
			{				
				const dist = pos.distanceTo(startPos);
				
				arrP.push({ind: i, dist, pos});				
			}
		}
		
		// определяем ближайшую точку пересечения центра и добавляем сторонние точки
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; }); 
			
			posExits.ind = arrP[0].ind;
			
			const pos = arrP[0].pos;
			posExits.c = pos;
			
			
			const ind = arrP[0].ind;
			const v1 = v[ind];
			const v2 = (ind + 1 > v.length - 1) ? v[0] : v[ind + 1];			
			const dir = v2.clone().sub(v1).normalize();
			
			
			dir.x *= sizeCell;
			dir.z *= sizeCell;
			
			let pos1 = pos.clone().add(dir);
			let pos2 = pos.clone().sub(dir);
			
			pos1 = this.getPosLimitOnLine({id: 0, pos: pos1, arrV: v, ind});
			pos2 = this.getPosLimitOnLine({id: 1, pos: pos2, arrV: v, ind, step: id});			

			
			if(1===2)
			{
				//const pCenter = this.crHelpBox({pos, color:  0x00ff00});
				//this.pointsObj.push(pCenter);
				
				const color = (id % 2 !== 0) ? 0xff0000 : 0x0000ff; 
			
				const p1 = this.crHelpBox({pos: pos1, color});
				this.pointsObj.push(p1);

				const p2 = this.crHelpBox({pos: pos2, color});
				this.pointsObj.push(p2);				
			}

			posExits.a = pos1;
			posExits.b = pos2;			
		}

		return posExits;
	}

	// если точка находится за пределами отрезка, то находим место на ближайщем отрезке
	getPosLimitOnLine({id, pos, arrV, ind, step = -1})
	{
		let v1 = arrV[ind];
		let v2 = (ind + 1 > arrV.length - 1) ? arrV[0] : arrV[ind + 1];
	
		
		const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});

		
		if(!onLine && id === 0)
		{
			let v1 = (ind + 1 > arrV.length - 1) ? arrV[0] : arrV[ind + 1];
			let v2 = (ind + 2 > arrV.length - 1) ? (ind + 1 > arrV.length - 1) ? arrV[1] : arrV[0] : arrV[ind + 2];
			
			const dist1 = pos.distanceTo(v1);
			
			const dir = v2.clone().sub(v1).normalize();			
			dir.x *= dist1;
			dir.z *= dist1;

			pos = v1.clone().add(dir);

			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});

					
			if(!onLine)
			{
				//pos = v2.clone();
				
				const ind2 = (ind + 1 > arrV.length - 1) ? 0 : ind + 1;				
				pos = this.getPosLimitOnLine({id, pos, arrV, ind: ind2, step});				
			}
		}
		
		if(!onLine && id === 1)
		{						
			let v1 = arrV[ind];
			let v2 = (ind - 1 < 0) ? arrV[arrV.length - 1] : arrV[ind - 1];
			
			const dist1 = pos.distanceTo(v1);
			
			const dir = v2.clone().sub(v1).normalize();			
			dir.x *= dist1;
			dir.z *= dist1;

			pos = v1.clone().add(dir);	

			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});
			
			
			if(!onLine)
			{
				//pos = v2.clone();
				
				const ind2 = (ind - 1 < 0) ? arrV.length - 1 : ind - 1;				
				pos = this.getPosLimitOnLine({id, pos, arrV, ind: ind2, step});					
			}			
		}		
		
		return pos;
	}


	
	getPointOnLine({pos, v, step = -1, num = 0})
	{
		let lineIds = null;
		
		for ( let i = 0; i < v.length; i++ )
		{
			const id1 = i;
			const id2 = (i + 1 > v.length - 1) ? 0 : i + 1;
			const v1 = v[id1];
			const v2 = v[id2];
						
			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});			
			
			if(onLine) 
			{
				if(1===2 && step === 0)
				{
					const p1 = this.crHelpBox({pos: v1, color: 0x000000});
					this.pointsObj.push(p1);	

					const p2 = this.crHelpBox({pos: v2, color: 0x000000});
					this.pointsObj.push(p2);

					const p3 = this.crHelpBox({pos, color: 0x00ff00});
					this.pointsObj.push(p3);
				}
				
				lineIds = [id1, id2];
				break;
			}
		}
		
		if(!lineIds) 
		{
			const arrP = [];
			
			for ( let i = 0; i < v.length; i++ )
			{
				const dist = v[i].distanceTo(pos);
				arrP.push({ind: i, pos: v[i], dist});					
			}	
			
			arrP.sort((a, b) => { return a.dist - b.dist; });
			
			let n1 = arrP[0].ind;
			let n2 = arrP[0].ind;
			
			//if(num === 2) n1 = (arrP[0].ind - 1 < 0) ? 0 : arrP[0].ind - 1;
			//if(num === 1) n1 = (arrP[0].ind - 1 < 0) ? 0 : arrP[0].ind - 1;
			
			lineIds = [n1, n2];
			
						
		}
		
		return lineIds;
	}
	


getProjectPointOnLine2D({targetPoint, point1, point2})
{
	// Точки, задающие линию
	// const point1 = new THREE.Vector3(0, 0, 0); // Начало линии
	// const point2 = new THREE.Vector3(1, 1, 1); // Конец линии

	// Точка, которую нужно спроецировать
	// const targetPoint = new THREE.Vector3(2, 0, 0);

	// 1. Вектор направления линии
	const lineDir = new THREE.Vector3().subVectors(point2, point1).normalize();

	// 2. Вектор от точки на линии до целевой точки
	const pointToTarget = new THREE.Vector3().subVectors(targetPoint, point1);

	// 3. Скалярное произведение (длина проекции)
	const projectionLength = pointToTarget.dot(lineDir);

	// 4. Координаты проекции
	const projection = new THREE.Vector3()
	  .copy(lineDir)
	  .multiplyScalar(projectionLength)
	  .add(point1);
	
	return projection;
}


getIntersection(p1, p2, p3, p4, epsilon = 1e-12) {
    // Векторы направления для каждой прямой
    const d1 = new THREE.Vector3().subVectors(p2, p1); // Вектор для прямой 1
    const d2 = new THREE.Vector3().subVectors(p4, p3); // Вектор для прямой 2

    // Разница между точками, образующими прямые
    const denom = d1.x * d2.z - d1.z * d2.x;

    // Проверяем, параллельны ли прямые с учётом погрешности
    if (Math.abs(denom) < epsilon) {
        return null; // Прямые параллельны, пересечения нет
    }

    // Находим параметр t для прямой 1
    const t1 = ((p3.x - p1.x) * d2.z - (p3.z - p1.z) * d2.x) / denom;

    // Вычисляем точку пересечения
    const intersection = new THREE.Vector3().addScaledVector(d1, t1).add(p1);

    return intersection;
}
  
  

	// обновляем форму конутров (вставляем точки входа/выхода и создаем в этом месте разрыв линии)
	upForms({startPos, dataExits, contours, sizeCell})
	{
		const arrV = [];


		for ( let i = 0; i < contours.length; i++ )
		{
			const pos1 = dataExits[i].a;
			const pos2 = dataExits[i].b;
			const pos3 = dataExits[i].c;						
			
			let v = [...contours[i].path];	
			
			const line1 = this.getPointOnLine({pos: pos1, v, step: -1, num: 1});
			const line2 = this.getPointOnLine({pos: pos2, v, step: i, num: 2});	

			const indA = line1[0];
			const indB = line2[0]; 
			
				

			if(1 === 2)
			{
				if(indA - indB < 0) 
				{
					v.splice(0, 1);
				}
				if(indA - indB > 0) 
				{
					v.splice(indB + 1, indA - indB);
				}			
					
				
				v.splice(indB + 1, 0, pos2);
				v.splice(indB + 2, 0, pos1);		
				
				const index = v.findIndex((item) => item === pos1);
				v = myMath.offsetArrayToFirstElem({arr: v, index: index});									
			}
			if(1 === 1)
			{
				let countDel = 0;
				
				if(line2[0] > line1[1])
				{
					countDel = ((line1[1] + v.length) - line2[0]) - 1;
				}
				else
				{
					countDel = (line1[1] - line2[0]) - 1;
				}
				
				
				v = myMath.offsetArrayToFirstElem({arr: v, index: line2[0]});				
				if(countDel > 0) v.splice(1, countDel);

				v.splice(1, 0, pos2);
				v.splice(2, 0, pos1);

				const index = v.findIndex((item) => item === pos1);
				v = myMath.offsetArrayToFirstElem({arr: v, index: index});
				
				//if(i === 0) console.log(line1, line2, countDel);
			}
			
			v.reverse();	// делаем массив точек против часовой			
			
			arrV.push(v);	
		}

		
		for ( let i = 0; i < arrV.length; i++ )
		{
			const v = arrV[i];
			
			if(i + 1 === contours.length - 1)
			{
				if(this.mode === 'V')
				{
					let v1 = v[v.length - 2];
					let v2 = v[v.length - 3];
					
					const v3 = arrV[i+1][arrV[i+1].length - 1];
					const v4 = arrV[i+1][arrV[i+1].length - 2];

					const dist = v[v.length - 1].distanceTo(v[v.length - 2]);					
					
					if(dist < sizeCell) 
					{
						const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
						pos2.y = v[0].y;							
						
						v.pop();
						v[v.length - 1] = pos2;
					}
					else 
					{
						v1 = v[v.length - 1];
						v2 = v[v.length - 2];
						
						const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
						pos2.y = v[0].y;	
							
						//v.pop();
						v[v.length - 1] = pos2;
					}					
				}
			}
			else if(i + 2 < contours.length)
			{
				
				if(this.mode === 'V')
				{
					let v1 = v[v.length - 1];
					let v2 = v[v.length - 2];	

					let v3 = arrV[i+2][0];
					let v4 = arrV[i+2][1];
					
					const dist = dataExits[i].a.distanceTo(v2);						
					
					if(i > -1)
					{
						if(i===0)
						{
							const p1 = this.crHelpBox({pos: v1, color: 0xff0000});
							this.pointsObj.push(p1);

							const p2 = this.crHelpBox({pos: v2, color: 0x0000ff});
							this.pointsObj.push(p2);	


							const p3 = this.crHelpBox({pos: v3, color: 0x000000});
							this.pointsObj.push(p3);

							const p4 = this.crHelpBox({pos: v4, color: 0xcccccc});
							this.pointsObj.push(p4);											
							
						}
						
						
						if(dist <= sizeCell && 1===2) 
						{
							const pos2 = myMath.mathProjectPointOnLine2D({A: v3, B: v4, C: v2});
							pos2.y = v[0].y;							
							
							v.pop();
							v[v.length - 1] = pos2;
						}
						else 
						{
							let pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
							pos2.y = v[0].y;	
							
							const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos2});
							
							if(!onLine) 
							{
								const dir = myMath.calcNormal2D({p1: v1, p2: v2});
		
		if(i === 0) console.log(555, dist <= sizeCell);
		
								if(dist <= sizeCell && 1===1) 
								{
									let pos2 = this.getProjectPointOnLine2D({targetPoint: v3, point1: v2, point2: v2.clone().add(dir)});
									//const pos2 = myMath.mathProjectPointOnLine2D({A: v2, B: v2.clone().add(dir), C: v3});
									pos2.y = v[0].y;	
									
									const area = 0.5 * Math.abs(v3.x * (v4.z - pos2.z) + v4.x * (pos2.z - v3.z) + pos2.x * (v3.z - v4.z));


									const onLine = myMath.isPointOnSegment2({point1: v3, point2: v4, targetPoint: pos2});
									
									if(i === 0) 
									{
										const p4 = this.crHelpBox({pos: pos2, color: 0xff8f0f});
										this.pointsObj.push(p4);										
									}
									
									
									if(onLine)
									{
										//v.pop();
										//v[v.length - 1] = pos2;
										dataExits[i+2].b = pos2;
										arrV[i+2][0] = pos2;											
									}
									else if(area < 0.000001 && 1===2)
									{
										//const dir2 = v1.clone().sub(v2).normalize();
										pos2 = new THREE.Vector3().addScaledVector(dir, -sizeCell).add(pos2);
										pos2.y = v[0].y;
										//v.pop();
										v[v.length - 1] = pos2;
										
										const dir2 = myMath.calcNormal2D({p1: v3, p2: v4, reverse: true});
										let pos3 = this.getProjectPointOnLine2D({targetPoint: pos2, point1: v3, point2: v3.clone().add(dir2)});
										
										v.push(pos3);
									}
									else
									{
										v.pop();
										v[v.length - 1] = pos2;										
									}
									
								}
								else
								{
									const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v1.clone().add(dir), C: v3});
									pos2.y = v[0].y;			
									
									
									v.push(pos2);
								}
								
								
								
							}
							else 
							{

								
								const dir = myMath.calcNormal2D({p1: v1, p2: v2});
								
								const result = this.getIntersection(v1, v1.clone().add(dir), v3, v4);
								
								//const result = myMath.intersectionTwoLines_2(v1, v1.clone().add(dir), v3, v4);
								
								if(result)
								{
									pos2 = result;
									pos2.y = v[0].y;
									
									const cross = myMath.checkCrossLine(v1, v2, v4, pos2);
									
									if(i === -1) 
									{
										const p4 = this.crHelpBox({pos: pos2, color: 0xff8f0f});
										this.pointsObj.push(p4);	
										console.log(888888, cross);
									}								
									
									if(cross)
									{
										const result = this.getIntersection(v1, v2, v4, pos2);
										
										if(result)
										{
											pos2 = result;
											pos2.y = v[0].y;
											
											v[v.length - 1] = pos2;
										}
										else
										{
											
										}
									}
									else
									{
										
										const result = this.getIntersection(v1, v2, v4, pos2);
										
										if(result)
										{
											//pos2 = result;
											//pos2.y = v[0].y;
											
										const area = 0.5 * Math.abs(v3.x * (v4.z - result.z) + v4.x * (result.z - v3.z) + result.x * (v3.z - v4.z));
												



											const dist1 = dataExits[i].b.distanceTo(v2);
											const dist2 = result.distanceTo(v2);
											
											const dist3 = v1.distanceTo(v3);
											const dist4 = v1.distanceTo(pos2);	

if(i === 0) console.log(444, dist1 < dist2, dist3 < dist4);											
											
											if(dist1 < dist2 && 1===1)
											{
												pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
												pos2.y = v[0].y;										
												v[v.length - 1] = pos2;													
											}											
											else if(dist3 < dist4)
											{
												pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
												pos2.y = v[0].y;										
												v[v.length - 1] = pos2;
											}
											else
											{
												v.push(pos2);
											}
											
										}
										else
										{
											pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: v3});
											pos2.y = v[0].y;											
											v[v.length - 1] = pos2;											
										}
									}
									
								}
								else
								{
									
									
									if(i === 0) console.log(6666);
									
									v[v.length - 1] = pos2;
									
								}
								
								//pos2 = this.getProjectPointOnLine2D({targetPoint: v1, point1: v3, point2: v4});
								//pos2.y = v[0].y;	
								//v[v.length - 1] = pos2;

							}
						}					
					}												
				}				
			}
			
			
			// добавляем точку до следующего контура, чтобы соединить
			// четное число 0, 2, 4 и т.д.
			if(i % 2 === 0) {}
			else 
			{
				if(i === 1)
				{
					v.unshift(dataExits[0].c); 					
				}					
			}

			if(i + 1 === contours.length - 1)
			{
				v.push(dataExits[i+1].a);
			}
			else if(i + 2 < contours.length)
			{
				v.push(dataExits[i+2].b);
			}				

		}

				

		for ( let i = 0; i < contours.length; i++ )
		{
			const line = contours[i].line;
			
			const geometry = new THREE.Geometry();
			geometry.vertices = arrV[i];
			//geometry.verticesNeedUpdate = true;
			
			
			line.geometry.dispose();
			line.geometry = geometry;			
		}
		
	}



	crHelpBox({pos, size = 0.04, color = 0x0000ff})
	{
		const geometry = new THREE.BoxGeometry( size, size, size );
		const material = new THREE.MeshBasicMaterial({color});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
	}	


	delete()
	{
		const points = this.pointsObj;
		
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
		}
		
		this.pointsObj = [];
	}
	
	
	render()
	{
		renderCamera();
	}

}







