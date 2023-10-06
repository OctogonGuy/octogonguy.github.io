const BUBBLE_INTERVAL = 5;
const BUBBLE_DURATION = 2000;

document.querySelector("footer").innerHTML= `
<p>No Copyright - <a href="http://octopusdragon.tech">octopusdragon.tech</a></p>
`;
document.querySelector("header").innerHTML= `
<div class="banner">
  <a href="http://octopusdragon.tech">
    <div class="logo">
      <span class="title">OctopusDragonTech</span>
      <span class="subtitle">~~~~All hail the Octogon~~~~</span>
    </div>
  </a>
</div>

<nav>
  <ul>
  <li><a href="index.html">Home</a></li>
  <li><a href="programs.html">Programs</a></li>
  <li><a href="gallery.html">Cat</a></li>
  <li><a href="colors.html">Color</a></li>
  <li><a href="painting.html">Picasso</a></li>
  <li><a href="animation.html">Animation</a></li>
  <li><a href="portfolio.html">Portfolio</a></li>
  </ul>
</nav>
`;

const backgrounds = [];
for (let i = 1; i <= 9; i++) {
  backgrounds.push(backgrounds[backgrounds.length] = "images/background-" + i + ".png");
};

function randomBackground() {
  var background =  backgrounds[Math.floor(Math.random() * backgrounds.length)];
  return background;
}

document.body.style.backgroundImage = "url(" + randomBackground() + ")";

let wait = false;
let lastPosX = 0;
let lastPosY = 0;

const bubble_pictures = [];
for (let i = 1; i <= 3; i++) {
  bubble_pictures.push(bubble_pictures[bubble_pictures.length] = "images/bubble-" + i + ".png");
};

addEventListener("mousemove", (event) => {
  // Likelihood to execute based on distance (higher distance = greater chance)
  let differenceX = Math.abs(event.pageX - lastPosX);
  let differenceY = Math.abs(event.pageY - lastPosY);
  let distance = Math.sqrt(Math.pow(differenceX, 2) + Math.pow(differenceY, 2));
  let speed = distance / BUBBLE_INTERVAL * 1000;  // Pixels per second

  lastPosX = event.pageX;
  lastPosY = event.pageY;

  let dontGo = Math.random() * 200000 > Math.pow(speed, 1.5);
  if (wait || dontGo) return;

  let bubble = document.createElement("bubble");

  bubble.style.pointerEvents = "none";
  bubble.style.animationDuration = BUBBLE_DURATION + "ms";
  bubble.style.animationFillMode = "forwards";

  setTimeout(() => {
    bubble.remove();
  }, BUBBLE_DURATION);
  document.body.appendChild(bubble);

  bubble.style.backgroundImage = "url(" + bubble_pictures[Math.floor(Math.random() * bubble_pictures.length)];

  let minSize = parseInt(getComputedStyle(bubble).getPropertyValue("--min-size"));
  let maxSize = parseInt(getComputedStyle(bubble).getPropertyValue("--max-size"));
  let sizeUnits = getComputedStyle(bubble).getPropertyValue("--min-size").replace(minSize, "");
  let size = minSize + (Math.random() * (maxSize - minSize));
  bubble.style.width = size + sizeUnits;
  bubble.style.height = size + sizeUnits;

  let x = event.pageX - (size / 2) + (Math.random() * 2 - 1) * size / 2;
  let y = event.pageY - (size / 2) + (Math.random() * 2 - 1) * size / 2;
  bubble.style.left = x + "px";
  bubble.style.top = y + "px";
  bubble.style.zIndex = "9999"; // So that bubbles aren't covered by anything

  let translateXMidrange = parseInt(getComputedStyle(bubble).getPropertyValue("--translate-x-midrange"));
  let translateXRange = parseInt(getComputedStyle(bubble).getPropertyValue("--translate-x-range"));
  let translateXUnits = getComputedStyle(bubble).getPropertyValue("--translate-x-midrange").replace(translateXMidrange, "");
  let translateX = translateXMidrange + (Math.random() * 2 - 1) * translateXRange;
  let translateYMidrange = parseInt(getComputedStyle(bubble).getPropertyValue("--translate-y-midrange"));
  let translateYRange = parseInt(getComputedStyle(bubble).getPropertyValue("--translate-y-range"));
  let translateYUnits = getComputedStyle(bubble).getPropertyValue("--translate-y-midrange").replace(translateYMidrange, "");
  let translateY = translateYMidrange + (Math.random() * 2 - 1) * translateYRange;
  bubble.style.setProperty("--translate-x", translateX + translateXUnits);
  bubble.style.setProperty("--translate-y", translateY + translateYUnits);

  wait = true;
  setTimeout(() => {
    wait = false;
  }, BUBBLE_INTERVAL);
});