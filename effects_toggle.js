const orbitTrailCanvas = document.getElementById("orbitTrailCanvas");
const pulseContainer = document.querySelector(".pulse-container");
const particleCanvas = document.getElementById("particleCanvas");
const gothButton = document.getElementById("gothButton");

let effectsTimerEnabled = false;
let effectsTimer = null;
let isShuffleOn = false;
let isMuted = false;

// Helper: fade toggle logic
function fadeToggle(element) {
  if (!element) return;
  if (!element.classList.contains("fade-effect")) {
    element.classList.add("fade-effect");
  }
  element.classList.toggle("fade-hidden");
}

// Highlight shortcut menu items
const shortcutList = document.getElementById("shortcut-list");
const shortcutItems = shortcutList.querySelectorAll("ul li");

function highlightShortcut(index, isOn) {
  if (shortcutItems[index]) {
    shortcutItems[index].classList.toggle("active-shortcut", isOn);
  }
}

function toggleEffect(key) {
  switch (key) {
    case "1":
      fadeToggle(visualizerCanvas);
      highlightShortcut(7, !visualizerCanvas.classList.contains("fade-hidden"));
      break;
    case "2":
      fadeToggle(drizzleCanvas);
      highlightShortcut(8, !drizzleCanvas.classList.contains("fade-hidden"));
      break;
    case "3":
      fadeToggle(orbitTrailCanvas);
      fadeToggle(orbitalContainer);
      highlightShortcut(9, !orbitTrailCanvas.classList.contains("fade-hidden"));
      break;
    case "4":
      fadeToggle(skullOrbit);
      fadeToggle(skullOrbitReverse);
      highlightShortcut(10, !skullOrbit.classList.contains("fade-hidden"));
      break;
    case "5":
      fadeToggle(pulseContainer);
      fadeToggle(centerContainer);
      fadeToggle(particleCanvas);
      highlightShortcut(11, !pulseContainer.classList.contains("fade-hidden"));
      break;
    case "6":
      effectsTimerEnabled = !effectsTimerEnabled;
      highlightShortcut(12, effectsTimerEnabled);
      if (effectsTimerEnabled) {
        startEffectsTimer();
      } else {
        stopEffectsTimer();
      }
      break;
    case "s":
      isShuffleOn = !isShuffleOn;
      document.body.classList.toggle("shuffle-on", isShuffleOn);
      highlightShortcut(4, isShuffleOn);
      break;
    case "m":
      isMuted = !isMuted;
      if (audio) audio.muted = isMuted;
      document.body.classList.toggle("muted", isMuted);
      highlightShortcut(5, isMuted);
      break;
    case "g":
      toggleGothMode();
      highlightShortcut(6, gothActive);
      break;
  }
}

function startEffectsTimer() {
  if (effectsTimer) clearInterval(effectsTimer);
  document.body.classList.add("timer-active");
  effectsTimer = setInterval(() => {
    const keys = ["1", "2", "3", "5"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    toggleEffect(randomKey);
  }, 15000);
}

startEffectsTimer();
effectsTimerEnabled = true;

function stopEffectsTimer() {
  if (effectsTimer) {
    clearInterval(effectsTimer);
    effectsTimer = null;
    document.body.classList.remove("timer-active");
  }
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["1", "2", "3", "4", "5", "6", "s", "m", "g"].includes(key)) {
    toggleEffect(key);
  } else if (key === "h") {
    const shortcutList = document.getElementById("shortcut-list");
    if (shortcutList) {
      toggleShortcuts();
    }
  }
});
