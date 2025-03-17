
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
		const tubes = [];
		for ( let i = 0; i < this.dataNotes.length; i++ )
		{
			points.push(...this.dataNotes[i].points);

			if(this.dataNotes[i].tag === 'noteMarker' || this.dataNotes[i].tag === 'noteText')
			{
				sprites.push(this.dataNotes[i].sprite);
			}
			
			const tube = myNotesInstance.getTube({line: this.dataNotes[i].line});
			if(tube) tubes.push(tube);
		}		
		
		const ray = rayIntersect( event, [...points, ...sprites, ...tubes], 'arr' );
		if(ray.length > 0) 
		{ 
			rayhit = ray[0]; 
			
			// проверка куда кликнули, если кликнули на прозрачную трубу, то убеждаеся что под ней нет (точки/стрелки)
			// если есть, то назначаем точку/стрелку rayhit
			if(rayhit.object.userData.tag === 'noteTubeHelp')
			{
				const tube = rayhit.object;
				const points = myNotesInstance.getPointsFromTube({tube});
				
				let result = null;
				
				for ( let i = 1; i < ray.length; i++ )
				{
					for ( let i2 = 0; i2 < points.length; i2++ )
					{
						if(ray[i].object === points[i2])
						{
							result = ray[i];
							break;
						}
					}
					if(result) break;
				}
				
				if(result) rayhit = result;
			}
		}

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
	}


	getDataNotes()
	{
		return this.dataNotes;
	}
}







