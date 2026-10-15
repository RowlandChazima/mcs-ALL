---
title: "Rate of Change and Slope"
summary: "Average speed as a rate of change, the Δy/Δx formula, and why a straight line has a constant slope."
---

## What a derivative measures

Imagine you are driving. At 2:00 pm your car has covered **10 km**, and at 2:30 pm it has covered **40 km**.

- Distance travelled: $40 - 10 = 30 \text{ km}$
- Time taken: $30 \text{ minutes} = \tfrac{1}{2} \text{ hour} = 0.5 \text{ h}$

So your average speed was:

$$\frac{\text{distance travelled}}{\text{time taken}} = \frac{30}{0.5} = 60 \text{ km/h}$$

We can say your **average rate of change of position** was $60$ km/h.

<PillBadge variant="butter">Key idea</PillBadge> The idea of **rate of change** is the foundation of derivatives.

---

## What does "rate of change" mean?

Suppose something changes from one value to another, for example $x: 2 \to 5$.

- The change in $x$ is $5 - 2 = 3$, so $\Delta x = 3$.
- Suppose $y$ changes from $4$ to $10$. Then $\Delta y = 10 - 4 = 6$.

The **rate of change of $y$ with respect to $x$** is:

$$\frac{\Delta y}{\Delta x}$$

In our example $\dfrac{6}{3} = 2$, which means for every one unit increase in $x$, $y$ increases by $2$.

---

## This is the same thing as slope

From earlier work you have seen the formula for the slope of a straight line:

$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta y}{\Delta x}$$

So **the slope is the rate of change**.

For a straight line, the rate of change stays **constant**.

### Example: $y = 2x + 1$

| $x$ | 1 | 2 | 3 |
|---|---|---|---|
| $y$ | 3 | 5 | 7 |

$$\frac{\Delta y}{\Delta x} = 2$$

This means the slope is always $2$.

<FunctionPlot fn="2x + 1" xDomain="[-1, 4]" yDomain="[-1, 9]" points="[[1, 3], [2, 5], [3, 7]]" title="y = 2x + 1: the slope is always 2" />

But what if the graph isn't a straight line? That is the question the next topic answers.
