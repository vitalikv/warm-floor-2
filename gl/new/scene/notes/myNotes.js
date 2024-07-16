
// основной класс выноски (стрелки, линейка, рулетка)
class MyNotes
{
	dataNotes = [];
	

	crNotesFromBtn({lotid, pos, event})
	{
		console.log(lotid);
		let obj = null;
		
		if(lotid === 1) obj = myNoteRulerTool.crToolRulerPoint({pos, event});
		if(lotid === 2) obj = myNoteRouletteTool.crToolRulerPoint({pos, event});
		
		return obj;
	}
}







