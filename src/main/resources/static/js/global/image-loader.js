function applyImageLoader() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      return;
    }
    
    if (img.parentElement && img.parentElement.classList.contains('image-loader-wrapper')) {
      return;
    }
    
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-loader-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f5f0eb;
    `;
    
    const loader = document.createElement('div');
    loader.className = 'image-loader-spinner';
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 4px solid rgba(212, 175, 55, 0.2);
      border-top: 4px solid #d4af37;
      border-radius: 50%;
      animation: spinImageLoader 0.8s linear infinite;
      z-index: 1;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spinImageLoader {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .image-loader-wrapper img {
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .image-loader-wrapper img.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(loader);
    
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      loader.style.display = 'none';
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        loader.style.display = 'none';
      });
      
      img.addEventListener('error', function() {
        loader.style.display = 'none';
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #999;
          font-size: 0.9rem;
          text-align: center;
        `;
        fallback.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; display: block; margin-bottom: 8px;"></i> Imagem indisponível';
        wrapper.appendChild(fallback);
      });
    }
  });
}

function applyCarouselImageLoader() {
  const carouselItems = document.querySelectorAll('.carousel-item');
  
  carouselItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    
    if (img.parentElement && img.parentElement.classList.contains('carousel-image-wrapper')) {
      return;
    }
    
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-image-wrapper';
    wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f5f0eb;
      z-index: 0;
    `;
    
    const loader = document.createElement('div');
    loader.className = 'carousel-image-loader';
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      border: 4px solid rgba(212, 175, 55, 0.2);
      border-top: 4px solid #d4af37;
      border-radius: 50%;
      animation: spinCarouselLoader 0.8s linear infinite;
      z-index: 2;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spinCarouselLoader {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .carousel-item {
        position: relative;
      }
      .carousel-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      .carousel-image-wrapper img.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    item.style.position = 'relative';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(loader);
    
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      loader.style.display = 'none';
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        loader.style.display = 'none';
      });
      
      img.addEventListener('error', function() {
        loader.style.display = 'none';
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(0,0,0,0.5);
          font-size: 1rem;
          text-align: center;
          z-index: 1;
        `;
        fallback.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; display: block; margin-bottom: 10px;"></i> Imagem indisponível';
        wrapper.appendChild(fallback);
      });
    }
  });
}

function applyCardImageLoader() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const img = card.querySelector('.card-image img');
    if (!img) return;
    
    if (img.parentElement && img.parentElement.classList.contains('card-image-wrapper')) {
      return;
    }
    
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'card-image-wrapper';
    wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f5f0eb;
      z-index: 0;
    `;
    
    const loader = document.createElement('div');
    loader.className = 'card-image-loader';
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 35px;
      height: 35px;
      border: 3px solid rgba(212, 175, 55, 0.2);
      border-top: 3px solid #d4af37;
      border-radius: 50%;
      animation: spinCardLoader 0.8s linear infinite;
      z-index: 2;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spinCardLoader {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .card-image {
        position: relative;
        overflow: hidden;
        background: #f5f0eb;
        min-height: 200px;
      }
      .card-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .card-image-wrapper img.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    const imageContainer = img.parentElement;
    imageContainer.style.position = 'relative';
    imageContainer.style.background = '#f5f0eb';
    imageContainer.style.minHeight = '200px';
    imageContainer.appendChild(wrapper);
    wrapper.appendChild(img);
    wrapper.appendChild(loader);
    
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      loader.style.display = 'none';
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        loader.style.display = 'none';
      });
      
      img.addEventListener('error', function() {
        loader.style.display = 'none';
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(0,0,0,0.4);
          font-size: 0.8rem;
          text-align: center;
          z-index: 1;
        `;
        fallback.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; display: block; margin-bottom: 5px;"></i> Sem imagem';
        wrapper.appendChild(fallback);
      });
    }
  });
}

function applyClassifiedImageLoader() {
  const classifiedItems = document.querySelectorAll('.classified-item');
  
  classifiedItems.forEach(item => {
    const img = item.querySelector('.classified-image img');
    if (!img) return;
    
    if (img.parentElement && img.parentElement.classList.contains('classified-image-wrapper')) {
      return;
    }
    
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'classified-image-wrapper';
    wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f5f0eb;
      z-index: 0;
    `;
    
    const loader = document.createElement('div');
    loader.className = 'classified-image-loader';
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 35px;
      height: 35px;
      border: 3px solid rgba(212, 175, 55, 0.2);
      border-top: 3px solid #d4af37;
      border-radius: 50%;
      animation: spinClassifiedLoader 0.8s linear infinite;
      z-index: 2;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spinClassifiedLoader {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .classified-image {
        position: relative;
        overflow: hidden;
        background: #f5f0eb;
        min-height: 200px;
      }
      .classified-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .classified-image-wrapper img.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    const imageContainer = img.parentElement;
    imageContainer.style.position = 'relative';
    imageContainer.style.background = '#f5f0eb';
    imageContainer.style.minHeight = '200px';
    imageContainer.appendChild(wrapper);
    wrapper.appendChild(img);
    wrapper.appendChild(loader);
    
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      loader.style.display = 'none';
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        loader.style.display = 'none';
      });
      
      img.addEventListener('error', function() {
        loader.style.display = 'none';
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(0,0,0,0.4);
          font-size: 0.8rem;
          text-align: center;
          z-index: 1;
        `;
        fallback.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; display: block; margin-bottom: 5px;"></i> Sem imagem';
        wrapper.appendChild(fallback);
      });
    }
  });
}

function applyDetalheImageLoader() {
  const img = document.querySelector('.detalhe-image img');
  if (!img) return;
  
  if (img.parentElement && img.parentElement.classList.contains('detalhe-image-wrapper')) {
    return;
  }
  
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    return;
  }
  
  const wrapper = document.createElement('div');
  wrapper.className = 'detalhe-image-wrapper';
  wrapper.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f5f0eb;
    z-index: 0;
  `;
  
  const loader = document.createElement('div');
  loader.className = 'detalhe-image-loader';
  loader.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border: 4px solid rgba(212, 175, 55, 0.2);
    border-top: 4px solid #d4af37;
    border-radius: 50%;
    animation: spinDetalheLoader 0.8s linear infinite;
    z-index: 2;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spinDetalheLoader {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    .detalhe-image {
      position: relative;
      overflow: hidden;
      background: #f5f0eb;
      min-height: 300px;
    }
    .detalhe-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .detalhe-image-wrapper img.loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  
  const container = img.parentElement;
  container.style.position = 'relative';
  container.style.background = '#f5f0eb';
  container.style.minHeight = '300px';
  container.appendChild(wrapper);
  wrapper.appendChild(img);
  wrapper.appendChild(loader);
  
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('loaded');
    loader.style.display = 'none';
  } else {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
      loader.style.display = 'none';
    });
    
    img.addEventListener('error', function() {
      loader.style.display = 'none';
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(0,0,0,0.5);
        font-size: 1rem;
        text-align: center;
        z-index: 1;
      `;
      fallback.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; display: block; margin-bottom: 10px;"></i> Imagem indisponível';
      wrapper.appendChild(fallback);
    });
  }
}

function initImageLoaders() {
  applyCarouselImageLoader();
  applyCardImageLoader();
  applyClassifiedImageLoader();
  applyDetalheImageLoader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageLoaders);
} else {
  initImageLoaders();
}