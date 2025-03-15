
// sprite для выноски с текстом
class MyNoteMarkerSprite
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;
	
	
	// создание sprite
	crSprite({point, text = '', sizeText = '55', borderColor = 'rgba(0,0,0,1)', geometry = infProject.geometry.labelWall}) 
	{	
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		
		const screenResolution = 256;
		
		canvas.width = screenResolution * 2;
		canvas.height = screenResolution;
		
		ctx.font = sizeText + 'px Arial';		

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
		
		const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});		
		
		const sprite = new THREE.Mesh(geometry, material);
		sprite.userData = { point };
		sprite.userData.tag = 'noteMarkerSprite';
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
		sprite.position.copy(pos.add(new THREE.Vector3(0, 0.01, 0)));		
	}
	
	
	// обвноляем всем sprites изображение с текстом
	upSpriteText({sprite, actBorderColor = false})
	{	
		const borderColor = (!actBorderColor) ? 'rgba(0,0,0,1)' : '#ff0000';
		this.upCanvasSprite({sprite, borderColor});			
	}
	
	
	// меняем изображение на canvas
	upCanvasSprite({sprite, sizeText = '55', borderColor = 'rgba(0,0,0,1)'})  
	{		
		const canvas = sprite.material.map.image; 
		const ctx = canvas.getContext("2d");

		const text = myNoteMarkerInput.getTextFromSprite({sprite});
		
		// измение размера canvas , чтобы текст помещался
		if(1==2)
		{
			let screenResolution = 256;
			
			// если текст не помещается в область, то меняем разрешение canvas, чтобы целиком попадал в sprite 
			if(text.length > 13)
			{
				const kof = (text.length/13 - 1);
				screenResolution = kof * screenResolution + screenResolution;
			}
			
			canvas.width = screenResolution * 2;
			canvas.height = screenResolution;			
		}

		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Автоматически уменьшаем размер текста
		this.autoResizeText({ctx, canvas, text, initialFontSize: Number(sizeText)});

		if(1 === 1)
		{
			ctx.fillStyle = borderColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);	 	
		}
		
		ctx.fillStyle = '#222222';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, canvas.width / 2, canvas.height / 2 );
		
		sprite.material.map.needsUpdate = true;
	} 


	// Функция для автоматического уменьшения размера текста canvas чтобы полностью попадал в sprite
	autoResizeText({ctx, canvas, text, initialFontSize}) 
	{
		const maxWidth = canvas.width - 20; // Максимальная ширина текста (с отступами)
		const maxHeight = canvas.height - 20; // Максимальная высота текста (с отступами)
		
		let fontSize = initialFontSize;
		ctx.font = `${fontSize}px Arial`; // Устанавливаем начальный размер шрифта

		// Проверяем, помещается ли текст в заданные границы
		// Минимальный размер шрифта (10px)
		while (fontSize > 10) 
		{ 
			const lines = text.split('\n'); // Разбиваем текст на строки
			let totalHeight = 0; // Общая высота текста
			let fits = true; // Флаг, указывающий, помещается ли текст

			// Проверяем каждую строку
			for (const line of lines) 
			{
				const metrics = ctx.measureText(line); // Измеряем ширину строки
				if (metrics.width > maxWidth) 
				{
					fits = false; // Если строка не помещается, уменьшаем размер шрифта
					break;
				}
				totalHeight += fontSize * 1.2; // Учитываем межстрочный интервал (1.2 * fontSize)
			}

			// Проверяем, помещается ли текст по высоте
			if (totalHeight > maxHeight) 
			{
				fits = false;
			}

			// Если текст помещается, завершаем цикл
			if (fits) 
			{
				break;
			}

			// Уменьшаем размер шрифта
			fontSize -= 1;
			ctx.font = `${fontSize}px Arial`;
		}

		return fontSize; // Возвращаем итоговый размер шрифта
	}
	
	
	// получаем у sprite 2 точки между которыми он должен располагаться
	getPointFromSprite({sprite})
	{
		return sprite.userData.point;
	}
	
	getSpriteFromPoint({point})
	{
		const line = myNoteMarker.getLineFromPoint({point});
		const sprite = (line && line.userData.sprite) ? line.userData.sprite : null;
		
		return sprite;
	}


	// обновляем положение и текст и всех sprites
	upSpriteMarker({sprite})
	{
		this.setPosSprite({sprite});
		
		this.upSpriteText({sprite});		
	}	


	// удаляем sprite
	deleteSprite({points})
	{
		const sprite = this.getSpriteFromPoint({point: points[0]});
		
		if(!sprite) return;
		
		myNoteMarkerInput.deleteInputSprite({sprite});
		
		scene.remove(sprite);
		disposeNode(sprite);		
	}

	
	// при активации меняем цвет обводки sprite
	activateSpriteMarker({point})
	{
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upSpriteText({sprite, actBorderColor: true});
	}

	deActivateSpriteMarker({point})
	{
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upSpriteText({sprite, actBorderColor: false});		
	}
	
	
	// определяем объект на который указывает targetObj и меняем текст sprite	
	// targetObj - конус стрелки
	rayDetectObj({targetObj})
	{
		const posScreen = myNoteMarkerInput.getPosScreen({obj: targetObj});
		
		const lines = infProject.scene.array.tube;
		const tubes = [];
		
		for ( let i = 0; i < lines.length; i++ )
		{				
			if(lines[i].userData.wf_line.tube)
			{
				tubes.push(lines[i].userData.wf_line.tube);
			}
		}
		
		const arr = [];		
		arr.push(...infProject.scene.array.door);
		arr.push(...infProject.scene.array.window);
		arr.push(...infProject.scene.array.wall);
		arr.push(...infProject.scene.array.obj);		
		arr.push(...tubes);
		
		let text = null;
		 
		const intersects = rayIntersect({clientX: posScreen.x, clientY: posScreen.y}, arr, 'arr');
		
		if (intersects.length > 0) 
		{	
			if(camera === camera3D)
			{
				const dist = intersects[0].point.distanceTo(targetObj.position);
				if(dist > 0.05) return;
			}
			
			const result = intersects.find(item => item.object.userData && (item.object.userData.tag === 'window' || item.object.userData.tag === 'door'));
			
			const obj = (result) ? result.object : intersects[0].object;
			
			if(obj.userData && obj.userData.tag === 'wall')
			{
				text = 'стена';
			}
			else if(obj.userData && obj.userData.tag === 'window')
			{
				text = 'окно';
			}	
			else if(obj.userData && obj.userData.tag === 'door')
			{
				text = 'дверь';
			}			
			else if(obj.userData && obj.userData.tag === 'obj')
			{
				text = obj.userData.obj3D.nameRus;
			}
			else if(obj.userData && obj.userData.wf_tube)
			{
				let line = null;
				
				for ( let i = 0; i < lines.length; i++ )
				{				
					if(lines[i].userData.wf_line.tube && lines[i].userData.wf_line.tube === obj)
					{
						line = lines[i];
						break;
					}
				}
				 
				if(!line) return;
				
				const v = line.geometry.vertices;
				let length = 0;
				
				for(let i = 0; i < v.length - 1; i++)
				{
					length += v[i].distanceTo(v[i + 1]);
				}
				
				const txt1 = (line.userData.wf_line.diameter * 1000);
				const txt2 = (Math.round(length * 100)/100) + 'м';
				text = 'труба ' + txt1 + ' (' + txt2 + ')';				
			}			
		}
		
		
		if(!text) return;

		const sprite = this.getSpriteFromPoint({point: targetObj});
		myNoteMarkerInput.setSpriteText({sprite, text});
		this.upSpriteText({sprite, actBorderColor: true});			
					
		
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
		myNoteMarker.activateNoteMarker({obj: point});
		
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

		const point = this.getPointFromSprite({sprite: obj});
		point.position.add( offset );
		
		myNoteMarker.upGeometryLine({point});		
	}	
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}	
}







