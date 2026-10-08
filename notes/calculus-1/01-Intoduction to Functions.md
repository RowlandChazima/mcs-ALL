---
title: "Introduction to Functions"
summary: "What a function is, dependent and independent variables, and finding the domain, codomain and range."
---

## Functions

### Definition

A **function** is a rule where every input gives **exactly one output**.

- **Analogy:** Like a bow where we use our arrows (inputs) to hit our targets (outputs), and each arrow only ever hits one target.
- In Calculus, we transition from writing $y = 3x + 1$ to function notation:
  $$f(x) = 3x + 1$$
  where $f(x)$ represents the output ($y$), and our input values are substituted into the right-hand side wherever $x$ appears.

### Variables

- **Variable:** A type of quantity or category you are trying to measure.
- In functions, certain values depend on others:
  $$y = 5x + 1 \implies f(x) = 5x + 1$$
  - Evaluating at specific points:
    $$f(0) = 5(0) + 1 = 5$$
    $$f(2) = 5(2) + 1 = 11$$
  - Here, the output $y$ depends on the input $x$ used in the function:
    - $y$ is the **dependent variable**.
    - $x$ is the **independent variable**.

---

## Domain, Range, and Codomain

### Conceptual Flow

$$\text{Domain} \longrightarrow \text{Function} \longrightarrow \text{Codomain}$$

- **Domain:** A set of all allowed inputs for a function, depending on the nature of the function.
- **Codomain:** The declared set of all possible outputs.
  - _In simple terms:_ All the potential spots our arrows could hit. It does not mean every point gets hit, but rather the space where outputs are permitted to land.
- **Range:** The set of outputs that actually get produced.
  - _In simple terms:_ The specific spots where the arrows actually landed.
  - In special cases, the Range is always a subset of the Codomain ($\text{Range} \subseteq \text{Codomain}$), either smaller or equal.

---

### Examples: Finding Domain and Range

_(Guiding question: Think of what could break the rule mathematically—i.e., values we can plug in as $x$.)_

#### Example 1(a): Rational Function

$$f(x) = \frac{1}{x}$$

- Evaluating at zero:
  $$f(0) = \frac{1}{0} \quad (\text{Undefined})$$
  $0$ breaks the function because division by zero is undefined.
- Sample points:
  $$f(-1) = \frac{1}{-1} = -1$$
  $$f(-2) = \frac{1}{-2} = -0.5$$
  $$f(5) = \frac{1}{5} = 0.2$$
- **Domain:** All real numbers such that $x \neq 0$
  $$\text{Domain} = \{x \in \mathbb{R} \mid x \neq 0\}$$
- **Range:**
  $$\text{Range} = \{y \in \mathbb{R} \mid y \neq 0\}$$

<FunctionPlot fn="1/x" xDomain="[-6, 6]" yDomain="[-6, 6]" title="f(x) = 1/x is undefined at x = 0" />

#### Example 1(b): Quadratic Function

$$f(x) = x^2$$

- Any real number can be squared:
  $$\text{Domain} = \mathbb{R} \quad (-\infty, \infty)$$
- The smallest square of a real number is $0$ ($x^2 \ge 0$):
  $$\text{Range} = \{y \in \mathbb{R} \mid y \ge 0\} \quad [0, \infty)$$

---

<FunctionPlot fn="x^2" xDomain="[-4, 4]" yDomain="[-1, 10]" points="[[0, 0]]" title="f(x) = x^2 never goes below 0" />

### Note on Rational Functions ($f(x) = \frac{N(x)}{D(x)}$)

To state the domain of a rational function:

1. Find the values of $x$ that make the denominator equal to zero ($D(x) = 0$).
2. **Exclude** those values from the domain set.

#### Example:

Find the domain of:
$$f(x) = \frac{5}{x^2 - x - 12}$$

1. Set denominator $D(x) = 0$:
   $$x^2 - x - 12 = 0$$
   $$x^2 - 4x + 3x - 12 = 0$$
   $$x(x - 4) + 3(x - 4) = 0$$
   $$(x + 3)(x - 4) = 0$$
   $$x = 4 \quad \text{and} \quad x = -3$$

2. Because $f(4)$ and $f(-3)$ produce division by zero (undefined), $4$ and $-3$ must be excluded.
   - **Domain Statement:** All real values of $x$ except $x = -3$ and $x = 4$.
   - **Interval Notation:**
     $$(-\infty, -3) \cup (-3, 4) \cup (4, \infty)$$
