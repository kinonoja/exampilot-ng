export type JambSyllabusSubject = {
  name: string;
  aliases?: readonly string[];
  topics: readonly string[];
};

/**
 * Approved 22 August 2026 reconciliation of JAMB's public IBASS e-syllabus.
 * This is a syllabus structure only: it neither contains questions nor signals
 * that every listed subject currently has an ExamPilot practice bank.
 */
export const approvedJambSyllabusCatalogue: readonly JambSyllabusSubject[] = [
  {
    name: "Agriculture Science",
    aliases: ["Agricultural Science"],
    topics: [
      "Meaning and Scope of Agriculture", "Importance of Agriculture", "Agricultural Ecology", "Agricultural Genetics", "Farm Inputs", "History of Agricultural Development in West Africa", "Roles of Government and NGOs in Agricultural Development",
      "Rocks and Soil Formation", "Soil Water and Soil Conservation", "Soil Fertility", "Land Preparation and Soil Tillage", "Plant Forms and Functions", "Growth, Development and Reproduction", "Plant Propagation Methods", "Cropping Systems, Planting Patterns and Plant Density", "Crop Husbandry", "Pasture and Forage Crops", "Floriculture", "Weeds", "Crop Diseases", "Crop Pests", "Forest Management (Silviculture)",
      "Forms and Classification of Major Farm Animals", "General Terminologies in Animal Production", "Anatomy and Physiology of Farm Animals", "Reproduction in Farm Animals", "Animal Nutrition", "Livestock Management", "Animal Health", "Fisheries and Wildlife", "Bee-keeping (Apiculture)",
      "Factors of Agricultural Production", "Basic Economic Principles", "Farm Surveying and Farmstead Planning", "Simple Farm Tools", "Farm Machinery and Implements", "Mechanisation and Sources of Farm Power", "Processing and Storage", "Introduction to Biotechnology", "Application of ICT in Agriculture", "Introduction to Agricultural Research",
    ],
  },
  {
    name: "Arabic",
    topics: [
      "Comprehension", "Translation", "Demonstrative, Relative, Conditional and Interrogative Pronouns", "Gender", "Characteristics of Nouns", "Dual", "Plurals", "Construct Phrase", "Separable and Inseparable Pronouns", "Appendant Forms", "Prepositions", "Transitive and Intransitive Verbs", "Perfect Verb", "Imperfect Verb", "Imperative Verb", "Modifiers", "Trilateral and Derived Verbs", "Verbal Noun", "Derivatives", "Conditional Sentences", "Numerals", "Active and Passive Voice", "Subject and Predicate", "Nouns in the Accusative", "Composition", "Arabic Literature",
    ],
  },
  {
    name: "Art",
    topics: [
      "Classification of Art", "Elements and Principles of Art", "Art Terms", "Historical Dimensions of Art", "Traditional African Art", "Traditional Nigerian Art", "Nigerian Crafts", "Development in Contemporary Art", "Artistic Skills, Techniques and Processes", "Tools, Materials and Equipment", "Art Appreciation", "Meaning and Functions of Art", "Art Entrepreneurship",
    ],
  },
  {
    name: "Biology",
    topics: [
      "Living Organisms", "Evolution among Organisms", "Structural, Functional and Behavioural Adaptations", "Internal Structure of a Flowering Plant", "Nutrition", "Transport", "Respiration", "Excretion", "Support and Movement", "Reproduction", "Growth", "Co-ordination and Control", "Factors Affecting Distribution of Organisms", "Symbiotic Interactions of Plants", "Natural Habitats", "Local (Nigerian) Biomes", "Ecology of Populations", "Soil", "Humans and Environment", "Heredity", "Biotechnology", "Theories of Evolution", "Evidence of Evolution",
    ],
  },
  {
    name: "Chemistry",
    topics: [
      "Separation of Mixtures and Purification of Chemical Substances", "Chemical Combination", "Kinetic Theory of Matter and Gas Laws", "Atomic Structure and Bonding", "Nuclear Chemistry", "Solubility", "Environmental Pollution", "Acids, Bases and Salts", "Oxidation and Reduction (Redox)", "Electrolysis", "Energy Changes", "Rates of Chemical Reaction", "Chemical Equilibria", "Non-metals and their Compounds", "Metals and their Compounds", "Organic Compounds", "Chemistry and Industry", "Astronomical Chemistry",
    ],
  },
  {
    name: "Christian Religious Studies",
    aliases: ["CRS"],
    topics: [
      "Sovereignty of God", "Covenant", "Leadership Qualities", "Divine Providence, Guidance and Protection", "Parental Responsibility", "Obedience and Disobedience", "A Man after God's Own Heart", "Decision-Making", "Greed and its Effects", "Supremacy of God", "Religious Reforms in Judah", "Concern for Judah", "Faith, Courage and Protection", "God's Message to Nineveh", "Social Justice, True Religion and Divine Love", "Holiness and Divine Call", "Punishment and Hope", "Birth and Early Life of Jesus", "Baptism and Temptation of Jesus", "Discipleship", "Miracles", "Parables", "Sermon on the Mount", "Mission of the Disciples", "Great Confession", "Transfiguration", "Triumphal Entry and Passion", "Last Supper", "Trials and Death of Jesus", "Resurrection and Appearances", "Jesus' Teachings", "Love", "Fellowship in the Early Church", "Holy Spirit and the Mission", "Opposition to the Gospel Message", "Mission to the Gentiles", "Justification by Faith", "Law and Grace", "New Life in Christ", "Christians as Joint Heirs with Christ", "Humility", "Forgiveness", "Spiritual Gifts", "Christian Giving", "Civic Responsibility", "Dignity of Labour", "Second Coming of Christ", "Impartiality", "Effective Prayer", "Christian Living in the Community", "Corruption", "Sexual Immorality",
    ],
  },
  {
    name: "Commerce",
    topics: [
      "Commerce", "Occupation", "Production", "Trade", "Purchase and Sale of Goods", "Aids-to-Trade", "Business Units", "Financing Business", "Trade Associations", "Money", "Stock Exchange", "Elements of Business Management", "Elements of Marketing", "Legal Aspects of Business", "Commodity Exchange", "Business Environment and Social Responsibility",
    ],
  },
  {
    name: "Computer Studies",
    topics: [
      "Evolution of Computing Systems", "Basic Concepts of Computer and its Operations", "Problem-solving Skills, Data Processing and Practical Skills in Computing", "System Software and Application Software", "Basic Computer Hardware Operations", "Online Resources and Online Skills", "Ethics and Human Issues in Computing", "Career Prospects in Computing", "History of Computing", "Classification of Computing Devices", "Overview of Computing Systems", "Data and Information", "Word Processing Package", "Spreadsheet Package", "Database Package", "Graphics Package", "Presentation Package", "Web Design Package", "Concept of Computer Files", "Handling Computer Files", "Booting and Shutting Down", "Computer Maintenance", "Computer Room Management", "Communication Systems", "Application Areas of ICT", "Internet", "Electronic Mail", "Networking", "World Wide Web", "Cables and Connectors", "Programming Languages", "High-Level Languages", "Algorithms and Flowcharts", "Programming-Language Structure", "Program Development", "System Development Life Cycle", "Definition of AI", "Branches of AI", "Applications of AI", "Fundamentals of Robotics", "Computer Security", "Cyber Risks and Protection", "Potentials for Higher Studies in Computing",
    ],
  },
  {
    name: "Economics",
    topics: [
      "Economics as a Science", "Economic Systems", "Methods and Tools of Economic Analysis", "Theory of Demand", "Theory of Consumer Behaviour", "Theory of Supply", "Theory of Price Determination", "Theory of Production", "Theory of Costs and Revenue", "Market Structures", "National Income", "Money and Inflation", "Financial Institutions", "Public Finance", "Economic Growth and Development", "Agriculture in Nigeria", "Industry and Industrialisation", "Natural Resources and the Nigerian Economy", "Business Organisations", "Population", "International Trade", "International Economic Organisations", "Factors of Production and their Theories",
    ],
  },
  {
    name: "French",
    topics: ["Written Comprehension in French", "Structure and Use of Written French", "Workings of French Sounds", "Culture and Civilisation"],
  },
  {
    name: "Geography",
    topics: [
      "Maps", "Scale and Measurement of Distances, Areas, Reduction, Enlargement, Directions, Bearings and Gradients", "Map Reading and Interpretation", "Interpretation of Statistical Data, Maps and Diagrams", "Elementary Surveying", "Geographic Information System (GIS)", "Earth as a Planet", "Earth Crust", "Volcanism and Earthquakes", "Denudation Processes in the Tropics", "Water Bodies", "Weather and Climate", "Vegetation", "Soils", "Environmental Resources", "Environmental Interaction", "Environmental Hazards", "Environmental Conservation", "Population", "Settlement", "Selected Economic Activities", "Broad Outline of Nigeria", "Economic and Human Geography of Nigeria", "ECOWAS",
    ],
  },
  {
    name: "Government",
    topics: [
      "Definition and Scope of Government", "Basic Concepts of Government", "Forms of Government", "Arms of Government", "Structures of Governance", "Systems of Governance", "Political Ideologies", "Constitution", "Principles of Democratic Government", "Processes of Legislation", "Citizenship", "Electoral Process", "Political Parties and Party Systems", "Pressure Groups", "Public Opinion", "Civil Service/Public Service", "Pre-colonial Polities", "Imperialist Penetration", "Process of Decolonisation", "Constitutional Development in Nigeria", "Post-Independence Constitutions", "Institutions of Government in the Post-Independence Period", "Public Commissions", "Political Parties and Party Politics in Nigeria", "Structure and Workings of Nigerian Federalism", "Public Corporations and Parastatals", "Local Government", "Military in Nigerian Politics", "Foreign Policy", "Nigeria's Foreign Policy", "Nigeria's Relations with African Countries", "Nigeria in International Organisations", "International Organisations",
    ],
  },
  {
    name: "Hausa",
    topics: ["Harshe (Language)", "Al'adu (Culture)", "Adabi (Literature: Oral and Written Literature)"],
  },
  {
    name: "History",
    topics: [
      "Land and Peoples of the Nigeria Area", "Early Centres of Civilisation", "Origins and Formation of States", "Economic Activities and Growth of States", "External Influences", "Sokoto Caliphate", "Kanem-Borno", "Yorubaland", "Benin", "Nupe", "Igbo", "Efik", "European Penetration and Impact", "British Conquest of the Nigeria Area", "Establishment of Colonial Rule to 1914", "Amalgamation of 1914", "Colonial Administration after Amalgamation", "Social Development under Colonial Rule", "Constitutional Development and Nationalism", "Politics of the First Republic and Military Intervention", "Nigerian Civil War", "Gowon Regime", "Murtala/Obasanjo Regime", "Second Republic", "Buhari Regime", "Babangida Regime", "Interim National Government", "Abacha Regime", "Transition to the Fourth Republic", "Nigeria in International Organisations", "Islamic Reform Movements and State Building in West Africa", "Sierra Leone, Liberia and Christian Missionary Activities", "Ethiopia in the 19th Century", "Mfecane", "Great Trek", "New Imperialism and European Occupation of Africa", "Patterns of Colonial Rule in Africa", "Politics of Decolonisation", "Apartheid in South Africa", "Problems of Nation-building in Africa",
    ],
  },
  {
    name: "Home Economics",
    topics: [
      "Home Economics", "Areas/Careers in Home Economics", "Interrelationship of Home Economics with Other Subjects", "Principles of Home Management", "Resources", "Family Living", "Marriage and Reproductive Health", "Pregnancy and Childbirth", "Housing the Family", "Home Surfaces", "Sanitation in the Home", "Consumer Education", "Foods and Nutrition", "Meal Planning", "Cookers and Cooking", "Flours and Uses", "Basic Mixtures", "Scientific Methods in Foods and Nutrition", "Kitchen", "Kitchen Safety and Hygiene", "Food Storage and Preservation", "Home Gardening", "Fibres and Fabrics", "Sewing Equipment and Garment Construction", "Laundry and Care of Clothes",
    ],
  },
  {
    name: "Igbo",
    topics: [
      "Essay (Edemede)", "Comprehension (Aghọtaazaa)", "Sounds and Sound Patterns", "Spelling and Spelling Rules", "Igbo Orthography", "Dialect and Standard Igbo", "Igbo Word Derivation", "Grammar (Ụtọasụsụ)", "Translation (Ntụgharị)", "Literary Devices (Atụmatụokwu)", "Oral Literature (Agụmagụ Ọnụ)", "Written Literature (Agụmagụ Edere)", "Greetings and Hospitality", "Chieftaincy and Governance", "Inheritance and Funerals", "Traditional Beliefs and Worship", "Marriage and Naming", "Masquerade and Social Institutions", "Traditional Games", "Occupations and Food", "Festivals", "Acceptable Behaviour and Values", "Contemporary Issues in Igbo",
    ],
  },
  {
    name: "Islamic Studies",
    aliases: ["IRS"],
    topics: [
      "Revelation of the Glorious Qur'ān", "Tafsīr", "Introduction to Tajwīd", "Study of the Arabic Text of Selected Qur'ānic Passages", "Study of the Arabic Text of Selected Hadīth", "Moral Lessons in the Glorious Qur'ān and Hadīth", "Tawhīd and Fiqh", "Articles of Faith", "Ibadāt and Their Types", "Family Matters", "Sources and Schools of Law", "Islamic Economic System", "Islamic Political System", "Pre-Islamic Arabia (Jāhiliyyah)", "Life of Prophet Muhammad (SAW)", "Rightly Guided Caliphs (al-Khulafā'u al-Rāshidūn)", "Early Contact of Islam with Africa", "Impact of Islam in West Africa", "Contributions of Islam to Education",
    ],
  },
  {
    name: "Literature in English",
    topics: ["Drama", "Prose", "Poetry", "General Literary Terms", "Literary Appreciation"],
  },
  {
    name: "Mathematics",
    topics: [
      "Number Bases/Modular Arithmetic", "Fractions, Decimals, Approximations and Percentages", "Indices, Logarithms and Surds", "Sets", "Polynomials", "Variation", "Inequalities", "Progression", "Binary Operations", "Matrices and Determinants", "Euclidean Geometry", "Mensuration", "Loci", "Coordinate Geometry", "Trigonometry", "Differentiation", "Application of Differentiation", "Integration", "Representation of Data", "Measures of Location", "Measures of Dispersion", "Permutation and Combination", "Probability",
    ],
  },
  {
    name: "Music",
    topics: [
      "Staff", "Music Notes/Rests and Values", "Time-signature", "Key-signatures and Scales", "Keyboard Setting and Enharmonic Equivalents", "Accidentals", "Intervals", "Musical Terms, Signs and Abbreviations", "Transcription and Transposition", "Triads and Inversions", "Basic Chord Progressions", "Kinds of Motion", "Cadences", "Non-harmonic/Non-chord Tones", "Modulation", "Elementary Composition", "Nigerian Folksongs", "Nigerian Traditional Music and Other Arts", "Nigerian Traditional Musical Instruments", "African Traditional Musicians", "Evolution and Development of African Popular Music", "African Popular Musicians", "African Art Musicians", "Historical Development of Western Music Styles", "Composers", "Music Forms and Media", "Introduction to AI in Music Technology", "Black Musicians in the Diaspora", "Diaspora Music Forms", "Spirit of Nationalism in Nigerian Music",
    ],
  },
  {
    name: "Physics",
    topics: [
      "Measurements and Units", "Scalars and Vectors", "Motion", "Gravitational Field", "Equilibrium of Forces", "Work, Energy and Power", "Friction", "Simple Machines", "Elasticity", "Pressure", "Liquids at Rest", "Temperature and its Measurement", "Quantity of Heat", "Change of State", "Thermal Expansion", "Gas Laws", "Vapours", "Structure of Matter and Kinetic Theory", "Heat Transfer", "Waves", "Propagation of Sound Waves", "Characteristics of Sound Waves", "Light Energy", "Reflection of Light at Plane and Curved Surfaces", "Refraction of Light through Plane and Curved Surfaces", "Optical Instruments", "Dispersion and Colour of Light", "Electrostatics", "Capacitors", "Electric Cells", "Current Electricity", "Electrical Energy and Power", "Magnets and Magnetic Fields", "Force on a Current-Carrying Conductor in a Magnetic Field", "Electromagnetic Induction", "Simple A.C. Circuits", "Conduction of Electricity through Liquids and Gases", "Elementary Modern Physics", "Introductory Electronics", "Introduction to Fibre Optics and Lasers",
    ],
  },
  {
    name: "Physical and Health Education",
    topics: [
      "Principles, Meaning, Scope and Philosophy of Physical Education", "Philosophy, Objectives and Settings of Health Education", "Cells, Tissues and Systems of the Human Body", "Skeletal System", "Muscular System", "Nervous System and Sense Organs", "Circulatory System", "Respiratory System", "Excretory System", "Somatotypes and Posture", "Athletics", "Ball Games", "Racket Games", "Food", "Nutrition", "Drugs", "Physical Fitness", "Conditioning Programme", "Recreation and Leisure", "Dance", "First Aid", "Safety Education", "Sports Competitions", "Institutional Games", "International Sports Competitions", "Disability and Special Needs", "Adapted Physical Activities", "Social and Emotional Problems of People with Disabilities", "Prevention of Disability", "Corrective Exercises", "Personal Health", "Community Health", "Environmental Health", "Disease", "Communicable Diseases", "Family", "Human Sexuality Education", "Family Planning",
    ],
  },
  {
    name: "Principles of Accounts",
    aliases: ["Financial Accounting"],
    topics: [
      "Nature and Significance of Bookkeeping", "Principles of Double Entry", "Ethics, Professional and Regulatory Bodies", "Cash Book", "Bank Transactions and Reconciliation", "Final Accounts of a Sole Proprietor", "Stock Valuation", "Control Accounts", "Incomplete Records and Single Entry", "Manufacturing Accounts", "Accounts of Not-for-Profit-Making Organisations", "Departmental Accounts", "Branch Accounts", "Joint Venture Accounts", "Partnership Accounts", "Introduction to Company Accounts", "Public Sector Accounting", "Information Technology in Accounting",
    ],
  },
  {
    name: "Use of English",
    aliases: ["English", "English Language"],
    topics: [
      "Description", "Narration", "Exposition", "Argumentation/Persuasion", "Comprehension Passages", "Cloze Passage", "Approved Reading Text", "Synthesis of Ideas/Summary", "Synonyms", "Antonyms", "Clause and Sentence Patterns", "Word Classes and Their Functions", "Mood, Tense, Aspect, Number, Agreement/Concord, Degree and Question Tags", "Mechanics", "Ordinary, Figurative and Idiomatic Usage", "Sentence Interpretation", "Basic Grammar", "Vowels", "Consonants", "Rhymes", "Word Stress", "Emphatic Stress in Connected Speech",
    ],
  },
  {
    name: "Yoruba",
    topics: [
      "Comprehension (Prose and Verse)", "Essay Writing", "Sound System", "Grammar", "Current Orthography", "Translation", "Oral Literature: Prose", "Oral Literature: Drama", "Written Literature: Prose", "Written Literature: Poetry", "Written Literature: Drama", "Èrò àti Ìgbàgbọ́ (Beliefs)", "Ètò Ìṣèlú àti Ààbò Ìlú (Governance and Security)", "Ètò Ìsìnkú àti Ogún Pínpín (Burial and Inheritance)", "Òǹkà Yorùbá (Numeration)", "Ètò Ìgbéyàwó àti Ìsọmọlórúkọ (Marriage and Naming)", "Ètò Ìwòsàn (Healthcare)", "Eré Ìdárayá (Games)", "Iṣẹ́ Abínibí àti Oúnjẹ Ilẹ̀ Yorùbá (Traditional Occupations and Food)", "Ẹ̀ kọ́ Ilé (Values and Behaviour)",
    ],
  },
];

export const JAMB_OFFICIAL_SUBJECT_COUNT = approvedJambSyllabusCatalogue.length;

export function findApprovedJambSubject(name: string) {
  const normalized = name.trim().toLocaleLowerCase();
  return approvedJambSyllabusCatalogue.find(subject =>
    [subject.name, ...(subject.aliases ?? [])].some(candidate => candidate.toLocaleLowerCase() === normalized),
  );
}

export function isApprovedJambSyllabusSubject(name: string) {
  return Boolean(findApprovedJambSubject(name));
}
