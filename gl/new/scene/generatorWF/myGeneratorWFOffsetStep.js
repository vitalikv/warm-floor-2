
// если контур разделился на два, то проверяем чтобы предидущий контур не пересекался с разделенным
class MyGeneratorWFOffsetStep
{

	
	upContours({forms, contours})
	{
		const result = this.checkDivide({forms});
		
		if(!result.divide) return;
		
		this.calc({contours, step: result.step});
	}
	
	
	// проверка на деление контура (если произошло деление, то на каком шаге)
	checkDivide({forms})
	{		
		const isDivide = {divide: false, step: 0};
		
		for ( let i = 0; i < forms.length; i++ )
		{
			if(forms[i].length === 2) 
			{
				isDivide.divide = true;
				isDivide.step = i;
				break;
			}
		}

		return isDivide;
	}
	
	
	calc({contours, step})
	{
		console.log(contours, contours[step]);
		
		const path1 = [...contours[step - 1].path];
		const path2 = [...contours[step].path];
		
		path1.push(path1[0]);
		path2.push(path2[0]);
		
		const arrPoints = [];
		
		for ( let i = 0; i < path1.length - 1; i++ )
		{
			for ( let i2 = 0; i2 < path2.length - 1; i2++ )
			{
				const cross = myMath.checkCrossLine(path1[i], path1[i+1], path2[i2], path2[i2+1]);
				
				if(cross)
				{
					//const pt = myMath.intersectionTwoLines_1({line1: {start: p1, end: p2}, line2: {start: arrPos[i2], end: arrPos[i2+1]}});
					const pt = myMath.intersectionTwoLines_2(path1[i], path1[i+1], path2[i2], path2[i2+1]);
					//myGeneratorWFJoinForms.crHelpBox({pos: pt, color:  0x000000});
					
					arrPoints.push({p: path1[i], crossP: pt, lineId: i+''+(i+1)});
					arrPoints.push({p: path1[i+1], crossP: pt, lineId: i+''+(i+1)});
				}
				
			}
		}
		
		console.log(arrPoints);
		
		const arrPoints2 = [];
		
		for ( let i = 0; i < arrPoints.length; i++ )
		{
			const index = arrPoints2.findIndex((item) => item.p.x === arrPoints[i].p.x && item.p.y === arrPoints[i].p.y && item.p.z === arrPoints[i].p.z);
			
			if(index === -1)
			{
				arrPoints2.push({p: arrPoints[i].p, crossP: [{lineId: arrPoints[i].lineId, p: [arrPoints[i].crossP]}]});
			}
			else
			{
				const index2 = arrPoints2[index].crossP.findIndex((item) => item.lineId === arrPoints[i].lineId);
				
				if(index2 === -1)
				{
					arrPoints2[index].crossP.push({lineId: arrPoints[i].lineId, p: [arrPoints[i].crossP]});
				}
				else
				{
					arrPoints2[index].crossP[index2].p.push(arrPoints[i].crossP);
				}
			}
		}
		
		console.log(122, arrPoints2);
		
		const arrPoints3 = [];
		
		for ( let i = 0; i < arrPoints2.length; i++ )
		{
			if(arrPoints2[i].crossP.length !== 2) continue;
			
			const pos = arrPoints2[i].p;
			
			const n = arrPoints3.length;
			
			arrPoints3[n] = {pos, crossPos: []};
			
			//myGeneratorWFJoinForms.crHelpBox({pos, color: 0xff0000});
			
			for ( let i2 = 0; i2 < arrPoints2[i].crossP.length; i2++ )
			{
				const arrDist = [];
				
				for ( let i3 = 0; i3 < arrPoints2[i].crossP[i2].p.length; i3++ )
				{
					const pos2 = arrPoints2[i].crossP[i2].p[i3];
					
					const dist = pos.distanceTo(pos2);
					
					arrDist.push({pos: pos2, dist});
				}
				
				arrDist.sort((a, b) => { return b.dist - a.dist; }); 	// от большого к меньшему 
				
				arrPoints3[n].crossPos.push(arrDist[0].pos);
				
				//myGeneratorWFJoinForms.crHelpBox({pos: arrDist[0].pos, color:  0x0000ff});
			}
			
			
			console.log(333, arrPoints3);
			
		}
		
		
		for ( let i = 0; i < arrPoints3.length; i++ )
		{
			const pos = arrPoints3[i].pos;
			const crossPos = arrPoints3[i].crossPos;
			
			const v1 = pos.clone().sub(crossPos[0]).normalize();
			const v2 = crossPos[1].clone().sub(pos).normalize();
			const dir = new THREE.Vector3().subVectors( v2, v1 ).normalize();
			
			if(1===1)
			{
				const geometry = new THREE.Geometry();
				geometry.vertices = [pos, pos.clone().add(dir)];				
				const line = new THREE.Line( geometry, new THREE.MeshLambertMaterial({color: 0x0000ff, lightMap: lightMap_1}) );	
				scene.add( line );									
			}
			
			const pt = myMath.intersectionTwoLines_2(crossPos[0], crossPos[1], pos, pos.clone().add(dir));
			myGeneratorWFJoinForms.crHelpBox({pos: pt, color:  0x000000});

			const dist = pos.distanceTo(pt);
			
			
			for ( let i2 = 0; i2 < path1.length - 1; i2++ )
			{
				if(path1[i2].length() === pos.length())
				{
					myGeneratorWFJoinForms.crHelpBox({pos: path1[i2], color:  0x000000});
					
					const offset = new THREE.Vector3().addScaledVector( dir, dist );
					path1[i2].add(offset);
				}
			}
		}
		
	}
	

	render()
	{
		renderCamera();
	}	
}







