/**
 * Talent Management Readiness & Program Need Survey
 * Q1–4 Readiness (R), Q5–8 Behavior (B), Q9–11 Prep, Q12–14 Awareness (A), Q15–16 Motivation (M), Q17–18 TMP
 */

const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree"
];

const SECTIONS = [
  {
    id: "demographics",
    title: "About you",
    icon: "✨",
    type: "demographics"
  },
  {
    id: "s1",
    title: "Section 1: Self-perceived readiness",
    icon: "🧭",
    questions: [
      "I feel ready to take on a management role today.",
      "I am confident in making decisions that impact team or business outcomes.",
      "I can handle responsibility for other people’s performance.",
      "I understand what is expected from a manager in my organization."
    ]
  },
  {
    id: "s2",
    title: "Section 2: Current behavior (reality check)",
    icon: "🛠️",
    questions: [
      "I have led a project or initiative involving multiple stakeholders.",
      "I regularly give feedback or guidance to others at work.",
      "I have handled conflict between colleagues or team members.",
      "I think beyond my daily tasks and consider long-term impact."
    ]
  },
  {
    id: "s3",
    title: "Section 3: Preparation efforts",
    icon: "📈",
    questions: [
      "I actively seek opportunities to develop leadership skills.",
      "I have a clear plan to prepare myself for a management role.",
      "I seek feedback to improve my leadership or working style."
    ]
  },
  {
    id: "s4",
    title: "Section 4: Self-evaluation awareness",
    icon: "🧠",
    questions: [
      "I clearly understand my strengths as a potential manager.",
      "I am aware of my weaknesses in leading others.",
      "I know what skills I still need to develop before becoming a manager."
    ]
  },
  {
    id: "s5",
    title: "Section 5: Motivation & intent",
    icon: "🎯",
    questions: [
      "I want to become a manager in the next 1–2 years.",
      "I am motivated to take on leadership responsibilities, not just a higher title."
    ]
  },
  {
    id: "s6",
    title: "Section 6: Talent management program (TMP) need",
    icon: "🎓",
    questions: [
      "I believe a structured Talent Management Program would help me prepare for a management role.",
      "I would be willing to participate in a Talent Management Program if offered."
    ]
  }
];

const POSITION_OPTIONS = [
  { value: "", label: "Select your level…" },
  { value: "entry", label: "Entry level (Junior, Assistant)" },
  { value: "staff", label: "Staff level (Specialist, Associate)" },
  { value: "senior_staff", label: "Senior staff (Lead, Senior Specialist)" },
  { value: "management", label: "Management (Manager, Supervisor)" },
  { value: "director", label: "Director (Senior management)" },
  { value: "executive", label: "Executive (VP / CEO / Chief)" }
];

const ARCHETYPES = {
  driver: {
    key: "driver",
    title: "The Driver",
    subtitle: "Ready now",
    emoji: "🔥",
    core: "Results + ownership",
    characteristics: [
      "High confidence and proven leadership behavior",
      "Takes responsibility beyond role",
      "Makes decisions under pressure"
    ],
    signal: "High readiness + behavior + motivation.",
    risk: "May overlook team development or collaboration.",
    development: ["Strategic thinking", "People leadership depth"]
  },
  thinker: {
    key: "thinker",
    title: "The Thinker",
    subtitle: "Strategic but unproven",
    emoji: "🧠",
    core: "Insight + awareness",
    characteristics: [
      "Understands management conceptually",
      "Strong in analysis and long-term thinking",
      "Limited real leadership exposure"
    ],
    signal: "High awareness, lower execution (behavior).",
    risk: "Overthinking, slow decision-making.",
    development: ["Real project ownership", "Decision-making under uncertainty"]
  },
  supporter: {
    key: "supporter",
    title: "The Supporter",
    subtitle: "People-centered leader",
    emoji: "🤝",
    core: "Empathy + influence",
    characteristics: [
      "Strong interpersonal skills",
      "Trusted by peers",
      "Naturally supports and guides others"
    ],
    signal: "Strong people behavior (feedback & conflict) with medium readiness.",
    risk: "Avoids difficult conversations or accountability.",
    development: ["Performance management", "Assertiveness & decision-making"]
  },
  executor: {
    key: "executor",
    title: "The Executor",
    subtitle: "Strong doer",
    emoji: "⚡",
    core: "Execution + reliability",
    characteristics: [
      "Delivers results consistently",
      "Takes ownership of tasks",
      "Still operates strongly as an individual contributor"
    ],
    signal: "High behavior overall, weaker people leadership (Q6 + Q7).",
    risk: "Micromanagement; difficulty letting go of tasks.",
    development: ["Delegation", "Leading through others"]
  },
  aspirer: {
    key: "aspirer",
    title: "The Aspirer",
    subtitle: "Motivated but not ready",
    emoji: "🌪️",
    core: "Ambition + intent",
    characteristics: [
      "Strong desire to become a manager",
      "Limited experience or readiness so far",
      "Benefits from structured development"
    ],
    signal: "High motivation, lower readiness & behavior.",
    risk: "Premature promotion → higher failure risk.",
    development: ["Foundational leadership skills", "Structured TMP (primary target)"]
  },
  explorer: {
    key: "explorer",
    title: "The Explorer",
    subtitle: "Undecided path",
    emoji: "🌱",
    core: "Exploration + flexibility",
    characteristics: [
      "Not strongly focused on management yet",
      "Still exploring career direction",
      "May prefer non-manager paths"
    ],
    signal: "Lower motivation toward a management track.",
    risk: "Disengagement if forced into a leadership track.",
    development: ["Career clarity", "Exposure to different roles"]
  },
  balanced: {
    key: "balanced",
    title: "The Pathfinder",
    subtitle: "Mixed profile",
    emoji: "🧭",
    core: "Balanced signals",
    characteristics: [
      "Your scores do not match one archetype strongly",
      "You show a blend of readiness, behavior, awareness, and motivation"
    ],
    signal: "No single archetype rule matched; review dimension bars.",
    risk: "Unclear development priority without deeper conversation.",
    development: ["Discuss goals with your manager or HR", "Use TMP interest scores to guide next steps"]
  }
};

function likertRadios(name) {
  return [1, 2, 3, 4, 5]
    .map(
      (n) => `
    <label class="likert-option">
      <input type="radio" name="${name}" value="${n}" required>
      <span class="num">${n}</span>
    </label>
  `
    )
    .join("");
}

function renderDemographics() {
  const options = POSITION_OPTIONS.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
  return `
    <div class="field-grid">
      <div class="field">
        <label for="age">Age</label>
        <input type="number" id="age" name="age" min="16" max="100" placeholder="e.g. 28" required>
      </div>
      <div class="field">
        <label for="position">Position / career level</label>
        <select id="position" name="position" required>${options}</select>
      </div>
    </div>
  `;
}

function buildForm() {
  const form = document.getElementById("tmForm");
  let qIndex = 0;
  const parts = [];

  SECTIONS.forEach((sec) => {
    if (sec.type === "demographics") {
      parts.push(`
        <div class="section-head"><span class="icon">${sec.icon}</span>${sec.title}</div>
        ${renderDemographics()}
      `);
      return;
    }

    parts.push(`<div class="section-head"><span class="icon">${sec.icon}</span>${sec.title}</div>`);
    sec.questions.forEach((text) => {
      qIndex += 1;
      const name = `q${qIndex}`;
      parts.push(`
        <div class="likert-block">
          <p class="q-text"><span style="opacity:0.75">Q${qIndex}.</span> ${text}</p>
          <div class="likert-scale">
            ${likertRadios(name)}
          </div>
          <div class="likert-labels">
            <span>${LIKERT_LABELS[0]}</span>
            <span>${LIKERT_LABELS[4]}</span>
          </div>
        </div>
      `);
    });
  });

  form.innerHTML = `
    ${parts.join("")}
    <p id="formWarning" class="warning">Please complete every field, including all Likert items.</p>
    <div class="actions">
      <button type="submit" class="btn-primary">See my dimensions & archetype</button>
      <button type="button" class="btn-secondary" id="tmReset">Reset</button>
    </div>
  `;
}

function getLikertValues(form) {
  const values = {};
  for (let i = 1; i <= 18; i += 1) {
    const el = form.elements[`q${i}`];
    const selected = el && typeof el.value !== "undefined" ? el.value : "";
    if (!selected) return null;
    values[i] = parseInt(selected, 10);
  }
  return values;
}

function scoreDimensions(q) {
  const R = q[1] + q[2] + q[3] + q[4];
  const B = q[5] + q[6] + q[7] + q[8];
  const prep = q[9] + q[10] + q[11];
  const A = q[12] + q[13] + q[14];
  const M = q[15] + q[16];
  const tmp = q[17] + q[18];

  const Rnorm = R / 20;
  const Bnorm = B / 20;
  const Anorm = A / 15;
  const Mnorm = M / 10;
  const peopleRatio = (q[6] + q[7]) / 10;

  return {
    R,
    B,
    A,
    M,
    prep,
    tmp,
    Rnorm,
    Bnorm,
    Anorm,
    Mnorm,
    peopleRatio,
    q6: q[6],
    q7: q[7]
  };
}

function pickArchetype(s) {
  const { Rnorm, Bnorm, Anorm, Mnorm, peopleRatio } = s;

  if (Rnorm >= 0.75 && Bnorm >= 0.75 && Mnorm >= 0.75) {
    return ARCHETYPES.driver;
  }
  if (Mnorm < 0.5) {
    return ARCHETYPES.explorer;
  }
  if (Mnorm >= 0.75 && Rnorm < 0.5 && Bnorm < 0.5) {
    return ARCHETYPES.aspirer;
  }
  if (Anorm >= 0.75 && Bnorm < 0.5) {
    return ARCHETYPES.thinker;
  }
  if (Bnorm >= 0.7 && peopleRatio < 0.6) {
    return ARCHETYPES.executor;
  }
  if (Bnorm >= 0.6 && peopleRatio >= 0.75 && Rnorm >= 0.4 && Rnorm < 0.75) {
    return ARCHETYPES.supporter;
  }
  return ARCHETYPES.balanced;
}

function positionLabel(value) {
  const found = POSITION_OPTIONS.find((p) => p.value === value);
  return found ? found.label : value;
}

function tmpInterpretation(tmpSum) {
  const max = 10;
  const ratio = tmpSum / max;
  if (ratio >= 0.8) return "Strong interest in a structured TMP — great candidate for program outreach.";
  if (ratio >= 0.6) return "Moderate–high TMP fit; program could accelerate your path.";
  if (ratio >= 0.4) return "Mixed TMP signals; a conversation on format and timing may help.";
  return "Lower immediate TMP priority from these answers; still worth aligning with career goals.";
}

function renderDimensions(panel, s) {
  const rows = [
    { code: "R", label: "Readiness (Q1–4)", score: s.R, max: 20, norm: s.Rnorm },
    { code: "B", label: "Behavior (Q5–8)", score: s.B, max: 20, norm: s.Bnorm },
    { code: "A", label: "Awareness (Q12–14)", score: s.A, max: 15, norm: s.Anorm },
    { code: "M", label: "Motivation (Q15–16)", score: s.M, max: 10, norm: s.Mnorm }
  ];

  panel.innerHTML = rows
    .map(
      (r) => `
    <div class="dim-row">
      <header><span>${r.label}</span><span>${r.score} / ${r.max} (${Math.round(r.norm * 100)}%)</span></header>
      <div class="dim-bar"><div class="dim-fill" style="width:${Math.round(r.norm * 100)}%"></div></div>
    </div>
  `
    )
    .join("");
}

function renderArchetype(container, arch) {
  container.innerHTML = `
    <div class="archetype-hero">
      <div class="archetype-emoji" aria-hidden="true">${arch.emoji}</div>
      <div>
        <h2 style="margin:0 0 4px">${arch.title}</h2>
        <p style="margin:0;color:var(--text-soft);font-size:15px">${arch.subtitle} · ${arch.core}</p>
      </div>
    </div>
    <p style="font-size:14px;color:var(--text-soft);margin:0 0 8px"><strong style="color:#e8ecff">Typical signal:</strong> ${arch.signal}</p>
    <div class="detail-block">
      <h3>Characteristics</h3>
      <ul>${arch.characteristics.map((c) => `<li>${c}</li>`).join("")}</ul>
    </div>
    <div class="detail-block">
      <h3>Risk</h3>
      <p style="margin:0;font-size:14px;color:var(--text-soft)">${arch.risk}</p>
    </div>
    <div class="detail-block">
      <h3>Development focus</h3>
      <ul>${arch.development.map((d) => `<li>${d}</li>`).join("")}</ul>
    </div>
  `;
}

function init() {
  buildForm();
  const form = document.getElementById("tmForm");
  const warning = document.getElementById("formWarning");
  const resultPanel = document.getElementById("resultPanel");
  const dimPanel = document.getElementById("dimensionBars");
  const archPanel = document.getElementById("archetypeDetail");
  const metaAge = document.getElementById("metaAge");
  const metaPosition = document.getElementById("metaPosition");
  const prepPill = document.getElementById("prepPill");
  const tmpBox = document.getElementById("tmpSummary");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const age = form.elements.age.value;
    const position = form.elements.position.value;
    if (!age || !position) {
      warning.classList.add("show");
      resultPanel.classList.remove("show");
      return;
    }
    const q = getLikertValues(form);
    if (!q) {
      warning.classList.add("show");
      resultPanel.classList.remove("show");
      return;
    }
    warning.classList.remove("show");

    const s = scoreDimensions(q);
    const arch = pickArchetype(s);

    metaAge.textContent = `Age: ${age}`;
    metaPosition.textContent = positionLabel(position);
    prepPill.textContent = `Preparation (Q9–11): ${s.prep} / 15`;

    renderDimensions(dimPanel, s);
    renderArchetype(archPanel, arch);

    tmpBox.innerHTML = `<strong>TMP need (Q17–18):</strong> ${s.tmp} / 10 — ${tmpInterpretation(s.tmp)}`;

    resultPanel.classList.add("show");
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("tmReset").addEventListener("click", () => {
    form.reset();
    warning.classList.remove("show");
    resultPanel.classList.remove("show");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
