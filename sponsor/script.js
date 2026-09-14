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
  initializeSponsorStarfield();
});

function initializeSponsorStarfield() {
  const canvas = document.querySelector('.sponsor-starfield');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const pointer = { x: -1000, y: -1000 };
  const swipe = {
    active: false,
    x: -1000,
    y: -1000,
    directionX: 0,
    directionY: 0,
    targetDirectionX: 0,
    targetDirectionY: 0,
    strength: 0,
    targetStrength: 0,
  };
  let stars = [];
  let animationFrame;
  let lastFrame = 0;

  function resizeCanvas() {
    const ratio = isTouchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const starCount = isTouchDevice
      ? Math.min(520, Math.max(300, Math.floor((width * height) / 4000)))
      : Math.min(3200, Math.max(2400, Math.floor((width * height) / 850)));
    stars = Array.from({ length: starCount }, function () {
      const originX = Math.random() * width;
      const originY = Math.random() * height;
      return {
        x: originX,
        y: originY,
        originX,
        originY,
        radius: Math.random() * 1.2 + 0.25,
        alpha: Math.random() * 0.65 + 0.3,
        twinkle: Math.random() * 0.04 + 0.01,
        phase: Math.random() * Math.PI * 2,
        velocityX: 0,
        velocityY: 0,
      };
    });
  }

  function updatePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }

  function resetPointer() {
    pointer.x = -1000;
    pointer.y = -1000;
  }

  function startSwipe(event) {
    if (!isTouchDevice || !event.touches[0]) return;
    swipe.active = true;
    swipe.x = event.touches[0].clientX;
    swipe.y = event.touches[0].clientY;
  }

  function moveSwipe(event) {
    if (!swipe.active || !event.touches[0]) return;
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - swipe.x;
    const deltaY = touchY - swipe.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 1) {
      swipe.x = touchX;
      swipe.y = touchY;
      swipe.targetDirectionX = deltaX / distance;
      swipe.targetDirectionY = deltaY / distance;
      swipe.targetStrength = Math.min(1, swipe.targetStrength + distance / 45);
    }
  }

  function endSwipe() {
    swipe.active = false;
    swipe.targetStrength = 0;
  }

  function renderStars(timestamp) {
    if (isTouchDevice && timestamp - lastFrame < 33) {
      animationFrame = window.requestAnimationFrame(renderStars);
      return;
    }
    lastFrame = timestamp;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    if (isTouchDevice) {
      swipe.directionX += (swipe.targetDirectionX - swipe.directionX) * 0.18;
      swipe.directionY += (swipe.targetDirectionY - swipe.directionY) * 0.18;
      swipe.strength += (swipe.targetStrength - swipe.strength) * 0.12;
      swipe.targetStrength *= 0.94;
    }

    stars.forEach(function (star) {
      const distanceX = star.x - pointer.x;
      const distanceY = star.y - pointer.y;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
      const repelRadius = isTouchDevice ? 90 : 160;

      if (distanceSquared < repelRadius * repelRadius && distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        const force = (repelRadius - distance) / repelRadius;
        star.velocityX += (distanceX / distance) * force * (isTouchDevice ? 0.35 : 1.15);
        star.velocityY += (distanceY / distance) * force * (isTouchDevice ? 0.35 : 1.15);
      }

      if (isTouchDevice && swipe.strength > 0.01) {
        const swipeDistanceX = star.x - swipe.x;
        const swipeDistanceY = star.y - swipe.y;
        const swipeDistanceSquared = swipeDistanceX * swipeDistanceX + swipeDistanceY * swipeDistanceY;

        if (swipeDistanceSquared < 13000) {
          const swipeForce = (13000 - swipeDistanceSquared) / 13000;
          star.velocityX += swipe.directionX * swipeForce * swipe.strength * 0.8;
          star.velocityY += swipe.directionY * swipeForce * swipe.strength * 0.8;
        }
      }

      star.velocityX += (star.originX - star.x) * 0.012;
      star.velocityY += (star.originY - star.y) * 0.012;
      star.velocityX *= 0.9;
      star.velocityY *= 0.9;
      star.x += star.velocityX;
      star.y += star.velocityY;

      const pulse = isTouchDevice ? 0 : Math.sin(timestamp * star.twinkle + star.phase) * 0.18;
      context.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, star.alpha + pulse)})`;
      context.fillRect(star.x, star.y, star.radius, star.radius);
    });
    animationFrame = window.requestAnimationFrame(renderStars);
  }

  resizeCanvas();
  window.addEventListener('mousemove', updatePointer, { passive: true });
  window.addEventListener('mouseout', function (event) {
    if (!event.relatedTarget) resetPointer();
  }, { passive: true });
  window.addEventListener('touchstart', startSwipe, { passive: true });
  window.addEventListener('touchmove', moveSwipe, { passive: true });
  window.addEventListener('touchend', endSwipe, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });
  animationFrame = window.requestAnimationFrame(renderStars);
  window.addEventListener('pagehide', function () {
    window.cancelAnimationFrame(animationFrame);
  }, { once: true });
}

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