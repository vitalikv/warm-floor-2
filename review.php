

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">
<script src="/js/jquery-3.1.0.min.js"></script>


<title>Возможности программы</title>


</head>
<body>



<script>
$(document).ready(function(){			


changesize_1();

$(window).resize(function(){ changesize_1(); });


function changesize_1()
{ 
	var w_win = $(".block_line_1").width();
	var w_1 = w_win * 0.65;
	var w_2 = w_1 * 0.6;
	var w_3 = w_1 - (w_2 + 20 + 4);
	
	$('.review_f_1').css("width", w_1);
	$('.bl_r_1').css("width", w_1 - 2);
	$('.bl_r_2').css("width", w_2);
	$('.bl_r_3').css("width", w_3);
	
	
	w_1 = w_win - (w_1 + 20 + 2);
	w_2 = w_1 / 2 - (10 + 2);
	$('.review_f_2').css("width", w_1);
	$('.bl_r_4').css("width", w_2);
	$('.bl_r_5').css("width", w_2);
	$('.bl_r_6').css("width", w_1 - 2);
	
	var h_1 = $(".review_f_1").height();
	var h_2 = $(".bl_r_4").height();
	var h_3 = h_1 - (h_2 + 20 + 4);
	
	$('.bl_r_6').css("height", h_3);
}
		
		
});
</script>



<div class="wrap">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">
			<div class="offset_top_50"></div>
			<div class="t1">Возможности программы</div>
			<div class="offset_top_30"></div>
			
			<div class="review_f_1">
				<div class="bl_r_1"><img src="/img/ind/1.png" class="img_r_1"></div>
				
				<div>
					<div class="bl_r_2"><img src="/img/ind/2.png" class="img_r_2"></div>
					<div class="bl_r_3"><img src="/img/ind/3.png" class="img_r_3"></div>
					<div class="clear"></div>
				</div>
			</div>
			
			<div class="review_f_2">
				<div>
					<div class="bl_r_4"><img src="/img/ind/4.png" class="img_r_4"></div>
					<div class="bl_r_5"><img src="/img/ind/5.png" class="img_r_5"></div>
					<div class="clear"></div>
				</div>
				<div class="bl_r_6"><img src="/img/ind/6.png" class="img_r_6"></div>
			</div>
			<div class="clear"></div>
			
			<div class="offset_top_50"></div>
		</div>
		
	</div>

</div>




<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>




</body>
</html>



