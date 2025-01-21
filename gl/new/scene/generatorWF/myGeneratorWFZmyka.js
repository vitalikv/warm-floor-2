
// построенного пола змейка
class MyGeneratorWFZmyka 
{
	pointsObj = [];
	linesObj = [];

	// создаем змейку
	crZmyka({dataGrid})
	{
		const p = [];
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		
		for ( let i = 0; i < points.length; i++ )
		{
			p.push(points[i].position.clone());
		}
		
		const sizeCell = dataGrid.grille.sizeCell;
		
		// расчитываем контуры
		const forms = myGeneratorWF.calc({forms: [], points: p, offset: sizeCell * -1});

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
		const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: dataGrid, contours, sizeCell});
		myGeneratorWFToolP.showToolP();
		
		// создаем выходы у труб для тепл.пола для каждего шага
		//myGeneratorWFExits.crExits({newPos: newPos.clone(), contours, sizeCell});
		
		this.detectCrossLines({startPos: newPos, dir, contours});
		
		this.render();		
	}
	
	
	detectCrossLines({startPos, dir, contours, sizeCell = 0.2})
	{
		this.delete();
		if(contours.length === 0) return;
		
		const v = [...contours[0].path];
		const arrP = [];
		
		for ( let i = 0; i < v.length; i++ )
		{
			const v1 = v[i];
			const v2 = (i + 1 > v.length - 1) ? v[0] : v[i + 1];
			
			const pos = myMath.getIntersection(startPos, startPos.clone().add(dir), v1, v2);
			if(!pos) continue;
			
			const onLine = myMath.isPointOnSegment2({point1: v1, point2: v2, targetPoint: pos});
			
			if(onLine)
			{				
				const dist = pos.distanceTo(startPos);				
				arrP.push({dist, pos});
			}				
		}

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
		
		const arrP2 = [];
		
		for ( let i = 0; i < arrL.length; i++ )
		{
			const v1 = arrL[i].v[0];
			const v2 = arrL[i].v[1];
			
			for ( let i2 = 0; i2 < v.length; i2++ )
			{
				const v3 = v[i2];
				const v4 = (i2 + 1 > v.length - 1) ? v[0] : v[i2 + 1];

				const pos = myMath.getIntersection(v1, v2, v3, v4);
				if(!pos) continue;
				
				const onLine = myMath.isPointOnSegment2({point1: v3, point2: v4, targetPoint: pos});
				
				if(onLine)
				{				
					const dist = pos.distanceTo(startPos);
					
					arrP2.push({dist, pos});

					this.crHelpBox({pos});
				}				
				
			}
			
		}
		
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
		console.log(111, arrP3)
		this.crHelpLine({v: arrP3});
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


	crHelpLine({v})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = v;			
		const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0xff0000, lightMap: lightMap_1}) );	
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







