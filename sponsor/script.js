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

    elemAnimation();
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(animateElements);
  initializeSponsorStarfield();
});

function initializeSponsorStarfield() {
  const canvas = document.querySelector('.sponsor-starfield');
  if (!canvas) return;

  const section = canvas.parentElement;
  if (!section) return;

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
  let animationFrame = null;
  let lastFrame = 0;
  let isVisible = false;

  function resizeCanvas() {
    const pixelRatio = isTouchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const starCount = isTouchDevice
      ? Math.min(900, Math.max(520, Math.floor((width * height) / 2600)))
      : Math.min(3600, Math.max(1500, Math.floor((width * height) / 850)));

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
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
  }

  function resetPointer() {
    pointer.x = -1000;
    pointer.y = -1000;
  }

  function startSwipe(event) {
    if (!isTouchDevice || !event.touches[0]) return;
    const bounds = canvas.getBoundingClientRect();
    swipe.active = true;
    swipe.x = event.touches[0].clientX - bounds.left;
    swipe.y = event.touches[0].clientY - bounds.top;
  }

  function moveSwipe(event) {
    if (!swipe.active || !event.touches[0]) return;
    const bounds = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - bounds.left;
    const touchY = event.touches[0].clientY - bounds.top;
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
    if (!isVisible) {
      animationFrame = null;
      return;
    }

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
      const repelRadiusSquared = repelRadius * repelRadius;

      if (distanceSquared < repelRadiusSquared && distanceSquared > 0) {
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

      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;
      if (star.y < -4) star.y = height + 4;
      if (star.y > height + 4) star.y = -4;

      const pulse = isTouchDevice ? 0 : Math.sin(timestamp * star.twinkle + star.phase) * 0.18;
      const alpha = Math.max(0.08, star.alpha + pulse);
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.fillRect(star.x, star.y, star.radius, star.radius);
    });

    animationFrame = window.requestAnimationFrame(renderStars);
  }

  resizeCanvas();
  section.addEventListener('mousemove', updatePointer, { passive: true });
  section.addEventListener('mouseleave', resetPointer, { passive: true });
  section.addEventListener('touchstart', startSwipe, { passive: true });
  section.addEventListener('touchmove', moveSwipe, { passive: true });
  section.addEventListener('touchend', endSwipe, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const visibilityObserver = new IntersectionObserver(
    function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && animationFrame === null) {
        animationFrame = window.requestAnimationFrame(renderStars);
      }
    },
    { threshold: 0.01 }
  );
  visibilityObserver.observe(section);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lastFrame = -33;
    renderStars(0);
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    return;
  }
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