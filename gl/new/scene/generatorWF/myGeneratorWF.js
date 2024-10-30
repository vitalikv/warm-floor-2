
// автоматическое построение теплого пола
class MyGeneratorWF
{
	contours = [];
	dataGrid = null;
	
	constructor()
	{
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => 
	{
		if (event.code === 'KeyM') 
		{
			this.initUlitka();
		}		
		
		if (event.code === 'KeyT')
		{
			this.crTubeGeneratorWF();
			this.render();
		}
	};
	
	
	initUlitka()
	{
		this.clearFormsGeneratorWF();
		
		if(!myGridActivate.actDataGrid) return;
		
		const dataGrid = myGridActivate.actDataGrid;
		this.dataGrid = dataGrid;
		deActiveSelected();
		
		this.crUlitka({dataGrid});
		
		myUiGeneratorWFPanel.showGeneratorWFPanel();

		setLastSelectObj({obj: myGeneratorWFToolP.toolObj});
	}
	
	
	// создаем улитку
	crUlitka({dataGrid})
	{
		const p = [];
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		
		for ( let i = 0; i < points.length; i++ )
		{
			p.push(points[i].position.clone());
		}
		
		// расчитываем контуры
		const forms = myGeneratorWF.calc({forms: [], points: p, offset: -dataGrid.grille.sizeCell});

		// объединяем контуры одного уровня в единые контур
		const contours = myGeneratorWFJoinForms.jointCirclesForm({forms});

		// проверка на деление контура (если произошло деление, то на каком шаге)
		const isDivide = {divide: false, step: 0};
		for ( let i = 0; i < forms.length; i++ )
		{
			if(forms[i].length === 2) 
			{
				isDivide.divide = true;
				isDivide.step = i;
				break;
			}
		}

		if(isDivide.divide)
		{
			console.log(contours, contours[isDivide.step]);
			
			const path1 = [...contours[isDivide.step - 1].path];
			const path2 = [...contours[isDivide.step].path];
			
			path1.push(path1[0]);
			path2.push(path2[0]);
			
			const arrPoints = [];
			
			for ( let i = 0; i < path1.length - 1; i++ )
			{
				for ( let i2 = 0; i2 < path2.length - 1; i2++ )
				{
					const cross = myMath.checkCrossLine(path1[i], path1[i+1], path2[i2], path2[i2+1]);
					
					if(cross)
					{
						//const pt = myMath.intersectionTwoLines_1({line1: {start: p1, end: p2}, line2: {start: arrPos[i2], end: arrPos[i2+1]}});
						const pt = myMath.intersectionTwoLines_2(path1[i], path1[i+1], path2[i2], path2[i2+1]);
						//myGeneratorWFJoinForms.crHelpBox({pos: pt, color:  0x000000});
						
						arrPoints.push({p: path1[i], crossP: pt, lineId: i+''+(i+1)});
						arrPoints.push({p: path1[i+1], crossP: pt, lineId: i+''+(i+1)});
					}
					
				}
			}
			
			console.log(arrPoints);
			
			const arrPoints2 = [];
			
			for ( let i = 0; i < arrPoints.length; i++ )
			{
				const index = arrPoints2.findIndex((item) => item.p.x === arrPoints[i].p.x && item.p.y === arrPoints[i].p.y && item.p.z === arrPoints[i].p.z);
				
				if(index === -1)
				{
					arrPoints2.push({p: arrPoints[i].p, crossP: [{lineId: arrPoints[i].lineId, p: [arrPoints[i].crossP]}]});
				}
				else
				{
					const index2 = arrPoints2[index].crossP.findIndex((item) => item.lineId === arrPoints[i].lineId);
					
					if(index2 === -1)
					{
						arrPoints2[index].crossP.push({lineId: arrPoints[i].lineId, p: [arrPoints[i].crossP]});
					}
					else
					{
						arrPoints2[index].crossP[index2].p.push(arrPoints[i].crossP);
					}
				}
			}
			
			console.log(122, arrPoints2);
			
			const arrPoints3 = [];
			
			for ( let i = 0; i < arrPoints2.length; i++ )
			{
				if(arrPoints2[i].crossP.length !== 2) continue;
				
				const pos = arrPoints2[i].p;
				
				const n = arrPoints3.length;
				
				arrPoints3[n] = {pos, crossPos: []};
				
				//myGeneratorWFJoinForms.crHelpBox({pos, color: 0xff0000});
				
				for ( let i2 = 0; i2 < arrPoints2[i].crossP.length; i2++ )
				{
					const arrDist = [];
					
					for ( let i3 = 0; i3 < arrPoints2[i].crossP[i2].p.length; i3++ )
					{
						const pos2 = arrPoints2[i].crossP[i2].p[i3];
						
						const dist = pos.distanceTo(pos2);
						
						arrDist.push({pos: pos2, dist});
					}
					
					arrDist.sort((a, b) => { return b.dist - a.dist; }); 	// от большого к меньшему 
					
					arrPoints3[n].crossPos.push(arrDist[0].pos);
					
					//myGeneratorWFJoinForms.crHelpBox({pos: arrDist[0].pos, color:  0x0000ff});
				}
				
				
				console.log(333, arrPoints3);
				
			}
			
			
			for ( let i = 0; i < arrPoints3.length; i++ )
			{
				const pos = arrPoints3[i].pos;
				const crossPos = arrPoints3[i].crossPos;
				
				const v1 = pos.clone().sub(crossPos[0]).normalize();
				const v2 = crossPos[1].clone().sub(pos).normalize();
				const dir = new THREE.Vector3().subVectors( v2, v1 ).normalize();
				
				if(1===1)
				{
					const geometry = new THREE.Geometry();
					geometry.vertices = [pos, pos.clone().add(dir)];				
					const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0x0000ff, lightMap: lightMap_1}) );	
					scene.add( line );									
				}
				
				const pt = myMath.intersectionTwoLines_2(crossPos[0], crossPos[1], pos, pos.clone().add(dir));
				myGeneratorWFJoinForms.crHelpBox({pos: pt, color:  0x000000});

				const dist = pos.distanceTo(pt);
				
				
				for ( let i2 = 0; i2 < path1.length - 1; i2++ )
				{
					if(path1[i2].length() === pos.length())
					{
						myGeneratorWFJoinForms.crHelpBox({pos: path1[i2], color:  0x000000});
						
						const offset = new THREE.Vector3().addScaledVector( dir, dist );
						path1[i2].add(offset);
					}
				}
			}
			
		}
			

		// рисуем линии контуров
		for ( let i = 0; i < contours.length; i++ )
		{
			const line = this.crForm({arrPos: contours[i].path});
			contours[i].line = line;									
		}
		
		this.contours = contours;

		// ставим выходы труб у тепл.пола
		const n = 1;
		const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: dataGrid, contours});
		
		
		this.render();		
	}
	
	
	// создаем трубы 
	crTubeGeneratorWF()
	{
		const contours = this.contours;
		
		if(contours.length === 0) return;
				
		
		for ( let i = 0; i < contours.length; i++ )
		{
			const p = [];
			for ( let i2 = 0; i2 < contours[i].path.length; i2++ )
			{
				p[p.length] = createPointWF({pos: contours[i].path[i2]});
			}
			
			const line = createLineWF({point: p, diameter: infProject.settings.wf_tube.d}); 
			
			geometryTubeWF({line, createLine: true});
			
			if(line.userData.wf_line.tube)
			{	
				const tube = line.userData.wf_line.tube;
				tube.userData.wf_tube.color = new THREE.Color(line.userData.wf_line.color);
			}		
		}			
		
	}
	
	// на вход контур сетки
	calc({forms, points, offset = -0.2, round = 0})
	{
		
		const p = [];
		const scale = 100;	// важно иначе не правильно работает алгоритм
		for ( let i = 0; i < points.length; i++ )
		{
			p.push({X: points[i].x * scale, Y: points[i].z * scale});
		}
				
		const paths = [p];
						 
		const co = new ClipperLib.ClipperOffset(2, 0.25);
		co.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
		const offsetted_paths = new ClipperLib.Paths();
		co.Execute(offsetted_paths, offset * scale);


		const arrPos = [];
		
		for ( let i = 0; i < offsetted_paths.length; i++ )
		{
			const path = offsetted_paths[i];
			
			arrPos[i] = [];
			
			for ( let i2 = 0; i2 < path.length; i2++ )
			{
				const pos = path[i2];
				arrPos[i].push(new THREE.Vector3(pos.X / scale, 0, pos.Y / scale));				
			}
		}
		
		
		if(arrPos.length > 0 && !forms[round]) forms[round] = [];
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) forms[round].push({ paths: arrPos[i] });
		} 
		
		round++;
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) this.calc({forms, points: arrPos[i], offset, round});
		}

		return forms;
	}
	
	
	// рисуем линию
	crForm({arrPos})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = [...arrPos, arrPos[0]];
		//geometry.vertices = [...arrPos];
		
		const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0x0000ff, lightMap: lightMap_1}) );	
		scene.add( line );
		
		return line;		
	}
	

	clearFormsGeneratorWF()
	{
		for ( let i = 0; i < this.contours.length; i++ )
		{						
			const line = this.contours[i].line;
			
			line.geometry.dispose();
			scene.remove(line);													
		}
		
		this.contours = [];
		
		this.dataGrid = null;
	}
	
	render()
	{
		renderCamera();
	}	
}







