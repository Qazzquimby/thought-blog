---
title: "Theoretical weaker mini alphazero that doesnt need MCTS at runtime
Train model to predict value based"
date: 2026-04-24 04:01:36
author: "qazzquimby"
---

💭 Theoretical weaker mini alphazero that doesn't need MCTS at runtime
Train model to predict value based on final game state
Each action has an embedding. You run action embedding + encoded context through a policy model to get a goodness score.
You train that policy model to predict how much the action will increase the value prediction.

It should be pretty bad compared to alphazero but is super light on resources and very flexible to weird action spaces