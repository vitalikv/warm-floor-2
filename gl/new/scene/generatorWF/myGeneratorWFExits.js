
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
	

	crExits({newPos, contours, sizeCell})
	{
		const dataExits = [];
		let posF = newPos.clone();
		let del = true;
		
		for ( let i = 0; i < contours.length; i++ )
		{
			const posExits = this.calcExits({id: i, startPos: posF, contour: contours[i], sizeCell, del});
			posF = posExits.a;
			del = false;
			
			dataExits.push(posExits);
		}
		
		if(dataExits.length > 0) this.upForms({startPos: newPos.clone(), dataExits, contours, sizeCell});		
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
			
			const onLine = myMath.checkPointOnLine(v1, v2, pos);
			
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
			
			pos1 = this.getPosLimitOnLine({id: 0, pos: pos1, line: {start: v1, end: v2}, arrV: v, ind});
			pos2 = this.getPosLimitOnLine({id: 1, pos: pos2, line: {start: v1, end: v2}, arrV: v, ind});			

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
	getPosLimitOnLine({id, pos, line, arrV, ind})
	{
		const onLine = myMath.checkPointOnLine(line.start, line.end, pos);
		
		if(!onLine && id === 0)
		{
			const dist2 = pos.distanceTo(line.end);			
			
			let v1 = (ind + 1 > arrV.length - 1) ? arrV[0] : arrV[ind + 1];
			let v2 = (ind + 2 > arrV.length - 1) ? (ind + 1 > arrV.length - 1) ? arrV[1] : arrV[0] : arrV[ind + 2];
			
			const dir = v2.clone().sub(v1).normalize();			
			dir.x *= dist2;
			dir.z *= dist2;

			pos = line.end.clone().add(dir);			
		}
		
		if(!onLine && id === 1)
		{
			const dist1 = pos.distanceTo(line.start);
			
			let v1 = arrV[ind];
			let v2 = (ind - 1 < 0) ? arrV[arrV.length - 1] : arrV[ind - 1];
			
			const dir = v2.clone().sub(v1).normalize();
			
			dir.x *= dist1;
			dir.z *= dist1;

			pos = line.start.clone().add(dir);			
		}		
		
		return pos;
	}
	

	// обновляем форму конутров (вставляем точки входа/выхода и создаем в этом месте разрыв линии)
	upForms({startPos, dataExits, contours, sizeCell})
	{
		const arrV = [];
		const defV = [];	// нужно знать изначальное кол-во точек, до удаления (чтобы понять было удаление точек или нет)
		
		for ( let i = 0; i < contours.length; i++ )
		{
			const pos1 = dataExits[i].a;
			const pos2 = dataExits[i].b;
			const pos3 = dataExits[i].c;						
			
			let v = [...contours[i].path];			
			
			// определяем, есть ли точка между точками двумя точками входа
			let vDel = null;
			const dist = v[dataExits[i].ind].distanceTo(pos3);			
			if(dist <= sizeCell) vDel = v[dataExits[i].ind];

			
			// вставляем в массив точки входа/выхода
			// сортируем массив с точками, так чтобы вход/выход были, началом м концом массива
			v.splice(dataExits[i].ind + 1, 0, pos2);	// встявляем элемент в массив по индексу
			v.splice(dataExits[i].ind + 2, 0, pos1);				
			v = myMath.offsetArrayToFirstElem({arr: v, index: dataExits[i].ind + 2});				
			
			defV.push([...v]);						
			
			// если есть точка между двумя точкам, то удаляем ее
			if(vDel)
			{				
				const index = v.findIndex((item) => item === vDel);
				if(index > -1) v.splice(index, 1);				
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

					const dist = dataExits[i].a.distanceTo(v2);						
					
					if(i > -6)
					{
						const p1 = this.crHelpBox({pos: arrV[i+2][1], color: 0xff0000});
						this.pointsObj.push(p1);

						const p2 = this.crHelpBox({pos: v1, color: 0x0000ff});
						this.pointsObj.push(p2);	
			
						//const area = 0.5 * Math.abs(v1.x * (v2.z - pos2.z) + v2.x * (pos2.z - v1.z) + pos2.x * (v1.z - v2.z));				
						
						
						if(dist <= sizeCell) 
						{
							const pos2 = myMath.mathProjectPointOnLine2D({A: arrV[i+2][0], B: arrV[i+2][1], C: v2});
							pos2.y = v[0].y;							
							
							v.pop();
							v[v.length - 1] = pos2;
						}
						else 
						{
							const pos2 = myMath.mathProjectPointOnLine2D({A: arrV[i+2][0], B: arrV[i+2][1], C: v1});
							pos2.y = v[0].y;	
							
							if(defV[i].length === v.length) 
							{
								v.push(pos2);
							}
							else 
							{
								v[v.length - 1] = pos2;
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







