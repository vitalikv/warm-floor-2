
// панель регистрации/входа пользователя
class MyUiPanelRegister
{
	divWrapReg;
	divRegStr1;
	divRegStr2;
	divButtEnter;
	
	
	constructor()
	{
		this.init();
	}
	

	
	init()
	{
		this.divWrapReg = myUiMainMenu.divMainMenu.querySelector('[nameId="info_reg_1"]');
		this.divRegStr1 = myUiMainMenu.divMainMenu.querySelector('[nameId="info_reg_1_1"]');
		this.divRegStr2 = myUiMainMenu.divMainMenu.querySelector('[nameId="info_reg_1_2"]');	

		this.divButtEnter = myUiMainMenu.divMainMenu.querySelector('[nameId="act_reg_1"]');
		
		this.initEvent();
	}
	
	
	initEvent()
	{
		myUiMainMenu.divMainMenu.querySelector('[nameId="button_check_reg_1"]').onmousedown = (e) => { this.changeMainMenuRegistMenuUI({type: 'reg_1'}); }
		myUiMainMenu.divMainMenu.querySelector('[nameId="button_check_reg_2"]').onmousedown = (e) => { this.changeMainMenuRegistMenuUI({type: 'reg_2'}); }
		
		myUiMainMenu.divMainMenu.querySelector('[nameId="act_reg_1"]').onmousedown = () => { this.checkRegDataIU(); }
		myUiMainMenu.divMainMenu.querySelector('[nameId="act_reset_pass"]').onmousedown = () => { this.resetPassRegIU(); }
	}


	// переключаем в панеле кнопки: вход/регистрация
	changeMainMenuRegistMenuUI({type})
	{
		this.divWrapReg.style.display = 'none';
		this.divRegStr1.style.display = 'none';
		this.divRegStr2.style.display = 'none';		
		
		
		if(type === 'reg_1') 
		{
			this.divButtEnter.innerText = 'Войти';
			this.divButtEnter.setAttribute("b_type", "reg_1"); 
		}
		if(type === 'reg_2') 
		{
			this.divButtEnter.innerText = 'Зарегистрироваться';
			this.divButtEnter.setAttribute("b_type", "reg_2");
		}	
	}
	
	
	// вход/регистрация пользователя (проверка правильности ввода данных почта/пароль)
	async checkRegDataIU()
	{
		//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
		const pattern_2 = /^[a-z0-9]{4,20}$/i;
		var mail = document.querySelector('[nameId="input_reg_mail"]');
		var pass = document.querySelector('[nameId="input_reg_pass"]');
		
		
		this.divWrapReg.style.display = 'none';
		this.divRegStr1.style.display = 'none';
		this.divRegStr2.style.display = 'none';
		
		let flag_1 = false;
		let flag_2 = false;
		
		mail.value = mail.value.trim();	// удаляем пробелы  
		pass.value = pass.value.trim();	// удаляем пробелы 
		
		// проверка почты
		if(mail.value != '')
		{
			if(this.validateEmail(mail.value))
			{
				flag_1 = true;
			}
			else
			{
				this.divRegStr1.style.display = 'block';
				this.divRegStr1.innerText = 'Не верно указанна почта';			
			}
		}
		else
		{		
			this.divRegStr1.style.display = 'block';
			this.divRegStr1.innerText = 'Укажите e-mail';
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
				this.divRegStr2.style.display = 'block';
				this.divRegStr2.innerHTML = 'Не верно указан пароль<br>(Только цифры и латинские буквы от 4 до 20 знаков)';			
			}
		}		
		else
		{		
			this.divRegStr2.style.display = 'block';
			this.divRegStr2.innerText = 'Укажите пароль';
		}
		
		
		// данные введены верно
		if(flag_1 && flag_2)
		{ 
			this.divWrapReg.style.display = 'none';
						
			const type = document.querySelector('[nameId="act_reg_1"]').getAttribute("b_type");
			
		
			const url = infProject.path+'components/regUser.php';					
			const response = await fetch(url, 
			{
				method: 'POST',
				body: 'type='+type+'&mail='+mail.value+'&pass='+pass.value,
				headers: 
				{	
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
				},				
			});	
			if(!response.ok) return;
			const data = await response.json();
		
		
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
					
					//if(infProject.user.mail === '9455469@mail.ru' || infProject.user.mail === '9334997@mail.ru')
					//{
					//	const myUserActive = new MyUserActive();				
					//	myUserActive.init({wrap, subs, token});									
					//}
					//else
					//{
					//	myUiListProjects.getListProject({id: infProject.user.id});
					//}

					const myUserActive = new MyUserActive();				
					myUserActive.init({wrap, subs, token});				
				}
				else
				{
					if(data.err.desc)
					{
						this.divRegStr1.innerHTML = data.err.desc;
						
						this.divWrapReg.style.display = 'block';
						this.divRegStr1.style.display = 'block';
						this.divRegStr2.style.display = 'none';													
					}
				}
			}
			else if(type=='reg_2')	// регистрация нового пользователя
			{
				if(data.success)
				{
					this.divRegStr1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)";
					//this.divRegStr1.innerHTML = "Вы успешно зарегистрировались";						
					
					this.divWrapReg.style.display = 'block';
					this.divRegStr1.style.display = 'block';
					this.divRegStr2.style.display = 'none';												
				}
				else
				{						
					if(data.err.desc)
					{
						this.divRegStr1.innerHTML = data.err.desc;
						
						this.divWrapReg.style.display = 'block';
						this.divRegStr1.style.display = 'block';
						this.divRegStr2.style.display = 'none';													
					}						
				}
			}				
		
		}
		else	// данные введены НЕ верно
		{  
			this.divWrapReg.style.display = 'block';
		}
	}



	// сброс пароля
	async resetPassRegIU()
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
			if(this.validateEmail(mail.value))
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
				
				inf_block.style.display = 'block';
				inf_str_1.style.display = 'block';												
			}
			else
			{						
				if(data.err.desc)
				{
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
	}

	
	// проверка почты на валидность
	validateEmail(email) 
	{
		return String(email)
		.toLowerCase()
		.match(
		  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	}

}







