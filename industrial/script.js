(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Animated counters */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);

      el.textContent = isDecimal ? (target * eased).toFixed(1) : current.toLocaleString();

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
                animateCounter(counter, target, 2000);
              }
            });
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    counterObserver.observe(specBar);
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 5) * 0.06}s`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* File upload UI (styled only — no real upload) */
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
      li.innerHTML = `
        <span>${file.name} (${formatSize(file.size)})</span>
        <button type="button" class="file-remove" data-index="${index}">REMOVE</button>
      `;
      fileList.appendChild(li);
    });

    fileList.querySelectorAll('.file-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        uploadedFiles.splice(idx, 1);
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
    fileDropzone.addEventListener('click', () => fileInput?.click());

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
      const fileCount = uploadedFiles.length;

      if (formMsg) {
        formMsg.textContent = `RFQ received from ${company}. ${fileCount} file(s) attached. Reference: FS-${Date.now().toString().slice(-6)}`;
      }

      rfqForm.reset();
      uploadedFiles.length = 0;
      renderFileList();
    });
  }
})();
