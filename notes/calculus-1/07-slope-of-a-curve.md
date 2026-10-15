---
title: "The Slope of a Curve"
summary: "Why a curve has a different slope at every point, and how shrinking the interval closes in on the slope at one point."
---

## When the graph isn't a straight line

Consider $y = x^2$. Let's gather some points:

| $x$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $y$ | 0 | 1 | 4 | 9 | 16 |

If we plot them, we get a **curve**.

<FunctionPlot fn="x^2" xDomain="[-4, 4]" yDomain="[-1, 10]" points="[[-3, 9], [-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4], [3, 9]]" title="y = x²" />

But we have a problem here: **what is the slope of the curve?**

- Around $x = 1$, the curve has one steepness.
- Around $x = 3$, it has a completely different steepness.
- So we can't say the slope of $y = x^2$ is some fixed constant value like a straight line.

The slope changes depending on where you are on the curve. **This is where derivatives come in.**

---

## Why we need a smaller and smaller interval

Since every point on the curve has a different steepness, we need the slope at **one particular point**.

Suppose I ask: what is the slope of $y = x^2$ exactly at $x = 2$?

- We have the point $(2, 4)$.
- To find a slope we use $m = \dfrac{y_2 - y_1}{x_2 - x_1}$, which needs **two points**.
- But I am asking for the slope at **one** point. So how do we solve this?

### First intuition

Take our point $(2, 4)$ and choose another point nearby, like at $x = 3$, so the second point is $(3, 9)$.

<PillBadge variant="lilac">N/B</PillBadge> Why not use a point on the left, such as $x = 1$? You could, and it would give a similar estimate from the other side. We pick a point to the right of $x = 2$ so that every step in the table below moves in the same direction toward $2$.

The slope between the two points:

$$m = \frac{9 - 4}{3 - 2} = 5$$

That is the slope between $x = 2$ and $x = 3$. But I didn't ask for the slope between $2$ and $3$. We want the slope at **exactly** $x = 2$.

So let's get closer to $2$ by picking points that are close to it.

### Getting closer

Use $x = 2.5$, where $y = (2.5)^2 = 6.25$:

$$m = \frac{6.25 - 4}{2.5 - 2} = 4.5$$

Closer, $x = 2.1$, where $y = (2.1)^2 = 4.41$:

$$m = \frac{4.41 - 4}{2.1 - 2} = 4.1$$

Really close, $x = 2.01$, where $y = (2.01)^2 = 4.0401$:

$$m = \frac{4.0401 - 4}{2.01 - 2} = 4.01$$

| Second point at $x =$ | Slope |
|---|---|
| 3 | 5 |
| 2.5 | 4.5 |
| 2.1 | 4.1 |
| 2.01 | 4.01 |

As we get closer and closer to $2$, the slope approaches **4**.

<FunctionPlot fns='["x^2", "5x - 6", "4x - 4"]' xDomain="[0, 4]" yDomain="[-1, 10]" points="[[2, 4], [3, 9]]" title="Secant through (2, 4) and (3, 9) has slope 5; the tangent at x = 2 has slope 4" />

The derivative tells us the **instantaneous rate of change**: the slope of the curve at a particular point.
