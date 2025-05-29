// === Skull Orbit Dynamic Radius (Goth Mode Only) ===

skullContainer = document.createElement("div");
skullContainer.id = "skullOrbit";
skullContainerReverse = document.createElement("div");
skullContainerReverse.id = "skullOrbitReverse";
const circle = document.querySelector('.pulse-circle');
if (circle) {
  circle.appendChild(skullContainer);
  circle.appendChild(skullContainerReverse);
}

const skullCount = 30;
const orbitRadius = 150;
const skullOrbit = document.getElementById("skullOrbit");
const skullOrbitReverse = document.getElementById("skullOrbitReverse");

function createSkull(angleDeg, isReverse = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "skull-orbit-wrapper";
  wrapper.style.setProperty("--angle", `${angleDeg}deg`);

  const rotator = document.createElement("div");
  
  if (isReverse) {
    rotator.classList.add("skull-rotator-reverse");
  } else {
    rotator.className = "skull-rotator";
  }



  const skull = document.createElement("div");
  skull.className = "skull";
  if (isReverse) skull.classList.add("reverse-spin");

  rotator.appendChild(skull);
  wrapper.appendChild(rotator);

  return wrapper;
}

// Populate both orbits
for (let i = 0; i < skullCount; i++) {
  const angle = (i * 360) / skullCount;

  // Clockwise orbit
  skullOrbit.appendChild(createSkull(angle, false));

  // Counter-clockwise orbit
  skullOrbitReverse.appendChild(createSkull(angle, true));
}
