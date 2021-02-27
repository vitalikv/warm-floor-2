


function createFloor(cdm)
{	
	var arrP = cdm.point;
	var arrW = cdm.wall;
	var arrS = cdm.side;
	var id = (cdm.id) ? cdm.id : null;
	var material = (cdm.material) ? cdm.material : null;
	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}
	
	//var str = ''; for ( var i = 0; i < arrP.length; i++ ) { str += ' | ' + arrP[i].userData.id; } console.log(str);
	console.log('-------------');	 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	
	var color = 0xe3e3e5;
	
	if(infProject.settings.floor.color){ color = infProject.settings.floor.color; }
	
	var material =new THREE.MeshLambertMaterial( { color : color, lightMap : lightMap_1 } );
	
	room[n] = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: infProject.settings.floor.height } ), material ); 
	
	room[n].position.set( 0, infProject.settings.floor.posY, 0 );
	room[n].rotation.set( Math.PI / 2, 0, 0 );	
	room[n].p = arrP;
	room[n].w = arrW; 
	room[n].s = arrS;	
	
	
	if(!id) { id = countId; countId++; }  

	room[n].userData.tag = 'room';
	room[n].userData.id = id;
	room[n].userData.room = { areaTxt : 0, p : arrP, w : arrW, s : arrS, outline : null };
	room[n].userData.room.height = infProject.settings.floor.height;
	room[n].userData.material = room[n].material.clone();		
	
	ceiling[n] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xffffff, lightMap : lightMap_1 } ) );			
	ceiling[n].position.set( 0, arrP[0].position.y + infProject.settings.floor.height, 0 );
	ceiling[n].rotation.set( Math.PI / 2, 0, 0 );		
	ceiling[n].userData.tag = 'ceiling';
	ceiling[n].userData.id = id;
	ceiling[n].userData.material = ceiling[n].material.clone();
	ceiling[n].visible = false;

	
	if(infProject.settings.floor.material)
	{	
		var m = infProject.settings.floor.material;
		
		for ( var i = 0; i < m.length; i++ )
		{
			setTexture({obj:room[n], material:m[i]});
		}	
	}
	
	if(infProject.settings.floor.o)
	{ 	
		room[n].label = createLabelCameraWall({ count : 1, text : 0, size : 65, ratio : {x:256*4, y:256}, geometry : infProject.geometry.labelFloor, opacity : 0.5 })[0];
		
		if(!infProject.settings.floor.label) room[n].label.visible = false;
			
		getYardageSpace( [room[n]] ); 
		scene.add( room[n] ); 
		scene.add( ceiling[n] );		
	}
	else
	{
		upLabelPlan_1(arrW); // если нет пола (фундамент, то считаем длину стен)
	}

	// определяем к какой стороне стены принадлежит зона и записываем зону к этой стене 
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		var ind = (arrS[i] == 0) ? 2 : 1; 
		arrW[i].userData.wall.room.side2[ind] = room[n]; 
	}	
	
	addParamPointOnZone(arrP, room[n]);
	
	
	
	return room[n];
}





// добавляем к точкам параметр зона и предыдущая точка
function addParamPointOnZone(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}



// добавляем к точкам параметр зона и предыдущая точка
function replaceParamPointOnZone(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}




// при изменении формы пола обновляем geometry.faces
function updateShapeFloor(arrRoom)
{  
	if(!infProject.settings.floor.o) { return; }
	
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{	 
		var point = [];
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { point[i2] = new THREE.Vector2 ( arrRoom[i].p[i2].position.x, arrRoom[i].p[i2].position.z ); }				
		
		var shape = new THREE.Shape( point );				

		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: infProject.settings.floor.height } ); 
		
		arrRoom[i].geometry.vertices = geometry.vertices;
		arrRoom[i].geometry.faces = geometry.faces;		
		arrRoom[i].geometry.verticesNeedUpdate = true;
		arrRoom[i].geometry.elementsNeedUpdate = true;
		
		arrRoom[i].geometry.computeBoundingSphere();
		arrRoom[i].geometry.computeBoundingBox();
		arrRoom[i].geometry.computeFaceNormals();
		
		arrRoom[i].position.y = infProject.settings.floor.posY;
		upUvs_1( arrRoom[i] );
		getYardageSpace([arrRoom[i]]); 

		// потолок	
		var num = 0;		
		for ( var i2 = 0; i2 < room.length; i2++ ) { if(room[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	// находим потолок	
		
		var geometry = new THREE.ShapeGeometry( shape );
		ceiling[num].geometry.vertices = geometry.vertices;
		ceiling[num].geometry.faces = geometry.faces;			
		ceiling[num].geometry.verticesNeedUpdate = true;
		ceiling[num].geometry.elementsNeedUpdate = true;
		
		ceiling[num].geometry.computeBoundingSphere();
		ceiling[num].geometry.computeBoundingBox();
		ceiling[num].geometry.computeFaceNormals();		
	}
	
	//getSkeleton_1(arrRoom);
}



// находим потолок, который соответсвует полу
function findNumberInArrRoom(arr) 
{
	var arrN = [];
	if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
		}		
	}	
	
	return arrN;
}




