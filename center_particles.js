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
    const isGoth = document.body.classList.contains("goth-mode");
    const hueMap = isGoth
      ? { bass: 345, mid: 300, high: 260 }  // red, magenta, purple
      : { bass: 282, mid: 60, high: 180 }; // violet, yellow, cyan
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

function updateCenterParticles(bandValues) {
  const average = (bandValues.bass + bandValues.mid + bandValues.high) / 3;
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
