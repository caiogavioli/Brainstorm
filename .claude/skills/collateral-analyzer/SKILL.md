---
name: collateral-analyzer
description: >
  Reads all client-provided collateral (RFP documents, PRDs, org materials, prior proposals,
  case study notes) and produces a structured brief and gap report. Trigger when the user
  provides RFP materials, says "analyze the collateral," "start the RFP response," "what do
  we have to work with," or drops files for an RFP engagement. This skill runs first, always.
  Nothing downstream is trustworthy without it.
---

## Inputs

- **Client collateral** — any combination of:
  - RFP/RFI document(s)
  - Product Requirements Documents (PRDs)
  - Organization overview documents (about-us pages, capability statements, past performance summaries)
  - Prior proposals or response excerpts
  - Case study notes or drafts
  - Raw notes, emails, or meeting summaries from the capture team
- Files may be `.md`, `.txt`, `.pdf`, or pasted text. Accept whatever is provided.

## Outputs

- **`brief.md`** — structured synthesis of all collateral: who the client is, what they need, how they will evaluate, and how confident we are in each area
- **`gap-report.md`** — per-RFP-section view of what evidence is missing, what is thin, and what questions must be resolved before drafting

---

## Purpose

This skill is the foundation of the pipeline. Every downstream skill — requirements mapping, section drafting, empathy review, compliance validation, assembly — depends on the brief and gap report being honest and thorough. The collateral analyzer does not generate prose for the proposal. It reads, categorizes, extracts, and synthesizes. Its job is to give the drafter a clear picture of what we know, what we can claim, and what we cannot.

## Process

### Step 1: Inventory the Collateral

Read every file the user provides. Categorize each into one of these types:

| Type | What to Look For |
|------|-----------------|
| **RFP/RFI** | The solicitation document itself. Contains requirements, evaluation criteria, submission instructions, scope of work. This is the primary source of truth for what the client wants. |
| **PRD** | Product or service requirements from the client's perspective. Contains pain points, desired outcomes, technical requirements. Richer than the RFP on intent, thinner on procurement mechanics. |
| **Org docs** | About-us materials, capability statements, past performance summaries, team bios. These are *our* collateral — evidence we can cite in responses. |
| **Prior proposals** | Past responses to similar RFPs. Useful for language, positioning, and reusable content — but must be checked for staleness and relevance. |
| **Case study inputs** | Notes, metrics, or drafts for client success stories. Raw material for the case studies section. |
| **Raw notes** | Emails, meeting notes, capture call summaries. Unstructured but often contain signals about client priorities, relationship context, and competitive intelligence. |

Record each file, its type, and a one-line summary in the Collateral Inventory section of the brief.

### Step 2: Extract from the RFP

The RFP is the primary document. Extract the following, quoting directly where possible:

**Evaluation criteria and weights.** Look for scoring rubrics, evaluation factors, and language like "proposals will be evaluated based on..." These determine section weighting downstream.

**Explicit requirements.** Statements using "shall," "must," "required," "mandatory." These become compliance checkpoints. Record the exact language — paraphrasing loses precision.

**Implicit priorities.** What the RFP emphasizes through repetition, detail, or positioning. If security gets three pages and pricing gets one paragraph, that is a signal. If the RFP mentions a specific failure or pain point, that is a signal.

**Submission mechanics.** Page limits, required sections, format requirements, submission deadlines, required certifications, mandatory appendices. These feed the compliance validator downstream.

**Vocabulary and tone.** How the client talks about their problem. Industry-specific terms, acronyms, framing choices. The drafter must mirror this language — not translate it into our vocabulary.

**Cultural signals.** Formality level, risk appetite indicators, innovation vs. stability orientation. An RFP that uses "proven" and "reliable" twelve times wants something different from one that says "innovative" and "transformative."

### Step 3: Extract from Supporting Collateral

For each non-RFP document:

**From PRDs:** Client's description of the problem in their own words. Desired outcomes. Technical environment details. Integration requirements. These often reveal what the RFP leaves implicit.

**From org docs:** Specific capabilities we can cite. Named projects, clients, certifications, team qualifications. Quantified outcomes (percentages, timelines, scale). These become grounding evidence for the drafter.

**From prior proposals:** Reusable positioning language. Previously validated claims. Section structures that worked. But flag anything older than 18 months or written for a materially different client — stale content is worse than no content.

**From case study inputs:** Client names (if referenceable), problem descriptions, quantified results, timeline, team composition. Raw material that the drafter will shape into narratives.

**From raw notes:** Relationship context, competitive intelligence, unstated preferences, internal priorities the client shared informally. These are high-value but low-confidence — flag them as context, not evidence.

### Step 4: Produce the Brief

Use the template in `assets/brief-template.md`. Fill every section. For each section, assign a confidence level:

- **High** — direct evidence from multiple sources, or explicit RFP language
- **Medium** — evidence from one source, or reasonable inference from RFP language
- **Low** — inference only, no direct evidence, or contradictory signals
- **Missing** — no information available; this area cannot be addressed without more collateral or assumptions

The brief must be readable as a standalone document. A person who reads only the brief should understand: who the client is, what they need, how they will evaluate, what evidence we have, and where we are guessing.

### Step 5: Produce the Gap Report

For each major RFP section (or evaluation criterion), assess:

1. **What evidence exists** — cite specific collateral files and what they provide
2. **What is missing** — what the drafter will need that we do not have
3. **What questions should be asked** — if there is a Q&A period or client contact, what would resolve the gap
4. **Can we proceed with caveats?** — some gaps are manageable (flag the assertion); others are disqualifying (cannot credibly respond without more information)
5. **Recommended action** — proceed with assertion, seek more collateral, ask client, or flag for bid/no-bid decision

The gap report is not a list of complaints. It is a decision tool. It tells the team exactly what they can draft confidently, what requires hedging, and what requires action before drafting.

## Graceful Degradation

**RFP only, no vendor collateral:**
- Proceed. The brief will have Low or Missing confidence across most areas.
- The gap report will be extensive. This is correct behavior — it surfaces the risk honestly.
- Flag every downstream claim as needing assertion rather than grounding.
- Recommend the user provide org docs, case studies, or prior proposals before proceeding to drafting.

**No RFP (only vendor collateral):**
- Stop. Without an RFP or equivalent requirements document, there is nothing to respond to.
- If the user provides a PRD or scope document instead, treat it as a proxy RFP and note the limitation.

**Contradictory collateral:**
- Document both signals. Do not resolve the contradiction silently.
- In the brief, note: "Collateral conflict: [Source A] states X, [Source B] states Y. Resolution needed before drafting."
- In the gap report, classify the affected area as Low confidence.

**Massive collateral (10+ documents):**
- Prioritize: RFP first, then evaluation-criteria-adjacent documents, then supporting evidence.
- Summarize rather than exhaustively catalog low-value documents.
- Note in the Collateral Inventory which documents were skimmed vs. deeply analyzed.

## Integration with Other Skills

- **Requirements Mapper** reads `brief.md` to cross-reference requirements against available evidence
- **Section Drafter** reads `brief.md` for vocabulary, tone, and grounding evidence
- **Empathy Reviewer** reads `brief.md` for client vocabulary and tone signals
- **Compliance Validator** reads `brief.md` for submission mechanics and format requirements
- **Proposal Assembler** reads `gap-report.md` to surface unresolved issues in the pre-flight checklist
