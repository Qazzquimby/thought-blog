---
title: "Current way of avoiding sims and state copying for board game AI
Get game engine  get"
date: 2026-05-31 18:42:06
author: "qazzquimby"
---

💭 Current way of avoiding sims and state copying for board game AI
Get game engine, get a useful context object about the game state. For plausible usage of each ability make a features object of what effects it will have. People's new positions, healths, token counts. 
Have a variety of promptings of various llms create proposed relevant features written in eval-able code. Stuff like put your tank close to their sniper, or prefering using an ability on a specific target. 
I think there are a lot of simple ML ways to tune weights on the features, but I'm thinking of:
Have a variety of promptings of various llms create weights on those features (normalized somehow). Use that to make distributions of the probable value of each feature. Round robin tournament between those agents and use relative performance as loss to tune the weights.