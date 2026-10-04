---
title: "Limits: The Epsilon-Delta Formulation"
summary: "The rigorous definition of a limit, plus the sum and quotient rules."
---

### The Rigorous Definition of a Limit

Let $f(x)$ be defined on an open interval around $x_0$, except possibly at $x_0$ itself. We write:

$$\lim_{x \to x_0} f(x) = L$$

if for every real $\varepsilon > 0$, there exists a corresponding real $\delta > 0$ such that:

$$0 < |x - x_0| < \delta \implies |f(x) - L| < \varepsilon$$

<PillBadge variant="butter">Exam Definition Required</PillBadge>

#### Key Properties of Limits
When analyzing standard algebraic expressions, the following limit identities hold true provided $\lim f(x)$ and $\lim g(x)$ exist:

1. **Sum Rule**: $\lim [f(x) + g(x)] = \lim f(x) + \lim g(x)$
2. **Quotient Rule**: $\lim \left[\frac{f(x)}{g(x)}\right] = \frac{\lim f(x)}{\lim g(x)}$, where $\lim g(x) \neq 0$.

<FunctionPlot fn="x^2 - 4" xDomain="[-4, 4]" yDomain="[-5, 8]" points="[[-2, 0], [2, 0], [0, -4]]" title="Parabolic curve" />
