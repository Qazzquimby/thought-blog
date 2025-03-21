---
title: "💭 while in development, at cost of greatly increasing token cost, could run every llm..."
date: 2025-03-21 18:53:33
author: "qazzquimby"
---

💭 while in development, at cost of greatly increasing token cost, could run every llm message multiple times with different contexts (different retrieved memories) and grade the answers against each other to see how well the contexts are performing relative to each other. Highly noisy though given nondeterminism and that many context items are retrieved each time so the feedback would need to be divided. A bit like team based ELO, but you're assigning players to hopefully make the best team. If you want the teams to be equal in elo you'd need to deliberately not put all the best players on one team, like you would in production.