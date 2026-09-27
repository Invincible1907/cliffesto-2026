document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-message");

  const EMAILJS_PUBLIC_KEY = "smHhUVnw6AJ9zVvt5";
  const EMAILJS_SERVICE_ID = "service_u64zf7x";
  const EMAILJS_TEMPLATE_ID = "template_zwpymj1";

  if (contactForm && contactMessage && typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const fallbackToMailClient = () => {
    if (!contactForm) return false;

    const name = contactForm.querySelector("#name")?.value?.trim() || "";
    const email = contactForm.querySelector("#email")?.value?.trim() || "";
    const subject = contactForm.querySelector("#subject")?.value?.trim() || "Cliffesto Query";
    const message = contactForm.querySelector("#message")?.value?.trim() || "";

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

    if (!contactForm || !contactMessage) return;

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
      user_name: contactForm.querySelector("#name")?.value?.trim() || "",
      user_email: contactForm.querySelector("#email")?.value?.trim() || "",
      user_subject: contactForm.querySelector("#subject")?.value?.trim() || "",
      user_message: contactForm.querySelector("#message")?.value?.trim() || "",
      name: contactForm.querySelector("#name")?.value?.trim() || "",
      email: contactForm.querySelector("#email")?.value?.trim() || "",
      subject: contactForm.querySelector("#subject")?.value?.trim() || "",
      message: contactForm.querySelector("#message")?.value?.trim() || "",
      to_email: "cliffesto@nituk.ac.in",
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
          contactMessage.textContent = "Message not sent. Please check your details and try again, or email cliffesto@nituk.ac.in directly. ❌";
        }
      );
  };

  if (contactForm) {
    contactForm.addEventListener("submit", sendEmail);
  }

  const committeeMembers = document.querySelectorAll(".committee-member");
  const supportsHover = window.matchMedia("(hover: hover)").matches;

  if (supportsHover) {
    committeeMembers.forEach((member) => {
      let bounds = null;
      let pointerX = 0;
      let pointerY = 0;
      let tiltFrame = null;

      member.addEventListener("pointerenter", () => {
        bounds = member.getBoundingClientRect();
      });

      member.addEventListener("pointermove", (event) => {
        if (!bounds) bounds = member.getBoundingClientRect();
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (tiltFrame !== null) return;

        tiltFrame = requestAnimationFrame(() => {
          const horizontalTilt = ((pointerX - bounds.left) / bounds.width - 0.5) * 16;
          const verticalTilt = ((pointerY - bounds.top) / bounds.height - 0.5) * -16;

          member.style.setProperty("--tilt-x", `${horizontalTilt.toFixed(2)}deg`);
          member.style.setProperty("--tilt-y", `${verticalTilt.toFixed(2)}deg`);
          tiltFrame = null;
        });
      });

      member.addEventListener("pointerleave", () => {
        bounds = null;
        member.style.setProperty("--tilt-x", "0deg");
        member.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

});
