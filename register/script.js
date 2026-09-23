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
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1 }
  );

  gsap.fromTo(
    ".accomodation",
    { y: "500%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1 }
  );

  elemAnimation();
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(animateElements);

  var registrationNote = document.querySelector(".registration-note");

  if (!registrationNote || !("IntersectionObserver" in window)) {
    if (registrationNote) registrationNote.classList.add("is-visible");
    return;
  }

  var noteObserver = new IntersectionObserver(
    function (entries, observer) {
      if (entries[0].isIntersecting) {
        registrationNote.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.25 }
  );

  noteObserver.observe(registrationNote);
});
