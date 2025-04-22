---
title: "Rumination: Universal AI"
date: 2025-04-18 00:00:00
author: "qazzquimby"
---

# Universal Game AI

I play against the AI on the Dominion app most days, and it beats me around 80% of the time despite me playing for years. That's fantastic. You get the benefit of a high level playing group, always available, faster than a human opponent would play. With access to AI like this, a game developer could see the game balance and optimal strategies automatically. It also gives me an exciting feeling of technological victory over the world. Achieving that kind of AI is very hard, and I'm going to write about it.

# Chapter 1: Simple Games
`Wherein the author dumps a great deal of context necessary to understand his upcoming Main Point.`

It's a bit rude to call chess or go "simple games", but I'll do it anyway because I'm comparing them with things like Magic the Gathering (~30k cards, absurd interactions).
I don't mean that these games are easy, or lack depth, or don't take a lifetime to master; By simple games, I'm gesturing towards games with
- Consistent and constrained rules and shape. Chess doesn't suddenly get a DLC adding portals or weather.
- Consistent and constrained action spaces. TicTacToe and go have one possible action per space, and chess has 64x64, for every start and end point. In a lot of modern board games, particularly games with cards, you could be making any arbitrary choice between arbitrary changes to the game state.

Simple game AI is pretty much taken care of! 

## TicTacToe and a Game Tree
A superhuman TicTacToe AI isn't much fun, but imagine you wanted to make one anyway. TicTacToe starts with 9 possible actions, then 8 responses to each of those actions, then 7 responses, etc, in a big tree. 9x8x7x6x5x4x3x2x1 makes about 360k total states, which is frankly not that much for a computer. On every turn, the AI could easily look at every possible course of action and every possible counteraction until every possible ending state, and pick one that's most beneficial. In other words, if there exists any path by which the AI can guarantee a victory (or more likely a draw...), it will take it.
That alternating between thinking what you should do, and thinking how the opponent should respond (and how you should respond to that, and so on) is general architecture between game AI. There are all kinds of different versions, but at their heart that's what they're doing.


## Connect4 and Monte Carlo Tree Search
TicTacToe sucks though, lets play something else. Connect4 looks similar on the surface, and it doesn't look terribly difficult but instead of a state-tree of 9x8x7x... it's more like 7x7x7x7x... for maybe 35 turns. That comes out to about "38" followed by 28 "0"s, or 380 billion billion billion. That rules out brute forcing the whole game like TicTacToe, so what can be done?
We still want a tree to give us a sense of which actions lead to good outcomes, but now we have to build the tree efficiently. After some seconds our human opponent will get impatient, so we have a limited number of tree-building-steps to work with.
What makes a useful tree?
- If there's a good move nearby, we want to take it, so we want to explore all the nearby game states somewhat to find out what's promising. If there's a winning move available and we never look at it, we throw the win away. Think of this as wanting to *explore* actions to find out what's good.
- The moves that look more promising are the ones more likely to be chosen in the end, so we get more value from exploring them further. We take a good looking action, the opponent takes a good looking counter-action. Exploring an unpromising action is less likely to change our decision, so they can get less attention. Think of this as *exploiting* actions we already think are good.

### Monte Carlo Tree Search
Fortunately there's a very popular and powerful algorithm for this, *Monte Carlo Tree Search* (MCTS to save my fingers). Every time it has to choose an action branch on the tree to explore, it gives every option a score based on "how much has this action been ignored compared to the other actions at this state" (preferring *exploring*) + "how much has this action lead to good outcomes the current player at this state" (preferring *exploiting*).

But how does MCTS know which actions are good? Obviously if a move wins you the game it's a good move, but earlier in the game a win might be many turns away.
There's no easy answer to this! If you could perfectly tell how good any game state was just by looking at it, you could just look at every action from your current position, and take the one that leads to the best state. Instead we have to lean on rough estimates.
- The "Monte Carlo" part is alluding to randomness because casinos I guess, and the default solution proposed with the algorithm was "random rollouts" where you figure out how good a state is by having both players play randomly until someone wins. That kind of works because the player closer to winning will hopefully be more likely to win randomly, but its very noisy and slow.
- You could also hand write some code to estimate, like in connect4 having 3-in-a-rows is good and your opponent having them is bad. You could probably write a pretty good estimate if you're an expert and have time to experiment, but that's hard.
- *Machine learning* which I'll get to later under "Alphazero"

So you repeatedly pick a part of the tree to expand move based on how under-explored it looks and how promising that part of the tree looks. Eventually you run out of time and you pick the move that's currently most promising! Even with random rollouts that'll make a decent connect4 AI right there, and you can always wait longer to give it more simulation time.

> I think I won't write a new section for chess because it branches off away from the destination I'm writing towards, but in short, powerful chess engines:
- A similar algorithm for tree expansion called minimax with different details
- Really good board evaluation estimates, which more recently added machine learning
- Really efficient game handling to make the simulations fast

## Go and AlphaGo

So you're feeling pretty good, thinking you've got a nice general MCTS game player. You can plug in checkers, othello, pretty much any 'simple' game you can think of. You could even modify it to handle games with random elements with some work.
Go is basically just one of those games with a really big board, so it seems like it should work. It does not.
MCTS was able to do okay on connect4 with 7 possible actions per turn and maybe 35 turns.
Go has a 19x19 board (361 spaces) and the game usually lasts ~200 turns, so that's around uh... "1" followed by 768 "0"s total tree size. It's pretty hard to fathom how large that number is. MCTS is cooked. 
- In the time connect4 MCTS could try every action, then every counter-action to each of those, and every counter-counter-action to each of those, go MCTS would have only tried each square once, so MCTS can't explore effectively without burning out its sim budget.
- The default solution of random rollouts is pretty awful in MCTS. It'll take ages to get to the end of the game, and the enormous board is mostly made up of dumb moves. Without decent value estimates, MCTS can't exploit effectively.
Basically looks impossible, but you probably know it was already solved by google a while ago.

### Machine Learning
This is where the machine learning comes in. Machine learning makes a mathematical formula to map some input to some output, like photos to "is cat"/"is dog" labels. Inside the formula are many adjustable parameters, which start off random, causing random output. Using a bit of calculus it's possible to not only see how wrong the formula's answer is, but how all of those parameters should be changed so it would do better. Run that long enough with enough examples and eventually the formula stops outputting garbage and starts being useful.
Machine learning models usually want a fixed-size list of numbers as an input, and another fixed-size list of numbers as an output, and in between it does various transformations usually involving more fixed-size lists of numbers.

In this case we want the machine learning model to help MCTS play go. For now, let's imagine we already have an enormous mountain of expert play data for the model to learn from.

The input is going to be a list of 361 numbers, like the board flattened into a line. Maybe -1 for black and +1 for white and 0 for empty. Normally flattening the board would lose all the row/column information, but you could have the architecture inside the model understand it like a grid, so it's okay.

What do we want the output to be?
### Value
For one thing, we want to get the value of the board state, because rollouts aren't going to work here. The value estimate is just a single number, so we can add a single number output to the end of the machine learning model with 1 for "black wins" and 0 for "white wins", which we can use in MCTS to see if the board is good for the current player. Initially it just gives out random values anywhere from 0 to 1, but we can train it on the boards in our data mountain.
Say for a given board It outputs 0.31 as its prediction randomly, when the correct answer is 1, because black won. The model is then updated so that for boards like that one it'd give an answer closer to 1. We want many small nudges, because we don't want it to just memorize which states states black won after - we want it to have a deep nuanced understanding what situations lead to black winning.
So now we can plug that value estimate into MCTS and after it explores a state it can ask the model for the value estimate to guide future exploitation. This is tonnes faster and more accurate than a rollout. MCTS goes from "blind until it gets to the endgame" to able to see the consequences of its moves.

### Policy
But actually that's still not good enough! In order to check the value, you need to spend a simulation exploring that action to see the result. The go board is so large that there just isn't time to be checking everything. With the machine learning value estimate we can tell when a simulation wasn't helpful, but we only see that after doing the simulation.
If only MCTS could tell how good an action looked *before* simulating it.
Head back to our machine learning model, and add a second output (yes you can do that), this time representing "at a given state, which action should I take?" or more precisely "what action would an expert from our data mountain take in this state?" This is called the *policy*.
> That may sound weird, because if this model learned to predict perfectly, we wouldn't even need MCTS anymore to play at expert level! It'd be very hard for it to get that good though, so instead its used as an estimate to guide MCTS.

The output will be a list of 361 numbers, one for every possible action. Again it starts by outputting largely random numbers like [0.14, 0.85...] , when the correct answer is all '0's except for a single '1' representing the action the expert actually took. The model is adjusted so that the number in the slot where the correct answer is 1 gets closer to 1, and all the others get closer to 0. What matters is that after training, the good actions have larger outputs than the bad actions. Imagine there are 3 equally good actions and the rest are terrible: after much training we'd expect the good actions to return just under 0.33 each (since they'd have been picked by the expert about 1/3 of the time each), and the others to be close to 0.

> You might think the output could be a single number, rather than 361. It could output 5 for the 5th space or something. The problem is that would put all the actions on the same spectrum in an troublesome way. If both action 1 and 3 were often picked by the experts, the output might average to 2. Gross.

Okay so now when MCTS is picking which action to look into, in addition to using its explore + exploit score, it can also add in the machine learning model's recommendation. Now instead of every unvisited action having the same score, it already has a sense of which of them are more worth exploring, and it can jump right into exploring the better parts.


So if the model learns well, and you have a powerful policy and value prediction, MCTS can race through even enormous space's like go's board. The policy lets it waste much less time evaluating bad actions, and the value gives it a much clearer view of which path's its exploring are worth more attention. Neat.


But that all relied on an extremely convenient mountain of expert data. What do you do if you're not so lucky?

## AlphaZero
I think this one will be shorter?
We already have our enhanced MCTS framework, and we just need to replace where we get the data from. We don't have experts anymore. We need to learn expert play in a cave with a box of scraps.
Our AI needs to be the expert which it learns from.

Start off with the model stupid, but skip the step where you train the model. Take your stupid-model-enhanced MCTS and make two copies with fun names like `player_0` and `player_1`. Make them play against each other, terribly, and take notes. These are our experts.
After they've played for a while, train the machine learning model just like before, but using our self made data. The key thing is, this data is still better than nothing. The values from those games *do* give some indication for which states were good, and the policies (action choices) *do* show what the model chose after running many MCTS simulations. It won't learn to be an expert in one step, but it'll learn to be slightly less bad.

Then you get comfortable because google's superhuman AlphaZero go player was trained over millions of games spread out across many powerful processors, which I estimate might cost about 200k usd on rented infrastructure.

So that's dismal. I know a lot to be done on efficiency and compute is cheaper now, but not sure exactly how unaffordable AI training is now. The Dominion AI was trained somehow, possibly without spending a fortune. Lead in to chapter 2 where I talk about the Dominion AI.

