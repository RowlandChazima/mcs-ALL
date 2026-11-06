---
title: "Introduction to C Programming"
summary: "High-level vs low-level languages, compilation process, and the journey from source code to executable."
---

Let's build these notes in a way that gives you actual understanding, not just definitions to memorise for a CAT. We'll start with the big picture of programming, understand how C fits into the picture, and then explore how code gets transformed into something a computer can execute.

---

## 1. What is C programming?

Before we talk about C, let's understand what programming actually means.

A computer is a machine that follows instructions. However, computers don't naturally understand the languages humans use to communicate.

For example, a computer doesn't directly understand an instruction such as:

> _Add 5 and 10, then display the answer._

We need a way of communicating these instructions to the computer. This is where programming languages come in.

A **programming language** is a formal language used to write instructions that tell a computer what tasks to perform.

Examples include:

- C
- C++
- Python
- Java
- JavaScript
- Rust

### What is C?

**C** is a general-purpose, procedural, high-level programming language developed by Dennis Ritchie at Bell Labs in the early 1970s.

It was originally developed to help build the UNIX operating system.

C is widely used in:

- Operating systems.
- Embedded systems.
- Device drivers.
- Compilers.
- System software.
- Performance-critical applications.

![Top Fastest Programming Languages Ranked](https://images.openai.com/static-rsc-4/q4KJDStXsIKA7KYQBwGhis0C7fhOguvBzT9pgRyy0t0VoonI70SVJ-gH35W7-LlFaMsDlaNCVKeoeD8wxUnLRnJTWG6bnBCoWnQ7CPHlVtmqUtHMg5rFmKjxy_wFqEvuqyrxWGlrrNAiSNUnXiszutyGSehonNM7mrD7EwEkJ38?purpose=inline)

### Why is C important?

C gives programmers considerable control over how computer resources are used, including memory.

It also helps you understand fundamental computer science concepts such as:

- Variables and data types.
- Memory.
- Pointers.
- Functions.
- Data structures.
- Algorithms.

One interesting thing: many modern programming languages and systems have been influenced by C.

---

## 2. Understanding programming languages

Now, here's something important. Not all programming languages are equally close to the way computers work internally.

We generally classify programming languages into two broad categories:

1. **High-level languages**
2. **Low-level languages**

Let's understand why these categories exist.

### 2.1 High-level programming languages

A **high-level programming language** is a programming language designed to be relatively easy for humans to read, write and understand.

It uses words, symbols and structures that are closer to human language and mathematical notation.

For example, consider this C program:

```c
#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;
    printf("%d", sum);
    return 0;
}
```

Even if you're a beginner, you can probably understand what is happening:

- We declare two variables.
- We assign values to them.
- We add the values.
- We display the result.

This is one of the advantages of high-level languages: they allow programmers to express complex instructions without having to manually manage every low-level operation.

Other examples:

- Python
- Java
- JavaScript
- C++
- C#

#### Characteristics of high-level languages

- Human-readable syntax.
- Easier to learn and maintain.
- Abstract away many hardware details.
- Require translation into machine code before execution (through compilation or interpretation, depending on the language and implementation).

### 2.2 Low-level programming languages

A **low-level programming language** is a language that is closer to the computer's hardware and instruction set.

Unlike high-level languages, low-level languages expose more details about how the processor performs operations.

There are two major forms worth understanding:

#### A. Machine language

This is the language the processor executes directly. It consists of binary digits:

- `0`
- `1`

For example, a sequence of machine instructions might look like:

```text
10110000 01100001
```

The actual meaning depends on the processor's instruction set and the context in which the instruction appears.

**Why binary?**
At the hardware level, digital circuits represent information using two logical states, commonly represented as 0 and 1. You don't need to write machine code manually to build ordinary C programs. Your compiler handles the translation.

#### B. Assembly language

Assembly language uses short symbolic instructions called **mnemonics** to represent machine instructions.

For example:

```text
MOV AX, 5
ADD AX, 10
```

Here:

- `MOV` represents moving data.
- `ADD` represents addition.
- `AX` is a processor register.

Instead of writing long sequences of binary digits, programmers can use these readable instruction names.

However, assembly is still closely tied to the processor architecture. An assembly program written for one processor architecture may not work on another without modification.

### Comparing the three levels

```text
High-level:      C language            int sum = 5 + 10;          (Relatively easy for humans to understand)
                    ↓
Low-level:       Assembly language     MOV AX, 5; ADD AX, 10      (Uses processor-specific instructions)
                    ↓
Machine:         Binary instructions   10110000 01100001          (Binary representation executed by CPU)
```

### High-level vs low-level languages

| High-level                    | Low-level                                |
| ----------------------------- | ---------------------------------------- |
| Closer to human language      | Closer to hardware                       |
| Easier to read and write      | More difficult to read and write         |
| More hardware-independent     | Often hardware-dependent                 |
| Greater abstraction           | Greater hardware control                 |
| **Examples:** C, Python, Java | **Examples:** Assembly, Machine language |

> **A small but important clarification:** C is classified as a high-level language, although it offers low-level capabilities such as pointers and direct memory manipulation. This makes it a useful bridge between application programming and systems programming.

---

## 3. What is a compiler?

Now that we understand high-level and low-level languages, we can address an important question:
_If we write a program in C, how does the computer actually execute it?_

Remember, the processor executes machine instructions, not ordinary C source code. We therefore need a translation process. This is where a compiler comes in.

A **compiler** is a software program that translates source code written in a programming language into another form, commonly machine code or assembly code, so that it can be executed.

Think of it like translating a book written in English into French. The original book is still there, but the translator produces another version that can be understood by a different audience.

Similarly:

- The programmer writes C code.
- The compiler translates that code.
- The resulting machine code can be executed by the processor.

### 3.1 How a compiler works

Let's follow a simple example. Suppose you write this C program:

```c
#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}
```

You save it as: `hello.c`. What happens next?

```text
C SOURCE CODE (hello.c)
       ↓  (Human-readable instructions)
    COMPILER
       ↓  (Translates and checks the program)
  OBJECT CODE (hello.o / hello.obj)
       ↓  (Machine-code instructions in an object file)
     LINKER
       ↓  (Combines object files and required standard libraries)
EXECUTABLE PROGRAM (hello.exe / a.out)
       ↓
CPU EXECUTES THE INSTRUCTIONS
```

There are a few details worth understanding here:

1. **First:** The compiler checks your program for errors and translates it into lower-level instructions.
2. **Second:** The object code may not yet be a complete executable program.
3. **Third:** The linker combines the object code with other required code, such as library functions.

For example, your program uses `printf("Hello World");`. The `printf()` function is provided by the C standard library. The linking process helps connect your program to the required library implementation. Finally, the executable can be loaded into memory and executed.

---

## 4. Source code and object code

These two terms are particularly important in introductory programming.

### 4.1 Source code

**Source code** is the original set of instructions written by a programmer using a programming language.

For example:

```c
#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    printf("%d", a + b);
    return 0;
}
```

This is source code because it is written in C and can be read and understood by a programmer. A C source file usually has the extension `.c`.

| Language       | Common source file extension |
| -------------- | ---------------------------- |
| **C**          | `.c`                         |
| **C++**        | `.cpp`                       |
| **Python**     | `.py`                        |
| **Java**       | `.java`                      |
| **JavaScript** | `.js`                        |

Think of source code as the original recipe written by the chef. It tells you what to do, but it is not itself the final prepared meal.

### 4.2 Object code

**Object code** is the lower-level code produced when source code is compiled.

In C, an object file typically contains machine-code instructions, along with information needed by the linker, such as symbol and relocation information. It is generally not directly executable as a complete program.

For example, when compiling a C program using GCC, you can produce an object file:

```bash
gcc -c program.c -o program.o
```

Here:

- `gcc` invokes the C compiler toolchain.
- `-c` tells it to compile without linking.
- `program.c` is the source file.
- `-o program.o` specifies the output object file.

The result is `program.o`. This is an object file.

You can then link it:

```bash
gcc program.o -o program
```

This produces an executable called `program` on a typical Linux environment (or `program.exe` on Windows).

### Source code vs object code

| Source code                                | Object code                                            |
| ------------------------------------------ | ------------------------------------------------------ |
| Written by the programmer                  | Generated by the compiler                              |
| Human-readable                             | Not generally human-readable                           |
| Written in a high-level language such as C | Contains lower-level machine instructions and metadata |
| **Example:** `program.c`                   | **Example:** `program.o`                               |
| Needs translation before CPU execution     | Usually needs linking before becoming an executable    |

---

## 5. Let's see this on your own computer

Since you're using C with VS Code / WebStorm and can already write simple `printf()` and `scanf()` programs, here's a practical experiment.

You can use GCC if it is installed on your Windows machine:

1. Create a file called `addition.c`:

```c
#include <stdio.h>

int main() {
    int x = 5;
    int y = 10;
    int sum = x + y;
    printf("The answer is %d\n", sum);
    return 0;
}
```

2. Compile it into an object file:

```bash
gcc -c addition.c -o addition.o
```

3. Then link it:

```bash
gcc addition.o -o addition.exe
```

4. Finally, execute it:

```powershell
.\addition.exe
```

**Expected output:**

```text
The answer is 15
```

You have now experienced the journey from source code to object code to an executable program.

> **Note:** GCC performs several compilation stages internally, including preprocessing, compilation, and assembly. The commands above illustrate the object-file and linking stages.

---

## 6. Summary: What you should remember

| Concept                 | Meaning                                                       |
| ----------------------- | ------------------------------------------------------------- |
| **C**                   | A general-purpose procedural programming language.            |
| **High-level language** | A language relatively easy for humans to understand.          |
| **Low-level language**  | A language closer to the computer's hardware.                 |
| **Machine language**    | Binary instructions executed by the processor.                |
| **Assembly language**   | Symbolic representation of machine instructions.              |
| **Compiler**            | Translates source code into lower-level code.                 |
| **Source code**         | Original programmer-written instructions.                     |
| **Object code**         | Compiled code stored in an object file.                       |
| **Linker**              | Combines object files and libraries to produce an executable. |

The big picture:

$$\boxed{\text{Source Code} \longrightarrow \text{Compiler} \longrightarrow \text{Object Code} \longrightarrow \text{Linker} \longrightarrow \text{Executable}}$$

---

## 7. Check your understanding

1. **Which of the following is a high-level programming language?**
   - Machine language
   - Assembly language
   - **C** _(Correct)_
   - Binary

2. **What is source code?**
   - The physical components of a computer
   - **The original instructions written by a programmer** _(Correct)_
   - The final executable file
   - The RAM contents

3. **What is the main purpose of a compiler?**
   - To store files
   - **To translate source code into lower-level code** _(Correct)_
   - To display output
   - To manage RAM

4. **Which file is typically an object file in a GCC compilation process?**
   - `program.c`
   - `program.exe`
   - **`program.o`** _(Correct)_
   - `program.txt`

5. **Why might an object file need a linker?**
   - To convert the monitor into binary
   - **To combine object files and resolve references to libraries and other code** _(Correct)_
   - To write the original source code
   - To allocate keyboard memory

> **Next topic:** The 4 internal stages of compilation in C: **Preprocessing**, **Compilation**, **Assembly**, and **Linking**. These will help you understand exactly what GCC does behind the scenes rather than treating the compiler as a mysterious black box.
