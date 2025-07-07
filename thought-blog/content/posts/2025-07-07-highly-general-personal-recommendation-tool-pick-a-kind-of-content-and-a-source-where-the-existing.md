---
title: "highly general personal recommendation tool 
Pick a kind of content and a source  where the existing"
date: 2025-07-07 17:44:28
author: "qazzquimby"
---

💭 highly general personal recommendation tool.
Pick a kind of content and a source, where the existing filtering is insufficient. Some kind of post on a subreddit, relevant jobs listings.
You thumbup thumbdown, and preferably give reasoning.
LLM can write code to automatically generate metadata, or manually generate metadata via llm call.
metadata can go through a little nn to predict whether you'll like it. If some metadata is more expensive to collect than others (eg requires loading the content page and reading the content, rather than parsing a short form list with many titles) could make that a second phase that only occurs if the first gate passes.
User/llm may want to also assert strict filters at times to gate out content without needing to go through the model. Eg no job listings that'd require relocation.