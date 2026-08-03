---
title: "Universal Board Game AI - Ch. 3: The Failure Report"
date: 2026-08-03 00:00:00
author: "qazzquimby"
type: "rumination"
---

# Toward Universal Board Game AI
# Ch 3. The Failure Report

> Written a year after moving on to other projects, because I ought to write these things down.

See the [first](https://thoughts.toren.dev/blog/universal-board-game-ai-1/) and [second](https://thoughts.toren.dev/blog/universal-board-game-ai-2/) chapter for this to make any sense.

# Bad Writing Disclaimers

Please note this chapter will be worse than the previous because this is half friendly-explainer and half trying to preserve my work notes.

This post was intended to come out alongside my exciting advances in generalized board game ai, but instead it comes out alongside me taking a big break after getting burned out from lack of progress. Most of the meaningful work was done over a year ago now, and this is me trying to remember what ideas were potentially valuable so they aren't completely lost in my incomprehensible notebooks. Some of the ideas may have been correct, and simply implemented poorly. These things are really hard to code, so when it doesn't work that doesn't necessarily mean the plan was bad.

None of / very little of the below is my own original thought, even if some of them I hadn't heard of - there are so many papers I haven't read. The innovations, if any, would be in how they're assembled.

I probably explain some things poorly below, so if stuff isn't making sense, this is a fine time to stop reading, or ask an llm to explain better if you care to.

# Encoding Weird Game States

So my goal is to make Dominion-level ai for any game, and we know that AlphaZero can play any game if machine learning part and the montecarlo tree search (MCTS) part both work for the game. Those are both hard :( I'm pretty sure in the second chapter I talked briefly about setting up AlphaZero to handle randomness and hidden information and stuff. 

Simple games are usually pretty simple to convert into an input vector. Something like converting each tictactoe cell to a number to represent its content in a 9-length list. Dominion was able to handle everything as a single sequence of cards that reference their location and count each kind of token they might have. Some games could be even harder to represent though, like Spirit Island which has a varying board of lands containing various markers and adjacencies. For a truly general representation, you'd need a graph structure, where elements can reference each other.
A transformer doesn't typically do that - the algorithm figures out how relevant things are to each other by their value, while here we'd want to specifically say "there is a connection between these two elements" (like adjacency) and maybe put some information describing that connection. Dominion got away with just one token type, cards, while I expect that wouldn't scale to any game.

It turns out, that by my reckoning, designing the transformer input for a complex game, maps onto designing a relational database schema for the same information. *Fun!* You can skip the rest of this paragraph. Essentially you have one table per token type. If a relational db could avoid making something its own table, you can avoid making it its own token. If a table column would reference another table column by ID then you want graph adjacency attention modification applied on the transformer. Many to many relationships probably don't need a mapping token if attention modification is doing that job. This means that the game designer could write a schema once and use it for both state storage and tokenization. Note that sql is not fast enough for rapid MCTS simulation, nor is it always very ergonomic.

A remaining issue though is symmetry handling. Technically you don't need it, but I'd sure like it. A tic tac toe board is meaningfully identical if you rotate it any amount or flip it, but the input to the ml looks entirely different and learning what to do in one rotation wouldn't be much help in playing in another. It makes training slower than it could be. Connect4 is symmetrical only by horizontal rotation. A hand of cards is unordered and accidentally treating it as ordered could make understanding it much harder as different orders are learned differently. Some number can't be lower than 0 while another can. Some collection has a maximum length while another doesn't. Complex datasets are full of important qualities relevant to efficient training, that we'd want to translate from the game definition to the model generation. I found this got to be quite a headache.

## MuZero
Hopefully you read the previous posts and remember AlphaZero. Play games badly at first. Study the game logs to gradually learn to predict which moves are worth exploring and how good a board position is. Use that to inform Monte Carlo Tree Search to evaluate your possible plays and counterplays very efficiently.

Well there's a nuanced issue with AlphaZero. When MCTS is simulating, it makes a copy of the gamestate, plays a move on that copy, and looks at the resulting state to evaluate and make more copies to try more moves.
What if you can't? What if you don't have the code for the game you're playing, so you can input your real move, but you can't make a clone of the system to run experiments on?
Or what if making a copy of the state and simulating an action is slow? MCTS really needs to make many many simulations to get a reasonable estimate. An inefficient game with a complex state could copy+simulate too slow for good performance even if everything else is done right. 

Enter MuZero, which simulates the game ""in its head"" by ""imagining"" the result of its play. It just keeps getting more complicated.
So while the Transformer AlphaZero described last post goes
1. Use policy and MCTS tree to pick the next board state and action
2. Copy the board and play the action on it to get a new board state
3. Tokenize the board state so we can input it to the machine learning model
4. Receive the policy and value of the new state.
5. Ask the game engine what the legal moves are at that new state, for future selection.

MuZero is weirder. The theme is that wherever we don't have access to hard data anymore, we instead use machine learning to predict a list of approximate numbers which hopefully have the information we need, very similarly to predicting the policy and value in alphazero.
On the first simulation step we do start with the actual board state, and we tokenize it and pass it to machine learning as usual.
For all the later steps, we won't have a real state since there's no game code to give it to us. Instead we make a new bit of machine learning that takes a vector (list of numbers) approximately representing the game state, and an action input, and creates a new list of numbers representing the new state. Essentially it's learning to approximate the game code.
It then uses that "latent" state representation to predict the policy and value, and runs MCTS that way.

My plan currently has the entire state reduced to one vector, rather than being a series of tokens like the input state. This does seem like a massive loss of information and is pretty concerning. My reasoning was
- Trying to predict a meaningful sequence of tokens for the next state is very slow to generate and score in training.
- It could be spending a huge amount of effort trying to accurately predict tokens that don't matter much
- It doesn't play well at all with the hidden information and randomness stuff I'll talk about later.
- Dominion Alphazero calculates state value from a reduction of the state to a single vector, so it can't be that bad?
Still, times like this caused me to question if MuZero was the right path, and I'd have a pros and cons debate before again deciding that AlphaZero's dependence on ML friendly super efficient code made it too hard to make broadly useful.

To recap, normal MuZero makes a vector for the gamestate and predicts vectors for subsequent states, and eventually it learns to predict useful vectors and meaningfully simulate the game ""in its head."" MuZero is typically used on pretty simple games and doesn't have to bother with transformer state or dynamic action spaces or other troubles - but since I'm targeting complex games, I do :)

# MuZero on complex games

You know how we've had all these troubles trying to make AlphaZero play with complex games, like Dominion last chapter? MuZero has all the same problems, plus more.

## Probabilistic Prediction
These concepts aren't exclusive to MuZero at all, but they came up a lot while working on it, so I'll explain them here.

Normally a model predicts a single value. If you were trying to predict the outcome of a 6 sided die roll, it'd eventually output 3.5, which is the least wrong guess it can make. However, if you roll a die, you'll notice it never turns up "3.5", so the model's behavior is entirely useless for predicting *actual* outcomes. So in our case, when we're generating our meaningful lists of numbers, we sometimes don't want it to generate the average, but instead generate possibilities.
The solution is instead of trying to generate the result directly, we generate a distribution (usually a bell curve) with an average and variance for every number in the list. Then we can sample a point from the bell curve. If I remember right, that's a Variational Auto Encoder or VAE, though that seems like an awful name. There's also a VQVAE that's specifically for predicting non-continuous values, like die rolls. Note that this is a fuzzy representation of a specific thing, so don't think "die roll was a 2" so much as a psychedelic dreamscape imagining which is trained to suggest 2ishness. That's always the case, but I think it's more pronounced when you're randomly sampling.

So now you have a distribution that can give you a new output every time you sample from it. Sometimes that's too much, because in MCTS you need to visit the same state nodes multiple times to meaningfully explore them, which won't happen if you keep generating new states.
Really simple solution, only make a new sample when the existing samples have been sufficiently looked at, and gradually make fewer samples since they gradually get more redundant. It's called progressive widening.

### Using VAEs for HIDDEN INFO!

I mentioned in [chapter 2](https://thoughts.toren.dev/blog/universal-board-game-ai-2/) that AlphaZero handles hidden info with custom logic to eg shuffle decks and face down cards. 

>I glossed over that that's kind of awful to write for any complex game, and quickly loses any nuance. For example, if a player draws 10 cards to their hand and then discards 8 of them, their hand is not just random, it's the result of their choices. To get a 'realistic' random board state would involve shuffling the starting position of the game, and intelligently simulating all players along timelines that match observations we've made (eg on turn 2, opponent played X) until we get to the current state. Obviously that'd be insanely expensive so we have bad samples instead.
 
MuZero can skip that with its signature move "use machine learning for everything". Instead of having a single starting state, make a starting-state-vae and sample possible-true-states from it. I forget how exactly I trained that, but at least we know it should predict the true state from the observed state. 
This is a lot easier than AlphaZero's method. You can still potentially leak information, but there are fewer ways it can go wrong.

### Using VAEs for STOCHASTICITY!

When predicting a next state, we also want to sample a distribution. This handles both any random element, and any hidden info in the new state. When there isn't any randomness or hidden info to handle it should eventually learn to always sample the same thing. It's of course better to only do such sampling when necessary, though that may be hard to determine and probably not feasible past the root state when we're going from latent state to latent state.

## Predicting Legal Actions

Existing MuZero implementations I've seen all assume simple games with pre-defined action sets (which of the 9 spaces in tic tac toe, which direction to move in pacman, etc), which as we've covered we cannot assume for more complex games.
This is a big problem for MuZero. Normally MuZero outputs a policy over a predefined action space.
The Dominion method with custom code per action is impossible with no simulator.
I used a different way of handling policy for AlphaZero (which I may have not mentioned before?), where each action is a token along with the state tokens, and the transformer encoder on the actions is used to determine the policy. This is yet another token type adding complexity, but is doable (I think? While writing this I find it hard to imagine this scaling up to really arbitrary choices). Simple games tend to have easily encoded actions like (startx, endx, starty, endy) for an action in chess, while arbitrary actions in complex games... will not.

Um, assuming action tokens does indeed work out, MuZero now needs to *generate* them, something MuZero normally doesn't need to do, given it normally assumes a fixed action space. This will be a variable length sequence generation. One way of doing that is to keep predicting actions until it generates a 'stop' token, or we decide its enough. This is yet another thing to train for. Note that the order of the actions shouldn't matter, which makes training a little more complicated.

# Misc notes
Bluffing is really important in some games - working with the opponent's information so that their play will be worse, like not revealing something important or acting in a misleading way. IIRC It's very hard to get AlphaZero to do that and more plausible for MuZero, though I don't remember the details.

The MuZero network I've mentioned is very complicated and needs to train a lot of different outputs. Sometimes an output doesn't *need* to be directly valued in training, because its value will affect other values which *are* valued. For example, for the policy and value outputs to be high, the state representation must be pretty good, so just valuing policy and value will eventually get you a good state representation. It might save time to directly value accuracy of the imagined state to the encoding of the corresponding actual state though, and maybe disable that later.

Speaking of, if you can, I think it's fastest to generate data first with pure MCTS, then use that data to train AlphaZero until its stronger than MCTS, then use *that* data to train MuZero until its stronger than AlphaZero. The ML parts start off as absolutely useless and only improve from having good data, so you could spend a very long time fumbling in the dark if you start with an ML focused system.

There's a frequent conflict between needing the code to be very fast (because a faster AI can essentially think longer, running more sims), and making things easier on the game developer. The hope is "easy AI for any board game you code" and that's lost if you add "so long as you write it this specific and painful way."

It's not terribly hard to rent out a bunch of cheap cloud computers to generate training data, though if you need much GPU that makes it more expensive.

# Closing

I like making things, and they take time. This was a problem I was happy to bang my head against month after month after month. Eventually I took an outside view and saw the opportunity cost, all the other things I could be working on, and made myself stop despite my stubbornness. If you happen to be a programmer and work on this initiative, I'd be happy to hear from you at `torendarby at gmail dot com`.