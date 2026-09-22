(function () {
  const config = window.CLIFFESTO_CONFIG;
  const content = document.querySelector(".content");
  if (!config || !content) return;

  const passes = [
    ["Platinum Pass", "₹799", "Star Night + EDM Night + all non-Flagship events", config.passes.platinum],
    ["General Event Pass", "₹499", "All non-Flagship events; Pro-Nights excluded", config.passes.general],
    ["Gold Pass", "₹399", "Star Night + EDM Night", config.passes.gold],
    ["Silver Pass", "₹299", "Star Night", config.passes.silver],
    ["School Student Pass", "₹199", "All non-Flagship events for verified school students", config.passes.school]
  ];

  content.className = "pass-page-content";
  content.innerHTML = `
    <section class="pass-manual" aria-labelledby="pass-manual-title">
      <p class="pass-kicker">CLIFFESTO '26 REGISTRATION</p>
      <h1 id="pass-manual-title">Choose your official Unstop pass</h1>
      <p>Every participant needs an individual pass. After buying a pass, register separately for each event. Flagship events also require a verified team fee.</p>
      <div class="pass-rules">
        <strong>Important:</strong> NIT Uttarakhand students receive 50% off Flagship Event registration fees after institutional verification.
      </div>
    </section>
    <section class="pass-grid" aria-label="Official Cliffesto passes">
      ${passes.map(function (pass) {
        return `<a class="pass-option" href="${pass[3]}" target="_blank" rel="noopener noreferrer">
          <span class="pass-name">${pass[0]}</span>
          <strong class="pass-price">${pass[1]}</strong>
          <span class="pass-includes">${pass[2]}</span>
          <span class="pass-buy">BUY ON UNSTOP <span aria-hidden="true">↗</span></span>
        </a>`;
      }).join("")}
    </section>
    <section class="flagship-fees" aria-labelledby="flagship-fees-title">
      <h2 id="flagship-fees-title">Flagship event fees</h2>
      <p>Battle of Bands and Dance: ₹499 team (₹249 NIT UK) · Bid Wars: ₹299 team (₹149 NIT UK) · MUN: ₹149 delegate (₹99 NIT UK) · Robo Event and Hackathon: ₹699 team (₹399 NIT UK).</p>
      <p class="pass-note">Every Flagship team member must hold a valid individual Unstop pass.</p>
    </section>`;
})();
