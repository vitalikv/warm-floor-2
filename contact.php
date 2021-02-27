

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/contact.css">
<script src="/js/jquery-3.1.0.min.js"></script>

<title>Обратная связь</title>


</head>
<body>


<script>
$(document).ready(function(){


var t1 = "Ваше имя";
var t2 = "Ваш e-mail";
var t3 = "Ваше сообщение";


<?// подсказка в форме ?>
$('[mess_name]').on('click', function(){ if($(this).text().trim() == t1) { $(this).html(''); } }); 
$('[mess_mail]').on('click', function(){ if($(this).text().trim() == t2) { $(this).html(''); } }); 
$('[mess_text]').on('click', function(){ if($(this).text().trim() == t3) { $(this).html(''); } }); 


$('[mess_name]').focusout(function () { if($(this).html().trim() == "") { $(this).html(t1); } });
$('[mess_mail]').focusout(function () { if($(this).html().trim() == "") { $(this).html(t2); } });
$('[mess_text]').focusout(function () { if($(this).html().trim() == "") { $(this).html(t3); } });
<?// подсказка в форме ?>



//console.log(er);





<?// отправка сообщения ?>
$('[save_quest]').click(function(){  	
var name = $('[mess_name]').text().trim();
var mail = $('[mess_mail]').text().trim();
var text = $('[mess_text]').text().trim();


var er = "";
if(name == t1) { er += "Имя  "; }
if(mail == t2) { er += "mail  "; }
if(text == t3) { er += "сообщение"; }

if (er == "") {
$.ajax({
type: "POST",					
url: '/components/contact.php',
data: {"name":name, "mail":mail, "text":text},
success: function(data){ 

$('[mess_name]').html(t1);
$('[mess_mail]').html(t2);
$('[mess_text]').html(t3);
 
$('[inf]').html(data.trim());
}
});
}


});
<?// отправка сообщения ?>


});
</script>


<div class="wrap">

	<div class="content">
		<div class="line_0"></div>
		
		
		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		
		<div class="container">
			<div class="offset_top_50"></div>
		
			<? // форма сообщения ?>
			<div forma="">			
			<div class="vrm"><div mess_name="" class="mess_inp" contenteditable="true" spellcheck="false">Ваше имя</div></div>
			<div class="vrm"><div mess_mail="" class="mess_inp" contenteditable="true" spellcheck="false">Ваш e-mail</div></div>
			<div class="vrm"><div mess_text="" class="mess_text" contenteditable="true" spellcheck="false">Ваше сообщение</div></div>

			<div class="butt_enter" save_quest="">ОТПРАВИТЬ</div>
					
			<div class="mess_inf" inf=""></div>
			
			</div>
			<? // форма сообщения ?>

			<div class="offset_top_50"></div>
			
		</div>	
	</div>

</div>



<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>





</body>
</html>



