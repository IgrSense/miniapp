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

        // Удалим кнопку заказать
        document.querySelector('.order-btn')?.remove();

        // Обновим кнопку расчета
        const calcBtn = document.querySelector('.calc-btn');
        calcBtn.textContent = 'Получить точный расчет';
        calcBtn.addEventListener('click', function() {
            // Собираем данные для модального окна
            const businessType = document.getElementById('productType');
            const complexity = document.getElementById('complexity');
            const urgency = document.getElementById('urgency');
            const features = Array.from(document.querySelectorAll('input[name="additional"]:checked'))
                .map(checkbox => checkbox.closest('.feature-option').querySelector('.feature-text').textContent);

            // Заполняем сводку
            document.getElementById('summaryType').textContent = businessType.options[businessType.selectedIndex].text;
            document.getElementById('summaryComplexity').textContent = complexity.options[complexity.selectedIndex].text;
            document.getElementById('summaryUrgency').textContent = urgency.options[urgency.selectedIndex].text;
            document.getElementById('summaryFeatures').textContent = features.length ? features.join(', ') : 'Нет';
            document.getElementById('summaryPrice').textContent = document.querySelector('.price-value').textContent;

            // Сохраняем данные для отправки
            document.getElementById('calculatedPrice').value = finalPrice;
            document.getElementById('calculatorParams').value = JSON.stringify({
                businessType: businessType.value,
                complexity: complexity.value,
                urgency: urgency.value,
                features: features,
                price: finalPrice
            });

            // Показываем модальное окно
            const modal = document.getElementById('calculatorModal');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
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
        const dotsContainer = document.querySelector('.slider-dots');
        
        if (!wrapper || !slides.length) return;

        // Создаем кнопки навигации, если их нет
        let prevBtn = document.querySelector('.slider-prev');
        let nextBtn = document.querySelector('.slider-next');
        
        if (!prevBtn || !nextBtn) {
            const controls = document.createElement('div');
            controls.className = 'slider-controls';
            
            prevBtn = document.createElement('button');
            prevBtn.className = 'slider-prev';
            
            nextBtn = document.createElement('button');
            nextBtn.className = 'slider-next';
            
            controls.appendChild(prevBtn);
            controls.appendChild(nextBtn);
            
            wrapper.parentElement.appendChild(controls);
        }

        let currentSlide = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        // Создаем точки для навигации
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            // Проверяем валидность индекса
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

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

        // Обновляем обработчики для кнопок
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            goToSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            goToSlide(currentSlide + 1);
        });

        // Обработчики для свайпов (мобильные)
        wrapper.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        wrapper.addEventListener('touchmove', e => {
            if (!isSwiping) return;
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            if (!isSwiping) return;
            
            const swipeDistance = touchStartX - touchEndX;
            const threshold = 50; // Минимальное расстояние для свайпа

            if (Math.abs(swipeDistance) > threshold) {
                if (swipeDistance > 0 && currentSlide < slides.length - 1) {
                    goToSlide(currentSlide + 1);
                } else if (swipeDistance < 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
            }

            // Сбрасываем состояние свайпа
            isSwiping = false;
            touchStartX = 0;
            touchEndX = 0;
        });

        // Показываем первый слайд
        goToSlide(0);

        // Добавляем управление с клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentSlide + 1);
            }
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
            
            // Получаем значения полей
            const productType = document.getElementById('productType')?.value;
            const telegram = document.querySelector('input[name="telegram"]')?.value;
            const email = document.querySelector('input[name="email"]')?.value;
            const phone = document.querySelector('input[name="phone"]')?.value;
            const message = document.querySelector('textarea[name="message"]')?.value || '';

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

            console.log('Sending form data:', formData); // Добавляем лог для отладки

            try {
                console.log('Sending data:', formData);
                
                // Отправляем запросы параллельно на оба вебхука
                const responses = await Promise.all([
                    fetch('https://n8n2.supashkola.ru/webhook/tgappsdev', {
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

    // Добавляем обработчик для кнопки "Обсудить проект"
    const discussButton = document.querySelector('.services-cta .cta-button');
    
    discussButton.addEventListener('click', function(e) {
        e.preventDefault();
        const contactForm = document.getElementById('contact');
        contactForm.scrollIntoView({ behavior: 'smooth' });
    });

    // Обработка кнопок выбора тарифа
    const tariffButtons = document.querySelectorAll('.pricing-btn');
    const modal = document.getElementById('tariffModal');
    const closeModal = document.querySelector('.close-modal');
    const modalForm = document.querySelector('.modal-form');

    tariffButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tariffCard = this.closest('.pricing-card');
            const tariffName = tariffCard.querySelector('h3').textContent;
            const tariffPrice = tariffCard.querySelector('.price-amount').textContent;
            
            // Заполняем информацию о выбранном тарифе
            document.querySelector('.selected-tariff span').textContent = `${tariffName} (${tariffPrice})`;
            document.getElementById('selectedTariff').value = tariffName;
            
            // Показываем модальное окно
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        });
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Возвращаем прокрутку страницы
    });

    // Закрытие по клику вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Обработка отправки формы из модального окна
    modalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            tariff: document.getElementById('selectedTariff').value,
            telegram: this.querySelector('input[name="telegram"]').value,
            email: this.querySelector('input[name="email"]').value,
            phone: this.querySelector('input[name="phone"]').value,
            message: this.querySelector('textarea[name="message"]').value,
            source: 'tariff_modal',
            timestamp: new Date().toISOString()
        };

        try {
            // Отправляем запросы параллельно на оба вебхука
            const responses = await Promise.all([
                fetch('https://n8n2.supashkola.ru/webhook/tgappsdev', {
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

            modalForm.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');

        } catch (error) {
            console.error('Error:', error);
            showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
        }
    });

    // Добавим обработчики для модального окна калькулятора
    const calculatorModal = document.getElementById('calculatorModal');
    const closeCalculatorModal = calculatorModal.querySelector('.close-modal');
    const calculatorForm = calculatorModal.querySelector('.modal-form');

    // Закрытие по крестику
    closeCalculatorModal.addEventListener('click', function() {
        calculatorModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Закрытие по клику вне окна
    window.addEventListener('click', function(e) {
        if (e.target === calculatorModal) {
            calculatorModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Обработка отправки формы
    calculatorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            calculatedPrice: document.getElementById('calculatedPrice').value,
            calculatorParams: JSON.parse(document.getElementById('calculatorParams').value),
            telegram: this.querySelector('input[name="telegram"]').value,
            email: this.querySelector('input[name="email"]').value,
            phone: this.querySelector('input[name="phone"]').value,
            message: this.querySelector('textarea[name="message"]').value,
            source: 'calculator_modal',
            timestamp: new Date().toISOString()
        };

        try {
            // Отправляем запросы параллельно на оба вебхука
            const responses = await Promise.all([
                fetch('https://n8n2.supashkola.ru/webhook/tgappsdev', {
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

            calculatorForm.reset();
            calculatorModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');

        } catch (error) {
            console.error('Error:', error);
            showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
        }
    });
}); 