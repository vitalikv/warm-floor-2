

<div class="left_panel_1" data-action ='left_panel_1' ui_1="" style="z-index: 1;">

	
	<?if($interface['monolit_fundament'] == 1){?>
	<div class="left-input-block">
		<div class="left-input-block-header">фундамент</div>
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_1'><img src="<?=$path?>/img/f4.png"></div>
		</div> 			
		
		<div class="input-height">
			<div class="text_1">высота (см)</div>
			<input type="text" data-action ='input-height' data-input='' value = 20>
		</div>	
	</div>		
	<?}?>
	
	
	<?if($interface['lentochnii_fundament'] == 1 || $interface['svaynyy_fundament'] == 1){?>
	<div class="left-input-block">
		<div class="left-input-block-header">фундамент</div>
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_1'><img src="<?=$path?>/img/f4.png"></div>
		</div> 			
		
		<div class="input-height">
			<div class="text_1">ширина (см)</div>
			<input type="text" data-action ='input-width' data-input='' value = 30>
		</div> 
		
		<div class="input-height">
			<div class="text_1">высота (см)</div>
			<input type="text" data-action ='input-height' data-input='' value = 20>
		</div>			
	</div>		
	<?}?>		
	
	
	<?if($interface['obyem_pomeshcheniya'] == 1){?>
	<div class="left-input-block">
		<div class="left-input-block-header">стены</div>
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_1'><img src="<?=$path?>/img/f4.png"></div>
		</div> 			
		
		<div class="input-height">
			<div class="text_1">высота (см)</div>
			<input type="text" data-action ='input-height' data-input='' value = 20>
		</div>	
	</div>		
	<?}?>
	
	
	<?if($interface['wall_plaster_width_1'] == 1){?>
	<div class="left-input-block">
		<div class="left-input-block-header">стена</div>
		<div class="input-height">
			<div class="text_1">длина (м)</div>
			<input type="text" nameId='size-wall-length' data-input='wall_1' value = 6>
		</div> 
		
		<div class="input-height">
			<div class="text_1">высота (м)</div>
			<input type="text" nameId='size-wall-height' data-input='wall_1' value = 2>
		</div>	
		
		<div class="left-input-block-header">штукатурка</div>
		<div class="input-height">
			<div class="text_1">толщина (см)</div>
			<input type="text" nameId='wall_plaster_width_1' data-input='wall_plaster_width_1' value = 3>
		</div>
	</div>
	<?}?>	


	<?if($interface['raschet_kirpicha'] == 1 || $interface['raschet_blokov'] == 1){?>
	<div class="left-input-block">
		<div class="left-input-block-header">кладка</div>
		<div class="side_panel-button">			
			<div class="button2" data-action ='form_1'>
				<?if($interface['raschet_kirpicha'] == 1){?><img src="<?=$path?>/img/block_1.jpg"><?}?>
				<?if($interface['raschet_blokov'] == 1){?><img src="<?=$path?>/img/block_2.jpg"><?}?>
			</div>
		</div> 			
		
		<div class="left-input-block-header">стена</div>
		<div class="input-height">
			<div class="text_1">длина (м)</div>
			<input type="text" nameId='size-wall-length' data-input='wall_1' value = 6>
		</div> 
		
		<div class="input-height">
			<div class="text_1">высота (м)</div>
			<input type="text" nameId='size-wall-height' data-input='wall_1' value = 2>
		</div>			
	</div>		
	<?}?>	


	<?if($interface['grid_tube_1'] == 1){?>
	<div nameId="gridPanel"></div>
	<?}?>

	
</div>
