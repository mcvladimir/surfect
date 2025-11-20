document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const welcomeModal = document.getElementById('welcome-modal');
    const startButton = document.getElementById('start-button');
    const gameScreen = document.getElementById('game-screen');
    const mixingScreen = document.getElementById('mixing-screen');
    const resultScreen = document.getElementById('result-screen');
    
    // Step Elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    // Step Buttons
    const step1NextButton = document.getElementById('step-1-next');
    const step2NextButton = document.getElementById('step-2-next');
    const mixButton = document.getElementById('mix-button');
    const resetButton = document.getElementById('reset-button');
    
    // Input Elements
    const waterOptions = document.getElementById('water-options');
    const fragranceOptions = document.getElementById('fragrance-options');
    const tabletOptions = document.getElementById('tablet-options');

    // --- Game State ---
    let selectedWater = null;
    let selectedFragrance = null;
    let selectedTablets = null;
    
    // Optimal Values (Adjusted for 1-4 tablets)
    const OPTIMAL_WATER_OZ = 9;
    const OPTIMAL_TABLET_MIN = 2; // New optimal range for 1-4 tablets
    const OPTIMAL_TABLET_MAX = 3;
    const TARGET_QUALITY = 100;

    const FRAGRANCES = {
        'Iris Agave': '#8e24aa', // Purple
        'Perrine Lemon': '#ffeb3b', // Yellow
        'Lavender Eucalyptus': '#7e57c2', // Violet
        'Pacific Mist': '#03a9f4', // Light Blue
        'Cedar Fig': '#795548', // Brown
        'Fragrance-free': '#9e9e9e' // Grey
    };
    
    // --- Helper Functions ---

    // Function to render fragrance buttons
    const renderFragranceButtons = () => {
        for (const [scent, color] of Object.entries(FRAGRANCES)) {
            const button = document.createElement('button');
            button.className = 'btn fragrance-btn';
            button.dataset.scent = scent;
            button.innerHTML = `<i class="fas fa-droplet" style="color:${color};"></i> ${scent}`;
            fragranceOptions.appendChild(button);
        }
    };

    // Function to manage button selection state
    const selectButton = (containerId, className, datasetKey, value) => {
        document.querySelectorAll(`#${containerId} .${className}`).forEach(btn => btn.classList.remove('selected'));
        const selectedBtn = document.querySelector(`#${containerId} [data-${datasetKey}="${value}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    };

    // Function to update 'Enter' button status
    const updateNavigationButton = (button, selectionState) => {
        button.disabled = selectionState === null;
    };

    // --- Event Listeners ---

    // 0. Modal Start Button
    startButton.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    });

    // 1. Water Selection
    waterOptions.addEventListener('click', (e) => {
        const target = e.target.closest('.water-btn');
        if (target) {
            selectedWater = parseInt(target.dataset.oz);
            selectButton('water-options', 'water-btn', 'oz', selectedWater);
            updateNavigationButton(step1NextButton, selectedWater);
        }
    });

    // Step 1 Next (Enter)
    step1NextButton.addEventListener('click', () => {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    // 2. Fragrance Selection
    fragranceOptions.addEventListener('click', (e) => {
        const target = e.target.closest('.fragrance-btn');
        if (target) {
            selectedFragrance = target.dataset.scent;
            selectButton('fragrance-options', 'fragrance-btn', 'scent', selectedFragrance);
            updateNavigationButton(step2NextButton, selectedFragrance);
        }
    });

    // Step 2 Next (Enter)
    step2NextButton.addEventListener('click', () => {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    });

    // 3. Tablet Selection
    tabletOptions.addEventListener('click', (e) => {
        const target = e.target.closest('.tablet-btn');
        if (target) {
            selectedTablets = parseInt(target.dataset.tablets);
            selectButton('tablet-options', 'tablet-btn', 'tablets', selectedTablets);
            updateNavigationButton(mixButton, selectedTablets);
        }
    });

    // 4. MIX & SHAKE Button Click
    mixButton.addEventListener('click', () => {
        if (!mixButton.disabled) {
            gameScreen.classList.add('hidden');
            mixingScreen.classList.remove('hidden');

            // Simulate mixing time (3 seconds)
            setTimeout(calculateResult, 3000);
        }
    });

    // 5. Try Another Recipe Button Click (Reset)
    resetButton.addEventListener('click', () => {
        // Reset state
        selectedWater = null;
        selectedFragrance = null;
        selectedTablets = null;
        
        // Reset UI
        document.querySelectorAll('.btn.selected').forEach(btn => btn.classList.remove('selected'));
        updateNavigationButton(step1NextButton, selectedWater);
        updateNavigationButton(step2NextButton, selectedFragrance);
        updateNavigationButton(mixButton, selectedTablets);

        // Reset step view
        resultScreen.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        step1.classList.remove('hidden');
    });

    // --- Core Game Logic ---

    const calculateQuality = () => {
        let quality = 0;
        let concentrationStatus = '';

        // 1. Score based on Water (Max 50 points)
        if (selectedWater === OPTIMAL_WATER_OZ) {
            quality += 50;
            concentrationStatus = 'Perfect';
        } else if (selectedWater < OPTIMAL_WATER_OZ) { // 6 oz (Concentrated)
            quality += 20;
            concentrationStatus = 'Concentrated';
        } else { // 12 oz (Diluted)
            quality += 30;
            concentrationStatus = 'Diluted';
        }

        // 2. Score based on Tablets (Max 50 points)
        if (selectedTablets >= OPTIMAL_TABLET_MIN && selectedTablets <= OPTIMAL_TABLET_MAX) { // 2 or 3 Tablets
            quality += 50;
        } else if (selectedTablets === 1) { 
            quality += 20; // Too weak
        } else { // 4 Tablets (Too strong/foamy)
            quality += 30;
        }
        
        return { quality, concentrationStatus };
    };

    const calculateResult = () => {
        const { quality, concentrationStatus } = calculateQuality();
        
        // --- Bubble Test Logic ---
        let bubbleResultText = '';
        let finalMessage = '';
        let bubbleColor = '';

        if (quality === TARGET_QUALITY) {
            bubbleResultText = 'Massive, Long-lasting Bubble! (The ultimate blue solution.)';
            finalMessage = '🏆 GRAND SUCCESS! Your recipe is scientifically sound.';
            bubbleColor = '#4CAF50'; // Green success highlight
        } else if (quality >= 70) {
            bubbleResultText = 'Nice, Stable Bubble! (A good, usable cleaning solution.)';
            finalMessage = '👍 SUCCESS! A decent recipe, good for everyday use.';
            bubbleColor = '#FFC107'; // Amber warning
        } else {
            bubbleResultText = 'No Bubble or Weak Bubble. (The solution is too unbalanced.)';
            finalMessage = '👎 FAILURE. Try adjusting your water or tablet count next time.';
            bubbleColor = '#F44336'; // Red failure
        }

        // --- Update Result Screen ---
        document.getElementById('water-summary').textContent = `${selectedWater} oz (${concentrationStatus})`;
        document.getElementById('tablets-summary').textContent = `${selectedTablets} Tablet(s)`;
        document.getElementById('fragrance-summary').textContent = selectedFragrance;
        document.getElementById('bubble-result-text').textContent = bubbleResultText;
        document.getElementById('final-score').textContent = `Final Quality Score: ${quality} / ${TARGET_QUALITY}`;
        document.getElementById('final-message').textContent = finalMessage;
        
        // Apply color to the bubble icon
        document.getElementById('bubble-icon').style.color = bubbleColor; 
        document.getElementById('bubble-icon').style.boxShadow = `0 0 15px ${bubbleColor}`;
        
        mixingScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    };

    // --- Initialization ---
    renderFragranceButtons();
});
