
// автоматическое построение теплого пола
class MyGeneratorWF
{
	contours = [];
	
	constructor()
	{
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => 
	{
		if (event.code === 'KeyM') 
		{
			this.crUlitka();
		}		
		
		if (event.code === 'KeyT')
		{
			this.crTube();
			this.render();
		}
	};
	
	
	// создаем улитку
	crUlitka()
	{
		if(!myGridActivate.actDataGrid) return;
		
		const p = [];
		const points = myGrids.getPointsFromDataGrid({dataGrid: myGridActivate.actDataGrid});
		
		for ( let i = 0; i < points.length; i++ )
		{
			p.push(points[i].position.clone());
		}
		
		this.clearForms({contours: this.contours});
		
		// расчитываем контуры
		const forms = myGeneratorWF.calc({forms: [], points: p, offset: -myGridActivate.actDataGrid.grille.sizeCell});

		// объединяем контуры одного уровня в единые контур
		const contours = myGeneratorWFJoinForms.jointCirclesForm({forms});


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
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: myGridActivate.actDataGrid, contours});
		
		
		this.render();		
	}
	
	
	// создаем трубы 
	crTube()
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
	

	clearForms({contours})
	{
		for ( let i = 0; i < contours.length; i++ )
		{						
			const line = contours[i].line;
			
			line.geometry.dispose();
			scene.remove(line);													
		}
		
		contours = [];
	}
	
	render()
	{
		renderCamera();
	}	
}







