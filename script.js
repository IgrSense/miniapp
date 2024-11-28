document.addEventListener('DOMContentLoaded', function() {
    // Базовые цены для разных типов бизнеса
    const businessTypes = {
        shop: { multiplier: 1, name: 'Онлайн-магазин' },
        service: { multiplier: 0.9, name: 'Сервисная компания' },
        startup: { multiplier: 1.1, name: 'Стартап' }
    };

    // Базовые тарифы
    const complexityTypes = {
        basic: {
            price: 3000,
            duration: { min: 2, max: 3 }
        },
        standard: {
            price: 6000,
            duration: { min: 3, max: 5 }
        },
        premium: {
            price: 12000,
            duration: { min: 6, max: 8 }
        }
    };

    // Коэффициенты срочности
    const urgencyMultipliers = {
        normal: { price: 1, time: 1 },
        urgent: { price: 1.3, time: 0.8 },
        very_urgent: { price: 1.5, time: 0.6 }
    };

    function calculatePrice() {
        const businessType = document.getElementById('productType').value;
        const complexity = document.getElementById('complexity').value;
        const urgency = document.getElementById('urgency').value;
        const additionalFeatures = document.querySelectorAll('input[name="additional"]:checked');

        // Базовая цена
        let basePrice = complexityTypes[complexity].price;
        
        // Применяем множитель типа бизнеса
        basePrice *= businessTypes[businessType].multiplier;
        
        // Добавляем стоимость дополнительных функций
        let additionalPrice = 0;
        let additionalTime = 0;

        additionalFeatures.forEach(feature => {
            const priceStr = feature.closest('.feature-option').querySelector('.feature-price').textContent;
            let price = parseInt(priceStr.match(/\d+/)[0]); // Берем первое число из строки
            additionalPrice += price;
            additionalTime += parseFloat(feature.dataset.time);
        });

        // Применяем множитель срочности к общей сумме
        const finalPrice = (basePrice + additionalPrice) * urgencyMultipliers[urgency].price;

        // Расчет времени
        const baseMinTime = complexityTypes[complexity].duration.min;
        const baseMaxTime = complexityTypes[complexity].duration.max;
        
        // Добавляем время на дополнительные функции
        const totalMinTime = baseMinTime + additionalTime;
        const totalMaxTime = baseMaxTime + additionalTime;
        
        // Применяем коэффициент срочности к времени
        const finalMinTime = Math.ceil(totalMinTime / urgencyMultipliers[urgency].time);
        const finalMaxTime = Math.ceil(totalMaxTime / urgencyMultipliers[urgency].time);

        // Обновляем значения на странице
        document.querySelector('.time-estimate .estimate-value').textContent = 
            `${finalMinTime}-${finalMaxTime} недель`;
        
        document.querySelector('.traditional-time .estimate-value').textContent = 
            `${finalMinTime * 4}-${finalMaxTime * 4} недель`;
        
        document.querySelector('.price-value').textContent = 
            `$${Math.round(finalPrice)}`;

        // Обновляем преимущества
        updateBenefits(finalPrice);
    }

    function updateBenefits(price) {
        const traditionalPrice = price * 2.5;
        const savings = traditionalPrice - price;
        const savingsPercent = Math.round((savings / traditionalPrice) * 100);

        document.querySelector('.calculator-benefits').innerHTML = `
            <div class="benefit-item">
                <div class="benefit-icon">⚡</div>
                <div class="benefit-content">
                    <h4>Ускорение разработки</h4>
                    <p>В 5-10 раз быстрее с AI</p>
                </div>
            </div>
            <div class="benefit-item">
                <div class="benefit-icon">💰</div>
                <div class="benefit-content">
                    <h4>Экономия бюджета</h4>
                    <p>До ${savingsPercent}% экономии</p>
                </div>
            </div>
            <div class="benefit-item">
                <div class="benefit-icon">🎯</div>
                <div class="benefit-content">
                    <h4>Точность оценки</h4>
                    <p>90% точность прогнозов</p>
                </div>
            </div>
            <div class="benefit-item">
                <div class="benefit-icon">🔄</div>
                <div class="benefit-content">
                    <h4>Гибкость изменений</h4>
                    <p>Быстрое внесение правок</p>
                </div>
            </div>
        `;
    }

    // Добавляем слушатели событий
    document.getElementById('productType').addEventListener('change', calculatePrice);
    document.getElementById('complexity').addEventListener('change', calculatePrice);
    document.getElementById('urgency').addEventListener('change', calculatePrice);

    // Добавляем слушатели для чекбоксов
    document.querySelectorAll('input[name="additional"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    // Инициализация слайдера кейсов
    function initCasesSlider() {
        const wrapper = document.querySelector('.cases-wrapper');
        const slides = document.querySelectorAll('.case-card');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        if (!wrapper || !slides.length) return;

        const SLIDE_DURATION = 10000; // 10 секунд на слайд
        let currentSlide = 0;
        let progressBar;
        
        // Создаем и добавляем индикатор прогресса
        function createProgressBar() {
            progressBar = document.createElement('div');
            progressBar.classList.add('slider-progress');
            
            const progressBarInner = document.createElement('div');
            progressBarInner.classList.add('slider-progress-inner');
            
            progressBar.appendChild(progressBarInner);
            wrapper.parentElement.appendChild(progressBar);
        }
        
        // Обновляем прогресс-бар
        function updateProgress(reset = false) {
            const progressInner = progressBar.querySelector('.slider-progress-inner');
            progressInner.style.transition = reset ? 'none' : `width ${SLIDE_DURATION}ms linear`;
            progressInner.style.width = reset ? '0%' : '100%';
            
            if (reset) {
                // Форсируем перерисовку
                progressInner.offsetHeight;
                progressInner.style.transition = `width ${SLIDE_DURATION}ms linear`;
                progressInner.style.width = '100%';
            }
        }

        // Показываем первый слайд и скрываем остальные
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.style.opacity = '1';
                slide.classList.add('active');
            } else {
                slide.style.opacity = '0';
            }
        });
        
        // Создаем точки навигации
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        function goToSlide(index) {
            slides[currentSlide].style.opacity = '0';
            slides[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            slides[currentSlide].style.opacity = '1';
            slides[currentSlide].classList.add('active');
            wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Обновляем точки и прогресс
            document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
            updateProgress(true);
        }
        
        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }
        
        function prevSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Создаем прогресс-бар
        createProgressBar();
        updateProgress(true);
        
        // Автопереключение
        let slideInterval = setInterval(() => {
            nextSlide();
        }, SLIDE_DURATION);
        
        // Пауза при наведении
        wrapper.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
            const progressInner = progressBar.querySelector('.slider-progress-inner');
            progressInner.style.animationPlayState = 'paused';
        });
        
        wrapper.addEventListener('mouseleave', () => {
            updateProgress(true);
            slideInterval = setInterval(() => {
                nextSlide();
            }, SLIDE_DURATION);
        });
    }

    // Инициализируем калькулятор и слайдер
    calculatePrice();
    initCasesSlider();

    // Функция для инициализации карточек преимуществ
    function initAdvantageCards() {
        const cards = document.querySelectorAll('.advantage-card');
        
        cards.forEach(card => {
            const detailsBtn = card.querySelector('.details-btn');
            const hiddenContent = card.querySelector('.hidden-content');
            
            if (detailsBtn && hiddenContent) {
                detailsBtn.addEventListener('click', () => {
                    const isActive = card.classList.contains('active');
                    
                    // Закрываем все карточки
                    cards.forEach(c => {
                        c.classList.remove('active');
                        const btn = c.querySelector('.details-btn');
                        if (btn) btn.textContent = 'Подробнее';
                        const content = c.querySelector('.hidden-content');
                        if (content) content.style.maxHeight = '0px';
                    });
                    
                    // Если карточка не была активна, открываем её
                    if (!isActive) {
                        card.classList.add('active');
                        detailsBtn.textContent = 'Свернуть';
                        hiddenContent.style.maxHeight = `${hiddenContent.scrollHeight}px`;
                    }
                });
            }
        });
    }

    // Добавляем вызов функции в существующий DOMContentLoaded
    initAdvantageCards();

    function initCaseMediaSlider() {
        const mediaSliders = document.querySelectorAll('.case-media-slider');
        
        mediaSliders.forEach(slider => {
            const slides = slider.querySelectorAll('.case-slide');
            const dots = slider.querySelectorAll('.case-media-dot');
            let currentSlide = 0;
            
            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                slides[index].classList.add('active');
                dots[index].classList.add('active');
            }
            
            // Обработчики для точек
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
            
            // Автопереключение
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 3000);
        });
    }

    // Добавляем вызов функции в существующий DOMContentLoaded
    initCaseMediaSlider();

    document.querySelectorAll('.details-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const details = button.closest('.example-preview').querySelector('.example-details');
            details.classList.toggle('active');
            button.textContent = details.classList.contains('active') ? 'скрыть' : 'подробнее';
        });
    });

    // Добавляем обработчик отправки формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        console.log('Form found:', contactForm); // Проверяем, находит ли форму

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted'); // Проверяем, срабатывает ли событие
            
            // Получаем значения полей
            const productType = document.getElementById('productType')?.value;
            const telegram = document.querySelector('input[name="telegram"]')?.value;
            const email = document.querySelector('input[name="email"]')?.value;
            const phone = document.querySelector('input[name="phone"]')?.value;
            const message = document.querySelector('textarea[name="message"]')?.value;

            console.log('Form data:', { productType, telegram, email, phone, message }); // Проверяем данные

            // Создаем объект с данными формы
            const formData = {
                productType,
                telegram,
                email,
                phone,
                message,
                source: 'landing_form',
                timestamp: new Date().toISOString()
            };

            try {
                console.log('Sending data:', formData);
                
                // Отправляем запросы параллельно на оба вебхука с режимом no-cors
                const responses = await Promise.all([
                    fetch('http://n8n2.supashkola.ru/webhook/tgappsdev', {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    }),
                    fetch('https://webhook.site/69fadba3-8cda-4c6f-92de-8b3a0c8cb35c', {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    })
                ]);

                console.log('Responses:', responses);

                // При использовании mode: 'no-cors' мы не можем проверить response.ok
                // Поэтому просто считаем успешным сам факт отправки
                contactForm.reset();
                showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');

            } catch (error) {
                console.error('Error:', error);
                showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
            }
        });
    } else {
        console.error('Contact form not found'); // Если форма не найдена
    }

    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавляем стили для уведомления
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '12px';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.3s ease';
        
        if (type === 'success') {
            notification.style.background = 'rgba(76, 175, 80, 0.9)';
        } else {
            notification.style.background = 'rgba(244, 67, 54, 0.9)';
        }
        
        document.body.appendChild(notification);

        // Удаляем уведомление через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Добавляем обработчик на кнопку
    const submitButton = document.querySelector('.contact-form button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('.contact-form');
            if (form) {
                // Создаем и диспатчим событие submit
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                form.dispatchEvent(submitEvent);
            }
        });
    }
}); 