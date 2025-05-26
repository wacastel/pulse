const audio = document.getElementById('audio');
const circle = document.querySelector('.pulse-circle');
const button = document.getElementById('startButton');

const context = new (window.AudioContext || window.webkitAudioContext)();
const source = context.createMediaElementSource(audio);
const analyser = context.createAnalyser();

source.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  let total = 0;
  for (let i = 0; i < bufferLength; i++) {
    total += dataArray[i];
  }
  const average = total / bufferLength;

  const scale = 2 + (average / 256*3);
  circle.style.transform = `scale(${scale})`;
}

button.addEventListener('click', () => {
  button.style.display = 'none';
  circle.style.display = 'block';

  context.resume().then(() => {
    audio.play();
    animate();
  });
});
