(function () {
  const script = document.currentScript || document.querySelector('script[src*="navbar.js"]');
  if (!script) return;

  const root = new URL("../", script.src);
  const page = window.location.pathname;

  const links = [
    ["HOME", "index.html"],
    ["EVENTS", "events/events.html"],
    ["REGISTER", "register/register.html"],
    ["CONTACT", "contact/contact.html"],
  ];
  const menuLinks = [
    ["HOME", "index.html"],
    ["EVENTS", "events/events.html"],
    ["CONTACT", "contact/contact.html"],
    ["REGISTER", "register/register.html"],
    ["SPONSOR", "sponsor/sponsor.html"],
    ["EVENT GALLERY", "past-events.html"],
  ];

  function url(path) {
    return new URL(path, root).href;
  }

  function createLink(label, path) {
    const link = document.createElement("a");
    link.href = url(path);
    link.textContent = label;
    return link;
  }

  function isCurrent(path) {
    const target = new URL(path, root);
    return page === target.pathname && window.location.hash === target.hash;
  }

  function renderNavbar() {
    const oldHeader = document.querySelector(".header");
    if (!oldHeader) return;

    const header = document.createElement("header");
    header.className = "header";
    header.innerHTML = `
      <div class="logo-container">
        <a href="${url("index.html")}" aria-label="Go to Cliffesto homepage">
          <img src="${url("CDN_Images/images/logo1.png")}" alt="Cliffesto" />
        </a>
        <span class="collab-separator" aria-hidden="true">X</span>
        <img class="collab-logo" src="${url("CDN_Images/images/image.png")}" alt="Mood Indigo 2026" />
      </div>
      <nav class="navbar-items" aria-label="Primary navigation"></nav>
      <button class="bx bx-menu menu-icon" type="button" aria-label="Open navigation" aria-expanded="false"></button>
    `;
    const navigation = header.querySelector(".navbar-items");
    links.forEach(function (entry) {
      navigation.appendChild(createLink(entry[0], entry[1]));
    });

    const menu = document.createElement("div");
    menu.className = "menu quick-access";
    menu.setAttribute("aria-hidden", "true");
    menu.innerHTML = `
      <div class="quick-access-content">
        <div class="quick-access-head">
          <img src="${url("CDN_Images/images/logo1.png")}" alt="Cliffesto" />
          <button class="quick-access-close" type="button" aria-label="Close navigation">X</button>
        </div>
        <nav class="quick-access-list" aria-label="Mobile navigation"></nav>
      </div>
    `;
    const menuList = menu.querySelector(".quick-access-list");
    menuLinks.forEach(function (entry) {
      const item = document.createElement("div");
      item.className = "quick-access-home" + (isCurrent(entry[1]) ? " active" : "");
      item.appendChild(createLink(entry[0], entry[1]));
      menuList.appendChild(item);
    });

    oldHeader.replaceWith(header);
    const oldMenu = document.querySelector(".menu");
    if (oldMenu) {
      oldMenu.replaceWith(menu);
    } else {
      document.body.appendChild(menu);
    }

    const menuButton = header.querySelector(".menu-icon");
    const closeButton = menu.querySelector(".quick-access-close");

    function setMenu(open) {
      menu.style.right = open ? "0%" : "-100%";
      menu.setAttribute("aria-hidden", String(!open));
      menuButton.setAttribute("aria-expanded", String(open));
    }

    window.toggleMenu = function () {
      setMenu(menu.style.right !== "0%");
    };
    menuButton.addEventListener("click", window.toggleMenu);
    closeButton.addEventListener("click", function () { setMenu(false); });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (event) {
      if (menu.style.right === "0%" && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenu(false);
      }
    });

    if (typeof window.baffle === "function") {
      window.baffle(".navbar-items a")
        .reveal(1000)
        .set({
          characters: "▒░░░░█░░▒█▓▓░█/░░>▒/▒/▓▒░",
          speed: 150,
        });
    }
  }

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("navbar.css", script.src).href;
  document.head.appendChild(stylesheet);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNavbar);
  } else {
    renderNavbar();
  }
})();
