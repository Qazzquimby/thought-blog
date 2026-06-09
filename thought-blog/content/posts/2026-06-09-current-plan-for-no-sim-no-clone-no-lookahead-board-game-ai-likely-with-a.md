---
title: "current plan for no sim  no clone  no lookahead board game ai  likely with a"
date: 2026-06-09 20:21:02
author: "qazzquimby"
---

💭 current plan for no sim, no clone, no lookahead board game ai (likely with a much lower plateau). Rewording previous post.
This is tuning per individual game setup, but could probably be made general.
Every primitive action that can be taken exposes basic features, eg dealing damage exposes if it kills and the new health, etc.
Redundantly prompt llms to write custom features using those features and a context object based on the player options. For example 'distance to particular enemy' is automatically provided, while 'close enough to be able to move into range to use ability x next turn' would be a more relevant custom feature.
Redundantly prompt llms to propose weights valuing those features against each other. Sample from the resulting distribution.
Get round robin play data and probably genetic algorithms or something to tune weights.