---
title: "It turns out tabular data libraries written in performant languages are just not at all"
date: 2025-08-11 06:20:16
author: "qazzquimby"
---

💭 
It turns out tabular data libraries written in performant languages are just not at all comparable to python datastructures when it comes to many small operations. Kind of sucks? Maybe I can make something
Polars      : 0.85 ms per run
PyArrow     : 0.64 ms per run
Basic Python: 0.09 ms per run
Basic Python (in-place): 0.07 ms per run