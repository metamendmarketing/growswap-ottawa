# SwapMatch Engine

## Two-way match score
- Product compatibility: 35
- Value compatibility: 20
- Distance: 15
- Quantity compatibility: 10
- Pickup compatibility: 10
- Freshness: 5
- User reputation: 5
Total: 100

## Graph model
Users are nodes. A directed edge A -> B exists when A has a product B wants and the listing satisfies quantity/radius constraints.

Find cycles of length:
- 2 first
- 3 next
- 4 maximum for MVP

Longer cycles are intentionally excluded because coordination friction rises quickly.

## Cycle scoring
Score using:
- Complete want satisfaction
- Reference value balance
- Combined route distance
- Pickup overlap
- Inventory freshness
- Participant reliability

## Output
Each suggestion must include:
- Match score
- Items exchanged
- Quantities
- Local reference values
- Total route distance
- Value variance
- Participant count
- CTA to propose/accept

## Required demo
A deterministic 3-way trade with animated curved routes on the Ottawa map.
