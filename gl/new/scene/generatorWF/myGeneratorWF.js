
// автоматическое построение теплого пола
class MyGeneratorWF
{
	contours = [];
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
		
		this.crUlitka({dataGrid});
		
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
		
		myGeneratorWFZmyka.crZmyka({dataGrid});
		
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
		
		const sizeCell = dataGrid.grille.sizeCell;
		
		// расчитываем контуры
		const forms = this.calc({forms: [], points: p, offset: sizeCell * -1});

		// объединяем контуры одного уровня в единые контур
		const contours = myGeneratorWFJoinForms.jointCirclesForm({forms});

		// если на прошлом шаге контур разделился на два и мы его объединили в один, 
		// то проверяем чтобы предидущий контур не пересекался с разделенным и при необходимости смещаем
		//myGeneratorWFOffsetStep.upContours({forms, contours});
		

		// рисуем линии контуров
		for ( let i = 0; i < contours.length; i++ )
		{
			let color = 0x0000ff;
			
			if (i % 2 === 0) { console.log(`${i} - четное число.`); color = 0x0000ff; } 
			else { console.log(`${i} - нечетное число.`); color = 0xff0000; }
	
			const line = this.crForm({arrPos: contours[i].path, color});
			contours[i].line = line;									
		}
		
		this.contours = contours;

		// определяем место входа тепл.пола
		const n = 1;
		const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
		const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: dataGrid, contours, sizeCell});
		myGeneratorWFToolP.showToolP();
		
		// создаем выходы у труб для тепл.пола для каждего шага
		myGeneratorWFExits.crExits({newPos: newPos.clone(), contours: this.contours, sizeCell});
		
		
		this.render();		
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
		const contours = this.contours;		
		if(contours.length === 0) return;
		

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
		for ( let i = 0; i < this.contours.length; i++ )
		{						
			const line = this.contours[i].line;
			
			line.geometry.dispose();
			scene.remove(line);													
		}
		
		this.contours = [];
		
		this.dataGrid = null;
		
		myGeneratorWFToolP.hideToolP();
	}
	
	render()
	{
		renderCamera();
	}	
}







