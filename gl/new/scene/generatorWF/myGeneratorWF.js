
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
			
			const contours = this.jointCirclesForm({forms: this.forms});



			for ( let i = 0; i < contours.length; i++ )
			{
				const line = this.crForm({arrPos: contours[i].paths});
				contours[i].line = line;					

				console.log(contours[i]);				
			}

			this.forms = contours;

			const n = 1;
			const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
			const { newPos, dir } = myGeneratorWFToolP.setToolObj({startPos, actDataGrid: myGridActivate.actDataGrid, dataForms: this.forms});
			
			
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
			if(arrPos[i].length > 0) this.forms[round].push({ paths: arrPos[i], line: null });
		} 
		
		round++;
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) this.calc({points: arrPos[i], offset, round});
		}		
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
	
	
	// объединяем в единый контур один ряд (потому что в одном ряду может быть больше одного контура)
	jointCirclesForm({forms})
	{
		const contours = [];

		const crHelpBox = ({pos, size = 0.04, color = 0x00ff00}) =>
		{
			const geometry = new THREE.BoxGeometry( size, size, size );
			const material = new THREE.MeshBasicMaterial({color});
			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.copy(pos);
			scene.add( mesh );

			return mesh;
		}
	
		// находим 2 ближайшие точки в 2-х массивах
		const nearestPoint = ({points1, points2}) =>
		{
			const arr = [];
			
			for ( let i = 0; i < points1.length; i++ )
			{
				for ( let i2 = 0; i2 < points2.length; i2++ )
				{
					const dist = points1[i].distanceTo(points2[i2]);
					
					arr.push({dist, ind1: i, ind2: i2, pos1: points1[i], pos2: points2[i2]});
				}
			}
			
			arr.sort((a, b) => { return a.dist - b.dist; });
			
			crHelpBox({pos: points1[arr[0].ind1], color:  0x00ff00});
			crHelpBox({pos: points2[arr[0].ind2], color:  0x00ff00});
			
			return arr[0];
		}
		
		
		// отсупаем от точек расстояние и делаем раздвоение
		const offsetPoints = ({ind, points, offset = 0.1}) =>
		{
			const ind1 = ind === 0 ? points.length - 1 : ind - 1;
			const ind2 = ind === points.length - 1 ? 0 : ind + 1;
			
			const dir1 = points[ind1].clone().sub(points[ind]).normalize();
			const pos1 = new THREE.Vector3().addScaledVector( dir1, offset ).add(points[ind]);
			crHelpBox({pos: pos1, color:  0x0000ff});
			
			const dir2 = points[ind2].clone().sub(points[ind]).normalize();
			const pos2 = new THREE.Vector3().addScaledVector( dir2, offset ).add(points[ind]);
			crHelpBox({pos: pos2, color:  0xff0000});

			const result = [{ind, pos: pos1, sng: -1}, {ind, pos: pos2, sng: 0}];
			
			return result;
		}
		
		
		// вставляем точки в контур
		const addPointsInForm = ({arrP, points}) =>
		{
			let v = [...points];
					
			for ( let i = 0; i < arrP.length; i++ )
			{
				let ind = 0;
				if((arrP[i].ind + arrP[i].sng) > points.length - 1)
				{
					ind = 0;
				}
				else if((arrP[i].ind + arrP[i].sng) < 0)
				{
					ind = points.length - 1;
				}
				else
				{
					ind = arrP[i].ind + arrP[i].sng;
				}
				
				
				arrP[i].ind = ind;
			}
			
			arrP.sort((a, b) => { return b.ind - a.ind; }); 	// от большого к меньшему
			
			for ( let i = 0; i < arrP.length; i++ )
			{								
				v.splice(arrP[i].ind + 1, 0, arrP[i].pos);
			}			
			
			return v;
		}
		
		
		
		
		for ( let i = 0; i < forms.length; i++ )
		{
			if(forms[i].length === 1)
			{
				contours.push({paths: [...this.forms[i][0].paths]});
			}			
			
			if(forms[i].length === 2)
			{
				const result = nearestPoint({points1: this.forms[i][0].paths, points2: this.forms[i][1].paths});
				
				const arrP1 = offsetPoints({ind: result.ind1, points: this.forms[i][0].paths});
				const arrP2 = offsetPoints({ind: result.ind2, points: this.forms[i][1].paths});
				
				let path1 = addPointsInForm({arrP: arrP1, points: this.forms[i][0].paths});
				let path2 = addPointsInForm({arrP: arrP2, points: this.forms[i][1].paths});
				
				const index1 = path1.findIndex((p) => p.length() === result.pos1.length());
				const index2 = path2.findIndex((p) => p.length() === result.pos2.length());
				
				console.log(index1, index2)
				path1 = myMath.offsetArrayToFirstElem({arr: path1, index: index1});
				path2 = myMath.offsetArrayToFirstElem({arr: path2, index: index2});
				
				path1.splice(0, 1);		// удаляем первую точку
				path2.splice(0, 1);
				
				contours.push({paths: [...path1, ...path2]});
				//contours.push({paths: path1});
				//contours.push({paths: path2});
			}
							
		}				

		return contours;
	}


	clearForms()
	{
		for ( let i = 0; i < this.forms.length; i++ )
		{						
			const line = this.forms[i].line;
			
			line.geometry.dispose();
			scene.remove(line);													
		}
		
		this.forms = [];
	}
	
	render()
	{
		renderCamera();
	}	
}







