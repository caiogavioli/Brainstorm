---
name: compliance-validator
description: >
  Validates every reviewed section against the RFP's explicit requirements. Produces
  a pass/fail compliance report with remediation notes. Runs after the empathy
  reviewer because tone fixes can inadvertently remove compliance-critical language.
  Trigger when the user says "check compliance," "validate the sections," "are we
  compliant," "run the compliance check," or after the empathy reviewer has produced
  sections/*-reviewed.md files.
---

## Inputs

- **`sections/[section-name]-reviewed.md`** — reviewed sections from the empathy-reviewer
- **RFP document(s)** — the original RFP for compliance requirements extraction
- **`brief.md`** — collateral brief, specifically the submission mechanics captured during collateral analysis
- **`coverage-matrix.md`** — to cross-reference whether mandatory requirements are addressed

## Outputs

- **`compliance-report.md`** — per-requirement pass/fail validation table with remediation instructions for failures

---

## Purpose

Compliance is binary in procurement. A non-compliant proposal may be eliminated from evaluation regardless of technical quality. This skill catches compliance gaps after all drafting and review passes are complete — because every upstream edit is an opportunity to introduce a gap. The compliance report is the final quality gate before assembly.

## Process

### Step 1: Extract Compliance Requirements

Re-read the RFP and extract every explicit compliance requirement. These fall into categories:

**Submission Format Requirements:**
- Page limits (per section and total)
- Font size, margin, and spacing requirements
- File format requirements (PDF, Word, specific naming conventions)
- Number of copies (physical/digital)
- Required file/volume structure
- Cover page requirements

**Content Requirements:**
- Required sections or topics that must be addressed
- Required appendices (resumes, certifications, financial statements, representations)
- Required forms (signature pages, certifications, representations and certifications)
- Required contact information placement
- Executive summary requirements (if mandated)

**Substantive Requirements:**
- Mandatory certifications or clearances ("must hold FedRAMP authorization")
- Mandatory experience thresholds ("minimum 5 years of relevant experience")
- Mandatory team qualifications ("Project Manager must hold PMP certification")
- Mandatory pricing structure (fixed-price, T&M, cost-plus — as specified)
- Small business utilization targets

**Procedural Requirements:**
- Submission deadline (date and time, time zone)
- Submission method (email, portal, physical delivery)
- Q&A or amendment acknowledgment requirements
- Conflict of interest disclosures
- Lobbying certifications

Record each requirement with:
- Exact language from the RFP
- RFP location (section, page)
- Whether it is mandatory (disqualifying if missed) or expected (points deducted if missed)

### Step 2: Build the Compliance Checklist

Use the template in `assets/validation-checklist-template.md` as a starting point. Add every RFP-specific requirement extracted in Step 1.

Organize by category. Mandatory/disqualifying requirements go first — these are the highest-risk items.

### Step 3: Validate Each Requirement

For each requirement in the checklist, check the reviewed sections:

**Pass** — the requirement is clearly addressed. The evidence is in the section and is specific enough that an evaluator would check this box.

**Fail** — the requirement is not addressed, or is addressed incompletely. Specify exactly what is missing and where it should appear.

**Partial** — the requirement is partially addressed. Some elements are present, others are missing. Specify what is present and what is not.

**Ambiguous** — the RFP's requirement is unclear, and whether the proposal meets it depends on interpretation. State the ambiguity, the interpretation used, and the risk. Mark as "Assumed compliant — [rationale]."

**Not Applicable** — the requirement does not apply to this response (e.g., a small business requirement when the vendor is a large business). State why.

### Step 4: Check "Addressed Within Narrative" Requirements

Many complex RFPs include requirements that must be "addressed within the narrative" rather than in a dedicated section. These are easy to miss because they are embedded in instructions rather than called out as requirements.

For these, check:
- Is the topic addressed somewhere in the proposal?
- Is it addressed with sufficient depth, or merely mentioned in passing?
- Would an evaluator searching for this topic find it?

If the requirement is addressed but buried, note the location and assess whether it is prominent enough for evaluators to find.

### Step 5: Estimate Page/Word Count

For each section, estimate the page count based on:
- Word count of the reviewed section
- Standard formatting (12pt font, 1-inch margins, single-spaced — or as specified by the RFP)
- Account for tables, diagrams, and white space

Compare against RFP page limits. Flag sections that exceed limits.

**Note:** Page count estimation from markdown is inherently approximate. Flag sections that are within 10% of the limit as "at risk" so the team can assess formatted output.

### Step 6: Check Cross-References

Verify that:
- Sections reference the correct appendices (and those appendices exist or are noted as pending)
- Case studies reference the correct client names and metrics (consistent across sections)
- Team member names and roles are consistent across team section and other references
- Pricing references match the pricing approach described in the technical narrative

### Step 7: Produce the Compliance Report

Write `compliance-report.md` with:
- Summary: total requirements checked, pass/fail/partial counts, critical failures
- Per-requirement validation table
- Remediation instructions for every failure and partial
- Page count assessment
- Cross-reference consistency notes
- Pre-flight status: whether the proposal is ready for assembly or has blocking issues

### Step 8: Surface Blocking Issues

If any mandatory requirement fails compliance:
- Mark the compliance report prominently: "BLOCKING: [count] mandatory requirements not met"
- List blocking issues at the top of the report before the detailed table
- The proposal assembler should not proceed until blocking issues are resolved

## Graceful Degradation

**Empathy-reviewed sections not available (only raw drafts):**
- Validate the raw section drafts. Note that compliance is being checked against pre-review content and should be re-checked after tone review.

**RFP has vague compliance requirements:**
- Validate what is explicit. For vague requirements, mark as "Ambiguous — assumed compliant" with the interpretation used.
- Note in the report that compliance certainty is reduced due to vague RFP language.

**Sections are missing for some RFP requirements:**
- Mark as Fail. Do not assume the missing section will be written later — surface it now.

**No page limits specified:**
- Skip page count validation. Note "No page limits specified in RFP" in the report.

**Coverage matrix not available:**
- Validate compliance from the RFP directly. Note reduced cross-reference capability.

## Integration with Other Skills

- **Proposal Assembler** reads `compliance-report.md` before assembling — if critical failures exist, assembly should stop
- **Compliance report** serves as the final quality gate; it is read by the assembler and by the human reviewer
- This skill does not modify sections — it reports. Fixes are applied by the team or by re-running upstream skills
