---
name: proposal-assembler
description: >
  Assembles all reviewed, validated sections into a single proposal-final.md. Inserts
  front matter, enforces section order, attaches appendices, performs a final compliance
  pre-flight, and surfaces any unresolved issues. Trigger when the user says "assemble
  the proposal," "build the final document," "put it together," or after the compliance
  validator has produced compliance-report.md. Will refuse to assemble if critical
  compliance failures exist.
---

## Inputs

- **`sections/[section-name]-reviewed.md`** — reviewed sections from the empathy-reviewer
- **`compliance-report.md`** — compliance validation report from the compliance-validator
- **`brief.md`** — collateral brief for front matter details (client name, RFP reference, submission metadata)
- **`gap-report.md`** — gap report for surfacing unresolved issues in the pre-flight checklist
- **`coverage-matrix.md`** — coverage matrix for summarizing grounding status
- **RFP document(s)** — for section ordering and submission requirements

## Outputs

- **`proposal-final.md`** — the complete, assembled proposal document ready for human review

---

## Purpose

Assembly is not just concatenation. It is the final quality pass: enforcing section order, generating front matter, confirming appendix presence, checking cross-references, and producing a pre-flight checklist that tells the human reviewer exactly what still needs attention. The assembler's job is to produce a document that is as close to submission-ready as possible — and to be transparent about what it is not.

## Process

### Step 1: Read the Compliance Report

Read `compliance-report.md` before touching any sections.

**If the compliance report shows BLOCKING issues:**
- Stop. Do not assemble.
- Present the blocking issues to the user.
- Recommend specific remediation actions.
- Assembly can proceed only after blocking issues are resolved and the compliance validator is re-run.

**If the compliance report shows warnings but no blocking issues:**
- Proceed with assembly.
- Include all warnings in the pre-flight checklist at the top of `proposal-final.md`.

**If no compliance report exists:**
- Warn the user that compliance has not been validated.
- Proceed if the user confirms, but add a prominent warning to the pre-flight checklist.

### Step 2: Determine Section Order

The section order comes from one of two sources:

**RFP-specified order:** If the RFP prescribes a response structure ("Volume I shall contain Section 1: Executive Summary, Section 2: Technical Approach..."), follow it exactly. Match the RFP's section titles. Create placeholder sections for any required sections that have not been drafted.

**Default canonical order:** If the RFP does not specify structure, use this order:
1. Cover Page
2. Table of Contents
3. Executive Summary
4. Organization Overview
5. Technical Approach
6. Security & Compliance
7. Team & Staffing
8. Past Performance / Case Studies
9. Pricing Narrative (if in the technical volume)
10. Appendices

Adapt this order based on the RFP's emphasis — if the evaluation criteria weight security highest, consider moving Security & Compliance earlier.

### Step 3: Generate Front Matter

**Cover Page:**
```markdown
# [Proposal Title — typically the RFP title or project name]

**In Response To:** [RFP Number and Title]
**Submitted To:** [Client Organization Name]
**Submitted By:** [Vendor Name]
**Date:** [Submission Date]

**Primary Contact:**
[Name, Title]
[Email]
[Phone]
[Address]

**DUNS / UEI:** [If required]
**Contract Vehicle:** [If applicable]
```

Pull vendor details from `brief.md` (Collateral Inventory, which should include org docs) or from the user's provided information. Pull client details and RFP reference from the brief's Client Summary.

**Table of Contents:**
Generate from the assembled section headings. Include page estimates if the RFP requires a TOC. Use markdown heading levels to create hierarchy.

### Step 4: Process Grounding Markers

The drafted sections contain `[GROUNDED: source]` and `[ASSERTION: rationale]` markers from the section drafter, and `[REVIEW: note]` markers from the empathy reviewer.

**For the final document:**
- Remove all `[GROUNDED: source]` markers — these were for internal review
- Remove all `[ASSERTION: rationale]` markers — these were for internal review
- Remove all `[REVIEW: note]` markers — these should have been addressed during empathy review
- If any `[REVIEW: note]` markers remain (unresolved review comments), flag them in the pre-flight checklist

**Before removing markers, count them for the pre-flight summary:**
- Total grounded claims
- Total assertions
- Total unresolved review notes

### Step 5: Assemble Sections

Concatenate sections in the determined order. Between sections, insert:
- A horizontal rule (`---`)
- The section heading at the appropriate markdown level

Preserve all formatting, tables, and structure from the reviewed sections.

### Step 6: Handle Appendices

Read each section for appendix references. Compile a list of required appendices.

For each referenced appendix:
- If the appendix content exists (provided by the user or generated), include it
- If the appendix content does not exist, insert a placeholder:

```markdown
### Appendix [X]: [Title]

> **[PLACEHOLDER]** This appendix was referenced in [Section Name] but has not been provided. It must be added before submission.
```

Flag all placeholder appendices in the pre-flight checklist.

### Step 7: Produce the Pre-Flight Checklist

Insert the pre-flight checklist at the very top of `proposal-final.md`, before the cover page. This checklist is for the human reviewer — it tells them exactly what needs attention before submission.

```markdown
# Pre-Flight Checklist

**Assembly Date:** [date]
**Status:** [Ready for Review / Action Required]

## Document Completeness

- [x/☐] All RFP-required sections present
- [x/☐] All referenced appendices included
- [x/☐] Cover page complete
- [x/☐] Table of contents generated
- [x/☐] Contact information included

## Compliance Status

- [x/☐] Compliance validation passed (no blocking issues)
- Warnings: [count] — see compliance-report.md for details

## Evidence Quality

- Grounded claims: [count]
- Assertions (unsubstantiated): [count]
- Grounding ratio: [grounded / (grounded + assertions)]%

## Unresolved Items

- [ ] [List any unresolved review notes, placeholder appendices,
       missing sections, or open questions from gap-report.md]

## Page Count Estimate

| Section | Estimated Pages | Limit | Status |
|---------|----------------|-------|--------|
| [Section] | [pages] | [limit] | [OK / At Risk / Over] |
| **Total** | [pages] | [limit] | |

## Before Submission

- [ ] Human review of all assertions for accuracy
- [ ] Final formatting in submission format (PDF/Word as required)
- [ ] Appendix completion (if placeholders remain)
- [ ] Pricing volume preparation (if separate)
- [ ] Authorized signature on required forms
- [ ] Submission method and deadline confirmed
```

### Step 8: Write the Final Document

Save the complete assembled document as `proposal-final.md`.

The file structure:
1. Pre-flight checklist
2. Cover page
3. Table of contents
4. Sections (in order)
5. Appendices

## Graceful Degradation

**No compliance report available:**
- Assemble the document but add a prominent warning in the pre-flight checklist: "COMPLIANCE NOT VALIDATED — compliance-report.md was not produced. Run the compliance-validator before submission."

**Some sections are raw drafts (not reviewed):**
- Assemble what exists. Mark unreviewed sections in the pre-flight checklist.
- Include grounding markers in unreviewed sections (do not strip them — they signal that review has not occurred).

**Missing sections:**
- Insert placeholders for RFP-required sections that have not been drafted.
- Flag each in the pre-flight checklist as "NOT DRAFTED — must be completed before submission."

**No gap report available:**
- Skip the gap-informed items in the pre-flight checklist. Note reduced pre-flight coverage.

**No coverage matrix available:**
- Skip the evidence quality section of the pre-flight checklist. Note that grounding ratio could not be calculated.

## Integration with Other Skills

- This is the terminal skill in the pipeline. It consumes output from all upstream skills.
- `proposal-final.md` is the final artifact — it is not consumed by any downstream skill.
- The pre-flight checklist is the handoff to human review: it tells the human exactly what the pipeline produced, what it could not produce, and what needs attention before submission.
