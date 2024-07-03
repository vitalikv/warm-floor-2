
// кнопка для создания сетки для теплого пола 
class MyBtnGrid 
{
	activated = false;
	wrapBtn;
	btnGrid;
	
	
	init()
	{
		if(this.activated) return; // уже активирована кнопка
		
		this.activated = true;
		
		const container = document.querySelector('[nameId="top_menu_b1"]');
		this.wrapBtn = container.querySelector('[nameId="crGridWf"]');
		
		this.btnGrid = this.crBtn();
		
		this.initEvent();
	}

	crBtn()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		div.children[0];
		
		this.wrapBtn.append(div);
		
		return div;
	}
	
	initEvent()
	{		
		this.btnGrid.onmousedown = () => { clickInterface({button: 'crGridPoint'}); }		
	}
	
	
	html_1()
	{	 
		const html =
		`<div class="button1-wrap-1">
			<div nameId="crBtnGrid" class="button1">Сетка</div>
		</div>`;

		return html;
	}


}







