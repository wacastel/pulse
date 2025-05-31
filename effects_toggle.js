// Effect elements or containers
const pulseContainer = document.querySelector(".pulse-container");
const particleCanvas = document.getElementById("particleCanvas");
const orbitTrailCanvas = document.getElementById("orbitTrailCanvas");

let effectsTimerEnabled = false;
let effectsTimer = null;

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
      if (particleCanvas) particleCanvas.style.display = state;
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
  }
}

function startEffectsTimer() {
  if (effectsTimer) clearInterval(effectsTimer);
  document.body.classList.add("timer-active");
  effectsTimer = setInterval(() => {
    const keys = ["1", "2", "3", "5"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    toggleEffect(randomKey);
    console.log('toggling effect: ', randomKey);
  }, 15000); // every 15 seconds
}

visualizerCanvas.style.display = "none";
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
  console.log("key pressed: ", e.key);
  if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
    toggleEffect(e.key);
  } else if (e.key.toLowerCase() === "h") {
    const shortcutList = document.getElementById("shortcut-list");
    if (shortcutList) {
      shortcutList.style.display = shortcutList.style.display !== "block" ? "block" : "none";
    }
  }
});
