$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { clickInterface(); });
$('[data-action="left_panel_1"]').mousedown(function () { clickInterface(); });





$('[nameId="button_wrap_catalog"]').mousedown(function () { changeRightMenuUI({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { changeRightMenuUI({el: this}); });

 
// переключаем меню (каталог/список)
function changeRightMenuUI(cdm)
{
	if(cdm.el.attributes.nameId.value == "button_wrap_catalog") 
	{
		$('[nameId="wrap_catalog"]').show();
		$('[nameId="wrap_list_obj"]').hide();
	}
	if(cdm.el.attributes.nameId.value == "button_wrap_list_obj") 
	{
		$('[nameId="wrap_catalog"]').hide();
		$('[nameId="wrap_list_obj"]').show();
	}	
}


$('[infcam]').on('mousedown', function(e) 
{  
	var value = $(this).attr('infcam');
	var txt = (value == '3D') ? '2D' : '3D';
	$(this).text(txt);
	$(this).attr({"infcam": txt});
	
	if(value == '3D')
	{
		$('[nameId="top_menu_b1"]').hide();
		$('[nameId="top_menu_b2"]').hide();
		$('[inf_type="mode_1"]').hide();
	}
	else
	{
		if($('[nameId="top_menu_b1"]').attr('inf-visible') == 'true') { $('[nameId="top_menu_b1"]').show(); }
		if($('[nameId="top_menu_b2"]').attr('inf-visible') == 'true') { $('[nameId="top_menu_b2"]').show();	}
		$('[inf_type="mode_1"]').show();
	}
	
	clickInterface({button: value});
	return false; 
}); 
 

$('[nameId="color_tube_1_default"]').on('mousedown', function(e) 
{  
	$('[nameId="bb_menu_tube_menu_1"]').hide();
	$('[nameId="bb_menu_tube_menu_2"]').show();
	
	return false; 
});


  
 
	
$('[inf_type="mode_1"]').on('mousedown', function(e) { showHideObjMode_1(); return false; });
$('[nameId="showHideWall_1"]').on('mousedown', function(e) { showHideWallHeight_1(); return false; });

	
$('[data-action="select_pivot"]').mousedown(function () { return switchPivotGizmo({mode:'pivot'}); });
$('[data-action="select_gizmo"]').mousedown(function () { return switchPivotGizmo({mode:'gizmo'}); });	
$('[data-action="wall"]').mousedown(function () { return clickInterface({button:'point_1'}); });
$('[data-action="create_tube_1"]').mousedown(function () { return clickInterface({button:'create_tube_1'}); }); 
$('[data-action="create_tube_box_1"]').mousedown(function () { return clickInterface({button:'create_tube_box_1'}); }); 
$('[data-action="create_wd_2"]').mousedown(function () { return clickInterface({button:'create_wd_2'}); });
$('[data-action="create_wd_3"]').mousedown(function () { return clickInterface({button:'create_wd_3'}); });
$('[data-action="grid_show_1"]').mousedown(function () { return clickInterface({button:'grid_show_1'}); });
$('[data-action="grid_move_1"]').mousedown(function () { return clickInterface({button:'grid_move_1'}); });
$('[data-action="grid_link_1"]').mousedown(function () { return clickInterface({button:'grid_link_1'}); });
$('[add_lotid]').mousedown(function () { return clickInterface({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[data-action="screenshot"]').mousedown(function () { saveAsImage(); return false; }); 				



$('[link_form]').mousedown(function () 
{ 
	createForm({form : 'shape'+$(this).attr("link_form")}); 
	$('[data-action="modal"]').css({"display":"none"}); 
}); 


 
$("input").mousedown(function (e) { editText($(this)); e.stopPropagation(); }); 
$("input").mousemove(function (e) { return false; });


$('[data-action="deleteObj"]').mousedown(function () { detectDeleteObj(); return false; });
$('[data-action="addPointCenterWall"]').mousedown(function () { addPointCenterWall(); return false; });


$('input').on('focus', function () {  });
$('input').on('focus keyup change', function () 
{ 
	infProject.activeInput = $(this).data('action');
	if($(this).data('action') == undefined) { infProject.activeInput = $(this).data('input');  }
});
$('input').blur(function () { infProject.activeInput = ''; });	


$('[data-action="estimate"]').mousedown(function () 
{ 
	createEstimateJson();
	$('.modal').css({"display":"block"});
	$('[modal_body="estimate"]').css({"display":"block"}); 
	$('[modal_body="form"]').css({"display":"none"});
	$('[modal_title="estimate"]').css({"display":"block"});
	$('[modal_title="form"]').css({"display":"none"});			
}); 

$('[data-action="form_1"]').mousedown(function () 
{ 
	console.log('form_1');
	getFormWallR_1();
	checkClickUINameID('form_1');
	clickInterface();
	$('.modal').css({"display":"block"});
	$('[modal_body="estimate"]').css({"display":"none"});
	$('[modal_body="form"]').css({"display":"block"});
	$('[modal_title="estimate"]').css({"display":"none"});
	$('[modal_title="form"]').css({"display":"block"});
});


$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{	
	checkChangeFormWallR();			
	clickInterface(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	checkChangeFormWallR();
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


  
  
function editText(input) 
{
	infProject.activeDiv = input;
	infProject.activeInput = input.data('action');  
	
	if(input.data('action') == undefined) { infProject.activeInput = input.data('input'); }
	console.log(infProject.activeInput);
	
	checkClickUINameID(infProject.activeInput);
}	


function checkClickUINameID(name)
{
	if(name == 'wall_1' || name == 'wall_plaster_width_1' || name == 'form_1'){ hideMenuObjUI_Wall(clickO.last_obj); }
}



});
