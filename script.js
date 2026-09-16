(function () {
  'use strict';

  /* ---------- header shrink / mobile nav ---------- */
  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      const open = navMobile.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- gallery tabs ---------- */
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-tab');

      document.querySelectorAll('.tab').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.gallery-grid').forEach(function (grid) {
        grid.classList.remove('is-active');
      });
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ---------- callback form ---------- */
  const BOT_TOKEN = '8982210943:AAF-zd8NhoQOvSGTJbwZU8Grwced72NUzVY';
  const CHAT_ID = '-1004301979049';

  const form = document.getElementById('callbackForm');
  const formStatus = document.getElementById('formStatus');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Считываем значения из полей
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Простая валидация перед отправкой
    if (!name || !phone) {
      alert('Будь ласка, заповніть ім\'я та номер телефону!');
      return;
    }

    const wishText = message.length > 0 ? message : 'Не вказано';

    // Красивый текст сообщения для Telegram
    const text =
      `📞 **НОВА ЗАЯВКА НА ДЗВІНОК!**\n\n` +
      `👤 **Ім'я:** ${name}\n` +
      `📱 **Телефон:** ${phone}\n` +
      `💬 **Побажання:** ${wishText}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();

      if (data.ok) {
        // Показываем плашку успеха под формой
        if (formStatus) {
          formStatus.style.display = 'block';
        }
        form.reset(); // Очищаем форму
      } else {
        alert('Помилка відправки в Telegram: ' + data.description);
      }
    } catch (error) {
      console.error('Помилка мережі:', error);
      alert(`Не вдалося відправити форму. Перевірте з'єднання.`);
    }
  });

  /* ---------- top image carousel ---------- */
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.getElementById('carouselDots');
  if (carouselTrack && carouselPrev && carouselNext && carouselDots) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const dots = carouselDots.querySelectorAll('button');
    const slideCount = slides.length;
    let current = 0;
    let autoplayTimer = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(index) {
      current = (index + slideCount) % slideCount;
      carouselTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () { goTo(current + 1); }, 4500);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    carouselPrev.addEventListener('click', function () { goTo(current - 1); startAutoplay(); });
    carouselNext.addEventListener('click', function () { goTo(current + 1); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    const carouselFrame = carouselTrack.closest('.hero') || carouselTrack.closest('.carousel-frame');
    if (carouselFrame) {
      carouselFrame.addEventListener('mouseenter', stopAutoplay);
      carouselFrame.addEventListener('mouseleave', startAutoplay);
    }

    let touchStartX = null;
    carouselTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    carouselTrack.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (delta > 40) goTo(current - 1);
      else if (delta < -40) goTo(current + 1);
      touchStartX = null;
      startAutoplay();
    });

    goTo(0);
    startAutoplay();
  }

  /* ---------- floating call-to-action ---------- */
  const floatCta = document.getElementById('floatCta');
  if (floatCta) {
    const toggleFloatCta = function () {
      floatCta.classList.toggle('is-visible', window.scrollY > 420);
    };
    window.addEventListener('scroll', toggleFloatCta, { passive: true });
    toggleFloatCta();
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll('.hero-stats .num[data-count]');
  if (counters.length) {
    const animateCounter = function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1100;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { observer.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- reviews carousel ---------- */
  const reviewTrack = document.getElementById('reviewTrack');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  if (reviewTrack && reviewPrev && reviewNext) {
    const scrollByCard = function (direction) {
      const card = reviewTrack.querySelector('.review-card');
      const step = card ? card.getBoundingClientRect().width + 22 : 320;
      reviewTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
    };
    reviewPrev.addEventListener('click', function () { scrollByCard(-1); });
    reviewNext.addEventListener('click', function () { scrollByCard(1); });
  }

  /* ---------- gentle tilt on cards ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const tiltables = document.querySelectorAll('.service-card, .scene');
    tiltables.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
