---
title: "💭 longer version
Say you have an agentic llm system working at a task. Llms exhibit..."
date: 2025-03-28 07:40:51
author: "qazzquimby"
---

💭 longer version
Say you have an agentic llm system working at a task. Llms exhibit mode collapse, where they try to create more text looking like previous text, as its 'more likely'. This means the llm may poison its own well of context when it looks at its past actions. For example, it may start working on a subtask, and eventually so much of its context is work on the subtask that its original task is a footnote in the system message. Or say the llm is asked not to repeat itself in its <thinking> tags, but it does a few times and soon its context is full of it repeating largely the same information in every <thinking> tag, so it continues the pattern.