---
title: "how to efficiently get an ml model understanding a game state to be able to"
date: 2025-11-03 03:54:25
author: "qazzquimby"
---

💭 how to efficiently get an ml model understanding a game state to be able to work with with deck information. Traditionally you write a (potentially very complex) simulator handling the hidden info, but that doesn't scale.

If you just have a shuffled deck, yes you can simulate random draws.
Even simple manipulations like "I put card A 3 cards from the top" or "I shuffled the discard pile of these cards" makes a simulator complex to write.
If the opponent mulligans some cards, neither their hand or deck is now random, and the distribution of states describing them as now very expensive to compute.

So maybe you don't do that and you just use ml state prediction, but how do you make a model that'll be good at that?