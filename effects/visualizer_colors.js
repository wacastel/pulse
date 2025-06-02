const visualizerCanvas = document.getElementById('visualizerCanvas');
const visualizerCtx = visualizerCanvas.getContext('2d');
visualizerCanvas.width = WIDTH = window.innerWidth;
visualizerCanvas.height = HEIGHT = window.innerHeight;

function getColor(index, total, isGoth) {
  const ratio = index / total;
  if (isGoth) {
    const gothColors = ["#551A8B", "#4B0082", "#8B0000"];
    return gothColors[Math.floor(ratio * gothColors.length)];
  } else {
    const neonColors = ["#39FF14", "#FF10F0", "#00FFFF"];
    return neonColors[Math.floor(ratio * neonColors.length)];
  }
}

function drawVisualizer(dataArray) {
  analyser.getByteFrequencyData(dataArray);
  visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
  const isGoth = document.body.classList.contains("goth-mode");

  const barWidth = (WIDTH / dataArray.length) * 1.03;
  let barHeight;
  let x = 0;
  let heightMultiplier = 5;

  for (let i = 0; i < dataArray.length; i++) {
    const val = dataArray[i];
    barHeight = dataArray[i] * heightMultiplier;
    visualizerCtx.fillStyle = getColor(i, dataArray.length, isGoth);
    visualizerCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}
