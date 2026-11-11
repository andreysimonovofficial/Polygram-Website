document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = drawer ? drawer.querySelector('button[aria-label="Закрыть меню"]') : null;
  const links = document.querySelectorAll('.nav-drawer .nav-links a');

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  links.forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
});
