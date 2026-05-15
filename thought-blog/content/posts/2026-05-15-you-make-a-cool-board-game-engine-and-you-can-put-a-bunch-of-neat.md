---
title: "You make a cool board game engine and you can put a bunch of neat"
date: 2026-05-15 00:12:55
author: "qazzquimby"
---

You make a cool board game engine and you can put a bunch of neat abilities in it, 
then if you want board game AI
- you need very efficient deepcopying
- the game loops has the player perspective (input action -> next game state) as opposed to a game loop that sometimes requests input
- if you use random rollouts for state evaluation you're making many many more deepcopies and simulation steps for pretty weak eval. Like saving a valuable action for the right time wont be rewarded because random rollout wont use it at the right time.
- if you're using ml guidance like alphazero you need to be able to serialize any state, even mid action. Also either serialize any possible choice, or use the dominion ai's separated policy querying logic.


: C