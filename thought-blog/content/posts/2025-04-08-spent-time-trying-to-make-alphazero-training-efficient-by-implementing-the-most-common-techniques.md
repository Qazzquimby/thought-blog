---
title: "💭 spent time trying to make alphazero training efficient by implementing the most common techniques...."
date: 2025-04-08 07:58:33
author: "qazzquimby"
---

💭 spent time trying to make alphazero training efficient by implementing the most common techniques. Running many parallel games on a single thread and interrupting the tree search to build a batch of network requests and then plugging the responses back into the tree search and handling the end results as they arrive. Turns out that's difficult. Rapidly losing interest