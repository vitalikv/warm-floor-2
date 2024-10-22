
// 
class MyUiGridPanel 
{
	activated = false;
	
	wrap;
	divPanel;
	inputSizeCell;
	dataBtn = {};
	
	wrapBtnShowPanelGenerWF = null;
	
	
	init()
	{
		if(this.activated) return; // уже активированная панель
		
		this.activated = true;
		
		this.wrap = document.querySelector('[nameId="bottom_panel_1"]');
		this.crDivPanel();
		this.hideGridPanel();
		
		this.btnToggleOffset({setAct: 0});
		this.btnToggleLink({setAct: 0});

		this.wrapBtnShowPanelGenerWF = document.querySelector('[nameId="wrapBtnShowPanelGenerWF"]');	
	}

	crDivPanel()
	{
		this.divPanel = document.createElement('div');
		this.divPanel.innerHTML = this.html_1();
		//this.divPanel.style.cssText = 'position: absolute; bottom: 30px;';
		this.divPanel.style.cssText = 'position: fixed; left: 0; top: 50%; transform: translateY(-50%);';

		this.eventStop({div: this.divPanel});	
		
		this.wrap.append(this.divPanel);

		this.initEventInputSizeCell();
		this.initEventBtnSliders();
		this.initEventBtnDeleteGrid();
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

	
	// назначаем событие после ввода и нажания Enter в inpute 
	initEventInputSizeCell()
	{
		this.inputSizeCell = this.divPanel.querySelector('[nameId="gridSizeCell"]');

		this.inputSizeCell.onkeydown = (e) => 
		{			
			if (e.code === 'Enter' || e.code === 'NumpadEnter') 
			{
				this.changeValueInputSizeCell({value: e.target.value});				
			}
		};
	}

	// назначаем событие после переключения кнопок 
	initEventBtnSliders()
	{		
		const div1 = this.divPanel.querySelector('[nameId="btnOffset"]');
		const divTxt1 = div1.querySelector('[nameId="btnOffsetTxt"]');
		
		const div2 = this.divPanel.querySelector('[nameId="btnLink"]');
		const divTxt2 = div2.querySelector('[nameId="btnLinkTxt"]');
		
		this.dataBtn = 
		{
			offset: { div: div1, divTxt: divTxt1, act: 0, mode: [{ txt: 'выкл' }, { txt: 'вкл' }] },
			link: { div: div2, divTxt: divTxt2, act: 0, mode: [{ txt: 'выкл' }, { txt: 'вкл' }] }
		};		
		
		div1.onmousedown = () => { this.btnToggleOffset({}); }	//clickInterface({button:'grid_move_1'});
		div2.onmousedown = () => { this.btnToggleLink({}); }		//clickInterface({button:'grid_link_1'});
	}


	initEventBtnDeleteGrid()
	{
		const btn = this.divPanel.querySelector('[nameId="btnDeleteGrid"]');
		btn.onmousedown = () => { this.btnDeleteGrid(); }
	}

	
	// 
	html_1()
	{
		const style1 = 
		`display: flex; 
		flex-direction: column;
		width: 120px;
		border: 1px solid #b3b3b3;
		border-radius: 3px;
		background-color: #f1f1f1;
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;`;

		
		const cssInput_1 = 
		`display: block;
		width: 90%;
		margin: auto;
		font-size: 18px;		
		text-align: center;
		text-shadow: 0 -1px rgb(46,53,58);
		text-decoration: none;
		line-height: 2em;
		padding: 0;
		outline: none;
		border-radius: 3px;`;
		
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
		const cssWrapItemActive = `background: #45a53a;`;
		
		const cssItemDiv = `display: flex; align-items: center;`;

		const cssBtnSlider = 
		`position: absolute;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		margin: 2px;
		padding: 0 10px;
		color: #6b6565;		
		background: #fff;		
		border-radius: 2px;`;
		
		const cssBtnSliderDeActive = `left: 0; right: auto;`;		
		const cssBtnSliderActive = `left: auto; right: 0;`;		
		
		const html =
		`<div style="display: flex;">
			<div style="${style1}">
				<div class="left-input-block-header" style="background: #fff; user-select: none;">сетка пользователя</div>						
				
				<div class="input-height">
					<div class="text_1">ячейка (cм)</div>
					<input type="text" nameId="gridSizeCell" style="${cssInput_1}" value="">
				</div> 	
								
				
				<div class="text_1">привязка</div>
				<div style="${cssWrapItem} ${cssWrapItemActive}" nameId="btnLink">
					<div style="${cssBtnSlider} ${cssBtnSliderActive}" nameId="btnLinkTxt">Вкл</div>
					<div style="${cssItemDiv}">Выкл</div>
					<div style="${cssItemDiv}">Вкл</div>
				</div>		
			
				<div class="text_1">перемещение</div>
				<div style="${cssWrapItem} ${cssWrapItemActive}" nameId="btnOffset">
					<div style="${cssBtnSlider} ${cssBtnSliderActive}" nameId="btnOffsetTxt">Вкл</div>
					<div style="${cssItemDiv}">Выкл</div>
					<div style="${cssItemDiv}">Вкл</div>
				</div>

					<div style="display: flex; margin: 10px;">
						<div class="button1" nameId="btnDeleteGrid">
							<img src="${infProject.path}img/waste.png">
						</div>
					</div>				
			</div>
			
			<div style="display: flex;" nameId="wrapBtnShowPanelGenerWF"></div>
		</div>`;

		return html;
	}
	
	
	// показываем панель сетки
	showGridPanel()
	{
		if(!this.activated) return;
		
		this.divPanel.style.display = '';
		myLeftPanel.wrap.style.display = 'none';
		
		//myUiGeneratorWFPanel.showGeneratorWFPanel();
	}
	
	// скрываем панель сетки
	hideGridPanel()
	{
		if(!this.activated) return;
		
		this.divPanel.style.display = 'none';
		myLeftPanel.wrap.style.display = '';
		
		//myUiGeneratorWFPanel.hideGeneratorWFPanel();
	}	
	
	// переключаем или устанавливаем btn в нужное положение 
	btnToggleOffset({setAct = undefined})
	{
		if(!this.activated) return;
		
		const div = this.dataBtn.offset.div;
		const divTxt = this.dataBtn.offset.divTxt;
		const act = this.dataBtn.offset.act;
		let ind = (act === 0) ? 1 : 0;
		if(setAct !== undefined) ind = setAct;
		
		const txt = this.dataBtn.offset.mode[ind].txt;
		
		this.dataBtn.offset.act = ind;
		
		div.style.background = (ind === 0) ? '#736d6d': '#45a53a';			
		divTxt.innerHTML = txt;
		divTxt.style.left = (ind === 0) ? '0' : 'auto';
		divTxt.style.right = (ind === 0) ? 'auto' : '0';
		
		const dataGrid = myGridActivate.getActDataGrid();
		if(!dataGrid) return;

		myGrids.setModeOffset({dataGrid, act: (ind === 0) ? false: true});
	}
	
	// переключаем или устанавливаем btn в нужное положение
	btnToggleLink({setAct = undefined})
	{
		if(!this.activated) return;
		
		const div = this.dataBtn.link.div;
		const divTxt = this.dataBtn.link.divTxt;
		const act = this.dataBtn.link.act;
		let ind = (act === 0) ? 1 : 0;
		if(setAct !== undefined) ind = setAct;
		
		const txt = this.dataBtn.link.mode[ind].txt;
		
		this.dataBtn.link.act = ind;
		
		div.style.background = (ind === 0) ? '#736d6d': '#45a53a';						
		divTxt.innerHTML = txt;
		divTxt.style.left = (ind === 0) ? '0' : 'auto';
		divTxt.style.right = (ind === 0) ? 'auto' : '0';

		const dataGrid = myGridActivate.getActDataGrid();
		if(!dataGrid) return;

		myGrids.setModeLink({dataGrid, act: (ind === 0) ? false: true});		
	}
	
	setValueInputSizeCell(value)
	{
		if(!this.activated) return;
		if(!this.inputSizeCell) return;
		
		this.inputSizeCell.value = value;
	}
	
	
	// обновляем размер ячейки
	changeValueInputSizeCell({value})
	{
		let size = checkNumberInput({ value, unit: 0.01, limit: {min: 0.05, max: 5} });
		
		if(!size) 
		{
			const oldSizeCell = myGridMesh.getGridMeshSizeCell();
			
			let size = '';
			
			if(oldSizeCell)
			{
				size = oldSizeCell * 100; // перводим в см
			}

			this.setValueInputSizeCell(size);
		}
		else
		{
			myGridMesh.changeGridMeshSizeCell({sizeCell: size});
			size = myGridMesh.getGridMeshSizeCell() * 100; // перводим в см
			
			this.setValueInputSizeCell(size);
		}
		
		renderCamera();
	}

	
	// удаляем сетку по кнопке 
	btnDeleteGrid()
	{
		myGrids.deleteGrid({}); 
	}
}







