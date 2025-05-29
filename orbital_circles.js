const circleCount = 3;
const orbitalContainer = document.createElement("div");
orbitalContainer.id = "orbitalContainer";
orbitalContainer.style.display = 'none';
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

const orbitCanvas = document.getElementById("orbitTrailCanvas");
const orbitCtx = orbitCanvas.getContext("2d", { alpha: true }); // 👈 important for transparency
orbitCanvas.width = 600;
orbitCanvas.height = 600;

// Pulse logic (called externally, e.g. from animate loop in pulse.js)
window.updateOrbitingCircles = function (average) {
  const time = performance.now() / 1000;
  const canvasRect = orbitCanvas.getBoundingClientRect();
  const centerX = canvasRect.left + orbitCanvas.width / 2;
  const centerY = canvasRect.top + orbitCanvas.height / 2;
  const drawCenterX = orbitCanvas.width / 2;
  const drawCenterY = orbitCanvas.height / 2;

  // Clear with transparency for trailing effect
  orbitCtx.globalCompositeOperation = "destination-out";
  orbitCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
  orbitCtx.fillRect(0, 0, orbitCanvas.width, orbitCanvas.height);

  orbitCtx.globalCompositeOperation = "lighter"; // for glowy blending

  circles.forEach((circle, i) => {
    const angle = time * 0.3 + (i * (Math.PI * 2) / circles.length);
    const offset = Math.sin(time * 2 + i);
    const scale = 1 + (average / 128) + 0.75 * offset;
    const radius = 280;

    const trailX = drawCenterX + radius * Math.cos(angle);
    const trailY = drawCenterY + radius * Math.sin(angle);

    const circleX = centerX + radius * Math.cos(angle);
    const circleY = centerY + radius * Math.sin(angle);

    // Draw orbit glow effect
    orbitCtx.beginPath();
    orbitCtx.arc(trailX, trailY, 6, 0, Math.PI * 2);
    orbitCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    orbitCtx.shadowBlur = 15;
    orbitCtx.shadowColor = 'white';
    orbitCtx.fill();

    // Move DOM element
    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });
};
