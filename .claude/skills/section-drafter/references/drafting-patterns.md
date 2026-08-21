# Drafting Patterns

## How to Open a Section

### The Client-First Opening

Every section should open by demonstrating understanding of the client's problem before describing your solution. The evaluator's first question is always: "Do they understand what we need?" Answer it immediately.

**Pattern:**
1. State the client's challenge using their vocabulary (from the brief)
2. Acknowledge the complexity or stakes (show you grasp why this matters)
3. Transition to your approach as a response to their specific need

**Example (good):**
> The Department's legacy case management system processes over 200,000 annual submissions through a workflow designed for a fraction of that volume. Processing delays now average 47 days, directly affecting constituent satisfaction and congressional inquiry rates. Our approach addresses this throughput challenge through [specific approach], drawing on our experience processing comparable volumes for [named client].

**Example (bad):**
> Acme Solutions is a leading provider of case management solutions with over 15 years of experience serving government agencies. Our proven methodology ensures efficient processing and improved outcomes for our clients.

The first example demonstrates understanding. The second demonstrates nothing except that you have a marketing department.

### When NOT to Use Client-First Opening

For compliance-heavy sections (security certifications, financial data, organizational legal structure), lead with the facts the evaluator needs. These sections are checklists, not narratives. The evaluator is looking for specific data, not framing.

## How to Use Evidence

### Citation Pattern

Evidence should be woven into the narrative, not appended as footnotes. The evaluator should encounter the evidence as part of the argument, not as a separate exercise.

**Pattern:**
> [Specific claim] — as demonstrated in our [named engagement] for [named client], where [quantified outcome]. [GROUNDED: case study name]

**Example:**
> Our data migration approach preserves referential integrity across complex relational schemas. In our migration of 14 million records for the State of Oregon's benefits system, we achieved a 99.97% data accuracy rate with zero production rollbacks. [GROUNDED: Oregon DHS case study, 2023]

### What to Cite

- **Named clients** — more credible than anonymous references
- **Quantified outcomes** — numbers are specific; adjectives are not
- **Specific technologies or methods** — "we used Apache Kafka for event streaming" beats "we used modern streaming technology"
- **Timeline evidence** — "delivered in 8 months against a 12-month schedule" is a fact; "delivered ahead of schedule" is a claim

### What NOT to Cite

- **Internal processes** — "our proprietary methodology" is not evidence; describe what the methodology produces
- **Awards from your own industry** — unless the evaluator would recognize and respect the awarding body
- **Client testimonials** — unless the RFP asks for them; unsolicited quotes feel manufactured

### Handling Thin Evidence

When evidence is limited:
- Present what you have, quantify what you can
- Mark the claim honestly: `[ASSERTION: based on adjacent experience with X]`
- Do not pad thin evidence with generic amplification — it highlights the weakness rather than concealing it

## How to Close a Section

### Forward Bridge

If sections are read sequentially, close with a natural transition:

> The architecture described above is operationalized through the staffing approach detailed in the following section, where we introduce the key personnel who have implemented this architecture in comparable environments.

### Standalone Close

If sections may be read independently (common when different evaluators score different sections), close with a summary of the key evidence:

> In summary, our technical approach addresses [requirement A] through [specific mechanism], [requirement B] through [specific mechanism], and [requirement C] through [specific mechanism] — each grounded in demonstrated experience with [relevant domain].

### What NOT to Do

- Do not close with generic confidence statements ("We are confident in our ability to deliver...")
- Do not close by restating your company name and qualifications
- Do not close with forward-looking promises without evidence ("We look forward to partnering...")

## Common Failure Modes

### Vendor-Centric Language

**Problem:** Writing about yourself instead of writing about the client's problem and your evidence of solving it.

**Symptom:** Paragraphs that start with "We," "Our team," "Acme Solutions," or "Our approach." Multiple consecutive sentences about vendor capabilities without connecting them to client needs.

**Fix:** Restructure every paragraph around the client's requirement. The client's need is the subject; your capability is the predicate.

| Vendor-Centric | Client-Centric |
|----------------|----------------|
| "We have extensive experience in cloud migration." | "The Department's migration to cloud infrastructure requires experience with complex legacy data conversion — a challenge we addressed in our [named] engagement, where we migrated [X] records with [Y] accuracy." |
| "Our team includes certified security professionals." | "Meeting the FedRAMP Moderate authorization requirement for this engagement depends on experienced security assessors. Our proposed Security Lead, [Name], holds [certification] and has led [N] successful authorizations." |

### Ungrounded Superlatives

**Problem:** Claims that cannot be verified and that evaluators discount automatically.

**Symptom:** "Best-in-class," "industry-leading," "world-class," "cutting-edge," "unparalleled," "unmatched."

**Fix:** Replace every superlative with a specific, verifiable claim. If you cannot replace it with evidence, delete it.

| Ungrounded | Grounded |
|-----------|---------|
| "Best-in-class security practices" | "SOC 2 Type II certified since 2019, with zero material findings in the last three audits" |
| "Industry-leading response times" | "Mean time to resolution of 2.3 hours across 4,200 support tickets in FY2024" |

### Burying the Lede

**Problem:** The most important information is in paragraph three instead of paragraph one.

**Symptom:** Sections that open with background, methodology, or organizational history before getting to the specific answer the evaluator is looking for.

**Fix:** Lead with the answer. If the evaluator reads only the first paragraph, they should know your key message. Background and methodology follow.

### Generic Problem Statements

**Problem:** Describing a challenge that could apply to any client in any sector.

**Symptom:** "Organizations today face increasing demands for digital transformation..." or "Government agencies must balance efficiency with compliance..."

**Fix:** Name the client. Name their specific problem. Use their vocabulary. If the brief provides it, use their scale numbers, their system names, their stakeholder titles. Every generic sentence is a missed opportunity to demonstrate that you read their document.

### Passive Voice That Obscures Accountability

**Problem:** Using passive voice to avoid committing to who does what.

**Symptom:** "The system will be implemented..." (by whom?) "Reports will be generated..." (how? when? by what trigger?)

**Fix:** Active voice with specific actors: "Our development team will implement..." or "The system generates weekly compliance reports automatically, with ad hoc reports available on demand."

Passive voice is acceptable for describing the client's current state ("submissions are currently processed manually") but not for describing your proposed approach, where the evaluator needs to know who is responsible.

## Length Discipline

### Matching Length to Weight

If the RFP weights sections:
- Allocate page budget proportionally to evaluation weight
- A 40-point section gets roughly 4x the depth of a 10-point section
- Do not pad low-weight sections to fill pages — concise and evidence-rich beats verbose and thin

### When the RFP Sets Page Limits

- Respect page limits precisely. Exceeding page limits is a compliance failure that can result in disqualification.
- Budget pages: allocate to subsections based on requirement density and evaluation weight.
- If you are under the limit, do not pad. An 8-page response that is dense with evidence beats a 15-page response that repeats itself.

### When There Are No Page Limits

- Default to a reasonable length for the complexity of the topic.
- Technical approach sections: 5-15 pages depending on scope complexity.
- Org overview: 2-5 pages.
- Security: 3-8 pages depending on compliance framework count.
- Team: 1-2 pages per key personnel plus team overview.
- Pricing narrative: 2-5 pages (tables are separate).
- Case studies: 1-2 pages per case study.

These are guidelines, not rules. Let the evidence and requirements drive length.
