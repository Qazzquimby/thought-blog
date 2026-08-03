---
title: "- Could manually use a proxy for win rate such as opponent total health remaining"
date: 2026-06-14 16:14:50
author: "qazzquimby"
---

💭 
- Could manually use a proxy for win rate such as opponent total health remaining, though that's gutting the max power of the model
- Could train a value model off game logs. We already make features for action choices, but not for the gamestate itself. Also the value model wouldn't be useful during actual games, only as a proxy reward signal during weight tuning. Even worth it?
- If can intelligently limit list of plausible legal moves, could get an llm to pick (if it'd even do a good job) and use those as the 'correct' moves to train weights against.
- Could dramatically increase mutation variance or add temperature or something, but it'd only matter when priorities are near each other and would only give signal by very rarely swapping the winner.
- Could try to find a way to make llms good at this sort of game (by default they're awful) and just use llm players
- Could give up on non-simulation based game ai. I guess I could go back to mcts and maybe play the game only once with an enormous search tree, but id have to think about copy efficiency and nondeterministic nodes and hidden info handling and stuff again.