---
title: "💭 normally old self play data is discarded as low quality because it came from..."
date: 2025-04-01 16:59:21
author: "qazzquimby"
---

💭 normally old self play data is discarded as low quality because it came from a previous version of the model. Imagine if instead the model is periodically given an objective score (could base on win rate vs random, then win rate vs previously evaluated model) and attach that score to each move. Now rather than old play data being misleading because a move might lead to a win despite being terrible, it'd show that the move lead to a win in a low score game. If all that shows is "ignore this one" then it's pointless and you should just discard old data. If instead it's able to get a better sense of what moves are good or poor based on the score of the player, then it's a useful thing to do with masses of old data. In actual play the model would be trying to output moves that look very high score.