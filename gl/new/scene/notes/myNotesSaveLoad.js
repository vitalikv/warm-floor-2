
// сохранение/загрузка выносок (линейка, рулетка и т.д.)
class MyNotesSaveLoad
{
	
	resetNotes()
	{
		const dataNotes = myNotes.getDataNotes();
		
		for ( let i = dataNotes.length - 1; i >= 0; i-- )
		{
			const tag = dataNotes[i].tag;
			
			if(tag === 'noteRuler')
			{
				myNoteRuler.deleteNoteRuler({obj: dataNotes[i].points[0]});
			}
			if(tag === 'noteRoulette')
			{
				myNoteRoulette.deleteNoteRoulette({obj: dataNotes[i].points[0]});
			}
			if(tag === 'noteMarker')
			{
				myNoteMarker.deleteNoteMarker({obj: dataNotes[i].points[0]});
			}
			if(tag === 'noteText')
			{
				myNoteText.deleteNoteText({obj: dataNotes[i].points[0]});
			}				
		}	
	}
	
	
	saveNotes()
	{
		const data = [];
		const dataNotes = myNotes.getDataNotes();
		
		for ( let i = 0; i < dataNotes.length; i++ )
		{
			const tag = dataNotes[i].tag;
			
			const points = dataNotes[i].points;
			const pos = points.map((p) => p.position);
			
			data.push({tag, pos});
		}
		
		return data;		
	}
	
	
	loadNotes({data})
	{
		
		for ( let i = 0; i < data.length; i++ )
		{
			const tag = data[i].tag;
			const arrPos = data[i].pos;
			
			const points = [];
			
			for ( let i2 = 0; i2 < arrPos.length; i2++ )
			{
				const pos = arrPos[i2];
				let point = null;
				
				if(tag === 'noteRuler')
				{
					point = myNoteRuler.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				}
				if(tag === 'noteRoulette')
				{
					point = myNoteRoulette.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				}				
				if(tag === 'noteMarker')
				{
					point = myNoteMarker.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				}
				if(tag === 'noteText')
				{
					point = myNoteText.crPoint({pos: new THREE.Vector3(pos.x, pos.y, pos.z)});
				}
				
				if(point) points.push(point);
			}
			
			if(points.length > 0)
			{
				let structure = null;
				
				if(tag === 'noteRuler')
				{
					myNoteRuler.crLine({points});
					myNoteRuler.upGeometryLine({point: points[0]});
					structure = myNoteRuler.getStructure({obj: points[0]});
				}
  
				if(tag === 'noteRoulette')
				{
					myNoteRoulette.crLine({points});
					myNoteRoulette.upGeometryLine({point: points[0]});
					structure = myNoteRoulette.getStructure({obj: points[0]});
				}
				
				if(tag === 'noteMarker')
				{
					myNoteMarker.crLine({points});
					myNoteMarker.upGeometryLine({point: points[0]});
					structure = myNoteMarker.getStructure({obj: points[0]});
				}				

				if(tag === 'noteText')
				{
					myNoteText.crLine({points});
					myNoteText.upGeometryLine({point: points[0]});
					structure = myNoteText.getStructure({obj: points[0]});
				}
				
				if(structure)
				{
					myNotes.addDataNote({data: structure});
				}
			}			
		}		
	}
	

}







