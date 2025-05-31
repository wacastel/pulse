const audio = document.getElementById('audio');
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
let gothMode = false;
let autoToggleInterval;

let songs = [];
let currentTrack = 0;
let isShuffled = false;
let shuffledSongs = [];
let playlistItems = []; // new array to track DOM elements

fetch("playlist.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    shuffledSongs = [...songs];
    buildPlaylistUI();
  });

function buildPlaylistUI() {
  const playlistUI = document.getElementById("playlistUI");
  playlistUI.innerHTML = "";
  playlistItems = [];

  songs.forEach((src, idx) => {
    const songName = src.split("/").pop();
    const div = document.createElement("div");
    div.textContent = songName;
    div.classList.add("track-item");
    div.style.cursor = "pointer";
    div.onclick = () => loadTrack(idx, false);
    playlistUI.appendChild(div);
    playlistItems.push(div); // store the element
  });
}

const timeDisplay = document.getElementById("timeDisplay");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function parseTrackInfo(filePath) {
  const parts = filePath.split("/");
  const trackFile = parts.pop().replace(".mp3", "");
  const album = parts.pop();
  const artist = parts.pop();
  return {
    artist,
    album,
    track: trackFile
  };
}

function loadTrack(index, autoScroll=true) {
  const playlist = isShuffled ? shuffledSongs : songs;
  currentTrack = (index + playlist.length) % playlist.length;

  const trackToPlay = playlist[currentTrack];
  audio.src = trackToPlay;

  const info = parseTrackInfo(trackToPlay);
  const nowPlayingText = document.getElementById("nowPlayingText");
  nowPlayingText.textContent = `🎵 ${info.track}  •  🎤 ${info.artist}  •  💿 ${info.album}`;

  audio.play();

  // Update track highlighting in the original order list
  const actualIndex = songs.findIndex(song => song === trackToPlay);

  playlistItems.forEach((el, idx) => {
    el.classList.toggle("active-track", idx === actualIndex);
  });
  const activeTrack = document.querySelector(".active-track");
  if (activeTrack && autoScroll) {
    activeTrack.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });
  }

  playPauseBtn.textContent = "⏸️";

  // Reset and start time tracking
  timeDisplay.textContent = "00:00 / 00:00";
  if (window.timeInterval) clearInterval(window.timeInterval);
  window.timeInterval = setInterval(() => {
    const current = audio.currentTime;
    const total = audio.duration || 0;
    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }, 500);
}

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
  const scaleValue = 1 + average / 256;

  circle.style.transform = `scale(${scaleValue})`;

  const skullOrbit = document.getElementById('skullOrbit');
  if (skullOrbit) {
    skullOrbit.style.transform = `translate(-50%, -50%) scale(${scaleValue/1.125})`;
  }

  const skullOrbitReverse = document.getElementById('skullOrbitReverse');
  if (skullOrbitReverse) {
    skullOrbitReverse.style.transform = `translate(-50%, -50%) scale(${scaleValue/1.3})`;
  }

  if (typeof updateOrbitingCircles === "function") {
    updateOrbitingCircles(average);
  }

    if (typeof updateDrizzle === "function") {
    updateDrizzle(average);
  }

  if (typeof drawVisualizer === "function") {
    drawVisualizer(dataArray);
  }

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

function toggleGothMode(auto = false) {
  gothMode = !gothMode;
  document.body.classList.toggle("goth-mode", gothMode);
  const btn = document.getElementById("gothButton");
  btn.textContent = gothMode ? "Enable Neon Mode" : "Enable Goth Mode";
  skullContainer.style.display = gothMode ? "block" : "none";
  skullContainerReverse.style.display = gothMode ? "block" : "none";

  if (!auto) {
    // Cancel auto toggle if user does it manually
    clearInterval(autoToggleInterval);
  }
}

// Attach manual toggle to the button
document.getElementById("gothButton").addEventListener("click", () => toggleGothMode(false));

function startPlaying() {
  button.style.display = 'none';
  circle.style.display = 'block';
  orbitalContainer.style.display = 'block';
  centerContainer.style.display = 'block';
  
  // Auto toggle between neon mode and goth mode every 20 seconds
  autoToggleInterval = setInterval(() => toggleGothMode(true), 42600);

  context.resume().then(() => {
    const randomTrack = Math.floor(Math.random() * songs.length);
    loadTrack(randomTrack); // start a random song
    animate();
  });
}

button.addEventListener('click', () => {
  startPlaying();
});

function toggleShortcuts() {
  const list = document.getElementById('shortcut-list');
  list.style.display = list.style.display === 'block' ? 'none' : 'block';
}

function updateSkullVisibility() {
  const isGoth = document.body.classList.contains("goth-mode");
  skullContainer.style.display = isGoth ? "block" : "none";
  skullContainerReverse.style.display = isGoth ? "block" : "none";
}
updateSkullVisibility();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

audio.addEventListener("ended", () => {
  clearInterval(window.timeInterval);
  timeDisplay.textContent = "00:00 / 00:00";
  playPauseBtn.textContent = "▶️";
  loadTrack(currentTrack + 1);
});

const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const restartBtn = document.getElementById("restartBtn");

restartBtn.addEventListener("click", () => {
  audio.currentTime = 0;
  audio.play();
  playPauseBtn.textContent = "⏸️";
});

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
});

nextBtn.addEventListener("click", () => {
  loadTrack(currentTrack + 1);
});

prevBtn.addEventListener("click", () => {
  loadTrack(currentTrack - 1);
});

document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName.toLowerCase();
  const isTyping = tag === "input" || tag === "textarea";

  if (isTyping) return; // don’t hijack typing input

  switch (event.key) {
    case " ":
      event.preventDefault(); // prevent page scroll
      if (!audio.src) {
        startPlaying();
      } else {
        if (audio.paused) {
          audio.play();
          playPauseBtn.textContent = "⏸️";
        } else {
          audio.pause();
          playPauseBtn.textContent = "▶️";
        }
      }
      break;

    case "ArrowRight":
      loadTrack(currentTrack + 1);
      break;

    case "ArrowLeft":
      loadTrack(currentTrack - 1);
      break;

    case "r":
    case "R":
      audio.currentTime = 0;
      audio.play();
      playPauseBtn.textContent = "⏸️";
      break;

    case "d":
    case "D":
      console.log('Particles:', particles.length);
      break;

    case "s":
    case "S":
      isShuffled = !isShuffled;
      if (isShuffled) {
        shuffledSongs = shuffleArray(songs);
        console.log("Shuffle: ON");
      } else {
        console.log("Shuffle: OFF");
      }
      break;

    case "m":
    case "M":
      audio.muted = !audio.muted;
      console.log(`Mute: ${audio.muted ? "ON" : "OFF"}`);
      break;

    case "g":
    case "G":
      document.body.classList.toggle("goth-mode");
      gothButton.textContent = document.body.classList.contains("goth-mode")
        ? "Disable Goth Mode"
        : "Enable Goth Mode";
      updateSkullVisibility();
      break;
  }
});

