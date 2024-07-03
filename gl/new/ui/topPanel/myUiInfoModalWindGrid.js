
// 2 информационных окна (с подсказкой, что можно сеткой пользоваться только с подпиской и с видео, как пользоваться) 
class MyUiInfoModalWindGrid 
{
	wrapWind;
	divWindGrid;
	divH1;
	divContent;
	
	constructor()
	{
		this.init();
	}
	
	// создаем пустое модальное окно (с видео или информацией)
	init()
	{
		this.wrapWind = this.crModalWind();
		this.eventStop({div: this.wrapWind});
		
		this.divWindGrid = this.wrapWind.querySelector('[nameId="divInfoWindGrid"]');
		this.divH1 = this.wrapWind.querySelector('[nameId="divH1"]');
		this.divContent = this.wrapWind.querySelector('[nameId="divContent"]');
		
		this.initEvent();
	}


	crModalWind()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html_1();
		div = div.children[0];	
		
		const container = document.querySelector('.top_panel_2');
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
		this.wrapWind.onmousedown = (e) => { this.closeWinOnWrap(e); }
		
		const btnClose = this.wrapWind.querySelector('[nameId="btnClose"]');
		btnClose.onmousedown = () => { this.closeWin(); }			
	}
	
	
	html_1()
	{
		const wrapWind = `
		display: none;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;		
		background-color: rgba(0, 0, 0, 0.5);
		font-family: arial,sans-serif;
		color: #666;
		z-index: 100;`;
		
		const divWind = ` 
		position: absolute;
		width: 300px;
		height: 200px;			
		background: white;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;`;
		
		const btnClose = `
		position: absolute;
		width: 20px;
		height: 20px;
		top: 10px;
		right: 10px;
		transform: rotate(-45deg);
		font-size: 30px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;`;
		

		const header = `
		height: 40px;
		background: #e8e8e8;
		border-bottom: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;`;


		const divH1 = `		
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 29px;
		margin-top: 0.3em;
		padding-left: 20px;
		font-size: 18px;
		color: #666;`;

		const content = `
		position: relative;
		flex-grow: 1;
		display: flex;
		overflow: auto;
		height: 100%;`;
	
		const footer = `	
		height: 10px;
		min-height: 10px;
		background: #e8e8e8;
		border-top: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;`;
		
		
		const html = 
		`<div nameId="wrapInfoWindGrid" style="${wrapWind}">
			<div nameId="divInfoWindGrid" style="${divWind}">
				<div nameId="btnClose" style="${btnClose}">
					+
				</div>
				<div style="${header}">
					<div nameId="divH1" style="${divH1}">
						
					</div>					
				</div>
				<div nameId="divContent" style="${content}">
					
				</div>
				<div style="${footer}"></div>
			</div>				
		</div>`;

		return html;
	}


	// очищаем текст
	clearHtmlTxt()
	{
		this.divH1.innerHTML = '';
		this.divContent.innerHTML = '';
	}
	

	// окно с подсказкой (показывается при клике на кнопку "сетка" в режиме без подписки)
	showWinInfoTxt()
	{
		let rect1 = myUiBtnGrid.wrapBtn.getBoundingClientRect();
		let rect = myUiBtnGrid.btnGrid.getBoundingClientRect();
		
		
		this.wrapWind.style.display = '';
		
		this.divWindGrid.style.width = '300px';
		this.divWindGrid.style.height = '200px';
		this.divH1.innerHTML = 'Информация';
		
		this.divContent.innerHTML = 
		`<div style="margin: 20px; text-align: center;">
			<div>Создание пользовательской сетки доступно после регистрации и оформлении подписки.</div>
			<div nameId="linkGridView" style="margin-top: 30px; color: #4949ff; cursor: pointer;">Видео, как это работает</div>
		</div>`;
		
		
		const btnLink = this.divContent.querySelector('[nameId="linkGridView"]');
		btnLink.onmousedown = (e) => { this.clearHtmlTxt(); this.showWinVideo(); }
		
		this.divWindGrid.style.top = (rect1.bottom + 15) + 'px';
		this.divWindGrid.style.left = (rect.left + rect.width/2 - this.divWindGrid.clientWidth/2)+'px';		
	}

	
	// окно видео обзором (показывается при клике на кнопку "?")
	showWinVideo()
	{
		let rect1 = myUiBtnGrid.wrapBtn.getBoundingClientRect();
		let rect = myUiBtnGrid.btnGrid.getBoundingClientRect();
		
		
		this.wrapWind.style.display = '';
		
		this.divWindGrid.style.width = '900px';
		this.divWindGrid.style.height = '550px';
		this.divH1.innerHTML = 'Видео: сетка';
		
		const ht = `https:/`;
		const video = `${ht}/www.youtube.com/embed/1hV98LTygwk`;
		this.divContent.innerHTML = `<iframe width="100%" height="100%" src="${video}" frameborder="0" allowfullscreen></iframe>`;
		
		this.divWindGrid.style.top = (rect1.bottom + 15) + 'px';
		this.divWindGrid.style.left = (rect.left + rect.width/2 - this.divWindGrid.clientWidth/2)+'px';		
	}
	
	
	closeWin()
	{
		this.wrapWind.style.display = 'none';
		this.clearHtmlTxt();
	}

	// закрываем окно кликнув в пустоту (в серый фон)
	closeWinOnWrap = (event) =>
	{ 
		if (this.wrapWind === event.target) 
		{ 			 
			this.closeWin();
		}
	}	
}







