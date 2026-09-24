import { useEffect } from 'react';

function useStickyHeader(headerSelector = '.header-full-width', wrapperSelector = '.page-wrapper', sempreAtivo = false) {
  useEffect(() => {
    const header = document.querySelector(headerSelector);
    const wrapper = document.querySelector(wrapperSelector);

    if (!header || !wrapper) return;

    const OFFSET = 65;
    let ultimaAltura = 0;

    function updateHeaderPadding() {
      const alturaAtual = header.offsetHeight;
      if (alturaAtual === ultimaAltura) return;
      ultimaAltura = alturaAtual;
      wrapper.style.paddingTop = (alturaAtual - OFFSET) + 'px';
    }

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (sempreAtivo || scrollTop > 150) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      requestAnimationFrame(updateHeaderPadding);
    }

    updateHeaderPadding();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateHeaderPadding);
    }

    window.addEventListener('load', updateHeaderPadding);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeaderPadding, 200);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    header.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'padding-top' || e.propertyName === 'padding' || e.propertyName === 'padding-bottom') {
        requestAnimationFrame(updateHeaderPadding);
      }
    });

    let observer;
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(updateHeaderPadding);
      observer.observe(header);
    }

    setTimeout(updateHeaderPadding, 100);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, [headerSelector, wrapperSelector, sempreAtivo]);
}

export default useStickyHeader;
