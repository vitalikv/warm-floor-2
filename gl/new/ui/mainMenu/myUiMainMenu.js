
// главное меню
class MyUiMainMenu 
{
	divMainMenu;
	divButtClose;
	
	
	constructor()
	{
		this.init();
		this.changeMainMenuUI({el: infProject.elem.mainMenu.m6});
	}
	

	
	init()
	{
		infProject.elem = {};
		infProject.elem.mainMenu = {};

		infProject.elem.mainMenu.m1 = document.querySelector('[nameId="butt_main_menu"]');	// кнопка открытия меню 
		infProject.elem.mainMenu.g = document.querySelector('[nameId="background_main_menu"]');
		this.divMainMenu = document.querySelector('[nameId="window_main_menu"]');
		this.divButtClose = this.divMainMenu.querySelector('[nameId="button_close_main_menu"]');		
		

		// кнопки разделов
		infProject.elem.mainMenu.m2 = this.divMainMenu.querySelector('[nameId="reset_scene_1"]');
		infProject.elem.mainMenu.m3 = this.divMainMenu.querySelector('[nameId="button_main_menu_reg_1"]');
		infProject.elem.mainMenu.m4 = this.divMainMenu.querySelector('[nameId="button_load_1"]');
		infProject.elem.mainMenu.m5 = this.divMainMenu.querySelector('[nameId="button_save_1"]');
		infProject.elem.mainMenu.m6 = this.divMainMenu.querySelector('[nameId="button_help"]');
		infProject.elem.mainMenu.m7 = this.divMainMenu.querySelector('[nameId="button_contact"]');
		infProject.elem.mainMenu.m8 = this.divMainMenu.querySelector('[nameId="button_reset_pass_1"]');
		infProject.elem.mainMenu.m_bs = this.divMainMenu.querySelector('[nameId="bl_inf_regin_s"]');
		infProject.elem.mainMenu.m_bl = this.divMainMenu.querySelector('[nameId="bl_inf_regin_l"]');

		// контейнеры разделов
		infProject.elem.mainMenu.b3 = this.divMainMenu.querySelector('[wwm_1="button_main_menu_reg_1"]');
		infProject.elem.mainMenu.b4 = this.divMainMenu.querySelector('[wwm_1="button_load_1"]');
		infProject.elem.mainMenu.b5 = this.divMainMenu.querySelector('[wwm_1="button_save_1"]');
		infProject.elem.mainMenu.b6 = this.divMainMenu.querySelector('[wwm_1="button_help"]');
		infProject.elem.mainMenu.b7 = this.divMainMenu.querySelector('[wwm_1="button_contact"]');
		infProject.elem.mainMenu.b8 = this.divMainMenu.querySelector('[wwm_1="button_reset_pass_1"]');
		
		this.initEvent();
	}
	
	
	initEvent()
	{
		// открываем меню
		infProject.elem.mainMenu.m1.onmousedown = () => { infProject.elem.mainMenu.g.style.display = 'block'; }
		
		// переключаем кнопки разделов
		infProject.elem.mainMenu.m2.onmousedown = () => { resetScene(); this.hideMenu(); }
		infProject.elem.mainMenu.m3.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 
		infProject.elem.mainMenu.m4.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 
		infProject.elem.mainMenu.m5.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 
		infProject.elem.mainMenu.m6.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 
		infProject.elem.mainMenu.m7.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 
		infProject.elem.mainMenu.m8.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); } 	
		infProject.elem.mainMenu.m_bs.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); }
		infProject.elem.mainMenu.m_bl.onmousedown = (e) => { this.changeMainMenuUI({el: e.target}); }	

		// закрытие меню
		this.divButtClose.onmousedown  = () => { this.hideMenu(); }

		// блокируем все что находится за фоном меню
		infProject.elem.mainMenu.g.onmousedown  = (e) => { this.hideMenu(); e.stopPropagation(); }
		infProject.elem.mainMenu.g.addEventListener('wheel', function(e) { e.stopPropagation(); });
		infProject.elem.mainMenu.g.addEventListener('DOMMouseScroll', function(e) { e.stopPropagation(); });
		infProject.elem.mainMenu.g.addEventListener('mousewheel', function(e) { e.stopPropagation(); });		
		this.divMainMenu.onmousedown  = (e) => { e.stopPropagation(); }		
	}
	
	
	// переключаем разделы
	changeMainMenuUI(cdm)
	{
		let q = [];
		
		q[q.length] = { butt: infProject.elem.mainMenu.m3, wrap: infProject.elem.mainMenu.b3 };
		q[q.length] = { butt: infProject.elem.mainMenu.m4, wrap: infProject.elem.mainMenu.b4 };
		q[q.length] = { butt: infProject.elem.mainMenu.m5, wrap: infProject.elem.mainMenu.b5 };
		q[q.length] = { butt: infProject.elem.mainMenu.m6, wrap: infProject.elem.mainMenu.b6 };
		q[q.length] = { butt: infProject.elem.mainMenu.m7, wrap: infProject.elem.mainMenu.b7 };
		q[q.length] = { butt: infProject.elem.mainMenu.m8, wrap: infProject.elem.mainMenu.b8 };
		q[q.length] = { butt: infProject.elem.mainMenu.m_bs, wrap: infProject.elem.mainMenu.b3 };
		q[q.length] = { butt: infProject.elem.mainMenu.m_bl, wrap: infProject.elem.mainMenu.b3 };
		
		let b = [];
		
		b[b.length] = infProject.elem.mainMenu.b3;
		b[b.length] = infProject.elem.mainMenu.b4;
		b[b.length] = infProject.elem.mainMenu.b5;
		b[b.length] = infProject.elem.mainMenu.b6;
		b[b.length] = infProject.elem.mainMenu.b7;
		b[b.length] = infProject.elem.mainMenu.b8;
		
		for ( let i = 0; i < b.length; i++ )
		{
			b[i].style.display = 'none';	
		}


		for ( let i = 0; i < q.length; i++ )
		{
			if(q[i].butt == cdm.el) { q[i].wrap.style.display = 'block'; break; }  			
		}		
	}


	// закрытие меню
	hideMenu()
	{
		infProject.elem.mainMenu.g.style.display = 'none';		
	}
}







