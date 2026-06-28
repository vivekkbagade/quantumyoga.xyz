---
name: token-cost
description: "Use to calculate, analyze, or report the total token usage and estimated API costs for graph builds and conversation transcript logs."
---

# Token Cost Customization Skill

This skill allows the agent to analyze token usage and calculate estimated API costs from graphify runs and conversation transcripts.

## Instructions

Whenever the user asks about token cost, model spending, or usage summaries:
1. Run the Python cost calculator script:
   ```bash
   python .agents/skills/token-cost/scripts/calculate_cost.py
   ```
2. Display the generated summary, separating Graphify build costs and Chat conversation costs.
3. Recommend cost-saving strategies (such as utilizing `.graphifyignore` and local AST caching).
