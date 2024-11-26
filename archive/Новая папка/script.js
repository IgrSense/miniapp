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

    // Инициализируем калькулятор
    calculatePrice();
}); 