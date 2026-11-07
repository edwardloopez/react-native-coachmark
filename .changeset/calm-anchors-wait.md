---
'@edwardloopez/react-native-coachmark': patch
---

Fix the backdrop blocking all touches when a step's anchor is missing. If the tour has nothing on screen, the overlay stays hidden while the step waits up to 2 seconds for its anchor, and the step is skipped if the anchor never shows up. On the last step, the tour ends as `skipped` and doesn't save `showOnce`.
