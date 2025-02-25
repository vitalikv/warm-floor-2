
// input для маркера
class MyNoteMarkerInput
{
	
	crInputHtml({event, sprite})
	{
		this.deleteInputSprite({sprite});
		
		const div = document.createElement('input');
		//const x = event.clientX;
		//const y = event.clientY;
		
		const {x, y} = this.getPosScreen({obj: sprite});

		div.style.position = 'absolute';

		div.value = this.getTextFromSprite({sprite});
		//div.style.background = 'rgb(255, 255, 255)';
		//div.style.border = 'none';
		div.style.outline = 'none';
		div.style.width = 140 + 'px';
		div.style.height = 70 + 'px';
		div.style.textAlign = 'center';
		//div.style.fontSize = svgText.getAttribute('font-size');
		div.style.fontFamily = 'Arial, sans-serif';
		div.style.fontSize = '14px';
		div.style.boxSizing = 'border-box';
		
		document.body.append(div);
		
		
		const rect = div.getBoundingClientRect();
		div.style.top = y - rect.height/2 + 'px';
		div.style.left = x - rect.width/2 + 'px';				

		
		
		this.setSpriteInput({sprite, input: div});
		
		this.eventStop({div});

		
		setTimeout(() => 
		{
			div.focus();
			
			div.onkeydown = (e2) => 
			{
				//this.fontHtmlSizeAutoAdjustToFit({ input: elem2 });

				if (e2.code === 'Enter') 
				{
					this.setSpriteText({sprite, text: div.value});
					myNoteMarkerSprite.upSpriteText({sprite, actBorderColor: true});
					this.deleteInputSprite({sprite});
					this.render();
				}
			};

			div.onblur = (e2) => 
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







