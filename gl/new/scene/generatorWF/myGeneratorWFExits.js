
// класс для расчета и создание выходов у тепл.пола
class MyGeneratorWFExits
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		
	}
	

	crExits({newPos, contours})
	{
		const dataExits = [];
		let posF = newPos.clone();
		let del = true;
		
		for ( let i = 0; i < contours.length; i++ )
		{
			const posExits = this.calcExits({startPos: posF, contour: contours[i], del});
			posF = posExits.c;
			del = false;
			
			dataExits.push(posExits);
		}
		
		if(dataExits.length > 0) this.upForms({dataExits, contours});		
	}
	
	calcExits({startPos, contour, stepOffset = 0.3, del = false})
	{
		if(del) this.delete();
		
		let posExits = {a: null, b: null, c: null, ind: -1};
		
		const arrP = [];
		const formPoints = contour.path;
		const v = [...formPoints, formPoints[0]];

		for ( let i = 0; i < v.length - 1; i++ )
		{
			const dist = v[i].distanceTo(startPos);
			arrP.push({ind: i, pos: v[i], dist});					
		}
		
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
		
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; }); 
			
			posExits.ind = arrP[0].ind;
			
			const pos = arrP[0].pos;
			posExits.c = pos;
			
			const pCenter = this.crHelpBox({pos, color:  0x00ff00});
			this.pointsObj.push(pCenter);
			
			const ind = arrP[0].ind;
			const dir = v[ind + 1].clone().sub(v[ind]).normalize();
			dir.x *= stepOffset/2;
			dir.z *= stepOffset/2;
			
			let pos1 = pos.clone().add(dir);
			let pos2 = pos.clone().sub(dir);
			
			pos1 = this.getPosLimitOnLine({pos: pos1, line: {start: v[ind], end: v[ind + 1]}});
			pos2 = this.getPosLimitOnLine({pos: pos2, line: {start: v[ind], end: v[ind + 1]}});			

			const p1 = this.crHelpBox({pos: pos1, color:  0xff0000});
			this.pointsObj.push(p1);

			const p2 = this.crHelpBox({pos: pos2, color:  0x0000ff});
			this.pointsObj.push(p2);

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
	upForms({dataExits, contours})
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
			
			v.reverse();
			
			// четное число 0, 2, 4 и т.д.
			if(i % 2 === 0)
			{
				if(i + 1 === contours.length - 1)
				{
					v.push(dataExits[i+1].a);
					//v.unshift(dataExits[i+1].a); 					
				}				
				else if(i + 2 < contours.length)
				{
					v.push(dataExits[i+2].b);
					//v.unshift(dataExits[i+2].b); 					
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
					v.push(dataExits[i+1].a); 					
				}				
				if(i + 2 < contours.length)
				{
					v.push(dataExits[i+2].b); 					
				}				
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







