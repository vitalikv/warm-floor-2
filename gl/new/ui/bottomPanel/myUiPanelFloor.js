
// панель показывается, когда выделен пол 
class MyUiPanelFloor
{
	activated = false;	
	btnGrid;
	divPanel;
	
	
	constructor()
	{
		this.init();
	}
	
	// вкл отображение кнопки создания сетки
	init()
	{
		if(this.activated) return; // уже активирована кнопка
		
		this.activated = true;
		
		const container = document.querySelector('[nameId="bottom_panel_1"]');
		this.divPanel = this.crPanel({container});
		this.btnGrid = container.querySelector('[nameId="btnCrGridAuto"]');
		this.eventStop({div: this.divPanel});
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
		

	initEvent()
	{		
		this.btnGrid.onmousedown = () => { myFloorActivate.crGridAuto() }	
	}	
	
	
	html_1()
	{
		const html =
		`<div class="toolbar" style="display: none; user-select: none;">
			<div class="toolbar-header">пол</div>
			<div style="margin: 10px;">								 			
				<div nameId="btnCrGridAuto" class="button1">создать сетку</div>				
			</div>
		</div>`;
		
		return html;
	}

	
	showPanel()
	{
		this.divPanel.style.display = '';
	}
	
	hidePanel()
	{
		this.divPanel.style.display = 'none';
	}	
}







