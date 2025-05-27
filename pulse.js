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
  constructor(x, y, size, speedX, speedY, band) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.band = band; // 'bass', 'mid', 'high'
    this.alpha = 1;
    this.brightness = 1;
  }

  update(bandValues) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.01; // note: use a higher value such as 0.08 for faster fadeout

    const volume = bandValues[this.band] || 0;
    this.brightness = Math.min(2, 0.5 + (volume / 256) * 2);
    this.size += 0.05 * (volume / 128);

    if (this.alpha < 0) this.alpha = 0;
  }

  draw(ctx) {
    const hueMap = {
      bass: 282,  // more violet (282)
      mid: 60,    // yellow
      high: 180   // cyan/blue
    };
    const hue = hueMap[this.band] || 0;

    ctx.save();

    // Simulated glow layer
    ctx.globalAlpha = this.alpha * 0.4;
    ctx.beginPath();
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core particle layer
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function averageInRange(start, end) {
  let sum = 0;
  for (let i = start; i <= end && i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  return sum / (end - start + 1);
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  const bandValues = {
    bass: averageInRange(0, 10),
    mid: averageInRange(11, 40),
    high: averageInRange(41, 80),
  };

  const average = (bandValues.bass + bandValues.mid + bandValues.high) / 3;

  circle.style.transform = `scale(${1 + average / 256})`;

  // 💫 Magic fade without hiding gradient
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✨ Switch to normal/lighter drawing
  ctx.globalCompositeOperation = 'source-over'; // default mode (no glow)

  const MAX_PARTICLES = 50;

  // Create new particles based on volume
  if (particles.length < MAX_PARTICLES && average > 40 && Math.random() < 0.5) {
    const bands = ['bass', 'mid', 'high'];
    for (let i = 0; i < 3; i++) {
      const spawnRadius = 50;
      const angle = Math.random() * 2 * Math.PI;
      const spawnX = canvas.width / 2 + Math.cos(angle) * spawnRadius * Math.random();
      const spawnY = canvas.height / 2 + Math.sin(angle) * spawnRadius * Math.random();
      const band = bands[Math.floor(Math.random() * bands.length)];

      particles.push(new Particle(
        spawnX,
        spawnY,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        band
      ));
    }
  }

  // Update and draw all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(bandValues);
    particles[i].draw(ctx);
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

button.addEventListener('click', () => {
  button.style.display = 'none';
  circle.style.display = 'block';

  context.resume().then(() => {
    audio.play();
    animate();
    drawBarGraph();
  });
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  visualizerCanvas.width = WIDTH = window.innerWidth;
  visualizerCanvas.height = HEIGHT = window.innerHeight;
});

document.addEventListener('keydown', e => {
  if (e.key === 'd') {
    console.log('Particles:', particles.length);
  }
});

let WIDTH = visualizerCanvas.width;
let HEIGHT = visualizerCanvas.height;

canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

function drawBarGraph() {
  requestAnimationFrame(drawBarGraph);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(0 0 0)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  let heightMultiplier = 8.5;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * heightMultiplier;
    const hue = i * 3; // scale up to ~765°
    canvasCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}
