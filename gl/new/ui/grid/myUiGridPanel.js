
// 
class MyUiGridPanel 
{
	wrap;
	inputSizeCell;
	
	constructor()
	{
		this.wrap = document.querySelector('[nameId="bottom_panel_1"]');
		this.crUserPanel();
	}

	crUserPanel()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		
		this.wrap.append(div);

		this.initEventUserPanel();
	}
	
	initEventUserPanel()
	{
		const btn2 = this.wrap.querySelector('[data-action="grid_move_1"]');
		const btn3 = this.wrap.querySelector('[data-action="grid_link_1"]');
		this.inputSizeCell = this.wrap.querySelector('[nameId="gridSizeCell"]');
		
		btn2.onmousedown = () => { clickInterface({button:'grid_move_1'}); }
		btn3.onmousedown = () => { clickInterface({button:'grid_link_1'}); }

		this.inputSizeCell.onkeydown = (e) => 
		{
			if (e.code === 'Enter') 
			{
				this.changeValueInputSizeCell({value: e.target.value});				
			}
		};		
	}
	

	
	// 
	html_1()
	{
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
		`<div class="left-input-block">
			<div class="left-input-block-header">сетка</div>						
			
			<div class="input-height">
				<div class="text_1">ячейка (cм)</div>
				<input type="text" nameId="gridSizeCell" style="${cssInput_1}" value="">
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
			
			return;
		}
		
		console.log(222, size);
		myGridMesh.changeGridMeshSizeCell({sizeCell: size});
		
		renderCamera();
	}	
}







