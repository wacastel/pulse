
// === Skull Orbit Dynamic Radius (Goth Mode Only) ===

skullContainer = document.createElement("div");
skullContainer.id = "skullOrbit";
const circle = document.querySelector('.pulse-circle');
if (circle) {
  circle.appendChild(skullContainer);
}

const skullCount = 30;
document.documentElement.style.setProperty('--skull-count', skullCount);

for (let i = 0; i < skullCount; i++) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("skull-orbit-wrapper");
  wrapper.id = "skullOrbitWrapper";
  wrapper.style.setProperty("--i", i);

  const skull = document.createElement("div");
  skull.classList.add("skull");

  wrapper.appendChild(skull);
  skullContainer.appendChild(wrapper);
}
