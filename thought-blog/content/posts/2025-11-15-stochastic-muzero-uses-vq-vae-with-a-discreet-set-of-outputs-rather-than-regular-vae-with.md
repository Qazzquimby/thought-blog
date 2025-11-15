---
title: "Stochastic muzero uses vq-vae with a discreet set of outputs rather than regular vae with"
date: 2025-11-15 22:05:11
author: "qazzquimby"
---

💭 Stochastic muzero uses vq-vae with a discreet set of outputs rather than regular vae with a continuous output. Maybe that makes sense for games with smaller state spaces but doesn't make sense for eg mtg? Unsure, but reducing the expressivity of the state space sounds like a really bad idea when its supposed to be able to express basically any imaginable gamestate