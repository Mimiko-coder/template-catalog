(function () {
  "use strict";

  /* ─── Masthead: solid state after hero ─── */
  const masthead = document.querySelector(".masthead");
  const hero = document.querySelector(".hero");

  function updateMasthead() {
    if (!masthead || !hero) return;
    const threshold = hero.offsetHeight * 0.15;
    masthead.classList.toggle("is-solid", window.scrollY > threshold);
  }

  window.addEventListener("scroll", updateMasthead, { passive: true });
  updateMasthead();

  /* ─── Hero Ken Burns Slideshow ─── */
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const SLIDE_INTERVAL = 6000;
  let currentSlide = 0;
  let slideTimer = null;

  function goToSlide(index) {
    if (!slides.length) return;

    currentSlide = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === currentSlide);
    });

    dots.forEach(function (dot, i) {
      var isActive = i === currentSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function startSlideshow() {
    stopSlideshow();
    slideTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, SLIDE_INTERVAL);
  }

  function stopSlideshow() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var target = parseInt(dot.getAttribute("data-target"), 10);
      goToSlide(target);
      startSlideshow();
    });
  });

  if (slides.length > 1) {
    startSlideshow();
  }

  /* Pause slideshow when tab is hidden */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopSlideshow();
    } else if (slides.length > 1) {
      startSlideshow();
    }
  });

  /* ─── Scroll Reveal Animations ─── */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ─── Inquiry Form ─── */
  var form = document.querySelector(".inquiry-form");
  var statusEl = document.querySelector(".form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var interest = form.querySelector("#interest");

      if (!name.value.trim() || !email.value.trim() || !interest.value) {
        if (statusEl) {
          statusEl.textContent = "Please complete all required fields.";
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent =
          "Thank you. A member of our concierge team will be in touch shortly.";
      }

      form.reset();
    });
  }

  /* ─── Smooth anchor offset for fixed masthead ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (id === "#") return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var offset = masthead ? masthead.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
