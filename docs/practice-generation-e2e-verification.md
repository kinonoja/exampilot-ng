# Practice Generation End-to-End Verification

## Successful dashboard generation

On 19 August 2026, a signed-in Pro test account selected the **Adaptation** topic from the dashboard and ran the on-demand generation action. The service returned and persisted exactly three original questions. The student-facing success state displayed the following generated prompts:

1. Which of the following is an example of behavioral adaptation in animals?
2. The ability of a desert plant to store water in its stem tissues is primarily classified as which type of adaptation?
3. A predatory fish develops the ability to change its body color to match the ocean floor, allowing it to hunt prey more effectively. This adaptation would best be described as serving which primary function?

The dashboard rendered the expected green success card and the **Practise this topic** handoff. This verification followed a compatibility change from strict JSON Schema output to a JSON-object response with an explicit output contract and server-side validation.

## Practice handoff verification

The generated-set handoff opened `/practice?topicId=45`. After the catalogue loaded, the practice screen selected **JAMB**, **Biology**, and **Adaptation**, confirming that the generated topic now propagates through the practice filters rather than reverting to the unfiltered bank.

The filtered practice screen then served the generated hard-level Adaptation prompt about a predatory fish changing body colour to match the ocean floor. Its visible options included **“Camouflage to increase hunting success through concealment”**, confirming that the handoff reaches a usable generated question rather than merely setting the filters.
