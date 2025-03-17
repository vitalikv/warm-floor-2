
// класс для выноски (стрелки, линейка, рулетка) тут находятся повторяющиеся элементы
class MyNotesInstance
{
	geomPoint;
	geomCone;
	matDef;
	defColor = 0x000000;
	actColor = 0xff0000;

	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.02, 16, 16 );
		this.geomCone = this.crGeometryCone();
		
		this.matDef = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), transparent: true, lightMap: lightMap_1 });
		//const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), depthTest: false, lightMap: lightMap_1 });
	}
	
	
	// создаем конус
	crGeometryCone()
	{	
		let n = 0;
		const v = [];
		const circle = infProject.geometry.circle;
		
		for ( let i = 0; i < circle.length; i++ )
		{
			v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.001 );
			v[n].y = 0;		
			n++;		
			
			v[n] = new THREE.Vector3();
			v[n].y = 0;
			n++;
			
			v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.02 );
			v[n].y = 0.05;
			n++;	
			
			v[n] = new THREE.Vector3();
			v[n].y = 0.05;
			n++;		
		}	

		const geometry = createGeometryCircle(v);
		geometry.rotateX(Math.PI/2);
		
		return geometry;
	}


	crTube({line, points})
	{
		let pos = [];
			
		for(let i = 0; i < line.geometry.vertices.length; i++)
		{
			pos[i] = line.geometry.vertices[i].clone();
		}
	
		const pipeSpline = new THREE.CatmullRomCurve3(pos);
		pipeSpline.curveType = 'catmullrom';
		pipeSpline.tension = 0;
		 
		let length = 0;
		const v = line.geometry.vertices;	
		for(let i = 0; i < v.length - 1; i++) { length += v[i].distanceTo(v[i + 1]); }		
		
		const params = { extrusionSegments: Math.round(length * 30), radiusSegments: 10, diameter: 0.01, closed: false };
		
		const geometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, params.diameter, params.radiusSegments, params.closed );	
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		const tube = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 1 }) );
		tube.material.visible = false;
		tube.userData.tag = 'noteTubeHelp';
		tube.userData.line = line;
		tube.userData.points = points;
		scene.add( tube );

		return tube; 
	}
	
	upTube({line, tube, points})
	{
		let pos = [];
			
		for(let i = 0; i < line.geometry.vertices.length; i++)
		{
			pos[i] = line.geometry.vertices[i].clone();
		}
	
		const pipeSpline = new THREE.CatmullRomCurve3(pos);
		pipeSpline.curveType = 'catmullrom';
		pipeSpline.tension = 0;
		 
		let length = 0;
		const v = line.geometry.vertices;	
		for(let i = 0; i < v.length - 1; i++) { length += v[i].distanceTo(v[i + 1]); }		
		
		const params = { extrusionSegments: Math.round(length * 30), radiusSegments: 10, diameter: 0.01, closed: false };
		
		const geometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, params.diameter, params.radiusSegments, params.closed );	
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();	
		
		tube.geometry.dispose();
		tube.geometry = geometry;
		tube.userData.points = points;
	}
	
	// назначем линии трубу
	setTube({line, tube})
	{
		line.userData.tube = tube;
	}
	
	// получаем трубу, которая присоединена к линии
	getTube({line})
	{
		return line.userData.tube;
	}

	getPointsFromTube({tube})
	{
		return tube.userData.points;
	}
	
	
	act({tube})
	{
		const points = this.getPointsFromTube({tube});
		const obj = points[0];
		
		if(obj.userData.tag === 'noteRulerPoint')
		{
			myNoteRuler.activateNoteRuler({obj});
		}
		if(obj.userData.tag === 'noteRoulettePoint')
		{
			myNoteRoulette.activateNoteRoulette({obj}); 
		}
		if(obj.userData.tag === 'noteMarkerPoint')
		{
			myNoteMarker.activateNoteMarker({obj});
		}		
	}
	
	deAct({tube})
	{
		const points = this.getPointsFromTube({tube});
		const obj = points[0];
		
		if(obj.userData.tag === 'noteRulerPoint')
		{
			myNoteRuler.deActivateNoteRuler({obj});
		}
		if(obj.userData.tag === 'noteRoulettePoint')
		{
			myNoteRoulette.deActivateNoteRoulette({obj}); 
		}
		if(obj.userData.tag === 'noteMarkerPoint')
		{
			myNoteMarker.deActivateNoteMarker({obj});
		}		
	}

	// удаление когда выделение было через трубу
	deleteActTube({tube})
	{
		const points = this.getPointsFromTube({tube});
		const obj = points[0];
		
		if(obj.userData.tag === 'noteRulerPoint')
		{
			myNoteRuler.deleteNoteRuler({obj});
		}
		if(obj.userData.tag === 'noteRoulettePoint')
		{
			myNoteRoulette.deleteNoteRoulette({obj}); 
		}
		if(obj.userData.tag === 'noteMarkerPoint')
		{
			myNoteMarker.deleteNoteMarker({obj});
		}		
	}	
}







