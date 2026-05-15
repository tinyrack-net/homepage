---
title: "Vector Optimizer: Enhancing Natural Pen Input"
excerpt: "Vector Optimizer"
lang: "en"
routeSlug: "vector-optimizer"
translationKey: "vector-optimizer"
publishedAt: "2023-01-16T00:00:00.000+00:00"
updatedAt: "2025-12-07T10:55:00.000+00:00"
tags: ["project", "frontend"]
featureImage: "./images/feature-image.gif"
commentsTerm: "vector-optimizer"
draft: false
---

> 💡 This project is in Public Archive status and is no longer maintained.

Vector Optimizer is a vector optimization utility that analyzes the relationships between points and optimizes them to create smooth curves. The project is managed on [Github](https://github.com/winetree94/VectorOptimizer) and distributed via [NPM](https://www.npmjs.com/package/vector-optimizer). You can try the project yourself through the [Live Preview](https://winetree94.github.io/VectorOptimizer).

> This project is a JavaScript / TypeScript reimplementation of [Bobby Fraser's 'Vector Optimizer' C# Project](https://gitlab.com/burningmime/curves).

---

### Core Concept

Let's assume you provide functionality for users to draw with a pen or mouse in a browser. Typically, the cursor movements are tracked and points are recorded, resulting in a series of points like this:

![](./images/raw-input-points.png)

The desired outcome for users is usually a smooth line, not just points. If we connect these points with straight lines, the result looks like this:

![](./images/straight-line-connection.png)

This is somewhat acceptable, but several issues arise:

- There are too many points and lines, increasing the data size of the drawing, leading to higher storage costs.

- The number of vector operations increases significantly, causing performance degradation as the drawing becomes more complex.

- Users end up with jagged lines instead of the smooth curves they intended to draw.

Vector Optimizer solves these problems. It first analyzes the relationships between the points the user drew and optimizes them by reducing the number of points at regular intervals using linear interpolation. The optimized points look like this:

![](./images/optimized-points.png)

Based on this optimization, it then finds the most optimal cubic Bézier curve to complete the drawing. The final result looks like this:

![](./images/optimized-bezier-curve.png)

The final result shows a significant reduction in the number of lines while still accurately representing the user's intended curves. If needed, the degree of optimization can be adjusted to make the user's input appear even more natural.
