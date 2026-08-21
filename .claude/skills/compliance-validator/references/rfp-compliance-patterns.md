# RFP Compliance Patterns

## Common Compliance Failure Modes

These are the ways proposals most frequently fail compliance checks. They are ordered by frequency, not severity — though many are both common and disqualifying.

### 1. Missing Required Sections

**Pattern:** The RFP specifies a section list, and the proposal does not include one or more required sections.

**Why it happens:** The drafter follows a different organizational structure (their own or a template's) and assumes the content is covered "somewhere." It is, but not under the heading the evaluator is looking for.

**How to catch it:** Maintain a 1:1 mapping between RFP-required sections and proposal sections. If the RFP says "Section 4: Risk Management Approach," there must be a section with that title. Moving the content into another section is not sufficient — evaluators often check sections by title, not by reading the entire document.

**Exception:** Some RFPs say "address the following topics within your technical narrative" rather than requiring discrete sections. In these cases, the content can be woven into other sections — but it must be findable.

### 2. Exceeding Page Limits

**Pattern:** A section or the total proposal exceeds the specified page limit.

**Why it happens:** The drafter writes to cover all requirements thoroughly, and the reviewer adds content during the empathy pass. No one tracks the running page count.

**How to catch it:** Estimate page count after every review pass. Convert word count to pages using the RFP's formatting requirements (font, margins, spacing). When close to the limit, flag it — do not wait until formatting.

**Critical nuance:** Read the page limit language carefully:
- "Not to exceed 20 pages" means 20 pages, period
- "Not to exceed 20 pages, excluding appendices" means appendices are free but the main body is capped
- "Not to exceed 20 pages, excluding cover page, table of contents, and appendices" means exactly what it says — but the executive summary usually counts unless excluded
- Some RFPs count pages; some count "sides" (one sheet = two sides)

### 3. Implicit Requirements Buried in Scoring Rubrics

**Pattern:** The RFP's evaluation criteria mention topics that are not explicitly required in the response instructions. The proposal does not address them because they were not in the requirements list.

**Why it happens:** The capture team reads the response instructions but not the evaluation criteria. The evaluator scores against the criteria. Mismatch.

**How to catch it:** Treat evaluation criteria as implicit requirements. If the scoring rubric awards points for "demonstrated understanding of the current-state environment," the proposal must demonstrate understanding — even if no section explicitly asks for it.

**Example:** An RFP requires a "Technical Approach" section but the scoring rubric includes "understanding of the operational environment" as a sub-factor. The proposal describes the technical approach but does not demonstrate understanding of the client's current operations. The evaluator deducts points.

### 4. Missing Appendix Requirements

**Pattern:** The RFP requires specific appendices (resumes, certifications, past performance forms, pricing tables) and the proposal either omits them or includes them in the wrong format.

**Why it happens:** Appendices are the last thing assembled. Under time pressure, they are abbreviated or forgotten. Alternatively, the proposal includes the information in the narrative but not as a standalone appendix as required.

**How to catch it:** List every required appendix from the RFP. Check that each exists as a separate artifact (or section, if the RFP specifies "as an appendix to Volume X"). Verify format — some RFPs require appendices to use specific forms or templates.

### 5. Failing to Acknowledge Amendments

**Pattern:** The RFP was amended during the solicitation period, and the proposal does not acknowledge or incorporate the amendments.

**Why it happens:** Amendments arrive after the capture team has already begun drafting. They are read but not systematically incorporated. Or the amendment changes requirements that the team is not tracking at the amendment level.

**How to catch it:** List all amendments. For each, verify that the proposal reflects the amended requirements, not the original. If the RFP requires explicit acknowledgment of amendments (common), verify that the acknowledgment is included.

### 6. Incorrect Pricing Format

**Pattern:** The pricing proposal does not follow the RFP's required format — wrong CLIN structure, missing line items, wrong labor categories, or wrong period of performance breakdown.

**Why it happens:** Pricing format requirements are often highly specific and different from the vendor's standard pricing structure. The pricing team uses their standard template instead of adapting to the RFP's required format.

**How to catch it:** Compare the pricing structure against the RFP's pricing instructions line by line. Every CLIN, every option year, every labor category must match. If the RFP provides a pricing template, use it exactly.

## How to Interpret Ambiguous Requirements

### "Shall" vs. "Should" vs. "May"

In government procurement language:
- **"Shall"** = mandatory. Failure to comply may result in elimination.
- **"Must"** = mandatory. Same as "shall."
- **"Should"** = strongly expected but not strictly mandatory. Failure to address will cost points but may not eliminate.
- **"May"** = optional. Addressing it well earns points; not addressing it typically does not cost points.
- **"Will"** = ambiguous. Sometimes used as mandatory (like "shall"), sometimes as future tense ("the government will evaluate..."). Read in context.

### "Addressed Within Narrative" Instructions

When an RFP says a topic should be "addressed within the narrative" or "incorporated into the technical approach," it means:
- The topic does not get its own section
- The evaluator will look for it within other sections
- It must be findable — buried in a paragraph on page 47 is not "addressed"
- Consider calling it out with a subheading or bold text to help the evaluator locate it

### Page Limit Interpretation

When in doubt about what counts toward page limits:
- Cover page: usually excluded (but check)
- Table of contents: usually excluded (but check)
- Executive summary: usually included (unless explicitly excluded)
- Appendices: check carefully — the language varies significantly between RFPs
- Section dividers: usually excluded
- Blank pages: usually excluded but may count in "sides" counting

If the RFP is genuinely ambiguous, adopt the more conservative interpretation. A proposal that is too short but compliant beats one that is too long and disqualified.

## Compliance Validation as a Risk Function

Not all compliance requirements carry equal risk:

**Disqualifying requirements:** Failure results in the proposal being removed from evaluation. These are typically: submission deadline, mandatory certifications, required forms, page limits (in strict evaluations).

**Scoring-affecting requirements:** Failure results in point deductions but the proposal remains in evaluation. These are typically: depth of response to evaluation criteria, quality of past performance examples, staffing qualification levels.

**Administrative requirements:** Failure results in requests for clarification or minor deductions. These are typically: formatting inconsistencies, minor cross-reference errors, spelling of client name.

The compliance validator should assess and flag the risk level of each requirement so the team can prioritize remediation. Fix disqualifying issues first, always. Scoring-affecting issues second. Administrative issues if time permits.
