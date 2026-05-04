const questions = [
  "I feel ready to take on a management role today.",
  "I am confident in making decisions that impact outcomes.",
  "I can handle responsibility for others’ performance.",
  "I understand what is expected from a manager.",

  "I have led a project with multiple stakeholders.",
  "I give feedback or guidance to others.",
  "I have handled conflict between people.",
  "I think beyond daily tasks to long-term impact.",

  "I actively develop leadership skills.",
  "I have a clear plan to become a manager.",
  "I seek feedback to improve.",

  "I understand my strengths as a leader.",
  "I know my weaknesses in leading others.",
  "I know what skills I need to improve.",

  "I want to become a manager in 1–2 years.",
  "I am motivated to lead, not just get a title."
];

const form = document.getElementById("quizForm");

// Generate questions
questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.classList.add("question");

  let html = `<p>${i+1}. ${q}</p><div class="options">`;

  for (let j = 1; j <= 5; j++) {
    html += `
      <label>
        <input type="radio" name="q${i}" value="${j}" required> ${j}
      </label>
    `;
  }

  html += "</div>";
  div.innerHTML = html;
  form.appendChild(div);
});

function getScore(start, end) {
  let total = 0;
  for (let i = start; i <= end; i++) {
    const val = document.querySelector(`input[name="q${i}"]:checked`);
    total += parseInt(val.value);
  }
  return total;
}

function calculateResult() {
  // Dimensions
  let R = getScore(0, 3) / 20;
  let B = getScore(4, 7) / 20;
  let A = getScore(11, 13) / 15;
  let M = getScore(14, 15) / 10;

  let type = "";
  let desc = "";

  if (R >= 0.75 && B >= 0.75 && M >= 0.75) {
    type = "🔥 Driver";
    desc = "You are ready now. Strong leadership and execution.";
  }
  else if (M >= 0.75 && R < 0.5 && B < 0.5) {
    type = "🌪️ Aspirer";
    desc = "You want to lead but need more development.";
  }
  else if (A >= 0.75 && B < 0.5) {
    type = "🧠 Thinker";
    desc = "Strategic thinker but lacks real leadership experience.";
  }
  else if (B >= 0.6 && ((getScore(5,6)/10) >= 0.75)) {
    type = "🤝 Supporter";
    desc = "Strong people skills, great team supporter.";
  }
  else if (B >= 0.7 && ((getScore(5,6)/10) < 0.6)) {
    type = "⚡ Executor";
    desc = "Strong doer, needs to shift to leading others.";
  }
  else {
    type = "🌱 Explorer";
    desc = "Still exploring if management is right for you.";
  }

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").innerHTML = `
    <h2>Your Archetype: ${type}</h2>
    <p>${desc}</p>
  `;
}
