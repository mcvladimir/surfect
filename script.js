document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const gameScreen = document.getElementById("game-screen");
  const mixingScreen = document.getElementById("mixing-screen");
  const resultScreen = document.getElementById("result-screen");
  const mixButton = document.getElementById("mix-button");
  const resetButton = document.getElementById("reset-button");
  const waterOptions = document.getElementById("water-options");
  const fragranceOptions = document.getElementById("fragrance-options");
  const pelletsInput = document.getElementById("pellets-input");

  // --- Game State ---
  let selectedWater = null;
  let selectedFragrance = null;
  let selectedPellets = 7;

  const FRAGRANCES = {
    "Iris Agave": "purple",
    "Perrine Lemon": "yellow",
    "Lavender Eucalyptus": "violet",
    "Pacific Mist": "blue",
    "Cedar Fig": "brown",
    "Fragrance-free": "grey",
  };

  const OPTIMAL_WATER_OZ = 9;
  const OPTIMAL_PELLET_MIN = 5;
  const OPTIMAL_PELLET_MAX = 8;
  const TARGET_QUALITY = 100;

  // --- Helper Functions ---

  // Function to update the MIX button state
  const updateMixButton = () => {
    mixButton.disabled = !(
      selectedWater !== null && selectedFragrance !== null
    );
  };

  // Function to inject fragrance buttons into the DOM
  const renderFragranceButtons = () => {
    for (const [scent, color] of Object.entries(FRAGRANCES)) {
      const button = document.createElement("button");
      button.className = "btn fragrance-btn";
      button.dataset.scent = scent;
      button.innerHTML = `<i class="fas fa-droplet" style="color:${color};"></i> ${scent}`;
      fragranceOptions.appendChild(button);
    }
  };

  // --- Event Listeners ---

  // 1. Water Selection
  waterOptions.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("water-btn")) {
      // Remove 'selected' from all
      document
        .querySelectorAll(".water-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      // Add 'selected' to the clicked one
      target.classList.add("selected");
      selectedWater = parseInt(target.dataset.oz);
      updateMixButton();
    }
  });

  // 2. Fragrance Selection
  fragranceOptions.addEventListener("click", (e) => {
    const target = e.target.closest(".fragrance-btn");
    if (target) {
      document
        .querySelectorAll(".fragrance-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      target.classList.add("selected");
      selectedFragrance = target.dataset.scent;
      updateMixButton();
    }
  });

  // 3. Pellet Input
  pelletsInput.addEventListener("input", (e) => {
    selectedPellets = parseInt(e.target.value) || 0;
  });

  // 4. MIX & SHAKE Button Click
  mixButton.addEventListener("click", () => {
    if (!mixButton.disabled) {
      gameScreen.classList.add("hidden");
      mixingScreen.classList.remove("hidden");

      // Simulate mixing time (3 seconds)
      setTimeout(calculateResult, 3000);
    }
  });

  // 5. Try Another Recipe Button Click
  resetButton.addEventListener("click", () => {
    // Reset state and return to game screen
    selectedWater = null;
    selectedFragrance = null;
    selectedPellets = 7;

    document
      .querySelectorAll(".btn.selected")
      .forEach((btn) => btn.classList.remove("selected"));
    pelletsInput.value = 7;
    updateMixButton();

    resultScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  });

  // --- Core Game Logic ---

  const calculateQuality = () => {
    let quality = 0;
    let concentrationStatus = "";

    // Score based on Water
    if (selectedWater === OPTIMAL_WATER_OZ) {
      quality += 50;
      concentrationStatus = "Perfect";
    } else if (selectedWater < OPTIMAL_WATER_OZ) {
      // 6 oz
      quality += 20;
      concentrationStatus = "Concentrated";
    } else {
      // 12 oz
      quality += 30;
      concentrationStatus = "Diluted";
    }

    // Score based on Pellets
    if (
      selectedPellets >= OPTIMAL_PELLET_MIN &&
      selectedPellets <= OPTIMAL_PELLET_MAX
    ) {
      quality += 50;
    } else if (selectedPellets < OPTIMAL_PELLET_MIN) {
      quality += 20;
    } else {
      quality += 30;
    }

    return { quality, concentrationStatus };
  };

  const calculateResult = () => {
    const { quality, concentrationStatus } = calculateQuality();

    // --- Bubble Test Logic ---
    let bubbleResultText = "";
    let finalMessage = "";

    if (quality === TARGET_QUALITY) {
      bubbleResultText =
        "Massive, Long-lasting Bubble! (The recipe is perfect.)";
      finalMessage = "🏆 GRAND SUCCESS! Your recipe is scientifically sound.";
      document.getElementById("bubble-icon").style.color = "#4CAF50"; // Green Perfect
    } else if (quality >= 70) {
      bubbleResultText = "Nice, Stable Bubble! (Good for everyday use.)";
      finalMessage = "👍 SUCCESS! A decent recipe, good for everyday use.";
      document.getElementById("bubble-icon").style.color = "#FFC107"; // Amber Good
    } else {
      bubbleResultText =
        "No Bubble or Weak Bubble. (The solution is too unbalanced.)";
      finalMessage =
        "👎 FAILURE. Try adjusting your water or pellet count next time.";
      document.getElementById("bubble-icon").style.color = "#F44336"; // Red Failure
    }

    // --- Update Result Screen ---
    document.getElementById(
      "water-summary"
    ).textContent = `${selectedWater} oz (${concentrationStatus})`;
    document.getElementById(
      "pellets-summary"
    ).textContent = `${selectedPellets}`;
    document.getElementById("fragrance-summary").textContent =
      selectedFragrance;
    document.getElementById("bubble-result-text").textContent =
      bubbleResultText;
    document.getElementById(
      "final-score"
    ).textContent = `Final Quality Score: ${quality} / ${TARGET_QUALITY}`;
    document.getElementById("final-message").textContent = finalMessage;

    mixingScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
  };

  // --- Initialization ---
  renderFragranceButtons();
});
