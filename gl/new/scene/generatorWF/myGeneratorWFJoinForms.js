
// класс объединение всех конуров в один
class MyGeneratorWFJoinForms
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		
	}

	
	//---
	
	joinForms({startPos, dir, formSteps})
	{
		this.delete();
		
		const pointsPos = [];
		console.log(9999, formSteps);
		for ( let i = 0; i < formSteps.length; i++ )
		{
			const result = this.testCutForm({startPos, dir, formPoints: formSteps[i][0]});
			
			if(result.newPos)
			{
				startPos = result.newPos;			
				pointsPos.push(...result.formPoints2);				
			}
			else
			{
				break;
			}
			//break;
		}

		this.crLine({pointsPos});
	}
	
	
	
	testCutForm({startPos, dir, formPoints, stepOffset = 0.3})
	{
		let newPos = null;
		
		const arrP = [];
		const v = [...formPoints];
		v.push(v[0]);
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const line = {start: v[i], end: v[i + 1]};
			const line2 = {start: startPos, end: startPos.clone().add(dir)};
			
			//const posCross = myMath.intersectionTwoLines_1(v[i], v[i + 1], startPos, startPos.clone().add(dir));
			//if(!posCross) continue;
			
			const posCross = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			if(!posCross) continue;
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], posCross);
			//const onLine = true;
			if(onLine)
			{
				//const dist = posCross.distanceTo(startPos);
				const normal = myMath.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
				
				const dir = v[i + 1].clone().sub(v[i]).normalize();
				dir.x *= stepOffset/2;
				dir.z *= stepOffset/2;
				
				let pos1 = posCross.clone().add(dir);
				let pos2 = posCross.clone().sub(dir);
				
				const newPos1 = this.getPosLimitOnLine({pos: pos1, line});
				const newPos2 = this.getPosLimitOnLine({pos: pos2, line});
				
				const flag1 = (pos1.length() === newPos1.length());
				const flag2 = (pos2.length() === newPos2.length());

				if(!flag1 && flag2)
				{
					pos1 = newPos1;
					pos2 = pos1.clone().sub(dir).sub(dir);
				}
				if(flag1 && !flag2)
				{
					pos2 = newPos2;
					pos1 = pos2.clone().add(dir).add(dir);
				}

				if(!flag1 && !flag2)
				{
					const dir1 = pos1.clone().sub(line.start);
					const dir2 = v[i + 1].clone().sub(v[i]);
					
					const dot = dir1.dot(dir2);
					
					if(dot < 0)
					{
						pos2 = newPos2;
						pos1 = pos2.clone().add(dir).add(dir);											
					}
					else
					{
						pos1 = newPos1;
						pos2 = pos1.clone().sub(dir).sub(dir);						
					}
					//console.log(i, i+1);
				}
				
				const dist = pos2.clone().sub(pos1).divideScalar( 2 ).add(pos1).distanceTo(startPos);
				
				arrP.push({ind: i, dist, pos1, pos2, normal});				
			}
		}
		
		let formPoints2 = [];
		
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; }); 
			
			const pos1 = arrP[0].pos1.clone();
			const pos2 = arrP[0].pos2.clone();
			newPos = arrP[0].pos2.clone();
			
			const helpVisible = true;
			
			if(helpVisible)
			{
				const p1 = this.crHelpBox({pos: pos1, color:  0xff0000});
				this.pointsObj.push(p1);
										
				const p2 = this.crHelpBox({pos: pos2, color:  0x0000ff});
				this.pointsObj.push(p2);			
			}
			
			let v = [...formPoints];

			if(arrP[0].ind === v.length - 1)
			{
				v.splice(arrP[0].ind + 1, 0, pos2);	// встявляем элемент в массив по индексу
				v.splice(0, 0, pos1);				
			}
			else
			{
				v.splice(arrP[0].ind + 1, 0, pos2);	// встявляем элемент в массив по индексу
				v.splice(arrP[0].ind + 2, 0, pos1);	
				
				v = myMath.offsetArrayToFirstElem({arr: v, index: arrP[0].ind + 2});				
			}
			
			formPoints2 = v;
		}

		return { newPos, formPoints2 };
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
	
	
	crLine({pointsPos})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = pointsPos;		
		const material = new THREE.LineBasicMaterial({ color:  0x0000ff });		
		const line = new THREE.Line( geometry, material );
		scene.add( line );

		this.lineWf = line;
		
		this.render();
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
		
		if(this.lineWf)
		{
			this.lineWf.geometry.dispose();
			scene.remove(this.lineWf);			
		}

		this.lineWf = null;
	}
	
	
	render()
	{
		renderCamera();
	}

}







