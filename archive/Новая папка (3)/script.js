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

        let currentSlide = 0;
        
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
            
            // Обновляем точки
            document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }
        
        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }
        
        function prevSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Автопереключение
        let slideInterval = setInterval(nextSlide, 5000);
        
        wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
        wrapper.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
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
}); 