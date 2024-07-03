
// кнопка для создания сетки для теплого пола 
class MyUiBtnGrid 
{
	activated = false;
	wrapBtn;
	btnGrid;
	btnGridHelp;

	constructor()
	{
		this.init();
	}
	
	// вкл отображение кнопки создания сетки
	init()
	{
		if(this.activated) return; // уже активирована кнопка
		
		this.activated = true;
		
		const container = document.querySelector('[nameId="top_menu_b1"]');
		this.wrapBtn = container.querySelector('[nameId="crGridWf"]');
		
		this.crBtn();
		this.btnGrid = this.wrapBtn.querySelector('[nameId="crBtnGrid"]');
		this.btnGridHelp = this.wrapBtn.querySelector('[nameId="btnGridHelp"]');
		
		this.initEvent();
	}

	crBtn()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html_1();
		div = div.children[0];
		
		this.wrapBtn.append(div);
		
		return div;
	}
	
	// по клику на кнопки показываем модальное окно с информацией
	initEvent()
	{		
		this.btnGrid.onmousedown = () => { myUiInfoModalWindGrid.showWinInfoTxt(); }	
		this.btnGridHelp.onmousedown = () => { myUiInfoModalWindGrid.showWinVideo(); }		
	}
	
	// для платных пользователей вкл возможность рисовать свою сетку
	initEventForUser()
	{		
		this.btnGrid.onmousedown = () => { clickInterface({button: 'crGridPoint'}); }	
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
		`<div style="${wrapBtn}">
			<div nameId="btnGridHelp" style="display: flex; height: 100%; padding: 11px;">
				<img src="${infProject.path}img/svg/question_1.svg" style="width: 25px;">
			</div>
			<div style="height: 100%; border-left: solid 1px #b3b3b3;"></div>
			<div nameId="crBtnGrid" style="display: flex; align-items: center; height: 100%; padding: 11px;">
				<div>Сетка</div>
			</div>
		</div>`;

		return html;
	}	
}







