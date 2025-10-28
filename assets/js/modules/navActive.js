function getPageName(path) {
  // نام فایل را از مسیر استخراج می‌کند (با در نظر گرفتن / و hash)
  let file = path.split('/').pop() || '';
  if (file === '' || file === '/') return 'index.html';
  if (file.includes('#')) file = file.split('#')[0];
  return file;
}

export function setActiveNavLink() {
  const current = getPageName(window.location.pathname);

  // همه لینک‌های ناوبری (فقط لینک‌های داخلی)
  const links = document.querySelectorAll('.nav-links a[href]');
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    // لینک‌های بیرونی/هش فقط را رد کن
    if (href.startsWith('http') || href.startsWith('#')) return;

    const hrefPage = getPageName(href);

    // فعال کردن بر اساس نام فایل
    const isIndex = current === 'index.html' && (hrefPage === 'index.html' || href === './' || href === '');
    const isSame = hrefPage === current;

    if (isSame || isIndex) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page'); // برای دسترسی‌پذیری
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });
}
