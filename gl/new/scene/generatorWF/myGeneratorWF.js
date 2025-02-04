
// автоматическое построение теплого пола
class MyGeneratorWF
{
	
	dataWF = null;	// здесь храниться основная инфа для создания пола
	dataGrid = null;
	posY = 0;
	
	constructor()
	{
		this.posY = infProject.settings.grid.pos.y;
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => 
	{
		if (event.code === 'KeyM') 
		{
			this.initUlitka();
		}

		if (event.code === 'KeyZ') 
		{
			this.initZmyka();
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
		
		this.dataWF = myGeneratorWFUlitka.crUlitka({dataGrid});
		
		const pGrid = this.dataWF.pGrid;
		const contours = this.dataWF.contours;
		const sizeCell = this.dataWF.sizeCell;
		
		const { newPos, dir } = this.setStartPosToolWF();
		
		// создаем выходы у труб для тепл.пола для каждего шага
		myGeneratorWFUlitka.crExits({newPos: newPos.clone(), contours, sizeCell});

		this.render();		
		
		myUiGeneratorWFPanel.showGeneratorWFPanel();

		setLastSelectObj({obj: myGeneratorWFToolP.toolObj});
	}
	
	
	initZmyka()
	{
		this.clearFormsGeneratorWF();
		
		if(!myGridActivate.actDataGrid) return;
		
		const dataGrid = myGridActivate.actDataGrid;
		this.dataGrid = dataGrid;
		deActiveSelected();
		
		this.dataWF = myGeneratorWFZmyka.crZmyka({dataGrid});

		const pGrid = this.dataWF.pGrid;
		const contours = this.dataWF.contours;
		const sizeCell = this.dataWF.sizeCell;
		
		const { newPos, dir } = this.setStartPosToolWF();
		
		myGeneratorWFZmyka.detectCrossLines({startPos: newPos, dir, contours, pGrid});

		this.render();		
		
		myUiGeneratorWFPanel.showGeneratorWFPanel();

		setLastSelectObj({obj: myGeneratorWFToolP.toolObj});
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
		let offsetted_paths = new ClipperLib.Paths();
		co.Execute(offsetted_paths, offset * scale);

		// блокирую сложные формы
		// 1. если контру раздваевается
		// 2. если форма изменилась при уменьшении предидущего контура (уменьшилось число точек, был 5-угольник, стал квадрат)
		if(1===1)
		{
			// 1
			if(offsetted_paths.length > 1)
			{
				offsetted_paths = [offsetted_paths[0]];		// решил не блокировать, а делать только один контур, если их несколько
			}
			
			// 2
			const forms2 = (round > 0) ? forms[round - 1][0].paths : null;
			if(forms2 && offsetted_paths.length > 0)
			{
				//if(offsetted_paths[0].length !== forms2.length) return forms;
			}			
		}

		const arrPos = [];
		
		for ( let i = 0; i < offsetted_paths.length; i++ )
		{
			const path = offsetted_paths[i];
			
			arrPos[i] = [];
			
			for ( let i2 = 0; i2 < path.length; i2++ )
			{
				const pos = path[i2];
				arrPos[i].push(new THREE.Vector3(pos.X / scale, this.posY, pos.Y / scale));				
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
	
	
	// определяем место входа тепл.пола (в момент создания пола)
	setStartPosToolWF()
	{
		const pGrid = this.dataWF.pGrid;		
		
		const n = 1;
		const startPos = pGrid[0].clone().sub(pGrid[n + 0]).divideScalar( 2 ).add(pGrid[n + 0]);
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos});
		myGeneratorWFToolP.showToolP();

		return { newPos, dir };
	}
	
	
	// рисуем линию
	crForm({arrPos, color = 0x0000ff})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = [...arrPos, arrPos[0]];
		//geometry.vertices = [...arrPos];
		
		const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color, lightMap: lightMap_1}) );	
		scene.add( line );
		
		return line;		
	}
	

	// создаем трубы 
	crTubeGeneratorWF()
	{
		if(!this.dataWF) return;
		
		const dataWF = this.dataWF;
		const contours = dataWF.contours;		

		const v = contours[0].line.geometry.vertices;
		const point = [];
		
		for ( let i = 0; i < v.length; i++ )
		{
			point[point.length] = createPointWF({pos: v[i]});
		}							
		
		const line = createLineWF({point, diameter: infProject.settings.wf_tube.d}); 
		
		geometryTubeWF({line, createLine: true});
		
		if(line.userData.wf_line.tube)
		{	
			const tube = line.userData.wf_line.tube;
			tube.userData.wf_tube.color = new THREE.Color(line.userData.wf_line.color);
		}									
	}
	
	
	clearFormsGeneratorWF()
	{
		if(!this.dataWF) return;
		
		const dataWF = this.dataWF;
		const contours = dataWF.contours;
			
		for ( let i = 0; i < contours.length; i++ )
		{						
			const line = contours[i].line;
			
			line.geometry.dispose();
			scene.remove(line);													
		}
		
		this.dataGrid = null;
		this.dataWF = null;
		
		myGeneratorWFToolP.hideToolP();
	}
	
	render()
	{
		renderCamera();
	}	
}







