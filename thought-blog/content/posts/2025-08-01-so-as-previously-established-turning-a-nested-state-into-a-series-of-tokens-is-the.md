---
title: "so as previously established  turning a nested state into a series of tokens  is  the"
date: 2025-08-01 17:49:16
author: "qazzquimby"
---

💭 so as previously established, turning a nested state into a series of tokens *is* the same problem (or is isomorphic?) to storing it in a db, and *efficiently* storing in a db is the same as efficiently storing in tokens.
The issue is that turning a nested state efficiently into either is hard! Attempts at automating tend to lead to solutions that are not efficiently stored in a db (tables with one row, data spread across more tables than really needed, etc), and is still painfully complex regardless.
It'd be very nice to tell the game scripter "you need to store your state in sql rather than in helpful datastructures, sorry. If you want helpful datastructures like a grid, please write it yourself because different game contexts actually require quite different grid serializations, sorry" which would kill the project's usefulness unless I eventually automate the work?
Rather confused how to proceed.