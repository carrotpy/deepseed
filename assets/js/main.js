/* ============================================================
   DEEPSEED TECHNOLOGIES — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     THEME TOGGLE (dark / light)
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Restore saved theme
  if (localStorage.getItem('theme') === 'light') {
    html.classList.add('light');
  }

  themeToggle?.addEventListener('click', () => {
    html.classList.toggle('light');
    localStorage.setItem('theme', html.classList.contains('light') ? 'light' : 'dark');
  });


  /* ----------------------------------------------------------
     PALETTE PICKER — dark + light palettes
  ---------------------------------------------------------- */
  const LIGHT_PALETTES = ['default','ocean','violet','emerald','rose','warm'];
  const DARK_PALETTES  = ['default','purple','teal','forest','crimson','amber'];

  const paletteToggle  = document.getElementById('palette-toggle');
  const palettePanel   = document.getElementById('palette-panel');
  const darkSwatches   = document.querySelectorAll('.pp-dark-swatch');
  const lightSwatches  = document.querySelectorAll('.pp-light-swatch');

  // Restore saved palettes
  const savedLPalette = localStorage.getItem('palette')  || 'default';
  const savedDPalette = localStorage.getItem('dpalette') || 'default';
  applyLightPalette(savedLPalette);
  applyDarkPalette(savedDPalette);

  paletteToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    palettePanel?.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    palettePanel?.classList.remove('open');
  });

  palettePanel?.addEventListener('click', (e) => e.stopPropagation());

  // Dark swatch clicks
  darkSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.dpalette;
      applyDarkPalette(p);
      localStorage.setItem('dpalette', p);
    });
  });

  // Light swatch clicks
  lightSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.lpalette;
      applyLightPalette(p);
      localStorage.setItem('palette', p);
    });
  });

  function applyDarkPalette(name) {
    DARK_PALETTES.forEach(p => document.documentElement.classList.remove('dpalette-' + p));
    if (name !== 'default') document.documentElement.classList.add('dpalette-' + name);
    darkSwatches.forEach(b => {
      b.classList.toggle('pp-swatch--active-dark', b.dataset.dpalette === name);
    });
  }

  function applyLightPalette(name) {
    LIGHT_PALETTES.forEach(p => html.classList.remove('palette-' + p));
    if (name !== 'default') html.classList.add('palette-' + name);
    lightSwatches.forEach(b => {
      b.classList.toggle('pp-swatch--active-light', b.dataset.lpalette === name);
    });
  }


  /* ----------------------------------------------------------
     PRELOADER
  ---------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader?.classList.add('hidden');
    }, 600);
  });
  // Fallback: hide after 3s in case load event delays
  setTimeout(() => preloader?.classList.add('hidden'), 3000);


  /* ----------------------------------------------------------
     CURSOR GLOW
  ---------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let rafId;
    let mx = -400, my = -400;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          cursorGlow.style.left = mx + 'px';
          cursorGlow.style.top  = my + 'px';
          rafId = null;
        });
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }


  /* ----------------------------------------------------------
     NAVIGATION — scroll solid
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  const handleNavScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', debounce(handleNavScroll, 10), { passive: true });
  handleNavScroll();


  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobile-menu');
  const mobileClose  = document.getElementById('mobile-close');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link');

  const openMenu = () => {
    mobileMenu?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileClose?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
    mobileClose?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ----------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ----------------------------------------------------------
     SCROLL REVEAL via IntersectionObserver
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    // Stagger delay for sibling groups
    if (!el.style.getPropertyValue('--delay')) {
      const siblings = el.parentElement?.querySelectorAll('.reveal');
      if (siblings) {
        siblings.forEach((sib, j) => {
          sib.style.setProperty('--delay', `${j * 0.1}s`);
        });
      }
    }
    revealObserver.observe(el);
  });


  /* ----------------------------------------------------------
     MAGNETIC BUTTONS
  ---------------------------------------------------------- */
  document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    const btn = wrap.querySelector('button, a');
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ----------------------------------------------------------
     COUNTER ANIMATION (stat numbers)
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const start    = performance.now();

    requestAnimationFrame(function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = easeOutExpo(progress);
      const value    = target < 10 ? (eased * target).toFixed(1) : Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    });
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }




  /* ----------------------------------------------------------
     SERVICES TAB PANEL
  ---------------------------------------------------------- */
  const svcTabs   = document.querySelectorAll('.svc-tab');
  const svcPanels = document.querySelectorAll('.svc-panel');

  svcTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      svcTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      svcPanels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(`svc-panel-${i}`);
      if (panel) {
        panel.style.display = 'block';
        panel.offsetHeight; // reflow to trigger transition
        panel.classList.add('active');
      }
    });
  });


  /* ----------------------------------------------------------
     PORTFOLIO FILTER
  ---------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });


  /* ----------------------------------------------------------
     PHOTO ASSET CAROUSEL
  ---------------------------------------------------------- */
  const assetTrack   = document.getElementById('asset-carousel-track');
  const assetDots    = document.querySelectorAll('.asset-dot');
  const assetPrevBtn = document.getElementById('asset-carousel-prev');
  const assetNextBtn = document.getElementById('asset-carousel-next');

  if (assetTrack && assetDots.length) {
    let currentAsset = 0;
    let assetTimer;
    const totalAssets = assetDots.length;
    const assetRegion = assetTrack.closest('.asset-carousel');

    const goToAsset = (idx) => {
      currentAsset = (idx + totalAssets) % totalAssets;
      assetTrack.style.transform = `translateX(-${currentAsset * 100}%)`;
      assetDots.forEach((dot, i) => {
        const isActive = i === currentAsset;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const nextAsset = () => goToAsset(currentAsset + 1);
    const prevAsset = () => goToAsset(currentAsset - 1);
    const stopAssetAuto = () => clearInterval(assetTimer);
    const startAssetAuto = () => {
      stopAssetAuto();
      assetTimer = setInterval(nextAsset, 4500);
    };

    assetPrevBtn?.addEventListener('click', () => { stopAssetAuto(); prevAsset(); startAssetAuto(); });
    assetNextBtn?.addEventListener('click', () => { stopAssetAuto(); nextAsset(); startAssetAuto(); });

    assetDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAssetAuto();
        goToAsset(i);
        startAssetAuto();
      });
    });

    assetRegion?.addEventListener('mouseenter', stopAssetAuto);
    assetRegion?.addEventListener('mouseleave', startAssetAuto);
    assetRegion?.addEventListener('focusin', stopAssetAuto);
    assetRegion?.addEventListener('focusout', startAssetAuto);

    assetRegion?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopAssetAuto();
        nextAsset();
        startAssetAuto();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAssetAuto();
        prevAsset();
        startAssetAuto();
      }
    });

    let assetTouchStartX = 0;
    assetTrack.addEventListener('touchstart', e => {
      assetTouchStartX = e.touches[0].clientX;
      stopAssetAuto();
    }, { passive: true });

    assetTrack.addEventListener('touchend', e => {
      const diff = assetTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextAsset() : prevAsset();
      startAssetAuto();
    }, { passive: true });

    goToAsset(0);
    startAssetAuto();
  }


  /* ----------------------------------------------------------
     TESTIMONIAL CAROUSEL
  ---------------------------------------------------------- */
  const track     = document.getElementById('testimonial-track');
  const dots      = document.querySelectorAll('.dot-indicator');
  const prevBtn   = document.getElementById('testimonial-prev');
  const nextBtn   = document.getElementById('testimonial-next');

  if (track && dots.length) {
    let current    = 0;
    let autoTimer;
    const total    = dots.length;

    const goTo = (idx) => {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => {
      autoTimer = setInterval(next, 5000);
    };
    const stopAuto = () => clearInterval(autoTimer);

    prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    track.parentElement?.addEventListener('mouseenter', stopAuto);
    track.parentElement?.addEventListener('mouseleave', startAuto);

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    }, { passive: true });

    goTo(0);
    startAuto();
  }


  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.closest('.faq-item');
      const isOpen   = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });





  /* ----------------------------------------------------------
     NEWSLETTER FORM
  ---------------------------------------------------------- */
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('.newsletter-input');
    const btn   = e.target.querySelector('button');
    if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      if (btn) { btn.textContent = 'Subscribed!'; btn.disabled = true; }
      input.value = '';
    } else if (input) {
      input.style.borderColor = '#EF4444';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });


  /* ----------------------------------------------------------
     ACTIVE NAV LINK (scroll spy — lightweight)
  ---------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link[data-section]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('text-white'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        active?.classList.add('text-white');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => spyObserver.observe(s));


  /* ----------------------------------------------------------
     UTILITY: Debounce
  ---------------------------------------------------------- */
  function debounce(fn, wait) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

});
