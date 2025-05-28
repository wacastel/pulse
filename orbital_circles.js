const circleCount = 3;
const orbitalContainer = document.createElement("div");
orbitalContainer.id = "orbitalContainer";
document.body.appendChild(orbitalContainer);

const circles = [];

for (let i = 0; i < circleCount; i++) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("orbital-circle");
  wrapper.style.animationDelay = `-${(i / circleCount) * 20}s`; // orbit spacing
  wrapper.style.setProperty('--offset', i);
  orbitalContainer.appendChild(wrapper);
  circles.push(wrapper);
}

// Pulse logic (called externally, e.g. from animate loop in pulse.js)
window.updateOrbitingCircles = function (average) {
  const time = performance.now() / 1000;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  circles.forEach((circle, i) => {
    const angle = time * 0.3 + (i * (Math.PI * 2) / circles.length);
    const offset = Math.sin(time * 2 + i);
    const scale = 1 + (average / 512) + 0.2 * offset;

    const x = centerX + 200 * Math.cos(angle);
    const y = centerY + 200 * Math.sin(angle);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });
};
