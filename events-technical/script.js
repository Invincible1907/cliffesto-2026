gsap.registerPlugin(ScrollTrigger);

// ---toggle menu----

function toggleMenu() {
  var menu = document.querySelector('.menu');
  menu.style.right = (menu.style.right === '-100%' || menu.style.right === '') ? '0%' : '-100%';

  gsap.from('.menu-socials', {
    x: '-100%',
    duration: 1
  })
}

// landing animations
function animateElements() {
  // Animation for the left image
  gsap.fromTo('.left-img-container', { x: '-100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 1, ease: 'power2.out' });

  // Animation for the right image
  gsap.fromTo('.right-img-container', { x: '100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 1, ease: 'power2.out' });

  // Animation for the header
  gsap.fromTo('.header', { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' });

  baffle('.header nav a')
    .reveal(1000)
    .set({
        characters: '▒░░░░█░░▒█▓▓░█/░░>▒/▒/▓▒░',
        speed: 150
    });

  gsap.from('.item-container', {
    y: '100%',
    opacity: 0,
    duration: 1,
    stagger: 0.2
  })

}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(animateElements);
});
