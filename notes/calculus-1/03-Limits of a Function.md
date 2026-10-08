---
title: "Limit of a Function"
summary: "What a limit is, the limit of a constant, one-sided limits, and when a two-sided limit exists."
video: https://youtu.be/watch?v=5R0TcAn7z2Y?si=BUdopaVxtiQ--6jQ
---

### Definition

The **limit** of a function is the output value that $f(x)$ approaches as $x$ approaches a value $a$ from either the left-hand side or the right-hand side:
$$\lim_{x \to a} f(x) = L$$
_(Intuition: "As I get closer and closer to a particular value of $x$, what value is the function getting closer and closer to?")_

---

### Properties of Limits

#### 1. Limit of a Constant

Let $f(x) = C$, where $C$ is a constant. Any constant term has an implicit variable raised to the zero power ($x^0 = 1$):

- For example, $f(x) = 20x^0$:
  $$f(1) = 20(1)^0 = 20$$
  $$f(2) = 20(2)^0 = 20$$
- Therefore:
  $$\lim_{x \to a} f(x) = \lim_{x \to a} (C x^0) = C(a)^0 = C$$

---

### One-Sided Limits

A target value (e.g., $x = 3$) can be approached from two directions:

#### Left-Hand Limit ($\lim_{x \to a^-} f(x)$)

Approach from values strictly less than $a$:
$$\lim_{x \to 3^-} (x + 2)$$

- Approaching $3$ from the left ($x = 2.9, 2.99, 2.999$):
  - $f(2.9) = 4.9$
  - $f(2.99) = 4.99$
  - $f(2.999) = 4.999$
- The outputs approach $5$:
  $$\lim_{x \to 3^-} (x + 2) = 5$$

#### Right-Hand Limit ($\lim_{x \to a^+} f(x)$)

Approach from values strictly greater than $a$:
$$\lim_{x \to 3^+} (x + 2)$$

- Approaching $3$ from the right ($x = 3.1, 3.01, 3.001$):
  - $f(3.1) = 5.1$
  - $f(3.01) = 5.01$
  - $f(3.001) = 5.001$
- The outputs approach $5$:
  $$\lim_{x \to 3^+} (x + 2) = 5$$

---

<FunctionPlot fn="x + 2" xDomain="[-1, 6]" yDomain="[-1, 8]" points="[[3, 5]]" title="From both sides, f(x) = x + 2 approaches 5 as x approaches 3" />

---

### General Limit Existence

The general two-sided limit is written without the $+$ or $-$ sign: $\lim_{x \to a} f(x)$.

The limit **exists if and only if** both one-sided limits approach the **same value**:
$$\lim_{x \to a} f(x) = L \iff \lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L$$
