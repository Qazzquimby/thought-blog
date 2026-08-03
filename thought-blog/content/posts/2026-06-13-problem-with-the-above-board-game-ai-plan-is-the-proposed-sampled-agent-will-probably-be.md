---
title: "Problem with the above board game ai plan is the proposed sampled agent will probably be"
date: 2026-06-13 16:19:04
author: "qazzquimby"
---

💭 Problem with the above board game ai plan is the proposed/sampled agent will probably be awful in some respect, like it prefers using an attack so it hits itself when there's no enemy nearby. The only reward signal that matters is win rate which is extremely sparse, and tournament genetic algorithms as a tuning method is slow and largely only makes improvements by chance or by collapsing the population. A collapsed population causes less game diversrity which makes the win rate score mean even less since it becomes flatter.
So you can have a large population for many rounds of iteration and still end up with something pretty stupid at the end.
Not sure cost benefit of trying a different approach. Womp womp. Having an llm chose the action each turn is simple but doesn't scale when there are 100s+ options, in the way generated weights ideally should.