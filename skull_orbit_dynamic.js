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
document.documentElement.style.setProperty('--skull-count', skullCount);

for (let i = 0; i < skullCount; i++) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("skull-orbit-wrapper");
  wrapper.style.setProperty("--i", i);

  const skull = document.createElement("div");
  skull.classList.add("skull");

  wrapper.appendChild(skull);
  skullContainer.appendChild(wrapper);
}

for (let i = 0; i < skullCount; i++) {
  const wrapperReverse = document.createElement("div");
  wrapperReverse.classList.add("skull-orbit-wrapper-reverse");
  wrapperReverse.style.setProperty("--i", i);

  const skullRed = document.createElement("div");
  skullRed.classList.add("skullRed");

  wrapperReverse.appendChild(skullRed);
  skullContainerReverse.appendChild(wrapperReverse);
}
