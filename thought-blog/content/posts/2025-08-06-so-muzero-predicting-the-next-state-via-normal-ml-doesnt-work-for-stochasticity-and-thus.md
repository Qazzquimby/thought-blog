---
title: "so muzero predicting the next state via normal ml doesnt work for stochasticity  and thus"
date: 2025-08-06 02:46:29
author: "qazzquimby"
---

💭 so muzero predicting the next state via normal ml doesnt work for stochasticity (and thus also hidden info)
Basically if you draw a card, the new state is as if you drew the average of all cards, because ml by default is predicting an avg best answer. What we need it so generate new data that looks exactly like it came out of the simulator.
I don't love any of the solutions I've seen to this, though I haven't looked that hard.

Maybe a GAN could do it?