---
title: "💭 At this point my plan for handling arbitrary board games is
- represent the game..."
date: 2025-04-01 18:25:49
author: "qazzquimby"
---

💭 At this point my plan for handling arbitrary board games is
- represent the game state in a heterogenous graph. A graph that has different node and edge types..
- Use stochastic muzero with a graph transformer model with type aware attention
- Make the set of legal moves part of the game state rather than being a logical mask applied onto a fixed size policy vector. You just can't put complex board games' choice spaces into a fixed size vector.