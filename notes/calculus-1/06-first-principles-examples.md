---
title: "First Principles: Worked Examples"
summary: "Differentiating x² and 5x/(1 − 3x) step by step using the limit definition."
---

## Example 1

Find the derivative of $f(x) = x^2$.

By first principles:

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

Find $f(x + h)$:

$$f(x + h) = (x + h)^2 = x^2 + 2xh + h^2$$

Substitute:

$$f'(x) = \lim_{h \to 0} \frac{(x^2 + 2xh + h^2) - x^2}{h}$$

$$f'(x) = \lim_{h \to 0} \frac{2xh + h^2}{h} = \lim_{h \to 0} \frac{h(2x + h)}{h}$$

Cancel $h$, then let $h \to 0$:

$$\lim_{h \to 0} (2x + h) = 2x + 0 = 2x$$

$$\Rightarrow f'(x) = 2x$$

This agrees with the numbers we found earlier: at $x = 2$ the slope is $2(2) = 4$.

---

## Example 2

Find the derivative of $f(x) = \dfrac{5x}{1 - 3x}$.

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

Find $f(x + h)$:

$$f(x + h) = \frac{5(x + h)}{1 - 3(x + h)} = \frac{5x + 5h}{1 - 3x - 3h}$$

Substitute:

$$f'(x) = \lim_{h \to 0} \frac{\dfrac{5x + 5h}{1 - 3x - 3h} - \dfrac{5x}{1 - 3x}}{h}$$

Combine the fractions over a common denominator:

$$f'(x) = \lim_{h \to 0} \frac{(5x + 5h)(1 - 3x) - 5x(1 - 3x - 3h)}{h(1 - 3x - 3h)(1 - 3x)}$$

Expand the numerator:

$$\lim_{h \to 0} \frac{(5x - 15x^2 + 5h - 15xh) - (5x - 15x^2 - 15xh)}{h(1 - 3x - 3h)(1 - 3x)}$$

Most terms cancel, leaving $5h$:

$$\lim_{h \to 0} \frac{5h}{h(1 - 3x - 3h)(1 - 3x)}$$

Cancel $h$:

$$\lim_{h \to 0} \frac{5}{(1 - 3x - 3h)(1 - 3x)}$$

Let $h \to 0$:

$$\frac{5}{(1 - 3x - 3(0))(1 - 3x)} = \frac{5}{(1 - 3x)(1 - 3x)}$$

$$\Rightarrow f'(x) = \frac{5}{(1 - 3x)^2}$$

<PillBadge variant="ice">Exam tip</PillBadge> The step that earns marks is cancelling $h$ **before** substituting $h = 0$. Substituting first gives $\frac{0}{0}$.
