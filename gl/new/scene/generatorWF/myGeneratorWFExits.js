
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
			const posExits = this.calcExits({startPos: posF, contour: contours[i], sizeCell, del});
			posF = posExits.c;
			del = false;
			
			dataExits.push(posExits);
		}
		
		if(dataExits.length > 0) this.upForms({startPos: newPos.clone(), dataExits, contours, sizeCell});		
	}
	
	calcExits({startPos, contour, sizeCell, del = false})
	{
		if(del) this.delete();
		
		let posExits = {a: null, b: null, c: null, ind: -1};
		
		const arrP = [];
		const formPoints = contour.path;
		const v = [...formPoints, formPoints[0]];

		// 1. добавляем точки контура (нужно, если на на шаге 2, не было пересечения)
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const dist = v[i].distanceTo(startPos);
			arrP.push({ind: i, pos: v[i], dist});					
		}
		
		// 2. ищем точку пересечения с входной точкой и контуром
		for ( let i = 0; i < v.length - 1; i++ )
		{			
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], pos);
			
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
			
			//const pCenter = this.crHelpBox({pos, color:  0x00ff00});
			//this.pointsObj.push(pCenter);
			
			const ind = arrP[0].ind;
			const dir = v[ind + 1].clone().sub(v[ind]).normalize();
			dir.x *= sizeCell;
			dir.z *= sizeCell;
			
			let pos1 = pos.clone().add(dir);
			let pos2 = pos.clone().sub(dir);
			
			pos1 = this.getPosLimitOnLine({pos: pos1, line: {start: v[ind], end: v[ind + 1]}});
			pos2 = this.getPosLimitOnLine({pos: pos2, line: {start: v[ind], end: v[ind + 1]}});			

			//const p1 = this.crHelpBox({pos: pos1, color:  0xff0000});
			//this.pointsObj.push(p1);

			//const p2 = this.crHelpBox({pos: pos2, color:  0xff0000});
			//this.pointsObj.push(p2);

			posExits.a = pos1;
			posExits.b = pos2;
		}

		return posExits;
	}
	

	// если точка находится за пределами отрезка, то назначаем pos точки самый край отрезка
	getPosLimitOnLine({pos, line})
	{
		const onLine = myMath.checkPointOnLine(line.start, line.end, pos);
		
		if(!onLine)
		{
			const dist1 = pos.distanceTo(line.start);
			const dist2 = pos.distanceTo(line.end);
			
			pos = (dist1 < dist2) ? line.start : line.end;
		}
		
		return pos;
	}
	

	// обновляем форму конутров (вставляем точки входа/выхода и создаем в этом месте разрыв линии)
	upForms({startPos, dataExits, contours, sizeCell})
	{
		for ( let i = 0; i < contours.length; i++ )
		{
			const pos1 = dataExits[i].a;
			const pos2 = dataExits[i].b;
			
			let v = [...contours[i].path];

			if(dataExits[i].ind === v.length - 1)
			{
				v.splice(dataExits[i].ind + 1, 0, pos2);	// встявляем элемент в массив по индексу
				v.splice(0, 0, pos1);				
			}
			else
			{
				v.splice(dataExits[i].ind + 1, 0, pos2);	// встявляем элемент в массив по индексу
				v.splice(dataExits[i].ind + 2, 0, pos1);	
				
				v = myMath.offsetArrayToFirstElem({arr: v, index: dataExits[i].ind + 2});				
			}
			
			v.reverse();	// делаем массив точек против часовой
			
			const distKof = 0.01;
			
			// четное число 0, 2, 4 и т.д.
			if(i % 2 === 0)
			{												
				if(i + 1 === contours.length - 1)
				{
					let v1 = v[v.length - 1];
					let v2 = v[v.length - 2];
					const dist = v1.distanceTo(v2);
					if(dist < distKof && this.mode === 'V')
					{
						v.pop();
						v1 = v[v.length - 1];
						v2 = v[v.length - 2];						
					}
					
					const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: dataExits[i+1].a});
					pos2.y = v[0].y;					
					if(this.mode === 'V') v[v.length - 1] = pos2;				
			
					v.push(dataExits[i+1].a); 					
				}				
				else if(i + 2 < contours.length)
				{
					let v1 = v[v.length - 1];
					let v2 = v[v.length - 2];
					const dist = v1.distanceTo(v2);
					if(dist < distKof && this.mode === 'V')
					{
						v.pop();
						v1 = v[v.length - 1];
						v2 = v[v.length - 2];						
					}
					
					const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: dataExits[i+2].b});
					pos2.y = v[0].y;					
					if(this.mode === 'V') v[v.length - 1] = pos2;	
			
					v.push(dataExits[i+2].b);				
				}
			}
			else
			{	
				if(i === 1)
				{
					v.unshift(dataExits[0].c); 					
				}			

				if(i + 1 === contours.length - 1)
				{
					let v1 = v[v.length - 1];
					let v2 = v[v.length - 2];
					const dist = v1.distanceTo(v2);
					if(dist < distKof && this.mode === 'V')
					{
						v.pop();
						v1 = v[v.length - 1];
						v2 = v[v.length - 2];					
					}
					
					const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: dataExits[i+1].a});
					pos2.y = v[0].y;					
					if(this.mode === 'V') v[v.length - 1] = pos2;					
			
					v.push(dataExits[i+1].a); 					
				}				
				if(i + 2 < contours.length)
				{
					let v1 = v[v.length - 1];
					let v2 = v[v.length - 2];
					const dist = v1.distanceTo(v2);
					if(dist < distKof && this.mode === 'V')
					{
						v.pop();
						v1 = v[v.length - 1];
						v2 = v[v.length - 2];						
					}
					
					const pos2 = myMath.mathProjectPointOnLine2D({A: v1, B: v2, C: dataExits[i+2].b});
					pos2.y = v[0].y;					
					if(this.mode === 'V') v[v.length - 1] = pos2;
			
					v.push(dataExits[i+2].b); 					
				}				
			}
			
			
			if(1===1)
			{
				const p1 = this.crHelpBox({pos: v[0], color:  0x0000ff});
				this.pointsObj.push(p1);
				const p2 = this.crHelpBox({pos: v[v.length - 2], color:  0x0000ff});
				this.pointsObj.push(p2);				
			}


			if(i === 0)
			{
				v[0] = startPos.clone();
				
				const dir = v[1].clone().sub(v[2]).normalize();
				const offset = new THREE.Vector3().addScaledVector( dir, 0.1 );
				v[1] = v[1].clone().add(offset);
				v[0] = v[0].clone().sub(offset);
			}
			
			if(i === 1)
			{
				const v1 = contours[0].line.geometry.vertices;
				
				const dir = myMath.calcNormal2D({p1: v1[2], p2: v1[1], reverse: false});
				const offset = new THREE.Vector3().addScaledVector( dir, sizeCell );
				v[1] = v1[1].clone().add(offset);
				
				const dir1 = v1[1].clone().sub(v1[2]).normalize();
				const offset1 = new THREE.Vector3().addScaledVector( dir1, -0.05 );
				v[1] = v[1].clone().add(offset1);
				
				v[0] = startPos.clone();
				v[0] = v[0].clone().add(offset1).add(offset1).add(offset1);
			}
			
			const line = contours[i].line;
			
			const geometry = new THREE.Geometry();
			geometry.vertices = v;
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







