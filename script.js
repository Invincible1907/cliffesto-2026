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

const sendEmail = (e) => {
  e.preventDefault();

  // serviceID - templateID - #form - publicKey
  emailjs
    .sendForm(
      "service_68320vw",
      "template_45prikq",
      "#contact-form",
      "JI25sjN6CXmCzq0KC"
    )
    .then(
      () => {
        // Show sent message
        contactMessage.textContent = "Message sent successfully ✅";

        // Remove message after five seconds
        setTimeout(() => {
          contactMessage.textContent = "";
        }, 5000);

        // Clear input fields
        contactForm.reset();
      },
      () => {
        //show error message
        contactMessage.textContent = "Message not sent (service error) ❌";
      }
    );
};

contactForm.addEventListener("submit", sendEmail);
