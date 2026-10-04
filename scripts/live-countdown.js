(function () {
  const countdown = document.getElementById("live-countdown");
  const timeDisplay = document.getElementById("live-countdown-time");

  if (!countdown || !timeDisplay) return;

  const liveAt = new Date("2026-10-09T08:00:00+05:30");
  const vanishAt = new Date("2026-10-12T12:00:00+05:30");
  const label = countdown.querySelector(".live-countdown-label");
  let timerId = null;

  function updateCountdown() {
    const now = Date.now();

    if (now >= vanishAt.getTime()) {
      countdown.style.display = "none";
      if (timerId !== null) window.clearInterval(timerId);
      return;
    }

    if (now >= liveAt.getTime()) {
      countdown.classList.add("is-live");
      countdown.setAttribute("aria-live", "polite");
      label.textContent = "IS LIVE!!!";
      timeDisplay.hidden = true;
      return;
    }

    const remaining = liveAt.getTime() - now;
    const totalSeconds = Math.floor(remaining / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    timeDisplay.hidden = false;
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateCountdown();
  timerId = window.setInterval(updateCountdown, 1000);
})();
