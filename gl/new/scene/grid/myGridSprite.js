
// отображение размеров пользовательской сетки, когда она активирована или когда строим
class MyGridSprite 
{
	arrSprites = [];
	
	constructor()
	{
		
	}


	// создание sprite
	crGridSprite({points, text = '0', sizeText = '85', geometry = infProject.geometry.labelWall}) 
	{	
		const canvs = document.createElement("canvas");
		const ctx = canvs.getContext("2d");
		
		canvs.width = 256*2;
		canvs.height = 256;
		
		ctx.font = sizeText + 'pt Arial';		

		ctx.fillStyle = 'rgba(82,82,82,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, canvs.width / 2, canvs.height / 2 );	
		
		const texture = new THREE.Texture(canvs);
		texture.needsUpdate = true;	
		
		const material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.5, depthTest: false});		
		
		const sprite = new THREE.Mesh(geometry, material);
		sprite.userData = { line: [points[0], points[1]] };		
		sprite.visible = true;
		sprite.renderOrder = 1.1;
		scene.add( sprite );

		this.arrSprites.push(sprite);
		
		return sprite;
	}	
	
	
	// создаем новые sprites и показываем
	show({points, loop = true})
	{
		this.hide();
		const arrP = loop ? [...points, points[0]] : [...points];
		
		for ( let i = 0; i < arrP.length - 1; i++ )
		{
			const p1 = arrP[i];
			const p2 = arrP[i + 1];
			
			this.crGridSprite({points: [p1, p2]});
		}
		
		
		this.setPosRot();
		
		this.upCanvasGridSprites();
	}
	
	
	// устанавливаем всем sprites позицию и поворот
	setPosRot()
	{
		const sprites = this.arrSprites;
		
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
	upCanvasGridSprites()
	{
		const sprites = this.arrSprites;
		
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
	
	
	// обновляем положение и текст и всех sprites
	upGridSprites()
	{
		this.setPosRot();
		
		this.upCanvasGridSprites();		
	}
	
	
	hide()
	{
		console.log(555, 'hide');
		
		const sprites = this.arrSprites;
		
		for ( let i = 0; i < sprites.length; i++ )
		{
			scene.remove(sprites[i]);
			disposeNode(sprites[i]);
		}

		this.arrSprites = [];
	}
	
	delete()
	{
		
	}
}







