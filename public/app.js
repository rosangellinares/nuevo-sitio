// "Back" links (a[data-back]): return to the page the visitor came from when it
// belongs to this site; otherwise fall through to the href (e.g. the home page).
(function () {
  var links = document.querySelectorAll('a[data-back]');
  if (!links.length) return;
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var ref = document.referrer;
      var sameSite = false;
      try { sameSite = ref && new URL(ref).origin === location.origin && ref !== location.href; } catch (err) {}
      if (sameSite && window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      }
    });
  });
})();

// Fixed header: stays transparent while the hero is on screen, then fades to a
// solid bar once the hero has scrolled past (so white nav text stays readable).
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function currentY() {
    return window.scrollY || window.pageYOffset ||
      (document.scrollingElement ? document.scrollingElement.scrollTop : 0) || 0;
  }

  function onScroll() {
    header.classList.toggle('scrolled', currentY() > 30);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

// Mobile navigation drawer: hamburger toggles a slide-in panel with a backdrop.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  var backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function setOpen(open) {
    nav.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });
  backdrop.addEventListener('click', function () { setOpen(false); });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) setOpen(false);
  });
})();

// Coverflow: an auto-scrolling 3D image carousel that curves toward the viewer.
(function () {
  var viewport = document.querySelector('.coverflow');
  var track = document.querySelector('.coverflow .cf-track');
  if (!viewport || !track) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Duplicate the items so the strip can loop seamlessly.
  track.innerHTML = track.innerHTML + track.innerHTML;

  var offset = 0;
  var speed = 0.9;           // px per frame
  var loopWidth = 0;
  var centered = false;

  function measure() {
    loopWidth = track.scrollWidth / 2;
    if (!centered && loopWidth) {
      // Start with the middle of the strip in the middle of the viewport.
      offset = -(loopWidth / 2 - viewport.getBoundingClientRect().width / 2);
      centered = true;
    }
  }
  measure();
  window.addEventListener('resize', measure);

  function layout() {
    track.style.transform = 'translateX(' + offset + 'px)';
    var mid = viewport.getBoundingClientRect();
    var center = mid.left + mid.width / 2;
    var half = mid.width / 2 || 1;
    var items = track.children;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      var c = r.left + r.width / 2;
      var d = (c - center) / half;              // -1 (left) .. 0 (center) .. 1 (right)
      if (d < -1.7 || d > 1.7) { items[i].style.opacity = '0'; continue; }
      var k = Math.max(-1, Math.min(1, d));
      var rot = k * -38;                          // rotateY
      var tz = -Math.abs(k) * 140;                // push edges back
      var scale = 1 - Math.abs(k) * 0.12;
      items[i].style.opacity = '1';
      items[i].style.transform =
        'rotateY(' + rot + 'deg) translateZ(' + tz + 'px) scale(' + scale + ')';
      items[i].style.zIndex = String(100 - Math.round(Math.abs(k) * 100));
    }
  }

  function tick() {
    offset -= speed;
    if (loopWidth && Math.abs(offset) >= loopWidth) offset += loopWidth;
    layout();
    requestAnimationFrame(tick);
  }

  // Paint the curved layout immediately, then start scrolling once images settle.
  layout();
  window.addEventListener('load', function () { measure(); layout(); });
  requestAnimationFrame(tick);
})();
