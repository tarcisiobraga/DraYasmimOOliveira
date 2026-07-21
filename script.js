const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const pageLoader = document.getElementById('page-loader');
let loaderActive = false;

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (loaderActive) return;
    e.preventDefault();
    loaderActive = true;
    pageLoader.classList.add('active');

    setTimeout(() => {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      pageLoader.classList.remove('active');
      loaderActive = false;
    }, 900);
  });
});
