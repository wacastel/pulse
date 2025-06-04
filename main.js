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
  const isShuffleOn = document.body.classList.contains("shuffle-on");
  if (isShuffleOn) {
    shuffledSongs = shuffleArray(songs);
  }
  const playlist = isShuffleOn ? shuffledSongs : songs;
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

  if (typeof updateCenterParticles === "function") {
    updateCenterParticles(bandValues);
  }
}

function toggleGothMode(auto = false) {
  gothMode = !gothMode;
  document.body.classList.toggle("goth-mode", gothMode);
  const btn = document.getElementById("gothButton");
  btn.textContent = gothMode ? "Enable Neon Mode" : "Enable Goth Mode";
  toggleFade(skullOrbit);
  toggleFade(skullOrbitReverse);

  if (!auto) {
    // Cancel auto toggle if user does it manually
    clearInterval(autoToggleInterval);
  }
}

// Attach manual toggle to the button
document.getElementById("gothButton").addEventListener("click", () => toggleGothMode(false));

function toggleFade(element) {
  if (!element) return;
  if (!element.classList.contains("fade-effect")) {
    element.classList.add("fade-effect");
  }
  element.classList.toggle("fade-hidden");
}

function startPlaying() {
  button.style.display = 'none';
  toggleFade(circle);
  toggleFade(particleCanvas);
  toggleFade(orbitCanvas);
  toggleFade(orbitalContainer);
  toggleFade(centerContainer);
  toggleFade(skullOrbit);
  toggleFade(skullOrbitReverse);
  
  // Auto toggle between neon mode and goth mode every 60 seconds
  autoToggleInterval = setInterval(() => toggleGothMode(true), 60000);

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
  }
});

