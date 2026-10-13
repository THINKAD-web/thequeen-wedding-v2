/**
 * Shared mobile hamburger menu (static pages + home/QT SPA).
 */
(function () {
  function initSiteMobileNav() {
    var btn = document.getElementById('menuBtn');
    var closeBtn = document.getElementById('menuClose');
    var overlay = document.getElementById('menuOverlay');
    if (!btn || !overlay) return;

    function openMenu() {
      overlay.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      overlay.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btn.focus();
    }

    btn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
    });

    overlay.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (overlay.classList.contains('open')) closeMenu();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteMobileNav);
  } else {
    initSiteMobileNav();
  }
})();
