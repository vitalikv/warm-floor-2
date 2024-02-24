
// div блок с кнопками подписок
class WindDivSubs 
{
	divForm;
	formPost;
	yooLabel;
	yooSum;

	crDivSubsTariff({token})
	{
		this.divForm = document.createElement('div');
		this.divForm.innerHTML = this.htmlForm() + ' ' + this.htmlFormPost();
				
		this.formPost = this.divForm.querySelector('[nameId="formPost"]');
		this.yooLabel = this.formPost.querySelector('input[name="label"]');
		this.yooSum = this.formPost.querySelector('input[name="sum"]');

		const btn1 = this.divForm.querySelector('[nameId="btnSendPost1"]');		
		btn1.onmousedown = () => { this.sendPost({month: 1, token}); }
		
		const btn2 = this.divForm.querySelector('[nameId="btnSendPost2"]');		
		btn2.onmousedown = () => { this.sendPost({month: 3, token}); }

		const btn3 = this.divForm.querySelector('[nameId="btnSendPost3"]');		
		btn3.onmousedown = () => { this.sendPost({month: 6, token}); }		
		
		return this.divForm;
	}

	
	async sendPost({month, token})
	{
		let sum = 0;
		if(month === 1) sum = 20;
		if(month === 3) sum = 30;
		if(month === 6) sum = 40;		
		if(sum === 0) return;
		
		const url = infProject.path+'/components/payment.php';					
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'token='+token,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},				
		});	
		if(!response.ok) return;
		const data = await response.json();

		if(data.result === true)
		{					
			this.yooLabel.value = 'project=otop'+'&id='+data.id+'&token='+data.token;
			this.yooSum.value = sum;
			
			this.formPost.submit();
		}		
	}
	
	// проверка, пустое поле или нет (если пустое == true) 		
	empty(mixed_var) 
	{ 
		return ( mixed_var === "" || mixed_var === 0   || mixed_var === "0" || mixed_var === null  || mixed_var === false || mixed_var === "undefined" ); 
	}
	
	// кнопки для подписки
	htmlForm()
	{
		const css1 = `display: flex; flex-direction: column; color: #666;`;
		const css2 = `font-size: 15px;`;
		const cssSubs = `display: flex; flex-direction: column; align-items: center; justify-content: center; width: 120px; height: 120px; margin: 0 20px; background: #eaffd4; border: solid 1px #b3b3b3;`;
		const cssPrice = `margin: auto; font-size: 14px; font-weight: bold;`;
		const cssBtn = `margin: 0 0 20px 0; padding: 10px; border: 1px solid #b3b3b3; cursor: pointer; user-select: none;`;
		
		const html =
		`<div style="${css1}">
			<div style="font-size: 17px; margin: 20px 0;">Подписка</div>
			
			<div style="display: flex;">
				<div style="${cssSubs}">
					<div style="${cssPrice}">500 руб.</div>
					<div nameId="btnSendPost1" class="button_gradient_1" style="${cssBtn}">1 месяц</div>
				</div>

				<div style="${cssSubs}">
					<div style="${cssPrice}">1300 руб.</div>
					<div nameId="btnSendPost2" class="button_gradient_1" style="${cssBtn}">3 месяца</div>
				</div>

				<div style="${cssSubs}">
					<div style="${cssPrice}">2000 руб.</div>
					<div nameId="btnSendPost3" class="button_gradient_1" style="${cssBtn}">6 месяцев</div>
				</div>				
			</div>
		</div>`;

		return html;
	}

	// скрытая форма 
	htmlFormPost()
	{
		const ht = `https:/`;
		const html =
		`<form style="display:none;" nameId="formPost" method="POST" action="${ht}/yoomoney.ru/quickpay/confirm" <!--target="_blank" -->>
			<input type="hidden" name="receiver" value="41001994824535">
			<input type="hidden" name="label" value="">
			<input type="hidden" name="quickpay-form" value="button">
			<input type="hidden" name="sum" value="0" data-type="number">							
		</form>`;

		return html;
	}
}







