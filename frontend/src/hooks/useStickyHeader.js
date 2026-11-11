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
    let frameId = null;
    let observer = null;
    let alturaOriginal = 0;
    let scrollado = sempreAtivo;

    if (wrapper) {
      wrapper.style.paddingTop = '';
    }

    function atualizarAltura() {
      if (header.classList.contains('scrolled')) return;

      alturaOriginal = Math.ceil(header.getBoundingClientRect().height);
      container.style.height = `${alturaOriginal}px`;
    }

    function atualizarHeader() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (sempreAtivo) {
        scrollado = true;
      } else if (!scrollado && scrollTop > 150) {
        scrollado = true;
      } else if (scrollado && scrollTop < 30) {
        scrollado = false;
      }

      header.classList.toggle('scrolled', scrollado);

      if (!scrollado) {
        atualizarAltura();
      }
    }

    function agendarAtualizacao() {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        frameId = null;
        atualizarHeader();
      });
    }

    header.classList.remove('scrolled');
    atualizarAltura();
    atualizarHeader();

    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(() => {
        if (!header.classList.contains('scrolled')) {
          atualizarAltura();
        }
      });

      observer.observe(header);
    }

    window.addEventListener('scroll', agendarAtualizacao, { passive: true });
    window.addEventListener('resize', agendarAtualizacao);

    return () => {
      window.removeEventListener('scroll', agendarAtualizacao);
      window.removeEventListener('resize', agendarAtualizacao);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      observer?.disconnect();

      container.style.height = '';

      if (wrapper) {
        wrapper.style.paddingTop = paddingOriginal;
      }

      header.classList.remove('scrolled');
    };
  }, [headerSelector, wrapperSelector, sempreAtivo]);
}

export default useStickyHeader;