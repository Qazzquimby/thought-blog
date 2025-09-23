---
title: "is it maybe useful for muzero to act like its in a continuous space and"
date: 2025-09-23 17:09:46
author: "qazzquimby"
---

💭 is it maybe useful for muzero to act like it's in a continuous space and raise the level of abstraction arbitrarily past the game system's definition of action? Eg if you had a move of 1 on a grid you want to check each destination as a sim fork. But if you scale down the grid size to be a tiny mesh and give you a speed of a billion you'd no longer want to think of every possible movement as a possible action (unless you have some fantastic filtering process). More likely you'd want to sort of cluster them like "this area is in cover and near the door" or "this area doesn't rely on moving past the window" and sample from each cluster, or otherwise sample evenly over the action space, building up a pattern of what leads to a good sample