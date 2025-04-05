---
title: "💭 environment sim. Rooms. Each room has connections to other rooms, entities, features. Each entity..."
date: 2025-04-05 20:35:06
author: "qazzquimby"
---

💭 environment sim. Rooms. Each room has connections to other rooms, entities, features. Each entity and feature had a brief explaining how it interacts with the world and its priority hierarchy, and has current attributes as point form notes (eg broken wing). Llm updates the room for one tick which can be variable length, logs the events, and updates the room state. Also updates messages to other rooms, such as passing an entity from one room to another, or fire spreading, etc, which are included as part of that room's next state.

Is this simple and powerful? Not sure where the pain is going to be but it seems pretty great. Complex entities like intelligent npcs could use subcalls. The update llm probably sees previous updates to prevent weird behavior like looping.