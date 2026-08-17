---
title: "Photosensitivy screen filter cont

An apparently better solution first blurs the screen and the previous screen"
date: 2026-08-17 01:32:07
author: "qazzquimby"
---

💭 Photosensitivy screen filter cont

An apparently better solution first blurs the screen and the previous screen and caps brightness shift based on the brightness shift of the blurred screens. Since scrolling text doesn't change the brightness of those parts of the screen much, the text remains legible.

This still leaves plenty of artifacts, though I'm not sure all of what can be safely removed. For example if you drag a white window on a black background it leaves a trail and the inside of the rectangle is darkened at the front edge. Maybe that can be hand tuned by the user. If you do drag a bright rectangle around on a black screen quickly enough, thats essentially strobing.

More concerning is any artifact that produces a flickering effect. Low brightness flickering is still not great. I could maybe do something to prevent low brightness changes at all, though that could backfire on actual smooth brightness shifts by making them more sudden and jarring. That's also treating the symptom rather than the cause, so hopefully I can just not introduce such artifacts.


There are other kinds of photosensitivity these things wouldn't address, like certain static patterns can be triggering. Barring a lot of research I don't know of how those patterns could be efficiently removed without otherwise totally garbling the screen content.
Could offer to blur any spatial transition with high enough contrast. Again naively that'd make text illegible.