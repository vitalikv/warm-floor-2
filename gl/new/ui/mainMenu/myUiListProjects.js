
// отображение списка проектов
class MyUiListProjects 
{

	
	// получаем с сервера список проектов принадлежащих пользователю
	async getListProject({id, typeInfo = 'load'})
	{ 
		const b_load = document.querySelector('[nameId="wm_list_load"]');
		const b_save = document.querySelector('[nameId="wm_list_save"]');
		
		
		
		const cssInf =
		`margin: 30px auto 0 auto;
		width: 70%;
		padding: 40px;
		font-size: 17px;
		text-align: center;
		border: solid 1px #b3b3b3;`;
		
		let textInfo = 'Подождите, идет загрузка списка проектов.';
		if(typeInfo === 'save') textInfo = 'Подождите, идет сохранение проекта.';
		
		b_load.innerHTML = `<div style="${cssInf}">${textInfo}</div>`;
		b_save.innerHTML = `<div style="${cssInf}">${textInfo}</div>`;	
		
		const url = infProject.path+'components/loadListProject.php';				
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'id='+id,
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});	

		if(!response.ok) return;
		const json = await response.json();


		var arr = [];
		var count = 4;
		
		if(infProject.user.status){ if(infProject.user.status == 'admin'){ count = 5; } }
		
		for(var i = 0; i < count; i++)
		{
			if(json[i]) { arr[arr.length] = json[i]; }
			else { arr[arr.length] = {id: 0, name: 'Пустой проект'}; }	
		}
		
		const css1 = 
		`position: relative;
		display: flex; 
		align-items: center; 
		justify-content: center;
		flex-direction: column;
		position: relative;		
		margin: 25px;
		width: 250px;	
		height: 150px;
		font-size: 16px;
		color: #666;
		text-decoration: none;
		text-align: center;			
		border: 1px solid #b3b3b3; 
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
		background:#f1f1f1;
		cursor: pointer;`;	

		const cssName = `position: absolute; top: 5px; margin: auto; background: rgba(255,255,255,1); border: 1px solid #b3b3b3;`;
		const cssBtn = `position: absolute; bottom: 5px; margin: auto; padding: 10px; border: 1px solid #b3b3b3; cursor: pointer; user-select: none;`;
		const cssImg = `display: block; width: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;`;
			
		let html_load = '';
		let html_save = '';
		
		for(var i = 0; i < arr.length; i++)
		{
			let prev = '';
			
			if(arr[i].preview) 
			{
				prev = `<div style="margin: 5px; overflow: hidden;"><img src="${arr[i].preview}" style="${cssImg}"></div>`;			
			}

			let btn1 = `<div style="${cssName}">${arr[i].name}</div>${prev}<div class="button_gradient_1" style="${cssBtn}">сохранить</div>`;
			let btn2 = `<div style="${cssName}">${arr[i].name}</div>${prev}<div class="button_gradient_1" style="${cssBtn}">загрузить</div>`;
			
			html_save += `<div style='${css1} background: #f0ebd1;' projectId="${arr[i].id}" nameId="save_pr_1">${btn1}</div>`;	
			html_load += `<div style='${css1} background: #d1d9f0;' projectId="${arr[i].id}" nameId="load_pr_1">${btn2}</div>`;
		}	
		
		
		b_load.classList.remove('window_main_menu_content_1_wrap_1');
		b_save.classList.remove('window_main_menu_content_1_wrap_1');

		const css2 =		
		`display: grid;
		grid-template-columns: auto auto;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		margin-top: 30px;
		justify-content: center;
		align-items: center;`;

		b_load.style.cssText = css2;
		b_save.style.cssText = css2;
		
		b_load.innerHTML = html_load;
		b_save.innerHTML = html_save;

		const arrLoadEl = b_load.querySelectorAll('[nameId="load_pr_1"]');
		const arrSaveEl = b_save.querySelectorAll('[nameId="save_pr_1"]');

		arrLoadEl.forEach((el)=> 
		{
			el.onmousedown = (e) => { this.clickButtonLoadProjectUI(el); }
		});	

		arrSaveEl.forEach((el)=> 
		{
			el.onmousedown = (e) => { this.clickButtonSaveProjectUI(el); }
		});	
			
	}



	// кликнули на кнопку сохранить проекта
	async clickButtonSaveProjectUI(el)
	{
		var result = await saveFile({id: el.attributes.projectid.value, upUI: true}); 
		
		if(!result) return;
		
		infProject.elem.mainMenu.g.style.display = 'none';
	}



	// кликнули на кнопку загрузки проекта
	clickButtonLoadProjectUI(el)
	{
		loadFile({id: el.getAttribute("projectId")}); 
		
		infProject.elem.mainMenu.g.style.display = 'none';
	}

}







