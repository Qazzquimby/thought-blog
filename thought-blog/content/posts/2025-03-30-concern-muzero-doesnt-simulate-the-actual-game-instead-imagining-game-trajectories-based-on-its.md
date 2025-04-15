---
title: "💭 concern.
- Muzero doesn't simulate the actual game, instead imagining game trajectories based on its..."
date: 2025-03-30 19:00:29
author: "qazzquimby"
---

💭 concern.
- Muzero doesn't simulate the actual game, instead imagining game trajectories based on its learned dynamics model.
- My thinking on highly variable policy space is that the model needs to be fed the legal moves somehow so that it can weight them (versus the typical trying to weight every possible move). This would mean muzero would also need to learn the action space to play out its simulations? Seems especially incompatible with the split state/policy network idea used in the dominion app because that relies on actually calling game logic functions to query for preferences and combine into a final choice.