




infProject.elem = {};
infProject.elem.mainMenu = {};

infProject.elem.mainMenu.g = document.querySelector('[nameId="background_main_menu"]');
infProject.elem.mainMenu.close = document.querySelector('[nameId="button_close_main_menu"]');
infProject.elem.mainMenu.wind = document.querySelector('[nameId="window_main_menu"]');

// блокируем все что находится за фоном меню
infProject.elem.mainMenu.g.addEventListener('mousedown', function(e) { infProject.elem.mainMenu.g.style.display = 'none'; e.stopPropagation(); });
infProject.elem.mainMenu.g.addEventListener('wheel', function(e) { e.stopPropagation(); });
infProject.elem.mainMenu.g.addEventListener('DOMMouseScroll', function(e) { e.stopPropagation(); });
infProject.elem.mainMenu.g.addEventListener('mousewheel', function(e) { e.stopPropagation(); });


infProject.elem.mainMenu.close.onmousedown = function(e){ infProject.elem.mainMenu.g.style.display = 'none'; }
infProject.elem.mainMenu.wind.onmousedown = function(e){ e.stopPropagation(); }


// открываем меню 
infProject.elem.mainMenu.m1 = document.querySelector('[nameId="butt_main_menu"]');
infProject.elem.mainMenu.m1.onmousedown = function(e){ infProject.elem.mainMenu.g.style.display = 'block'; } 


// кнопки разделов
infProject.elem.mainMenu.m2 = document.querySelector('[nameId="reset_scene_1"]');
infProject.elem.mainMenu.m3 = document.querySelector('[nameId="button_main_menu_reg_1"]');
infProject.elem.mainMenu.m4 = document.querySelector('[nameId="button_load_1"]');
infProject.elem.mainMenu.m5 = document.querySelector('[nameId="button_save_1"]');
infProject.elem.mainMenu.m6 = document.querySelector('[nameId="button_help"]');
infProject.elem.mainMenu.m7 = document.querySelector('[nameId="button_contact"]');
infProject.elem.mainMenu.m8 = document.querySelector('[nameId="button_reset_pass_1"]');
infProject.elem.mainMenu.m_bs = document.querySelector('[nameId="bl_inf_regin_s"]');
infProject.elem.mainMenu.m_bl = document.querySelector('[nameId="bl_inf_regin_l"]');

// контейнеры разделов
infProject.elem.mainMenu.b3 = document.querySelector('[wwm_1="button_main_menu_reg_1"]');
infProject.elem.mainMenu.b4 = document.querySelector('[wwm_1="button_load_1"]');
infProject.elem.mainMenu.b5 = document.querySelector('[wwm_1="button_save_1"]');
infProject.elem.mainMenu.b6 = document.querySelector('[wwm_1="button_help"]');
infProject.elem.mainMenu.b7 = document.querySelector('[wwm_1="button_contact"]');
infProject.elem.mainMenu.b8 = document.querySelector('[wwm_1="button_reset_pass_1"]');


// переключаем кнопки разделов
infProject.elem.mainMenu.m2.onmousedown = function(e){ resetScene(); infProject.elem.mainMenu.g.style.display = 'none'; }
infProject.elem.mainMenu.m3.onmousedown = function(e){ changeMainMenuUI({el: this}); } 
infProject.elem.mainMenu.m4.onmousedown = function(e){ changeMainMenuUI({el: this}); } 
infProject.elem.mainMenu.m5.onmousedown = function(e){ changeMainMenuUI({el: this}); } 
infProject.elem.mainMenu.m6.onmousedown = function(e){ changeMainMenuUI({el: this}); } 
infProject.elem.mainMenu.m7.onmousedown = function(e){ changeMainMenuUI({el: this}); } 
infProject.elem.mainMenu.m8.onmousedown = function(e){ changeMainMenuUI({el: this}); } 	
infProject.elem.mainMenu.m_bs.onmousedown = function(e){ changeMainMenuUI({el: this}); }
infProject.elem.mainMenu.m_bl.onmousedown = function(e){ changeMainMenuUI({el: this}); }




// переключаем разделы
function changeMainMenuUI(cdm)
{
	var q = [];
	
	q[q.length] = { butt: infProject.elem.mainMenu.m3, wrap: infProject.elem.mainMenu.b3 };
	q[q.length] = { butt: infProject.elem.mainMenu.m4, wrap: infProject.elem.mainMenu.b4 };
	q[q.length] = { butt: infProject.elem.mainMenu.m5, wrap: infProject.elem.mainMenu.b5 };
	q[q.length] = { butt: infProject.elem.mainMenu.m6, wrap: infProject.elem.mainMenu.b6 };
	q[q.length] = { butt: infProject.elem.mainMenu.m7, wrap: infProject.elem.mainMenu.b7 };
	q[q.length] = { butt: infProject.elem.mainMenu.m8, wrap: infProject.elem.mainMenu.b8 };
	q[q.length] = { butt: infProject.elem.mainMenu.m_bs, wrap: infProject.elem.mainMenu.b3 };
	q[q.length] = { butt: infProject.elem.mainMenu.m_bl, wrap: infProject.elem.mainMenu.b3 };
	
	var b = [];
	
	b[b.length] = infProject.elem.mainMenu.b3;
	b[b.length] = infProject.elem.mainMenu.b4;
	b[b.length] = infProject.elem.mainMenu.b5;
	b[b.length] = infProject.elem.mainMenu.b6;
	b[b.length] = infProject.elem.mainMenu.b7;
	b[b.length] = infProject.elem.mainMenu.b8;
	
	for ( var i = 0; i < b.length; i++ )
	{
		b[i].style.display = 'none';	
	}


	for ( var i = 0; i < q.length; i++ )
	{
		if(q[i].butt == cdm.el) { q[i].wrap.style.display = 'block'; break; }  			
	}		
}



document.querySelector('[nameId="button_check_reg_1"]').onmousedown = function(e){ changeMainMenuRegistMenuUI({el: this}); }
document.querySelector('[nameId="button_check_reg_2"]').onmousedown = function(e){ changeMainMenuRegistMenuUI({el: this}); }	


// переключаем в главном меню в форме регистрация кнопки: вход/регистрация
function changeMainMenuRegistMenuUI(cdm)
{
	var inf_block = document.querySelector('[nameId="info_reg_1"]');
	var inf_str_1 = document.querySelector('[nameId="info_reg_1_1"]');
	var inf_str_2 = document.querySelector('[nameId="info_reg_1_2"]');
	
	inf_block.style.display = 'none';
	inf_str_1.style.display = 'none';
	inf_str_2.style.display = 'none';		

	var el = document.querySelector('[nameId="act_reg_1"]');
	
	if(cdm.el.attributes.nameId.value == "button_check_reg_1") 
	{
		el.innerText = 'Войти';
		el.setAttribute("b_type", "reg_1"); 
	}
	if(cdm.el.attributes.nameId.value == "button_check_reg_2") 
	{
		el.innerText = 'Зарегистрироваться';
		el.setAttribute("b_type", "reg_2");
	}	
}



// получаем с сервера список проектов принадлежащих пользователю
async function getListProject(cdm)
{ 

	var url = infProject.path+'components/loadListProject.php';			
	
	var response = await fetch(url, 
	{
		method: 'POST',
		body: 'id='+cdm.id,
		headers: 
		{	
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
		},				
	});	

	if(!response.ok) return;
	var json = await response.json();
	
	
	var html_load = '';
	var html_save = '';
	
	var arr = [];
	var count = 2;
	
	if(infProject.user.status){ if(infProject.user.status == 'admin'){ count = 5; } }
	
	for(var i = 0; i < count; i++)
	{
		if(json[i]) { arr[arr.length] = json[i]; }
		else { arr[arr.length] = {id: 0, name: 'Пустой проект'}; }	
	}
	
	for(var i = 0; i < arr.length; i++)
	{
		var src_1 = `<div><div>${arr[i].name}</div><div style='margin-top: 10px;'>сохранить</div></div>`;
		var src_2 = `<div><div>${arr[i].name}</div><div style='margin-top: 10px;'>загрузить</div></div>`;
		
		if(arr[i].preview) 
		{
			src_1 = `			 
			<div style='margin: auto;'>${arr[i].name}</div>
			<img src="${arr[i].preview}" style="display: block; width: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;">
			<div style='margin: auto;'>сохранить</div>
			`;
			
			src_2 = `
			<div style='margin: auto;'>${arr[i].name}</div>
			<img src="${arr[i].preview}" style="display: block; width: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;"> 			
			<div style='margin: auto;'>загрузить</div>
			`;			
		}


		html_save += `<div class="window_main_menu_content_block_1" style='background: #f0ebd1;' projectId="${arr[i].id}" nameId="save_pr_1">${src_1}</div>`;	
		html_load += `<div class="window_main_menu_content_block_1" style='background: #d1d9f0;' projectId="${arr[i].id}" nameId="load_pr_1">${src_2}</div>`;
	}
	

	var b_load = document.querySelector('[nameId="wm_list_load"]');
	var b_save = document.querySelector('[nameId="wm_list_save"]');
	
	b_load.innerHTML = html_load;
	b_save.innerHTML = html_save;

	var arrLoadEl = b_load.querySelectorAll('[nameId="load_pr_1"]');
	var arrSaveEl = b_save.querySelectorAll('[nameId="save_pr_1"]');

	arrLoadEl.forEach(function(el) 
	{
		el.addEventListener('mousedown', function(e) { clickButtonLoadProjectUI(this); });
	});	

	arrSaveEl.forEach(function(el) 
	{
		el.addEventListener('mousedown', function(e) { clickButtonSaveProjectUI(this); });
	});	
		
}



// кликнули на кнопку сохранить проекта
async function clickButtonSaveProjectUI(el)
{
	var result = await saveFile({id: el.attributes.projectid.value, upUI: true}); 
	
	if(!result) return;
	
	infProject.elem.mainMenu.g.style.display = 'none';
}



// кликнули на кнопку загрузки проекта
function clickButtonLoadProjectUI(el)
{
	loadFile({id: el.getAttribute("projectId")}); 
	
	infProject.elem.mainMenu.g.style.display = 'none';
}




document.querySelector('[nameId="act_reg_1"]').onmousedown = function(e){ checkRegDataIU(); }

// вход/регистрация пользователя (проверка правильности ввода данных почта/пароль)
async function checkRegDataIU()
{
	//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
	var pattern_2 = /^[a-z0-9]{4,20}$/i;
	var mail = document.querySelector('[nameId="input_reg_mail"]');
	var pass = document.querySelector('[nameId="input_reg_pass"]');
	
	var inf_block = document.querySelector('[nameId="info_reg_1"]');
	var inf_str_1 = document.querySelector('[nameId="info_reg_1_1"]');
	var inf_str_2 = document.querySelector('[nameId="info_reg_1_2"]');
	
	inf_block.style.display = 'none';
	inf_str_1.style.display = 'none';
	inf_str_2.style.display = 'none';
	
	var flag_1 = false;
	var flag_2 = false;
	
	mail.value = mail.value.trim();	// удаляем пробелы  
	pass.value = pass.value.trim();	// удаляем пробелы 
	
	// проверка почты
	if(mail.value != '')
	{
		if(validateEmail(mail.value))
		{
			flag_1 = true;
		}
		else
		{
			inf_str_1.style.display = 'block';
			inf_str_1.innerText = 'Не верно указанна почта';			
		}
	}
	else
	{		
		inf_str_1.style.display = 'block';
		inf_str_1.innerText = 'Укажите e-mail';
	}
	
	
	// проверка пароля
	if(pass.value != '')
	{
		if(pattern_2.test(pass.value))
		{
			flag_2 = true;
		}
		else
		{
			inf_str_2.style.display = 'block';
			inf_str_2.innerHTML = 'Не верно указан пароль<br>(Только цифры и латинские буквы от 4 до 20 знаков)';			
		}
	}		
	else
	{		
		inf_str_2.style.display = 'block';
		inf_str_2.innerText = 'Укажите пароль';
	}
	
	
	// данные введены верно
	if(flag_1 && flag_2)
	{ 
		inf_block.style.display = 'none';
		
		//console.log();
		var type = document.querySelector('[nameId="act_reg_1"]').getAttribute("b_type");
		
	
		var url = infProject.path+'components/regUser.php';					
		var response = await fetch(url, 
		{
			method: 'POST',
			body: 'type='+type+'&mail='+mail.value+'&pass='+pass.value,
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});	
		if(!response.ok) return;
		var data = await response.json();
	
	
		if(type=='reg_1')	// авторизация пользователя
		{
			if(data.success)
			{
				infProject.user.id = data.info.id;
				infProject.user.mail = data.info.mail;
				infProject.user.pass = data.info.pass;
				infProject.user.status = data.info.status;
				const token = data.info.token;
				const subs = data.subs;
					
				const wrap = document.querySelector('[nameId="reg_content_1"]');
				wrap.style.display = 'block';
				document.querySelector('[nameId="reg_content_2"]').style.display = 'none';
				
				//myLeftPanel.crUserPanel();
				
				if(infProject.user.mail === '9455469@mail.ru' || infProject.user.mail === '9334997@mail.ru')
				{
					const myUserActive = new MyUserActive();				
					myUserActive.init({wrap, subs, token});									
				}
				else
				{
					getListProject({id: infProject.user.id});
				}				
			}
			else
			{
				if(data.err.desc)
				{
					console.log(data.err.desc);
					inf_str_1.innerHTML = data.err.desc;
					
					inf_block.style.display = 'block';
					inf_str_1.style.display = 'block';
					inf_str_2.style.display = 'none';													
				}
			}
		}
		else if(type=='reg_2')	// регистрация нового пользователя
		{
			if(data.success)
			{
				inf_str_1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)";
				//inf_str_1.innerHTML = "Вы успешно зарегистрировались";						
				
				inf_block.style.display = 'block';
				inf_str_1.style.display = 'block';
				inf_str_2.style.display = 'none';												
			}
			else
			{						
				if(data.err.desc)
				{
					console.log(data.err.desc);
					inf_str_1.innerHTML = data.err.desc;
					
					inf_block.style.display = 'block';
					inf_str_1.style.display = 'block';
					inf_str_2.style.display = 'none';													
				}						
			}
		}				
	
	}
	else	// данные введены НЕ верно
	{  
		inf_block.style.display = 'block';
	}
};


function validateEmail(email) 
{
  return String(email)
	.toLowerCase()
	.match(
	  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
}
	

document.querySelector('[nameId="act_reset_pass"]').onmousedown = function(e){ resetPassRegIU(); }

// сброс пароля
async function resetPassRegIU()
{
	//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
	var mail = document.querySelector('[nameId="input_reset_pass"]');
	
	var inf_block = document.querySelector('[nameId="info_reset_pass_1"]');
	var inf_str_1 = document.querySelector('[nameId="info_reset_pass_1_1"]');
	
	inf_block.style.display = 'none';
	inf_str_1.style.display = 'none';
	
	var flag_1 = false;
	var flag_2 = false;
	
	mail.value = mail.value.trim();	// удаляем пробелы  
	
	// проверка почты
	if(mail.value != '')
	{
		if(validateEmail(mail.value))
		{
			flag_1 = true;
		}
		else
		{
			inf_str_1.style.display = 'block';
			inf_str_1.innerText = 'Не верно указанна почта';			
		}
	}
	else
	{		
		inf_str_1.style.display = 'block';
		inf_str_1.innerText = 'Укажите e-mail';
	}
		
	
	// данные введены верно
	if(flag_1)
	{ 
		inf_block.style.display = 'none';
		
		var url = infProject.path+'components/resetPass_1.php';					
		var response = await fetch(url, 
		{
			method: 'POST',
			body: '&mail='+mail.value,
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});	
		if(!response.ok) return;
		var data = await response.json();
		
		if(data.success)
		{
			inf_str_1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту чтобы восстановить пароль<br>(если письмо не пришло посмотрите в папке спам)";
			//inf_str_1.innerHTML = "Вы успешно зарегистрировались";						
			
			inf_block.style.display = 'block';
			inf_str_1.style.display = 'block';												
		}
		else
		{						
			if(data.err.desc)
			{
				console.log(data.err.desc);
				inf_str_1.innerHTML = data.err.desc;
				
				inf_block.style.display = 'block';
				inf_str_1.style.display = 'block';												
			}						
		}				
		
	}
	else	// данные введены НЕ верно
	{  
		inf_block.style.display = 'block';
	}
};













