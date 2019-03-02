window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const initNoOfPoints = 50;

  function getNewPoints() {
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
    const newPoints = [];

    for(let i = 0; i < initNoOfPoints; i++) {
      const randomDirectionIndex = Math.floor(Math.random() * directionLength);
      const randomDirection = directionsArray[randomDirectionIndex];

      const clientX = window.innerWidth;
      const startX = Math.floor(Math.random() * clientX);
      const endX = startX + randomDirection[0];

      const clientY = window.innerHeight;
      const startY = Math.floor(Math.random() * clientY);
      const endY = startY + randomDirection[1];

      newPoints.push({start: [startX, startY], end: [endX, endY]});
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

  function connectPoints(pointsArray, lineRadius, c) {
    for (let pointFirst of pointsArray) {
      for (let pointSecond of pointsArray) {
        const startPoint = pointFirst.start;
        const endPoint = pointSecond.start;
        const lineDistance = calculateDistance(startPoint, endPoint);
        const isLinePresent = lineDistance !== 0 && lineDistance <= lineRadius;

        if (isLinePresent) {
          const opacity = 1 - (lineDistance / lineRadius);
          drawLine(startPoint, endPoint, `rgba(255, 0, 0, ${opacity})`, c);
        }
      }
    }
  }

  const pointsArray = getNewPoints();
  connectPoints(pointsArray, 150, context);

  console.log(canvas);
}

