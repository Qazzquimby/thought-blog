---
title: "💭 'lets try some alphazero performance improvements to see if I can make hardware less..."
date: 2025-04-13 04:34:10
author: "qazzquimby"
---

💭 'lets try some alphazero performance improvements to see if I can make hardware less of a concern' turns into 5 or so days deep in rearranging very large and delicate systems. First two approaches died under their own weight and difficulty to debug. Third approach which didn't become an unsolvable mess was my design rather than gemini's, so I'm good for something. In short
- Want to batch calls to the gpu. Gpu is called when an mcts search needs to have a state evaluated.
- You could have one game and have it ask for a state eval, then search other places until it gets the answer, but thats actually terrible because its forcing a tonne of exploration when mcts may want to exploit instead.
- So rather than that you run many games in parallel, play each of them till they have a question for the gpu, collect all those questions and feed the answers back in
- you also reuse the mcts tree so if its on a well explored branch it doesn't have to recompute
- and you stop early when there is high confidence you know the right move. Extra sims are largely wasted at that point which makes generating self play take longer
- and you split up the self play into multiprocessing workers so I can use my multiple cpu cores.

In the end its annoyingly hard to tell exactly how much faster it is because the system is so transformed and the multiprocessing makes profiling and logging complicated. I sort of don't want to know in case it wasn't an improvement.