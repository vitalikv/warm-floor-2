
// класс для расчета и создание выходов у тепл.пола
class MyGeneratorWFExits
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		
	}
	
	
	crExits({startPos, formStep, stepOffset = 0.3, del = false})
	{
		if(del) this.delete();
		
		let newPos = null;
		
		const arrP = [];
		const formPoints = formStep[0];
		const v = [...formPoints];
		//v.push(v[0]);

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
			
			const pos = arrP[0].pos;
			newPos = pos;
			
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
		}

		return newPos;
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







