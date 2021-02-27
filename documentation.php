

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css?1">
<script src="/js/jquery-3.1.0.min.js"></script>

<title>Инструкция</title>


</head>
<body>



<script>
$(document).ready(function(){			


<? // уроки ?>
$(document).on('click', '[lesson]', function () { 
var lesson = $(this).attr('lesson');
var video = "";

if(lesson == "1"){ video = "https://www.youtube.com/embed/jnWplwqkZvo"; }
else if(lesson == "2"){ video = "https://www.youtube.com/embed/UPJEkjkEyNI"; }
else if(lesson == "3"){ video = "https://www.youtube.com/embed/cNSOSoMZCXc"; }
else if(lesson == "4"){ video = "https://www.youtube.com/embed/Gipncbw37Hc"; }
else if(lesson == "5"){ video = "https://www.youtube.com/embed/CmyHbr3Fpao"; }
else if(lesson == "6"){ video = "https://www.youtube.com/embed/D_Q7W1TlwoU"; }
else { video = "https://www.youtube.com/embed/1J49QSxEhT0"; }

$('[fon]').html('<div class="img_big_2"><iframe width="100%" height="100%" src="'+ video + '" frameborder="0" allowfullscreen></iframe></div>');

$('[fon]').css({"display":"block"});

var w_okno = $(window).width() * 0.7;

$('.img_big_2').css("width", w_okno);
$('.img_big_2').css("height", w_okno / 1.6666);
$('.img_big_2').css("margin-top", ($(window).height() - w_okno / 1.6666) / 2);

});		
<? // уроки ?>


<? // закрытие fon ?>
$(document).on('click', '.img_big_2', function () { return false; });
$(document).on('click', '[fon]', function () { $('[fon]').css({"display":"none"}); $('[fon]').html(''); $('body').css("overflow", "auto"); });
<? // закрытие fon ?>	
		
		
});
</script>


<div class="fon" fon=""></div>



<div class="wrap">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">
			<div class="offset_top_50"></div>
			<div class="t1">Инструкция по работе с программой</div>
			<div class="offset_top_30"></div>
			
			<div class="docum">
				<div class="docum_a" lesson="1">1. Рабочее пространство</div><br>
				<div class="docum_a" lesson="2">2. Установка планировки</div><br>
				<div class="docum_a" lesson="3">3. Каталог</div><br>
				<div class="docum_a" lesson="4">4. Работа с деталями</div><br>
				<div class="docum_a" lesson="5">5. Сборка системы отопления</div><br>
				<div class="docum_a" lesson="6">6. Работа с готовой схемой</div><br>
			</div>
			
			<div class="docum_line"></div>
			<div class="docum_teh">
			<b>Техническая поддержка:</b> <br>  
			Если есть вопросы по работе с программой, пишите на почту <b>engineering-plan@mail.ru</b>
			</div>
		</div>
		<div class="offset_top_30"></div>
	</div>

</div>




<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>




</body>
</html>



