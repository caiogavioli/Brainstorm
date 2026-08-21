# Collateral Analysis Patterns

## Reading an RFP for Scoring Signals

### Explicit Signals

The easiest signals are stated evaluation criteria. Look for:

- **Scoring rubrics** — tables with point allocations per section. These are the ground truth for section weighting. A section worth 40 points gets four times the attention of a section worth 10.
- **Evaluation factor ordering** — many RFPs list factors "in descending order of importance." Take this literally. The first factor listed is the most important even when points are not assigned.
- **"Go/no-go" requirements** — mandatory certifications, clearances, or experience thresholds that are pass/fail. These are not scored — they are gates. Missing one is disqualifying regardless of how strong the rest of the response is.

### Implicit Signals

When scoring rubrics are absent or vague, infer priority from:

- **Page allocation in the RFP itself.** If the RFP spends three pages describing the technical environment and one paragraph on pricing format, technical depth matters more than pricing creativity to this evaluator.
- **Specificity of instructions.** "Describe your approach to security" is generic. "Describe your approach to FedRAMP authorization, including your current authorization status, POA&M management process, and continuous monitoring tooling" tells you exactly what to address and signals deep evaluation.
- **Repetition.** If "scalability" appears in the scope of work, the evaluation criteria, and the technical requirements, it is a primary concern. Count keyword frequency as a rough priority signal.
- **Question period patterns.** If the client's Q&A responses elaborate extensively on one topic, that topic matters to them. If they give terse answers on another, it is either obvious or unimportant.

### Trap Signals

- **"Innovative" in a conservative RFP.** When an otherwise risk-averse RFP asks for "innovative approaches," they usually mean "modern and proven" not "experimental." Read the rest of the document for calibration.
- **Boilerplate evaluation language.** Some RFPs copy evaluation criteria from templates. If the criteria are generic and disconnected from the SOW, weight the SOW language more heavily.
- **Unstated elimination criteria.** Some evaluators have internal criteria not in the RFP. Past performance calls, reference checks, and oral presentations can override written scores. Note when these are mentioned and flag them as high-uncertainty factors.

## Reading a PRD for Pain-Point Extraction

PRDs are written from the buyer's operational perspective, not the procurement perspective. They reveal what the RFP sanitizes.

### What to Extract

- **The problem as they experience it** — not the solution they are requesting. The PRD often describes current-state pain before prescribing the desired solution. This pain language is gold for empathetic framing in the proposal.
- **Workarounds they have built** — manual processes, spreadsheets, shadow IT. These reveal the severity of the problem and give you concrete "before" scenarios for case study parallels.
- **Internal stakeholders named** — who uses the system, who approves it, who maintains it. These become personas you can reference in your approach description.
- **Integration points** — what other systems this must work with. These are often underspecified in the RFP but detailed in the PRD. They are also where implementations fail, so addressing them proactively signals competence.

### Common PRD Patterns

- **"Nice to have" requirements** that are actually essential. If the PRD calls something optional but the current workflow depends on it, treat it as required and address it. The evaluator will notice.
- **Scope creep indicators.** If the PRD keeps expanding requirements across versions or includes a long "future considerations" section, the client is uncertain about scope. Acknowledging this uncertainty (rather than pretending the scope is clean) builds trust.

## Extracting Positioning Evidence from Org Documents

Org docs are vendor-side collateral: capability statements, past performance summaries, team bios, certification lists, marketing materials.

### High-Value Evidence

- **Named clients with permission to reference.** A named client is worth ten anonymous references. Prioritize these.
- **Quantified outcomes.** "Reduced processing time by 40%" is evidence. "Improved efficiency" is noise. Extract numbers and their context.
- **Relevant certifications and clearances.** Map these directly to RFP requirements. A certification mentioned in both the RFP and our org docs is a direct match — flag it prominently.
- **Team members with relevant experience.** Named individuals with specific project experience on similar engagements. Generic resumes are filler; specific experience is evidence.

### Low-Value Evidence (Use Cautiously)

- **Generic capability statements.** "We have deep expertise in cloud migration" without specifics is an assertion, not evidence. Use only if nothing better exists, and flag it as ungrounded.
- **Marketing language.** Strip superlatives. "Industry-leading" means nothing to an evaluator. Extract the factual claim underneath — if there is one.
- **Stale content.** Anything over 18 months old should be verified. Technology references, client relationships, team membership, and certifications all decay. Flag stale evidence explicitly.

## Handling Sparse Collateral

When the user provides only the RFP and little or no vendor collateral:

1. **Do not invent evidence.** Every area that lacks supporting collateral gets a Low or Missing confidence rating.
2. **Map what the RFP itself provides.** Even without vendor collateral, the RFP tells you what needs to be addressed. The gap report becomes a shopping list: "To respond to Section 3.2, we need [specific evidence type]."
3. **Check for public information.** If the client is a public entity, their own website, annual reports, or prior solicitations may provide context. Note the source explicitly.
4. **Flag the risk honestly.** A response built entirely on assertions is weak. The gap report should state this plainly so the team can decide whether to invest in gathering more collateral or to proceed with appropriate hedging.

## Handling Contradictory Collateral

When two sources say different things:

1. **Record both.** Do not silently pick one. State: "Source A says X. Source B says Y."
2. **Assess recency.** The more recent source usually wins for factual claims. A 2024 capability statement supersedes a 2022 proposal excerpt.
3. **Assess authority.** The RFP supersedes all other sources for requirements. A PRD supersedes raw notes for client intent. Org docs supersede marketing materials for our capabilities.
4. **Flag for resolution.** Add the contradiction to the gap report with a specific question: "Does the client require X or Y? Source A and Source B disagree."
5. **Do not let the drafter decide.** Contradictions are resolved by the team or the client, not by the downstream skill guessing.
