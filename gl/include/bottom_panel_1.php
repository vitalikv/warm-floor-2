


<div class="bottom_panel_1" nameId="bottom_panel_1" style="z-index: 1;">	

	<?if($interface['click_wall_2D'] == 1){?>
		<div class="toolbar" nameId='wall_menu_1' style="display: none;">
			<div class="toolbar-header">стена</div>
			<div class="toolbar-menu">					
				<div class="button1-wrap-2">
					<div data-action ='addPointCenterWall' class="button1"><p>Добавить точку</p></div>
				</div>					
				<div class="button1-wrap-2">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>			
			</div>
		</div>
		
		
		<div class="toolbar" nameId='point_menu_1' style="display: none;">
			<div class="toolbar-header">точка</div>
			<div class="toolbar-menu">
				<div class="button1-wrap-2">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>			
			</div>
		</div>	
	<?}?>
	
	<?if($interface['wall_b1'] == 1){?>
	<div class="toolbar" nameId='wall_menu_1' style="display: none;">
		<div class="toolbar-header">стена</div>
		<div class="toolbar-menu">				
			<div class="input-size">
				<div class="text_1">длина (м)</div>
				<input type="text" nameId='size-wall-length' data-input='wall_1' value = 0>
			</div>
			
			<div class="input-size">
				<div class="text_1">высота (м)</div>
				<input type="text" nameId='size-wall-height' data-input='wall_1' value = 0>
			</div>					 
			
			<div class="input-size">
				<div class="text_1">толщина (м)</div>
				<input type="text" nameId='size-wall-width' data-input='wall_1' value = 0>
			</div>		
		</div>
	</div>		 
	<?}?>
	
	<? if($interface['wd_1'] == 1){ ?>
	<div class="toolbar" nameId='wd_menu_1' style="display: none;">
		<div class="toolbar-header">проём</div>
		<div class="toolbar-menu">
			<div class="input-size">
				<div class="text_1">длина (м)</div>
				<input type="text" nameId='size-wd-length' data-input='wd_1' value = 0>
			</div>
			
			<div class="input-size" style="display: none;">
				<div class="text_1">высота (м)</div>
				<input type="text" nameId='size-wd-height' data-input='wd_1' value = 0>
			</div>	
							
			<div class="button1-wrap-2">
				<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
			</div>			
		</div>
	</div>	
	<?}?>
	
	<?if($interface['tube_b1'] == 1){?>
	<div class="toolbar" data-action ='top_panel_1' nameId='tube_menu_1' style="display: none;">
		<div class="toolbar-header">труба</div>
		<div class="toolbar-menu" nameId='bb_menu_tube_menu_1'>				
			<div class="input-size-2">
				<div class="text_1">диаметр (мм)</div>
				<input type="text" nameId='size_tube_diameter_2' data-input='size_tube_diameter_2' value = 0>
			</div>
			
			<div class="input-size-2">
				<div class="text_1">цвет</div>
				<div class="color_1_red" nameId='color_tube_1_default'></div> 
			</div>					 
			
			<div class="input-size-2">
				<div class="text_1">длина (м)</div>
				<div class="text_input_1" nameId='size_tube_dist_2'>0</div>
			</div>	

			<div class="button1-wrap-2">
				<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
			</div>			
		</div>
		
		<div class="toolbar-menu" nameId='bb_menu_tube_menu_2' style="display: none;">
			<div class="color_tube_1_change" color_tube_1_change='e5e5e5' style="background-color:#e5e5e5;"></div>
			<div class="color_tube_1_change" color_tube_1_change='0252f2' style="background-color:#0252f2;"></div>
			<div class="color_tube_1_change" color_tube_1_change='f2b202' style="background-color:#f2b202;"></div> 
			<div class="color_tube_1_change" color_tube_1_change='9602f2' style="background-color:#9602f2;"></div>
			<div class="color_tube_1_change" color_tube_1_change='f202e2' style="background-color:#f202e2;"></div>
			<div class="color_tube_1_change" color_tube_1_change='828282' style="background-color:#828282;"></div>
			<div class="color_tube_1_change" color_tube_1_change='141414' style="background-color:#141414;"></div>
		</div>
	</div>

	<div class="toolbar" data-action ='top_panel_1' nameId='wf_point_menu_1' style="display: none;">
		<div class="toolbar-header">точка</div>
		<div class="toolbar-menu">
			<div class="input-size-2">
				<div class="text_1">длина (м)</div>
				<div class="text_input_1" nameId='size_tube_dist_3'>0</div>
			</div>
			
			<div class="button1-wrap-2">
				<div data-action ='deleteObj' nameId='delete_wf_point_1' class="button1"><img src="<?=$path?>/img/waste.png"></div>
			</div>			
		</div>
	</div>	
	<?}?>

	<?if($interface['wall_2']['bottom']['width_1'] == 1){?>
		<div class="toolbar" data-action ='top_panel_1' nameId='wall_menu_1' style="display: none;">
			<div class="toolbar-header">стена</div>
			<div class="toolbar-menu">								 			
				<div class="input-size">
					<div class="text_1">толщина (м)</div>
					<input type="text" nameId='size_wall_width_1' data-input='size_wall_width_1' value = 0>
				</div>
				<div class="button1-wrap-2">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>				
			</div>
		</div>	
		<div class="toolbar" data-action ='top_panel_1' nameId='point_menu_1' style="display: none;">
			<div class="toolbar-header">точка</div>
			<div class="toolbar-menu">
				<div style="margin: 10px;">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>			
			</div>
		</div>		
	<?}?>
	
	
	<?if($interface['box_wf_b1'] == 1){?>
		<div class="toolbar" data-action ='top_panel_1' nameId='box_wf_b1' style="display: none;">
			<div class="toolbar-header">контур</div>
			<div class="toolbar-menu"> 			
				<div style="margin: 10px;">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>			
			</div>
		</div>		
	<?}?>	
	
	
	<?if($interface['obj_b1'] == 1){?>
		<div class="toolbar" data-action ='top_panel_1' nameId='obj_b_menu_1' style="display: none;">
			<div class="toolbar-header">объект</div>
			<div class="toolbar-menu">
				<div style="margin: 10px;">
					<div data-action ='select_pivot' class="button1">перемещение</div>
				</div>
				<div style="margin: 10px;">
					<div data-action ='select_gizmo' class="button1">вращение</div>
				</div>				
				<div style="margin: 10px;">
					<div data-action ='deleteObj' class="button1"><img src="<?=$path?>/img/waste.png"></div>
				</div>			
			</div>
		</div>		
	<?}?>
	
	
	<div class="toolbar" nameId='dp_inf_1' style="display: none;">
		<div class="toolbar-menu">								 			
			<div class="input-size">
				<input type="text" nameId='dp_inf_1_proj' data-input='dp_inf_1_proj' value = 0>
			</div>		
		</div>
	</div>		
</div>	
