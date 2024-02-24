
// div блок с кнопками подписок
class MyUserActive 
{
	
	
	// у пользователя не оформленна подписка или она закончилась
	html_1()
	{
		const css1 = `display: flex; flex-direction: column; align-items: center; background: #ffffff; margin: 30px auto 0 auto; padding: 10px; font-size: 20px; text-align: center; font-family: arial, sans-serif;`;
		
		const html =
		`<div>
			<div class="window_main_menu_content_1_h1">
				Вход выполнен
			</div>									

			<div style="${css1}">
				<div style="margin-top: 40px;">Чтобы воспользоваться всеми возможности программы, оформите подписку.</div>
				<div nameId="divSubsTariff"></div>
			</div>			
		</div>`;

		return html;
	}

	
	// у пользователя оформленна подписка
	html_2({days = 0})
	{
		const css1 = `display: flex; flex-direction: column; align-items: center; background: #ffffff; margin: 30px auto 0 auto; padding: 10px; font-size: 20px; text-align: center; font-family: arial, sans-serif;`;
		
		const html =
		`<div>
			<div class="window_main_menu_content_1_h1">
				Вход выполнен
			</div>									
			
			<div style="${css1}">
				<div style="margin-top: 40px;">Теперь вам доступно сохранение и загрузка проектов.</div>
				<div style="margin-top: 40px;">Подписка оформлена на: ${days} (дней)</div>
				<div nameId="divSubsTariff"></div>
			</div>
		</div>`;

		return html;
	}
}







