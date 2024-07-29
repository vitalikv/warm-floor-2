
// основной класс выноски (стрелки, линейка, рулетка)
class MyNotes
{
	dataNotes = [];
	

	crNotesFromBtn({lotid, pos, event})
	{
		console.log(lotid);
		let obj = null;
		
		if(lotid === 1) obj = myNoteRulerTool.crToolPoint({pos, event});
		if(lotid === 2) obj = myNoteRouletteTool.crToolPoint({pos, event});
		
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
		
		const arr = [];
		for ( let i = 0; i < this.dataNotes.length; i++ )
		{
			arr.push(...this.dataNotes[i].points);			
		}		
		
		const ray = rayIntersect( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }
console.log(777, rayhit)
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
}







