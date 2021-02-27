

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/buy.css">
<script src="/js/jquery-3.1.0.min.js"></script>


<title>Купить конструктор</title>


</head>
<body>


<script>
$(document).ready(function(){			


$('[choose]').click(function(){ 
$('[choose]').attr({'choose':''});
$(this).attr({'choose':'1'});
});



//console.log(className[0]);


<?// сохраняем вопрос ?>
$('[button_order]').click(function(){  
var name = $('[order_name]').text().trim();
var mail = $('[order_mail]').text().trim();
var pay_method = $('[choose="1"]').attr("class").trim();

if(empty(name)){return;}
if(empty(mail)){return;}

$.ajax({
type: "POST",					
url: '/components/buy_1.php',
data: {"name":name, "mail":mail, "pay_method":pay_method},
success: function(data){  

if(data != '-1')
{
$("input[name='label']").val(data.trim());

if(pay_method == "buy_yandex"){ document.getElementById('radio1').checked=true; }
else if(pay_method == "buy_visa"){ document.getElementById('radio2').checked=true; }

$('[form_post]').submit();
}

}
});

});
<?// сохраняем вопрос ?>

	
	
<?// проверка, пустое поле или нет (если пустое == true) ?>		
function empty(mixed_var) { return ( mixed_var === "" || mixed_var === 0   || mixed_var === "0" || mixed_var === null  || mixed_var === false || mixed_var === "undefined" ); }

		
});
</script>



<div class="wrap">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">
		
			<div class="offset_top_50"></div>
			<div class="t1">Купить конструктор отопления</div>
			<div class="offset_top_30"></div>
			<div class="bl_buy_1">
				<div class="bl_buy_1_1">
					Чтобы приобрести конструктор отопления, вам необходимо воспользоваться формой заказа. Выберете каким способом хотите оплатить покупку (Яндекс.Деньги, банковская карта), укажите свое имя, вашу электронную почту и нажмите кнопку оплатить.<br><br>  
					После оплаты, на указанную вами электронную почту придет письмо со ссылкой на программу.<br><br>  
					
					<b> Техническая поддержка:</b> <br>  
					Если есть вопросы после покупки программы, пишите на почту <b>engineering-plan@mail.ru</b>
				</div>
			</div>
			
			
			<div class="form_order_1">
				<div class="fd_1">Форма заказа</div>
				<div class="offset_top_30"></div>
				
				<div class="form_order_1_1">
					<div class="fd_2">Сумма</div>
					<div class="fd_2">Способы оплаты</div>
					<div class="fd_2">Имя</div>
					<div class="fd_2">E-mail</div>
				</div>
				
				<div class="form_order_1_2">
					<div class="fd_3"><div class="fd_3_1">500 руб.</div></div>
					
					<div class="buy_yandex" choose="1"></div>
					<div class="buy_visa" choose=""></div>
					<div class="clear"></div>
					
					<div class="input_1"><div order_name="" class="input_1_1" contenteditable="true" spellcheck="false"></div></div>
					<div class="input_1"><div order_mail="" class="input_1_1" contenteditable="true" spellcheck="false"></div></div>
					
					<div class="button_order" button_order="">Оплатить</div>
					<div class="offset_top_30"></div>					
				</div>	
				<div class="clear"></div>
			</div>
			
			<div class="clear"></div>
			
		</div>
		<div class="offset_top_50"></div>
			
		
		<form style="display:none;" form_post="" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" <!--target="_blank" -->>
			<input type="hidden" name="receiver" value="41001994824535">
			<input type="hidden" name="label" value="">
			<input type="hidden" name="quickpay-form" value="donate">
			<input type="hidden" name="targets" value="Покупка программы-конструктор «Инженерный план»">
			<input type="hidden" name="sum" value="500" data-type="number">
			<input type="hidden" name="need-fio" value="false">
			<input type="hidden" name="need-email" value="false">
			<input type="hidden" name="need-phone" value="false">
			<input type="hidden" name="need-address" value="false">
			<div><input type="radio" name="paymentType" value="PC" id="radio1"><label for="radio1"></label></div>
			<div><input type="radio" name="paymentType" value="AC" id="radio2"><label for="radio2"></label></div>							
		</form>			
		

	</div>

</div>




<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>




</body>
</html>



