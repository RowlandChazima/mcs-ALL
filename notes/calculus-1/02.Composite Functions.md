---
title: "Composite Functions"
summary: "Building one function from two or more, with worked examples of (f ∘ g)(x) and (g ∘ f)(x)."
---

### Definitions

- $(f \circ g)(x) = f(g(x))$: The rule of $f(x)$ acts on $g(x)$ ($f$ transforms $g$).
- $(g \circ f)(x) = g(f(x))$: The rule of $g(x)$ acts on $f(x)$ ($g$ transforms $f$).

### Example 1:

Let $f(x) = 5x + 2$ and $g(x) = 3x - 2$.

#### (a) Find $(f \circ g)(x)$:

$$(f \circ g)(x) = f(g(x)) = 5(3x - 2) + 2$$
$$= 15x - 10 + 2$$
$$(f \circ g)(x) = 15x - 8$$

> **Reminder:**
>
> - $f(1) = 5(1) + 2 = 7$
> - $f(m) = 5(m) + 2 = 5m + 2$
> - $f(g(x)) = 5(g(x)) + 2$

#### (b) Find $(g \circ f)(x)$:

$$(g \circ f)(x) = g(f(x)) = 3(5x + 2) - 2$$
$$= 15x + 6 - 2$$
$$(g \circ f)(x) = 15x + 4$$

---

### Multi-Function Composition

Given:
$$f(x) = x^2 - 1, \quad g(x) = x - 1, \quad h(x) = \sqrt{x}$$

- **Workflow for $(g \circ f \circ h)(x)$:**
  1. Evaluate the inner composition: $a = (f \circ h)(x) = f(h(x))$
  2. Substitute the result into the outer function: $g(a)$
- **Task to complete:**
  $$(g \circ h \circ f)(x) = g\left(h(f(x))\right) = g\left(\sqrt{x^2 - 1}\right) = \sqrt{x^2 - 1} - 1$$
