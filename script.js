gsap.registerPlugin(ScrollTrigger);

// toglle menu

function toggleMenu() {
  var menu = document.querySelector(".menu");
  menu.style.right =
    menu.style.right === "-100%" || menu.style.right === "" ? "0%" : "-100%";

  gsap.from(".menu-socials", {
    x: "-100%",
    duration: 1,
  });
}

document.addEventListener("click", function (event) {
  var menu = document.querySelector(".menu");
  var menuIcon = document.querySelector(".menu-icon");
  var menuIsOpen = menu && menu.style.right === "0%";

  if (menuIsOpen && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
    menu.style.right = "-100%";
  }
});

// main JS

// landing animations
function animateElements() {
  // Animation for the header
  gsap.fromTo(
    ".header",
    { y: "-100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
  );

  gsap.fromTo(
    ".landing-page-img",
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
  );

  baffle(".title h1").reveal(500).set({
    characters: "▒░░░░█░░▒█▓▓░█/░░>▒/▒/▓▒░",
    speed: 150,
  });

  baffle(".header nav a").reveal(1000).set({
    characters: "▒░░░░█░░▒█▓▓░█/░░>▒/▒/▓▒░",
    speed: 150,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(animateElements);
  initializeStarfield();
});

function initializeStarfield() {
  const canvases = document.querySelectorAll(
    ".landing-starfield, .section-starfield"
  );
  if (!canvases.length) return;

  canvases.forEach(function (canvas) {
    initializeStarfieldCanvas(canvas);
  });
}

function initializeStarfieldCanvas(canvas) {
  const section = canvas.parentElement;
  if (!section) return;

  const context = canvas.getContext("2d");
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
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
  let isVisible = false;

  function resizeCanvas() {
    const pixelRatio = isTouchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const starCount = isTouchDevice
      ? Math.min(320, Math.max(180, Math.floor((width * height) / 6500)))
      : Math.min(1800, Math.max(1400, Math.floor((width * height) / 1400)));
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
      animationFrame = window.requestAnimationFrame(renderStars);
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
  section.addEventListener("mousemove", updatePointer, { passive: true });
  section.addEventListener("mouseleave", resetPointer, { passive: true });
  section.addEventListener("touchstart", startSwipe, { passive: true });
  section.addEventListener("touchmove", moveSwipe, { passive: true });
  section.addEventListener("touchend", endSwipe, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });

  const visibilityObserver = new IntersectionObserver(
    function (entries) {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.01 }
  );
  visibilityObserver.observe(section);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lastFrame = -33;
    renderStars(0);
    window.cancelAnimationFrame(animationFrame);
    return;
  }

  animationFrame = window.requestAnimationFrame(renderStars);
}

document.addEventListener("mousemove", parallax);

function parallax(e) {
  const landing_img = document.querySelector(".landing-page-img");
  const title = document.querySelector(".title");
  if (!landing_img) return;

  var x = (e.clientX * -2) / 250;
  var y = (e.clientY * -2) / 250;

  landing_img.style.transform = `translateX(${x}px) translateY(${y}px)`;
  title.style.transform = `translateX(${-x}px) translateY(${-y}px)`;
}

// Scroll-triggered animations for the home section
gsap.to(".title", {
  y: "-100px",
  opacity: "0",
  scrollTrigger: {
    trigger: ".landing-page",
    start: "bottom bottom",
    end: "bottom top",
    scrub: 1,
  },
  force3D: true,
});
gsap.to(".landing-page-img", {
  y: "100px",
  opacity: "0",
  scrollTrigger: {
    trigger: ".landing-page",
    start: "bottom bottom",
    end: "bottom top",
    scrub: 1,
  },
  force3D: true,
});

// Scroll-triggered animations for the about section
gsap.from(".about-left-section", {
  x: "-100%",
  scrollTrigger: {
    trigger: ".about",
    start: "top center",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".about-right-section", {
  y: "100%",
  scrollTrigger: {
    trigger: ".about",
    start: "top center",
    end: "center center",
    scrub: 1,
  },
});

// Scroll-triggered animations for the events section
gsap.from(".event-left-section", {
  x: "-100%",
  scrollTrigger: {
    trigger: ".events",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".event-right-section", {
  y: "100%",
  scrollTrigger: {
    trigger: ".events",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});

// Scroll-triggered animations for about-club section

gsap.to(".about-club-bg-container img", {
  scale: "1.5",
  scrollTrigger: {
    trigger: ".about-club",
    start: "top center",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".about-club-left-section", {
  y: "100%",
  scrollTrigger: {
    trigger: ".about-club",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".about-club-right-section", {
  y: "100%",
  scrollTrigger: {
    trigger: ".about-club",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});

// Scroll-triggered animations for the navikarnam section

gsap.from(".navi-row", {
  y: "100%",
  scrollTrigger: {
    trigger: ".navikarnam",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".navi-right-section", {
  x: "-100%",
  scrollTrigger: {
    trigger: ".navikarnam",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});

//active class

document.addEventListener("DOMContentLoaded", function () {
  // Get all section elements
  var sections = document.querySelectorAll("section");
  // Get all anchor tags in the menu
  var menuItems = document.querySelectorAll(".menu-home a");

  // Function to check which section is in the viewport
  function updateActiveSection() {
    sections.forEach(function (section, index) {
      var rect = section.getBoundingClientRect();
      var offset = window.innerHeight * 0.4; // Adjust this value as needed

      if (rect.top < offset && rect.bottom >= offset) {
        // Add "active" class to the corresponding menu item
        menuItems[index].classList.add("active");
      } else {
        // Remove "active" class from other menu items
        menuItems[index].classList.remove("active");
      }
    });
  }
  window.addEventListener("scroll", updateActiveSection);
  updateActiveSection();
});

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById("contact-form"),
  contactMessage = document.getElementById("contact-message");
const EMAILJS_PUBLIC_KEY = "smHhUVnw6AJ9zVvt5";
const EMAILJS_SERVICE_ID = "service_u64zf7x";
const EMAILJS_TEMPLATE_ID = "template_zwpymj1";

if (contactForm && contactMessage && typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const fallbackToMailClient = () => {
  if (!contactForm) return false;

  const name = contactForm.querySelector('#name')?.value?.trim() || "";
  const email = contactForm.querySelector('#email')?.value?.trim() || "";
  const subject = contactForm.querySelector('#subject')?.value?.trim() || "Cliffesto Query";
  const message = contactForm.querySelector('#message')?.value?.trim() || "";

  const body = [
    message,
    "",
    "-".repeat(30),
    `Name: ${name}`,
    `Email: ${email}`,
  ].join("\n");

  const mailtoLink = `mailto:cliffesto@nituk.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
  contactForm.reset();
  return true;
};

const sendEmail = (e) => {
  e.preventDefault();

  if (!contactForm || !contactMessage) {
    return;
  }

  const canUseEmailJs =
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY &&
    EMAILJS_SERVICE_ID &&
    EMAILJS_TEMPLATE_ID;

  if (!canUseEmailJs) {
    const fallbackWorked = fallbackToMailClient();
    contactMessage.textContent = fallbackWorked
      ? "Email service is unavailable, so your mail app has been opened to send the message."
      : "Email service is unavailable. Please email cliffesto@nituk.ac.in directly.";
    return;
  }

  const payload = {
    user_name: contactForm.querySelector('#name')?.value?.trim() || "",
    user_email: contactForm.querySelector('#email')?.value?.trim() || "",
    user_subject: contactForm.querySelector('#subject')?.value?.trim() || "",
    user_message: contactForm.querySelector('#message')?.value?.trim() || "",
    name: contactForm.querySelector('#name')?.value?.trim() || "",
    email: contactForm.querySelector('#email')?.value?.trim() || "",
    subject: contactForm.querySelector('#subject')?.value?.trim() || "",
    message: contactForm.querySelector('#message')?.value?.trim() || "",
    to_email: "cliffesto@nituk.ac.in"
  };

  contactMessage.textContent = "Sending...";

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload)
    .then(
      () => {
        contactMessage.textContent = "Message sent successfully ✅";

        setTimeout(() => {
          contactMessage.textContent = "";
        }, 5000);

        contactForm.reset();
      },
      (error) => {
        console.error("EmailJS failed to send the contact form:", error);
        contactMessage.textContent =
          "Message not sent. Please check your details and try again, or email cliffesto@nituk.ac.in directly. ❌";
      }
    );
};

if (contactForm) {
  contactForm.addEventListener("submit", sendEmail);
}
