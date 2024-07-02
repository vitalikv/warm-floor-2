
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
		const meshes = myGrids.getGridMeshes({dataGrid});
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		if(meshes.length === 0) return;
		if(points.length === 0) return;
		
		const modeOffset = myGrids.getModeOffset({dataGrid});
		const modeLink = myGrids.getModeLink({dataGrid});
		
		this.setColorContourLineGrid({point: points[0], act: true});
		this.setColorMeshGrid({dataGrid, act: modeOffset});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = true;
		}		
		
		myUiGridPanel.setValueInputSizeCell(dataGrid.grille.sizeCell * 100);
		myUiGridPanel.btnToggleOffset({setAct: (modeOffset) ? 1 : 0});
		myUiGridPanel.btnToggleLink({setAct: (modeLink) ? 1 : 0});		
		
		this.actDataGrid = dataGrid;
	}
	
	
	// активируем сетку при клике на точку контура
	activatePointDataGrid({point})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});		
		if(!dataGrid) return;
		
		const meshes = myGrids.getGridMeshes({dataGrid});
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		if(meshes.length === 0) return;
		if(points.length === 0) return;		
		
		const modeOffset = myGrids.getModeOffset({dataGrid});
		const modeLink = myGrids.getModeLink({dataGrid});

		this.setColorContourLineGrid({point, act: true});
		this.setColorPointGrid({point, act: true});
		this.setColorMeshGrid({dataGrid, act: modeOffset});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = true;
		}

		myUiGridPanel.setValueInputSizeCell(dataGrid.grille.sizeCell * 100);
		myUiGridPanel.btnToggleOffset({setAct: (modeOffset) ? 1 : 0});
		myUiGridPanel.btnToggleLink({setAct: (modeLink) ? 1 : 0});			
		
		this.actDataGrid = dataGrid;
	}


	// деактивируем сетку, после того когда она была активирована при клике на нее
	deActivateDataGrid({dataGrid})
	{
		const meshes = myGrids.getGridMeshes({dataGrid});
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		if(meshes.length === 0) return;
		if(points.length === 0) return;
		
		this.setColorContourLineGrid({point: points[0], act: false});
		this.setColorMeshGrid({dataGrid, act: false});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = false;
		}		

		myUiGridPanel.setValueInputSizeCell('');		
		
		this.actDataGrid = null;
		
		myUiGridPanel.btnToggleOffset({setAct: 0});
		myUiGridPanel.btnToggleLink({setAct: 0});		
	}
	
	
	// деактивируем сетку, после того когда она была активирована при клике на точку контура
	deActivatePointDataGrid({point})
	{
		const dataGrid = myGrids.getDataGridFromPoint({point});		
		if(!dataGrid) return;
		
		const meshes = myGrids.getGridMeshes({dataGrid});
		const points = myGrids.getPointsFromDataGrid({dataGrid});
		if(meshes.length === 0) return;
		if(points.length === 0) return;
		
		this.setColorContourLineGrid({point, act: false});		
		this.setColorPointGrid({point, act: false});
		this.setColorMeshGrid({dataGrid, act: false});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].visible = false;
		}		
		
		this.actDataGrid = null;
	}	


	// устанавливаем цвет точки в зависимости актвирована или нет
	setColorPointGrid({point, act = false})
	{
		point.material.color = (act) ? new THREE.Color(myGrids.actColorPointNumber) : new THREE.Color(myGrids.defColorPointNumber);
	}
	
	
	// устанавливаем цвет контура линии в зависимости актвирована сетка или нет
	setColorContourLineGrid({point, act = false})
	{
		const line = myGrids.getLineFromPoint({point});
		line.material.color = (act) ? new THREE.Color(myGrids.actColorLineNumber) : new THREE.Color(myGrids.defColorLineNumber);
	}


	// устанавливаем цвет контура обрешетки в зависимости от автивровано смещение или нет
	setColorMeshGrid({dataGrid, act = false})
	{
		const meshes = myGrids.getGridMeshes({dataGrid});
		const mesh = meshes[0];
		
		if(act)
		{
			mesh.material.color = new THREE.Color(myGridMesh.actColorMeshNumber);
		}
		else
		{
			const actLink = myGrids.getModeLink({dataGrid});
			
			mesh.material.color = (actLink) ? new THREE.Color(myGridMesh.linkColorMeshNumber) : new THREE.Color(myGridMesh.defColorMeshNumber);
		}
	}
	
	render()
	{
		renderCamera();
	}
}







