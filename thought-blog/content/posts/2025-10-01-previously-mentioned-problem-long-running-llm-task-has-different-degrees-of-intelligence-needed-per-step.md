---
title: "Previously mentioned problem  Long running llm task has different degrees of intelligence needed per step"
date: 2025-10-01 20:01:34
author: "qazzquimby"
---

💭 
Previously mentioned problem: Long running llm task has different degrees of intelligence needed per step. Sometimes you need to plan/navigate, and other times you're trivially enacting the plan/walking the path. Using a strong llm at all times is needlessly expensive and using a cheap llm performs poorly at planning. This ties into other long term agency systems but isn't directly entangled I think.

Given a new situation, use the strong llm. Strong llm produces a plan and takes the first step.
Future responses use the weak llm until 
- it flags that the plan doesn't cover its current situation, new important info has arisen that may change the plan, etc. This obviously needs tuning.
- a fixed number of steps passes at which point the strong llm is asked to review the situation.

If this works well it'll be exciting for things like the text adventure project and social deduction game play given those fell apart partly under the cost of needing strong llms over long terms.
If success can be quantified, could even statistically tune some parameters.