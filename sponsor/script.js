gsap.registerPlugin(ScrollTrigger);


// -----togle menu-----

function toggleMenu() {
  var menu = document.querySelector('.menu');
  menu.style.right = (menu.style.right === '0%' || menu.style.right === '') ? '-100%' : '0%';

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
  
    elemAnimation();
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(animateElements);
});

function elemAnimation() {
  gsap.from('.register-content', {
    x: '-100%',
    opacity: 0,
    duration:1
  })

  gsap.from('.wrapper', {
    y: '100%',
    opacity: 0,
    duration:1
  })
}