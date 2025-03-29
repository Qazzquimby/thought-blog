---
title: "💭 subject will now change to teaching myself more about board game ai as I..."
date: 2025-03-29 06:42:26
author: "qazzquimby"
---

💭 subject will now change to teaching myself more about board game ai as I focus on that for a while.

What I currently have is standard alphazero. Things to look into:

- muzero: Apparently it's equivalent in performance to alphazero but more general. I dont understand how it can be unless it takes more training since it learns the world model instead of using it. I'm somewhat confused if there's a point to using it when you have the world model (I have the game rules) but it appears to be the basis other things build off of. I don't quite get how mcts and gathering ground truth works with muzero works if it doesnt have access to the simulation, implying I'm misunderstanding something. I'm curious how muzero simulations work with rng, hidden info, and opponent info modeling, all of which are kind of painful.
- othello is a standard game game to learn and has standard opponents to get elo from. I should do that to get more objective results. Past results have been based on playing connect4 against it manually and seeing if I win 🙂
- there's new sota for sample efficiency (needing few training games to get good results). Efficientzero does a bunch of optimizations. Gumbel zero algorithms somehow choose policy more effectively. ReAnalyze I think does mcts at a step pretraining which somehow improves sample efficiency.
- There are a couple general RL models now like dreamerV3, though afaik they're not relevant in the specific domain of board games because they're not near sota.
- should learn anaconda I guess
- need to get a full understanding of transformers rather than a working understanding, or I'll probably not be able to fully utilize them.
- same gnn and graph transformers which might be key for representing arbitrary game schemas
- dominion app uses a novel policy vector system based on freezing the state and querying for noun verb preferences. I need to know exactly how that interacts with alphazero and prototype it.