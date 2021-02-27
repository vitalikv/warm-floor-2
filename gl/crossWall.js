



// определяем число ли это или нет
function isNumeric(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   // Метод isNaN пытается преобразовать переданный параметр в число. 
   // Если параметр не может быть преобразован, возвращает true, иначе возвращает false.
   // isNaN("12") // false 
}



// проверка пересеклась ли стена с другой стеной (когда тащим точку)
function crossLineOnLine_1(point)
{
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < obj_line.length; i2++ )
		{
			if(point.w[i] == obj_line[i2]) { continue; }
			
			if(Math.abs(point.position.y - obj_line[i2].userData.wall.p[0].position.y) > 0.3) continue;		// проверка высоты этажа
			
			var p0 = point.w[i].userData.wall.p[0].position;
			var p1 = point.w[i].userData.wall.p[1].position;
			var p2 = obj_line[i2].userData.wall.p[0].position;
			var p3 = obj_line[i2].userData.wall.p[1].position;
			
			if(intersectWall_3(p0, p1, p2, p3)) { return true; }	// стены пересеклись
		}
	}
	
	return false;  // стены не пересеклись
}



// точка пересечения двух прямых 2D
function crossPointTwoLine(a1, a2, b1, b2)
{
	var t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
	var t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return new THREE.Vector3(a2.x, 0, a2.z); } 
	
	point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	//if(Math.abs(f1) < 0.0001){ point = new THREE.Vector3(a1.x, 0, a1.z); console.log(77); }	 
	
	return point;
}



// точка пересечения двух прямых 2D с доп.параметром = паралельны ли линии или нет
function crossPointTwoLine_2(a1, a2, b1, b2)
{
	var t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
	var t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);
	var f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001)
	{ 
		var s1 = new THREE.Vector3().subVectors( a1, b1 );
		var s2 = new THREE.Vector3().addVectors( s1.divideScalar( 2 ), b1 );
		
		return [new THREE.Vector3(s2.x, 0, s2.z), true]; // паралельны
	} 
	
	var point = new THREE.Vector3();
	point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	//if(Math.abs(f1) < 0.0001){ point = new THREE.Vector3(a1.x, 0, a1.z); console.log(77); }	 
	
	return [point, false];
}



// точка пересечения двух прямых 2D
function crossPointTwoLine_3(a1, a2, b1, b2)
{
	var t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
	var t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return [new THREE.Vector3(a2.x, 0, a2.z), true]; } // параллельны 
	
	point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
	
	return [point, false];
}



function DirectEquation(x1, y1, x2, y2)
{
	var a = y1 - y2;
	var b = x2 - x1;
	var c = x1 * y2 - x2 * y1;

	return [ a, b, c ];
}

	
function DetMatrix2x2(x1, y1, x2, y2)
{
	return x1 * y2 - x2 * y1;
}


// Проверка двух отрезков на пересечение (ориентированная площадь треугольника)
function CrossLine(a, b, c, d)
{
	return intersect_1(a.x, b.x, c.x, d.x) && intersect_1(a.z, b.z, c.z, d.z) && area_1(a, b, c) * area_1(a, b, d) <= 0 && area_1(c, d, a) * area_1(c, d, b) <= 0;
}

function intersect_1(a, b, c, d)
{
	if (a > b) { var res = swap(a, b); a = res[0]; b = res[1]; }
	if (c > d) { var res = swap(c, d); c = res[0]; d = res[1]; }
	return Math.max(a, c) <= Math.min(b, d);
}

function area_1(a, b, c) { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }

// меняем местами 2 значения
function swap(a, b) { var c; c = a; a = b; b = c; return [a, b]; }






 
// проекция точки(С) на прямую (A,B)
function spPoint(A,B,C){
    var x1=A.x, y1=A.z, x2=B.x, y2=B.z, x3=C.x, y3=C.z;
    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px, z = y1 + u * py;
    return {x:x, y:0, z:z}; 
} 


// опредяляем, надодится точка D за пределами прямой или нет (точка D пересекает прямую АВ, идущая перпендикулярна от точки С)  
function calScal(A,B,C)
{	
	var AB = { x : B.x - A.x, y : B.z - A.z }
	var CD = { x : C.x - A.x, y : C.z - A.z }
	var r1 = AB.x * CD.x + AB.y * CD.y;				// скалярное произведение векторов

	var AB = { x : A.x - B.x, y : A.z - B.z }
	var CD = { x : C.x - B.x, y : C.z - B.z }
	var r2 = AB.x * CD.x + AB.y * CD.y;

	var cross = (r1 < 0 | r2 < 0) ? false : true;	// если true , то точка D находится на отрезке AB	
	
	return cross;
}

 
// расстояние от точки до прямой
function lengthPointOnLine(p1, p2, M)
{	
	var urv = DirectEquation(p1.x, p1.z, p2.x, p2.z);
	
	var A = urv[0];
	var B = urv[1];
	var C = urv[2];
	
	return Math.abs( (A * M.x + B * M.z + C) / Math.sqrt( (A * A) + (B * B) ) );
}



//https://ru.stackoverflow.com/questions/464787/%D0%A2%D0%BE%D1%87%D0%BA%D0%B0-%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B8-%D0%BC%D0%BD%D0%BE%D0%B3%D0%BE%D1%83%D0%B3%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D0%BA%D0%B0


//Точка внутри многоугольника
function checkPointInsideForm(point, arrP)
{
	var p = arrP;
	var result = false;
	var j = p.length - 1;
	for (var i = 0; i < p.length; i++) 
	{
		if ( (p[i].position.z < point.position.z && p[j].position.z >= point.position.z || p[j].position.z < point.position.z && p[i].position.z >= point.position.z) &&
			 (p[i].position.x + (point.position.z - p[i].position.z) / (p[j].position.z - p[i].position.z) * (p[j].position.x - p[i].position.x) < point.position.x) )
			result = !result;
		j = i;
	}
	
	return result;
}


// сравнить позиционирование
function comparePos(pos1, pos2)
{
	var x = pos1.x - pos2.x;
	var y = pos1.y - pos2.y;
	var z = pos1.z - pos2.z;
	
	var equals = true;
	if(Math.abs(x) > 0.01){ equals = false; }
	if(Math.abs(y) > 0.01){ equals = false; }
	if(Math.abs(z) > 0.01){ equals = false; }

	return equals;
}



