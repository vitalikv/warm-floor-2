
// класс для выноски (стрелки, линейка, рулетка) тут находятся повторяющиеся элементы
class MyNotesInstance
{
	geomPoint;
	geomCone;
	matDef;
	defColor = 0x000000;
	actColor = 0xff0000;

	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.02, 16, 16 );
		this.geomCone = this.crGeometryCone();
		
		this.matDef = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), transparent: true, lightMap: lightMap_1 });
		//const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.defColor), depthTest: false, lightMap: lightMap_1 });
	}
	
	
	// создаем конус
	crGeometryCone()
	{	
		let n = 0;
		const v = [];
		const circle = infProject.geometry.circle;
		
		for ( let i = 0; i < circle.length; i++ )
		{
			v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.001 );
			v[n].y = 0;		
			n++;		
			
			v[n] = new THREE.Vector3();
			v[n].y = 0;
			n++;
			
			v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.02 );
			v[n].y = 0.05;
			n++;	
			
			v[n] = new THREE.Vector3();
			v[n].y = 0.05;
			n++;		
		}	

		const geometry = createGeometryCircle(v);
		geometry.rotateX(Math.PI/2);
		
		return geometry;
	}

}







