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
      <h1 id="pass-manual-title">Choose Your Official Unstop Pass</h1>
      <p>Every participant needs an individual pass. After buying a pass, register separately for each event. Flagship events also require a verified team fee.</p>
      <div class="pass-rules">
        <strong>Important:</strong> NIT Uttarakhand students receive 50% off Flagship Event registration fees after institutional verification.
      </div>
      <div class="pass-steps" aria-label="How pass registration works">
        <article><b>1</b><strong>Buy one individual pass</strong><span>Choose the pass that fits your event plans.</span></article>
        <article><b>2</b><strong>Copy your Unstop Pass ID</strong><span>Keep the ID ready for every event form.</span></article>
        <article><b>3</b><strong>Register for each event</strong><span>Submit a separate registration per event.</span></article>
        <article><b>4</b><strong>Complete a Flagship fee after verification</strong><span>Pay the team or delegate fee when verified.</span></article>
      </div>
    </section>
    <section class="pass-grid" aria-label="Official Cliffesto passes">
      ${passes.map(function (pass) {
        return `<a class="pass-option" href="${pass[3]}" target="_blank" rel="noopener noreferrer">
          <span class="pass-name">${pass[0]}</span>
          <strong class="pass-price">${pass[1]}</strong>
          <span class="pass-label">What's included</span>
          <span class="pass-includes">${pass[2]}</span>
          <span class="pass-buy">BUY ON UNSTOP <span aria-hidden="true">↗</span></span>
        </a>`;
      }).join("")}
    </section>
    <section class="flagship-fees" aria-labelledby="flagship-fees-title">
      <h2 id="flagship-fees-title">Flagship event fees</h2>
      <ul>
        <li><span>Battle of Bands (BOB)</span><strong>₹499/team <em>(₹249 NIT UK)</em></strong></li>
        <li><span>Dance Competition</span><strong>₹499/team <em>(₹249 NIT UK)</em></strong></li>
        <li><span>Bid Wars</span><strong>₹299/team <em>(₹149 NIT UK)</em></strong></li>
        <li><span>Model United Nations (MUN)</span><strong>₹149/delegate <em>(₹99 NIT UK)</em></strong></li>
        <li><span>Robo Event (Robo Soccer)</span><strong>₹699/team <em>(₹399 NIT UK)</em></strong></li>
        <li><span>Hackathon</span><strong>₹699/team <em>(₹399 NIT UK)</em></strong></li>
      </ul>
      <p class="pass-note">Every Flagship event team must hold a valid individual Unstop pass.</p>
    </section>`;
})();
