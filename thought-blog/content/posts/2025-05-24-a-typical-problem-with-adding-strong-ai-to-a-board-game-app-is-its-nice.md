---
title: "a typical problem with adding strong ai to a board game app is its nice"
date: 2025-05-24 17:36:13
author: "qazzquimby"
---

💭 a typical problem with adding strong ai to a board game app is its nice to write the ai in python, and you're basically never writing the game in python. MCTS requires constant rapid simulation so any overhead talking between services would be an awful bottleneck.
I think muzero just gets around that entirely because it simulates from a predicted next game state rather than a real simulation, which takes all the load off the cpu game sim. I imagine that'd be much less friendly for mobile board games but is far better for separate-service or online ai