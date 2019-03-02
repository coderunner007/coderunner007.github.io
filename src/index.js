window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const initNoOfPoints = 50;
  const minNoOfPoints = 40;

  const directionsArray = [
    [1, 1],
    [1, -1],
    [1, 0],
    [-1, 1],
    [-1, -1],
    [-1, 0],
    [0, -1],
    [0, 1],
  ];
  const directionLength = directionsArray.length;

  function getNewPoint() {
    const randomDirectionIndex = Math.floor(Math.random() * directionLength);
    const randomDirection = directionsArray[randomDirectionIndex];

    const clientX = window.innerWidth;
    const x = Math.floor(Math.random() * clientX);

    const clientY = window.innerHeight;
    const y = Math.floor(Math.random() * clientY);

    return {
      coords: [x, y],
      diff: randomDirection,
    };
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

  function drawLine(startPoint, endPoint, strokeStyle, c) {
    c.beginPath();
    c.moveTo(startPoint[0], startPoint[1]);
    c.lineTo(endPoint[0], endPoint[1]);
    c.strokeStyle = strokeStyle;
    c.stroke();
  }

  function connectPoints(pointsToConnect, lineRadius, c) {
    for (let pointFirst of pointsToConnect) {
      for (let pointSecond of pointsToConnect) {
        const startPoint = pointFirst.coords;
        const endPoint = pointSecond.coords;
        const lineDistance = calculateDistance(startPoint, endPoint);
        const isLinePresent = lineDistance !== 0 && lineDistance <= lineRadius;

        if (isLinePresent) {
          const opacity = 1 - (lineDistance / lineRadius);
          drawLine(startPoint, endPoint, `rgba(255, 255, 255, ${opacity})`, c);
        }
      }
    }
  }

  function movePoints(pointsToAnimate) {
    for (let i = 0; i < pointsToAnimate.length; i++) {
      const pointInfo = pointsToAnimate[i];
      const point = pointInfo.coords;
      const diffX = pointInfo.diff[0];
      const diffY = pointInfo.diff[1];
      const coords = [point[0] + diffX, point[1] + diffY];

      pointsToAnimate[i] = { ...pointInfo, coords };
    }
  }

  function showPoints(pointsToShow, strokeStyle, c) {
    for (let pointInfo of pointsToShow) {
      const point = pointInfo.coords;
      c.beginPath();
      c.arc(point[0], point[1], 3, 0, Math.PI * 2, false)
      c.strokeStyle = strokeStyle;
      c.stroke();
    }
  }

  function animate(pointsToAnimate, canvasToDraw, c) {
    c.clearRect(0, 0, canvasToDraw.width, canvasToDraw.height);
    showPoints(pointsToAnimate, 'green', c);
    connectPoints(pointsToAnimate, 150, c);
    movePoints(pointsToAnimate);
  }

  const pointsArray = getNewPoints();
  console.log(pointsArray);
  // animate(pointsArray)
  setInterval(animate, 10, pointsArray, canvas, context);
}

