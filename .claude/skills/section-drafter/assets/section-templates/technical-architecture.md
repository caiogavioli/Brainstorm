# Technical Approach

## Understanding of the Problem

[Open with the client's problem as they described it — use their vocabulary, reference their specific context. Demonstrate that you read and understood their RFP, not that you have a pre-built solution looking for a client.]

[Quote or closely paraphrase the client's own description of what they need. Then articulate the underlying technical challenges that must be solved.]

## Proposed Solution

### Architecture Overview

[Describe the solution architecture at a level appropriate to the RFP's technical depth. If the RFP is highly technical, provide detailed component descriptions. If the RFP is executive-level, describe capabilities and outcomes.]

[If the solution involves a platform or product, describe how it addresses THIS client's requirements — not how the product works in general.]

**Key Architectural Decisions:**

| Decision | Rationale | Alternative Considered | Why Rejected |
|----------|-----------|----------------------|--------------|
| [Technology/pattern choice] | [Why this fits the client's needs] | [What else was considered] | [Honest reason] |

### [Component / Capability Area 1]

**Client Requirement Addressed:** [Reference specific RFP requirements]
**Approach:** [How this component works in the context of this engagement]
**Evidence:** [Prior implementation of this component in a similar context]

[GROUNDED: source] or [ASSERTION: rationale]

### [Component / Capability Area 2]

[Same structure. One subsection per major component or capability area.]

## Integration Approach

[How the proposed solution integrates with the client's existing systems. Name the specific systems mentioned in the RFP. Describe the integration pattern, data flow, and any middleware or APIs involved.]

**Systems to Integrate:**

| System | Integration Method | Data Flow | Complexity |
|--------|-------------------|-----------|------------|
| [Named system from RFP] | [API / ETL / Direct DB / etc.] | [Direction and frequency] | [Low / Medium / High] |

## Data Migration / Conversion

[If applicable. Describe the approach to migrating data from legacy systems. Address data quality, validation, transformation, and rollback strategy.]

## Development Methodology

[Describe your methodology in terms of how it benefits THIS engagement — not as a textbook definition. The evaluator knows what Agile is. Tell them how your specific practices address the risks and requirements of this project.]

## Testing & Quality Assurance

[Describe testing approach with specificity. Name the types of testing, coverage targets, and how defects are managed. If you have testing metrics from similar projects, cite them.]

## Scalability & Performance

[Address the client's specific scale requirements. If the RFP mentions expected user counts, data volumes, or transaction rates, address those numbers directly. Cite performance benchmarks from similar deployments.]

---

**What makes this section succeed:** Demonstrating that you understood the problem before describing the solution. Using the client's system names, not generic labels. Providing evidence from comparable implementations. Showing architectural decisions with rationale, not just a technology list.

**What makes this section fail:** Leading with your product/platform description instead of the client's problem. Generic methodology descriptions. Technology lists without rationale. Claiming scalability without benchmarks. Ignoring integration complexity.
