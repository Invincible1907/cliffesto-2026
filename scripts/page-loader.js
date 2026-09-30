(function () {
  const transitionKey = "cliffesto-page-transition";
  const script = document.currentScript;
  const projectRoot = new URL("../", script ? script.src : window.location.href);
  const homePath = new URL("index.html", projectRoot).pathname;
  let loader = null;
  let canvas = null;
  let animationFrame = null;
  let shownAt = 0;
  let hideTimer = null;
  let logoGrains = [];
  let enclosureGrains = [];
  let expansionRings = [];
  let ambientGrains = [];
  let stars = [];
  let formationStart = 0;
  let lastFrameTime = 0;
  let performanceProfile = { quality: 1, pixelRatio: 1, reducedMotion: false };
  let listenersAttached = false;

  function readPendingTransition() {
    try {
      const pending = JSON.parse(sessionStorage.getItem(transitionKey) || "null");
      sessionStorage.removeItem(transitionKey);
      const age = pending && Date.now() - pending.startedAt;
      const target = pending && new URL(pending.target, window.location.href);
      return Boolean(
        Number.isFinite(age) &&
        age >= 0 &&
        age < 30000 &&
        target &&
        target.origin === window.location.origin
      );
    } catch (error) {
      return false;
    }
  }

  const isInternalTransition = readPendingTransition();
  if (isInternalTransition) document.documentElement.classList.add("page-transition-pending");

  function getMinimumDuration() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection && connection.effectiveType;
    let duration = effectiveType === "slow-2g" ? 1900 : effectiveType === "2g" ? 1600 : effectiveType === "3g" ? 1250 : 850;

    if (connection && connection.rtt > 500) duration = Math.max(duration, 1700);
    if (connection && connection.downlink > 0 && connection.downlink < 0.6) duration = Math.max(duration, 1600);
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) duration += 250;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) duration += 200;
    if (connection && connection.saveData) duration += 250;

    return Math.min(duration, 2500);
  }

  function ensureLoader() {
    if (loader) return;
    loader = document.getElementById("loading-screen");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "loading-screen";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-live", "polite");
      loader.setAttribute("aria-label", "Loading Cliffesto");
      loader.innerHTML = '<div class="loader-shell"><canvas id="loader-canvas" aria-hidden="true"></canvas></div>';
      document.body.prepend(loader);
    }
    canvas = loader.querySelector("#loader-canvas");
  }

  function themeColor(position, alpha) {
    const mix = (Math.sin(position) + 1) / 2;
    const red = Math.round(157 * (1 - mix));
    const green = Math.round(255 * mix);
    const blue = Math.round(198 * (1 - mix) + 237 * mix);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function getPerformanceProfile(width, height) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const limitedMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    const limitedCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    let quality = coarsePointer || width < 600 ? 0.75 : 1;

    if (limitedMemory || limitedCores) quality = Math.min(quality, 0.65);
    if (connection && connection.saveData) quality = Math.min(quality, 0.55);
    if (width * height < 180000) quality = Math.min(quality, 0.7);

    return {
      quality,
      pixelRatio: Math.min(window.devicePixelRatio || 1, quality < 0.65 ? 1 : quality < 0.85 ? 1.25 : 1.5),
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  }

  function buildParticles(width, height) {
    const quality = performanceProfile.quality;
    const area = width * height;
    const starCount = Math.round(Math.max(60, Math.min(180, area / 3000)) * quality);
    const grainCount = Math.round(Math.max(70, Math.min(280, area / 1700)) * quality);
    stars = Array.from({ length: starCount }, function () {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.45,
        alpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
      };
    });
    ambientGrains = Array.from({ length: grainCount }, function () {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.35,
        alpha: Math.random() * 0.13 + 0.025,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const image = new Image();
    image.onload = function () {
      const logoWidth = Math.min(width * 0.42, height * 0.58);
      const logoHeight = logoWidth * image.naturalHeight / image.naturalWidth;
      const mask = document.createElement("canvas");
      mask.width = Math.max(1, Math.round(logoWidth));
      mask.height = Math.max(1, Math.round(logoHeight));
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      maskContext.drawImage(image, 0, 0, mask.width, mask.height);
      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;

      logoGrains = [];
      const sampleStep = quality < 0.65 ? 4 : 3;
      for (let y = 0; y < mask.height; y += sampleStep) {
        for (let x = 0; x < mask.width; x += sampleStep) {
          const alpha = pixels[(y * mask.width + x) * 4 + 3];
          if (alpha > 90) {
            logoGrains.push({
              x: Math.random() * width,
              y: Math.random() * height,
              targetX: width / 2 - mask.width / 2 + x,
              targetY: height / 2 - mask.height / 2 + y,
              size: Math.random() * 1.2 + 0.65,
              alpha: alpha / 255,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      const logoRadius = Math.hypot(mask.width / 2, mask.height / 2) + 18;
      const maxRadius = Math.min(width, height) * 0.47;
      const enclosureCount = Math.max(150, Math.round(420 * quality));
      enclosureGrains = Array.from({ length: enclosureCount }, function (_, index) {
        return {
          angle: index / enclosureCount * Math.PI * 2,
          radius: logoRadius + (Math.random() - 0.5) * 2.4,
          size: Math.random() * 1.35 + 0.55,
          alpha: Math.random() * 0.4 + 0.4,
          phase: Math.random() * Math.PI * 2,
        };
      });
      const ringCount = Math.max(2, Math.round(4 * quality));
      const ringParticleCount = Math.max(56, Math.round(120 * quality));
      expansionRings = Array.from({ length: ringCount }, function (_, ringIndex) {
        return {
          startRadius: logoRadius + 9,
          span: Math.max(12, maxRadius - logoRadius - 9),
          phase: ringIndex / ringCount,
          particles: Array.from({ length: ringParticleCount }, function (_, index) {
            return {
              angle: index / ringParticleCount * Math.PI * 2 + (Math.random() - 0.5) * 0.025,
              size: Math.random() * 1.2 + 0.4,
              alpha: Math.random() * 0.45 + 0.3,
              phase: Math.random() * Math.PI * 2,
            };
          }),
        };
      });
      formationStart = performance.now();
      if (loader && !loader.classList.contains("hidden")) {
        if (performanceProfile.reducedMotion) {
          renderFrame(performance.now());
        } else if (animationFrame === null && !document.hidden) {
          animationFrame = requestAnimationFrame(renderFrame);
        }
      }
    };
    image.src = new URL("CDN_Images/images/logo1.png", projectRoot).href;
  }

  function renderFrame(timestamp) {
    if (!canvas || !loader || loader.classList.contains("hidden")) {
      animationFrame = null;
      return;
    }
    if (!performanceProfile.reducedMotion && performanceProfile.quality < 0.85 && timestamp - lastFrameTime < 1000 / 30) {
      animationFrame = requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime = timestamp;
    const context = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    stars.forEach(function (star) {
      const pulse = 0.45 + (Math.sin(timestamp * 0.003 + star.phase) + 1) * 0.25;
      context.fillStyle = `rgba(255, 255, 255, ${star.alpha * pulse})`;
      context.beginPath();
      context.arc(star.x + Math.sin(timestamp * 0.001 + star.phase) * 2, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    });

    ambientGrains.forEach(function (grain) {
      const shimmer = 0.7 + Math.sin(timestamp * 0.002 + grain.phase) * 0.3;
      context.fillStyle = `rgba(217, 241, 255, ${grain.alpha * shimmer})`;
      context.fillRect(grain.x, grain.y, grain.size, grain.size);
    });

    if (logoGrains.length) {
      const progress = performanceProfile.reducedMotion
        ? 1
        : Math.min(1, (timestamp - formationStart) / 1100);
      const formation = 1 - Math.pow(1 - progress, 3);
      logoGrains.forEach(function (grain) {
        const x = grain.x + (grain.targetX - grain.x) * formation;
        const y = grain.y + (grain.targetY - grain.y) * formation;
        const shimmer = 0.75 + Math.sin(timestamp * 0.003 + grain.phase) * 0.25;
        context.fillStyle = `rgba(238, 250, 255, ${grain.alpha * shimmer})`;
        context.fillRect(x, y, grain.size, grain.size);
      });

      enclosureGrains.forEach(function (grain) {
        const shimmer = 0.65 + Math.sin(timestamp * 0.002 + grain.phase) * 0.35;
        context.fillStyle = themeColor(grain.angle + timestamp * 0.0002, grain.alpha * shimmer);
        context.fillRect(width / 2 + Math.cos(grain.angle) * grain.radius, height / 2 + Math.sin(grain.angle) * grain.radius, grain.size, grain.size);
      });

      expansionRings.forEach(function (ring) {
        const progress = (timestamp * 0.00012 + ring.phase) % 1;
        const radius = ring.startRadius + progress * ring.span;
        ring.particles.forEach(function (particle) {
          const shimmer = 0.65 + Math.sin(timestamp * 0.003 + particle.phase) * 0.35;
          const alpha = particle.alpha * shimmer * (1 - progress);
          context.fillStyle = themeColor(particle.angle + timestamp * 0.0002, alpha);
          context.fillRect(width / 2 + Math.cos(particle.angle) * radius, height / 2 + Math.sin(particle.angle) * radius, particle.size, particle.size);
        });
      });
    }

    if (!performanceProfile.reducedMotion && !document.hidden) {
      animationFrame = requestAnimationFrame(renderFrame);
    } else {
      animationFrame = null;
    }
  }

  function resizeCanvas() {
    if (!canvas || !loader || loader.classList.contains("hidden")) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    performanceProfile = getPerformanceProfile(width, height);
    canvas.width = Math.round(width * performanceProfile.pixelRatio);
    canvas.height = Math.round(height * performanceProfile.pixelRatio);
    canvas.getContext("2d").setTransform(performanceProfile.pixelRatio, 0, 0, performanceProfile.pixelRatio, 0, 0);
    buildParticles(width, height);

    if (performanceProfile.reducedMotion) {
      renderFrame(performance.now());
    } else if (!document.hidden && animationFrame === null) {
      animationFrame = requestAnimationFrame(renderFrame);
    }
  }

  function startAnimation() {
    ensureLoader();
    if (!canvas) return;
    if (!listenersAttached) {
      window.addEventListener("resize", resizeCanvas, { passive: true });
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (animationFrame !== null) cancelAnimationFrame(animationFrame);
          animationFrame = null;
        } else if (loader && !loader.classList.contains("hidden")) {
          if (performanceProfile.reducedMotion) {
            renderFrame(performance.now());
          } else if (animationFrame === null) {
            animationFrame = requestAnimationFrame(renderFrame);
          }
        }
      });
      listenersAttached = true;
    }
    resizeCanvas();
  }

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("hidden");
    document.documentElement.classList.remove("page-transition-pending");
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }

  function showLoader(waitForPageLoad) {
    ensureLoader();
    clearTimeout(hideTimer);
    shownAt = performance.now();
    loader.classList.remove("hidden");
    document.documentElement.classList.remove("page-transition-pending");
    document.body.classList.add("loading");
    startAnimation();

    if (!waitForPageLoad) return;
    function finishWhenReady() {
      const remaining = Math.max(0, getMinimumDuration() - (performance.now() - shownAt));
      hideTimer = setTimeout(hideLoader, remaining);
    }
    if (document.readyState === "complete") {
      finishWhenReady();
    } else {
      window.addEventListener("load", finishWhenReady, { once: true });
    }
  }

  function storeTransition(target) {
    try {
      sessionStorage.setItem(transitionKey, JSON.stringify({ target: target.href, startedAt: Date.now() }));
    } catch (error) {
      return;
    }
  }

  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download") || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || target.href === window.location.href) return;
    if (target.pathname === window.location.pathname && target.search === window.location.search && target.hash) return;

    storeTransition(target);
    showLoader(false);
  }, true);

  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.target === "_blank" || event.defaultPrevented) return;
    const target = new URL(form.action || window.location.href, window.location.href);
    if (target.origin !== window.location.origin) return;
    storeTransition(target);
    showLoader(false);
  }, true);

  function initialize() {
    const isHomePage = window.location.pathname === homePath || window.location.pathname === projectRoot.pathname;
    if (isInternalTransition || isHomePage) showLoader(true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    try {
      sessionStorage.removeItem(transitionKey);
    } catch (error) {
      return;
    }
    hideLoader();
  });
})();