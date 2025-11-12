---
title: "symmetry handling is a pain  A game needs to define in which ways its zones"
date: 2025-11-12 18:13:09
author: "qazzquimby"
---

💭 symmetry handling is a pain. A game needs to define in which ways it's zones are symmetrical, eg chess is symmetrical only horizontally.

I'm pretty confident there's no way to avoid actually transforming the state into each symmetrical form and checking for equality, which is a lot of overhead to be doing at *each step*.

Games with multiple zones need to handle their symmetries separately lest the number of possible symmetries scale multiplicatively (eg a you have a board which is symmetrical by any reflection+rotation and each player has an unordered set of piles of tokens which the game refers to by index)

You don't want to *actually* transform the board to its canonical form, so even you calculate the canonical hash, go to the already created node studying that position, but need to be able to produce the original board. Similarly, the legal moves from the canon position are transformed versions of the actual legal moves. D:

It's preferable for the AI to just not consider moves that lead to symmetrical positions (though I think it may be isomorphic to perfectly handling symmetry in-tree) but I'm pretty sure you can't automatically know which moves will lead to symmetrical positions prior to simulation. My existing works have manually avoided symmetrical moves in cases where it's easy to program, but that's added game scripter responsibility.

In some circumstances symmetry handling is hugely important (AI has 100 coppers in their hand and is trying to figure out what order to play them) while in other cases symmetry will virtually never occur (chess, I think) and it's potentially a pretty expensive and complicating system.