
// активируем (выделяем) выбранную сетку
class MyGridActivate 
{
	actDataGrid = null;
	
	// получить активную сетку
	getActDataGrid()
	{
		return this.actDataGrid;
	}
	
	
	// активируем сетку при клике на нее
	activateDataGrid({dataGrid})
	{
		const meshes = dataGrid.grille.meshes;
		const points = dataGrid.points;		
		if(meshes.length === 0) return;
		
		meshes[0].material.color = new THREE.Color(myGridMesh.actColorNumber);
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = true;
		}		
		
		myUiGridPanel.setValueInputSizeCell(dataGrid.grille.sizeCell * 100);
		
		this.actDataGrid = dataGrid;
	}
	
	
	// активируем сетку при клике на точку контура
	activatePointDataGrid({point})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});		
		if(!dataGrid) return;
		
		const meshes = dataGrid.grille.meshes;
		const points = dataGrid.points;		
		if(meshes.length === 0) return;

		meshes[0].material.color = new THREE.Color(myGridMesh.actColorNumber);
		
		point.material.color = new THREE.Color(infProject.listColor.active2D);
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = true;
		}		
		
		this.actDataGrid = dataGrid;
	}


	// деактивируем сетку, после того когда она была активирована при клике на нее
	deActivateDataGrid({dataGrid})
	{
		const meshes = dataGrid.grille.meshes;
		const points = dataGrid.points;
		if(meshes.length === 0) return;
		
		meshes[0].material.color = new THREE.Color(myGridMesh.defColorNumber);
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = false;
		}		

		myUiGridPanel.setValueInputSizeCell('');
		
		this.actDataGrid = null;
	}
	
	
	// деактивируем сетку, после того когда она была активирована при клике на точку контура
	deActivatePointDataGrid({point})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});		
		if(!dataGrid) return;
		
		const meshes = dataGrid.grille.meshes;
		const points = dataGrid.points;
		if(meshes.length === 0) return;
		
		meshes[0].material.color = new THREE.Color(myGridMesh.defColorNumber);
		
		point.material.color = myGrids.colorPoint.clone();
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = false;
		}		
		
		this.actDataGrid = null;
	}	

		
	render()
	{
		renderCamera();
	}
}







