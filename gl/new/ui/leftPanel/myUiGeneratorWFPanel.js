
// класс для показа панели с генераторм пола + кнопка для отоюражения панели
class MyUiGeneratorWFPanel 
{
	activated = false;
	
	wrap;
	divPanel;
	inputSizeCell;
	dataBtn = {};
	
	divBtnShowPanel = null;
	
	
	init()
	{
		if(this.activated) return; // уже активированная панель
		
		this.activated = true;
		
		this.wrap = document.querySelector('[nameId="bottom_panel_1"]');
		this.crDivPanel();

		this.crDivBtnShowPanel(); // кнопка для показа основной панели
	}

	crDivPanel()
	{
		this.divPanel = document.createElement('div');
		this.divPanel.innerHTML = this.html_1();
		//this.divPanel.style.cssText = 'position: absolute; bottom: 30px;';
		this.divPanel.style.cssText = 'display: none; position: fixed; left: 0px; top: 50%; transform: translateY(-50%);';

		this.eventStop({div: this.divPanel});	
		
		this.wrap.append(this.divPanel);

		this.initEventInputSizeCell();
		this.initEventBtn();
	}


	// кнопка для показа основной панели + события
	crDivBtnShowPanel()
	{
		const wrapBtnShowPanelGenerWF = myUiGridUserPanel.wrapBtnShowPanelGenerWF;
		if(!wrapBtnShowPanelGenerWF) return;
		
		const div = document.createElement('div');
		div.innerHTML = this.html_2();
		this.divBtnShowPanel = div.children[0];

		wrapBtnShowPanelGenerWF.append(this.divBtnShowPanel);
		
		this.divBtnShowPanel.onmousedown = () => 
		{ 
			this.showGeneratorWFPanel();
			myUiGridUserPanel.divPanel.style.display = 'none';			
		}				
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



	initEventBtn()
	{
		const btnCrUlitka = this.divPanel.querySelector('[nameId="btnCrUlitkaWF"]');
		btnCrUlitka.onmousedown = () => 
		{ 
			myGeneratorWF.initUlitka();
		}			
		
		const btn1 = this.divPanel.querySelector('[nameId="btnSaveWF"]');
		btn1.onmousedown = () => 
		{ 
			this.hideGeneratorWFPanel();
			myUiGridUserPanel.divPanel.style.display = '';
			myGeneratorWF.crTubeGeneratorWF({});
		}		
		
		const btn2 = this.divPanel.querySelector('[nameId="btnCancelWF"]');
		btn2.onmousedown = () => 
		{ 
			const dataGrid = myGeneratorWF.dataGrid;
			
			this.hideGeneratorWFPanel();
			myGeneratorWF.clearFormsGeneratorWF();
			
			if(dataGrid)
			{
				myGridActivate.activateDataGrid({dataGrid});
				const rayhit = myGrids.getDataGridForRyahit(dataGrid);
				
				setLastSelectObj({obj: rayhit.object});				
			}
			else
			{
				myUiGridUserPanel.showGridPanel();
			}
		}
	}

	
	// основная панель
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
			
		
		const html =
		`<div style="${style1}">
			<div class="left-input-block-header" style="background: #fff; user-select: none;">генератор теплого пола</div>						
			
			
			<div class="input-height">
				<div class="text_1">отступ<br>от края (cм)</div>
				<input type="text" nameId="gridSizeCell" style="${cssInput_1}" value="">
			</div>
			
			<div style="margin: 10px;">
				<div style="display: flex; margin: 20px auto;">
					<div class="button1" nameId="btnCrUlitkaWF">
						улитка
					</div>				
				</div>

				<div style="display: flex; margin: 20px auto;">
					<div class="button1" nameId="btnCrZmykaWF">
						змейка
					</div>				
				</div> 	
			</div>
			
			<div>
				<div class="text_1">сохранить</div>
				<div style="display: flex; margin: 10px;">
					<div class="button1" nameId="btnSaveWF">
						&#10003;
					</div>
					<div class="button1" nameId="btnCancelWF">
						&#x2717;
					</div>				
				</div>
			</div>
		</div>`;

		return html;
	}


	// кнопка для показа основной панели
	html_2()
	{						
		const html =
		`<div style="display: flex; width: 30px; background: #736d6d; font-family: arial,sans-serif; user-select: none; cursor: pointer;">
			<div style="margin: auto; writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -2px; color: #fff; font-size: 22px;">
				генератор пола
			</div>
		</div>`;

		return html;
	}
		
	
	// показываем панель сетки
	showGeneratorWFPanel()
	{
		if(!this.activated) return;
		
		this.divPanel.style.display = '';		
	}
	
	// скрываем панель сетки
	hideGeneratorWFPanel()
	{
		if(!this.activated) return;
		
		this.divPanel.style.display = 'none';		
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

	
}













