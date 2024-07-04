
// показываем учетную запись, когда пользователь автоизовался 
class MyLeftPanel 
{
	wrap;
	inputGridSize;
	btn1;
	
	constructor()
	{
		this.wrap = document.querySelector('[nameId="gridPanel"]');
	}
	
	crDefPanel()
	{
		this.clearWrap();
		
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		div.children[0];
		
		this.wrap.append(div); 
	}

	crUserPanel()
	{
		this.clearWrap();
		
		const div = document.createElement('div');
		div.innerHTML = this.html_2();
		div.children[0];
		
		this.wrap.append(div);

		this.initEventUserPanel();
	}
	
	initEventUserPanel()
	{
		this.btn1 = this.wrap.querySelector('[data-action="grid_show_1"]');
		const btn2 = this.wrap.querySelector('[data-action="grid_move_1"]');
		const btn3 = this.wrap.querySelector('[data-action="grid_link_1"]');
		this.inputGridSize = this.wrap.querySelector('[nameId="size-grid-tube-xy-1"]');
		
		this.btn1.onmousedown = () => { clickInterface({button:'grid_show_1'}); }
		btn2.onmousedown = () => { clickInterface({button:'grid_move_1'}); }
		btn3.onmousedown = () => { clickInterface({button:'grid_link_1'}); }

		this.inputGridSize.onkeydown = (e) => 
		{
			if (e.code === 'Enter' || e.code === 'NumpadEnter') 
			{
				updateGrid({size : e.target.value});
			}
		};		
	}
	
	clearWrap()
	{
		this.wrap.innerHTML = '';
	}
	
	// фиктивная панель (для пользователей без подписки)
	html_1()
	{	
		const css1 = `
		display: flex;
		align-items: center;
		border-radius: 4px;
		height: 36px;
		background: #736d6d;
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;`;
		
		const css2 = `display: flex; align-items: center; justify-content: center; border-radius: 4px; width: 57px; height: 32px;`;	

		const css3 = `margin: 12px 3px;`;
  
		const html =
		`<div class="left-input-block">
			<div class="left-input-block-header">глобальная сетка</div>
			
			<div style="${css3}">
				<div style="${css1}">
					<div style="${css2} margin-left: 2px; background: #fff; color: #6b6565;">ВЫКЛ</div>
					<div style="${css2}">ВКЛ</div>
				</div>
			</div>				
			
			<div class="input-height">
				<div class="text_1">ячейка (cм)</div>
				<input type="text">
			</div> 	
							
			
			<div class="text_1">привязка</div>
			<div style="${css3}">
				<div style="${css1}">
					<div style="${css2} margin-left: 2px; background: #fff; color: #6b6565;">ВЫКЛ</div>
					<div style="${css2}">ВКЛ</div>
				</div>
			</div>		
		
			<div class="text_1">перемещение</div>
			<div style="${css3}">
				<div style="${css1}">
					<div style="${css2} margin-left: 2px; background: #fff; color: #6b6565;">ВЫКЛ</div>
					<div style="${css2}">ВКЛ</div>
				</div>
			</div>			
		</div>`;

		return html;
	}

	
	// активная панель (для пользователей с подпиской)
	html_2()
	{	
		const html =
		`<div class="left-input-block">
			<div class="left-input-block-header">глобальная сетка</div>
			
			<div class="reating-arkows">
			 <input id="a" type="checkbox" checked="checked">
			 <label for="a">
			 <div class="trianglesusing" data-checked="Вкл" data-unchecked="Выкл" data-action ='grid_show_1'></div>
			 </label>
			</div>				
			
			<div class="input-height">
				<div class="text_1">ячейка (cм)</div>
				<input type="text" nameId='size-grid-tube-xy-1' data-input='size-grid-tube-xy-1' value='20'>
			</div> 	
							
			
			<div class="text_1">привязка</div>
			<div class="reating-arkows">
				<input id="a1" type="checkbox">
				<label for="a1">
					<div class="trianglesusing" data-checked="Вкл" data-unchecked="Выкл" data-action ='grid_link_1'></div>
				</label>
			</div>		
		
			<div class="text_1">перемещение</div>
			<div class="reating-arkows">
				<input id="a2" type="checkbox">
				<label for="a2">
					<div class="trianglesusing" data-checked="Вкл" data-unchecked="Выкл" data-action ='grid_move_1'></div>
				</label>
			</div>			
		</div>`;

		return html;
	}
	
	setValueInputGridSize(value)
	{
		if(!this.inputGridSize) return;
		
		this.inputGridSize.value = value;
	}
	
	toggleShowHideGrid()
	{
		this.btn1.click();
		clickInterface({button:'grid_show_1'});		
	}
}







