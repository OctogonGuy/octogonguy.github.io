const BUBBLE_INTERVAL = 50;
const BUBBLE_DURATION = 1000;

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

let wait = false;

addEventListener("mousemove", (event) => {
  let dontGo = Math.random() < 0.5;
  if (wait || dontGo) return;

  let bubble = document.createElement("bubble");

  bubble.style.pointerEvents = "none";
  bubble.style.animationDuration = BUBBLE_DURATION + "ms";
  bubble.style.animationFillMode = "forwards";

  bubble.style.setProperty("--translateXOffset", ((Math.random() * 2 - 1) * 100) + "%");

  setTimeout(() => {
    bubble.remove();
  }, BUBBLE_DURATION);
  document.body.appendChild(bubble);

  let x = event.pageX - (bubble.offsetWidth / 2) + (Math.random() * 2 - 1) * bubble.offsetWidth / 2;
  let y = event.pageY - (bubble.offsetHeight / 2) + (Math.random() * 2 - 1) * bubble.offsetHeight / 2;
  bubble.style.left = x + "px";
  bubble.style.top = y + "px";

  wait = true;
  setTimeout(() => {
    wait = false;
  }, BUBBLE_INTERVAL);
});