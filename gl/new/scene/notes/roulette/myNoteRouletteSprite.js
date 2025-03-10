
// sprite для рулетки
class MyNoteRouletteSprite
{

	
	// создание sprite
	crSprite({points, text = '0', sizeText = '85', geometry = infProject.geometry.labelWall}) 
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
		
		const material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 1});		
		
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
		this.deleteSprites({points});
		
		const sprites = [];
		
		for ( let i = 0; i < points.length - 1; i++ )
		{
			const p1 = points[i];
			const p2 = points[i + 1];
			
			const sprite = this.crSprite({points: [p1, p2]});
			
			sprites.push(sprite);
		}
		
		
		this.setPosRot({sprites});
		
		this.upSpriteText({sprites});
		
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
	upSpriteText({sprites})
	{		
		for ( let i = 0; i < sprites.length; i++ )
		{
			const line = this.getPointsFromSprite({sprite: sprites[i]});
			const p1 = line[0].position.clone();
			const p2 = line[1].position.clone();
			
			let dist = p1.distanceTo(p2);
			dist = Math.round(dist * 100)/100;
			
			this.upCanvasSprite({sprite: sprites[i], text: dist});
		}		
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
	getPointsFromSprite({sprite})
	{
		return [sprite.userData.line[0], sprite.userData.line[1]];
	}
	
	getSpritesFromPoint({point})
	{
		const line = myNoteRoulette.getLineFromPoint({point});
		const sprites = (line && line.userData.sprites) ? line.userData.sprites : [];
		
		return sprites;
	}


	// обновляем положение и текст и всех sprites
	upSprites({sprites})
	{
		this.setPosRot({sprites});
		
		this.upSpriteText({sprites});		
	}


	// удаляем все sprites
	deleteSprites({points})
	{
		const sprites = this.getSpritesFromPoint({point: points[0]});
		
		if(sprites.length === 0) return;
		
		for ( let i = 0; i < sprites.length; i++ )
		{				
			scene.remove(sprites[i]);
			disposeNode(sprites[i]);
		}		
	}
}







