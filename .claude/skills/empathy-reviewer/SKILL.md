---
name: empathy-reviewer
description: >
  Reviews each drafted section for tone, voice, and client-centricity. Flags where
  the proposal sounds like it was written for a generic client rather than this
  specific one. This is a relationship pass, not a grammar pass. Trigger when the
  user says "review for tone," "empathy pass," "check the voice," "does this sound
  right," or after the section drafter has produced sections/*.md files.
---

## Inputs

- **`sections/[section-name].md`** — one or more drafted sections from the section-drafter
- **`brief.md`** — collateral brief, especially the Vocabulary & Tone Notes and Client Summary sections

## Outputs

- **`sections/[section-name]-reviewed.md`** — each section with inline `[REVIEW: note]` annotations marking tone issues and suggested rewrites
- **`review-notes.md`** — summary of patterns across all sections: systemic tone issues, recurring weak spots, overall voice assessment

---

## Purpose

A technically correct proposal can still lose if it reads like it was written for any client, not this one. Evaluators are people. They spend days reading proposals. The one that demonstrates genuine understanding of their specific situation — that uses their vocabulary, names their pain, and respects their context — creates trust. This skill is not about being warm. It is about being precise and recognized.

## Process

### Step 1: Load Client Voice Profile

Read `brief.md`, focusing on:

- **Vocabulary & Tone Notes** — the client's key terms, their tone profile, and language to avoid
- **Client Summary** — who they are, what they do, their context
- **Problem Statement** — how they describe their own challenge
- **Stated Priorities** — what they have said matters most

This is the rubric. Every section will be measured against it.

### Step 2: Review Each Section

Read each `sections/[section-name].md` file. For every paragraph, ask:

1. **Would the client recognize themselves in this paragraph?** Does it reference their specific situation, or could it be describing any organization?

2. **Does it use their vocabulary?** Are we using the terms from the brief's Vocabulary & Tone Notes, or have we translated into our own jargon?

3. **Does it lead with their problem?** Or does it lead with our capability and expect the client to make the connection?

4. **Is the tone calibrated?** Does it match the tone profile from the brief? A formal, risk-averse client should not receive a casual, innovation-heavy response. A technically sophisticated client should not receive dumbed-down explanations.

5. **Does it avoid the anti-patterns?** (See below.)

### Step 3: Annotate Issues

For each issue found, insert an inline annotation in the section:

```markdown
[REVIEW: issue-type — description of the problem and suggested rewrite]
```

Issue types:

- **`VENDOR-CENTRIC`** — paragraph focuses on the vendor's capabilities rather than the client's needs
- **`GENERIC`** — statement could apply to any client; needs specificity
- **`VOCABULARY-MISMATCH`** — uses vendor terminology instead of client terminology
- **`TONE-MISMATCH`** — tone does not match the client's tone profile (too casual, too formal, too salesy, too academic)
- **`SUPERLATIVE`** — ungrounded superlative that evaluators will discount
- **`PASSIVE-ACCOUNTABILITY`** — passive voice obscures who is responsible
- **`MISSING-EMPATHY`** — opportunity to acknowledge the client's specific challenge was missed
- **`FLATTERY`** — praise without substance; the client will notice

Keep the original text intact. Add the annotation immediately after the flagged passage so the writer can see both the issue and its location.

### Step 4: Suggest Rewrites

For substantive issues (VENDOR-CENTRIC, GENERIC, VOCABULARY-MISMATCH), provide a specific suggested rewrite — not just "make this more client-centric" but an actual alternative sentence or paragraph that demonstrates the fix.

**Example:**

> Our team brings over 15 years of experience in cloud infrastructure management. [REVIEW: VENDOR-CENTRIC — This opens with the vendor. Rewrite to open with the client's need: "The Department's migration from on-premises infrastructure to FedRAMP-authorized cloud services requires a team experienced with federal compliance requirements and complex legacy system transitions. Our team has led [N] comparable migrations, including [named example]."]

### Step 5: Produce the Reviewed Files

Save each annotated section as `sections/[section-name]-reviewed.md`. The original `sections/[section-name].md` is preserved — the reviewed version is a new file.

### Step 6: Produce Review Notes

Write `review-notes.md` summarizing:

1. **Systemic patterns** — issues that appear across multiple sections (e.g., "vendor-centric openings in 4 of 6 sections")
2. **Strongest sections** — which sections best demonstrate client understanding and why
3. **Weakest sections** — which sections read most generically and what would fix them
4. **Vocabulary adherence** — whether the client's key terms are used consistently
5. **Tone consistency** — whether the tone profile is maintained across sections
6. **Overall voice assessment** — one paragraph summarizing how this proposal would read to the client's evaluation team

## Anti-Patterns to Flag

### Vendor-Centric Framing

**What it looks like:** "We are experts in..." / "Our proven methodology..." / "Acme Solutions has been providing..."

**Why it fails:** The evaluator does not care about you. They care about their problem. Every sentence about your capabilities that does not connect to their need is a wasted sentence.

**The fix:** Restructure around the client's requirement. Your capability is the evidence, not the subject.

### Ungrounded Superlatives

**What it looks like:** "Best-in-class" / "industry-leading" / "world-class" / "unparalleled" / "cutting-edge"

**Why it fails:** These words have been drained of meaning by overuse. Evaluators read them as "we have nothing specific to say." Worse, they trigger skepticism — if you were truly best-in-class, you would cite the evidence instead of the label.

**The fix:** Replace with the specific evidence the superlative is trying to convey. If there is no specific evidence, delete the superlative.

### Generic Problem Statements

**What it looks like:** "Organizations today face increasing challenges with digital transformation..." / "Government agencies must balance competing priorities..."

**Why it fails:** This could be in any proposal for any client. It demonstrates zero understanding of this specific client's situation.

**The fix:** Name the client. Name their specific problem. Use their vocabulary. Reference their RFP language.

### Passive Accountability

**What it looks like:** "The system will be deployed..." / "Training will be provided..." / "Issues will be resolved..."

**Why it fails:** Who deploys? Who trains? Who resolves? The evaluator needs to know that specific people are accountable for specific outcomes. Passive voice creates ambiguity about responsibility.

**The fix:** Active voice with named actors: "Our deployment team, led by [Name], will..." / "Our training specialist will conduct..."

### Flattery Without Substance

**What it looks like:** "We are impressed by the Department's vision..." / "Your organization's commitment to innovation is inspiring..."

**Why it fails:** Evaluators are professionals performing a procurement function. Unsolicited praise is transparent and slightly embarrassing. It signals that you are trying to create rapport rather than demonstrate competence.

**The fix:** Delete the flattery. Replace with a specific observation that demonstrates understanding: "The Department's requirement for [specific capability] reflects a [specific shift/need] that we have addressed in [comparable context]."

## Empathy Is Not Flattery

The distinction is critical:

**Flattery** tells the client they are wonderful. It costs nothing, proves nothing, and builds no trust.

**Empathy** demonstrates that you understand their specific situation — their constraints, their history, their vocabulary, their stakeholders, their risks. It requires effort and knowledge. It builds trust because it proves you did the work.

A proposal with genuine empathy feels like it was written *for* this client. A proposal with flattery feels like the client's name was mail-merged into a template.

## Graceful Degradation

**Brief has thin Vocabulary & Tone Notes:**
- Review for anti-patterns (vendor-centric, superlatives, passive voice) even without a strong vocabulary baseline.
- Note in review-notes.md that the empathy pass was limited by thin client voice data.
- Recommend the user provide more client collateral for vocabulary calibration.

**Only one section to review:**
- Review it. Still produce review-notes.md, but note the limited scope.

**Sections are heavily marked with [ASSERTION]:**
- This is a coverage problem, not a tone problem. Note it in review-notes.md but do not try to fix evidence gaps with better tone. The section drafter and coverage matrix need attention first.

## Integration with Other Skills

- **Compliance Validator** reads `sections/[X]-reviewed.md` — the reviewed versions, not the originals — because tone fixes can inadvertently remove compliance-critical language
- **Proposal Assembler** reads `sections/[X]-reviewed.md` for final assembly
- **Review-notes.md** is a reference for the team; no downstream skill consumes it as structured input
