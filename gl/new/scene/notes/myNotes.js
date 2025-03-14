
// основной класс выноски (стрелки, линейка, рулетка)
class MyNotes
{
	dataNotes = [];
	posY = 0;
	
	constructor()
	{
		this.posY = infProject.settings.grid.pos.y;
	}
	
	// создание выноски через кнопку в панеле
	crNotesFromBtn({lotid, event})
	{
		console.log(lotid);
		let obj = null;
		
		planeMath.position.set(0, this.posY + 0.1, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		const intersects = rayIntersect( event, planeMath, 'one' );
		const pos = intersects[0].point;
		
		if(lotid === 1) obj = myNoteRulerTool.crToolPoint({pos, event});
		if(lotid === 2) obj = myNoteRouletteTool.crToolPoint({pos, event});
		if(lotid === 3) obj = myNoteMarkerTool.crToolPoint({pos, event});
		if(lotid === 4) obj = myNoteTextTool.crToolPoint({pos, event});
		
		return obj;
	}
	
	
	// заносим в массив инфо о созданном объекте
	addDataNote({data})
	{
		this.dataNotes.push(data);
		
		console.log(222, this.dataNotes);
	}
	
	
	// определяем на что кликну
	clickRayhit({event})
	{
		let rayhit = null;
		
		const points = [];
		const sprites = [];
		for ( let i = 0; i < this.dataNotes.length; i++ )
		{
			points.push(...this.dataNotes[i].points);

			if(this.dataNotes[i].tag === 'noteMarker' || this.dataNotes[i].tag === 'noteText')
			{
				sprites.push(this.dataNotes[i].sprite);
			}
		}		
		
		const ray = rayIntersect( event, [...points, ...sprites], 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }

		return rayhit;
	}

	
	
	deleteDataNote({data})
	{
		for ( let i = 0; i < this.dataNotes.length; i++ )
		{
			const checkData = { countItem: 0, equals: 0 };
			
			for(const item of Object.keys(this.dataNotes[i]))
			{
				checkData.countItem += 1;
				
				if(this.dataNotes[i][item] === data[item]) checkData.equals += 1;
			}
			
			if (checkData.countItem === checkData.equals)
			{
				this.dataNotes.splice(i, 1);
				break;
			}
		}
		console.log(555, this.dataNotes);
	}


	getDataNotes()
	{
		return this.dataNotes;
	}
}







