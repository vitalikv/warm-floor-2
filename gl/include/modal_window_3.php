
<style type="text/css">
.background_main_menu 
{
	display: none;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	position: fixed;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}

.window_main_menu 
{
	position: relative;
	margin: auto;
	width: 95%;
	height: 95%;	
	
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
	display: -webkit-box;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	flex-direction: column;
}

.window_main_menu_content_1
{	
	position: relative;
	margin: 30px auto 0 0;
}


.window_main_menu_content_1_row
{
	display: -webkit-box;
	display: flex;
}

.window_main_menu_content_1_column
{
	display: -webkit-box;
	display: flex;
	flex-direction: column;
	-webkit-flex-direction: column;
}

.window_main_menu_content_1_column:nth-child(2) 
{
	display: block;
	flex: 1 1 100%;
	/*background: orange;*/
}

.window_main_menu_content_1_item
{
	margin: 5px 20px;
	padding: 10px 0;
	width: 250px;	
	
	font-family: arial,sans-serif;
	font-size: 18px;
	color: #666;
	text-decoration: none;
	text-align:  center;	
	
	border: 1px solid #b3b3b3; 
	border-radius: 3px;
	background-color:#f1f1f1;
	cursor: pointer;
}


.window_main_menu_content_1_h1
{
	display: flex; /* Флексы */
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */
	height: 50px;
	background-color:#f1f1f1;

	font-family: arial,sans-serif;
	font-size: 24px;
	color: #666;	
}

.window_main_menu_content_1_wrap_1
{
	display: -webkit-box;
	display: flex;	
}


.window_main_menu_content_block_1
{
	display: flex; /* Флексы */
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */
	
	margin: 35px auto;
	padding: 10px 0;
	width: 45%;	
	max-width: 350px;
	height: 250px;
	
	font-family: arial,sans-serif;
	font-size: 18px;
	color: #666;
	text-decoration: none;
	text-align:  center;	
	
	border: 1px solid #b3b3b3; 
	border-radius: 10px;
	background-color:#f1f1f1;
	cursor: pointer;
}


.window_main_menu_form_reg_block_1
{
	margin: 35px auto;
	max-width: 450px;
	
	border: 1px solid #b3b3b3; 
	border-radius: 10px;
	background-color:#f1f1f1;	
}


.window_main_menu_form_reg_top_1
{
	position: relative;
	display: -webkit-box;
	display: flex;
	margin: 10px;
	margin-bottom: 50px;
	border-bottom: 1px solid #ccc;	
}

.window_main_menu_form_reg_top_1_block
{
	height: 30px;
	width: auto;	
	border: 1px solid #ccc;
	border-bottom: none;
	background-color:#fff;
	cursor: pointer;
}


.window_main_menu_form_reg_top_1_block_text
{
	margin:0.5em 15px;
	
	font-family: arial,sans-serif;
	font-size: 14px;
	color: #666;
	text-align:center;
}


.window_main_menu_form_reg_block_1_1
{
	display: -webkit-box;
	display: flex;
	padding: 10px 10px;
}

.window_main_menu_form_reg_block_1_label
{
	display: flex; /* Флексы */
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */
	width: 100px;
	
	font-family: arial,sans-serif;
	font-size: 18px;
	color: #666;	
}

.input_form_reg
{
	display: block;
	width:80%;
	margin: auto;
	
	border-radius: 3px;	
	font-family: arial,sans-serif;
	font-size: 17px;
	color: #666;
	
	line-height: 2em;
	padding: 0 10px;
}

.wm_reg_text_1
{
	font:15px Arial, Helvetica, sans-serif;
	text-align:center;	
}


.wm_reg_12
{
	margin: 30px auto 0 auto;
	padding: 20px;		
}


.wm_reg_13
{
	margin: 30px auto 0 auto;
	width:70%;
	padding: 40px;
	font-size: 17px;
}


.wm_reg_border_1
{
	background-color:#ffffff;
	border:solid 1px #b3b3b3; 
	-webkit-border-radius:3px;
	-moz-border-radius:3px; 
	border-radius: 3px;	
}




.window_main_menu_button_reg_1
{
	width: auto;
	height: 20px; 
	margin: 10px;
	margin-top: 50px;
	text-decoration:none; 
	text-align:center; 
	padding:11px 11px; 
	border:solid 1px #b3b3b3; 
	-webkit-border-radius:3px;
	-moz-border-radius:3px; 
	border-radius: 3px; 
	font:18px Arial, Helvetica, sans-serif; 
	font-weight:bold; 
	color:#737373; 

	cursor: pointer;
}

.inf_contact
{
	margin: 50px auto;
	
	max-width: 550px;
	height: 250px;		
	
	border: 1px solid #b3b3b3; 
	border-radius: 3px;
}


.inf_contact_text
{
	display: flex; /* Флексы */
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */

	margin: auto;
	width: 80%;
	height: 100%;
	
	font-family: arial,sans-serif;
	font-size: 25px;
	color: #666;	
}




@media screen and (max-width:850px), screen and (max-device-width:850px) 
{
	.window_main_menu_content_1_item
	{
		width: 150px;
		font-size: 16px;
	}
	
	.window_main_menu_content_1_h1
	{
		font-size: 18px;	
	}
	
	.inf_contact
	{
		height: 150px;
		width: 90%;
	}	
	
	.inf_contact_text
	{
		font-size: 18px;	
	}	
}
 
</style>


<script>
$(document).ready(function(){
	$('[nameId="background_main_menu"]').mousedown(function () 
	{	 
		$('[nameId="background_main_menu"]').css({"display":"none"}); 
	});

				
	$('[nameId="button_close_main_menu"]').mousedown(function () 
	{  
		$('[nameId="background_main_menu"]').css({"display":"none"}); 
	});
	
	$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
		
		

	$('[nameId="button_check_reg_1"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });
	$('[nameId="button_check_reg_2"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });	
	
	
	// переключаем в главном меню в форме регистрация кнопки: вход/регистрация
	function changeMainMenuRegistMenuUI(cdm)
	{
		var inf_block = $('[nameId="info_reg_1"]');
		var inf_str_1 = $('[nameId="info_reg_1_1"]');
		var inf_str_2 = $('[nameId="info_reg_1_2"]');
		
		inf_block.hide();
		inf_str_1.hide();
		inf_str_2.hide();		
	
		if(cdm.el.attributes.nameId.value == "button_check_reg_1") 
		{
			$('[nameId="act_reg_1"]').text('Войти');
			$('[nameId="act_reg_1"]').attr("b_type", "reg_1"); 
		}
		if(cdm.el.attributes.nameId.value == "button_check_reg_2") 
		{
			$('[nameId="act_reg_1"]').text('Зарегистрироваться');
			$('[nameId="act_reg_1"]').attr("b_type", "reg_2");
		}	
	}


	

$('[nameId="act_reg_1"]').mousedown(function () { checkRegDataIU(); });


// вход/регистрация пользователя (проверка правильности ввода данных почта/пароль)
function checkRegDataIU()
{
	var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
	var pattern_2 = /^[a-z0-9]{4,20}$/i;
	var mail = $('[nameId="input_reg_mail"]');
	var pass = $('[nameId="input_reg_pass"]');
	
	var inf_block = $('[nameId="info_reg_1"]');
	var inf_str_1 = $('[nameId="info_reg_1_1"]');
	var inf_str_2 = $('[nameId="info_reg_1_2"]');
	
	inf_block.hide();
	inf_str_1.hide();
	inf_str_2.hide();
	
	var flag_1 = false;
	var flag_2 = false;
	
	mail.val(mail.val().trim());	// удаляем пробелы  
	pass.val(pass.val().trim());	// удаляем пробелы 
	
	// проверка почты
	if(mail.val() != '')
	{
		if(pattern_1.test(mail.val()))
		{
			flag_1 = true;
		}
		else
		{
			inf_str_1.show();
			inf_str_1.text('Не верно указанна почта');			
		}
	}
	else
	{		
		inf_str_1.show();
		inf_str_1.text('Укажите e-mail');
	}
	
	
	// проверка пароля
	if(pass.val() != '')
	{
		if(pattern_2.test(pass.val()))
		{
			flag_2 = true;
		}
		else
		{
			inf_str_2.show();
			inf_str_2.html('Не верно указан пароль<br>(Только цифры и латинские буквы от 4 до 20 знаков)');			
		}
	}		
	else
	{		
		inf_str_2.show();
		inf_str_2.text('Укажите пароль');
	}
	
	
	// данные введены верно
	if(flag_1 && flag_2)
	{ 
		inf_block.hide();
		
		//console.log();
		var type = $('[nameId="act_reg_1"]').attr("b_type");
		
		$.ajax
		({
			type: "POST",					
			url: infProject.path+'components/regUser.php',
			data: {"type": type, "mail": mail.val(), "pass": pass.val()},
			dataType: 'json',
			success: function(data)
			{  
				if(type=='reg_1')	// авторизация пользователя
				{
					if(data.success)
					{
						infProject.user.id = data.info.id;
						infProject.user.mail = data.info.mail;
						infProject.user.pass = data.info.pass;

						$('[nameId="reg_content_1"]').show();
						$('[nameId="reg_content_2"]').hide();

						getListProject({id: infProject.user.id});
					}
					else
					{
						if(data.err.desc)
						{
							console.log(data.err.desc);
							inf_str_1.html(data.err.desc);
							
							inf_block.show();
							inf_str_1.show();
							inf_str_1.show();
							inf_str_2.hide();													
						}
					}
				}
				else if(type=='reg_2')	// регистрация нового пользователя
				{
					if(data.success)
					{
						inf_str_1.html("на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)");
						//inf_str_1.html("Вы успешно зарегистрировались");						
						
						inf_block.show();
						inf_str_1.show();
						inf_str_1.show();
						inf_str_2.hide();												
					}
					else
					{						
						if(data.err.desc)
						{
							console.log(data.err.desc);
							inf_str_1.html(data.err.desc);
							
							inf_block.show();
							inf_str_1.show();
							inf_str_1.show();
							inf_str_2.hide();													
						}						
					}
				}				
			}
		});		
	}
	else	// данные введены НЕ верно
	{  
		inf_block.show();
	}
};

	
});	


// получаем с сервера список проектов принадлежащих пользователю
function getListProject(cdm)
{  
	$.ajax
	({
		type: "POST",					
		url: infProject.path+'components/loadListProject.php',
		data: {"id": cdm.id },
		dataType: 'json',
		success: function(data)
		{  
			var html_load = '';
			var html_save = '';
			
			for(var i = 0; i < 2; i++)
			{
				if(data[i]) continue;
				
				data[i] = {id: 0, name: 'Пустой проект'}
			}
			
			for(var i = 0; i < data.length; i++)
			{				
				if(data[i].preview) 
				{
					html_save += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="save_pr_1"><img src="'+data[i].preview+'"></div>';
					html_load += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="load_pr_1"><img src="'+data[i].preview+'"></div>';
				}
				else
				{
					html_save += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="save_pr_1">'+data[i].name+'</div>';
					html_load += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="load_pr_1">'+data[i].name+'</div>';					
				}
			}
			
			$('[nameId="wm_list_save"]').html(html_save);
			$('[nameId="wm_list_load"]').html(html_load);
	
			
			$('[nameId="save_pr_1"]').on('mousedown', function(){ clickButtonSaveProjectUI(this); });
			$('[nameId="load_pr_1"]').on('mousedown', function(){ clickButtonLoadProjectUI(this); });
		}
	});	
}

// кликнули на кнопку сохранить проекта
function clickButtonSaveProjectUI(el)
{
	saveFile({id: el.attributes.projectid.value, upUI: true}); 
	
	$('[nameId="background_main_menu"]').hide();
}



// кликнули на кнопку загрузки проекта
function clickButtonLoadProjectUI(el)
{
	loadFile({id: el.attributes.projectid.value}); 
	
	$('[nameId="background_main_menu"]').hide();
}
 
</script>


<div class="background_main_menu" nameId="background_main_menu" ui_1="">
	<div class="modal_wrap">
		<div class="window_main_menu" nameId="window_main_menu">
			<div class="modal_window_close" nameId="button_close_main_menu">
				+
			</div>
			<div class="modal_header">
				<div class="modal_title">
					<div class="modal_name">
						<div modal_title='form'>
							Меню 
						</div>
					</div>
				</div>					
			</div>
			<div class='modal_body'>
				<div class='modal_body_content'>
					<div class="window_main_menu_content_1">					
						<div class="window_main_menu_content_1_row">
							<div class="window_main_menu_content_1_column">
								<div class="window_main_menu_content_1_item" nameId="button_main_menu_reg_1">Учетная запись</div>
								<a href="/" class="window_main_menu_content_1_item">Главная страница</a>
								<div class="window_main_menu_content_1_item" nameId="reset_scene_1">Пустой проект</div>
								<div class="window_main_menu_content_1_item" nameId="button_load_1">Загрузить</div>
								<div class="window_main_menu_content_1_item" nameId="button_save_1">Сохранить</div>
								<div class="window_main_menu_content_1_item" nameId="button_help">Видеоинструкция</div>
								<div class="window_main_menu_content_1_item" nameId="button_contact">Контакты</div>
							</div>
							<div class="window_main_menu_content_1_column">
								
								<div wwm_1="button_load_1" list_ui="window_main_menu_content" style="display: none;"> 
									<div class="window_main_menu_content_1_h1">
										Загрузить
									</div>
									<div class="window_main_menu_content_1_wrap_1" nameId="wm_list_load">
										<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
											Чтобы  сохранить или загрузить проект, вам нужно авторизоваться. 
										
											<div style="max-width: 350px; margin: auto;">
												<div class="window_main_menu_button_reg_1 button_gradient_1" nameId="button_main_menu_reg_1">
													Авторизоваться
												</div>	
											</div>	
										</div>										
									</div>
								</div>
								
								<div wwm_1="button_save_1" list_ui="window_main_menu_content" style="display: none;">
									<div class="window_main_menu_content_1_h1">
										Сохранить
									</div>
									<div class="window_main_menu_content_1_wrap_1" nameId="wm_list_save">
										<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
											Чтобы  сохранить или загрузить проект, вам нужно авторизоваться.

											<div style="max-width: 350px; margin: auto;">
												<div class="window_main_menu_button_reg_1 button_gradient_1" nameId="button_main_menu_reg_1">
													Авторизоваться
												</div>	
											</div>											
										</div>										
									</div>
								</div>
								
								<div wwm_1="button_main_menu_reg_1" list_ui="window_main_menu_content" style="display: block;">
								
									<div nameId="reg_content_1" style="display: none;">
									
										<div class="window_main_menu_content_1_h1">
											Вход выполнен
										</div>									
									
										<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
											Вы авторизовались.<br><br>Теперь вам доступно сохранение и загрузка проектов. 
										</div>									
									
									</div>
								
									<div nameId="reg_content_2" style="display: block;">
									
										<div class="window_main_menu_content_1_h1">
											Войдите или зарегистрируйтесь
										</div>
										<div class="window_main_menu_form_reg">
											<div class="window_main_menu_form_reg_block_1">
											
											
												<div class="window_main_menu_form_reg_top_1">
													<div class="window_main_menu_form_reg_top_1_block" nameId="button_check_reg_1">
														<div class="window_main_menu_form_reg_top_1_block_text">
															вход
														</div>	
													</div>
													<div class="window_main_menu_form_reg_top_1_block" nameId="button_check_reg_2">
														<div class="window_main_menu_form_reg_top_1_block_text">
															регистрация
														</div>	
													</div>			
												</div>	
												
												<div class="window_main_menu_form_reg_block_1_1">
													<div class="window_main_menu_form_reg_block_1_label">
														почта
													</div>											
													<input class="input_form_reg" type="text" nameId="input_reg_mail" value="">
												</div>
												<div class="window_main_menu_form_reg_block_1_1">
													<div class="window_main_menu_form_reg_block_1_label">
														пароль
													</div>											
													<input class="input_form_reg" type="text" nameId="input_reg_pass" value="">
												</div>
												
												<div class="window_main_menu_form_reg_block_1_1">
													<div nameId="info_reg_1" class="wm_reg_12 wm_reg_border_1 wm_reg_text_1" style="display: none;">
														<div nameId="info_reg_1_1" style="display: none;">
															Почта указана
														</div>
														<div nameId="info_reg_1_2" style="display: none;">
															Пароль указана
														</div>													
													</div>
												</div>
												
												<div class="window_main_menu_button_reg_1 button_gradient_1" b_type="reg_1" nameId="act_reg_1">
													Войти
												</div>
											</div>																					
										</div>
										
									</div>								
								
								
								</div>								
								
								<div wwm_1="button_help" list_ui="window_main_menu_content" style="display: none;">
									<div class="window_main_menu_content_1_h1">
										Полезная информация
									</div>								
									<div class="modal_wind_2" style="margin: 30px;">
										Приветствуем.<br> 
										Здесь вы сможете нарисовать и подсчитать количество труб для водяных полов в онлайн режиме. 
										Эта программа создана, чтобы простой человек без специальных знаний мог быстро спроектировать теплый пол для загородного или частного дома.
									</div>
									<div class="modal_wind_2" style="margin: 70px 30px 30px 30px;">
										Посмотрите короткое видео, как пользоваться программой:

										<div class="flex_1">
											<a href="https://www.youtube.com/watch?v=rqCZYTKqfIE" class="button_youtube_1 button_gradient_1" target="_blank">
												<img src="<?=$path?>/img/you_1.jpg">
											</a>					
											<a href="https://www.youtube.com/watch?v=DQl4HWaDiKc" class="button_youtube_1 button_gradient_1" target="_blank">
												<img src="<?=$path?>/img/you_2.jpg">
											</a>											
										</div>					
									</div>		
								</div>

								<div wwm_1="button_contact" list_ui="window_main_menu_content" style="display: none;">
									<div class="window_main_menu_content_1_h1">
										Контакты
									</div>								
									<div class="inf_contact button_gradient_1">
										<div class="inf_contact_text">
											otoplenie-doma@mail.ru
										</div>
									</div>		
								</div>								
								
							</div>							
						</div>
						<div class="window_main_menu_content_1_row">
						
						</div>						
					</div>
					
					<div class="window_main_menu_content_1">
					
					</div>
				</div>			
			</div>
			<div class='modal_footer'>
			</div>
		</div>			
	</div>	
</div>



