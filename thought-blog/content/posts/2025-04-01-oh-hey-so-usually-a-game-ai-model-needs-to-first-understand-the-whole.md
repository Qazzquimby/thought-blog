---
title: "💭 oh hey so usually a game ai model needs to first understand the whole..."
date: 2025-04-01 17:37:00
author: "qazzquimby"
---

💭 oh hey so usually a game ai model needs to first understand the whole state and then use that to predict the policy and value. The policy part is normally an output for every possible move. Then you mask out which of the legal moves it liked best, ignoring all the illegal moves it mentioned. It might learn to put less attention to parts of the game state that aren't relevant to the legal moves. But if however the legal moves are calculated first and are made part of the input game state, then now the model can easily adjust its attention toward effectively choosing from only those moves. Imagine if the world is huge but the legal moves are only in one room - it could put much less attention outside the area that'd be affected.