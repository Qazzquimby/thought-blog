---
title: "comparing gpt5  2 5pro  and 3pro on a very technical research question Im pretty familiar with"
date: 2025-11-19 22:29:20
author: "qazzquimby"
---

💭 comparing gpt5, 2.5pro, and 3pro on a very technical research question I'm pretty familiar with at this point (how to generate candidate actions for muzero in environments with dynamic action spaces)
They all do quite badly.

2.5 pro followed instructions better, gave the most likely to be useful solution (use a vae to generate a fixed number of actions, which could make sense if we also predict the number of actions to generate), and noted one of the errors it made earlier, framing it as a "downside" of the suggestion. 

3 pro for some reason thought that any action could be represented as a pair of two entities and built everything off of that. It redesigned muzero to support that in a way that'd be extremely expensive to compute and didn't mention that.

gpt5 was similar to 3, answered a lot more than asked for, and gave a solution with poor scaling, seemed to strategically not look for problems with the solution.

None of them came up with "just generate action vectors until you get a stop token" which seems like the obvious baseline, and all came up with answers with more buzzwords.