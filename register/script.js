// -----togle menu-----

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

  gsap.fromTo(
    ".content",
    { opacity: 0 },
    { opacity: 1, duration: 0.35, ease: "power1.out" }
  );

}

document.addEventListener("DOMContentLoaded", function () {
  requestAnimationFrame(animateElements);
});
