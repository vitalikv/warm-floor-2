
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

		div.style.position = 'absolute';

		div.value = this.getTextFromSprite({sprite});
		//div.style.background = 'rgb(255, 255, 255)';
		//div.style.border = 'none';
		div.style.outline = 'none';
		div.style.width = 'auto';
		div.style.height = 'auto';		
		div.style.textAlign = 'center';
		div.style.fontFamily = 'Arial, sans-serif';
		div.style.fontSize = '14px';
		div.style.boxSizing = 'border-box';

		document.body.append(div);
		

		// Функция для автоматического изменения ширины и высоты textarea
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

		autoResizeTextarea();
		
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
			
		}, 0);
		
	  
				
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
		sprite.userData.text = text;
	}
		
	// получаем текст что написано на sprite
	getTextFromSprite({sprite})
	{
		return sprite.userData.text;
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







