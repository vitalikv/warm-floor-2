
// sprite для текста
class MyNoteTextSprite
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();	
	actObj = null;
	
	
	// создание sprite
	crSprite({point, text = 'текст', sizeText = '85', borderColor = 'rgba(0,0,0,1)', geometry = infProject.geometry.labelWall}) 
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
		
		const text = myNoteTextInput.getTextFromSprite({sprite});
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		

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

		//ctx.fillText(text, canvas.width / 2, canvas.height / 2 );		старый метод, просто отображения текста
		this.drawText({text, canvas, ctx, sizeText});
		
		sprite.material.map.needsUpdate = true;
	}


	// Функция для отрисовки текста с учетом переносов строк и автоматического переноса
	drawText({text, canvas, ctx, sizeText}) 
	{
		const x = canvas.width / 2; // Центр canvas по горизонтали
		//let y = canvas.height / 2; // Начальная координата Y (центр canvas)
		const maxWidth = canvas.width - 20; // Максимальная ширина текста (с отступами)
		const maxHeight = canvas.height - 20; // Максимальная высота текста (с отступами)

		// Автоматически уменьшаем размер текста
		const fontSize = this.autoResizeText({ctx, text, maxWidth, maxHeight, initialFontSize: Number(sizeText)});
		
		const lineHeight = Number(fontSize) * 1.5;	// Расстояние между строками
		
		
		// Разбиваем текст на строки по символу \n
		const lines = text.split('\n');

		// Рассчитываем общую высоту текста
		const totalHeight = lines.length * lineHeight;

    // Начинаем отрисовку с учетом центрирования по высоте
    let y = (canvas.height - totalHeight) / 2 + lineHeight / 2; // Центрируем текст по вертикали
	
		// Отрисовываем каждую строку
		lines.forEach((line) => 
		{
			this.wrapText(ctx, line, x, y, maxWidth, lineHeight); // Автоматический перенос текста
			y += lineHeight; // Увеличиваем Y для следующей строки
		});
	}
	
	
	// Функция для автоматического переноса текста (если он длинее canvas)
	wrapText(ctx, text, x, y, maxWidth, lineHeight) 
	{
		const words = text.split(' '); // Разбиваем текст на слова
		let line = ''; // Текущая строка

		for (let i = 0; i < words.length; i++) 
		{
			const testLine = line + words[i] + ' '; // Пробуем добавить слово к текущей строке
			const metrics = ctx.measureText(testLine); // Измеряем ширину текста
			const testWidth = metrics.width;

			if (testWidth > maxWidth && i > 0) 
			{
				// Если строка превышает максимальную ширину, отрисовываем текущую строку
				ctx.fillText(line, x, y);
				line = words[i] + ' '; // Начинаем новую строку
				y += lineHeight; // Увеличиваем координату Y для следующей строки
			} 
			else 
			{
				line = testLine; // Продолжаем добавлять слова к текущей строке
			}
		}

		// Отрисовываем последнюю строку
		ctx.fillText(line, x, y);
	}


	// Функция для автоматического уменьшения размера текста canvas
	autoResizeText({ctx, text, maxWidth, maxHeight, initialFontSize}) 
	{
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
		if(sprite) this.upSpriteText({sprite, actBorderColor: true});
	}

	deActivateSprite({point})
	{
		const sprite = this.getSpriteFromPoint({point});
		if(sprite) this.upSpriteText({sprite, actBorderColor: false});		
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







