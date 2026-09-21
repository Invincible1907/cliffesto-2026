gsap.registerPlugin(ScrollTrigger);

// Navigation is handled by the shared navbar script.
// Keep the event page from overriding the global quick-access toggle.

// landing animations
function animateElements() {
  // Animation for the header
  gsap.fromTo(
    ".header",
    { y: "-100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
  );

  gsap.fromTo(
    ".card",
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(animateElements);
});

$(".card").hover(function () {
  $(".card").removeClass("active");
  $(this).addClass("active");
});

let items = document.querySelectorAll(".slider .list .item");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let active = 0;

nextBtn.onclick = () => {
  active = (active + 1) % items.length;
  setSlider();
};
prevBtn.onclick = () => {
  active = (active - 1 + items.length) % items.length;
  setSlider();
};
const setSlider = () => {
  let oldActive = document.querySelector(".slider .list .item.active");
  if (oldActive) oldActive.classList.remove("active");
  items[active].classList.add("active");
};
setSlider();

// set diameter
const setDiameter = () => {
  let slider = document.querySelector(".slider");
  let widthSlider = slider.offsetWidth;
  let heightSlider = slider.offsetHeight;
  let diameter = Math.sqrt(
    Math.pow(widthSlider, 2) + Math.pow(heightSlider, 2)
  );
  document.documentElement.style.setProperty("--diameter", diameter + "px");
};
setDiameter();
window.addEventListener("resize", () => {
  setDiameter();
});
