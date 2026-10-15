---
title: "The Derivative from First Principles"
summary: "The limit idea behind the derivative, the first-principles formula, what each symbol means, and secant lines becoming tangents."
---

## From approaching to a limit

<PillBadge variant="lilac">N/B</PillBadge> Notice we haven't actually calculated the derivative yet. We only **approached** it.

- We started with $\dfrac{\Delta y}{\Delta x}$ between two points.
- Then we moved the second point closer and closer to the first.

Our main question is answered by asking:

> What value does the slope approach as the second point gets infinitely close to the first?

That is the idea of a **limit**, and it's where we will be deriving first principles.

---

## First principle

The derivative of a function $f(x)$ at $x$ is defined as:

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

<PillBadge variant="butter">Exam definition</PillBadge>

### What each part means

- $f'(x)$ is the **derivative** of $f(x)$.
- $h$ represents a very small change in $x$.
- So if our original $x$ is $x$, then our nearby $x$ is $x + h$.
- $f(x + h)$ is the $y$-value corresponding to $x + h$.
- The change in $y$ is $f(x + h) - f(x)$, which is $\Delta y$.
- The change in $x$ is $(x + h) - x = h$, which is $\Delta x$.

Therefore:

$$\frac{f(x + h) - f(x)}{h} = \frac{\Delta y}{\Delta x}$$

which is our **average rate of change**.

And finally, $\displaystyle\lim_{h \to 0}$ means: let's make the change in $x$ smaller and smaller, approaching zero.

---

## Graphically

Take point $A$ at $x$ and point $B$ at $x + h$.

- Joining $A$ to $B$ completes a right-angled triangle with sides $\Delta x$ (horizontal) and $\Delta y$ (vertical).
- The line $AB$ is called a **secant line**.

Remember what we did to find the slope at $x = 2$ for $f(x) = x^2$: we took values closer and closer to $x$, and we noticed that the change in $x$ gets closer and closer to $0$.

Remember from your pre-knowledge on tangent lines: as $B$ gets closer and closer to $A$, the secant line changes angle and its slope approaches the slope of the **tangent line** at $A$, provided the curve can be differentiated at that point.

<FunctionPlot fns='["x^2", "4x - 4", "5x - 6", "4.5x - 5", "4.1x - 4.2"]' xDomain="[1, 3.5]" yDomain="[0, 10]" points="[[2, 4], [3, 9], [2.5, 6.25], [2.1, 4.41]]" title="Secant lines settle onto the tangent at A = (2, 4) as B moves closer" />
