---
title: "Differentiation from First Principles"
summary: "Deriving the derivative from the limit definition, with a worked example."
video:
  url: https://www.youtube.com/watch?v=rAof9Ld5sOg
  title: "Derivatives by First Principles"
  author: "Khan Academy"
  duration: "14:10"
---

### The Derivative as a Limit of Secants

The derivative of $f$ at $x$, denoted $f'(x)$, is established via the difference quotient limit:

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

provided this limit exists.

```c
// Numerical Secant Approximation Example in C
#include <stdio.h>
#include <math.h>

double derivative(double (*f)(double), double x, double h) {
    return (f(x + h) - f(x)) / h;
}
```
