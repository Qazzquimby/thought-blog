---
title: "I keep redesigning muzero and then realizing my new plan doesnt actually make sense
Id just"
date: 2025-11-29 19:22:36
author: "qazzquimby"
---

💭 I keep redesigning muzero and then realizing my new plan doesnt actually make sense
I'd just been confident that inner nodes could make a single sample of successor states to MCTS over, but that highly favors high variance states because if you don't make stochasticity an additional after-choosing-action step then you can just choose the actions where you've deterministically decided the luck was good? Edit no, the sampler would learn to produce 'average' states, which don't represent any actual states, like drawing an average of all possible card vectors. I assume that such loss of fidelity would limit the usefulness of inner node exploration?

My first approach was least magical so I should take that as a baseline

Every node, root and inner, uses input action vectors, and the state vector + action makes a sampler for the next child.
Root node also has a sampler to go from observed to actual state, which I'm pretty sure I dont need for inner nodes.
Raises difficult question of how to get the action inputs for the inner states since you dont have game rules to generate them, which I did with some token generation. Measuring the loss of generated actions to actual actions in that state in the game history was expensive, a hard thing to train, though maybe I just did it badly.

So idea was to do away with that and not need actual action vectors in the inner nodes, just generate successors directly, with dummy actions leading to them. 
But for muzero to work it needs to be able to choose between actions. If each action has one successor it assumes no stochasticity, problem given in first paragraph.
But if the successor is *sampled* without taking an action how would you even differentiate the different edge samplers. Cant sample a sampler I think partly because all you have to train on is the actual successor state.