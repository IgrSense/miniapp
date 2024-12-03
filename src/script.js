document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.case-media video');
  
  // Функция для проверки видимости элемента
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Загружаем видео только когда оно в зоне видимости
  const handleVideoVisibility = () => {
    videos.forEach(video => {
      if (isElementInViewport(video)) {
        const source = video.querySelector('source');
        if (!video.src && source.dataset.src) {
          source.src = source.dataset.src;
          video.load();
        }
      }
    });
  };

  // Слушаем события скролла и изменения размера окна
  window.addEventListener('scroll', handleVideoVisibility);
  window.addEventListener('resize', handleVideoVisibility);
  
  // Первичная проверка
  handleVideoVisibility();
}); 