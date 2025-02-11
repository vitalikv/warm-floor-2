
// инструмент выноски с текстом
class MyNoteMarker
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

		obj.userData.tag = 'noteMarkerPoint';
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
		
		const sprite = this.show({points});
		line.userData.sprite = sprite;
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
		
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upSpriteMarker({sprite});		
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
	setPointsMarkerTag({points})
	{
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.tag = 'noteMarkerPoint';
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

		this.activateNoteMarker({obj});
		
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
	
	
	activateNoteMarker({obj})
	{
		this.setColorNoteMarker({obj, color: this.actColor});
	}
	
	deActivateNoteMarker({obj})
	{
		this.setColorNoteMarker({obj, color: this.defColor});
	}	
	
	
	// получаем структуру data (для создания, удаления, выделения) линийки
	getStructure({obj})
	{
		let detect = false;
		const structure = { tag: 'noteMarker', points: [], line: null };
		
		if(obj.userData.tag === 'noteMarkerPoint')
		{
			detect = true;
			structure.points = this.getPointsFromPoint({point: obj});
			structure.line = this.getLineFromPoint({point: obj});
			structure.sprite = this.getSpriteFromPoint({point: obj});
		}

		return (!detect) ? null : structure;
	}
	
	
	// ставим цвет для линейки
	setColorNoteMarker({obj, color})
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
	

	deleteNoteMarker({obj})
	{
		const structure = this.getStructure({obj});
		if(!structure) return;
		
		myNotes.deleteDataNote({data: structure});
		
		const points = structure.points;
		const line = structure.line;
		const sprite = structure.sprite;
		
		for ( let i = 0; i < points.length; i++ )
		{				
			scene.remove(points[i]);
		}
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);
		}
		
		if(sprite)
		{				
			scene.remove(sprite);
			disposeNode(sprite);
		}			
	}



	//---
	
	// создание sprite
	crSprite({point, text = '0', sizeText = '85', geometry = infProject.geometry.labelWall}) 
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
		sprite.userData = { point };		
		sprite.visible = true;
		sprite.renderOrder = 1.1;
		scene.add( sprite );
		
		return sprite;
	}

	// создаем новые sprites и показываем
	show({points})
	{		
		const sprite = this.crSprite({point: points[1]});
		
		this.setPosSprite({sprite});
		
		this.upSpriteText({sprite});
		
		return sprite;
	}	


	// устанавливаем sprite позицию
	setPosSprite({sprite})
	{
		const point = this.getPointFromSprite({sprite});
		const pos = point.position.clone();
		sprite.position.copy(pos.add(new THREE.Vector3(0.1, 0, -0.1)));		
	}
	
	
	// обвноляем всем sprites изображение с текстом
	upSpriteText({sprite})
	{		
		this.upCanvasSprite({sprite, text: 'dist'});		
	}
	
	
	// меняем изображение на canvas
	upCanvasSprite({sprite, text, sizeText = '55'})  
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
	getPointFromSprite({sprite})
	{
		return sprite.userData.point;
	}
	
	getSpriteFromPoint({point})
	{
		const line = this.getLineFromPoint({point});
		const sprite = (line && line.userData.sprite) ? line.userData.sprite : null;
		
		return sprite;
	}


	// обновляем положение и текст и всех sprites
	upSpriteMarker({sprite})
	{
		this.setPosSprite({sprite});
		
		this.upSpriteText({sprite});		
	}	
}







