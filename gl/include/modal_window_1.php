


<div class="modal" data-action ='modal' style="z-index: 1;">
	<div class="modal_wrap">
		<div class="modal_window" data-action ='modal_window'>
			<div class="modal_window_close" data-action ='modal_window_close'>
				+
			</div>
			<div class="modal_header">
				<div class="modal_title">
					<div class="modal_name">
						<div modal_title='form' style="display: block;">
							<?if($interface['form_1'] == 1){?>Выберите форму<?}?>	
							<?if($interface['raschet_kirpicha'] == 1){?>Кирпичи<?}?>
							<?if($interface['raschet_blokov'] == 1){?>Блоки<?}?>
						</div>
						<div modal_title='estimate' style="display: none;">Смета</div>
					</div>
				</div>					
			</div>
			<div class='modal_body'>
				<div class='modal_body_content' modal_body='estimate' style="display: none;">

				</div>
			
			
				<div class='modal_body_content' modal_body='form' style="display: none;">
					
					<?if($interface['raschet_kirpicha'] == 1){?>
					
						<div class="raschet_blokov_1"> 
							<div class="raschet_blokov_1_block_1">
								<div class="raschet_blokov_1_header_1">Вариант кладки</div>
								
								<div class="raschet_blokov_1_radio_1">	 
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value = "0.5" name="block_layer" checked>
										<div class="raschet_blokov_1_radio_label">0.5 кирпича</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value = "1" name="block_layer">
										<div class="raschet_blokov_1_radio_label">1 кирпич</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value = "1.5" name="block_layer">
										<div class="raschet_blokov_1_radio_label">1.5 кирпича</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value = "2" name="block_layer">
										<div class="raschet_blokov_1_radio_label">2 кирпича</div>
									</div>
								</div>									
							</div>
							
							<div class="raschet_blokov_1_block_1">
								<div class="raschet_blokov_1_header_1">Толщина раствора</div>
								
								<div class="raschet_blokov_1_radio_1">	 
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.01" name="block_seam" checked>
										<div class="raschet_blokov_1_radio_label">1 см</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.015" name="block_seam">
										<div class="raschet_blokov_1_radio_label">1.5 см</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.02" name="block_seam">
										<div class="raschet_blokov_1_radio_label">2 см</div>
									</div>
								</div>									
							</div>	

							<div class="raschet_blokov_1_block_1"> 
								<div class="raschet_blokov_1_header_1">Размер кирпича (Длина/Ширина/Высота)</div>									
								
								<div class="raschet_blokov_1_radio_1">	 
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="250х120х65" name="block_size" checked>
										<div class="raschet_blokov_1_radio_label">одинарный 250х120х65 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="250х120х88" name="block_size">
										<div class="raschet_blokov_1_radio_label">полуторный 250х120х88 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="250х120х140" name="block_size">
										<div class="raschet_blokov_1_radio_label">двойной 250х120х140 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" name="radio3">
										<div class="raschet_blokov_1_radio_label">свой</div>
									</div>
								</div>									
								
							</div>
						</div>
						
					<?}?>
					
					
					<?if($interface['raschet_blokov'] == 1){?>
						<div class="raschet_blokov_1"> 
							
							<div class="raschet_blokov_1_block_1">
								<div class="raschet_blokov_1_header_1">Толщина раствора</div>
								
								<div class="raschet_blokov_1_radio_1">
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.005" name="block_seam" checked>
										<div class="raschet_blokov_1_radio_label">клей</div>
									</div>									
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.01" name="block_seam">
										<div class="raschet_blokov_1_radio_label">1 см</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.015" name="block_seam">
										<div class="raschet_blokov_1_radio_label">1.5 см</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="0.02" name="block_seam"> 
										<div class="raschet_blokov_1_radio_label">2 см</div>
									</div>
								</div>									
							</div>	

							<div class="raschet_blokov_1_block_1"> 
								<div class="raschet_blokov_1_header_1">Размер блоков (Длина/Ширина/Высота)</div>									
								
								<div class="raschet_blokov_1_radio_1">	 
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="600х200х200" name="block_size" checked>
										<div class="raschet_blokov_1_radio_label">600х200х200 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="600х250х200" name="block_size">
										<div class="raschet_blokov_1_radio_label">600х250х200 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" value="600х300х200" name="block_size">
										<div class="raschet_blokov_1_radio_label">600х300х200 мм</div>
									</div>
									<div class="raschet_blokov_1_radio_str"> 
										<input type="radio" name="radio3">
										<div class="raschet_blokov_1_radio_label">свой</div>
									</div>
								</div>									
								
							</div>
						</div>
					<?}?>						
					
					<? if($interface['form_1'] == 1){ ?>
					<div class='modal_body_content_grid'>
					<?
						for ($i=0; $i<15; $i++) 
						{
							echo '
							<div class="block_form_1" link_form = "'.$i.'">
								<div class="block_form_1_image_wrap">
									<img src="'.$path.'/img/f'.$i.'.png">
								</div>
								<div class="block_form_1_desc">';
									if($i == 0) { echo 'пустой план'; }
									else { echo 'форма '.($i+1); }
								echo '	
								</div>
							</div>';
						}
					?>
					</div>
					<?}?>
				</div>
			</div>
			<div class='modal_footer'>
			</div>
		</div>			
	</div>	
</div>
