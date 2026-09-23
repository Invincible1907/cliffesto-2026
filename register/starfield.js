(function () {
  const canvas = document.querySelector(".register-starfield");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const section = canvas.parentElement;
  const touchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const pointer = { x: -1000, y: -1000 };
  const swipe = { active: false, x: -1000, y: -1000, directionX: 0, directionY: 0, strength: 0, targetStrength: 0 };
  let stars = [];
  let visible = false;
  let animationFrame;
  let lastFrame = 0;

  function resize() {
    const ratio = touchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = touchDevice ? Math.min(520, Math.max(300, Math.floor((width * height) / 4000))) : Math.min(3200, Math.max(2400, Math.floor((width * height) / 850)));

    stars = Array.from({ length: count }, function () {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return { x, y, originX: x, originY: y, radius: Math.random() * 1.2 + 0.25, alpha: Math.random() * 0.65 + 0.3, phase: Math.random() * Math.PI * 2, twinkle: Math.random() * 0.04 + 0.01, velocityX: 0, velocityY: 0 };
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
    if (!touchDevice || !event.touches[0]) return;
    const bounds = canvas.getBoundingClientRect();
    swipe.active = true;
    swipe.x = event.touches[0].clientX - bounds.left;
    swipe.y = event.touches[0].clientY - bounds.top;
  }

  function moveSwipe(event) {
    if (!swipe.active || !event.touches[0]) return;
    const bounds = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - bounds.left;
    const y = event.touches[0].clientY - bounds.top;
    const deltaX = x - swipe.x;
    const deltaY = y - swipe.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 1) {
      swipe.x = x;
      swipe.y = y;
      swipe.directionX = deltaX / distance;
      swipe.directionY = deltaY / distance;
      swipe.targetStrength = Math.min(1, swipe.targetStrength + distance / 45);
    }
  }

  function render(timestamp) {
    if (!visible) {
      animationFrame = requestAnimationFrame(render);
      return;
    }
    if (touchDevice && timestamp - lastFrame < 33) {
      animationFrame = requestAnimationFrame(render);
      return;
    }
    lastFrame = timestamp;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    swipe.strength += (swipe.targetStrength - swipe.strength) * 0.12;
    swipe.targetStrength *= 0.94;
    stars.forEach(function (star) {
      const distanceX = star.x - pointer.x;
      const distanceY = star.y - pointer.y;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
      const radius = touchDevice ? 90 : 160;
      if (distanceSquared < radius * radius && distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        const force = (radius - distance) / radius;
        star.velocityX += (distanceX / distance) * force * (touchDevice ? 0.35 : 1.15);
        star.velocityY += (distanceY / distance) * force * (touchDevice ? 0.35 : 1.15);
      }
      if (touchDevice && swipe.strength > 0.01) {
        const swipeX = star.x - swipe.x;
        const swipeY = star.y - swipe.y;
        const swipeDistance = swipeX * swipeX + swipeY * swipeY;
        if (swipeDistance < 13000) {
          const force = (13000 - swipeDistance) / 13000;
          star.velocityX += swipe.directionX * force * swipe.strength * 0.8;
          star.velocityY += swipe.directionY * force * swipe.strength * 0.8;
        }
      }
      star.velocityX += (star.originX - star.x) * 0.012;
      star.velocityY += (star.originY - star.y) * 0.012;
      star.velocityX *= 0.9;
      star.velocityY *= 0.9;
      star.x += star.velocityX;
      star.y += star.velocityY;
      const pulse = touchDevice ? 0 : Math.sin(timestamp * star.twinkle + star.phase) * 0.18;
      context.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, star.alpha + pulse)})`;
      context.fillRect(star.x, star.y, star.radius, star.radius);
    });
    animationFrame = requestAnimationFrame(render);
  }

  resize();
  section.addEventListener("mousemove", updatePointer, { passive: true });
  section.addEventListener("mouseleave", resetPointer, { passive: true });
  section.addEventListener("touchstart", startSwipe, { passive: true });
  section.addEventListener("touchmove", moveSwipe, { passive: true });
  section.addEventListener("touchend", function () { swipe.active = false; swipe.targetStrength = 0; }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
  animationFrame = requestAnimationFrame(render);
})();
