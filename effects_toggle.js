// Effect elements or containers
const pulseContainer = document.querySelector(".pulse-container");
const particleCanvas = document.getElementById("particleCanvas");
const orbitTrailCanvas = document.getElementById("orbitTrailCanvas");
const gothButton = document.getElementById("gothButton");

let effectsTimerEnabled = false;
let effectsTimer = null;
let isShuffleOn = false;
let isMuted = false;

const shortcutList = document.getElementById("shortcut-list");
const shortcutItems = shortcutList.querySelectorAll("ul li");

// Add highlight class to an item by index
function highlightShortcut(index, isOn) {
  if (shortcutItems[index]) {
    shortcutItems[index].classList.toggle("active-shortcut", isOn);
  }
}

function toggleDisplay(element) {
  if (!element) return false;
  const isNowVisible = element.style.display !== "none";
  element.style.display = isNowVisible ? "none" : "";
  return !isNowVisible;
}

function toggleEffect(key) {
  let isActive = false;
  switch (key) {
    case "1": isActive = toggleDisplay(visualizerCanvas); highlightShortcut(7, isActive); break;
    case "2": isActive = toggleDisplay(drizzleCanvas); highlightShortcut(8, isActive); break;
    case "3": isActive = toggleDisplay(orbitTrailCanvas); highlightShortcut(9, isActive); break;
    case "4":
      const visible = skullOrbit && skullOrbit.style.display !== "none";
      const newState = visible ? "none" : "";
      if (skullOrbit) skullOrbit.style.display = newState;
      if (skullOrbitReverse) skullOrbitReverse.style.display = newState;
      isActive = newState === "";
      highlightShortcut(10, isActive);
      break;
    case "5":
      const vis = pulseContainer && pulseContainer.style.display !== "none";
      const state = vis ? "none" : "";
      if (pulseContainer) pulseContainer.style.display = state;
      isActive = state === "";
      highlightShortcut(11, isActive);
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
    case "7": isActive = toggleDisplay(particleCanvas); highlightShortcut(13, isActive); break;
    case "s":
      isShuffleOn = !isShuffleOn;
      document.body.classList.toggle("shuffle-on", isShuffleOn);
      highlightShortcut(4, isShuffleOn);
      break;
    case "m":
      isMuted = !isMuted;
      if (audio) audio.muted = isMuted;
      document.body.classList.toggle("muted-on", isMuted);
      highlightShortcut(5, isMuted);
      break;
    case "g":
      document.body.classList.toggle("goth-mode");
      const gothActive = document.body.classList.contains("goth-mode");
      gothButton.textContent = gothActive ? "Enable Neon Mode" : "Enable Goth Mode";
      highlightShortcut(6, gothActive);
      break;
  }
}

function startEffectsTimer() {
  if (effectsTimer) clearInterval(effectsTimer);
  document.body.classList.add("timer-active");
  effectsTimer = setInterval(() => {
    const keys = ["1", "2", "3", "4", "5", "7"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    toggleEffect(randomKey);
    console.log('toggling effect: ', randomKey);
  }, 15000); // every 15 seconds
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
  if (["1", "2", "3", "4", "5", "6", "7", "s", "m", "g"].includes(key)) {
    toggleEffect(key);
  } else if (key === "h") {
    const shortcutList = document.getElementById("shortcut-list");
    if (shortcutList) {
      shortcutList.style.display = shortcutList.style.display !== "block" ? "block" : "none";
    }
  }
});
