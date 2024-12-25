


class MyMath
{
	// умножение числа на вектор
	multiVector3({dir, num})
	{
		return new THREE.Vector3().addScaledVector( dir, num );
	}
	
	
	// сдвиг всего массива, так чтобы выбранный index оказался самым первым 
	// пример: myMath.offsetArrayToFirstElem({arr: [1,2,3,45,8,9,7,10], index: 5})
	// было arr = [1,2,3,45,8,9,7,10], index: 5
	// стало arr = [ 9, 7, 10, 1, 2, 3, 45, 8 ] 	
	offsetArrayToFirstElem({arr, index})
	{
		// index - выбранный id элемента, который будет самым первым после смещения
		const offsetInd = arr.length - index;
		
		arr = arr.map((el, i, array) => { return i < offsetInd ? array[array.length + i - offsetInd] : array[i - offsetInd] });

		return arr;
	}

	
	// перпендикуляр линии (2D)
	calcNormal2D({p1, p2, reverse = false})
	{
		let x = p1.z - p2.z;
		let z = p2.x - p1.x;

		// нормаль вывернуть в обратное напрвление
		if(reverse)
		{
			x *= -1;
			z *= -1;
		}
		
		return new THREE.Vector3(x, 0, z).normalize();								
	}

	
	// проекция точки(С) на прямую (A,B) (2D)
	mathProjectPointOnLine2D({A,B,C})
	{
		const x1 = A.x;
		const y1 = A.z; 
		const x2 = B.x; 
		const y2 = B.z; 
		const x3 = C.x; 
		const y3 = C.z;
		
		const px = x2 - x1;
		const py = y2 - y1; 
		const dAB = px * px + py * py;
		
		const u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
		const x = x1 + u * px;
		const z = y1 + u * py;
		
		return new THREE.Vector3(x, 0, z); 
	} 


	// опредяляем, надодится точка D за пределами прямой или нет (точка D пересекает прямую АВ, идущая перпендикулярна от точки С)  
	checkPointOnLine(A,B,C)
	{	
		let AB = { x : B.x - A.x, y : B.z - A.z };
		let CD = { x : C.x - A.x, y : C.z - A.z };
		const r1 = AB.x * CD.x + AB.y * CD.y;				// скалярное произведение векторов

		AB = { x : A.x - B.x, y : A.z - B.z };
		CD = { x : C.x - B.x, y : C.z - B.z };
		const r2 = AB.x * CD.x + AB.y * CD.y;

		const cross = (r1 < 0 | r2 < 0) ? false : true;	// если true , то точка D находится на отрезке AB	
		
		return cross;
	}

	//прорека находится ли точка внутри многоугольника
	checkPointInsideForm({point, arrP})
	{
		point = (point instanceof THREE.Vector3) ? new THREE.Vector3(point.x, point.y, point.z) : point.position.clone(); 
		const p = (arrP[0] instanceof THREE.Vector3) ? arrP : arrP.map((p) => p.position);
		
		let result = false;
		
		let j = p.length - 1;
		for (let i = 0; i < p.length; i++) 
		{
			const calc1 = (p[i].z < point.z && p[j].z >= point.z || p[j].z < point.z && p[i].z >= point.z);
			const calc2 = (p[i].x + (point.z - p[i].z) / (p[j].z - p[i].z) * (p[j].x - p[i].x) < point.x);
			
			if(calc1 && calc2)
			{
				result = !result;
			}
				
			j = i;
		}
		
		return result;
	}

	
	// Проверка двух отрезков на пересечение (ориентированная площадь треугольника)
	checkCrossLine(a, b, c, d)
	{
		const swap = (a, b) => { let c; c = a; a = b; b = c; return [a, b]; }
		
		const intersect = (a, b, c, d) =>
		{
			if (a > b) { const res = swap(a, b); a = res[0]; b = res[1]; }
			if (c > d) { const res = swap(c, d); c = res[0]; d = res[1]; }
			return Math.max(a, c) <= Math.min(b, d);
		}

		const area = (a, b, c) => { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }
		
		return intersect(a.x, b.x, c.x, d.x) && intersect(a.z, b.z, c.z, d.z) && area(a, b, c) * area(a, b, d) <= 0 && area(c, d, a) * area(c, d, b) <= 0;
	}


	// точка пересечения двух прямых 2D (1 вариант)
	intersectionTwoLines_1({ line1, line2 }) {
		const line1start = line1.start;
		const line1end = line1.end;
		const line2start = line2.start;
		const line2end = line2.end;

		const denominator =
			( line2end.z - line2start.z ) * ( line1end.x - line1start.x )
			- ( line2end.x - line2start.x ) * ( line1end.z - line1start.z );

		// параллельны
		if ( denominator == 0 ) 
		{ 
			const arrDist = [];
			arrDist[0] = { dist: line1start.distanceTo(line2start), pos: line1start};
			arrDist[1] = { dist: line1start.distanceTo(line2end), pos: line1start};
			arrDist[2] = { dist: line1end.distanceTo(line2start), pos: line1end};
			arrDist[3] = { dist: line1end.distanceTo(line2end), pos: line1end};
			
			arrDist.sort((a, b) => { return a.dist - b.dist; });
			
			return new THREE.Vector3( arrDist[0].pos.x, 0, arrDist[0].pos.z ); 
		} 

		const a =
			( ( line2end.x - line2start.x ) * ( line1start.z - line2start.z )
			- ( line2end.z - line2start.z ) * ( line1start.x - line2start.x ) ) / denominator;

		const x = line1start.x + ( a * ( line1end.x - line1start.x ) );
		const z = line1start.z + ( a * ( line1end.z - line1start.z ) );

		return new THREE.Vector3( x, 0, z );
	}	
	

	// точка пересечения двух прямых 2D (2 вариант, работает лучше)
	intersectionTwoLines_2(a1, a2, b1, b2)
	{
		const t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
		const t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);
		const f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001) return null; // паралельны
		
		const point = new THREE.Vector3();
		point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;		 
		
		return point;
	}


	// попадает ли точка в граница отрезка 3D BoundBox
	checkPointBoundBoxLine(pointA, pointB, pointToCheck) 
	{
		if(pointToCheck.x < Math.min(pointA.x, pointB.x) || pointToCheck.x > Math.max(pointA.x, pointB.x)) { return false; }

		if(pointToCheck.y < Math.min(pointA.y, pointB.y) || pointToCheck.y > Math.max(pointA.y, pointB.y)) { return false; }

		if(pointToCheck.z < Math.min(pointA.z, pointB.z) || pointToCheck.z > Math.max(pointA.z, pointB.z)) { return false; } 

		return true;
	}	
	
	
	//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
	checkClockWise( arrP )
	{  
		let res = 0;
		const n = arrP.length;
		
		for (let i = 0; i < n; i++) 
		{
			const p1 = arrP[i];
			let p2 = new THREE.Vector3();
			let p3 = new THREE.Vector3();
			
			if (i == 0)
			{
				p2 = arrP[n-1];
				p3 = arrP[i+1];					
			}
			else if (i == n-1)
			{
				p2 = arrP[i-1];
				p3 = arrP[0];			
			}
			else
			{
				p2 = arrP[i-1];
				p3 = arrP[i+1];			
			}
			
			res += p1.x*(p2.z - p3.z);
		}
		
		
		res = res / 2;
		res = Math.round(res * 10) / 10;
		
		return res;
	}




	//--- gpt
	
	// проекция точки на прямую (работоспособность не проверял)
	getProjectPointOnLine2D({targetPoint, point1, point2})
	{
		// Точки, задающие линию
		// const point1 = new THREE.Vector3(0, 0, 0); // Начало линии
		// const point2 = new THREE.Vector3(1, 1, 1); // Конец линии

		// Точка, которую нужно спроецировать
		// const targetPoint = new THREE.Vector3(2, 0, 0);

		// 1. Вектор направления линии
		const lineDir = new THREE.Vector3().subVectors(point2, point1).normalize();

		// 2. Вектор от точки на линии до целевой точки
		const pointToTarget = new THREE.Vector3().subVectors(targetPoint, point1);

		// 3. Скалярное произведение (длина проекции)
		const projectionLength = pointToTarget.dot(lineDir);

		// 4. Координаты проекции
		const projection = new THREE.Vector3()
		  .copy(lineDir)
		  .multiplyScalar(projectionLength)
		  .add(point1);
		
		return projection;
	}


	// точка пересечение двух прямых
	getIntersection(p1, p2, p3, p4, epsilon = 1e-12) {
		// Векторы направления для каждой прямой
		const d1 = new THREE.Vector3().subVectors(p2, p1); // Вектор для прямой 1
		const d2 = new THREE.Vector3().subVectors(p4, p3); // Вектор для прямой 2

		// Разница между точками, образующими прямые
		const denom = d1.x * d2.z - d1.z * d2.x;

		// Проверяем, параллельны ли прямые с учётом погрешности
		if (Math.abs(denom) < epsilon) {
			return null; // Прямые параллельны, пересечения нет
		}

		// Находим параметр t для прямой 1
		const t1 = ((p3.x - p1.x) * d2.z - (p3.z - p1.z) * d2.x) / denom;

		// Вычисляем точку пересечения
		const intersection = new THREE.Vector3().addScaledVector(d1, t1).add(p1);

		return intersection;
	}
  
  
	// определить с высокой точностью, находится ли точка на отрезке
	isPointOnSegment2({point1, point2, targetPoint}) 
	{
		const A = point1; 
		const B = point2; 
		const P = targetPoint;
		
		// Допустимая погрешность
		const epsilon = 1e-12;

		// Рассчитываем векторное произведение для проверки коллинеарности
		const crossProduct = (P.x - A.x) * (B.z - A.z) - (P.z - A.z) * (B.x - A.x);

		// Проверяем, что точка на прямой (с учетом погрешности)
		if (Math.abs(crossProduct) > epsilon) {
			return false; // точка не на прямой
		}

		// Проверяем, что точка P лежит в пределах отрезка AB (с учетом погрешности)
		const minX = Math.min(A.x, B.x);
		const maxX = Math.max(A.x, B.x);
		const minY = Math.min(A.z, B.z);
		const maxY = Math.max(A.z, B.z);

		return P.x >= minX - epsilon && P.x <= maxX + epsilon && P.z >= minY - epsilon && P.z <= maxY + epsilon;
	}


	// найти ближайшую точку (не проверял работоспособность) 
	findClosestPoint({target, pointsArray}) 
	{
		let closestPoint = null;
		let minDistance = Infinity;

		pointsArray.forEach(point => 
		{
			const distance = target.distanceTo(point); // Рассчитываем расстояние
			if (distance < minDistance) 
			{
				minDistance = distance;
				closestPoint = point;
			}
		});

		return closestPoint;
	}	
	
}














