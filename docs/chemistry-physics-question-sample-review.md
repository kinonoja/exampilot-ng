# Chemistry and Physics: Review Sample

This file contains **five original review questions per subject only**. They are not inserted into `questions`, are not visible in practice, and do not change the student experience. They use the existing record shape proposed for the later full batch, including `isAIGenerated: true`.

All numerical answers below were independently recalculated. The choices are deliberately original rather than copied from past-question wording. The coverage plan that these samples test is in [the companion plan](./chemistry-physics-question-bank-coverage-plan.md).

## Chemistry

```json
{
  "subject": "Chemistry",
  "topic": "Mole Concept",
  "difficulty": "easy",
  "questionText": "How many moles of oxygen atoms are present in 0.5 moles of Al₂(SO₄)₃?",
  "options": [
    { "key": "A", "text": "2 moles" },
    { "key": "B", "text": "4 moles" },
    { "key": "C", "text": "6 moles" },
    { "key": "D", "text": "8 moles" }
  ],
  "correctAnswer": "C",
  "explanation": "Al₂(SO₄)₃ contains 3 × 4 = 12 oxygen atoms per formula unit. Therefore, 0.5 mol of Al₂(SO₄)₃ contains 0.5 × 12 = 6 moles of oxygen atoms.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Chemistry",
  "topic": "Gas Laws",
  "difficulty": "medium",
  "questionText": "A fixed mass of gas occupies 600 cm³ at 27°C and 1.0 × 10⁵ Pa. What volume will it occupy at 127°C and 2.0 × 10⁵ Pa?",
  "options": [
    { "key": "A", "text": "150 cm³" },
    { "key": "B", "text": "200 cm³" },
    { "key": "C", "text": "400 cm³" },
    { "key": "D", "text": "800 cm³" }
  ],
  "correctAnswer": "C",
  "explanation": "Use P₁V₁/T₁ = P₂V₂/T₂, with temperatures in kelvin: T₁ = 300 K and T₂ = 400 K. V₂ = (1.0 × 10⁵ × 600 × 400) ÷ (300 × 2.0 × 10⁵) = 400 cm³.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Chemistry",
  "topic": "Periodicity and Bonding",
  "difficulty": "medium",
  "questionText": "Which of the following species has a pyramidal molecular shape?",
  "options": [
    { "key": "A", "text": "CO₂" },
    { "key": "B", "text": "NH₃" },
    { "key": "C", "text": "CH₄" },
    { "key": "D", "text": "BeCl₂" }
  ],
  "correctAnswer": "B",
  "explanation": "NH₃ has three bonding pairs and one lone pair around nitrogen, giving a trigonal-pyramidal shape. CO₂ and BeCl₂ are linear, while CH₄ is tetrahedral.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Chemistry",
  "topic": "Acids, Bases and Salts",
  "difficulty": "easy",
  "questionText": "Which salt will produce an acidic solution when dissolved in water?",
  "options": [
    { "key": "A", "text": "Potassium nitrate, KNO₃" },
    { "key": "B", "text": "Sodium ethanoate, CH₃COONa" },
    { "key": "C", "text": "Ammonium chloride, NH₄Cl" },
    { "key": "D", "text": "Sodium chloride, NaCl" }
  ],
  "correctAnswer": "C",
  "explanation": "NH₄Cl is formed from a weak base, NH₃, and a strong acid, HCl. NH₄⁺ hydrolyses in water to make the solution acidic. KNO₃ and NaCl are approximately neutral, while CH₃COONa is basic.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Chemistry",
  "topic": "Electrolysis",
  "difficulty": "hard",
  "questionText": "In the electrolysis of aqueous copper(II) sulphate using platinum electrodes, a current of 2.0 A is passed for 965 s. What mass of copper is deposited at the cathode? [Cu = 64; F = 96,500 C mol⁻¹]",
  "options": [
    { "key": "A", "text": "0.32 g" },
    { "key": "B", "text": "0.64 g" },
    { "key": "C", "text": "1.28 g" },
    { "key": "D", "text": "2.56 g" }
  ],
  "correctAnswer": "B",
  "explanation": "Q = It = 2.0 × 965 = 1,930 C. For Cu²⁺ + 2e⁻ → Cu, mass = Q × M ÷ (2F) = 1,930 × 64 ÷ (2 × 96,500) = 0.64 g.",
  "isAIGenerated": true
}
```

## Physics

```json
{
  "subject": "Physics",
  "topic": "Measurements and Significant Figures",
  "difficulty": "easy",
  "questionText": "The length of a rod is measured as 0.003540 m. How many significant figures does this measurement contain?",
  "options": [
    { "key": "A", "text": "3" },
    { "key": "B", "text": "4" },
    { "key": "C", "text": "5" },
    { "key": "D", "text": "7" }
  ],
  "correctAnswer": "B",
  "explanation": "The leading zeros are placeholders and are not significant. The digits 3, 5, 4, and the final zero are significant because the zero is written after a decimal figure. Therefore, there are four significant figures.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Physics",
  "topic": "Kinematics",
  "difficulty": "medium",
  "questionText": "A car starts from rest and accelerates uniformly at 4 m s⁻² for 5 s, then decelerates uniformly to rest in a further 10 s. What total distance does it cover?",
  "options": [
    { "key": "A", "text": "50 m" },
    { "key": "B", "text": "100 m" },
    { "key": "C", "text": "150 m" },
    { "key": "D", "text": "200 m" }
  ],
  "correctAnswer": "C",
  "explanation": "After 5 s, v = 4 × 5 = 20 m s⁻¹. The first distance is ½ × 4 × 5² = 50 m. During the 10 s deceleration, average velocity is (20 + 0) ÷ 2 = 10 m s⁻¹, so the second distance is 100 m. Total distance = 150 m.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Physics",
  "topic": "Pressure in Liquids",
  "difficulty": "medium",
  "questionText": "A diver is 15 m below the surface of a lake. If the density of water is 1,000 kg m⁻³ and atmospheric pressure is 1.0 × 10⁵ Pa, what total pressure does the diver experience? [g = 10 m s⁻²]",
  "options": [
    { "key": "A", "text": "1.5 × 10⁵ Pa" },
    { "key": "B", "text": "2.5 × 10⁵ Pa" },
    { "key": "C", "text": "3.0 × 10⁵ Pa" },
    { "key": "D", "text": "1.0 × 10⁵ Pa" }
  ],
  "correctAnswer": "B",
  "explanation": "Pressure from the water is ρgh = 1,000 × 10 × 15 = 1.5 × 10⁵ Pa. Adding atmospheric pressure gives 1.0 × 10⁵ + 1.5 × 10⁵ = 2.5 × 10⁵ Pa.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Physics",
  "topic": "Waves",
  "difficulty": "hard",
  "questionText": "A stationary wave is formed on a 0.80 m string fixed at both ends. If the string vibrates in its third harmonic and the wave speed is 120 m s⁻¹, what is the frequency?",
  "options": [
    { "key": "A", "text": "75 Hz" },
    { "key": "B", "text": "150 Hz" },
    { "key": "C", "text": "225 Hz" },
    { "key": "D", "text": "300 Hz" }
  ],
  "correctAnswer": "C",
  "explanation": "For the third harmonic of a string fixed at both ends, λ = 2L ÷ 3 = 1.60 ÷ 3 m. Thus f = v ÷ λ = 120 ÷ (1.60 ÷ 3) = 225 Hz.",
  "isAIGenerated": true
}
```

```json
{
  "subject": "Physics",
  "topic": "Current Electricity",
  "difficulty": "hard",
  "questionText": "Three resistors of 6 Ω, 12 Ω, and 4 Ω are connected in parallel across a 24 V battery of negligible internal resistance. What total current is drawn from the battery?",
  "options": [
    { "key": "A", "text": "4 A" },
    { "key": "B", "text": "6 A" },
    { "key": "C", "text": "10 A" },
    { "key": "D", "text": "12 A" }
  ],
  "correctAnswer": "D",
  "explanation": "Each parallel branch has 24 V across it: currents are 24/6 = 4 A, 24/12 = 2 A, and 24/4 = 6 A. The total is 4 + 2 + 6 = 12 A.",
  "isAIGenerated": true
}
```

## Review request

Please review the topics, stem tone, calculation depth, option quality, and difficulty calibration. On approval, the next pass will generate the planned 48-question batch for each subject, validate all records programmatically, and only then persist them to the existing JAMB question bank with `isAIGenerated: true`.

## References

[1] [JAMB IBASS E-syllabus](https://ibass.jamb.gov.ng/e-syllabus)

[2] [MySchool: UTME 2026 Chemistry syllabus](https://myschool.ng/classroom/jamb-syllabus/chemistry)

[3] [MySchool: UTME 2026 Physics syllabus](https://myschool.ng/classroom/jamb-syllabus/physics)
