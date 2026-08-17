---
title: "On photosensitivity screen filter 

Capture each frame  modify it with shader  show modified frame over full"
date: 2026-08-17 01:23:43
author: "qazzquimby"
---

💭 On photosensitivity screen filter:

Capture each frame, modify it with shader, show modified frame over full screen. Clickthrough window but *not* transparent since it should be replacing the entire screen rather than eg overlaying a dimmer.

Using two approaches together:

Brightness curve modification. Pretty sure the brighter a screen is the more dangerous is is for photosensitivity. Normally if you dim the screen it makes bright pages easier to read and dark pages illegible, requiring adjustment per page. Trying a brightness curve where darker pixels are relatively unaffected. This does leave less total contrast for the bright pixels, though it hasn't been a problem yet in my experience.
I feel like this could be done better contextually somehow. Maybe automatic sharpening for contrast would allow darker screen in general.

Luminance change temporal blurring. I'm gonna say brightness instead of luminance but I mean luminance. The idea is to limit the rate that the screen can change brightness to prevent sudden flashing or strobing, turning such changes into a gentle fade. Preventing flashing and strobing is actually extremely easy, just store the previous frame and only allow the next frame to change by a certain amount.
The hard part is doing it while keeping the screen content legible. Scrolling white text on a black screen (or vice versa) is a high contrast change but is (generally?) not at all triggering. Naively capping pixel brightness change would reduce scrolled text to a smear that comes into focus only after it's been still.
My first solution was to break the screen into small tiles (maybe 16x16) and check and limit their average brightness change. This does make text legible but it produces visible square artifacts. Cont.