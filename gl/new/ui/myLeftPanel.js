
// показываем учетную запись, когда пользователь автоизовался 
class MyLeftPanel 
{
	wrap;
	btnShowPanel;
	inputGridSize;
	activeType = 'panelGridGlobal';
	
	constructor()
	{
		this.wrap = document.querySelector('[nameId="gridPanel"]');		
	}
	
	
	init()
	{
		this.crUserPanel();
		this.btnShowPanel = this.crBtnShowGridPanel();		
	}

	crUserPanel()
	{
		this.clearWrap();
		
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		div.children[0];
		
		this.wrap.append(div);

		this.initEventUserPanel();
	}
	
	
	crBtnShowGridPanel()
	{
		const parent = this.wrap.parentElement;
		console.log(2222, parent);
		
		let div = document.createElement('div');
		div.innerHTML = this.html_2();
		div = div.children[0];
		
		this.eventStop({div});	
		
		parent.append(div);
		
		
		div.onmousedown = () => 
		{ 
			showHideGrid({visible: true}); 
			this.showGridPanel();
			this.hideBtnPanel();
		}

		return div;		
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
	
	
	initEventUserPanel()
	{
		const btn1 = this.wrap.querySelector('[nameId="btnClosePanel"]');
		const btn2 = this.wrap.querySelector('[data-action="grid_move_1"]');
		const btn3 = this.wrap.querySelector('[data-action="grid_link_1"]');
		this.inputGridSize = this.wrap.querySelector('[nameId="size-grid-tube-xy-1"]');
		
		btn1.onmousedown = () => 
		{ 
			showHideGrid({visible: false}); 
			this.hideGridPanel();
			this.showBtnPanel();
		}
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
	

	
	// активная панель (для пользователей с подпиской)
	html_1()
	{	
		const cssWrapItem = 
		`position: relative;
		display: flex; 
		justify-content: space-around;
		margin: 12px 3px; 
		height: 36px; 
		font-size: 12px;
		text-transform: uppercase;
		color: #fff;
		border-radius: 4px;		
		user-select: none;
		cursor: pointer;`;
		
		const cssWrapItemDeActive = `background: #736d6d;`;

		const cssBtnSlider = 
		`position: absolute;
		top: 0;
		bottom: 0;
		left: 0; 
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 2px;
		padding: 0 10px;
		color: #6b6565;		
		background: #fff;		
		border-radius: 2px;`;

		const cssIconX =
		`transform: rotate(-45deg);
		font-family: arial,sans-serif;
		font-size: 30px;
		text-align: center;
		text-decoration: none;`;			
	
		const html =
		`<div class="left-input-block">
			<div class="left-input-block-header">глобальная сетка</div>
			
			<div style="${cssWrapItem} ${cssWrapItemDeActive}" nameId="btnClosePanel">
				<div style="${cssBtnSlider}">
					<div>Выкл</div>
					<div style="${cssIconX}">+</div>
				</div>
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


	// кнопка показа панели (когда панель скрыта)
	html_2()
	{
		const style1 =
		`display: none;
		position: relative;
		margin-left: auto;
		margin-right: auto;
		width: 30px;	
		height: 180px;	
		border: 1px solid #b3b3b3; 
		border-radius: 3px;
		background-color:#f1f1f1;		
		box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; 		
		cursor: pointer;`;

		const cssTriangle =
		`margin: auto;
		margin-top: 70px;
		width: 0;
		height: 0;
		border: 0 solid transparent;
		border-top-width: 20px;
		border-bottom-width: 20px;
		border-left: 10px solid #696464;`;		
	
		
	  
		const html =
		`<div nameId="btnShowGridGlobalPanel" style="${style1}">
			<div style="${cssTriangle}">		
			</div>	
		</div>`;

		return html;
	}
	

	
	setValueInputGridSize(value)
	{
		if(!this.inputGridSize) return;
		
		this.inputGridSize.value = value;
	}
	
	
	getActiveType()
	{
		return this.activeType;
	}
	
	// показать основную панель
	showGridPanel()
	{
		this.wrap.style.display = '';
		this.activeType = 'panelGridGlobal';
	}
	
	// скрыть основную панель
	hideGridPanel()
	{
		this.wrap.style.display = 'none';		
	}
	
	// показать кнопку для отображения панели
	showBtnPanel()
	{
		this.btnShowPanel.style.display = '';
		this.activeType = 'btnGridGlobal';
	}
	
	// скрыть кнопку для отображения панели
	hideBtnPanel()
	{
		this.btnShowPanel.style.display = 'none';
	}	
}







