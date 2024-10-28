
// показываем учетную запись, когда пользователь автоизовался 
class MyUserActive 
{
	windDivSubs;
	
	constructor()
	{
		this.windDivSubs = new WindDivSubs();
	}
	
	init({wrap, subs, token})
	{
		let pay = false;
		if(subs && subs.days && subs.days > 0) pay = true;
		
		if(!pay)	// подиска не оформлена или закончилась
		{
			wrap.innerHTML = this.html_1();
			
			const b_load = document.querySelector('[nameId="wm_list_load"]');
			const b_save = document.querySelector('[nameId="wm_list_save"]');
			
			b_load.innerHTML = this.htmlInfoNoSubs();
			b_save.innerHTML = this.htmlInfoNoSubs();
			b_load.classList.remove('window_main_menu_content_1_wrap_1');
			
			const divTariff = this.windDivSubs.crDivSubsTariff({token});		
			const divSubsTariff = wrap.querySelector('[nameId="divSubsTariff"]');
			divSubsTariff.append(divTariff);			
		}
		else	// подиска оформлена
		{
			const days = subs.days;
			wrap.innerHTML = this.html_2({days});
			myUiListProjects.getListProject({id: infProject.user.id, typeInfo: 'load'});

			// вкл кнопку и панель для пользовательской сетки
			myUiBtnGrid.initEventForUser();
			myUiGridUserPanel.init();
	
			// подписка заканчивается, показываем что можно оплатить (это не работает, специально отключено, потому что подписка закончилась)
			if(days < 1)
			{
				const divTariff = this.windDivSubs.crDivSubsTariff({token});		
				const divSubsTariff = wrap.querySelector('[nameId="divSubsTariff"]');
				divSubsTariff.append(divTariff);				
			}
		}
	}
	
	
	getCss1()
	{
		const css1 = `display: flex; flex-direction: column; align-items: center; background: #ffffff; margin: 30px auto 0 auto; padding: 10px; font-size: 20px; text-align: center; font-family: arial, sans-serif; color: #666;`;	

		return css1;
	}
	
	// у пользователя не оформленна подписка или она закончилась
	html_1()
	{
		const info = this.htmlInfoNoSubs();
		
		const html =
		`<div>
			<div class="window_main_menu_content_1_h1">
				Вход выполнен
			</div>									

			${info}			
		</div>`;

		return html;
	}

	
	// у пользователя оформленна подписка
	html_2({days = 0})
	{
		const css1 = this.getCss1();
		
		const html =
		`<div>
			<div class="window_main_menu_content_1_h1">
				Вход выполнен
			</div>									
			
			<div style="${css1}">
				<div style="margin-top: 20px;">Теперь вам доступно сохранение и загрузка проектов.</div>
				<div style="margin-top: 40px;">Подписка оформлена на: ${days} (дней)</div>
				<div nameId="divSubsTariff"></div>
			</div>
		</div>`;

		return html;
	}
	
	
	// у пользователя не оформленна подписка или она закончилась (отображается на сохранение и загрузки)
	htmlInfoNoSubs()
	{
		const css1 = this.getCss1();
		//Чтобы воспользоваться всеми возможности программы, оформите подписку.
		const html =
		`<div>
			<div style="${css1}">
				<div style="width: 400px; padding: 20px; font-size: 18px; border: solid 1px #b3b3b3;">сохранение и загрузка проектов доступна после оформлении подписки</div>
				<div nameId="divSubsTariff"></div>
			</div>
		</div>`;

		return html;
	}
}







