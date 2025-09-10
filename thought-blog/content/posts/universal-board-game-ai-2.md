---
title: "Universal Board Game AI - Ch. 2: How Dominion got Solved"
date: 2025-04-18 00:00:00
author: "qazzquimby"
type: "rumination"
---

# Toward Universal Board Game AI
# Ch 2. How Dominion got Solved

> Wherein the author hoots and jibbers excitedly.

In the [first chapter](https://thoughts.toren.dev/blog/universal-board-game-ai-1/) I explained how we can make an AI for any game that loosely resembles chess, even long games with many possible moves that'd be extremely expensive to explore. You can also make AI for games with hidden info and randomness (like card games) with some techniques I'll mention.

This still left an enormous gap between those sorts of games, and modern board games with heaps of components and expansions and cards with unique abilities. Good luck fitting those into the simple fixed-size input-output model we talked about last chapter. Most modern games skip AI, or make a quite bad AI, so (as far as I know) the Dominion app broke a lot of ground.

## You keep saying dominion. What's dominion.
Everyone starts with a bad deck of cards and improves their deck over time. There are over 800 cards, and they can do all kinds of things and interact with each other. Some cards are only good in combination, or only good at the end of the game. Which cards are available varies between games, so a card that's great in one game might be unhelpful in another. You can play many cards on one turn, and many cards cause players to make choices.

So we need
- To be capable of long term planning and to quickly narrowing down many choices (we want *AlphaZero*, covered last chapter)
- To be able to handle hidden information and randomness (Not new or crazy, just makes things complicated so I left it out of chapter 1. I'll gloss over it.)
- To efficiently learn hundreds of cards (using a technique called *Embeddings*)
- To somehow encode the highly varied state into a model for AlphaZero to predict with (using *Transformer architecture*, relatively new and most notably used in language models)
- And to somehow get pretty much any arbitrary choice out of that model. No longer can you say there is some fixed number of possible legal moves, like 9 in tic-tac-toe. A card could ask you to choose literally anything from naming a number for an auction or picking two cards from hand or choosing what order to trigger effects in, etc. (a bizarre solution)

For the rest of the post, I'll talk about these in order. I'll be brief!

> Credit due: I'm only able to write about how the Dominion AI works (rather than scratch my head, slack jawed) because amazingly, [they publicly explained how they made it](https://www.templegatesgames.com/dominion-ai/), and patiently answered many of my questions about the parts they didn't cover.

## Hidden Info and Randomness
Technically those are separate but they come up together a lot - like a shuffled deck of cards. Both problems have been solved for a long time, but I left them out of chapter 1 because they make MCTS weirder.

One key thing is that a state + an action no longer leads to a single following state. If you play top left in tic-tac-toe the result is always the original board plus your piece in that box. If you draw a card or roll a die there's a range of possible results. No longer can we see the MCTS tree as a state connected by actions to other states - now each action can lead to a number of following states and we only learn which it is by running the game simulator and rolling that virtual die.

Hidden info is quite related. Anything that's unknown gets shuffled before the simulation so that you're able to draw a random card. For AlphaZero, this does mean we need some way to signify "face down card" which is another little wrinkle.

> Information Leaking: If you didn't randomize something that should be hidden, the MCTS simulations would use the real information, and the AI would end up cheating since the action scores are based on information it shouldn't be able to see. 

> Note that much of the time, hidden info is not actually random! While your deck of cards is probably random, your opponent's hand is a product of all the actions they've taken and their own strategy. Getting a more accurate distribution of what the hidden state could be is a rabbithole of a problem, and it means that games based on opponent-prediction or bluffing are particularly challenging.

## How to Learn Many Cards Efficiently
The machine learning model needs to map parts of the input, like "black pawn" onto a list of numbers it can use later for the prediction. You can think of that list of numbers as being a way of representing the 'meaning' of the input - everything that helps it score well during training will be represented, but it's quite hard for a human to tell what the numbers mean.

Chess has two colors times six types for a total of twelve piece inputs to map - but Dominion has hundreds of cards, and that first step of mapping each card in play from its ID number to its meaning gets to be slow and expensive. Embeddings are just a way of saving those mappings into a quick lookup table, like a dictionary.

> LLMs also use embeddings, to map words to their meanings.


## How to Represent Extremely Diverse States
This is where it starts getting well outside of the "simple game" assumptions I made in chapter 1.
Traditional machine learning models take a fixed-sized list of numbers and train weights to work with each slot in the list. If the top left tic-tac-toe square is slot 0 and top center is 1, it'll learn the relationship between them from the weights tied to those slots. This relies on the game being fully represented with a fixed list like that, where each slot always represents the same thing.

In Dominion, you have a variable number of players, with a variable-sized deck, hand, and discard pile. The center of the table has a variable number of piles with variable numbers of cards in them. Also you can have any number of many kinds of tokens on things. Extremely awkward to try to have a fixed index for everything.

Dominion handles this with Transformers, which is a rather new and exciting machine learning technique that's also used by language models to understand natural text (words are similarly not organized into fixed slots).

I don't want to make this long and technical or need to find pictures, so I'll leave you with an incomplete but hopefully compelling gesture at the technique.

*Very short version*: Split the content into a variable length list of parts. Each part is fixed-size, so each pair of parts can do normal fixed-size machine learning with each other. Every part updates every other part, many times, so that eventually each part is affected by the important context from the rest of the game. If a card is usually good, but another card is available which counters it, after the context updates the card won't look so good anymore.

*Less short but hopefully tolerable*:
Rather than the entire input being a fixed-size list of numbers representing the entire current game position, you can split the game up into individual parts, called "tokens", and make a list of numbers for each. This is far, far more flexible.

You can have different kinds of tokens, and different kinds can have different lengths.
Dominion makes a token for every card (with information like the card's ID, location, any counters on it, etc), as well as a token for each player (how many victory point tokens they have, etc), and one token for "the game" for any global information.
Trainable machine-learning math converts all these to be same-length lists representing the token's 'meaning'.

Now since all the tokens have fixed-size, every token can use the same trainable parameters to combine their value with every other token. Based on the token's values the weights figure out if they're relevant to each other, and how they affect each other. The output is another list of tokens that has been contextualized by the rest. In a language model, the word "basket" preceding the word "ball" dramatically changes the meaning. In Dominion, it can spot synergies or counters this way.

So Dominion makes a card token for every card anywhere in the game, it makes a long list of numbers containing the card's Embedding (see above), its location, how many tokens of each type it has, etc. Then every card updates every other card in several rounds. At the end there is still one token for each card, but now the numbers have been updated to contain everything the policy and value outputs need.

Dominion also makes a token for each player and a token for "the game itself" which are kept in the same list. The "game" token is machine learning mapped to a single number, and that's the Value output.

> Why is the game token able to predict how good the board position is? Why does any of this work, in general?
> I glossed over how machine learning works in chapter 1. Briefly, it starts by not working at all. The math is full of many numbers called parameters, which start off random and useless. 
> You run the model on example data where you already know the correct answer, and measure how terrible a job it's doing, and use some calculus to figure out for every parameter in the math, how that parameter should be adjusted to make the answer better. You fiddle slightly with every knob, and try again with another example where you know the answer, and repeat until the knobs are very well fiddled and the pile of math does a good job.

## But what about the Policy output??
This is the most boggling part of the implementation.
For simple games, there's a fixed number of actions at any stage in the game, and you just give them a score. Dominion cards can give totally arbitrary choices like "choose two (of the unknown count) of cards from your hand to discard." Trying to imagine how this could be done was the most hair-tugging, floor-pacing part of the investigation.

When you're at a choice point, and you need the new policy:
Input the state into the transformer architecture, as described above, and save the output tokens. The model does not output a policy itself, because it has no idea what the legal actions are. The legal actions could be anything, so there's no fixed size list that could evaluate them.

But the code for the game rules does know the legal actions (it'd have to, to run the game).
So, rather than the machine learning model outputting the policy directly, the game code goes through each legal move, and asks another separate machine learning model specifically for evaluating a single possible action. 

The first model took the game state, and output a processed version of the state where each card was updated from context, which was also used to get the Value. The Policy Model is a second model which uses some of the outputs from the first model, based on what the game code decides is necessary. I think this is a pretty bizarre architecture - you could see it like a model with traditional code running in the middle.

The game code gives the Policy Model the relevant cards from the first model, now updated with context, and it outputs values for different "verbs" in the game, like "discard", "play", "draw" - actually a very long list.

For example, if the legal action to evaluate is "Buy a Village", it'd take the context-updated token representing the top Village card for sale, and pass it to the model. The model returns a list of numbers for different verbs, and the code checks the output for "Buy" for the input card "Village", and that's how good it is for you to buy a village right now.
Every legal move is scored that way, individual and bespoke for the type of action, and eventually you have a full policy for each legal move.

> Frankly there are many edge cases that don't fit nicely into "noun-verb", and the full system is a lot more gnarly than I'm making it sound, but it does work.

---

So ~superhuman AI was made for a game that looked impossible to make an AI for. Dominion definitely isn't the hardest game to solve, but it's up there.
At the end of Chapter 1 we were able to solve anything that vaguely resembled checkers, all at once with the same techniques.
So can we now solve basically every game? Could I make it easy to get a powerful AI for any game from just its rules?
Wow, find out in the next chapter. (Coming later)
