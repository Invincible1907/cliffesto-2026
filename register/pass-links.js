(function () {
  const config = window.CLIFFESTO_CONFIG;
  const content = document.querySelector(".content");
  if (!config || !content) return;

  const passes = [
    ["Platinum Pass", "PLATINUM<br />PASS", "₹799", "Star Night + EDM Night + all non-Flagship events", config.passes.platinum],
    ["General Event Pass", "GENERAL<br />EVENT PASS", "₹499", "All non-Flagship events; Pro-Nights excluded", config.passes.general],
    ["Gold Pass", "GOLD<br />PASS", "₹399", "Star Night + EDM Night", config.passes.gold],
    ["Silver Pass", "SILVER<br />PASS", "₹299", "Star Night", config.passes.silver],
    ["School Student Pass", "SCHOOL<br />STUDENT<br />PASS", "₹199", "All non-Flagship events for verified school students", config.passes.school]
  ];

  content.className = "content";
  content.innerHTML = passes.map(function (pass) {
    return `<div class="container noselect">
      <div class="canvas" role="link" tabindex="0" aria-label="Buy ${pass[0]}" data-pass-url="${pass[4]}">
        <div class="tracker tr-1"></div><div class="tracker tr-2"></div><div class="tracker tr-3"></div>
        <div class="tracker tr-4"></div><div class="tracker tr-5"></div><div class="tracker tr-6"></div>
        <div class="tracker tr-7"></div><div class="tracker tr-8"></div><div class="tracker tr-9"></div>
        <div id="card">
          <div class="card-content">
            <div class="card-glare"></div>
            <div class="cyber-lines"><span></span><span></span><span></span><span></span></div>
            <p id="prompt">${pass[0]}</p>
            <div class="title">${pass[1]}</div>
            <div class="glowing-elements"><div class="glow-1"></div><div class="glow-2"></div><div class="glow-3"></div></div>
            <div class="subtitle"><span>${pass[2].replace("₹", "Rs. ")}</span></div>
            <div class="card-particles"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="corner-elements"><span></span><span></span><span></span><span></span></div>
            <div class="scan-line"></div>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");

  content.querySelectorAll(".canvas").forEach(function (card) {
    function openPass() {
      window.open(card.dataset.passUrl, "_blank", "noopener,noreferrer");
    }

    card.addEventListener("click", openPass);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPass();
      }
    });
  });
})();
