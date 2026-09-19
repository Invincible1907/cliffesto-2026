(function () {
  const canvas = document.querySelector(".gallery-starfield");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const pointer = { x: -1000, y: -1000 };
  const stars = [];
  let animationFrame;
  let visible = true;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    stars.length = 0;
    const count = Math.min(1800, Math.max(500, Math.floor((innerWidth * innerHeight) / 700)));
    for (let index = 0; index < count; index += 1) {
      const originX = Math.random() * innerWidth;
      const originY = Math.random() * innerHeight;
      stars.push({
        x: originX,
        y: originY,
        originX,
        originY,
        radius: Math.random() * 1.15 + 0.2,
        alpha: Math.random() * 0.65 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01,
        velocityX: 0,
        velocityY: 0,
      });
    }
  }

  function render(timestamp) {
    if (visible) {
      context.clearRect(0, 0, innerWidth, innerHeight);
      stars.forEach(function (star) {
        const distanceX = star.x - pointer.x;
        const distanceY = star.y - pointer.y;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        const repelRadius = 150;
        const repelRadiusSquared = repelRadius * repelRadius;

        if (distanceSquared < repelRadiusSquared && distanceSquared > 0) {
          const distance = Math.sqrt(distanceSquared);
          const force = (repelRadius - distance) / repelRadius;
          star.velocityX += (distanceX / distance) * force * 0.9;
          star.velocityY += (distanceY / distance) * force * 0.9;
        }

        star.velocityX += (star.originX - star.x) * 0.012;
        star.velocityY += (star.originY - star.y) * 0.012;
        star.velocityX *= 0.9;
        star.velocityY *= 0.9;
        star.x += star.velocityX;
        star.y += star.velocityY;

        const pulse = Math.sin(timestamp * star.speed + star.phase) * 0.16;
        context.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, star.alpha + pulse)})`;
        context.fillRect(star.x, star.y, star.radius, star.radius);
      });
    }
    animationFrame = window.requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("mousemove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener("mouseleave", function () {
    pointer.x = -1000;
    pointer.y = -1000;
  }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });

  const observer = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
  });
  observer.observe(canvas);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render(0);
    window.cancelAnimationFrame(animationFrame);
    return;
  }

  animationFrame = window.requestAnimationFrame(render);
})();
