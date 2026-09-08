gsap.registerPlugin(ScrollTrigger);

// ---toggle menu----

function toggleMenu() {
  var menu = document.querySelector(".menu");
  menu.style.right =
    menu.style.right === "-100%" || menu.style.right === "" ? "0%" : "-100%";

  gsap.from(".menu-socials", {
    x: "-100%",
    duration: 1,
  });
}

// landing animations
function animateElements() {
  // Animation for the header
  gsap.fromTo(
    ".header",
    { y: "-100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
  );

  baffle(".header nav a").reveal(1000).set({
    characters: "▒░░░░█░░▒█▓▓░█/░░>▒/▒/▓▒░",
    speed: 150,
  });

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
let lastPosition = items.length - 1;
let firstPosition = 0;
let active = 0;

nextBtn.onclick = () => {
  active = active + 1;
  setSlider();
};
prevBtn.onclick = () => {
  active = active - 1;
  setSlider();
};
const setSlider = () => {
  let oldActive = document.querySelector(".slider .list .item.active");
  if (oldActive) oldActive.classList.remove("active");
  items[active].classList.add("active");
  //
  nextBtn.classList.remove("d-none");
  prevBtn.classList.remove("d-none");
  if (active == lastPosition) nextBtn.classList.add("d-none");
  if (active == firstPosition) prevBtn.classList.add("d-none");
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
