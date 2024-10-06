
// автоматическое построение теплого пола
class MyGeneratorWF 
{
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
		
			const n = 1;
			const startPos = p[0].clone().sub(p[n + 0]).divideScalar( 2 ).add(p[n + 0]);
			myGeneratorWFToolP.setToolObj({startPos, actDataGrid: myGridActivate.actDataGrid});
			
			myGeneratorWF.calc({points: p, offset: -myGridActivate.actDataGrid.grille.sizeCell});
		}
	};
	
	
	// на вход контур сетки
	calc({points, offset = -0.2})
	{
		console.log(33333, offset);
		
		const p = [];
		const scale = 100;
		for ( let i = 0; i < points.length; i++ )
		{
			p.push({X: points[i].x * scale, Y: points[i].z * scale});
		}
				
		const paths = [p];
						 
		// Possibly ClipperLib.Clipper.SimplifyPolygons() here
		// Possibly ClipperLib.Clipper.CleanPolygons() here
		const co = new ClipperLib.ClipperOffset(2, 0.25);

		// ClipperLib.EndType = {etOpenSquare: 0, etOpenRound: 1, etOpenButt: 2, etClosedPolygon: 3, etClosedLine : 4 };
		co.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
		const offsetted_paths = new ClipperLib.Paths();
		co.Execute(offsetted_paths, offset * scale);

		
		console.log(offsetted_paths);


		const arrPos = [];
		
		for ( let i = 0; i < offsetted_paths.length; i++ )
		{
			const path = offsetted_paths[i];
			
			arrPos[i] = [];
			
			for ( let i2 = 0; i2 < path.length; i2++ )
			{
				const pos = path[i2];
				arrPos[i].push(new THREE.Vector3(pos.X / scale, 1, pos.Y / scale));				
			}
		}
		
		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) this.crForm({arrPos: arrPos[i]});
		}

		for ( let i = 0; i < arrPos.length; i++ )
		{
			if(arrPos[i].length > 0) this.calc({points: arrPos[i], offset});
		}		
	}
	
	crForm({arrPos})
	{		
		arrPos.push(arrPos[0]);
		for ( let i2 = 0; i2 < arrPos.length - 1; i2++ )
		{
			const geometry = new THREE.Geometry();
			geometry.vertices = [arrPos[i2], arrPos[i2+1]];
			
			const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0xff0000, lightMap: lightMap_1}) );	
			scene.add( line );			
		}
			
	}

}







