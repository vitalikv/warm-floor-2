
// класс объединение всех конуров в один
class MyGeneratorWFJoinForms
{

	
	// объединяем в единый контур один ряд (потому что в одном ряду может быть больше одного контура)
	jointCirclesForm({forms})
	{
		const contours = [];
		const furcation = { act: false, contour1: [], contour2: [] };	// произошло развоение контура или нет
		
		for ( let i = 0; i < forms.length; i++ )
		{
			if(forms[i].length === 1)
			{
				contours.push({path: [...forms[i][0].paths]});
			}			
			
			if(forms[i].length === 2)
			{
				const offset = (forms.length - i) * 0.1;
				
				const result = this.nearestPoint({points1: forms[i][0].paths, points2: forms[i][1].paths});
				
				const arrP1 = this.offsetPoints({ind: result.ind1, points: forms[i][0].paths});
				const arrP2 = this.offsetPoints({ind: result.ind2, points: forms[i][1].paths});
				
				let path1 = this.addPointsInForm({arrP: arrP1, points: forms[i][0].paths});
				let path2 = this.addPointsInForm({arrP: arrP2, points: forms[i][1].paths});
				
				const index1 = path1.findIndex((p) => p.length() === result.pos1.length());
				const index2 = path2.findIndex((p) => p.length() === result.pos2.length());
				
				// 2 ближайшие точки разных контуров, делаем в каждом массиве первыми (чтобы удобнее было объединять 2 контура)
				path1 = myMath.offsetArrayToFirstElem({arr: path1, index: index1});
				path2 = myMath.offsetArrayToFirstElem({arr: path2, index: index2});
				
				path1.splice(0, 1);		// удаляем первую точку в каждом контуре (она не нужна, у нас теперь есть раздвоеные точки)
				path2.splice(0, 1);
				
				let path = [...path1, ...path2];
				
				if(furcation.act)
				{
					const p1 = furcation.contour1.map((item)=> item.p1.clone());
					const p2 = furcation.contour1.map((item)=> item.p2.clone());
					const p3 = furcation.contour2.map((item)=> item.p1.clone());
					const p4 = furcation.contour2.map((item)=> item.p2.clone());
					
					const offsetK = (forms.length - i) * 3;
					
					for ( let i = 0; i < p1.length; i++ )
					{
						const dir = p1[i].clone().sub(p2[i]).normalize();
						const dist = p1[i].distanceTo(p2[i]) / offsetK;
						p1[i] = dir.clone().multiplyScalar( -dist ).add(p1[i]);
						p2[i] = dir.clone().multiplyScalar( dist ).add(p2[i]);						
					}

					for ( let i = 0; i < p3.length; i++ )
					{
						const dir = p3[i].clone().sub(p4[i]).normalize();
						const dist = p3[i].distanceTo(p4[i]) / offsetK;
						p3[i] = dir.clone().multiplyScalar( -dist ).add(p3[i]);
						p4[i] = dir.clone().multiplyScalar( dist ).add(p4[i]);						
					}					
					
					path = [...p1, ...path1, ...p2.reverse(), ...p3, ...path2, ...p4.reverse()];
				}
				
				contours.push({path});
				
				furcation.act = true;
				

				furcation.contour1.push({p1: path1[0].clone(), p2: path1[path1.length - 1].clone()});
				furcation.contour2.push({p1: path2[0].clone(), p2: path2[path2.length - 1].clone()});
			}
							
		}				

		return contours;
	}


	// находим 2 ближайшие точки в 2-х массивах (чтобы по ним можно было объединить формы на одном уровне)
	nearestPoint({points1, points2})
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
		
		//this.crHelpBox({pos: points1[arr[0].ind1], color:  0x00ff00});
		//this.crHelpBox({pos: points2[arr[0].ind2], color:  0x00ff00});
		
		return arr[0];
	}


	// отсупаем от точки расстояние и делаем раздвоение
	offsetPoints({ind, points, offset = 0.1})
	{
		const ind1 = ind === 0 ? points.length - 1 : ind - 1;
		const ind2 = ind === points.length - 1 ? 0 : ind + 1;
		
		const dir1 = points[ind1].clone().sub(points[ind]).normalize();
		const pos1 = new THREE.Vector3().addScaledVector( dir1, offset ).add(points[ind]);
		//this.crHelpBox({pos: pos1, color:  0x0000ff});
		
		const dir2 = points[ind2].clone().sub(points[ind]).normalize();
		const pos2 = new THREE.Vector3().addScaledVector( dir2, offset ).add(points[ind]);
		//this.crHelpBox({pos: pos2, color:  0xff0000});

		const result = [{ind, pos: pos1, sng: -1}, {ind, pos: pos2, sng: 0}];
		
		return result;
	}


	// раздвоеные точки вставляем в контур
	addPointsInForm({arrP, points})
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
		
		arrP.sort((a, b) => { return b.ind - a.ind; }); 	// от большого к меньшему (чтобы правильно вставить методом splice)
		
		for ( let i = 0; i < arrP.length; i++ )
		{								
			v.splice(arrP[i].ind + 1, 0, arrP[i].pos);
		}			
		
		return v;
	}


	crHelpBox({pos, size = 0.04, color = 0x00ff00})
	{		
		const geometry = new THREE.BoxGeometry( size, size, size );
		const material = new THREE.MeshBasicMaterial({color});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
	}

	
	render()
	{
		renderCamera();
	}

}







