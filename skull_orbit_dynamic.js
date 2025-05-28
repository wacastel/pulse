
// === Skull Orbit Dynamic Radius (Goth Mode Only) ===

skullContainer = document.createElement("div");
skullContainer.id = "skullOrbit";
// Add this inside skull_orbit_dynamic.js
const circle = document.querySelector('.pulse-circle');
if (circle) {
  circle.appendChild(skullContainer);
}

const skullCount = 6;
for (let i = 0; i < skullCount; i++) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("skull-orbit-wrapper");
  wrapper.style.setProperty("--i", i);

  const skull = document.createElement("div");
  skull.classList.add("skull");

  wrapper.appendChild(skull);
  skullContainer.appendChild(wrapper);
}

/*function updateSkullVisibility() {
  const isGoth = document.body.classList.contains("goth-mode");
  skullContainer.style.display = isGoth ? "block" : "none";
}

updateSkullVisibility();
if (gothButton) {
  gothButton.addEventListener("click", updateSkullVisibility);
}*/

// Dynamic radius applied within animate loop
window.updateSkullOrbitRadius = function(average) {
  const radius = 100 + (average / 2);
  const skulls = document.querySelectorAll(".skull");
  skulls.forEach(skull => {
    skull.style.transform = `translateX(${radius}px) translate(-50%, -50%) rotate(90deg)`;
  });
};
