---
name: requirements-mapper
description: >
  Maps every explicit and implicit RFP requirement to available evidence from the
  collateral brief. Produces a coverage matrix so downstream skills know where to
  ground claims, where to assert, and where to acknowledge gaps. Trigger when the
  user says "map the requirements," "build the coverage matrix," "what can we
  substantiate," or after the collateral analyzer has produced brief.md and
  gap-report.md.
---

## Inputs

- **`brief.md`** — collateral brief from the collateral-analyzer, including Evidence Map and Confidence Map
- **`gap-report.md`** — gap report from the collateral-analyzer
- **RFP document(s)** — the original RFP for direct requirement extraction (re-read, do not rely solely on the brief's summary)

## Outputs

- **`coverage-matrix.md`** — table mapping every requirement to evidence sources, coverage classification, and recommended action

---

## Purpose

The coverage matrix is the drafter's decision engine. For every requirement in the RFP, it answers three questions: Can we substantiate this claim? What evidence supports it? What should the drafter do? Without it, the drafter guesses — and guessing produces either fabricated claims or unnecessary hedging. Both lose evaluations.

## Process

### Step 1: Extract Explicit Requirements

Re-read the RFP (not just the brief — the actual document). Extract every requirement that uses obligation language:

**Mandatory indicators:**
- "shall," "must," "is required to," "will" (when used as an obligation)
- "mandatory," "required," "necessary"
- "the vendor is expected to," "the contractor shall provide"

**Conditional indicators:**
- "should," "may," "is preferred," "is desirable"
- "points will be awarded for," "additional consideration for"

Record each requirement with:
- The exact language from the RFP (quote, do not paraphrase)
- The RFP section and page where it appears
- Whether it is mandatory or preferred
- Which RFP response section it maps to (if the RFP specifies section structure)

### Step 2: Extract Implicit Requirements

Implicit requirements are not stated as obligations but are embedded in:

**Evaluation criteria language.** If the scoring rubric awards points for "demonstrated experience with federal healthcare systems," that is an implicit requirement to provide federal healthcare case studies — even if no section explicitly asks for them.

**Scope of work detail.** Detailed SOW descriptions imply capability requirements. If the SOW describes a complex data migration, the evaluation will look for evidence of data migration experience even if no requirement explicitly demands it.

**Questions in the RFP.** "Describe your approach to..." is a requirement to describe your approach. "How does your solution handle..." requires an answer. These are requirements disguised as questions.

**Repeated themes.** If the RFP mentions "scalability" in five different contexts, there is an implicit requirement to address scalability comprehensively — not just where it is explicitly asked.

Mark each implicit requirement with the evidence that it is actually a requirement (the evaluation criterion, the SOW section, the repeated emphasis).

### Step 3: Classify Coverage

For each requirement (explicit and implicit), cross-reference against the brief's Evidence Map and Collateral Inventory. Assign one of three classifications:

**Grounded** — Direct evidence exists in the collateral. You can point to a specific document, case study, certification, or metric that substantiates the claim. The drafter can cite this evidence with confidence.

Criteria for Grounded:
- A named client engagement that addresses this capability
- A certification or audit report that covers this requirement
- A quantified outcome from a relevant project
- A team member with documented, specific experience
- A prior proposal section that was validated and is still current

**Assertable** — No direct evidence, but a reasonable claim can be made. The vendor likely has this capability based on adjacent evidence, industry norms, or general organizational maturity. The drafter should make the claim but flag it with `[ASSERTION: rationale]` so reviewers know it is unsubstantiated.

Criteria for Assertable:
- Adjacent capability exists (we did X, which requires similar skills to Y)
- Industry-standard capability (any vendor of our size/type would have this)
- Partial evidence exists (one data point, not a pattern)
- Prior proposal claimed it, but no independent evidence confirms it

**Gap** — Cannot be credibly addressed. No evidence, no adjacent evidence, and asserting would risk credibility if challenged. The drafter should either acknowledge the gap honestly or the team should seek more evidence before drafting.

Criteria for Gap:
- No collateral addresses this area at all
- The brief's Confidence Map shows Missing for this area
- The requirement demands specific certifications or clearances we cannot confirm
- Contradictory evidence exists and is unresolved

### Step 4: Assess Gap Severity

Not all gaps are equal. For each Gap classification, assess:

**Disqualifying gaps** — the requirement is mandatory (shall/must language) and we have no evidence and cannot credibly assert. Missing this requirement may result in the proposal being eliminated from evaluation. Flag prominently. The team must decide: seek evidence, partner with someone who has it, or consider no-bid.

**Manageable gaps** — the requirement is preferred (should/may language) or the RFP leaves room for alternative approaches. The drafter can acknowledge the gap candidly, describe a mitigation plan, or address it partially. Evaluators may deduct points but will not eliminate the proposal.

**Addressable gaps** — evidence likely exists but was not provided in the collateral. The gap report from the collateral analyzer may already flag these. The recommended action is to seek the evidence before drafting.

### Step 5: Produce the Coverage Matrix

Use the template in `assets/coverage-matrix-template.md`. One row per requirement. Include both explicit and implicit requirements. Order by RFP section (or evaluation factor, if the RFP organizes by factor rather than section).

For each row, provide a recommended action:
- **Cite and ground** — evidence exists, drafter should cite the specific source
- **Assert with caveat** — make the claim, mark it `[ASSERTION]`, note the rationale
- **Acknowledge gap** — address honestly, describe mitigation or plan to acquire capability
- **Seek evidence** — pause drafting for this area, request more collateral from the team
- **Escalate** — disqualifying gap, requires bid/no-bid decision

## Graceful Degradation

**Brief has Low/Missing confidence across most areas:**
- Proceed. The coverage matrix will be heavily weighted toward Assertable and Gap classifications. This is correct — it reflects the actual state of evidence.
- The matrix becomes a prioritized list of what evidence to gather. This is valuable even if drafting is deferred.

**RFP has vague requirements (no shall/must language):**
- Extract requirements from evaluation criteria and scope of work instead.
- Mark these as "Inferred from [source]" in the requirement column.
- Classify coverage as normal — vague requirements still need evidence.

**No gap report available (collateral analyzer produced only a brief):**
- Proceed using the brief's Confidence Map as a proxy for gap information.
- Note reduced gap assessment in the matrix notes.

**Massive RFP (100+ requirements):**
- Group requirements by theme or RFP section.
- Prioritize mandatory requirements and high-weighted evaluation factors.
- Note which requirement groups were exhaustively mapped vs. sampled.

## Integration with Other Skills

- **Section Drafter** reads `coverage-matrix.md` to determine, per section, which claims to ground, which to assert, and which to flag as gaps
- **Compliance Validator** reads `coverage-matrix.md` to verify that mandatory requirements classified as Grounded or Assertable are actually addressed in the drafted sections
- **Proposal Assembler** reads `coverage-matrix.md` to surface unaddressed gaps in the pre-flight checklist
