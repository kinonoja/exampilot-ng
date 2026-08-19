import type { QuestionOption } from "../drizzle/schema";

export type SeedQuestion = {
  subject: "Mathematics" | "English" | "Biology";
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
};

const choices = (items: string[]): QuestionOption[] =>
  items.map((text, index) => ({ key: String.fromCharCode(65 + index), text }));

/**
 * Original questions written for ExamPilot. They are not reproductions of past
 * examination papers or official answer keys.
 */
export const jambSeedQuestions: SeedQuestion[] = [
  {
    subject: "Mathematics", topic: "Algebraic Expressions", difficulty: "easy",
    questionText: "Simplify 3x + 5x - 2.",
    options: choices(["8x - 2", "8x + 2", "15x - 2", "2x - 2"]), correctAnswer: "A",
    explanation: "3x and 5x are like terms, so their coefficients add to 8. The constant -2 remains unchanged.", tags: ["algebra", "like terms"],
  },
  {
    subject: "Mathematics", topic: "Linear Equations", difficulty: "easy",
    questionText: "Solve 2x - 7 = 11.",
    options: choices(["x = 2", "x = 9", "x = 18", "x = -9"]), correctAnswer: "B",
    explanation: "Add 7 to both sides to get 2x = 18, then divide both sides by 2.", tags: ["algebra", "equations"],
  },
  {
    subject: "Mathematics", topic: "Factorisation", difficulty: "medium",
    questionText: "Which expression is equivalent to x² - 5x + 6?",
    options: choices(["(x - 2)(x - 3)", "(x + 2)(x + 3)", "(x - 1)(x - 6)", "(x + 1)(x + 6)"]), correctAnswer: "A",
    explanation: "The required numbers multiply to +6 and add to -5. They are -2 and -3.", tags: ["algebra", "factorisation"],
  },
  {
    subject: "Mathematics", topic: "Indices", difficulty: "easy",
    questionText: "Evaluate 2³ × 2⁴.",
    options: choices(["16", "32", "64", "128"]), correctAnswer: "D",
    explanation: "For powers with the same base, add the indices: 2³ × 2⁴ = 2⁷ = 128.", tags: ["indices", "powers"],
  },
  {
    subject: "Mathematics", topic: "Ratio and Proportion", difficulty: "medium",
    questionText: "A class has boys and girls in the ratio 3:5. If there are 40 students altogether, how many are boys?",
    options: choices(["12", "15", "20", "25"]), correctAnswer: "B",
    explanation: "There are 3 + 5 = 8 equal parts. Each part is 40 ÷ 8 = 5, so boys = 3 × 5 = 15.", tags: ["ratio", "proportion"],
  },
  {
    subject: "Mathematics", topic: "Percentages", difficulty: "easy",
    questionText: "What is 20% of ₦450?",
    options: choices(["₦45", "₦75", "₦90", "₦120"]), correctAnswer: "C",
    explanation: "20% is 20/100. Therefore, 0.20 × 450 = 90.", tags: ["percentages", "commercial arithmetic"],
  },
  {
    subject: "Mathematics", topic: "Plane Geometry", difficulty: "easy",
    questionText: "Two angles of a triangle are 55° and 65°. Find the third angle.",
    options: choices(["50°", "60°", "65°", "70°"]), correctAnswer: "B",
    explanation: "Angles in a triangle total 180°. The remaining angle is 180° - (55° + 65°) = 60°.", tags: ["geometry", "angles"],
  },
  {
    subject: "Mathematics", topic: "Mensuration", difficulty: "medium",
    questionText: "Find the area of a circle of radius 7 cm. Use π = 22/7.",
    options: choices(["44 cm²", "77 cm²", "154 cm²", "308 cm²"]), correctAnswer: "C",
    explanation: "Area = πr² = (22/7) × 7 × 7 = 154 cm².", tags: ["geometry", "circle"],
  },
  {
    subject: "Mathematics", topic: "Coordinate Geometry", difficulty: "medium",
    questionText: "Find the midpoint of the line segment joining (2, 3) and (6, 7).",
    options: choices(["(3, 4)", "(4, 5)", "(5, 6)", "(8, 10)"]), correctAnswer: "B",
    explanation: "Average the x-coordinates and the y-coordinates: ((2 + 6)/2, (3 + 7)/2) = (4, 5).", tags: ["coordinate geometry", "midpoint"],
  },
  {
    subject: "Mathematics", topic: "Statistics", difficulty: "easy",
    questionText: "Find the mean of 4, 6, 8, 10, and 12.",
    options: choices(["6", "7", "8", "9"]), correctAnswer: "C",
    explanation: "The sum is 40 and there are 5 values. Mean = 40 ÷ 5 = 8.", tags: ["statistics", "mean"],
  },
  {
    subject: "Mathematics", topic: "Probability", difficulty: "medium",
    questionText: "A bag contains 3 red counters and 2 green counters. What is the probability of selecting a red counter at random?",
    options: choices(["2/5", "3/5", "1/2", "3/2"]), correctAnswer: "B",
    explanation: "There are 5 counters in total and 3 are red, so P(red) = 3/5.", tags: ["probability", "fractions"],
  },
  {
    subject: "Mathematics", topic: "Quadratic Equations", difficulty: "medium",
    questionText: "What are the roots of x² + 2x - 8 = 0?",
    options: choices(["2 and 4", "-2 and -4", "2 and -4", "-2 and 4"]), correctAnswer: "C",
    explanation: "Factorise as (x + 4)(x - 2) = 0. Hence x = -4 or x = 2.", tags: ["algebra", "quadratics"],
  },
  {
    subject: "Mathematics", topic: "Simultaneous Equations", difficulty: "hard",
    questionText: "Solve the simultaneous equations 2x + y = 11 and x - y = 1.",
    options: choices(["x = 3, y = 5", "x = 4, y = 3", "x = 5, y = 1", "x = 6, y = -1"]), correctAnswer: "B",
    explanation: "From x - y = 1, y = x - 1. Substitute into 2x + y = 11 to get 3x - 1 = 11, so x = 4 and y = 3.", tags: ["algebra", "simultaneous equations"],
  },
  {
    subject: "Mathematics", topic: "Logarithms", difficulty: "easy",
    questionText: "Evaluate log₁₀ 1000.",
    options: choices(["1", "2", "3", "10"]), correctAnswer: "C",
    explanation: "1000 = 10³, so log₁₀ 1000 = 3.", tags: ["logarithms", "indices"],
  },
  {
    subject: "Mathematics", topic: "Sequences", difficulty: "medium",
    questionText: "The first three terms of an arithmetic sequence are 7, 10, 13. What is the fifth term?",
    options: choices(["16", "18", "19", "22"]), correctAnswer: "C",
    explanation: "The common difference is 3. The sequence continues 16, 19, so the fifth term is 19.", tags: ["sequences", "arithmetic progression"],
  },
  {
    subject: "Mathematics", topic: "Sets", difficulty: "medium",
    questionText: "If P = {1, 2, 3, 4} and Q = {3, 4, 5}, how many elements are in P ∩ Q?",
    options: choices(["1", "2", "3", "5"]), correctAnswer: "B",
    explanation: "The intersection contains only elements common to both sets: {3, 4}. It has 2 elements.", tags: ["sets", "intersection"],
  },
  {
    subject: "Mathematics", topic: "Trigonometry", difficulty: "easy",
    questionText: "What is the value of sin 30°?",
    options: choices(["0", "1/2", "√3/2", "1"]), correctAnswer: "B",
    explanation: "A standard trigonometric value is sin 30° = 1/2.", tags: ["trigonometry", "standard angles"],
  },
  {
    subject: "Mathematics", topic: "Variation", difficulty: "hard",
    questionText: "If y varies directly as x and y = 15 when x = 5, find y when x = 8.",
    options: choices(["18", "20", "24", "40"]), correctAnswer: "C",
    explanation: "y = kx. Since 15 = 5k, k = 3. Therefore y = 3 × 8 = 24.", tags: ["variation", "proportion"],
  },
  {
    subject: "English", topic: "Concord", difficulty: "easy",
    questionText: "Choose the correct word: Each of the players ___ a jersey.",
    options: choices(["have", "has", "were having", "are having"]), correctAnswer: "B",
    explanation: "The subject is 'Each', which is singular, so it takes the singular verb 'has'.", tags: ["grammar", "subject-verb agreement"],
  },
  {
    subject: "English", topic: "Parts of Speech", difficulty: "easy",
    questionText: "In the sentence 'The athlete ran quickly', what part of speech is 'quickly'?",
    options: choices(["Noun", "Verb", "Adjective", "Adverb"]), correctAnswer: "D",
    explanation: "'Quickly' tells us how the athlete ran, so it modifies the verb and is an adverb.", tags: ["grammar", "parts of speech"],
  },
  {
    subject: "English", topic: "Vocabulary", difficulty: "easy",
    questionText: "Which word is closest in meaning to 'diligent'?",
    options: choices(["careless", "hardworking", "noisy", "uncertain"]), correctAnswer: "B",
    explanation: "A diligent person works carefully and persistently; 'hardworking' is the closest meaning.", tags: ["vocabulary", "synonyms"],
  },
  {
    subject: "English", topic: "Vocabulary", difficulty: "medium",
    questionText: "Which word is opposite in meaning to 'scarce'?",
    options: choices(["rare", "limited", "abundant", "small"]), correctAnswer: "C",
    explanation: "'Scarce' means in short supply. 'Abundant' means more than enough or plentiful.", tags: ["vocabulary", "antonyms"],
  },
  {
    subject: "English", topic: "Nouns", difficulty: "medium",
    questionText: "In the sentence 'The committee has reached its decision', what type of noun is 'committee'?",
    options: choices(["Abstract noun", "Collective noun", "Proper noun", "Material noun"]), correctAnswer: "B",
    explanation: "A committee is a group of people regarded as one unit, so it is a collective noun.", tags: ["grammar", "nouns"],
  },
  {
    subject: "English", topic: "Punctuation", difficulty: "medium",
    questionText: "Which sentence is punctuated correctly?",
    options: choices(["After the match the coach said 'We played well'.", "After the match, the coach said, 'We played well.'", "After the match the coach said, We played well.", "After the match, the coach said 'We played well'."]), correctAnswer: "B",
    explanation: "A comma follows the introductory phrase, a comma introduces the direct speech, and the full stop belongs inside the closing quotation mark.", tags: ["writing", "punctuation"],
  },
  {
    subject: "English", topic: "Tenses", difficulty: "medium",
    questionText: "Choose the best completion: By next June, Ada ___ her internship.",
    options: choices(["completes", "completed", "will have completed", "has completed"]), correctAnswer: "C",
    explanation: "The future perfect tense ('will have completed') describes an action that will be finished before a future time.", tags: ["grammar", "tenses"],
  },
  {
    subject: "English", topic: "Reported Speech", difficulty: "medium",
    questionText: "Musa said, 'I am tired.' Which is the correct reported speech form?",
    options: choices(["Musa said that I am tired.", "Musa said that he was tired.", "Musa says that he is tired.", "Musa said that he has tired."]), correctAnswer: "B",
    explanation: "When the reporting verb is in the past, present 'am' normally shifts to past 'was' and 'I' becomes 'he'.", tags: ["grammar", "reported speech"],
  },
  {
    subject: "English", topic: "Sentence Analysis", difficulty: "medium",
    questionText: "In the sentence 'The librarian gave Musa a book', which word is the indirect object?",
    options: choices(["librarian", "gave", "Musa", "book"]), correctAnswer: "C",
    explanation: "The book is the direct object. Musa receives the book, so Musa is the indirect object.", tags: ["grammar", "objects"],
  },
  {
    subject: "English", topic: "Verb Phrases", difficulty: "medium",
    questionText: "Which group of words is the verb phrase in 'They have been studying since dawn'?",
    options: choices(["They", "have been studying", "since dawn", "studying since"]), correctAnswer: "B",
    explanation: "The auxiliary verbs 'have been' work with the main verb 'studying' to form the verb phrase.", tags: ["grammar", "verb phrases"],
  },
  {
    subject: "English", topic: "Comparison", difficulty: "easy",
    questionText: "Choose the correct form: This route is ___ than the old one.",
    options: choices(["more careful", "careful", "most careful", "carefuller"]), correctAnswer: "A",
    explanation: "For many two-syllable adjectives such as 'careful', use 'more' to make the comparative form.", tags: ["grammar", "adjectives"],
  },
  {
    subject: "English", topic: "Articles", difficulty: "easy",
    questionText: "Choose the correct article: She is ___ honest student.",
    options: choices(["a", "an", "the", "no article"]), correctAnswer: "B",
    explanation: "'Honest' begins with a vowel sound because the h is silent, so it takes 'an'.", tags: ["grammar", "articles"],
  },
  {
    subject: "English", topic: "Idioms", difficulty: "medium",
    questionText: "If someone 'hits the nail on the head', the person has:",
    options: choices(["made an exact statement", "become angry", "missed an opportunity", "finished work quickly"]), correctAnswer: "A",
    explanation: "The idiom means saying or doing something exactly right.", tags: ["vocabulary", "idioms"],
  },
  {
    subject: "English", topic: "Sentence Types", difficulty: "hard",
    questionText: "What type of sentence is 'Although it rained, we travelled to Abuja'?",
    options: choices(["Simple sentence", "Compound sentence", "Complex sentence", "Minor sentence"]), correctAnswer: "C",
    explanation: "It contains a main clause and a dependent clause introduced by 'Although', making it complex.", tags: ["grammar", "sentence structure"],
  },
  {
    subject: "English", topic: "Register", difficulty: "medium",
    questionText: "Which expression is most suitable in a formal letter?",
    options: choices(["Just wanted to tell you...", "We regret to inform you that...", "Hey, here is the gist...", "You will not believe this..."]), correctAnswer: "B",
    explanation: "Formal letters use respectful, professional language. 'We regret to inform you that...' fits that register.", tags: ["writing", "register"],
  },
  {
    subject: "English", topic: "Articles", difficulty: "hard",
    questionText: "Choose the correct article: He is ___ university student.",
    options: choices(["a", "an", "the", "no article"]), correctAnswer: "A",
    explanation: "'University' begins with the consonant sound /y/ as in 'you', so it takes 'a', not 'an'.", tags: ["grammar", "articles"],
  },
  {
    subject: "Biology", topic: "Cell Structure", difficulty: "easy",
    questionText: "Which cell structure controls what enters and leaves a cell?",
    options: choices(["Cell membrane", "Nucleus", "Vacuole", "Cell wall"]), correctAnswer: "A",
    explanation: "The cell membrane is selectively permeable and regulates movement of substances into and out of the cell.", tags: ["cells", "membranes"],
  },
  {
    subject: "Biology", topic: "Transport in Cells", difficulty: "medium",
    questionText: "Osmosis is the movement of:",
    options: choices(["solutes from high to low concentration", "water through a selectively permeable membrane", "oxygen into the blood", "food through the intestine"]), correctAnswer: "B",
    explanation: "Osmosis is the movement of water molecules across a selectively permeable membrane from higher to lower water potential.", tags: ["cells", "osmosis"],
  },
  {
    subject: "Biology", topic: "Photosynthesis", difficulty: "easy",
    questionText: "Which pigment absorbs light energy for photosynthesis?",
    options: choices(["Haemoglobin", "Chlorophyll", "Melanin", "Insulin"]), correctAnswer: "B",
    explanation: "Chlorophyll, found in chloroplasts, absorbs light energy used to make glucose during photosynthesis.", tags: ["plants", "photosynthesis"],
  },
  {
    subject: "Biology", topic: "Plant Cells", difficulty: "medium",
    questionText: "Which structure is typically large and permanent in a mature plant cell?",
    options: choices(["Mitochondrion", "Central vacuole", "Ribosome", "Centrosome"]), correctAnswer: "B",
    explanation: "A mature plant cell commonly has a large central vacuole containing cell sap, which helps maintain turgor.", tags: ["cells", "plant cells"],
  },
  {
    subject: "Biology", topic: "Respiration", difficulty: "easy",
    questionText: "Where does most aerobic respiration occur in a cell?",
    options: choices(["Cell membrane", "Mitochondrion", "Nucleus", "Chloroplast"]), correctAnswer: "B",
    explanation: "Mitochondria release energy from food during aerobic respiration.", tags: ["cells", "respiration"],
  },
  {
    subject: "Biology", topic: "Nutrition", difficulty: "easy",
    questionText: "Which nutrient is mainly needed for growth and repair of body tissues?",
    options: choices(["Carbohydrate", "Protein", "Vitamin C", "Water"]), correctAnswer: "B",
    explanation: "Proteins supply amino acids used for growth and the repair of worn-out tissues.", tags: ["nutrition", "nutrients"],
  },
  {
    subject: "Biology", topic: "Ecology", difficulty: "medium",
    questionText: "In a food chain, organisms that obtain energy by feeding on other organisms are called:",
    options: choices(["producers", "consumers", "decomposers", "autotrophs"]), correctAnswer: "B",
    explanation: "Consumers cannot make their own food. They obtain energy by eating plants or other animals.", tags: ["ecology", "food chains"],
  },
  {
    subject: "Biology", topic: "Ecology", difficulty: "medium",
    questionText: "What is the main direction of energy flow in a simple food chain?",
    options: choices(["from consumers to the Sun", "from the Sun to producers and then consumers", "from decomposers to producers only", "from predators to plants"]), correctAnswer: "B",
    explanation: "Energy enters most ecosystems from sunlight, is captured by producers, then moves to consumers through feeding.", tags: ["ecology", "energy flow"],
  },
  {
    subject: "Biology", topic: "Genetics", difficulty: "medium",
    questionText: "If a homozygous tall plant (TT) is crossed with a homozygous short plant (tt), what genotype will all first-generation offspring have?",
    options: choices(["TT", "Tt", "tt", "Ttt"]), correctAnswer: "B",
    explanation: "Each offspring receives T from the tall parent and t from the short parent, giving the heterozygous genotype Tt.", tags: ["genetics", "inheritance"],
  },
  {
    subject: "Biology", topic: "Genetics", difficulty: "hard",
    questionText: "A dominant allele is one that:",
    options: choices(["is always more common in a population", "is expressed when present with a recessive allele", "can only occur in males", "disappears in the next generation"]), correctAnswer: "B",
    explanation: "A dominant allele shows its effect in a heterozygote, where it is paired with a recessive allele.", tags: ["genetics", "alleles"],
  },
  {
    subject: "Biology", topic: "Excretion", difficulty: "easy",
    questionText: "Which organ removes urea from the blood and produces urine?",
    options: choices(["Heart", "Kidney", "Lung", "Stomach"]), correctAnswer: "B",
    explanation: "The kidneys filter blood, removing urea and excess water to form urine.", tags: ["human systems", "excretion"],
  },
  {
    subject: "Biology", topic: "Hormonal Coordination", difficulty: "medium",
    questionText: "Which hormone helps lower blood glucose concentration after a meal?",
    options: choices(["Adrenaline", "Insulin", "Thyroxine", "Oestrogen"]), correctAnswer: "B",
    explanation: "Insulin encourages cells to take in glucose and the liver to store excess glucose as glycogen.", tags: ["human systems", "hormones"],
  },
  {
    subject: "Biology", topic: "Circulatory System", difficulty: "medium",
    questionText: "Which blood vessel carries blood away from the heart?",
    options: choices(["Artery", "Capillary", "Vein", "Venule"]), correctAnswer: "A",
    explanation: "Arteries carry blood away from the heart. Veins carry blood back to it.", tags: ["human systems", "circulation"],
  },
  {
    subject: "Biology", topic: "Reproduction", difficulty: "easy",
    questionText: "Fertilisation is the union of:",
    options: choices(["two body cells", "a sperm cell and an egg cell", "two red blood cells", "a zygote and an embryo"]), correctAnswer: "B",
    explanation: "Fertilisation occurs when the male gamete (sperm) joins the female gamete (egg) to form a zygote.", tags: ["reproduction", "fertilisation"],
  },
  {
    subject: "Biology", topic: "Adaptation", difficulty: "medium",
    questionText: "Thick fur helps an animal living in a cold region mainly by:",
    options: choices(["absorbing more sunlight", "reducing heat loss", "increasing water loss", "making more food"]), correctAnswer: "B",
    explanation: "Fur traps a layer of air next to the body, reducing heat loss to the cold surroundings.", tags: ["ecology", "adaptation"],
  },
  {
    subject: "Biology", topic: "Classification", difficulty: "hard",
    questionText: "In binomial nomenclature, the two parts of an organism's scientific name are its:",
    options: choices(["family and order", "kingdom and phylum", "genus and specific epithet", "class and species group"]), correctAnswer: "C",
    explanation: "A binomial scientific name has two words: the genus name followed by the specific epithet.", tags: ["classification", "taxonomy"],
  },
];

export const seedSubjects = ["Mathematics", "English", "Biology"] as const;
