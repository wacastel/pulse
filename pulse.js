const audio = document.getElementById('audio');
const circle = document.querySelector('.pulse-circle');
const button = document.getElementById('startButton');

const context = new (window.AudioContext || window.webkitAudioContext)();
const source = context.createMediaElementSource(audio);
const analyser = context.createAnalyser();

source.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Set up canvas context for visualizer
const visualizerCanvas = document.getElementById('visualizerCanvas');
const canvasCtx = visualizerCanvas.getContext("2d");
visualizerCanvas.width = window.innerWidth;
visualizerCanvas.height = window.innerHeight;

class Particle {
  constructor(x, y, size, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.alpha = 1;
  }

  update(averageVolume) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.01;
    this.size += 0.05 * (averageVolume / 128);
    if (this.alpha < 0) this.alpha = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  let total = 0;
  for (let i = 0; i < bufferLength; i++) {
    total += dataArray[i];
  }
  const average = total / bufferLength;
  const scale = 1 + (average / 256);
  circle.style.transform = `scale(${scale})`;

  // 💫 Magic fade without hiding gradient
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✨ Switch to normal/lighter drawing
  ctx.globalCompositeOperation = 'lighter';

  // Create new particles based on volume
  if (average > 40 && Math.random() < 0.5) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(
        canvas.width / 2,
        canvas.height / 2,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        `hsl(${Math.random() * 360}, 100%, 70%)`
      ));
    }
  }

  // Update and draw all particles
  particles.forEach((p, index) => {
    p.update(average);
    p.draw(ctx);
    if (p.alpha <= 0) particles.splice(index, 1);
  });
}

button.addEventListener('click', () => {
  button.style.display = 'none';
  circle.style.display = 'block';

  context.resume().then(() => {
    audio.play();
    animate();
    draw();
  });
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  visualizerCanvas.width = window.innerWidth;
  visualizerCanvas.height = window.innerHeight;
});

const WIDTH = visualizerCanvas.width;
const HEIGHT = visualizerCanvas.height;

canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(0 0 0)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  let heightMultiplier = 8.5;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * heightMultiplier;

    canvasCtx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}
