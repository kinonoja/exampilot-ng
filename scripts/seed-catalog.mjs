import { ensurePracticeCatalogue, getQuestionCatalogueCount } from "../server/catalog.ts";

await ensurePracticeCatalogue();
const count = await getQuestionCatalogueCount();
console.log(`Seeded question catalogue with ${count} questions.`);
