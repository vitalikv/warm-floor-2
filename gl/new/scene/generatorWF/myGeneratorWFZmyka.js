// построенного пола змейка
class MyGeneratorWFZmyka {
  pointsObj = [];
  linesObj = [];
  typeZmyka = 1;

  // создаем змейку
  crZmyka({ dataGrid }) {
    const pGrid = [];
    const points = myGrids.getPointsFromDataGrid({ dataGrid });

    for (let i = 0; i < points.length; i++) {
      pGrid.push(points[i].position.clone());
    }

    const sizeCell = dataGrid.grille.sizeCell;

    // расчитываем контуры
    const forms = myGeneratorWF.calc({ forms: [], points: pGrid, offset: sizeCell * -1 });

    const contours = [];

    for (let i = 0; i < forms.length; i++) {
      contours.push({ path: [...forms[i][0].paths] });

      if (i === 0) break;
    }

    // рисуем линии контуров
    for (let i = 0; i < contours.length; i++) {
      let color = 0x0000ff;
      // if (i % 2 === 0) { console.log(`${i} - четное число.`); }
      // else { console.log(`${i} - нечетное число.`); }

      const line = myGeneratorWF.crForm({ arrPos: contours[i].path, color });
      contours[i].line = line;
      line.visible = false;
    }

    return { type: 'zmyka', contours, sizeCell, pGrid };
  }

  // Строим линии с соединением сегментов в непрерывные цепи
  detectCrossLines({ startPos, dir, contours, sizeCell = 0.2, pGrid }) {
    this.delete();
    if (contours.length === 0) return;

    const poly = [...contours[0].path];
    if (poly.length < 3) return;

    const eps = 0.00001;

    const u = dir.clone().normalize(); // направление "вдоль"
    const v = new THREE.Vector3(-u.z, 0, u.x).normalize(); // направление "поперёк" (скан)
    const O = startPos.clone(); // базовая точка для проекций

    const bounds = this.getProjBounds({ poly, O, u, v });
    const scanLines = this.buildScanlines({ bounds, sizeCell });
    if (scanLines.length === 0) return;

    // собираем сегменты на каждой скан-линии
    const allSegments = [];
    for (let i = 0; i < scanLines.length; i++) {
      const t = scanLines[i];
      const segs = this.getInsideSegmentsOnScanline({ poly, O, u, v, t, bounds, eps });
      for (let j = 0; j < segs.length; j++) {
        allSegments.push({
          ...segs[j],
          stripeIndex: i,
          segmentIndex: j,
          used: false,
          connectedFrom: null, // с какого конца соединен (a или b)
          connectedTo: null, // к какому сегменту соединен
          usedPointA: false, // точка a используется для соединения
          usedPointB: false, // точка b используется для соединения
        });
      }
    }
    if (allSegments.length === 0) return;

    // заменяем линию в контуре, чтобы не оставлять "висящие" невидимые линии
    if (contours[0].line) {
      scene.remove(contours[0].line);
      contours[0].line.geometry.dispose();
    }

    // строим цепи из сегментов
    const chains = this.buildChains({ segments: allSegments, poly, u, v, O, bounds, eps });

    // рисуем все цепи
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      for (let j = 0; j < chain.length; j++) {
        const path = chain[j];
        this.crHelpLine({ v: path, color: 0xff0000 });
      }
    }
  }

  // строим цепи из сегментов
  buildChains({ segments, poly, u, v, O, bounds, eps }) {
    const chains = [];
    const allLines = []; // все линии для проверки пересечений

    // создаем начальные линии для всех сегментов
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const line = {
        start: seg.a.pos.clone(),
        end: seg.b.pos.clone(),
        segment: seg,
      };
      allLines.push(line);
    }

    // сохраняем ссылку на все сегменты для проверки точек
    const allSegments = segments;

    // строим цепи
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].used) continue;

      const chain = [];
      let currentSeg = segments[i];
      currentSeg.used = true;

      // начинаем с текущего сегмента
      let currentEnd = 'b'; // начинаем с конца b
      let currentPath = [currentSeg.a.pos.clone(), currentSeg.b.pos.clone()];

      while (true) {
        // ищем следующий сегмент
        const nextSeg = this.findNextSegment({
          currentSeg,
          currentEnd,
          segments,
          allLines,
          poly,
          u,
          v,
          O,
          bounds,
          eps,
        });

        if (!nextSeg) {
          // не нашли следующий сегмент, завершаем цепь
          chain.push(currentPath);
          break;
        }

        // извлекаем сегмент из объекта
        const nextSegment = nextSeg.segment;
        const nextEnd = nextSeg.end;

        // проверяем, можно ли соединить
        const connection = this.findConnection({
          currentSeg,
          currentEnd,
          nextSeg: nextSegment,
          nextEnd,
          allLines,
          poly,
          u,
          v,
          O,
          bounds,
          allSegments,
          eps,
        });

        if (!connection) {
          // соединение невозможно, завершаем цепь
          chain.push(currentPath);
          break;
        }

        // соединяем сегменты
        const lastPoint = currentPath[currentPath.length - 1];
        const connectorStart = connection.connectorPath[0];

        // если первая точка соединительной линии не совпадает с последней точкой пути,
        // значит соединение идет с другого края - нужно добавить промежуточную точку
        if (lastPoint.distanceTo(connectorStart) > eps) {
          // добавляем точку с другого края текущего сегмента
          const otherPoint = currentEnd === 'a' ? currentSeg.b.pos : currentSeg.a.pos;
          currentPath.push(otherPoint.clone());
        }

        // добавляем соединительную линию (без первой точки, если она совпадает)
        const connectorPath = connection.connectorPath.slice(1);
        currentPath.push(...connectorPath);

        // добавляем следующий сегмент
        if (connection.reverseNext) {
          // нужно развернуть следующий сегмент
          currentPath.push(nextSegment.b.pos.clone());
          currentPath.push(nextSegment.a.pos.clone());
        } else {
          currentPath.push(nextSegment.a.pos.clone());
          currentPath.push(nextSegment.b.pos.clone());
        }

        // обновляем состояние
        currentSeg.connectedTo = nextSegment;
        nextSegment.used = true;
        nextSegment.connectedFrom = connection.nextEnd;

        // помечаем использованные точки на основе точек соединения
        // определяем, какие точки используются для соединения
        if (currentEnd === connection.nextEnd) {
          // соединение с одного края - соединительная линия идет с другого края
          // помечаем другую точку текущего сегмента
          if (currentEnd === 'a') {
            currentSeg.usedPointB = true;
          } else {
            currentSeg.usedPointA = true;
          }
          // помечаем другую точку следующего сегмента
          if (connection.nextEnd === 'a') {
            nextSegment.usedPointB = true;
          } else {
            nextSegment.usedPointA = true;
          }
        } else {
          // соединение с разных краев - прямая соединительная линия
          // помечаем текущую точку текущего сегмента
          if (currentEnd === 'a') {
            currentSeg.usedPointA = true;
          } else {
            currentSeg.usedPointB = true;
          }
          // помечаем точку следующего сегмента
          if (connection.nextEnd === 'a') {
            nextSegment.usedPointA = true;
          } else {
            nextSegment.usedPointB = true;
          }
        }

        // добавляем соединительную линию в список для проверки пересечений
        for (let j = 0; j < connection.connectorPath.length - 1; j++) {
          allLines.push({
            start: connection.connectorPath[j],
            end: connection.connectorPath[j + 1],
            segment: null,
          });
        }

        // переходим к следующему сегменту
        currentSeg = nextSegment;
        currentEnd = connection.nextEnd === 'a' ? 'b' : 'a'; // переходим на другой конец
      }

      if (chain.length > 0) {
        chains.push(chain);
      }
    }

    return chains;
  }

  // находим следующий сегмент для соединения
  findNextSegment({ currentSeg, currentEnd, segments, allLines, poly, u, v, O, bounds, eps }) {
    const currentPoint = currentEnd === 'a' ? currentSeg.a.pos : currentSeg.b.pos;
    const currentOtherPoint = currentEnd === 'a' ? currentSeg.b.pos : currentSeg.a.pos;
    let bestSeg = null;
    let bestDist = Infinity;
    let bestEnd = null;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.used) continue;
      if (seg === currentSeg) continue;

      // проверяем оба конца сегмента
      const ends = [
        { point: seg.a.pos, otherPoint: seg.b.pos, name: 'a', used: seg.usedPointA },
        { point: seg.b.pos, otherPoint: seg.a.pos, name: 'b', used: seg.usedPointB },
      ];

      for (let j = 0; j < ends.length; j++) {
        const end = ends[j];

        // проверяем, не используется ли уже эта точка для соединения
        if (end.used) continue;

        // проверяем использование точек в зависимости от типа соединения
        if (currentEnd === end.name) {
          // соединение с одного края - соединительная линия идет с другого края
          // проверяем, не используется ли другая точка текущего сегмента
          const currentOtherEndUsed = currentEnd === 'a' ? currentSeg.usedPointB : currentSeg.usedPointA;
          if (currentOtherEndUsed) continue;
          // проверяем, не используется ли другая точка следующего сегмента
          const nextOtherEndUsed = end.name === 'a' ? seg.usedPointB : seg.usedPointA;
          if (nextOtherEndUsed) continue;
        } else {
          // соединение с разных краев - прямая соединительная линия
          // проверяем, не используется ли текущая точка текущего сегмента
          const currentEndUsed = currentEnd === 'a' ? currentSeg.usedPointA : currentSeg.usedPointB;
          if (currentEndUsed) continue;
        }

        const dist = currentPoint.distanceTo(end.point);

        if (dist < bestDist) {
          // определяем точки для соединения
          let fromPoint, toPoint;

          if (currentEnd === end.name) {
            // соединение с одного края - соединительная линия идет с другого края
            fromPoint = currentOtherPoint;
            toPoint = end.otherPoint;
          } else {
            // соединение с разных краев - прямая соединительная линия
            fromPoint = currentPoint;
            toPoint = end.point;
          }

          // проверяем, что соединение возможно (не пересекает другие линии и внутри контура)
          const testConnector = this.findSafeConnector({
            from: fromPoint,
            to: toPoint,
            allLines,
            poly,
            currentSeg,
            targetSeg: seg,
            allSegments: segments,
            eps,
          });

          if (testConnector) {
            bestDist = dist;
            bestSeg = seg;
            bestEnd = end.name;
          }
        }
      }
    }

    return bestSeg ? { segment: bestSeg, end: bestEnd } : null;
  }

  // находим безопасное соединение между сегментами
  findConnection({ currentSeg, currentEnd, nextSeg, nextEnd, allLines, poly, u, v, O, bounds, allSegments, eps }) {
    // если соединение с одного края, то соединительная линия должна идти с другого края
    const currentPoint = currentEnd === 'a' ? currentSeg.a.pos : currentSeg.b.pos;
    const currentOtherPoint = currentEnd === 'a' ? currentSeg.b.pos : currentSeg.a.pos;

    // используем найденный конец следующего сегмента
    const end = {
      point: nextEnd === 'a' ? nextSeg.a.pos : nextSeg.b.pos,
      otherPoint: nextEnd === 'a' ? nextSeg.b.pos : nextSeg.a.pos,
      name: nextEnd,
    };

    // определяем точки для соединения
    let fromPoint, toPoint;
    let reverseNext = false;

    if (currentEnd === end.name) {
      // соединение с одного края - соединительная линия идет с другого края
      fromPoint = currentOtherPoint;
      toPoint = end.otherPoint;
      reverseNext = currentEnd === 'a';
    } else {
      // соединение с разных краев - прямая соединительная линия
      fromPoint = currentPoint;
      toPoint = end.point;
      reverseNext = currentEnd === 'b' && end.name === 'a';
    }

    const connector = this.findSafeConnector({
      from: fromPoint,
      to: toPoint,
      allLines,
      poly,
      currentSeg,
      targetSeg: nextSeg,
      allSegments,
      eps,
    });

    if (connector) {
      return {
        connectorPath: connector,
        nextEnd: end.name,
        reverseNext: reverseNext,
      };
    }

    return null;
  }

  // находим безопасный путь соединения (не пересекает другие линии и внутри контура)
  findSafeConnector({ from, to, allLines, poly, currentSeg, targetSeg, allSegments, eps }) {
    // прямая линия
    const directPath = [from.clone(), to.clone()];

    if (this.isPathSafe({ path: directPath, allLines, poly, currentSeg, targetSeg, allSegments, eps })) {
      return directPath;
    }

    // пробуем альтернативные пути через промежуточные точки
    const dir = to.clone().sub(from).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
    const dist = from.distanceTo(to);

    // пробуем разные смещения и позиции
    const offsets = [0.1, 0.15, 0.2, 0.25, 0.3, -0.1, -0.15, -0.2, -0.25, -0.3];
    const positions = [0.3, 0.4, 0.5, 0.6, 0.7];

    for (let posIdx = 0; posIdx < positions.length; posIdx++) {
      const pos = positions[posIdx];
      const midPoint = from.clone().add(to.clone().sub(from).multiplyScalar(pos));

      for (let i = 0; i < offsets.length; i++) {
        const offset = offsets[i] * Math.min(dist * 0.5, 0.5);
        const offsetPoint = midPoint.clone().add(perp.clone().multiplyScalar(offset));
        const altPath = [from.clone(), offsetPoint, to.clone()];

        if (this.isPathSafe({ path: altPath, allLines, poly, currentSeg, targetSeg, allSegments, eps })) {
          return altPath;
        }
      }
    }

    // пробуем путь с двумя промежуточными точками
    for (let pos1 = 0.3; pos1 <= 0.5; pos1 += 0.1) {
      for (let pos2 = 0.5; pos2 <= 0.7; pos2 += 0.1) {
        const p1 = from.clone().add(to.clone().sub(from).multiplyScalar(pos1));
        const p2 = from.clone().add(to.clone().sub(from).multiplyScalar(pos2));

        for (let i = 0; i < offsets.length; i++) {
          const offset1 = offsets[i] * Math.min(dist * 0.3, 0.3);
          const offset2 = offsets[(i + offsets.length / 2) % offsets.length] * Math.min(dist * 0.3, 0.3);
          const offsetP1 = p1.clone().add(perp.clone().multiplyScalar(offset1));
          const offsetP2 = p2.clone().add(perp.clone().multiplyScalar(offset2));
          const altPath = [from.clone(), offsetP1, offsetP2, to.clone()];

          if (this.isPathSafe({ path: altPath, allLines, poly, currentSeg, targetSeg, allSegments, eps })) {
            return altPath;
          }
        }
      }
    }

    return null;
  }

  // проверяем, безопасен ли путь (не пересекает другие линии и внутри контура)
  isPathSafe({ path, allLines, poly, currentSeg, targetSeg, allSegments, eps }) {
    // проверяем каждую часть пути
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];

      // проверяем, что путь внутри контура (проверяем несколько точек)
      const checkPoints = [0.25, 0.5, 0.75];
      for (let k = 0; k < checkPoints.length; k++) {
        const t = checkPoints[k];
        const checkPoint = p1.clone().add(p2.clone().sub(p1).multiplyScalar(t));
        if (!myMath.checkPointInsideForm({ point: checkPoint, arrP: poly })) {
          return false;
        }
      }

      // проверяем, что на соединительном отрезке нет точек других сегментов
      if (allSegments) {
        for (let s = 0; s < allSegments.length; s++) {
          const seg = allSegments[s];
          // пропускаем текущий и целевой сегменты
          if (seg === currentSeg || seg === targetSeg) {
            continue;
          }

          // проверяем точки a и b сегмента
          const segPoints = [seg.a.pos, seg.b.pos];
          for (let sp = 0; sp < segPoints.length; sp++) {
            const segPoint = segPoints[sp];
            // проверяем, что точка не совпадает с началом или концом соединительного отрезка
            const distToP1 = segPoint.distanceTo(p1);
            const distToP2 = segPoint.distanceTo(p2);
            if (distToP1 < eps || distToP2 < eps) {
              continue; // точка совпадает с концом соединительного отрезка - это нормально
            }

            // проверяем, лежит ли точка на соединительном отрезке
            if (myMath.isPointOnSegment2({ point1: p1, point2: p2, targetPoint: segPoint })) {
              return false; // точка другого сегмента лежит на соединительном отрезке
            }
          }
        }
      }

      // проверяем пересечения с другими линиями
      for (let j = 0; j < allLines.length; j++) {
        const line = allLines[j];

        // пропускаем текущий и целевой сегменты
        if (line.segment === currentSeg || line.segment === targetSeg) {
          continue;
        }

        // проверяем пересечение
        if (myMath.checkCrossLine(p1, p2, line.start, line.end)) {
          const intersection = myMath.getIntersection(p1, p2, line.start, line.end);
          if (intersection) {
            // проверяем, что пересечение не в конечных точках
            const dist1 = intersection.distanceTo(p1);
            const dist2 = intersection.distanceTo(p2);
            const dist3 = intersection.distanceTo(line.start);
            const dist4 = intersection.distanceTo(line.end);

            // допускаем пересечение только если оно очень близко к конечным точкам
            const minDist = Math.min(dist1, dist2, dist3, dist4);
            if (minDist > eps * 10) {
              return false; // есть пересечение
            }
          }
        }
      }
    }

    return true;
  }

  getProjBounds({ poly, O, u, v }) {
    const b = { sMin: Infinity, sMax: -Infinity, tMin: Infinity, tMax: -Infinity };
    for (let i = 0; i < poly.length; i++) {
      const rel = poly[i].clone().sub(O);
      const s = u.dot(rel);
      const t = v.dot(rel);
      if (s < b.sMin) b.sMin = s;
      if (s > b.sMax) b.sMax = s;
      if (t < b.tMin) b.tMin = t;
      if (t > b.tMax) b.tMax = t;
    }
    return b;
  }

  buildScanlines({ bounds, sizeCell }) {
    const lines = [];
    if (sizeCell <= 0) return lines;
    const kMin = Math.floor(bounds.tMin / sizeCell);
    const kMax = Math.ceil(bounds.tMax / sizeCell);
    for (let k = kMin; k <= kMax; k++) lines.push(k * sizeCell);
    return lines;
  }

  getInsideSegmentsOnScanline({ poly, O, u, v, t, bounds, eps }) {
    const margin = Math.max(0.1, eps * 10);
    const p1 = O.clone()
      .add(v.clone().multiplyScalar(t))
      .add(u.clone().multiplyScalar(bounds.sMin - margin));
    const p2 = O.clone()
      .add(v.clone().multiplyScalar(t))
      .add(u.clone().multiplyScalar(bounds.sMax + margin));

    const hits = this.intersectionsLinePolygon({ poly, lineA: p1, lineB: p2, O, u, eps });
    if (hits.length < 2) return [];

    hits.sort((a, b) => a.s - b.s);

    const segs = [];
    for (let i = 0; i + 1 < hits.length; i += 2) {
      const h1 = hits[i];
      const h2 = hits[i + 1];
      const len = h1.pos.distanceTo(h2.pos);
      if (len < eps * 10) continue;

      const s1 = h1.s;
      const s2 = h2.s;

      // сохраняем endpoints как boundary-info
      const a = s1 <= s2 ? h1 : h2;
      const b = s1 <= s2 ? h2 : h1;

      segs.push({
        sMin: Math.min(s1, s2),
        sMax: Math.max(s1, s2),
        a,
        b,
      });
    }

    return segs;
  }

  intersectionsLinePolygon({ poly, lineA, lineB, O, u, eps }) {
    const hits = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];

      const pos = myMath.getIntersection(lineA, lineB, a, b);
      if (!pos) continue;

      const onAB = myMath.isPointOnSegment2({ point1: a, point2: b, targetPoint: pos });
      const onLine = myMath.isPointOnSegment2({ point1: lineA, point2: lineB, targetPoint: pos });
      if (!onAB || !onLine) continue;

      // дедуп по расстоянию (вершины могут давать двойной хит)
      let unique = true;
      for (let j = 0; j < hits.length; j++) {
        if (hits[j].pos.distanceTo(pos) < eps * 50) {
          unique = false;
          break;
        }
      }
      if (!unique) continue;

      const edgeLen = a.distanceTo(b);
      const alpha = edgeLen < eps ? 0 : a.distanceTo(pos) / edgeLen;
      const s = u.dot(pos.clone().sub(O));

      hits.push({ pos, edgeIndex: i, alpha, s });
    }
    return hits;
  }

  // обратка
  offsetContour({ v, offset }) {
    const newFormPoints = this.offsetForm({ points: v, offset });
    this.crHelpLine({ v: newFormPoints, color: 0x0000ff });
    return newFormPoints;
  }

  // смещение формы (точки должны идти против часавой) (контру должен быть замкнут, последняя точка ровна первой)
  offsetForm({ points, offset }) {
    const lines = this.offsetLines({ points, offset });

    const pt1 = myMath.intersectionTwoLines_1({ line1: lines[0], line2: lines[lines.length - 1] });
    const pointsOffset = [new THREE.Vector3(pt1.x, 0, pt1.z)];

    for (let i = 0; i < lines.length - 1; i++) {
      const pt = myMath.intersectionTwoLines_1({ line1: lines[i], line2: lines[i + 1] });

      pointsOffset.push(new THREE.Vector3(pt.x, 0, pt.z));
    }

    const closed = points[0].distanceTo(points[points.length - 1]) > 0.0001 ? false : true; // закнут контру или нет
    if (closed) pointsOffset.push(pointsOffset[0].clone());

    return pointsOffset;
  }

  // смещение массива точек контура, отдаем массив линий (контру должен быть замкнут, последняя точка ровна первой)
  offsetLines({ points, offset }) {
    const lines = [];

    // проверяем закунт ли контур, если нет, то делаем замкнутый массив точек
    if (points[0].distanceTo(points[points.length - 1]) > 0.0001) {
      points = [...points]; // копируем массив, создав новый
      points.push(points[0]);
    }

    for (let i = 0; i < points.length - 1; i++) {
      let pt1 = points[i];
      let pt2 = points[i + 1];

      const dir = pt2.clone().sub(pt1);
      const angle = Math.atan2(dir.z, dir.x);

      const offsetPt1 = new THREE.Vector3(pt1.x - offset * Math.cos(angle - Math.PI / 2), 0, pt1.z + offset * Math.sin(angle + Math.PI / 2));
      const offsetPt2 = new THREE.Vector3(pt2.x - offset * Math.cos(angle - Math.PI / 2), 0, pt2.z + offset * Math.sin(angle + Math.PI / 2));

      lines.push({ start: offsetPt1, end: offsetPt2 });
    }

    return lines;
  }

  crHelpBox({ pos, size = 0.04, color = 0x0000ff }) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pos);
    scene.add(mesh);

    this.pointsObj.push(mesh);

    return mesh;
  }

  crHelpLine({ v, color = 0xff0000 }) {
    const geometry = new THREE.Geometry();
    geometry.vertices = v;
    const line = new THREE.Line(geometry, new THREE.MeshLambertMaterial({ color, lightMap: lightMap_1 }));
    scene.add(line);

    this.linesObj.push(line);

    return line;
  }

  delete() {
    const points = this.pointsObj;

    for (let i = 0; i < points.length; i++) {
      scene.remove(points[i]);
      points[i].geometry.dispose();
    }

    const lines = this.linesObj;

    for (let i = 0; i < lines.length; i++) {
      scene.remove(lines[i]);
      lines[i].geometry.dispose();
    }

    this.pointsObj = [];
    this.linesObj = [];
  }

  render() {
    renderCamera();
  }
}
