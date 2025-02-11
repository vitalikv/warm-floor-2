
// инструемент линейка
class MyNoteRuler
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	toolObj = null;	
	actObj = null;

	indPoint = 0;
	geomPoint;
	matDef;
	defColor = 0x000000;
	actColor = 0xff0000;
	

	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.02, 16, 16 );
		this.matDef = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), transparent: true, lightMap: lightMap_1 });
	}	
	

	// точка
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matDef.clone() ); 

		obj.userData.tag = 'noteRulerPoint';
		obj.userData.id = this.indPoint;
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.set(pos.x, pos.y, pos.z);		
		scene.add( obj );
		
		this.indPoint++;

		return obj;
	}
	
	// линия 
	crLine({points})
	{		
		let line = null;
		
		if(!points[0].userData.line)
		{	
			const arrP = [];
			
			for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
			const geometry = new THREE.Geometry();
			geometry.vertices = arrP;
	
			line = new THREE.Line( geometry, this.matDef.clone() );	
			scene.add( line );					
		}
		else
		{
			line = points[0].userData.line;			
		}
		
		for ( let i = 0; i < points.length; i++ )
		{				
			points[i].userData.line = line;
			points[i].userData.points = points;
		}
		
		const sprites = this.show({points});
		line.userData.sprites = sprites;
	}


	// обновляем линию линейки
	upGeometryLine({point})
	{		
		const line = this.getLineFromPoint({point});
		if(!line) return;
		
		const points = this.getPointsFromPoint({point});

		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		
		const geometry = new THREE.Geometry();
		geometry.vertices = arrP;
		//geometry.verticesNeedUpdate = true;
		
		line.geometry.dispose();
		line.geometry = geometry;
		
		const sprites = this.getSpritesFromPoint({point: points[0]});
		if(sprites.length > 0) this.upGridSprites({sprites});		
	}


	// получаем массив точек из точки
	getPointsFromPoint({point})
	{
		return point.userData.points;		
	}
	
	// получаем линию из точки
	getLineFromPoint({point})
	{
		return point.userData.line;		
	}	

	// назначаем tag для точек, когда превращаем их из tool в линейку
	setPointsRulerTag({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'noteRulerPoint';
		}		
	}
	
	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	
		
		this.actObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		

		this.activateNoteRuler({obj});
		
		this.isDown = true;

		return this.actObj;
	}	
	
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		this.isMove = true;
		
		const obj = this.actObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		obj.position.add( offset );

		this.upGeometryLine({point: obj});		
	}	
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}


	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	
	activateNoteRuler({obj})
	{
		this.setColorNoteRuler({obj, color: this.actColor});
	}
	
	deActivateNoteRuler({obj})
	{
		this.setColorNoteRuler({obj, color: this.defColor});
	}	
	
	
	// получаем структуру data (для создания, удаления, выделения) линийки
	getStructure({obj})
	{
		let detect = false;
		const structureRuler = { tag: 'noteRuler', points: [], line: null };
		
		if(obj.userData.tag === 'noteRulerPoint')
		{
			detect = true;
			structureRuler.points = this.getPointsFromPoint({point: obj});
			structureRuler.line = this.getLineFromPoint({point: obj});
			structureRuler.sprites = this.getSpritesFromPoint({point: obj});
		}

		return (!detect) ? null : structureRuler;
	}
	
	
	// ставим цвет для линейки
	setColorNoteRuler({obj, color})
	{
		const structure = this.getStructure({obj});		
		if(!structure) return;
		
		const points = structure.points;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			points[i].material.color = new THREE.Color(color);
		}
		
		structure.line.material.color = new THREE.Color(color);
	}
	

	deleteNoteRuler({obj})
	{
		const structure = this.getStructure({obj});
		if(!structure) return;
		
		myNotes.deleteDataNote({data: structure});
		
		const points = structure.points;
		const line = structure.line;
		const sprites = structure.sprites;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			scene.remove(points[i]);
		}
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
		
		for ( let i = 0; i < sprites.length; i++ )
		{				
			scene.remove(sprites[i]);
			disposeNode(sprites[i]);
		}			
	}



	//---
	
	// создание sprite
	crGridSprite({points, text = '0', sizeText = '85', geometry = infProject.geometry.labelWall}) 
	{	
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		
		canvas.width = 256*2;
		canvas.height = 256;
		
		ctx.font = sizeText + 'pt Arial';		

		ctx.fillStyle = 'rgba(82,82,82,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, canvas.width / 2, canvas.height / 2 );	
		
		const texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;	
		
		const material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.5, depthTest: false});		
		
		const sprite = new THREE.Mesh(geometry, material);
		sprite.userData = { line: [points[0], points[1]] };		
		sprite.visible = true;
		sprite.renderOrder = 1.1;
		scene.add( sprite );
		
		return sprite;
	}

	// создаем новые sprites и показываем
	show({points})
	{
		const sprites = [];
		
		for ( let i = 0; i < points.length - 1; i++ )
		{
			const p1 = points[i];
			const p2 = points[i + 1];
			
			const sprite = this.crGridSprite({points: [p1, p2]});
			
			sprites.push(sprite);
		}
		
		
		this.setPosRot({sprites});
		
		this.upCanvasGridSprites({sprites});
		
		return sprites;
	}	


	// устанавливаем всем sprites позицию и поворот
	setPosRot({sprites})
	{
		
		for ( let i = 0; i < sprites.length; i++ )
		{
			const line = this.getPointsFromSprite({sprite: sprites[i]});
			const p1 = line[0].position.clone();
			const p2 = line[1].position.clone();			
			
			const pos = p2.clone().sub(p1).divideScalar(2).add(p1);			
			sprites[i].position.copy(pos);

			const normal = myMath.calcNormal2D({p1, p2, reverse: true});
			normal.x *= 0.1;
			normal.z *= 0.1;
			sprites[i].position.add(normal);
		}
		
		
		for ( let i = 0; i < sprites.length; i++ )
		{
			const line = this.getPointsFromSprite({sprite: sprites[i]});
			const p1 = line[0].position.clone();
			const p2 = line[1].position.clone();	
			
			const dir = p2.clone().sub(p1);
			let rotY = Math.atan2(dir.x, dir.z);
			
			if(rotY <= 0.001){ rotY += Math.PI / 2; }
			else { rotY -= Math.PI / 2; }

			sprites[i].rotation.set( 0, rotY, 0 );
		}		
	}
	
	
	// обвноляем всем sprites изображение с текстом
	upCanvasGridSprites({sprites})
	{		
		for ( let i = 0; i < sprites.length; i++ )
		{
			const line = this.getPointsFromSprite({sprite: sprites[i]});
			const p1 = line[0].position.clone();
			const p2 = line[1].position.clone();
			
			let dist = p1.distanceTo(p2);
			dist = Math.round(dist * 100)/100;
			
			this.upCanvasGridSprite({sprite: sprites[i], text: dist});
		}		
	}
	
	
	// меняем изображение на canvas
	upCanvasGridSprite({sprite, text, sizeText = '55'})  
	{		
		const canvs = sprite.material.map.image; 
		const ctx = canvs.getContext("2d");
		
		ctx.clearRect(0, 0, canvs.width, canvs.height);
		ctx.font = sizeText + 'pt Arial';		
		
		ctx.fillStyle = '#222222';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text + ' м', canvs.width / 2, canvs.height / 2 );
		
		sprite.material.map.needsUpdate = true;
	}
	
	
	// получаем у sprite 2 точки между которыми он должен располагаться
	getPointsFromSprite({sprite})
	{
		return [sprite.userData.line[0], sprite.userData.line[1]];
	}
	
	getSpritesFromPoint({point})
	{
		const line = this.getLineFromPoint({point});
		const sprites = (line && line.userData.sprites) ? line.userData.sprites : [];
		
		return sprites;
	}


	// обновляем положение и текст и всех sprites
	upGridSprites({sprites})
	{
		this.setPosRot({sprites});
		
		this.upCanvasGridSprites({sprites});		
	}	
}







