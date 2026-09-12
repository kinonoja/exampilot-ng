export const SUBJECT_CONTRACTS = {
  Chemistry: {
    total: 48,
    topicCounts: {
      "Separation and purification": 3,
      "Chemical combination and mole concept": 4,
      "Kinetic theory and gas laws": 3,
      "Atomic structure, periodicity, bonding, and nuclear chemistry": 5,
      "Air, water, solubility, and pollution": 4,
      "Acids, bases, salts, and titration": 4,
      "Redox, electrolysis, electrochemical cells, and corrosion": 4,
      "Energetics, rate, and equilibrium": 4,
      "Non-metals and their compounds": 4,
      "Metals and their compounds": 4,
      "Organic chemistry": 5,
      "Chemistry and industry": 4,
    },
    difficultyCounts: { easy: 14, medium: 25, hard: 9 },
    answerCounts: { A: 12, B: 12, C: 12, D: 12 },
  },
  Physics: {
    total: 48,
    topicCounts: {
      "Measurements, units, dimensions, and errors": 3,
      "Scalars and vectors": 2,
      "Motion, Newton’s laws, projectiles, circular motion, and SHM": 6,
      "Gravitation and equilibrium": 3,
      "Work, energy, power, friction, machines, and elasticity": 5,
      "Pressure and liquids at rest": 3,
      "Thermal physics": 7,
      "Waves and sound": 6,
      "Light and optics": 5,
      "Electrostatics and current electricity": 3,
      "Magnetism, electromagnetic induction, and alternating current": 3,
      "Atomic, nuclear, and basic electronics": 2,
    },
    difficultyCounts: { easy: 14, medium: 26, hard: 8 },
    answerCounts: { A: 12, B: 12, C: 12, D: 12 },
  },
};

const ANSWER_KEYS = ["A", "B", "C", "D"];
const DIFFICULTIES = ["easy", "medium", "hard"];

function tally(values) {
  return values.reduce((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

function equalCounts(actual, expected) {
  return Object.keys(expected).every(key => Number(actual[key] ?? 0) === expected[key]);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[−-]/g, " minus ")
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, character => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(character)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, character => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(character)])
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function hasSubstantiveText(value, minimum = 48) {
  return typeof value === "string" && value.trim().length >= minimum;
}

export function validateSubjectBatch(subject, questions) {
  const contract = SUBJECT_CONTRACTS[subject];
  if (!contract) throw new Error(`Unknown science subject: ${subject}`);

  const errors = [];
  if (!Array.isArray(questions) || questions.length !== contract.total) {
    errors.push(`${subject} must contain exactly ${contract.total} questions.`);
    return { valid: false, errors, metrics: {} };
  }

  const topicCounts = tally(questions.map(question => question.topic));
  const difficultyCounts = tally(questions.map(question => question.difficulty));
  const answerCounts = tally(questions.map(question => question.correctAnswer));

  if (!equalCounts(topicCounts, contract.topicCounts) || Object.keys(topicCounts).some(topic => !(topic in contract.topicCounts))) {
    errors.push(`${subject} topic allocation does not match the approved plan.`);
  }
  if (!equalCounts(difficultyCounts, contract.difficultyCounts) || Object.keys(difficultyCounts).some(value => !DIFFICULTIES.includes(value))) {
    errors.push(`${subject} difficulty allocation does not match its approved total.`);
  }
  if (!equalCounts(answerCounts, contract.answerCounts) || Object.keys(answerCounts).some(value => !ANSWER_KEYS.includes(value))) {
    errors.push(`${subject} correct-answer letters must be exactly 12 each for A, B, C, and D.`);
  }

  const seenQuestions = new Set();
  questions.forEach((question, index) => {
    const label = `${subject} question ${index + 1}`;
    if (question.subject !== subject) errors.push(`${label} has the wrong subject.`);
    if (!contract.topicCounts[question.topic]) errors.push(`${label} uses an unapproved topic.`);
    if (!DIFFICULTIES.includes(question.difficulty)) errors.push(`${label} has an invalid difficulty.`);
    if (!hasSubstantiveText(question.questionText, 20)) errors.push(`${label} has an incomplete stem.`);
    if (!hasSubstantiveText(question.explanation, 28)) errors.push(`${label} has an insufficient explanation.`);
    if (!question.calculationCheck || !["numeric", "conceptual"].includes(question.calculationCheck.kind)) {
      errors.push(`${label} lacks an internal calculation or concept check.`);
    } else if (!hasSubstantiveText(question.calculationCheck.method, 18) || !hasSubstantiveText(question.calculationCheck.result, 1)) {
      errors.push(`${label} has an incomplete calculation or concept check.`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      errors.push(`${label} must have exactly four options.`);
      return;
    }
    const optionKeys = question.options.map(option => option.key);
    if (optionKeys.join(",") !== ANSWER_KEYS.join(",")) errors.push(`${label} options must be ordered A, B, C, D.`);
    const normalizedOptions = question.options.map(option => normalize(option.text));
    if (normalizedOptions.some(value => !value)) errors.push(`${label} contains an empty option.`);
    if (new Set(normalizedOptions).size !== 4) errors.push(`${label} contains duplicate options.`);
    if (!optionKeys.includes(question.correctAnswer)) errors.push(`${label} answer key does not match an option.`);

    const normalizedQuestion = normalize(question.questionText);
    if (seenQuestions.has(normalizedQuestion)) errors.push(`${label} duplicates another question stem.`);
    seenQuestions.add(normalizedQuestion);
    if (/\b(past question|question paper|w[a|e]ec|neco)\b/i.test(question.questionText)) {
      errors.push(`${label} has a prohibited source-reference phrase.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    metrics: { topicCounts, difficultyCounts, answerCounts, total: questions.length },
  };
}

export function validateScienceBatch(batch) {
  const chemistry = validateSubjectBatch("Chemistry", batch.Chemistry ?? []);
  const physics = validateSubjectBatch("Physics", batch.Physics ?? []);
  return {
    valid: chemistry.valid && physics.valid,
    errors: [...chemistry.errors, ...physics.errors],
    subjects: { Chemistry: chemistry, Physics: physics },
  };
}
