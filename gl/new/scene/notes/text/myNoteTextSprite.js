
// sprite для текста
class MyNoteTextSprite
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;
	
	
	// создание sprite
	crSprite({point, text = 'test text', sizeText = '85', borderColor = 'rgba(0,0,0,1)', geometry = infProject.geometry.labelWall}) 
	{	
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		
		canvas.width = 256*2;
		canvas.height = 256;
		
		ctx.font = sizeText + 'pt Arial';		

		if(1 === 1)
		{
			ctx.fillStyle = borderColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);	 	
		}
		
		ctx.fillStyle = 'rgba(82,82,82,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, canvas.width / 2, canvas.height / 2 );	
		
		const texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;	
		
		const material = new THREE.MeshBasicMaterial({map: texture});		
		
		const sprite = new THREE.Mesh(geometry, material);
		sprite.userData = { point };
		sprite.userData.tag = 'noteTextSprite';
		sprite.userData.input = null;
		sprite.userData.text = text;
		sprite.visible = true;
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
		sprite.position.copy(pos.add(new THREE.Vector3(0, 0, -0.1)));		
	}
	
	
	// обвноляем всем sprites изображение с текстом
	upSpriteText({sprite})
	{		
		this.upCanvasSprite({sprite});		
	}
	
	
	// меняем изображение на canvas
	upCanvasSprite({sprite, sizeText = '55', borderColor = 'rgba(0,0,0,1)'})  
	{		
		const canvs = sprite.material.map.image; 
		const ctx = canvs.getContext("2d");
		
		ctx.clearRect(0, 0, canvs.width, canvs.height);
		ctx.font = sizeText + 'pt Arial';		

		if(1 === 1)
		{
			ctx.fillStyle = borderColor;
			ctx.fillRect(0, 0, canvs.width, canvs.height);
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	 	
		}
		
		ctx.fillStyle = '#222222';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(myNoteTextInput.getTextFromSprite({sprite}), canvs.width / 2, canvs.height / 2 );
		
		sprite.material.map.needsUpdate = true;
	}
	
	
	// получаем у sprite 2 точки между которыми он должен располагаться
	getPointFromSprite({sprite})
	{
		return sprite.userData.point;
	}
	
	getSpriteFromPoint({point})
	{
		const line = myNoteText.getLineFromPoint({point});
		const sprite = (line && line.userData.sprite) ? line.userData.sprite : null;
		
		return sprite;
	}


	// обновляем положение и текст и всех sprites
	upSprite({sprite})
	{
		this.setPosSprite({sprite});
		
		this.upSpriteText({sprite});		
	}	


	// удаляем sprite
	deleteSprite({points})
	{
		const sprite = this.getSpriteFromPoint({point: points[0]});
		
		if(!sprite) return;
		
		myNoteTextInput.deleteInputSprite({sprite});
		
		scene.remove(sprite);
		disposeNode(sprite);		
	}

	
	// при активации меняем цвет обводки sprite
	activateSprite({point})
	{
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upCanvasSprite({sprite, borderColor: '#ff0000'});
	}

	deActivateSprite({point})
	{
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upCanvasSprite({sprite});		
	}


	//----
	
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

		const point = this.getPointFromSprite({sprite: obj});
		myNoteText.activateNoteText({obj: point});
		
		this.isDown = true;
		
		myNoteTextInput.crInputHtml({event, sprite: obj});

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

		const point = this.getPointFromSprite({sprite: obj});
		const points = myNoteText.getPointsFromPoint({point});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].position.add( offset );
		}		
		
		myNoteText.upGeometryLine({point});		
	}	
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}	
	
}







