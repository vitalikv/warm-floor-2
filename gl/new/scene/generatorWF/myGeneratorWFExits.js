
// класс для расчета и создание выходов у тепл.пола
class MyGeneratorWFExits
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		this.mode = '';
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
			
			const pos = myMath.getIntersection(posF, posF.clone().add(dir), v1, v2);
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

			
			if(1===1)
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


	// определяем на какой линии лежит точка [id1, id2] - номер точек линии
	getPointOnLine({pos, v})
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
			
			lineIds = [n1, n2];		
		}
		
		return lineIds;
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
			
			const line1 = this.getPointOnLine({pos: pos1, v});
			const line2 = this.getPointOnLine({pos: pos2, v});	
			
				
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
				if(countDel > 0) v.splice(1, countDel);	// удаляем точки, которые находятся между нашими 2-мя точками

				v.splice(1, 0, pos2);
				v.splice(2, 0, pos1);

				const index = v.findIndex((item) => item === pos1);
				v = myMath.offsetArrayToFirstElem({arr: v, index: index});
			}
			
			// делаем массив точек против часовой (нужно чтобы 1-ая точка находилась в начале, а 2-ая в коннце)	
			v.reverse();			
			
			arrV.push(v);	
		}
		
		
		for ( let i = 0; i < arrV.length; i++ )
		{
			const v = arrV[i];
			
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


		for ( let i = 0; i < arrV.length; i++ )
		{
			const v = arrV[i];
			
			if(i + 1 === contours.length - 1)
			{
				// с последним контуром ничего не делаем, там линия присоединяется правильно
			}			
			else if(i + 1 < contours.length)
			{
				const v1 = v[v.length - 1];
				const v2 = v[v.length - 2];
				
				const v3 = dataExits[i+1].a;
				const v4 = dataExits[i+1].b;

				const pos = v4.clone().sub(v3).divideScalar(2).add(v3);

				//const p4 = this.crHelpBox({pos, color: 0xff8f0f});
				//this.pointsObj.push(p4);

				v.splice(v.length - 1, 0, pos);
			}				
		}
				

		for ( let i = 0; i < arrV.length; i++ )
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







