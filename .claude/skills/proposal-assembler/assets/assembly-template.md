# Proposal Assembly Template

This template defines the structure of the final assembled document. The assembler uses this as the default when the RFP does not prescribe a specific response structure.

---

## Document Structure

### 1. Pre-Flight Checklist

Inserted at the top of `proposal-final.md`. Not part of the submission document — it is the internal handoff to the human reviewer. Should be removed before final formatting and submission.

### 2. Cover Page

```markdown
# [Proposal Title]

**In Response To:** [RFP Number] — [RFP Title]
**Issued By:** [Issuing Organization]
**Submitted By:** [Vendor Legal Name]
**Date of Submission:** [Date]

---

**Primary Point of Contact:**
[Full Name]
[Title]
[Email Address]
[Phone Number]
[Mailing Address]

**Authorized Representative:**
[Full Name, Title — person authorized to bind the organization]

---

[Vendor Logo Placeholder — if RFP permits or requests]

[Any required identifiers: DUNS, UEI, CAGE Code, Contract Vehicle Number]
```

### 3. Table of Contents

Auto-generated from section headings. Include:
- All major sections (H1, H2)
- Appendix titles
- Page number estimates (will need updating after final formatting)

### 4. Executive Summary (if required)

Typically 1-2 pages. Not a mini-proposal — a decision-support summary for senior evaluators who may not read the full document.

Structure:
1. **Client's challenge** — one paragraph, in their words
2. **Our approach** — one paragraph, specific to this engagement
3. **Why us** — one paragraph, grounded in evidence (top 3 differentiators with cited evidence)
4. **Key outcomes promised** — bulleted, specific, tied to evaluation criteria

### 5. Sections (in order)

**RFP-specified order** takes absolute precedence. If the RFP defines the response structure, follow it exactly — matching section numbers and titles.

**Default canonical order** (when RFP does not specify):

| Order | Section | Typical Length | Notes |
|-------|---------|---------------|-------|
| 1 | Organization Overview | 2-5 pages | Lead with relevance, not history |
| 2 | Technical Approach | 5-15 pages | Longest section; match depth to evaluation weight |
| 3 | Security & Compliance | 3-8 pages | Certification-heavy; tables work well here |
| 4 | Team & Staffing | 3-8 pages | Named individuals with specific experience |
| 5 | Past Performance / Case Studies | 3-6 pages | 1-2 pages per case study |
| 6 | Pricing Narrative | 2-5 pages | If in the technical volume; methodology focus |

**Adaptive ordering:** If the evaluation criteria weight one factor substantially higher than others, consider moving that section earlier. Evaluators who read sequentially form impressions early — lead with your strongest material.

### 6. Appendices

Each appendix gets its own heading and is clearly labeled.

```markdown
---

# Appendices

## Appendix A: [Title]

[Content or placeholder]

## Appendix B: [Title]

[Content or placeholder]
```

**Common appendices:**
- Key personnel resumes
- Certifications and authorization letters
- Past performance questionnaires or CPARS excerpts
- Organizational chart
- Project schedule / timeline
- Letters of commitment from subcontractors
- Small business subcontracting plan
- Required forms and certifications

---

## Section Transition Conventions

Between major sections, insert:
```markdown
---
```

Section headings should use `#` (H1) for major sections and `##` (H2) for subsections. This allows the table of contents to be auto-generated from heading structure.

## Marker Handling During Assembly

| Marker | Action During Assembly |
|--------|----------------------|
| `[GROUNDED: source]` | Remove — internal review marker |
| `[ASSERTION: rationale]` | Remove — internal review marker |
| `[REVIEW: note]` | Flag in pre-flight checklist if unresolved, then remove |
| `[PLACEHOLDER]` | Keep — signals missing content to human reviewer |

**Count all markers before removing them.** The counts feed the pre-flight checklist's Evidence Quality section.

## Quality Checks During Assembly

Before writing the final file, verify:

1. **No orphaned references.** Every "see Section X" or "as described in Appendix Y" points to a section/appendix that exists.
2. **Consistent naming.** Client name, vendor name, project name, and key personnel names are spelled the same way throughout.
3. **No duplicate content.** If the same case study or capability description appears in multiple sections, it should be cross-referenced, not repeated verbatim.
4. **Heading hierarchy is clean.** No skipped heading levels (H1 → H3 without H2). No inconsistent capitalization in headings.
5. **Tables are complete.** No empty cells that should have content. No "TBD" entries in the final document.
