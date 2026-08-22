# JAMB Subject and Topic Review Package

> **Decision required before implementation:** This is a research and import-design document only. It does **not** insert subjects, topics, questions, or change the student-facing application. Please approve the catalogue and import approach explicitly before any database write or UI change is made.

## Scope, Evidence, and Current Boundary

This package reconciles the current public JAMB Integrated Brochure & Syllabus System (IBASS) e-syllabus catalogue. The official catalogue contains **25 UTME subjects**. Each source PDF was collected from JAMB’s public IBASS e-syllabus and converted to text for reconciliation on 22 August 2026. The complete per-subject links are maintained in [`JAMB_OFFICIAL_SYLLABUS_SOURCE_MANIFEST.md`](./JAMB_OFFICIAL_SYLLABUS_SOURCE_MANIFEST.md).

The lists below represent the **published syllabus topic structure**, not past questions or a promise that practice questions already exist for every topic. ExamPilot currently has JAMB practice questions only for **Mathematics, English, Biology, Chemistry, and Physics**. Adding the approved syllabus structure must therefore label the other subjects honestly as **syllabus mapped; practice questions coming**, rather than presenting them as live question banks.

| Evidence item | Result |
|---|---|
| Official source catalogue | 25 public IBASS e-syllabus entries over three official catalogue pages |
| Official PDFs collected | 25 of 25 |
| Existing JAMB subjects in ExamPilot | 5: Mathematics, English, Biology, Chemistry, Physics |
| Existing JAMB subject IDs to preserve | Mathematics `1`; English `2`; Biology `3`; Chemistry `2010001`; Physics `2370001` |
| Existing question-bank boundary | No new questions are proposed in this package |
| Database write during research | None |

### Reading the Inventory

Topic labels retain JAMB’s wording where extraction was clear. Where the PDF uses a section title followed by numbered items, the package preserves both the section and the individual item so that the eventual product can display readable groupings. Formatting, punctuation, and capitalisation have been normalised only for legibility; no curriculum area has been invented.

## Official Subject Inventory

| # | Official IBASS subject | Syllabus-source confidence | Review conclusion |
|---:|---|---|---|
| 1 | Agriculture Science | High | Full section and topic extraction |
| 2 | Arabic | High | Full five-section structure recovered directly |
| 3 | Art | High | Full section structure recovered |
| 4 | Biology | High | Five published coverage areas reconciled |
| 5 | Chemistry | High | 18 published topics reconciled; existing question bank retained |
| 6 | Christian Religious Studies | High | Multi-part Biblical structure reconciled |
| 7 | Commerce | High | 16 published topics reconciled |
| 8 | Computer Studies | High | Updated computing, AI, robotics, and ethics structure reconciled |
| 9 | Economics | High | 23 published topics reconciled |
| 10 | French | High | Direct check confirms four published areas |
| 11 | Geography | High | Direct review recovered practical, physical, human, and regional areas |
| 12 | Government | High | General, Nigerian, foreign-policy, and international coverage reconciled |
| 13 | Hausa | High | Three published domains reconciled |
| 14 | History | High | Nigerian, West African, African, and global historical coverage reconciled |
| 15 | Home Economics | High | Home management, food, clothing, and textiles coverage reconciled |
| 16 | Igbo | Medium | Core Language, Literature, Culture, and topical-issues structure clear; several source labels are orthography/diacritic-sensitive |
| 17 | Islamic Studies | High | Qur’an, Tawhid/Fiqh, Sirah, and West African Islam areas reconciled |
| 18 | Literature in English | High | Five published literature/appreciation areas reconciled |
| 19 | Mathematics | High | Direct check confirms all five domains and 23 named items |
| 20 | Music | High | Direct check confirms five published sections |
| 21 | Physics | High | Full 40-item topic list reconciled; existing question bank retained |
| 22 | Physical and Health Education | High | Physical education and health topic clusters reconciled |
| 23 | Principles of Accounts | High | 18 published topics reconciled |
| 24 | Use of English | High | Direct check confirms three sections and their detailed areas |
| 25 | Yoruba | High | Direct check confirms Language, Literature, and Culture areas |

## Subject-by-Subject Topic Inventory

### 1. Agriculture Science

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/AgricPdf.9465f3cd595e9542868a.pdf)  
**Published structure:** Foundations; Soils and Crop Production; Animal Production; Agricultural Economics and Extension; Agricultural Technology.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Foundations | Meaning and Scope of Agriculture; Importance of Agriculture; Agricultural Ecology; Agricultural Genetics; Farm Inputs; History of Agricultural Development in West Africa; Roles of Government and NGOs in Agricultural Development |
| Soils and crop production | Rocks and Soil Formation; Soil Water and Soil Conservation; Soil Fertility; Land Preparation and Soil Tillage; Plant Forms and Functions; Growth, Development and Reproduction; Plant Propagation Methods; Cropping Systems, Planting Patterns and Plant Density; Crop Husbandry; Pasture and Forage Crops; Floriculture; Weeds; Crop Diseases; Crop Pests; Forest Management (Silviculture) |
| Animal production | Forms and Classification of Major Farm Animals; General Terminologies in Animal Production; Anatomy and Physiology of Farm Animals; Reproduction in Farm Animals; Animal Nutrition; Livestock Management; Animal Health; Fisheries and Wildlife; Bee-keeping (Apiculture) |
| Economics and extension | Factors of Agricultural Production; Basic Economic Principles |
| Technology | Farm Surveying and Farmstead Planning; Simple Farm Tools; Farm Machinery and Implements; Mechanisation and Sources of Farm Power; Processing and Storage; Introduction to Biotechnology; Application of ICT in Agriculture; Introduction to Agricultural Research |

### 2. Arabic

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Arabic.233fe7117fc534609a6e.pdf)  
**Published structure:** Comprehension; Translation; Grammar; Composition; Arabic Literature.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Comprehension | Standard Arabic comprehension passages on current affairs, sports, education, politics, economy, health, culture, and ethics |
| Translation | English-to-Arabic and Arabic-to-English translation; idiomatic expression; transfer of ideas between Arabic and English |
| Grammar | Demonstrative, relative, conditional and interrogative pronouns; gender; characteristics of nouns; dual; plurals; construct phrase; separable and inseparable pronouns; appendants; prepositions; transitive and intransitive verbs; perfect, imperfect and imperative verbs; modifiers; trilateral and derived verbs; verbal noun; derivatives; conditional sentences; numerals; active and passive voice; subject and predicate; nouns in the accusative |
| Composition | Written expression on candidates’ lives and environment, including education, culture, health, politics, economy, sports, and current affairs |
| Arabic literature | Introduction to Arabic literature; pre-Islamic period; Islamic periods; modern period; Arabic literature in West Africa |

### 3. Art

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Artpdf.85197ba4c495458e1ba8.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Foundations | Classification of Art; Elements and Principles of Art; Art Terms |
| History and traditions | Historical Dimensions of Art; Traditional African Art; Traditional Nigerian Art; Nigerian Crafts; Development in Contemporary Art |
| Studio practice | Artistic Skills, Techniques and Processes; Tools, Materials and Equipment |
| Appreciation and enterprise | Art Appreciation; Meaning and Functions of Art; Art Entrepreneurship |

### 4. Biology

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Biology.0075e70afd357d7a39ae.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Variety of organisms | Living Organisms; Evolution among Organisms; Structural, Functional and Behavioural Adaptations |
| Form and functions | Internal Structure of a Flowering Plant; Nutrition; Transport; Respiration; Excretion; Support and Movement; Reproduction; Growth; Co-ordination and Control |
| Ecology | Factors Affecting Distribution of Organisms; Symbiotic Interactions of Plants; Natural Habitats; Local (Nigerian) Biomes; Ecology of Populations; Soil; Humans and Environment |
| Heredity and variation | Heredity; Biotechnology |
| Evolution | Theories of Evolution; Evidence of Evolution |

### 5. Chemistry

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Chemistry.9efd0b98043d56922aaa.pdf)  
**Existing product state:** Existing JAMB subject and 48 approved original AI-authored questions remain unchanged.

| Published Chemistry topics |
|---|
| Separation of Mixtures and Purification of Chemical Substances; Chemical Combination; Kinetic Theory of Matter and Gas Laws; Atomic Structure and Bonding; Nuclear Chemistry; Solubility; Environmental Pollution; Acids, Bases and Salts; Oxidation and Reduction (Redox); Electrolysis; Energy Changes; Rates of Chemical Reaction; Chemical Equilibria; Non-metals and their Compounds; Metals and their Compounds; Organic Compounds; Chemistry and Industry; Astronomical Chemistry |

### 6. Christian Religious Studies

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/CRS.7f96f8e535ca408ca474.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Themes from the Old Testament | Sovereignty of God; Covenant; Leadership Qualities; Divine Providence, Guidance and Protection; Parental Responsibility; Obedience and Disobedience; A Man after God’s Own Heart; Decision-Making |
| Prophetic and reform themes | Greed and its Effects; Supremacy of God; Religious Reforms in Judah; Concern for Judah; Faith, Courage and Protection; God’s Message to Nineveh; Social Justice, True Religion and Divine Love; Holiness and Divine Call; Punishment and Hope |
| The Gospels and Acts | Birth and Early Life of Jesus; Baptism and Temptation of Jesus; Discipleship; Miracles; Parables; Sermon on the Mount; Mission of the Disciples; Great Confession; Transfiguration; Triumphal Entry and Passion; Last Supper; Trials and Death of Jesus; Resurrection and Appearances; Jesus’ Teachings; Love; Fellowship in the Early Church; Holy Spirit and the Mission; Opposition to the Gospel Message; Mission to the Gentiles |
| Pauline and general epistles | Justification by Faith; Law and Grace; New Life in Christ; Christians as Joint Heirs with Christ; Humility; Forgiveness; Spiritual Gifts; Christian Giving; Civic Responsibility; Dignity of Labour; Second Coming of Christ; Impartiality; Effective Prayer; Christian Living in the Community; Corruption; Sexual Immorality |

### 7. Commerce

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Commerce.819d9c6929bc849d1cd9.pdf)

| Published Commerce topics |
|---|
| Commerce; Occupation; Production; Trade; Purchase and Sale of Goods; Aids-to-Trade; Business Units; Financing Business; Trade Associations; Money; Stock Exchange; Elements of Business Management; Elements of Marketing; Legal Aspects of Business; Commodity Exchange; Business Environment and Social Responsibility |

### 8. Computer Studies

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Computer.ea1ead8cea82f53d3717.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Computing foundations | Evolution of Computing Systems; Basic Concepts of Computer and its Operations; Problem-solving Skills, Data Processing and Practical Skills in Computing; System Software and Application Software; Basic Computer Hardware Operations; Online Resources and Online Skills; Ethics and Human Issues in Computing; Career Prospects in Computing |
| History and systems | History of Computing; Classification of Computing Devices; Overview of Computing Systems; Data and Information |
| Productivity and files | Word Processing Package; Spreadsheet Package; Database Package; Graphics Package; Presentation Package; Web Design Package; Concept of Computer Files; Handling Computer Files |
| Operations and ICT | Booting and Shutting Down; Computer Maintenance; Computer Room Management; Communication Systems; Application Areas of ICT; Internet; Electronic Mail; Networking; World Wide Web; Cables and Connectors |
| Programming | Programming Languages; High-Level Languages; Algorithms and Flowcharts; Programming-Language Structure; Program Development; System Development Life Cycle |
| AI and responsible computing | Definition of AI; Branches of AI; Applications of AI; Fundamentals of Robotics; Ethical Issues; Computer Security; Cyber Risks and Protection; Potentials for Higher Studies in Computing |

### 9. Economics

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Economics.da2a30ae8659e29c8bb4.pdf)

| Published Economics topics |
|---|
| Economics as a Science; Economic Systems; Methods and Tools of Economic Analysis; Theory of Demand; Theory of Consumer Behaviour; Theory of Supply; Theory of Price Determination; Theory of Production; Theory of Costs and Revenue; Market Structures; National Income; Money and Inflation; Financial Institutions; Public Finance; Economic Growth and Development; Agriculture in Nigeria; Industry and Industrialisation; Natural Resources and the Nigerian Economy; Business Organisations; Population; International Trade; International Economic Organisations; Factors of Production and their Theories |

### 10. French

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/French.170eeaabf96471e303c5.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Written comprehension | Written Comprehension in French, using texts of general and emergent interest |
| Structure and use of written French | Form classes; vocabulary; word order; conjugation; negation; agreement; pluralisation; derivation; proverbs, idioms, conventional structures, figures of speech, and speech acts |
| Oral French | Sound discrimination; letter-sound correspondence; syllabification; liaison; sense groups; sound similarity |
| Culture and civilisation | Educational system; socio-economic life; political organisation; cultural life of Francophone Africa and France, with reference to Nigeria where appropriate |

### 11. Geography

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Geography.0bf33e33f48e4139be13.pdf)  
**Extraction note:** This PDF required direct source inspection because standard heading extraction initially returned no candidates. The following structure is recovered directly from the official document.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Practical Geography | Maps; Scale and Measurement of Distances, Areas, Reduction, Enlargement, Directions, Bearings and Gradients; Map Reading and Interpretation; Interpretation of Statistical Data, Maps and Diagrams; Elementary Surveying; Geographic Information System (GIS) |
| Physical Geography | Earth as a Planet; Earth Crust; Volcanism and Earthquakes; Denudation Processes in the Tropics; Water Bodies; Weather and Climate; Vegetation; Soils; Environmental Resources; Environmental Interaction; Environmental Hazards; Environmental Conservation |
| Human Geography | Population; Settlement; Selected Economic Activities (economic activities, agriculture, manufacturing, transport and communication, world trade, tourism) |
| Regional Geography | Broad Outline of Nigeria; Economic and Human Geography of Nigeria; ECOWAS |

### 12. Government

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Government.92e42612590a98eeba28.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Elements of Government | Definition and Scope of Government; Basic Concepts; Forms of Government; Arms of Government; Structures of Governance; Systems of Governance; Political Ideologies; Constitution; Principles of Democratic Government; Processes of Legislation; Citizenship; Electoral Process; Political Parties and Party Systems; Pressure Groups; Public Opinion; Civil Service/Public Service |
| Political development in Nigeria | Pre-colonial Polities; Imperialist Penetration; Process of Decolonisation; Constitutional Development in Nigeria; Post-Independence Constitutions; Institutions of Government in the Post-Independence Period; Public Commissions; Political Parties and Party Politics in Nigeria; Structure and Workings of Nigerian Federalism; Public Corporations and Parastatals; Local Government; Military in Nigerian Politics |
| Nigeria and international relations | Foreign Policy; Nigeria’s Foreign Policy; Nigeria’s Relations with African Countries; Nigeria in International Organisations |
| International organisations | International Organisations |

### 13. Hausa

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Hausa.ca90bfcfca9f88527acf.pdf)

| Published Hausa topics |
|---|
| Harshe (Language); Al’adu (Culture); Adabi (Literature: oral and written literature) |

### 14. History

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/History.64d0bbe89bb7585bcddc.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Nigeria to 1800 | Land and Peoples of the Nigeria Area; Early Centres of Civilisation; Origins and Formation of States; Economic Activities and Growth of States; External Influences |
| Nigeria, 1800–1900 | Sokoto Caliphate; Kanem-Borno; Yorubaland; Benin; Nupe; Igbo; Efik; European Penetration and Impact; British Conquest of the Nigeria Area |
| Nigeria, 1900 to the present | Establishment of Colonial Rule to 1914; Amalgamation of 1914; Colonial Administration after Amalgamation; Social Development under Colonial Rule; Constitutional Development and Nationalism; Politics of the First Republic and Military Intervention; Nigerian Civil War; Gowon Regime; Murtala/Obasanjo Regime; Second Republic; Buhari Regime; Babangida Regime; Interim National Government; Abacha Regime; Transition to the Fourth Republic; Nigeria in International Organisations |
| West Africa and Africa | Islamic Reform Movements and State Building in West Africa; Sierra Leone, Liberia and Christian Missionary Activities; Ethiopia in the 19th Century; Mfecane; Great Trek; New Imperialism and European Occupation of Africa; Patterns of Colonial Rule in Africa; Politics of Decolonisation; Apartheid in South Africa; Problems of Nation-building in Africa |

### 15. Home Economics

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Home-Economics.89dc0fce33c5910e66c6.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Foundations | Home Economics; Areas/Careers in Home Economics; Interrelationship of Home Economics with Other Subjects |
| Home management | Principles of Home Management; Resources; Family Living; Marriage and Reproductive Health; Pregnancy and Childbirth; Housing the Family; Home Surfaces; Sanitation in the Home; Consumer Education |
| Food and nutrition | Foods and Nutrition; Meal Planning; Cookers and Cooking; Flours and Uses; Basic Mixtures; Scientific Methods in Foods and Nutrition; Kitchen; Kitchen Safety and Hygiene; Food Storage and Preservation; Home Gardening |
| Clothing and textiles | Fibres and Fabrics; Sewing Equipment and Garment Construction; Laundry and Care of Clothes |

### 16. Igbo

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Igbo.7a09449bbeefc39b4f44.pdf)  
**Review note:** The source uses Igbo orthography and diacritics. Import labels should preserve the source spelling after a separate character-encoding check; the English descriptors below are for review clarity only.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Language | Essay (Edemede); Comprehension (Aghọtaazaa); Sounds and Sound Patterns; Spelling and Spelling Rules; Igbo Orthography; Dialect and Standard Igbo; Igbo Word Derivation; Grammar (Ụtọasụsụ); Translation (Ntụgharị) |
| Literature | Literary Devices (Atụmatụokwu); Oral Literature (Agụmagụ Ọnụ); Written Literature (Agụmagụ Edere) |
| Culture | Greetings and hospitality; chieftaincy and governance; inheritance and funerals; traditional beliefs and worship; marriage and naming; masquerade and social institutions; traditional games; occupations and food; festivals; acceptable behaviour and values |
| Contemporary issues | Topical Issues in Igbo; authors, publishers, dates and places; Igbo Studies Association; health, drug abuse, cultism, rights, religious conflict, and kidnapping issues as named in the source |

### 17. Islamic Studies

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Islamic.973a07ea012af6554ed3.pdf)

| Published Islamic Studies topics |
|---|
| Revelation of the Glorious Qur’ān; Tafsīr; Introduction to Tajwīd; Study of the Arabic Text of Selected Qur’ānic Passages; Study of the Arabic Text of Selected Hadīth; Moral Lessons in the Glorious Qur’ān and Hadīth; Tawhīd and Fiqh; Articles of Faith; Ibadāt and Their Types; Family Matters; Sources and Schools of Law; Islamic Economic System; Islamic Political System; Pre-Islamic Arabia (Jāhiliyyah); Life of Prophet Muhammad (SAW); Rightly Guided Caliphs (al-Khulafā’u al-Rāshidūn); Early Contact of Islam with Africa; Impact of Islam in West Africa; Contributions of Islam to Education |

### 18. Literature in English

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Literature.f24a00818658eb8ecbd0.pdf)

| Published Literature in English topics |
|---|
| Drama; Prose; Poetry; General Literary Terms; Literary Appreciation |

### 19. Mathematics

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Mathematics.c0621f4b8b674e75fd05.pdf)  
**Existing product state:** Existing JAMB subject and question-linked topic records remain unchanged pending approved mapping.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Number and numeration | Number Bases/Modular Arithmetic; Fractions, Decimals, Approximations and Percentages; Indices, Logarithms and Surds; Sets |
| Algebra | Polynomials; Variation; Inequalities; Progression; Binary Operations; Matrices and Determinants |
| Geometry and trigonometry | Euclidean Geometry; Mensuration; Loci; Coordinate Geometry; Trigonometry |
| Calculus | Differentiation; Application of Differentiation; Integration |
| Statistics | Representation of Data; Measures of Location; Measures of Dispersion; Permutation and Combination; Probability |

### 20. Music

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Music.6a7142057d840d45959d.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Rudiments of Music | Staff; Music Notes/Rests and Values; Time-signature; Key-signatures and Scales; Keyboard Setting and Enharmonic Equivalents; Accidentals; Intervals; Musical Terms, Signs and Abbreviations; Transcription and Transposition |
| Elementary Harmony | Triads and Inversions; Basic Chord Progressions; Kinds of Motion; Cadences; Non-harmonic/Non-chord Tones; Modulation; Elementary Composition |
| History and literature of African Music | Nigerian Folksongs; Nigerian Traditional Music and Other Arts; Nigerian Traditional Musical Instruments; African Traditional Musicians; Evolution and Development of African Popular Music; African Popular Musicians; African Art Musicians |
| History and literature of Western Music | Historical Development of Western Music Styles; Composers; Music Forms and Media; Instruments, Voice, Keyboard Instruments, and Computer Music Technology; Introduction to AI in Music Technology |
| Comparative Music Studies | Black Musicians in the Diaspora; Diaspora Music Forms; Spirit of Nationalism in Nigerian Music |

### 21. Physics

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Physics.16527a294cb7e7a87a35.pdf)  
**Existing product state:** Existing JAMB subject and 48 approved original AI-authored questions remain unchanged.

| Published Physics topics |
|---|
| Measurements and Units; Scalars and Vectors; Motion; Gravitational Field; Equilibrium of Forces; Work, Energy and Power; Friction; Simple Machines; Elasticity; Pressure; Liquids at Rest; Temperature and its Measurement; Quantity of Heat; Change of State; Thermal Expansion; Gas Laws; Vapours; Structure of Matter and Kinetic Theory; Heat Transfer; Waves; Propagation of Sound Waves; Characteristics of Sound Waves; Light Energy; Reflection of Light at Plane and Curved Surfaces; Refraction of Light through Plane and Curved Surfaces; Optical Instruments; Dispersion and Colour of Light; Electrostatics; Capacitors; Electric Cells; Current Electricity; Electrical Energy and Power; Magnets and Magnetic Fields; Force on a Current-Carrying Conductor in a Magnetic Field; Electromagnetic Induction; Simple A.C. Circuits; Conduction of Electricity through Liquids and Gases; Elementary Modern Physics; Introductory Electronics; Introduction to Fibre Optics and Lasers |

### 22. Physical and Health Education

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/PHE.d3add6c626efcb3f0f2b.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Foundations | Principles, Meaning, Scope and Philosophy of Physical Education; Philosophy, Objectives and Settings of Health Education |
| Human body | Cells, Tissues and Systems of the Human Body; Skeletal System; Muscular System; Nervous System and Sense Organs; Circulatory System; Respiratory System; Excretory System; Somatotypes and Posture |
| Activity and performance | Athletics; Ball Games; Racket Games; Physical Fitness; Conditioning Programme; Recreation and Leisure; Dance |
| Food, safety, sport, and inclusion | Food; Nutrition; Drugs; First Aid; Safety Education; Sports Competitions; Institutional Games; International Sports Competitions; Disability and Special Needs; Adapted Physical Activities; Social and Emotional Problems of People with Disabilities; Prevention of Disability; Corrective Exercises |
| Health and family life | Personal Health; Community Health; Environmental Health; Disease; Communicable Diseases; Family; Human Sexuality Education; Family Planning |

### 23. Principles of Accounts

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Principles-of-Accounting.64fc902ad37449d1f6ff.pdf)

| Published Principles of Accounts topics |
|---|
| Nature and Significance of Bookkeeping; Principles of Double Entry; Ethics, Professional and Regulatory Bodies; Cash Book; Bank Transactions and Reconciliation; Final Accounts of a Sole Proprietor; Stock Valuation; Control Accounts; Incomplete Records and Single Entry; Manufacturing Accounts; Accounts of Not-for-Profit-Making Organisations; Departmental Accounts; Branch Accounts; Joint Venture Accounts; Partnership Accounts; Introduction to Company Accounts; Public Sector Accounting; Information Technology in Accounting |

### 24. Use of English

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Use-of-English.885e843b1f51e6a3d062.pdf)  
**Naming decision required:** ExamPilot’s existing JAMB subject row is named **English**. The official source name is **Use of English**. The recommended implementation preserves the existing row ID and data while changing student-facing wording only if explicitly approved.

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Comprehension and Summary | Description; Narration; Exposition; Argumentation/Persuasion; comprehension passages; cloze passage; approved reading text; synthesis of ideas/summary |
| Lexis and Structure | Synonyms; Antonyms; Clause and Sentence Patterns; Word Classes and Their Functions; Mood, Tense, Aspect, Number, Agreement/Concord, Degree and Question Tags; Mechanics; Ordinary, Figurative and Idiomatic Usage; sentence interpretation; basic grammar |
| Oral Forms | Vowels (monophthongs, diphthongs and triphthongs); Consonants including clusters; Rhymes including homophones; Word Stress; Emphatic Stress in Connected Speech |

### 25. Yoruba

**Official source:** [IBASS PDF](https://ibass.jamb.gov.ng/static/media/Yoruba.c9f0848e61ff86f1349b.pdf)

| Coverage area | Official topic labels reconciled from the PDF |
|---|---|
| Language | Comprehension (prose and verse); Essay Writing; Sound System; Grammar; Current Orthography; Translation |
| Literature | Oral Literature: Prose and Drama; Written Literature: Prose, Poetry and Drama |
| Culture | Èrò àti Ìgbàgbọ́ (beliefs); Ètò Ìṣèlú àti Ààbò Ìlú (governance and security); Ètò Ìsìnkú àti Ogún Pínpín (burial and inheritance); Òǹkà Yorùbá (numeration); Ètò Ìgbéyàwó àti Ìsọmọlórúkọ (marriage and naming); Ètò Ìwòsàn (healthcare); Eré Ìdárayá (games); Iṣẹ́ Abínibí àti Oúnjẹ Ilẹ̀ Yorùbá (traditional occupations and food); Ẹ̀ kọ́ Ilé (values and behaviour) |

## Proposed Import Design — Review Only

The current database already has a suitable non-hierarchical structure: `exams → subjects → topics`. Each `topics` row belongs to one subject, and questions reference exactly one topic. This is sufficient for an initial syllabus catalogue import; **no schema migration is required** merely to add JAMB subjects and syllabus topic rows.

| Concern | Proposed safe treatment | Reason |
|---|---|---|
| New subjects | Create the 20 missing JAMB `subjects` rows after approval | Represents the official JAMB catalogue without pretending question banks exist |
| Existing five subjects | Preserve current IDs, question links, and topic rows | Avoids breaking existing attempts, Practice, Mock, Tutor, or course-direction references |
| Existing topic labels | Add only approved official labels that are absent; do not delete or rename question-linked topic rows during the first import | Existing questions use some narrower labels, such as `Algebraic Expressions`, which should remain valid |
| Official section groupings | Keep section names in import metadata/documentation and use readable topic labels in `topics.name` | The current table has no parent-topic column; migration is unnecessary for a safe flat catalogue |
| English naming | Preserve `subjects.id = 2`; decide whether student-facing copy changes from `English` to `Use of English` | Maintains referential integrity while allowing official nomenclature |
| Question availability | Add a distinct “Syllabus mapped — questions coming” state for subjects without approved questions | Prevents a syllabus-only row from being presented as live practice content |
| Question content | Do not generate, import, or imply past questions | The user’s approval here covers topic structure only, not content generation |

### Required Implementation Sequence After Approval

1. Take a new project checkpoint and export a read-only subject/topic baseline.
2. Insert the 20 missing JAMB subjects, using the official catalogue names approved in this package.
3. Reconcile the five existing subjects against their official lists without altering their IDs or question-linked topics.
4. Insert only missing, approved syllabus topic labels transactionally; produce a per-subject count and duplicate report.
5. Update selectors to distinguish **practice available** from **syllabus mapped**. The latter must not launch an empty practice session.
6. Update Course Direction subject matching only where its existing dataset uses a newly added subject name; verify no combinations silently change.
7. Add focused tests for catalogue count, duplicate resistance, existing-ID preservation, and no-question empty states.
8. Verify in the browser that all 25 subjects are discoverable and that the five current question banks retain their existing availability.

## Approval Checklist

Please confirm all of the following before implementation:

- [ ] The 25-subject official IBASS inventory is accepted as the JAMB catalogue to add.
- [ ] The topic structures above are accepted for the first syllabus-catalogue import.
- [ ] Existing Mathematics, English, Biology, Chemistry, and Physics IDs and question-linked topics must be preserved.
- [ ] New subjects without approved questions must be shown as **Syllabus mapped — questions coming**, not live practice.
- [ ] Decide the English label: retain **English** in the product, or show the official label **Use of English** while preserving the existing database ID.
- [ ] Authorise database and student-facing selector updates only after the above points are accepted.

Until this approval is received, this document remains a **review-only package** and ExamPilot NG’s database remains unchanged.
