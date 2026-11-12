
import { useEffect } from 'react';

function useStickyHeader(
  headerSelector = '.header-full-width',
  wrapperSelector = '.page-wrapper',
  sempreAtivo = false
) {
  useEffect(() => {
    const header = document.querySelector(headerSelector);
    const wrapper = document.querySelector(wrapperSelector);
    const container = header?.closest('.header-sticky-container');

    if (!header || !container) return;

    const paddingOriginal = wrapper?.style.paddingTop ?? '';
    const alturaOriginalContainer = container.style.height;

    let alturaHeader = 0;
    let observer = null;

    const atualizarAltura = () => {
      if (header.classList.contains('scrolled')) return;

      const altura = Math.ceil(header.getBoundingClientRect().height);

      if (altura > 0) {
        alturaHeader = altura;
        container.style.minHeight = `${alturaHeader}px`;
      }
    };

    if (wrapper) {
      wrapper.style.paddingTop = '';
    }

    const minHeightOriginal = container.style.minHeight;

    atualizarAltura();

    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(atualizarAltura);
      observer.observe(header);
    }

    window.addEventListener('resize', atualizarAltura);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', atualizarAltura);

      container.style.height = alturaOriginalContainer;
      container.style.minHeight = minHeightOriginal;

      if (wrapper) {
        wrapper.style.paddingTop = paddingOriginal;
      }
    };
  }, [headerSelector, wrapperSelector, sempreAtivo]);
}

export default useStickyHeader;
