document.addEventListener('DOMContentLoaded', () => {
    // Helper function for getting elements by ID safely
    const getElement = (id) => document.getElementById(id);

    // --- DOM Elements ---
    const welcomeModal = getElement('welcome-modal');
    const startButton = getElement('start-button');
    const gameScreen = getElement('game-screen');
    const mixingScreen = getElement('mixing-screen');
    const resultScreen = getElement('result-screen');
    
    // Step Containers
    const step1 = getElement('step-1');
    const step2 = getElement('step-2');
    const step3 = getElement('step-3');
    
    // Step Buttons
    const step1NextButton = getElement('step-1-next');
    const step2NextButton = getElement('step-2-next');
    const mixButton = getElement('mix-button');
    const resetButton = getElement('reset-button');
    
    // Input Containers
    const waterOptions = getElement('water-options');
    const fragranceOptions = getElement('fragrance-options');
    const tabletOptions = getElement('tablet-options');

    // Fail-safe initialization check (prevent crashing if core elements are missing)
    if (!welcomeModal || !gameScreen || !fragranceOptions) {
        console.error("Critical DOM elements not found. Application cannot start.");
        return; 
    }

    // --- Game State & Constants ---
    let selectedWater = null;
    let selectedFragrance = null;
    let selectedTablets = null;
    let bubbleInterval = null;
    
    const OPTIMAL_WATER_OZ = 9;
    const OPTIMAL_TABLET = 1; 
    const OPTIMAL_FRAGRANCES = ['Lavender Eucalyptus', 'Iris Agave', 'Perrine Lemon'];
    const TARGET_QUALITY = 100;

    const FRAGRANCES = {
        'Iris Agave': '#8e24aa', 
        'Perrine Lemon': '#ffeb3b', 
        'Lavender Eucalyptus': '#7e57c2', 
        'Pacific Mist': '#03a9f4', 
        'Cedar Fig': '#795548', 
        'Fragrance-free': '#9e9e9e' 
    };
    
    // --- Helper Functions ---

    // Function to render fragrance buttons
    const renderFragranceButtons = () => {
        for (const [scent, color] of Object.entries(FRAGRANCES)) {
            const button = document.createElement('button');
            button.className = 'btn fragrance-btn';
            button.dataset.scent = scent;
            // ไอคอนหยดน้ำขนาดเล็กในปุ่มเลือกกลิ่น
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
        if (button) { 
            button.disabled = selectionState === null;
        }
    };

    // Bubble Animation Functions (Updated for full-screen mixing effect)
    const createBubbles = () => {
        let bubbleContainer = mixingScreen.querySelector('.bubble-container');
        if (!bubbleContainer) {
            bubbleContainer = document.createElement('div');
            bubbleContainer.className = 'bubble-container';
            mixingScreen.appendChild(bubbleContainer);
        }

        if (bubbleInterval) {
            clearInterval(bubbleInterval);
        }

        let bubbleCount = 0;
        bubbleInterval = setInterval(() => {
            // สร้างฟองสบู่ได้ไม่จำกัดจำนวนจนกว่าจะหยุด
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = Math.random() * 40 + 20; // เพิ่มขนาดสูงสุด
            const left = Math.random() * 100; // ครอบคลุมความกว้าง 100%
            const animationDuration = Math.random() * 4 + 3; // เพิ่มระยะเวลาให้ลอยช้าลง

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDuration = `${animationDuration}s`;
            bubble.style.animationDelay = `${Math.random() * 2}s`; // เพิ่มความหลากหลายในการเริ่ม

            bubbleContainer.appendChild(bubble);
            bubbleCount++;

            // กำจัดฟองสบู่เก่าเพื่อไม่ให้ DOM บวม
            bubble.addEventListener('animationend', () => {
                bubble.remove();
            });

        }, 100); // สร้างฟองสบู่อย่างรวดเร็ว
    };

    const stopBubbles = () => {
        if (bubbleInterval) {
            clearInterval(bubbleInterval);
            bubbleInterval = null;
        }
        const bubbleContainer = mixingScreen.querySelector('.bubble-container');
        // ลบ container ออกเมื่อจบ
        if (bubbleContainer) {
            bubbleContainer.remove(); 
        }
    };

    // --- Event Listeners ---

    // 0. Modal Start Button
    if (startButton) {
        startButton.addEventListener('click', () => {
            welcomeModal.classList.add('hidden');
            gameScreen.classList.remove('hidden');
        });
    }

    // 1. Water Selection
    if (waterOptions && step1NextButton) {
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
            step1?.classList.add('hidden'); // Using optional chaining for safety
            step2?.classList.remove('hidden');
        });
    }

    // 2. Fragrance Selection
    if (fragranceOptions && step2NextButton) {
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
            step2?.classList.add('hidden');
            step3?.classList.remove('hidden');
        });
    }


    // 3. Tablet Selection
    if (tabletOptions && mixButton) {
        tabletOptions.addEventListener('click', (e) => {
            const target = e.target.closest('.tablet-btn');
            if (target) {
                selectedTablets = parseInt(target.dataset.tablets);
                selectButton('tablet-options', 'tablet-btn', 'tablets', selectedTablets);
                updateNavigationButton(mixButton, selectedTablets);
            }
        });
    }

    // 4. MIX & SHAKE Button Click
    if (mixButton) {
        mixButton.addEventListener('click', () => {
            if (!mixButton.disabled) {
                gameScreen?.classList.add('hidden');
                mixingScreen?.classList.remove('hidden');
                createBubbles(); 

                setTimeout(() => {
                    stopBubbles(); 
                    calculateResult();
                }, 3000);
            }
        });
    }

    // 5. Try Another Recipe Button Click (Reset)
    if (resetButton) {
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
            resultScreen?.classList.add('hidden');
            step2?.classList.add('hidden');
            step3?.classList.add('hidden');
            gameScreen?.classList.remove('hidden');
            step1?.classList.remove('hidden');
        });
    }

    // --- Core Game Logic ---

    const calculateQuality = () => {
        let quality = 0;
        let concentrationStatus = '';

        // 1. Score based on Water (Max 50 points)
        if (selectedWater === OPTIMAL_WATER_OZ) { // 9 Oz
            quality += 50;
            concentrationStatus = 'Perfect';
        } else if (selectedWater < OPTIMAL_WATER_OZ) { // 6 oz
            quality += 20;
            concentrationStatus = 'Concentrated';
        } else { // 12 oz
            quality += 30;
            concentrationStatus = 'Diluted';
        }

        // 2. Score based on Tablets/Fragrance (Max 50 points)
        if (selectedTablets === OPTIMAL_TABLET) { // 1 Tablet (Optimal)
            if (OPTIMAL_FRAGRANCES.includes(selectedFragrance)) {
                quality += 50; // Perfect score
            } else {
                quality += 40; // High score
            }
        } else if (selectedTablets === 2 || selectedTablets === 3) { 
            quality += 30; // Decent score
        } else { 
            quality += 20; // Low score
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
        const waterSummary = getElement('water-summary');
        const tabletsSummary = getElement('tablets-summary');
        const fragranceSummary = getElement('fragrance-summary');
        const bubbleResultTextEl = getElement('bubble-result-text');
        const finalScoreEl = getElement('final-score');
        const finalMessageEl = getElement('final-message');
        const bubbleIcon = getElement('bubble-icon');

        if (waterSummary) waterSummary.textContent = `${selectedWater} oz (${concentrationStatus})`;
        if (tabletsSummary) tabletsSummary.textContent = `${selectedTablets} Tablet(s)`;
        if (fragranceSummary) fragranceSummary.textContent = selectedFragrance;
        if (bubbleResultTextEl) bubbleResultTextEl.textContent = bubbleResultText;
        if (finalScoreEl) finalScoreEl.textContent = `Final Quality Score: ${quality} / ${TARGET_QUALITY}`;
        if (finalMessageEl) finalMessageEl.textContent = finalMessage;
        
        // Apply color to the bubble icon
        if (bubbleIcon) {
            bubbleIcon.style.color = bubbleColor; 
            bubbleIcon.style.boxShadow = `0 0 15px ${bubbleColor}`;
        }
        
        mixingScreen?.classList.add('hidden');
        resultScreen?.classList.remove('hidden');
    };

    // --- Initialization ---
    renderFragranceButtons();
});
