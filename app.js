// Food Safety & Smart Diet Scanner App - JavaScript

// Global State
let userProfile = null;
let currentProduct = null;
let reviews = [];

// Test Product Database
const productDatabase = {
    '123456789012': {
        name: 'Whole Grain Healthy Cereal',
        brand: 'NutriLife',
        expiryDate: '2025-12-31',
        ingredients: 'Whole wheat, oats, honey, dried fruits, nuts, natural preservatives',
        calories: 150,
        sugar: 8,
        fat: 3,
        salt: 0.3,
        preservatives: 'low',
        category: 'healthy'
    },
    '234567890123': {
        name: 'Super Sweet Soda',
        brand: 'FizzCo',
        expiryDate: '2024-06-15',
        ingredients: 'Carbonated water, high fructose corn syrup, artificial flavors, colors, preservatives',
        calories: 140,
        sugar: 39,
        fat: 0,
        salt: 0.05,
        preservatives: 'high',
        category: 'unhealthy'
    },
    '345678901234': {
        name: 'Crispy Potato Chips',
        brand: 'SnackMaster',
        expiryDate: '2025-03-20',
        ingredients: 'Potatoes, vegetable oil, salt, artificial flavors, preservatives',
        calories: 160,
        sugar: 0,
        fat: 10,
        salt: 0.5,
        preservatives: 'medium',
        category: 'unhealthy'
    },
    '456789012345': {
        name: 'Fresh Orange Juice',
        brand: 'NatureFresh',
        expiryDate: '2024-02-10',
        ingredients: '100% fresh oranges, vitamin C added',
        calories: 110,
        sugar: 21,
        fat: 0,
        salt: 0,
        preservatives: 'none',
        category: 'healthy'
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadReviews();
    setupNavigation();
    setupProfileForm();
    setupScanner();
    setupReviews();
});

// Navigation System
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.getAttribute('data-page');
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// Profile Management
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        userProfile = {
            name: document.getElementById('userName').value,
            age: parseInt(document.getElementById('userAge').value),
            weight: parseInt(document.getElementById('userWeight').value),
            healthGoal: document.getElementById('healthGoal').value
        };
        
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Show success message
        document.getElementById('profileSaved').classList.remove('hidden');
        document.getElementById('profileSaved').classList.add('slide-up');
        
        // Update display
        updateProfileDisplay();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            document.getElementById('profileSaved').classList.add('hidden');
        }, 3000);
    });
}

function loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
        updateProfileDisplay();
        
        // Populate form
        document.getElementById('userName').value = userProfile.name;
        document.getElementById('userAge').value = userProfile.age;
        document.getElementById('userWeight').value = userProfile.weight;
        document.getElementById('healthGoal').value = userProfile.healthGoal;
    }
}

function updateProfileDisplay() {
    const display = document.getElementById('profileInfo');
    const goalLabels = {
        'weight-loss': 'Weight Loss',
        'weight-gain': 'Weight Gain',
        'diabetic': 'Diabetic Friendly',
        'heart-healthy': 'Heart Healthy',
        'normal': 'Normal Diet'
    };
    
    display.innerHTML = `
        <div style="display: grid; gap: 8px;">
            <p><strong>👤 Name:</strong> ${userProfile.name}</p>
            <p><strong>🎂 Age:</strong> ${userProfile.age} years</p>
            <p><strong>⚖️ Weight:</strong> ${userProfile.weight} kg</p>
            <p><strong>🎯 Health Goal:</strong> ${goalLabels[userProfile.healthGoal]}</p>
        </div>
    `;
}

// Scanner System
function setupScanner() {
    const scanBtn = document.getElementById('scanBtn');
    const manualSubmit = document.getElementById('manualSubmit');
    const manualInput = document.getElementById('manualBarcode');
    
    scanBtn.addEventListener('click', () => {
        simulateCameraScan();
    });
    
    manualSubmit.addEventListener('click', () => {
        const barcode = manualInput.value.trim();
        if (barcode) {
            processBarcode(barcode);
        }
    });
    
    manualInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const barcode = manualInput.value.trim();
            if (barcode) {
                processBarcode(barcode);
            }
        }
    });
}

function simulateCameraScan() {
    const scannerArea = document.getElementById('scannerArea');
    const scanBtn = document.getElementById('scanBtn');
    const loading = document.getElementById('scanLoading');
    
    // Start scanning animation
    scannerArea.classList.add('scanning');
    scanBtn.disabled = true;
    scanBtn.innerHTML = '<span>🔄 Scanning...</span>';
    
    // Show loading
    loading.classList.remove('hidden');
    
    // Simulate scan delay
    setTimeout(() => {
        // Pick a random test barcode
        const barcodes = Object.keys(productDatabase);
        const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
        
        processBarcode(randomBarcode);
        
        // Reset UI
        scannerArea.classList.remove('scanning');
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span>🔍 Start Camera Scan</span>';
        loading.classList.add('hidden');
    }, 2000);
}

function testBarcode(barcode) {
    document.getElementById('manualBarcode').value = barcode;
    processBarcode(barcode);
}

function processBarcode(barcode) {
    const loading = document.getElementById('scanLoading');
    loading.classList.remove('hidden');
    
    // Simulate API call delay
    setTimeout(() => {
        let product = productDatabase[barcode];
        
        // If barcode not in database, create random product
        if (!product) {
            product = generateRandomProduct(barcode);
        }
        
        currentProduct = {
            ...product,
            barcode: barcode,
            scannedAt: new Date().toISOString()
        };
        
        // Analyze product
        analyzeProduct();
        
        // Show results
        showResults();
        
        loading.classList.add('hidden');
        
        // Navigate to results page
        document.querySelector('[data-page="results"]').click();
    }, 1000);
}

function generateRandomProduct(barcode) {
    const categories = ['healthy', 'unhealthy'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    if (category === 'healthy') {
        return {
            name: 'Natural Product ' + barcode.slice(-4),
            brand: 'OrganicBrand',
            expiryDate: '2025-06-30',
            ingredients: 'Natural ingredients, whole grains, fruits',
            calories: Math.floor(Math.random() * 100) + 50,
            sugar: Math.floor(Math.random() * 10) + 2,
            fat: Math.floor(Math.random() * 5) + 1,
            salt: Math.random().toFixed(2),
            preservatives: 'low',
            category: 'healthy'
        };
    } else {
        return {
            name: 'Processed Snack ' + barcode.slice(-4),
            brand: 'FastFood Co',
            expiryDate: '2024-12-31',
            ingredients: 'Processed ingredients, artificial flavors, preservatives',
            calories: Math.floor(Math.random() * 200) + 150,
            sugar: Math.floor(Math.random() * 30) + 15,
            fat: Math.floor(Math.random() * 15) + 5,
            salt: (Math.random() * 1 + 0.3).toFixed(2),
            preservatives: 'high',
            category: 'unhealthy'
        };
    }
}

// Product Analysis
function analyzeProduct() {
    const product = currentProduct;
    const currentDate = new Date();
    const expiryDate = new Date(product.expiryDate);
    
    // Food Safety Check
    const safetyResult = checkFoodSafety(product, currentDate, expiryDate);
    product.safety = safetyResult;
    
    // Health Score
    const healthScore = calculateHealthScore(product);
    product.healthScore = healthScore;
    
    // Diet Compatibility
    if (userProfile) {
        const compatibility = checkDietCompatibility(product, userProfile);
        product.compatibility = compatibility;
    }
    
    // Recommendations
    const recommendations = generateRecommendations(product, userProfile);
    product.recommendations = recommendations;
}

function checkFoodSafety(product, currentDate, expiryDate) {
    const daysUntilExpiry = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
        return {
            status: 'unsafe',
            label: '🔴 Unsafe',
            message: `⚠️ This product expired on ${formatDate(expiryDate)}. It is not safe to consume expired products. Please discard it immediately.`,
            icon: '🔴'
        };
    } else if (daysUntilExpiry < 7) {
        return {
            status: 'risky',
            label: '🟡 Risky',
            message: `⚠️ This product expires in ${daysUntilExpiry} day(s). Consume it soon or check for any signs of spoilage before use.`,
            icon: '🟡'
        };
    } else if (product.preservatives === 'high') {
        return {
            status: 'risky',
            label: '🟡 Risky',
            message: `⚠️ This product contains high levels of preservatives. While it's within expiry, consider limiting consumption of heavily processed foods.`,
            icon: '🟡'
        };
    } else {
        return {
            status: 'safe',
            label: '🟢 Safe',
            message: `✅ This product is fresh and within its expiry date. It can be consumed safely. Expires on ${formatDate(expiryDate)}.`,
            icon: '🟢'
        };
    }
}

function calculateHealthScore(product) {
    let score = 100;
    
    // Deduct points for high sugar (ideal: <10g per serving)
    if (product.sugar > 20) score -= 20;
    else if (product.sugar > 15) score -= 15;
    else if (product.sugar > 10) score -= 10;
    else if (product.sugar > 5) score -= 5;
    
    // Deduct points for high fat (ideal: <5g per serving)
    if (product.fat > 15) score -= 15;
    else if (product.fat > 10) score -= 10;
    else if (product.fat > 5) score -= 5;
    
    // Deduct points for high salt (ideal: <0.5g per serving)
    if (product.salt > 1.0) score -= 15;
    else if (product.salt > 0.5) score -= 10;
    else if (product.salt > 0.3) score -= 5;
    
    // Deduct points for high calories (ideal: <150 per serving)
    if (product.calories > 300) score -= 20;
    else if (product.calories > 200) score -= 15;
    else if (product.calories > 150) score -= 10;
    
    // Deduct points for preservatives
    if (product.preservatives === 'high') score -= 15;
    else if (product.preservatives === 'medium') score -= 8;
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    let description = '';
    if (score >= 80) description = 'Excellent! This is a very healthy choice.';
    else if (score >= 60) description = 'Good choice with some considerations.';
    else if (score >= 40) description = 'Moderate health value. Consume in moderation.';
    else description = 'Low health value. Consider healthier alternatives.';
    
    return {
        score: score,
        description: description,
        color: score >= 60 ? 'green' : (score >= 40 ? 'yellow' : 'red')
    };
}

function checkDietCompatibility(product, profile) {
    const goal = profile.healthGoal;
    let compatibility = 'good';
    let message = 'This product is suitable for your health goal.';
    let icon = '✅';
    
    switch (goal) {
        case 'weight-loss':
            if (product.calories > 200 || product.sugar > 15 || product.fat > 10) {
                compatibility = 'bad';
                message = 'High in calories, sugar, or fat. Not ideal for weight loss goals.';
                icon = '❌';
            } else if (product.calories > 150) {
                compatibility = 'moderate';
                message = 'Moderate calorie content. Good for weight loss in controlled portions.';
                icon = '⚠️';
            }
            break;
            
        case 'weight-gain':
            if (product.calories < 100) {
                compatibility = 'moderate';
                message = 'Lower calorie content. You may need additional foods for weight gain.';
                icon = '⚠️';
            } else if (product.calories >= 150 && product.fat >= 5) {
                compatibility = 'good';
                message = 'Good calorie and fat content for weight gain goals.';
                icon = '✅';
            }
            break;
            
        case 'diabetic':
            if (product.sugar > 15) {
                compatibility = 'bad';
                message = 'High sugar content. Not recommended for diabetic diet.';
                icon = '❌';
            } else if (product.sugar > 8) {
                compatibility = 'moderate';
                message = 'Moderate sugar content. Monitor blood sugar levels if consumed.';
                icon = '⚠️';
            }
            break;
            
        case 'heart-healthy':
            if (product.salt > 0.8 || product.fat > 10) {
                compatibility = 'bad';
                message = 'High in sodium or fat. Not heart-healthy.';
                icon = '❌';
            } else if (product.salt > 0.5 || product.fat > 5) {
                compatibility = 'moderate';
                message = 'Moderate sodium or fat content. Limit consumption.';
                icon = '⚠️';
            }
            break;
            
        case 'normal':
            if (product.healthScore.score < 40) {
                compatibility = 'moderate';
                message = 'Low health score. Enjoy occasionally as part of balanced diet.';
                icon = '⚠️';
            }
            break;
    }
    
    return {
        compatibility: compatibility,
        message: message,
        icon: icon
    };
}

function generateRecommendations(product, profile) {
    const recommendations = [];
    
    if (product.sugar > 20) {
        recommendations.push({
            icon: '🍎',
            title: 'High Sugar Detected',
            message: 'Try fresh fruits, unsweetened yogurt, or naturally sweet alternatives instead.'
        });
    }
    
    if (product.fat > 10) {
        recommendations.push({
            icon: '🥗',
            title: 'High Fat Content',
            message: 'Consider grilled, baked, or steamed options. Choose lean proteins and vegetables.'
        });
    }
    
    if (product.salt > 0.8) {
        recommendations.push({
            icon: '🧂',
            title: 'High Sodium',
            message: 'Try herbs and spices for flavor. Choose low-sodium alternatives when possible.'
        });
    }
    
    if (product.preservatives === 'high') {
        recommendations.push({
            icon: '🌿',
            title: 'Many Preservatives',
            message: 'Look for organic or minimally processed alternatives with fewer additives.'
        });
    }
    
    if (product.healthScore.score < 50 && profile && profile.healthGoal === 'weight-loss') {
        recommendations.push({
            icon: '🥣',
            title: 'Weight Loss Alternative',
            message: 'Try oatmeal with fruits, vegetable smoothies, or whole grain snacks.'
        });
    }
    
    // If product is healthy, give positive recommendation
    if (product.healthScore.score >= 80) {
        recommendations.push({
            icon: '⭐',
            title: 'Great Choice!',
            message: 'This is a nutritious option! Continue making healthy food choices.'
        });
    }
    
    return recommendations;
}

// Display Results
function showResults() {
    document.getElementById('noResults').classList.add('hidden');
    document.getElementById('resultsContent').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('slide-up');
    
    const product = currentProduct;
    
    // Safety Badge
    const safetyBadge = document.getElementById('safetyBadge');
    safetyBadge.className = 'safety-badge ' + product.safety.status;
    safetyBadge.innerHTML = `${product.safety.icon} ${product.safety.label}`;
    document.getElementById('safetyMessage').textContent = product.safety.message;
    
    // Product Information
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('expiryDate').textContent = formatDate(new Date(product.expiryDate));
    document.getElementById('ingredients').textContent = product.ingredients;
    document.getElementById('calories').textContent = product.calories;
    document.getElementById('sugar').textContent = product.sugar;
    document.getElementById('fat').textContent = product.fat;
    document.getElementById('salt').textContent = product.salt;
    
    // Health Score
    document.getElementById('healthScore').textContent = product.healthScore.score;
    document.getElementById('healthDescription').textContent = product.healthScore.description;
    document.getElementById('healthMeterFill').style.width = product.healthScore.score + '%';
    
    // Diet Compatibility
    if (product.compatibility) {
        const compatResult = document.getElementById('compatibilityResult');
        compatResult.className = 'compatibility-result ' + product.compatibility.compatibility;
        document.getElementById('compatibilityIcon').textContent = product.compatibility.icon;
        document.getElementById('compatibilityTitle').textContent = 
            product.compatibility.compatibility === 'good' ? 'Good for you' :
            product.compatibility.compatibility === 'moderate' ? 'Eat in moderation' :
            'Not suitable for your health';
        document.getElementById('compatibilityMessage').textContent = product.compatibility.message;
    }
    
    // Recommendations
    const recsContainer = document.getElementById('recommendations');
    if (product.recommendations.length > 0) {
        document.getElementById('recommendationsCard').classList.remove('hidden');
        recsContainer.innerHTML = product.recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.message}</p>
                </div>
            </div>
        `).join('');
    } else {
        document.getElementById('recommendationsCard').classList.add('hidden');
    }
    
    // Update reviews section
    updateReviewsSection();
}

// Reviews System
function setupReviews() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            updateStarDisplay(selectedRating);
        });
    });
    
    document.getElementById('submitReview').addEventListener('click', () => {
        if (!currentProduct) {
            alert('Please scan a product first!');
            return;
        }
        
        const rating = selectedRating;
        const text = document.getElementById('reviewText').value.trim();
        
        if (rating === 0) {
            alert('Please select a star rating!');
            return;
        }
        
        // Create review
        const review = {
            id: Date.now(),
            barcode: currentProduct.barcode,
            productName: currentProduct.name,
            rating: rating,
            text: text,
            safetyMark: document.getElementById('markSafe').classList.contains('active') ? 'safe' :
                      document.getElementById('markUnsafe').classList.contains('active') ? 'unsafe' : null,
            userName: userProfile ? userProfile.name : 'Anonymous',
            date: new Date().toISOString()
        };
        
        reviews.unshift(review);
        localStorage.setItem('productReviews', JSON.stringify(reviews));
        
        // Reset form
        selectedRating = 0;
        updateStarDisplay(0);
        document.getElementById('reviewText').value = '';
        document.getElementById('markSafe').classList.remove('active');
        document.getElementById('markUnsafe').classList.remove('active');
        
        // Update display
        updateReviewsList();
        
        alert('Review submitted successfully!');
    });
    
    document.getElementById('markSafe').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('markUnsafe').classList.remove('active');
    });
    
    document.getElementById('markUnsafe').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('markSafe').classList.remove('active');
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        star.classList.toggle('active', starRating <= rating);
    });
}

function loadReviews() {
    const saved = localStorage.getItem('productReviews');
    if (saved) {
        reviews = JSON.parse(saved);
    }
}

function updateReviewsSection() {
    if (!currentProduct) {
        document.getElementById('noProductReview').classList.remove('hidden');
        document.getElementById('reviewSection').classList.add('hidden');
        return;
    }
    
    document.getElementById('noProductReview').classList.add('hidden');
    document.getElementById('reviewSection').classList.remove('hidden');
    document.getElementById('reviewProductName').textContent = currentProduct.name;
    
    updateReviewsList();
}

function updateReviewsList() {
    const list = document.getElementById('reviewList');
    const productReviews = reviews.filter(r => r.barcode === currentProduct.barcode);
    
    if (productReviews.length === 0) {
        list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    list.innerHTML = productReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.userName}</span>
                <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
            ${review.text ? `<p class="review-text">${review.text}</p>` : ''}
            ${review.safetyMark ? `
                <span class="review-badge ${review.safetyMark}">
                    ${review.safetyMark === 'safe' ? '🟢 Marked Safe' : '🔴 Marked Unsafe'}
                </span>
            ` : ''}
            <p style="color: var(--text-light); font-size: 0.8rem; margin-top: 8px;">
                ${formatDate(new Date(review.date))}
            </p>
        </div>
    `).join('');
}

// Utility Functions
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Initialize with today's date for testing
console.log('FoodGuard App Initialized');
console.log('Test Barcodes: 123456789012, 234567890123, 345678901234, 456789012345');