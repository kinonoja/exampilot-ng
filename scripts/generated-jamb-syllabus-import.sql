-- Approved 22 August 2026 JAMB IBASS syllabus catalogue import.

-- Syllabus structure only: no question, attempt, mock, Tutor, or payment rows are changed.

START TRANSACTION;

UPDATE subjects SET name = 'Use of English' WHERE examId = 1 AND name = 'English';

INSERT INTO subjects (examId, name) VALUES

(1, 'Agriculture Science'),
(1, 'Arabic'),
(1, 'Art'),
(1, 'Biology'),
(1, 'Chemistry'),
(1, 'Christian Religious Studies'),
(1, 'Commerce'),
(1, 'Computer Studies'),
(1, 'Economics'),
(1, 'French'),
(1, 'Geography'),
(1, 'Government'),
(1, 'Hausa'),
(1, 'History'),
(1, 'Home Economics'),
(1, 'Igbo'),
(1, 'Islamic Studies'),
(1, 'Literature in English'),
(1, 'Mathematics'),
(1, 'Music'),
(1, 'Physics'),
(1, 'Physical and Health Education'),
(1, 'Principles of Accounts'),
(1, 'Use of English'),
(1, 'Yoruba')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Meaning and Scope of Agriculture'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Importance of Agriculture'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Agricultural Ecology'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Agricultural Genetics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Farm Inputs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'History of Agricultural Development in West Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Roles of Government and NGOs in Agricultural Development'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Rocks and Soil Formation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Soil Water and Soil Conservation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Soil Fertility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Land Preparation and Soil Tillage'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Plant Forms and Functions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Growth, Development and Reproduction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Plant Propagation Methods'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cropping Systems, Planting Patterns and Plant Density'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Crop Husbandry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pasture and Forage Crops'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Floriculture'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Weeds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Crop Diseases'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Crop Pests'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Forest Management (Silviculture)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Forms and Classification of Major Farm Animals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'General Terminologies in Animal Production'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Anatomy and Physiology of Farm Animals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Reproduction in Farm Animals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Animal Nutrition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Livestock Management'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Animal Health'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Fisheries and Wildlife'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Bee-keeping (Apiculture)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Factors of Agricultural Production'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Economic Principles'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Farm Surveying and Farmstead Planning'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Simple Farm Tools'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Farm Machinery and Implements'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mechanisation and Sources of Farm Power'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Processing and Storage'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to Biotechnology'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Application of ICT in Agriculture'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to Agricultural Research'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Agriculture Science'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Comprehension'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Translation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Demonstrative, Relative, Conditional and Interrogative Pronouns'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Gender'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Characteristics of Nouns'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Dual'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Plurals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Construct Phrase'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Separable and Inseparable Pronouns'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Appendant Forms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Prepositions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Transitive and Intransitive Verbs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Perfect Verb'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Imperfect Verb'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Imperative Verb'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Modifiers'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Trilateral and Derived Verbs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Verbal Noun'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Derivatives'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Conditional Sentences'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Numerals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Active and Passive Voice'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Subject and Predicate'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nouns in the Accusative'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Composition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Arabic Literature'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Arabic'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Classification of Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elements and Principles of Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Art Terms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Historical Dimensions of Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Traditional African Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Traditional Nigerian Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigerian Crafts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Development in Contemporary Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Artistic Skills, Techniques and Processes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Tools, Materials and Equipment'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Art Appreciation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Meaning and Functions of Art'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Art Entrepreneurship'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Art'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Living Organisms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Evolution among Organisms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Structural, Functional and Behavioural Adaptations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Internal Structure of a Flowering Plant'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nutrition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Transport'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Respiration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Excretion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Support and Movement'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Reproduction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Growth'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Co-ordination and Control'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Factors Affecting Distribution of Organisms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Symbiotic Interactions of Plants'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Natural Habitats'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Local (Nigerian) Biomes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ecology of Populations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Soil'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Humans and Environment'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Heredity'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Biotechnology'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theories of Evolution'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Evidence of Evolution'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Biology'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Separation of Mixtures and Purification of Chemical Substances'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Chemical Combination'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Kinetic Theory of Matter and Gas Laws'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Atomic Structure and Bonding'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nuclear Chemistry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Solubility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Pollution'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Acids, Bases and Salts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Oxidation and Reduction (Redox)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electrolysis'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Energy Changes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Rates of Chemical Reaction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Chemical Equilibria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Non-metals and their Compounds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Metals and their Compounds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Organic Compounds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Chemistry and Industry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Astronomical Chemistry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Chemistry'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sovereignty of God'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Covenant'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Leadership Qualities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Divine Providence, Guidance and Protection'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Parental Responsibility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Obedience and Disobedience'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'A Man after God''s Own Heart'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Decision-Making'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Greed and its Effects'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Supremacy of God'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Religious Reforms in Judah'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Concern for Judah'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Faith, Courage and Protection'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'God''s Message to Nineveh'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Social Justice, True Religion and Divine Love'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Holiness and Divine Call'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Punishment and Hope'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Birth and Early Life of Jesus'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Baptism and Temptation of Jesus'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Discipleship'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Miracles'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Parables'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sermon on the Mount'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mission of the Disciples'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Great Confession'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Transfiguration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Triumphal Entry and Passion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Last Supper'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Trials and Death of Jesus'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Resurrection and Appearances'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Jesus'' Teachings'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Love'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Fellowship in the Early Church'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Holy Spirit and the Mission'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Opposition to the Gospel Message'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mission to the Gentiles'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Justification by Faith'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Law and Grace'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'New Life in Christ'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Christians as Joint Heirs with Christ'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Humility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Forgiveness'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Spiritual Gifts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Christian Giving'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Civic Responsibility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Dignity of Labour'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Second Coming of Christ'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Impartiality'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Effective Prayer'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Christian Living in the Community'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Corruption'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sexual Immorality'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Christian Religious Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Commerce'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Occupation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Production'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Trade'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Purchase and Sale of Goods'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Aids-to-Trade'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Business Units'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Financing Business'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Trade Associations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Money'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Stock Exchange'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elements of Business Management'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elements of Marketing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Legal Aspects of Business'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Commodity Exchange'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Business Environment and Social Responsibility'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Commerce'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Evolution of Computing Systems'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Concepts of Computer and its Operations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Problem-solving Skills, Data Processing and Practical Skills in Computing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'System Software and Application Software'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Computer Hardware Operations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Online Resources and Online Skills'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ethics and Human Issues in Computing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Career Prospects in Computing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'History of Computing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Classification of Computing Devices'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Overview of Computing Systems'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Data and Information'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Word Processing Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Spreadsheet Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Database Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Graphics Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Presentation Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Web Design Package'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Concept of Computer Files'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Handling Computer Files'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Booting and Shutting Down'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Computer Maintenance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Computer Room Management'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Communication Systems'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Application Areas of ICT'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Internet'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electronic Mail'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Networking'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'World Wide Web'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cables and Connectors'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Programming Languages'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'High-Level Languages'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Algorithms and Flowcharts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Programming-Language Structure'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Program Development'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'System Development Life Cycle'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Definition of AI'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Branches of AI'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Applications of AI'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Fundamentals of Robotics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Computer Security'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cyber Risks and Protection'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Potentials for Higher Studies in Computing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Computer Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Economics as a Science'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Economic Systems'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Methods and Tools of Economic Analysis'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Demand'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Consumer Behaviour'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Supply'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Price Determination'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Production'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Theory of Costs and Revenue'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Market Structures'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'National Income'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Money and Inflation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Financial Institutions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Public Finance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Economic Growth and Development'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Agriculture in Nigeria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Industry and Industrialisation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Natural Resources and the Nigerian Economy'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Business Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Population'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'International Trade'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'International Economic Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Factors of Production and their Theories'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Written Comprehension in French'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'French'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Structure and Use of Written French'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'French'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Workings of French Sounds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'French'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Culture and Civilisation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'French'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Maps'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Scale and Measurement of Distances, Areas, Reduction, Enlargement, Directions, Bearings and Gradients'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Map Reading and Interpretation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Interpretation of Statistical Data, Maps and Diagrams'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elementary Surveying'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Geographic Information System (GIS)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Earth as a Planet'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Earth Crust'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Volcanism and Earthquakes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Denudation Processes in the Tropics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Water Bodies'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Weather and Climate'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Vegetation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Soils'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Resources'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Interaction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Hazards'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Conservation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Population'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Settlement'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Selected Economic Activities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Broad Outline of Nigeria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Economic and Human Geography of Nigeria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'ECOWAS'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Geography'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Definition and Scope of Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Concepts of Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Forms of Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Arms of Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Structures of Governance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Systems of Governance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Political Ideologies'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Constitution'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Principles of Democratic Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Processes of Legislation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Citizenship'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electoral Process'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Political Parties and Party Systems'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pressure Groups'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Public Opinion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Civil Service/Public Service'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pre-colonial Polities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Imperialist Penetration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Process of Decolonisation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Constitutional Development in Nigeria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Post-Independence Constitutions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Institutions of Government in the Post-Independence Period'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Public Commissions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Political Parties and Party Politics in Nigeria'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Structure and Workings of Nigerian Federalism'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Public Corporations and Parastatals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Local Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Military in Nigerian Politics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Foreign Policy'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigeria''s Foreign Policy'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigeria''s Relations with African Countries'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigeria in International Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'International Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Government'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Harshe (Language)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Hausa'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Al''adu (Culture)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Hausa'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Adabi (Literature: Oral and Written Literature)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Hausa'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Land and Peoples of the Nigeria Area'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Early Centres of Civilisation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Origins and Formation of States'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Economic Activities and Growth of States'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'External Influences'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sokoto Caliphate'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Kanem-Borno'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Yorubaland'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Benin'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nupe'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Igbo'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Efik'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'European Penetration and Impact'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'British Conquest of the Nigeria Area'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Establishment of Colonial Rule to 1914'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Amalgamation of 1914'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Colonial Administration after Amalgamation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Social Development under Colonial Rule'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Constitutional Development and Nationalism'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Politics of the First Republic and Military Intervention'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigerian Civil War'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Gowon Regime'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Murtala/Obasanjo Regime'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Second Republic'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Buhari Regime'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Babangida Regime'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Interim National Government'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Abacha Regime'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Transition to the Fourth Republic'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigeria in International Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Islamic Reform Movements and State Building in West Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sierra Leone, Liberia and Christian Missionary Activities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ethiopia in the 19th Century'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mfecane'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Great Trek'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'New Imperialism and European Occupation of Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Patterns of Colonial Rule in Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Politics of Decolonisation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Apartheid in South Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Problems of Nation-building in Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'History'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Home Economics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Areas/Careers in Home Economics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Interrelationship of Home Economics with Other Subjects'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Principles of Home Management'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Resources'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Family Living'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Marriage and Reproductive Health'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pregnancy and Childbirth'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Housing the Family'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Home Surfaces'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sanitation in the Home'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Consumer Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Foods and Nutrition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Meal Planning'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cookers and Cooking'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Flours and Uses'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Mixtures'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Scientific Methods in Foods and Nutrition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Kitchen'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Kitchen Safety and Hygiene'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Food Storage and Preservation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Home Gardening'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Fibres and Fabrics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sewing Equipment and Garment Construction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Laundry and Care of Clothes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Home Economics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Essay (Edemede)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Comprehension (Aghọtaazaa)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sounds and Sound Patterns'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Spelling and Spelling Rules'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Igbo Orthography'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Dialect and Standard Igbo'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Igbo Word Derivation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Grammar (Ụtọasụsụ)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Translation (Ntụgharị)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Literary Devices (Atụmatụokwu)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Oral Literature (Agụmagụ Ọnụ)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Written Literature (Agụmagụ Edere)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Greetings and Hospitality'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Chieftaincy and Governance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Inheritance and Funerals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Traditional Beliefs and Worship'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Marriage and Naming'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Masquerade and Social Institutions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Traditional Games'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Occupations and Food'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Festivals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Acceptable Behaviour and Values'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Contemporary Issues in Igbo'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Igbo'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Revelation of the Glorious Qur''ān'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Tafsīr'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to Tajwīd'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Study of the Arabic Text of Selected Qur''ānic Passages'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Study of the Arabic Text of Selected Hadīth'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Moral Lessons in the Glorious Qur''ān and Hadīth'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Tawhīd and Fiqh'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Articles of Faith'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ibadāt and Their Types'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Family Matters'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sources and Schools of Law'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Islamic Economic System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Islamic Political System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pre-Islamic Arabia (Jāhiliyyah)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Life of Prophet Muhammad (SAW)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Rightly Guided Caliphs (al-Khulafā''u al-Rāshidūn)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Early Contact of Islam with Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Impact of Islam in West Africa'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Contributions of Islam to Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Islamic Studies'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Drama'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Literature in English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Prose'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Literature in English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Poetry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Literature in English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'General Literary Terms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Literature in English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Literary Appreciation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Literature in English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Number Bases/Modular Arithmetic'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Fractions, Decimals, Approximations and Percentages'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Indices, Logarithms and Surds'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sets'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Polynomials'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Variation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Inequalities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Progression'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Binary Operations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Matrices and Determinants'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Euclidean Geometry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mensuration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Loci'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Coordinate Geometry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Trigonometry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Differentiation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Application of Differentiation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Integration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Representation of Data'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Measures of Location'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Measures of Dispersion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Permutation and Combination'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Probability'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Mathematics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Staff'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Music Notes/Rests and Values'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Time-signature'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Key-signatures and Scales'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Keyboard Setting and Enharmonic Equivalents'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Accidentals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Intervals'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Musical Terms, Signs and Abbreviations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Transcription and Transposition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Triads and Inversions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Chord Progressions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Kinds of Motion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cadences'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Non-harmonic/Non-chord Tones'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Modulation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elementary Composition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigerian Folksongs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigerian Traditional Music and Other Arts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nigerian Traditional Musical Instruments'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'African Traditional Musicians'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Evolution and Development of African Popular Music'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'African Popular Musicians'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'African Art Musicians'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Historical Development of Western Music Styles'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Composers'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Music Forms and Media'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to AI in Music Technology'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Black Musicians in the Diaspora'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Diaspora Music Forms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Spirit of Nationalism in Nigerian Music'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Music'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Measurements and Units'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Scalars and Vectors'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Motion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Gravitational Field'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Equilibrium of Forces'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Work, Energy and Power'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Friction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Simple Machines'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elasticity'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Pressure'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Liquids at Rest'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Temperature and its Measurement'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Quantity of Heat'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Change of State'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Thermal Expansion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Gas Laws'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Vapours'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Structure of Matter and Kinetic Theory'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Heat Transfer'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Waves'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Propagation of Sound Waves'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Characteristics of Sound Waves'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Light Energy'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Reflection of Light at Plane and Curved Surfaces'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Refraction of Light through Plane and Curved Surfaces'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Optical Instruments'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Dispersion and Colour of Light'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electrostatics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Capacitors'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electric Cells'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Current Electricity'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electrical Energy and Power'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Magnets and Magnetic Fields'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Force on a Current-Carrying Conductor in a Magnetic Field'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Electromagnetic Induction'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Simple A.C. Circuits'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Conduction of Electricity through Liquids and Gases'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Elementary Modern Physics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introductory Electronics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to Fibre Optics and Lasers'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physics'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Principles, Meaning, Scope and Philosophy of Physical Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Philosophy, Objectives and Settings of Health Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cells, Tissues and Systems of the Human Body'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Skeletal System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Muscular System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nervous System and Sense Organs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Circulatory System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Respiratory System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Excretory System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Somatotypes and Posture'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Athletics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ball Games'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Racket Games'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Food'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nutrition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Drugs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Physical Fitness'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Conditioning Programme'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Recreation and Leisure'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Dance'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'First Aid'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Safety Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sports Competitions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Institutional Games'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'International Sports Competitions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Disability and Special Needs'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Adapted Physical Activities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Social and Emotional Problems of People with Disabilities'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Prevention of Disability'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Corrective Exercises'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Personal Health'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Community Health'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Environmental Health'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Disease'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Communicable Diseases'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Family'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Human Sexuality Education'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Family Planning'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Physical and Health Education'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Nature and Significance of Bookkeeping'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Principles of Double Entry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ethics, Professional and Regulatory Bodies'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cash Book'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Bank Transactions and Reconciliation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Final Accounts of a Sole Proprietor'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Stock Valuation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Control Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Incomplete Records and Single Entry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Manufacturing Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Accounts of Not-for-Profit-Making Organisations'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Departmental Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Branch Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Joint Venture Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Partnership Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Introduction to Company Accounts'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Public Sector Accounting'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Information Technology in Accounting'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Principles of Accounts'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Description'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Narration'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Exposition'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Argumentation/Persuasion'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Comprehension Passages'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Cloze Passage'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Approved Reading Text'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Synthesis of Ideas/Summary'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Synonyms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Antonyms'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Clause and Sentence Patterns'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Word Classes and Their Functions'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mood, Tense, Aspect, Number, Agreement/Concord, Degree and Question Tags'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Mechanics'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ordinary, Figurative and Idiomatic Usage'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sentence Interpretation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Basic Grammar'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Vowels'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Consonants'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Rhymes'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Word Stress'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Emphatic Stress in Connected Speech'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Use of English'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Comprehension (Prose and Verse)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Essay Writing'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Sound System'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Grammar'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Current Orthography'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Translation'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Oral Literature: Prose'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Oral Literature: Drama'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Written Literature: Prose'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Written Literature: Poetry'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Written Literature: Drama'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Èrò àti Ìgbàgbọ́ (Beliefs)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ètò Ìṣèlú àti Ààbò Ìlú (Governance and Security)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ètò Ìsìnkú àti Ogún Pínpín (Burial and Inheritance)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Òǹkà Yorùbá (Numeration)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ètò Ìgbéyàwó àti Ìsọmọlórúkọ (Marriage and Naming)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ètò Ìwòsàn (Healthcare)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Eré Ìdárayá (Games)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Iṣẹ́ Abínibí àti Oúnjẹ Ilẹ̀ Yorùbá (Traditional Occupations and Food)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO topics (subjectId, name)
SELECT subjects.id, 'Ẹ̀ kọ́ Ilé (Values and Behaviour)'
FROM subjects
WHERE subjects.examId = 1
  AND subjects.name = 'Yoruba'
ON DUPLICATE KEY UPDATE name = VALUES(name);

COMMIT;

