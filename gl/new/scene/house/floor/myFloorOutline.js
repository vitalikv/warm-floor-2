
// создаем Outline по форме помещения (но это не привычный Outline, а линии по форме помещения)
class MyFloorOutline 
{
	outline = null;

	
	crFloorOutline({obj})
	{			
		const arrP = [];
		
		const arrW = obj.userData.room.w;
		const arrS = obj.userData.room.s;
		this.outline = new THREE.Group();
		
		for (let i = 0; i < arrW.length; i++)
		{
			const wall = arrW[i];
			
			wall.updateMatrixWorld();
				
			const v = wall.userData.wall.v;
			let x = 0;
			let p1 = new THREE.Vector3();
			let p2 = new THREE.Vector3();
			
			if(arrS[i] === 0)
			{			
				x = v[10].x - v[4].x;
				p1 = wall.localToWorld( v[4].clone() );
				p2 = wall.localToWorld( v[10].clone() );
			}
			else 
			{
				x = v[6].x - v[0].x;
				p1 = wall.localToWorld( v[0].clone() );
				p2 = wall.localToWorld( v[6].clone() );			
			}	
			
			(arrS[i] === 0) ? arrP.push(p1) : arrP.push(p2);
			
			const geometry = this.createGeometryLine(x, 0.02, 0.02); 
			const line = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 'rgb(17, 255, 0)', depthTest: false, transparent: true }) );
			line.renderOrder = 2;
			
			line.position.set( p1.x, 0, p1.z );
			
			const dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
			const angleDeg = Math.atan2(dir.x, dir.z);
			line.rotation.set(0, angleDeg + Math.PI / 2, 0);	

			this.outline.add( line );
		}
		
		this.outline.position.y = obj.position.y;
		this.outline.userData = { arrP };
		scene.add( this.outline );


		return this.outline; 			
	}	


	createGeometryLine(x, y, z)
	{
		const geometry = new THREE.Geometry();
		
		const h1 = 0;		
		const z1 = z;
		const z2 = z;		
			
		const vertices = [
					new THREE.Vector3(0,h1,z1),
					new THREE.Vector3(0,y,z1),
					new THREE.Vector3(0,h1,0),
					new THREE.Vector3(0,y,0),
					new THREE.Vector3(0,h1,z2),
					new THREE.Vector3(0,y,z2),								
									
					new THREE.Vector3(x,h1,z1),
					new THREE.Vector3(x,y,z1),
					new THREE.Vector3(x,h1,0),
					new THREE.Vector3(x,y,0),
					new THREE.Vector3(x,h1,z2),
					new THREE.Vector3(x,y,z2),						
				];	
				
		const faces = [
					new THREE.Face3(0,6,7),
					new THREE.Face3(7,1,0),
					new THREE.Face3(4,5,11),
					new THREE.Face3(11,10,4),				
					new THREE.Face3(1,7,9),
					new THREE.Face3(9,3,1),					
					new THREE.Face3(9,11,5),
					new THREE.Face3(5,3,9),				
					new THREE.Face3(6,8,9),
					new THREE.Face3(9,7,6),				
					new THREE.Face3(8,10,11),
					new THREE.Face3(11,9,8),
					
					new THREE.Face3(0,1,3),
					new THREE.Face3(3,2,0),	

					new THREE.Face3(2,3,5),
					new THREE.Face3(5,4,2),	

					new THREE.Face3(0,2,8),
					new THREE.Face3(8,6,0),

					new THREE.Face3(2,4,10),
					new THREE.Face3(10,8,2),					
				];

				
		geometry.vertices = vertices;
		geometry.faces = faces;
		geometry.computeFaceNormals();	
		geometry.uvsNeedUpdate = true;		
		
		
		return geometry;
	}
	

	getOutline()
	{
		return this.outline;
	}

	
	deleteOutline()
	{
		if(!this.outline) return;
		
		const children = this.outline.children;
		
		for ( let i = 0; i < children.length; i++ )
		{
			scene.remove(children[i]);
			children[i].geometry.dispose();
		}

		scene.remove(this.outline);
		
		this.outline = null;
	}
}







