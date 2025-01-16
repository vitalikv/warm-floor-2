
// панель показывается, когда выделен пол 
class MyUiPanelFloor
{
	activated = false;
	wrapBtn;
	btnGrid;
	btnGridHelp;
	divPanel;
	
	constructor()
	{
		//this.init();
		
		const container = document.querySelector('[nameId="bottom_panel_1"]');
		this.divPanel = this.crPanel({container});
		this.btnGrid = container.querySelector('[nameId="btnCrGridAuto"]');
		this.eventStop({div: this.divPanel});
		this.initEventForUser();
	}
	
	// вкл отображение кнопки создания сетки
	init()
	{
		if(this.activated) return; // уже активирована кнопка
		
		this.activated = true;
		
		const container = document.querySelector('[nameId="bottom_panel_1"]');
		//this.wrapBtn = container.querySelector('[nameId="crGridWf"]');
		
		//this.crBtn();
		this.btnGrid = this.wrapBtn.querySelector('[nameId="crBtnGrid"]');
		this.btnGridHelp = this.wrapBtn.querySelector('[nameId="btnGridHelp"]');
		
		this.initEvent();
	}

	crPanel({container})
	{
		let div = document.createElement('div');
		div.innerHTML = this.html_1();
		div = div.children[0];
		
		container.append(div);
		
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
	
	// по клику на кнопки показываем модальное окно с информацией
	initEvent()
	{		
		this.btnGrid.onmousedown = () => { myUiInfoModalWindGrid.showWinInfoTxt(); }	
		this.btnGridHelp.onmousedown = () => { myUiInfoModalWindGrid.showWinVideo(); }		
	}
	
	// для платных пользователей вкл возможность создавать сетку по контуру помещения
	initEventForUser()
	{		
		this.btnGrid.onmousedown = () => { myFloorActivate.crGridAuto() }	
	}	
	
	
	html_1()
	{
		const wrapBtn =
		`display: flex;
		align-items: center;
		width: auto;
		height: 42px;
		margin: auto;
		text-decoration: none;
		text-align: center;
		border: solid 1px #b3b3b3;
		border-radius: 4px;
		font: 18px Arial, Helvetica, sans-serif;
		font-weight: bold;
		color: #737373;
		background-color: #ffffff;
		background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%);
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;
		cursor: pointer;`;
				

		const html =
		`<div class="toolbar" style="user-select: none;">
			<div class="toolbar-header">пол</div>
			<div style="margin: 10px;">								 			
				<div nameId="btnCrGridAuto" class="button1">создать сетку</div>				
			</div>
		</div>`;
		
		return html;
	}	
}







