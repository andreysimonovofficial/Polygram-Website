const OFFSET = 80;
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const sticky = document.getElementById('sticky-cta');

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - OFFSET, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (sticky) sticky.classList.toggle('visible', y > 400);
  });
});
