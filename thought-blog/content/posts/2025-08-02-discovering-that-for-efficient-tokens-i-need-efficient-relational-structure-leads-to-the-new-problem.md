---
title: "discovering that for efficient tokens I need efficient relational structure leads to the new problem"
date: 2025-08-02 23:11:25
author: "qazzquimby"
---

💭 discovering that for efficient tokens I need efficient relational structure leads to the new problem of "how can I turn an object oriented schema into a nice relational form" which is apparently an ancient question for which there is still no good answer. Converting to an ugly relational form isn't too hard I think but that's not very helpful? Regardless it'll involve a lot of type introspection and advanced type hinting. 

So either the game scripter would need to write their own serialization code (bad) or they'd need to handle all the data like sql while in memory (very weird) and probably write their own high level adapters like grids and decks.

Maybe I'm misunderstanding things.