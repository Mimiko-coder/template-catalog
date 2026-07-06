document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'mercyDesignsReviews';

  const seedReviews = [
    {
      id: 'seed-1',
      name: 'Amara Okafor',
      business: 'Okafor Advisory Group',
      template: 'Corporate',
      rating: 5,
      review: 'I chose the Corporate template for my consulting firm and Mercy turned it into something that looks like a Fortune 500 portal. The KPI dashboard hero made us look established from day one — three new clients mentioned our website in the first month.',
      date: '2026-05-12'
    },
    {
      id: 'seed-2',
      name: 'James Reid',
      business: 'Flowpath App',
      template: 'Startup',
      rating: 5,
      review: 'The Startup SaaS template was exactly the vibe I wanted — dark theme, pricing matrix, the works. Mercy customized every section for my product in under a week. My co-founder said it looks like we raised Series A already.',
      date: '2026-04-28'
    },
    {
      id: 'seed-3',
      name: 'Sofia Martinez',
      business: 'Martinez Estates',
      template: 'Luxury',
      rating: 4,
      review: 'I picked the Luxury template for my real estate listings and the editorial spreads are stunning on mobile. Mercy was patient with my photo choices and copy revisions. The final site feels high-end without being flashy — exactly what my clients expect.',
      date: '2026-03-15'
    },
    {
      id: 'seed-4',
      name: 'Kenji Tanaka',
      business: 'Tanaka Steel Works',
      template: 'Industrial',
      rating: 4,
      review: 'Our engineering company needed something technical, not generic. The Industrial blueprint layout with spec tables and the RFQ form was perfect. Mercy understood our industry and delivered a site our project managers actually use to send clients.',
      date: '2026-02-08'
    }
  ];

  /* ── Navigation ── */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links?.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll animations ── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  /* ── Star helpers ── */
  function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('<span class="star filled">★</span>');
      } else if (rating >= i - 0.5) {
        stars.push('<span class="star half">★</span>');
      } else {
        stars.push('<span class="star">★</span>');
      }
    }
    return stars.join('');
  }

  function getReviews() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return [...seedReviews, ...saved.filter(r => !r.id?.startsWith('seed-'))];
    } catch {
      return [...seedReviews];
    }
  }

  function saveReview(review) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      saved.push(review);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch { /* storage full or unavailable */ }
  }

  function calcAverage(reviews) {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  function updateSummary(reviews) {
    const avg = calcAverage(reviews);
    const avgEl = document.getElementById('reviewsAvg');
    const avgTextEl = document.getElementById('reviewsAvgText');
    const countEl = document.getElementById('reviewsCount');
    const starsEl = document.getElementById('reviewsAvgStars');

    if (avgEl) avgEl.textContent = avg.toFixed(1);
    if (avgTextEl) avgTextEl.textContent = `${avg.toFixed(1)} out of 5`;
    if (countEl) countEl.textContent = reviews.length;
    if (starsEl) starsEl.innerHTML = renderStars(avg);
  }

  function renderTestimonials(reviews) {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = sorted.map(r => {
      const isClient = !r.id?.startsWith('seed-');
      return `
        <article class="testimonial-card${isClient ? ' testimonial-card--client' : ''}" data-animate>
          <div class="testimonial-stars" aria-label="${r.rating} out of 5 stars">${renderStars(r.rating)}</div>
          <p class="testimonial-quote">"${r.review}"</p>
          <div class="testimonial-meta">
            <cite class="testimonial-name">${r.name}</cite>
            <span class="testimonial-role">${r.business}</span>
            <span class="testimonial-template">${r.template} Template</span>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    updateSummary(reviews);
  }

  /* ── Initial render ── */
  let allReviews = getReviews();
  renderTestimonials(allReviews);

  /* ── Star picker ── */
  const starPicker = document.getElementById('starPicker');
  const ratingInput = document.getElementById('ratingInput');
  let selectedRating = 0;

  starPicker?.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.value, 10);
      ratingInput.value = selectedRating;
      starPicker.querySelectorAll('.star-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.value, 10) <= selectedRating);
      });
    });
  });

  /* ── Review form ── */
  document.getElementById('reviewForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;

    if (!selectedRating) {
      ratingInput.setCustomValidity('Please select a star rating');
      ratingInput.reportValidity();
      return;
    }
    ratingInput.setCustomValidity('');

    const review = {
      id: `client-${Date.now()}`,
      name: form.name.value.trim(),
      business: form.business.value.trim() || 'Client',
      template: form.template.value,
      rating: selectedRating,
      review: form.review.value.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    saveReview(review);
    allReviews = getReviews();
    renderTestimonials(allReviews);

    const success = document.getElementById('reviewSuccess');
    if (success) {
      success.hidden = false;
      setTimeout(() => { success.hidden = true; }, 5000);
    }

    form.reset();
    selectedRating = 0;
    starPicker?.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── Contact form ── */
  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const business = form.business.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Website Inquiry${business ? ` — ${business}` : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBusiness: ${business || 'N/A'}\n\n${message}`
    );

    window.location.href = `mailto:mercysit2002@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
});
