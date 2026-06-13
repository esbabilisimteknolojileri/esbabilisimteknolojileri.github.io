/**
 * ESBA Bilişim Teknolojileri - Ana JavaScript Dosyası
 * Smooth scroll, scroll reveal, navbar, çerez, modal ve mobil uyumluluk
 */

(function () {
  'use strict';

  /* --- DOM Elemanları --- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const kvkkBtn = document.getElementById('kvkkBtn');
  const kvkkModal = document.getElementById('kvkkModal');
  const kvkkClose = document.getElementById('kvkkClose');
  const kvkkOverlay = document.getElementById('kvkkOverlay');

  const COOKIE_KEY = 'esba_cookie_accepted';
  const MOBILE_BREAKPOINT = 768;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scrollLockPosition = 0;

  /* --- Yardımcı: Mobil mi? --- */
  function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  /* --- iOS uyumlu scroll kilidi --- */
  function lockBodyScroll() {
    document.body.classList.add('menu-open');
  }

  function unlockBodyScroll() {
    document.body.classList.remove('menu-open');
  }

  function lockModalScroll() {
    if (navMenu.classList.contains('open')) return;
    document.body.classList.add('modal-open');
  }

  function unlockModalScroll() {
    document.body.classList.remove('modal-open');
  }

  /* --- Navbar Scroll Efekti --- */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* --- Mobil Menü --- */
  function openMobileMenu() {
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navbar.classList.add('menu-active');
    navOverlay.classList.add('active');
    navOverlay.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    lockBodyScroll();
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navbar.classList.remove('menu-active');
    navOverlay.classList.remove('active');
    navOverlay.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    if (!kvkkModal.classList.contains('open')) {
      unlockBodyScroll();
    }
  }

  function toggleMobileMenu() {
    if (navMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /* --- Aktif Menü Linki --- */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + getNavbarOffset() + 20;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function getNavbarOffset() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'), 10) || 80;
  }

  /* --- Smooth Scroll --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        const offset = getNavbarOffset();
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /* --- Scroll Reveal --- */
  function initScrollReveal() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    revealElements.forEach(function (el) {
      if (!el.closest('.hero')) {
        revealObserver.observe(el);
      }
    });
  }

  /* --- Hero Giriş Animasyonu --- */
  function initHeroAnimation() {
    const heroElements = document.querySelectorAll('.hero .reveal');

    if (prefersReducedMotion) {
      heroElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    heroElements.forEach(function (el, index) {
      el.style.transitionDelay = index * 0.12 + 's';
      setTimeout(function () {
        el.classList.add('visible');
      }, 150 + index * 120);
    });
  }

  /* --- Çerez Banner --- */
  function initCookieBanner() {
    if (localStorage.getItem(COOKIE_KEY)) return;

    setTimeout(function () {
      cookieBanner.classList.add('show');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }, 1200);

    cookieAccept.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'true');
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  /* --- KVKK Modal --- */
  function openKvkkModal() {
    closeMobileMenu();
    kvkkModal.classList.add('open');
    kvkkModal.setAttribute('aria-hidden', 'false');
    lockModalScroll();
  }

  function closeKvkkModal() {
    kvkkModal.classList.remove('open');
    kvkkModal.setAttribute('aria-hidden', 'true');
    unlockModalScroll();
  }

  function initKvkkModal() {
    kvkkBtn.addEventListener('click', openKvkkModal);
    kvkkClose.addEventListener('click', closeKvkkModal);
    kvkkOverlay.addEventListener('click', closeKvkkModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (kvkkModal.classList.contains('open')) closeKvkkModal();
        if (navMenu.classList.contains('open')) closeMobileMenu();
      }
    });
  }

  /* --- Servis Kartları Hover (sadece masaüstü) --- */
  function initServiceCardHover() {
    if (isTouchDevice) return;

    const cards = document.querySelectorAll('.service-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        card.style.transform = 'translateY(-8px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* --- Navbar yüksekliğini dinamik güncelle --- */
  function updateNavbarHeight() {
    if (!navbar) return;
    const height = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', height + 'px');
  }

  /* --- Ekran yönü / boyut değişiminde menüyü kapat --- */
  function handleViewportChange() {
    updateNavbarHeight();

    if (!isMobileView() && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  }

  /* --- Event Listeners --- */
  function initEventListeners() {
    let scrollTicking = false;

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          handleNavbarScroll();
          updateActiveNavLink();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    navToggle.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', closeMobileMenu);

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', function () {
      setTimeout(handleViewportChange, 150);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }
  }

  /* --- Başlatma --- */
  function init() {
    updateNavbarHeight();
    handleNavbarScroll();
    initSmoothScroll();
    initScrollReveal();
    initHeroAnimation();
    initCookieBanner();
    initKvkkModal();
    initServiceCardHover();
    initEventListeners();
    updateActiveNavLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
