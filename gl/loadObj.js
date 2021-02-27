




function loadObjServer(cdm)
{ 
	// cdm - информация, которая пришла из вне
	// inf - статическая инфа из базы
	console.log(cdm);
	
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;
	var inf = {};
	
	if(lotid == 1)
	{
		inf = {url: infProject.path+'import/nasos_z.fbx', name: 'насос'}
		inf.planeMath = 0.5;
	}
	else if(lotid == 2)
	{
		inf = {url: infProject.path+'import/kotel_1.fbx', name: 'котел'}
		inf.planeMath = 1.5;
	}
	else if(lotid == 3)
	{
		inf = {url: infProject.path+'import/budres_900.fbx', name: 'радиатор'}
		inf.planeMath = 0.8;
	}
	else if(lotid == 4)
	{
		inf = {url: infProject.path+'import/bak_1.fbx', name: 'расширительный бак'}
		inf.planeMath = 0.5;
	}	
	else if(lotid == 5)
	{
		inf = {url: infProject.path+'import/kollector_1.fbx', name: 'коллектор'}
		inf.planeMath = 0.5;
	}	
	
	var exist = getArrayObj({lotid: lotid});
	
	if(exist)
	{
		var obj = getArrayObj(cdm);
		inf.obj = obj.clone();
		if(obj) { setParamObj(inf, cdm); }
	}
	else
	{
	
		var loader = new THREE.FBXLoader();
		loader.load( inf.url, function ( object ) 						
		{ 
			//object.scale.set(0.1, 0.1, 0.1);
			
			var obj = object.children[0];
			
			addArrayObj({lotid: lotid, obj: obj});
			
			inf.obj = obj;
			
			setParamObj(inf, cdm);			
		});
	
	}
	
	
}





// ищем был ли до этого объект добавлен в сцену (если был, то береме сохраненную копию)
function getArrayObj(cdm)
{
	var lotid = cdm.lotid;								// объекты в сцене 
	var arrObj = infProject.scene.array.arrObj;		// объекты в памяти	
	
	for(var i = 0; i < arrObj.length; i++)
	{
		if(arrObj[i].lotid == lotid)
		{
			return arrObj[i].obj;
		}

	}
	
	return null;
}



// добавляем новый объект из сцены в массив клонов
function addArrayObj(cdm)
{
	var lotid = cdm.lotid;								// объекты в сцене
	var obj = cdm.obj;
	var arrObj = infProject.scene.array.arrObj;			// объекты в памяти	
	
	for(var i = 0; i < arrObj.length; i++)
	{
		if(arrObj[i].lotid == lotid)
		{  console.log(lotid);
			return null;
		}
	}	
	
	arrObj[arrObj.length] = {lotid: lotid, obj: obj.clone()};
}




function setParamObj(inf, cdm)
{
	var obj = inf.obj;
	
	if(cdm.pos){ obj.position.copy(cdm.pos); }
	else if(inf.planeMath)
	{ 
		obj.position.y = inf.planeMath;
		planeMath.position.y = inf.planeMath; 
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld(); 
	}
	
	if(cdm.rot){ obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z); }					
	
	
	if(cdm.id){ obj.userData.id = cdm.id; }
	else { obj.userData.id = countId; countId++; }
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = cdm.lotid;
	obj.userData.obj3D.nameRus = inf.name;  
	obj.material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5 } );
	obj.material.visible = false;
	
	// накладываем на материал объекта lightMap
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			if(child.material)
			{
				if(Array.isArray(child.material))
				{
					for(var i = 0; i < child.material.length; i++)
					{
						child.material[i].lightMap = lightMap_1;
					}
				}
				else
				{
					child.material.lightMap = lightMap_1;
				}					
			}				
		}
	});		
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );
	 
	updateListTubeUI_1({o: obj, type: 'add'});	// добавляем объект в UI список материалов 
	
	if(cdm.cursor) { clickO.move = obj; } 
	
	renderCamera();
	
}





