---
title: "so muzero normally implies a single vector hidden state to another single vetor hidden state"
date: 2025-07-31 17:57:32
author: "qazzquimby"
---

💭 so muzero normally implies a single vector hidden state to another single vetor hidden state and obviously no simulator.
On the surface that looks flatly incompatible with both dynamic policy solutions we have, simulator powered and action-tokens.
Edit: Short version is just use seq2seq transformers for the dynamics model to predict the encoded tokens for the next resulting state.

Assume the only real requirement for predicting value is a state vector, possibly a game-token.
Assume the requirement for predicting policy is a sequence of encoded action tokens.
Assume the requirement for the dyanmics model next-state-prediction is a sufficient encoding of the entire state.

The first iteration of muzero can of course encode the actions and state tokens to get all of the above. Later iterations have no simulator so they need to get the above from the dynamics model.
The dynamics model needs an encoding of the state which could or could not be a token sequence. In fact, the entire state handling could be compressed to a single vector if that performs well, since without a simulator powered policy we don't normally use their encoded forms. I'll refer to it as a sequence assuming squashing doesn't perform well.
Then need a seq2seq from the previous encoded state (but not legal moves I think) to a new encoded state with legal moves. Important, we need to know which tokens belong to certain categories (state token, action token, game token) somehow, so seems like it might be a group of seq2seqs.
That seems like it solves it.