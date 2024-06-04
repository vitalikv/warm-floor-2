
// 
class MyUiGridPanel 
{
	wrap;
	inputSizeCell;
	dataBtn = {};
	
	constructor()
	{
		this.wrap = document.querySelector('[nameId="bottom_panel_1"]');
		this.crDivPanel();
		
	}

	crDivPanel()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		div.style.cssText = 'position: absolute; bottom: 30px;';
		
		this.wrap.append(div);

		this.initEventInputSizeCell();
		this.initEventBtnSliders();
		
		this.btnToggleOffset({setAct: 0});
		this.btnToggleLink({setAct: 0});
	}
	

	
	initEventInputSizeCell()
	{
		this.inputSizeCell = this.wrap.querySelector('[nameId="gridSizeCell"]');

		this.inputSizeCell.onkeydown = (e) => 
		{			
			if (e.code === 'Enter' || e.code === 'NumpadEnter') 
			{
				this.changeValueInputSizeCell({value: e.target.value});				
			}
		};
	}


	initEventBtnSliders()
	{		
		const div1 = this.wrap.querySelector('[nameId="btnOffset"]');
		const divTxt1 = div1.querySelector('[nameId="btnOffsetTxt"]');
		
		const div2 = this.wrap.querySelector('[nameId="btnLink"]');
		const divTxt2 = div2.querySelector('[nameId="btnLinkTxt"]');
		
		this.dataBtn = 
		{
			offset: { div: div1, divTxt: divTxt1, act: 0, mode: [{ txt: 'выкл' }, { txt: 'вкл' }] },
			link: { div: div2, divTxt: divTxt2, act: 0, mode: [{ txt: 'выкл' }, { txt: 'вкл' }] }
		};		
		
		div1.onmousedown = () => { this.btnToggleOffset({}); }	//clickInterface({button:'grid_move_1'});
		div2.onmousedown = () => { this.btnToggleLink({}); }		//clickInterface({button:'grid_link_1'});
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
		`<div style="${style1}">
			<div class="left-input-block-header">сетка пользователя</div>						
			
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
		</div>`;

		return html;
	}
	
	
	// переключаем или устанавливаем btn в нужное положение 
	btnToggleOffset({setAct = undefined})
	{
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
	}
	
	// переключаем или устанавливаем btn в нужное положение
	btnToggleLink({setAct = undefined})
	{
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
	}
	
	setValueInputSizeCell(value)
	{
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







