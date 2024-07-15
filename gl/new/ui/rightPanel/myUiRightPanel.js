
// 
class MyUiRightPanel 
{
	wrap;
	divPanel;
	divBtnShowPanel;
	divTabs = {};
	divContents = {};
	divList = {};
	divBtnClose;
	
	constructor()
	{
		this.init();		
	}
	
	init()
	{	
		this.wrap = document.querySelector('.right_panel_1');
		this.divPanel = this.crDivPanel();
		
		this.divBtnClose = this.divPanel.querySelector('[nameId="button_catalog_close"]');
		
		this.divTabs.catalog = this.divPanel.querySelector('[nameId="tabCatalog"]');
		this.divTabs.notes = this.divPanel.querySelector('[nameId="tabNotes"]');
		this.divTabs.listObjs = this.divPanel.querySelector('[nameId="tabListObjs"]');

		this.divContents.catalog = this.divPanel.querySelector('[nameId="contentCatalog"]');
		this.divContents.notes = this.divPanel.querySelector('[nameId="contentNotes"]');
		this.divContents.listObjs = this.divPanel.querySelector('[nameId="contentListObjs"]');
		
		this.divList.catalog = this.divContents.catalog.querySelector('[nameId="listCatalog"]');
		this.divList.notes = this.divContents.notes.querySelector('[nameId="listNotes"]');
		
		this.divBtnShowPanel = this.crDivBtnShowPanel();
		
		this.initEventPanel();
		this.initEventTabs();
		
		this.addListCatalog();
		this.addListNotes();
		
		this.toggleTabs({act: 'notes'});
	}

	crDivPanel()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html_1();
		div = div.children[0];
		
		this.eventStop({div});	
		
		this.wrap.append(div);

		return div;
	}


	crDivBtnShowPanel()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html_2();
		div = div.children[0];
		
		this.eventStop({div});	
		
		this.wrap.append(div);

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

	// назначаем событие (скрываем/показываем панель)
	initEventPanel()
	{		
		this.divBtnClose.onmousedown = () => { this.showHideRightPanel({act: 'btnShowPanel'}); }	
		this.divBtnShowPanel.onmousedown = () => { this.showHideRightPanel({act: 'rightPanel'}); }
	}
	
	
	// назначаем событие по клику на вкладки
	initEventTabs()
	{		
		this.divTabs.catalog.onmousedown = () => { this.toggleTabs({act: 'catalog'}); }
		this.divTabs.notes.onmousedown = () => { this.toggleTabs({act: 'notes'}); }
		this.divTabs.listObjs.onmousedown = () => { this.toggleTabs({act: 'listObjs'}); }
	}

	
	// правая панель
	html_1()
	{
		const styleFlex = `display: flex; flex-direction: column;`;
		
		const style1 =
		`position: relative;
		margin-left: auto;
		margin-right: auto;
		border: 1px solid #b3b3b3; 
		border-radius: 3px;
		background-color:#f1f1f1;		 
		box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;`;

		const btnClose =
		`position: absolute;
		width: 30px;	
		height: 30px;
		top: 10px;
		right: 10px;
		transform: rotate(-45deg);
		font-family: arial,sans-serif;
		font-size: 50px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;`; 		
	
		
	  
		const html =
		`<div style="${styleFlex} ${style1}" nameId="panel_catalog_1">
			<div style="margin-bottom: 10px; border-bottom: 1px solid #ccc;">
				<div style="position: relative; display: flex; margin: 10px 10px 0 10px;">
					<div class="right_panel_1_item_block" nameId="tabCatalog">
						<div class="right_panel_1_item_block_text">
							каталог
						</div>	
					</div>
					<div class="right_panel_1_item_block" nameId="tabNotes">
						<div class="right_panel_1_item_block_text">
							выноски
						</div>	
					</div>					
					<div class="right_panel_1_item_block" nameId="tabListObjs">
						<div class="right_panel_1_item_block_text">
							список
						</div>	
					</div>			
				</div>
				<div nameId="button_catalog_close" style="${btnClose}">+</div>
			</div>

			<div class="right_panel_1_1_wrap" nameId="contentCatalog">
				<div class="right_panel_1_1_h">Каталог</div>
				
				<div class="right_panel_1_1_list" nameId="listCatalog"></div>
			</div>

			<div class="right_panel_1_1_wrap" nameId="contentNotes" style="display: none;">
				<div class="right_panel_1_1_h">Выноски</div>
				
				<div class="right_panel_1_1_list" nameId="listNotes"></div>
			</div>
			
			<div class="right_panel_1_1_wrap" nameId="contentListObjs" style="display: none;">
				<div class="right_panel_1_1_h">Список материалов</div>
				
				<div class="right_panel_1_1_list" list_ui="wf"></div>
			</div>			
		</div>`;

		return html;
	}

	
	// кнопка показа панели
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
		border-right: 10px solid #696464;`;		
	
		
	  
		const html =
		`<div nameId="button_show_panel_catalog" style="${style1}">
			<div style="${cssTriangle}">		
			</div>	
		</div>`;

		return html;
	}
	
	
	
	// переключаем вкладки
	toggleTabs({act})
	{
		const contents = this.divContents;
		
		for (const key in contents) 
		{
			contents[key].style.display = 'none';
		}

		contents[act].style.display = '';
	}


	// скрываем/показываем правую панель
	showHideRightPanel({act})
	{
		
		this.divPanel.style.display = 'none';
		this.divBtnShowPanel.style.display = 'none';
		
		if(act === 'rightPanel') { this.divPanel.style.display = ''; }
		else { this.divBtnShowPanel.style.display = ''; }
	}


	// наполняем каталог объектами
	addListCatalog()
	{
		const arr = [];
		
		arr[0] = {lotid: 1, name: 'насос'};
		arr[1] = {lotid: 2, name: 'котел'};
		arr[2] = {lotid: 3, name: 'радиатор'};
		arr[3] = {lotid: 4, name: 'расширительный бак'};
		arr[4] = {lotid: 5, name: 'коллектор'};	

		for(let i = 0; i < arr.length; i++)
		{
			const str = 
			'<div class="right_panel_1_1_list_item">\
				<div class="right_panel_1_1_list_item_text">'
					+arr[i].name+
				'</div>\
			</div>';

			let div = document.createElement('div');
			div.innerHTML = str;
			div = div.children[0];			
			this.divList.catalog.append(div);
			
			div.onmousedown = () => { clickInterface({button: 'add_lotid', value: arr[i].lotid}); }
		}		
	}
	
	
	// наполняем список выносок
	addListNotes()
	{
		const arr = [];
		
		arr[0] = {lotid: 1, name: 'линейка'};
		arr[1] = {lotid: 2, name: 'рулетка'};
		arr[2] = {lotid: 3, name: 'указатель'};
		arr[3] = {lotid: 4, name: 'текст'};

		for(let i = 0; i < arr.length; i++)
		{
			const str = 
			'<div class="right_panel_1_1_list_item">\
				<div class="right_panel_1_1_list_item_text">'
					+arr[i].name+
				'</div>\
			</div>';

			let div = document.createElement('div');
			div.innerHTML = str;
			div = div.children[0];			
			this.divList.notes.append(div);
			
			div.onmousedown = () => { clickInterface({button: 'addNotes', lotid: arr[i].lotid}); }
		}		
	}	
}







