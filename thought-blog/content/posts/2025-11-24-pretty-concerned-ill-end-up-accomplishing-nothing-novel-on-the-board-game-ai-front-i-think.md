---
title: "Pretty concerned Ill end up accomplishing  nothing novel on the board game ai front 
I think"
date: 2025-11-24 22:10:41
author: "qazzquimby"
---

💭 Pretty concerned I'll end up accomplishing ~nothing novel on the board game ai front.
I think so far none of my innovations have been demonstrated to be a good idea, and many parts have been shelved for scope. 

Currently working on:
- Given I already have lots of good connect4 data, train muzero on connect4.  Current plateaus at a 0% win rate. Currently grid searching variants to figure out if its a param problem, else will try redesigning some aspects.
- Train alphazero on gobblet, being similar but more complex than connect4.

Current status for my implementations:
- Can handle stochasticity
- Cannot yet handle hidden info (which is solved, so low prio for me, besides demonstrating my stuff isnt incompatible)
- Always uses actions as inputs, which is more efficient than separate action net for simple actions, and less efficient for factored actions. I think muzero could only take actions-as-inputs..?
- Have innovations to allow muzero to work with dynamic action space, with actions-as-inputs and dynamics network predicting actions for latent states. Not yet validated to work. Not converging well.
- Symmetry work always sounds doable and then brickwalls. Not priority though besides efficiency. A true generic ai system would definitely want automatic symmetry handling though.
- General board game engine rules usually seem doable and then brickwall. It's sometimes hard to even explain why it shouldn't be doable. I think short answer might be "literally everything must be an object include context at any level of abstraction." but I expect that doesn't cover everything
- Sparse graph handling in transformer is an important innovation which I just haven't gotten to yet given I'm gradually increasing game complexity and games that meaningfully need graph connections between tokens tend to be a step up in complexity. I think simplest case would be any game where you can have any number of entitites on/in/attached to a location or entity.