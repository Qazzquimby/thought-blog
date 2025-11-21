---
title: "idk how to categorize this error  but errors like
Llm says its necessary to do a"
date: 2025-11-21 22:45:58
author: "qazzquimby"
---

💭 idk how to categorize this error, but errors like
Llm says its necessary to do a tournament step after each round of training alphazero to ensure the training has lead to actual improvement

It sounds wise. It can come up with arguments that use words like "collapse," and talk about problems of proxy measurements.
It's not true though, since MCTS provably converges to optimal strategy and you're learning to predict MCTS. I could imagine its possible to fall into some collapse state but itd be a wild fluke, and neither alphazero nor muzero do tournament checks (though alphago did).

Still, I guess because the tournament is an associated piece of jargon it adds it to the plan, and then having done so it keeps acting smart and backing itself up.
You can ask "Why is it necessary to run a tournament check..." and "Why **isn't** it necessary..." in fresh chats and it'll fart out incorrect but wise looking answer either way.
Obviously hallucination exists, but I'm not sure how to deal with it in these sorts of situations besides already knowing the answer.