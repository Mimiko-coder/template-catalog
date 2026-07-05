(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Right-edge nav — mobile toggle */
  const sideNav = document.querySelector('.side-nav');
  const navToggle = document.querySelector('.side-nav-toggle');
  const sideTabs = document.querySelectorAll('.side-tab[data-section]');

  if (navToggle && sideNav) {
    navToggle.addEventListener('click', () => {
      const open = sideNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });

    sideNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        sideNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active section highlight on scroll */
  const sections = ['hero', 'specs', 'capabilities', 'projects', 'testimonial', 'contact'];

  if (sideTabs.length && !prefersReducedMotion) {
    const sectionEls = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            sideTabs.forEach((tab) => {
              tab.classList.toggle('side-tab--active', tab.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sectionEls.forEach((el) => navObserver.observe(el));
  }

  /* Animated spec counters */
  function animateCounter(el, target, duration) {
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  const specBar = document.querySelector('.spec-bar');
  const counters = document.querySelectorAll('.spec-val[data-count]');
  let countersStarted = false;

  if (specBar && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.count, 10);
              if (prefersReducedMotion) {
                counter.textContent = target.toLocaleString();
              } else {
                animateCounter(counter, target, 2200);
              }
            });
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    counterObserver.observe(specBar);
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 0.07}s`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* Staggered sheet stack entrance */
  const projectSheets = document.querySelectorAll('.project-sheet.reveal');

  if (!prefersReducedMotion && projectSheets.length) {
    projectSheets.forEach((sheet, i) => {
      sheet.style.transitionDelay = `${i * 0.12}s`;
    });
  }

  /* File upload UI */
  const fileInput = document.getElementById('fileInput');
  const fileBrowse = document.getElementById('fileBrowse');
  const fileDropzone = document.getElementById('fileDropzone');
  const fileList = document.getElementById('fileList');
  const uploadedFiles = [];

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      li.innerHTML =
        '<span>' + file.name + ' (' + formatSize(file.size) + ')</span>' +
        '<button type="button" class="file-remove" data-index="' + index + '">REMOVE</button>';
      fileList.appendChild(li);
    });

    fileList.querySelectorAll('.file-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedFiles.splice(parseInt(btn.dataset.index, 10), 1);
        renderFileList();
      });
    });
  }

  function addFiles(files) {
    Array.from(files).forEach((file) => {
      const exists = uploadedFiles.some((f) => f.name === file.name && f.size === file.size);
      if (!exists) uploadedFiles.push(file);
    });
    renderFileList();
  }

  if (fileBrowse && fileInput) {
    fileBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) addFiles(fileInput.files);
      fileInput.value = '';
    });
  }

  if (fileDropzone) {
    fileDropzone.addEventListener('click', () => fileInput && fileInput.click());

    fileDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropzone.classList.add('dragover');
    });

    fileDropzone.addEventListener('dragleave', () => {
      fileDropzone.classList.remove('dragover');
    });

    fileDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });
  }

  /* RFQ form */
  const rfqForm = document.getElementById('rfqForm');
  const formMsg = document.getElementById('formMsg');

  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const company = rfqForm.querySelector('#company').value.trim();
      const projectRef = rfqForm.querySelector('#projectRef').value.trim();
      const tonnage = rfqForm.querySelector('#tonnage').value;
      const deadline = rfqForm.querySelector('#deadline').value;
      const ref = 'FS-' + Date.now().toString().slice(-6);

      if (formMsg) {
        formMsg.textContent =
          'RFQ ' + ref + ' received from ' + company +
          '. REF: ' + projectRef + ' · ' + tonnage + ' T · DEADLINE: ' + deadline +
          '. ' + uploadedFiles.length + ' file(s) attached.';
      }

      rfqForm.reset();
      uploadedFiles.length = 0;
      renderFileList();
    });
  }
})();
