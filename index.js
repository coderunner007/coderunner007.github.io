window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const canvasStartX = 0;
  const canvasStartY = 0;
  const canvasEndX = canvasWidth;
  const canvasEndY = canvasHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const initNoOfPoints = 80;
  const minNoOfPoints = initNoOfPoints;
  const refreshInterval = 8;
  const lowestRefreshRate = refreshInterval - 1;
  const highestRefreshRate = 3;
  const maxPointRadius = 2;

  function getNewPoint(edgePoint = false) {
    const refreshRateFactor = lowestRefreshRate - highestRefreshRate;
    const refreshOnFrame = Math.floor(
      Math.random() * refreshRateFactor
    ) + highestRefreshRate;
    const pointRadius = Math.floor(Math.random() * maxPointRadius) + 1;

    {
      const diffX = (Math.random() * 2) - 1;
      const diffY = (Math.random() * 2) - 1;
      const diff = [diffX, diffY];

      const clientX = window.innerWidth;
      const x = Math.floor(Math.random() * clientX);

      const clientY = window.innerHeight;
      const y = Math.floor(Math.random() * clientY);

      return {
        coords: [x, y],
        diff,
        refreshOnFrame,
        pointRadius,
      };
    }
  }

  function getNewPoints() {
    const newPoints = [];

    for(let i = 0; i < initNoOfPoints; i++) {
      const newPoint = getNewPoint();

      newPoints.push(newPoint);
    }

    return newPoints;
  }

  function calculateDistance(startPoint, endPoint) {
    return Math.sqrt(
      (
        (endPoint[0] - startPoint[0]) * (endPoint[0] - startPoint[0])
      ) + (
        (endPoint[1] - startPoint[1]) * (endPoint[1] - startPoint[1])
      )
    );
  }

  function drawLine(startPoint, endPoint, strokeStyle, lineWidth, c) {
    c.beginPath();
    c.moveTo(startPoint[0], startPoint[1]);
    c.lineTo(endPoint[0], endPoint[1]);
    c.strokeStyle = strokeStyle;
    c.lineWidth = lineWidth;
    c.stroke();
  }

  function drawLines(pointsToConnect, lineRadius, strokeStyle, c) {
    for (let pointFirst of pointsToConnect) {
      for (let pointSecond of pointsToConnect) {
        const startPoint = pointFirst.coords;
        const endPoint = pointSecond.coords;
        const lineDistance = calculateDistance(startPoint, endPoint);
        const isLinePresent = lineDistance !== 0 && lineDistance <= lineRadius;

        if (isLinePresent) {
          const strokeWidth = 1 - (lineDistance / lineRadius);
          drawLine(startPoint, endPoint, strokeStyle, strokeWidth, c);
        }
      }
    }
  }

  function movePoints(pointsToAnimate, timesRefreshed) {
    return pointsToAnimate.map((pointInfo, index) => {
      const point = pointInfo.coords;
      const diffX = pointInfo.diff[0];
      const diffY = pointInfo.diff[1];
      const isToBeMoved = timesRefreshed % point.refreshOnFrame !== 0;
      const coords = isToBeMoved
        ? [point[0] + diffX, point[1] + diffY]
        : point;

      return { ...pointInfo, coords };
    });
  }

  function drawPoints(pointsToShow, strokeStyle, c) {
    for (let pointInfo of pointsToShow) {
      const point = pointInfo.coords;
      const pointRadius = pointInfo.pointRadius;
      c.beginPath();
      c.arc(point[0], point[1], pointRadius, 0, Math.PI * 2, false)
      c.fillStyle = strokeStyle;
      c.fill();
    }
  }

  function isPointOnCanvas(point) {
    if (
      (point[0] > canvasStartX && point[0] < canvasEndX) &&
      (point[1] > canvasStartY && point[1] < canvasEndY)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function updatePoints(pointsToUpdate) {
    const totalPoints = pointsToUpdate.length;
    const pointsToAdd = minNoOfPoints - totalPoints;
    const updatedPoints = pointsToUpdate.filter(
      pointInfo => isPointOnCanvas(pointInfo.coords)
    );

    for (let i = 0; i < pointsToAdd; i++) {
      const newPoint = getNewPoint(true);

      updatedPoints.push(newPoint);
    }

    return updatedPoints;
  }

  function drawObjects(pointsToAnimate, canvasToDraw, c) {
    c.clearRect(0, 0, canvasToDraw.width, canvasToDraw.height);
    drawLines(pointsToAnimate, 150, 'rgba(255, 255, 255, 0.2)', c);
    drawPoints(pointsToAnimate, 'rgba(255, 255, 255, 0.2)', c);
  }

  function calculateUpdatedPoints(prevPoints, timesRefreshed) {
    const newPoints = movePoints(prevPoints, timesRefreshed);
    return updatePoints(newPoints);
  }

  function animate() {
    let pointsArray = getNewPoints();
    let timesRefreshed = 0;
    console.log(pointsArray)

    return function() {
      drawObjects(pointsArray, canvas, context);
      pointsArray = calculateUpdatedPoints(pointsArray, timesRefreshed++);
    }
  }

  setInterval(animate(), refreshInterval);
}
