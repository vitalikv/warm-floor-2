
// автоматическое построение теплого пола
class MyGeneratorWF 
{
	forms = [];
	
	constructor()
	{
		document.addEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => 
	{
		if (event.code === 'KeyM') 
		{
			if(!myGridActivate.actDataGrid) return;
			
			const p = [];
			const points = myGridActivate.actDataGrid.points;
			
			for ( let i = 0; i < points.length; i++ )
			{
				p.push(points[i].position.clone());
			}
			
			this.clearForms();
			
			let paths = myGeneratorWF.calc({points: p, offset: -myGridActivate.actDataGrid.grille.sizeCell});


			console.log(777777777, this.forms);
			



			const formSteps = [];
			for ( let i = 0; i < this.forms.length; i++ )
			{
				formSteps[i] = [];
				
				for ( let i2 = 0; i2 < this.forms[i].length; i2++ )
				{
					console.log(this.forms[i][i2])
					formSteps[i][i2] = this.forms[i][i2].paths;
					//formSteps[i][i2].push(this.forms[i].paths);
				}
				
			}

			const n = 1;
			const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
			const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: myGridActivate.actDataGrid, dataForms: this.forms});
			
			//myGeneratorWFJoinForms.crExits({startPos: newPos.clone(), formSteps});
			//myGeneratorWFJoinForms.joinForms({startPos: newPos.clone(), dir, formSteps});
			
			this.render();
		}
	};
	
	
	// на вход контур сетки
	calc({points, offset = -0.2, round = 0})
	{
		
		const p = [];
		const scale = 100;
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
		
		
		if(arrPos.length > 0 && !this.forms[round]) this.forms[round] = [];
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) 
			{
				const line = this.crForm({arrPos: arrPos[i]});
				this.forms[round].push({ paths: arrPos[i], line });
			}
		} 
		
		round++;
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) this.calc({points: arrPos[i], offset, round});
		}		


		return arrPos;
	}
	
	// рисуем линию
	crForm({arrPos})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = [...arrPos, arrPos[0]];
		
		const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0x0000ff, lightMap: lightMap_1}) );	
		scene.add( line );
		
		return line;		
	}


	clearForms()
	{
		for ( let i = 0; i < this.forms.length; i++ )
		{						
			for ( let i2 = 0; i2 < this.forms[i].length; i2++ )
			{
				const line = this.forms[i][i2].line;
				
				line.geometry.dispose();
				scene.remove(line);										
			}			
		}
		
		this.forms = [];
	}
	
	render()
	{
		renderCamera();
	}	
}







