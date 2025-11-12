---
title: "not sure if I already wrote this
obviously being able to make ai for very complex"
date: 2025-09-27 05:46:43
author: "qazzquimby"
---

💭 not sure if I already wrote this
obviously being able to make ai for very complex games is good.
but any improvement over existing game ais is also good.
Imagine you have a standard simple rules based ai. Rather than being a total flowchart, it could reduce the action space to 4-12ish possible moves, maybe combining and abstracting actions, like "move to and attack nearest [unit]".
The transformer based state reduction I'm working with would pretty efficiently be able to score those options, and it could maybe seem a lot smarter than should otherwise be possible. You could do only a single state encoding to choose all the ai controlled character's choices if they don't have separate hidden info, which should be very performant