---
title: "What I Learned Building an Interactive 3D Scene with Three.js"
date: "2026-03-20"
tags: ["three.js", "javascript", "creative-coding"]
excerpt: "A look behind the scenes at how I built the interactive cube animation on my portfolio site, and what I'd do differently today."
---

If you've visited my site before, you might have noticed the colorful interactive cubes floating around the background. That scene was one of my favorite side projects — a chance to combine web development with creative coding.

## The setup

The scene uses Three.js with about 1000 cubes on desktop (250 on mobile). Each cube responds to mouse hover with an elastic scale and rotation animation powered by TWEEN.js.

## Lessons learned

**Performance matters on mobile.** My first version tried to render the same number of cubes everywhere. The frame rate on older phones was terrible. Reducing the cube count for mobile and simplifying the animations made a huge difference.

**Keep the interaction loop tight.** Raycasting on every mouse move can get expensive. I learned to throttle the raycaster and batch state updates instead of reacting to every pixel of movement.

**Color palettes set the mood.** Adding theme-cycling with arrow keys and brand-color switching on social icon hover turned a static scene into something playful. Small interactions make a big difference.

## What I'd do differently

If I were starting over, I'd consider using React Three Fiber instead of vanilla Three.js. The declarative approach fits better with a React codebase and makes cleanup much simpler.

But honestly? Sometimes the "just make it work" approach teaches you more than any framework.

You can still play with the cubes — check out the [interactive scene](/cubes).
