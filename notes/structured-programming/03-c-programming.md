---
title: "Practical Tutorial: Coding in C"
summary: "A hands-on walkthrough on writing, building, and running your first C programs using VS Code or Code::Blocks."
video: https://youtu.be/xND0t1pr3KY
---

## Practical Tutorial on Coding in C

Now that we've covered the theoretical foundations of C programming, it's time to put what we've learned into practice!

This tutorial will walk you through writing, building, and running your very first C programs.

---

## Setting Up Your Development Environment

### Option 1: Visual Studio Code (VS Code)

The tutorial video demonstrates writing C code using **Visual Studio Code (VS Code)**, a modern, lightweight code editor with excellent language support.

If you would like to follow along using the same editor, you can download it here:
- [Download Visual Studio Code](https://code.visualstudio.com/Download)

*(Tip: In VS Code, you can install the **C/C++** extension by Microsoft to get syntax highlighting, autocompletion, and debugging support).*

---

### Option 2: Code::Blocks (Alternative IDE)

If you already have **Code::Blocks** installed or prefer an all-in-one IDE that bundles the MinGW GCC compiler, that works too.

If you are using Code::Blocks:

1. **Open Code::Blocks**.
2. **Create a new C source file**:
   - Use the keyboard shortcut `Ctrl + Shift + N`, or
   - Go to **File → New → Empty file**.
3. **Save your file** with a `.c` extension (for example, `main.c`).
4. **Write the C code** demonstrated in the tutorial:
   ```c
   #include <stdio.h>

   int main() {
       printf("Hello, World!\n");
       return 0;
   }
   ```
5. **Build and Run**:
   - Press **`F9`** on your keyboard.
   - `F9` is the shortcut for **Build and Run** in Code::Blocks. It compiles your program and, if compilation succeeds without errors, automatically launches a console window showing the output.

---

## Practical Advice for Beginners

> **Advice:** Don't just copy and paste the code shown in the tutorial. Try changing a few values, experimenting with the instructions, printing different variables, and observing how the compiler and output respond.
>
> The goal is to develop an intuitive mental model of what you're writing, not just to get the program to run once.

Happy coding! 🚀

