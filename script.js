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
});

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

// Scroll-triggered animations for the contact section
gsap.to(".bg-image-container img", {
  scale: "1.1",
  scrollTrigger: {
    trigger: ".contact",
    start: "top center",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".contact-left-section", {
  x: "-100%",
  scrollTrigger: {
    trigger: ".contact",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});
gsap.from(".contact-right-section", {
  y: "100%",
  scrollTrigger: {
    trigger: ".contact",
    start: "top bottom",
    end: "center center",
    scrub: 1,
  },
});

//scrol-triggered animations for the footer section
gsap.from("footer", {
  y: "20%",
  opacity: "0",
  scrollTrigger: {
    trigger: ".footer",
    start: "top bottom",
    end: "bottom bottom",
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
          "Message not sent. Please try again later or email cliffesto@nituk.ac.in directly. ❌";
      }
    );
};

if (contactForm) {
  contactForm.addEventListener("submit", sendEmail);
}
