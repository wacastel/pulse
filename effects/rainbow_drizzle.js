
const drizzleCanvas = document.createElement("canvas");
drizzleCanvas.id = "drizzleCanvas";
document.body.appendChild(drizzleCanvas);

const drizzleCtx = drizzleCanvas.getContext("2d", { alpha: true });
let drizzleParticles = [];

function resizeCanvas() {
  drizzleCanvas.width = window.innerWidth;
  drizzleCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createDrizzleParticle() {
  return {
    x: Math.random() * drizzleCanvas.width,
    y: 0,
    speedY: 1 + Math.random() * 2,
    zigzagAmplitude: 0.1 + Math.random() * 0.1,
    zigzagFrequency: 0.002 + Math.random() * 0.003,
    size: 2 + Math.random() * 2,
    phase: Math.random() * 1000
  };
}

function getDrizzleColor() {
  const isGoth = document.body.classList.contains("goth-mode");
  if (isGoth) {
    const gothPalette = ["#8B008B", "#4B0082", "#2F4F4F", "#8B0000", "#551A8B"];
    return gothPalette[Math.floor(Math.random() * gothPalette.length)];
  } else {
    const neonPalette = ["#39FF14", "#FF10F0", "#00FFFF", "#FF3131", "#FFD700"];
    return neonPalette[Math.floor(Math.random() * neonPalette.length)];
  }
}

function updateDrizzle(audioLevel) {
  // Create new particles
  for (let i = 0; i < 5; i++) {
    drizzleParticles.push(createDrizzleParticle());
  }

  // Update and draw particles
  drizzleCtx.clearRect(0, 0, drizzleCanvas.width, drizzleCanvas.height);
  drizzleParticles = drizzleParticles.filter(p => p.y < drizzleCanvas.height);

  for (let p of drizzleParticles) {
    p.y += p.speedY;
    let time = Date.now() + p.phase;
    p.x += Math.sin(time * p.zigzagFrequency) * p.zigzagAmplitude * audioLevel;

    drizzleCtx.fillStyle = getDrizzleColor();
    drizzleCtx.beginPath();
    drizzleCtx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    drizzleCtx.fill();
  }
}
