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


function getDocumentCenter() {
  const docWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const docHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  const centerX = docWidth / 2;
  const centerY = docHeight / 2;

  return { x: centerX, y: centerY };
}

const docWidth = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

const docHeight = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

orbitCanvas.width = window.innerWidth;
orbitCanvas.height = window.innerHeight;

// Pulse logic (called externally, e.g. from animate loop in pulse.js)
window.updateOrbitingCircles = function (average) {
  const time = performance.now() / 1000;
  const center = getDocumentCenter();
  const circleCenterX = center.x;
  const circleCenterY = center.y;
  const trailCenterX = orbitCanvas.width / 2;
  const trailCenterY = orbitCanvas.height / 2;

  // Clear with transparency for trailing effect
  orbitCtx.globalCompositeOperation = "destination-out";
  orbitCtx.fillStyle = "rgba(0, 0, 0, 0.08)";
  orbitCtx.fillRect(0, 0, orbitCanvas.width, orbitCanvas.height);

  orbitCtx.globalCompositeOperation = "lighter"; // for glowy blending

  circles.forEach((circle, i) => {
    const angle = time * 0.3 + (i * (Math.PI * 2) / circles.length);
    const offset = Math.sin(time * 2 + i);
    const scale = 1 + (average / 64) + 0.5 * offset;
    
    // original radius = 270
    const radiusValue = 200;
    const radiusMultiplier = 100;
    const radius = radiusValue + radiusMultiplier * Math.sin(time * 2 + i);

    const trailX = trailCenterX + radius * Math.cos(angle);
    const trailY = trailCenterY + radius * Math.sin(angle);

    const circleX = circleCenterX + radius * Math.cos(angle);
    const circleY = circleCenterY + radius * Math.sin(angle);

    // Draw orbit glow effect
    orbitCtx.beginPath();
    orbitCtx.arc(trailX, trailY, 6, 0, Math.PI * 2);
    orbitCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
    orbitCtx.shadowBlur = 20;
    orbitCtx.shadowColor = 'white';
    orbitCtx.fill();

    // Move DOM element
    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });
};
