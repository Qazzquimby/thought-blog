---
title: "okay so you have a very strong game ai which learns card action embeddings and is"
date: 2025-05-09 19:34:41
author: "qazzquimby"
---

💭 okay so you have a very strong game ai which learns card/action embeddings and is trained to specifically output some proxy metrics for if it's well designed, like how often it's used. Can now automatically vet if a card is well made and hopefully some sense of what's wrong with it.

If you can train it to predict the embedding from the card text then it can estimate the balance without training time.

If it can generate card text / rules from the embedding (likely with a constrained language and optimizing for metrics like ideal length and similarity to existing cards ) then it can generate arbitrary cards that look like they're well made.

If these can be automatically implemented mechanically then it can then compare with the real metrics and improve for next time. Should eventually be able to map out all of the good design space currently allowed by the above systems.

Actual user feedback and play data could improve the proxy metrics over time.