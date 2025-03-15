
// input для текста
class MyNoteTextInput
{
	
	crInputHtml({event, sprite})
	{
		this.deleteInputSprite({sprite});
		
		const div = document.createElement('textarea');
		//const x = event.clientX;
		//const y = event.clientY;
		
		const {x, y} = this.getPosScreen({obj: sprite});
		const inputSize = myNoteTextSprite.getSpriteInputSize({sprite});
		
		div.style.position = 'absolute';

		div.value = this.getTextFromSprite({sprite});
		//div.style.background = 'rgb(255, 255, 255)';
		//div.style.border = 'none';
		div.style.outline = 'none';
		div.style.width = inputSize.x + 'px';
		div.style.height = inputSize.y + 'px';		 
		div.style.textAlign = 'center';
		div.style.fontFamily = 'Arial, sans-serif';
		div.style.fontSize = '14px';
		div.style.boxSizing = 'border-box';
		div.style.overflow = 'hidden'; // прячем scroll

		document.body.append(div);
		

		// Функция для автоматического изменения ширины и высоты textarea, чтобы подстраивался под размер текста
		const autoResizeTextarea =()=> 
		{
			// Создаем скрытый элемент span для измерения ширины текста
			const hiddenSpan = document.createElement("span");
			hiddenSpan.style.position = "absolute";
			hiddenSpan.style.visibility = "hidden";
			hiddenSpan.style.whiteSpace = "pre"; // Сохраняем пробелы и переносы
			hiddenSpan.style.fontFamily = div.style.fontFamily;
			hiddenSpan.style.fontSize = div.style.fontSize;
			document.body.appendChild(hiddenSpan);	  

			// Устанавливаем текст в скрытый span
			hiddenSpan.textContent = div.value;

			// Измеряем ширину текста
			const textWidth = hiddenSpan.offsetWidth;

			// Устанавливаем ширину textarea на основе ширины текста
			div.style.width = textWidth + 20 + "px"; // +20 для отступов

			// Автоматически изменяем высоту textarea
			div.style.height = div.scrollHeight + 10 + "px";
			
			hiddenSpan.remove();
		}	

		//autoResizeTextarea();
		
		const rect = div.getBoundingClientRect();
		div.style.top = y - rect.height/2 + 'px';
		div.style.left = x - rect.width/2 + 'px';				

				
		this.setSpriteInput({sprite, input: div});
		
		this.eventStop({div});

		setTimeout(() => 
		{
			div.focus();
			
			div.onkeydown = (e) => 
			{
				//this.fontHtmlSizeAutoAdjustToFit({ input: elem2 });
				
				// блокировка длина ввода текста
				const maxLength = 300;
				if (div.value.length >= maxLength && e.key !== 'Backspace') {
				  e.preventDefault(); 
				}
	
				if (e.code === 'Enter') 
				{
					// если зажат shift, то выполняем перенос строки
					if (e.shiftKey) 
					{

					}
					else
					{
						e.preventDefault(); // Отменяем стандартное поведение
						
						this.setSpriteText({sprite, text: div.value});
						myNoteTextSprite.upSpriteText({sprite, actBorderColor: true});
						this.deleteInputSprite({sprite});
						this.render();						
					}
					
				}
			};

			div.onblur = (e) => 
			{
				this.deleteInputSprite({sprite});
				this.render();			
			};

			div.onpaste = (e) => 
			{
				// блокировка длина вставки текста
				const maxLength = 300;
				const pasteText = (e.clipboardData || window.clipboardData).getData('text');
				
				if (div.value.length + pasteText.length > maxLength) 
				{
					e.preventDefault(); // Блокировать вставку
				}					
			};			
			
		}, 0);


		// Отслеживаем изменение размера		
		this.addEvent({div, sprite});		
	}
	
	
	// Отслеживаем изменение размера
	addEvent({div, sprite})
	{
		let widthDisplay = 0;
		let heightDisplay = 0;
		let offset = {x: 0, y: 0};
		
		let isResizing = false;

		// Функция для обновления размеров
		const updateSize = () => 
		{
			const width = div.offsetWidth;
			const height = div.offsetHeight;
			
			div.style.left = parseFloat(div.style.left) + offset.x / 2 + 'px';
			div.style.top = parseFloat(div.style.top) + offset.y / 2 + 'px';
			
			myNoteTextSprite.setSpriteInputSize({sprite, size: {x: width, y: height}});
			myNoteTextSprite.upSpriteText({sprite, actBorderColor: true});
			
			this.render()
		}		
		
		// Начало перетаскивания
		div.onmousedown = (e) => 
		{
			e.stopPropagation();
			
			offset = {x: e.clientX, y: e.clientY};
			
			// Проверяем, что курсор находится в области изменения размера (правый нижний угол)
			const rect = div.getBoundingClientRect();
			const cornerSize = 16; // Размер области перетаскивания (примерно 16x16 пикселей)
			if (e.clientX > rect.right - cornerSize && e.clientY > rect.bottom - cornerSize) 
			{
				isResizing = true;
			}
		};

		// Перетаскивание
		div.onmousemove = (e) => 
		{
			e.stopPropagation();
			
			if (isResizing) 
			{
				offset.x -= e.clientX;
				offset.y -= e.clientY;
				
				updateSize();
				
				offset = {x: e.clientX, y: e.clientY};
			}
		};

		// Завершение перетаскивания
		div.onmouseup = (e) => 
		{
			e.stopPropagation();
			
			isResizing = false;
		};		
	}
	
	// получить позицию объекта из 3D на экран
	getPosScreen({obj})
	{
		// Предположим, у вас есть сцена, камера и объект
		const objectPosition = obj.position.clone(); // Позиция объекта в 3D

		// Проецируем позицию на экран
		const projectedPosition = objectPosition.project(camera);

		// Преобразуем нормализованные координаты в пиксели
		const width = window.innerWidth; // Ширина окна
		const height = window.innerHeight; // Высота окна

		const x = Math.round((projectedPosition.x + 1) * width / 2); // X в пикселях
		const y = Math.round((-projectedPosition.y + 1) * height / 2); // Y в пикселях	

		return {x, y};
	}
	
	// блокируем действия на 3д сцене, когда курсор находится на div
	eventStop({div})
	{
		const arrEvent = ['onmousedown', 'onwheel', 'onmousewheel', 'onmousemove', 'ontouchstart', 'ontouchend', 'ontouchmove'];

		arrEvent.forEach((events) => 
		{
			div[events] = (e) => { e.stopPropagation(); }					
		});			
	}


	// сохраняем в текст что написано на sprite
	setSpriteText({sprite, text})
	{
		sprite.userData.text = encodeURIComponent(text);
	}
		
	// получаем текст что написано на sprite
	getTextFromSprite({sprite})
	{
		return decodeURIComponent(sprite.userData.text);
	}
	
	// при создании input привязываем его к sprite
	setSpriteInput({sprite, input})
	{
		sprite.userData.input = input;
	}
	
	// получаем input привязыванный к sprite
	getInputFromSprite({sprite})
	{
		return sprite.userData.input;
	}
	
	
	// удаляем input
	deleteInputSprite({sprite})
	{
		const input = this.getInputFromSprite({sprite});
		
		if(!input) return;
		
		input.remove();
		
		sprite.userData.input = null;
	}	

	render()
	{
		renderCamera();
	}
	
}







