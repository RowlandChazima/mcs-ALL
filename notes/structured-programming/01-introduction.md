---
title: "Introduction to Computer Programming"
summary: "What a computer is, how it turns data into information, and how software and hardware layers interact."
---

## What is a computer?

A **computer** is an electronic, programmable device that stores data, takes data as **input**, processes it, and gives an **output** in the form of **information** that can be used in decision making.

```text
Data (raw facts and figures)
        |
        v
      INPUT  ---->  PROCESSING / CONVERSION  ---->  OUTPUT
                    (transformed by the CPU)
```

### Input devices

- Mouse
- Keyboard
- Touchpad
- Trackball
- Joystick
- Scanners

### Output devices

- Screens / Monitors
- Projectors
- Printers
- Speakers

### The CPU

The processing is done by the **CPU**. It has different components:

1. **Arithmetic Logic Unit (ALU)**
2. **Control Unit**: the coordinator
3. **Memory**

### Quality of input

- The input data comes from us, the users, and it can have **noise** (impurities).
- Good decisions are made from quality input, which generates good output that we can apply or use.

---

## From programming language to machine language

- A program written in a **high-level language** is converted to **assembly language** by a **compiler**, then later converted to **machine language** (binary) by an **assembler**.
- After processing, the processed data is taken to memory.

---

## Hardware and software

All of this can be summarised as:

$$\text{Computer} = \text{Hardware} + \text{Software}$$

- **Software** is a program that contains a set of instructions meant to execute some tasks in a computer system.
- The process of developing programs is called **programming**.
- **Computer programming** is the process of using computers to develop programs.

### Types of software

$$\text{Software} = \text{Application software} + \text{System software} + \text{Utility software}$$

- **Application software**: for example Microsoft Word, VS Code, Google Chrome
- **System software**: the operating system
- **Utility software**: for example compilers and text editors

---

## Understanding the System Architecture Flowchart

**Users → Applications → Shell → Operating System → Kernel → Hardware**

That flowchart is actually describing how different layers of a computer system communicate with one another. Once you understand it, you'll have a much clearer picture of what happens behind the scenes when you open an application, type something, or execute a C program.

Let's build the understanding from the ground up.

### 1. First, understand the big picture

Remember this equation from your notes:

$$\text{Computer} = \text{Hardware} + \text{Software}$$

Think of a computer as a restaurant:

- **Hardware** is the physical restaurant: tables, kitchen equipment, refrigerators, etc.
- **Software** is the instructions that tell everyone how things should operate.
- **Users** are the customers and employees interacting with the restaurant.

Your computer has physical components, but those components need software to tell them what to do.

For example, your laptop has:

- A keyboard.
- A screen.
- A processor (CPU).
- RAM.
- Storage (SSD).

But how does your laptop know what to do when you click Google Chrome? That's where the software layers come in.

---

### 2. Understanding the flowchart

Here is your lecturer's flowchart:

```text
USERS
  ↕ (People interacting with the computer)
APPLICATIONS
  ↕ (Programs used to perform tasks)
SHELL
  ↕ (Interface for communicating with the OS)
OPERATING SYSTEM
  ↕ (Manages computer resources)
KERNEL
  ↕ (Core of the operating system)
HARDWARE
  (CPU, RAM, keyboard, SSD, screen, etc.)
```

_Simplified conceptual model of how users and software interact with hardware._

Let's understand each layer:

#### Layer 1: Users

This is the easiest one. A user is simply a person interacting with a computer.

For example, you:

- Type code in WebStorm.
- Open Google Chrome.
- Play a video.
- Save a document.

You are the user.

#### Layer 2: Applications

Applications are programs designed to help users perform specific tasks.

Examples:

- **Google Chrome**: Browsing the internet.
  ![Google Chrome](https://images.openai.com/static-rsc-4/zmILEAKgij0bizql9Nnv0geqlik_ujYQ_eN0Hx5wncqJuHmu91oSAuklUnMENGp9d9VYIwbWFjxH8brmpPH7AXiHTY9T5XQFn-ab9Rw_A5Z0C5cgFbnnUk3qYpwTt2zl04JrSpY1WK9oqyAADK1yDNg4WpPSewNAkagscSlD9wE?purpose=inline)
- **Microsoft Word**: Creating documents.
  ![Microsoft Word](https://images.openai.com/static-rsc-4/UZQywdBi9-8pq0VL-2N6tx6wNw_s2ve7d6IqT9i-vZlPCcVtwWeYR_sFGLxxmkc-blzBlOKklMULqQaUu3QjCIeKVli6MwC4ZPC2tIcT28HcTEwQA7W9b-RwS5qJEzERve0WMt90LAluWuofSsQYKBAEHkRuLOcIU7vEW7rulqo?purpose=inline)
- **VS Code**: Writing and editing code.
  ![VS Code](https://images.openai.com/static-rsc-4/u_KCdkib2rjuULnNwgl_A0AlVTInpOs1nwJduJWod_rLYMi4xGGSoxEqaQWebSEzCdT_9wKvqHYI-4g4okgHuyEzbUJxBWVYDDBUL3yKB4ppzu9KVBUDm1KrjeXkvu9s9IjVhIqbnii8yRQaWhxZl1k3UuOuOziClDQQwSOlUKg?purpose=inline)
- **VLC**: Playing media.
  ![VLC Media Player](https://images.openai.com/static-rsc-4/TZJwhFnlwpmB1WvkJz9cMAchUdsUQna5oq57ZW-8Lho7npeMe_dKKDErVTsFn9TNXvasz1WImU40ScfbiaFbbwlBosCjrzRjssfTQ3Ydzk6sDVWf1HVxG6hnom-iSov_62cuhw3cyjN4nqzdgI2gVXqPMHvwgon9IzdiwqWz72Q?purpose=inline)

An application is software that allows you to accomplish something.

For example, when you write:

```c
printf("Hello World");
```

You are using a programming application (such as VS Code or Code Blocks) to write instructions that will eventually be executed by the computer.

But applications don't usually communicate directly with the physical hardware. They rely on the operating system. That brings us to the next layer.

#### Layer 3: Shell

**Important concept:** A shell is an interface through which a user or program communicates with the operating system. Think of it as a translator or an intermediary.

There are two common types:

1. **Graphical User Interface (GUI)**
   This is what you're probably most familiar with.
   ![Windows 11 GUI](https://images.openai.com/static-rsc-4/7Jvab49kPdbkyRMKtOxtOCewxGwcB7iTwsgaFVpqAJY_YcVXyiEgO0diy3vTU_IgbfWy7kKAm-8rnNrwJOoIBuQ17332WnQOrEb9262Y2boB3ODClEXUlGYgfYB30jnuLi_LWcv3Ekouqlgpmpwa79-Zc8fK0ZxMt2ecItrxLic?purpose=inline)
   You interact with the computer using:
   - Windows and menus.
   - Icons.
   - Buttons.
   - Mouse clicks.

2. **Command Line Interface (CLI)**
   ![Command Line Interface](https://images.openai.com/static-rsc-4/579t4D3xHE-sEEX2ER621VIGrPA-RG_FJDfqwn1av0W-0-JAJ0VKtyorPcpPEHhb_uBMGID7g5Y0710I_kw6AKIB4PVK323QXBplt1G9s8KR7G8rodMm1NORgDLsP-DzKPSHe9ZQiNAxHXpTBIub6YGlj-u_Yi2C0v6IJE3KINA?purpose=inline)
   Instead of clicking icons, you type commands.
   For example:
   ```bash
   mkdir my-project
   ```
   This tells the system to create a directory called `my-project`.

Other examples of shells include:

- Bash (Linux/macOS).
- PowerShell (Windows).
- Zsh (macOS/Linux).

> **Important distinction:** The shell is not the operating system itself. It provides an interface for interacting with it.

#### Layer 4: Operating System (OS)

An operating system is system software responsible for managing the computer's hardware and software resources and providing services to applications.

Examples include:

- **Windows**
  ![Windows](https://images.openai.com/static-rsc-4/1ZBBmvAD2BafaMBnafpKyDD-uBjB9gHmTWHNGn2FKWCAuOJhPq3wtT_flM1jJevjfkisOFBDe12NVQbAOh85iGJmpge0RxMSoOU8MkFZ3PoRH-yrwp0XUrfyGW8Gj9d7fbV16WozpcHFKvuNvX7vrCKIX4BAHyPZPimyoaupHHc?purpose=inline)
- **Linux**
  ![Linux](https://images.openai.com/static-rsc-4/7H7ZDgNdMFsgi05Re0FnypCmo5ujurd9JH0b9jnZt8bcp7H0D6N3bvr4bkWxRzfPmxBrwx9_pPUkn090TwS8HIDor05byfb_Eh68Q4XeXuUavexPaujsNFZ0jp-w4wxGw_Y7zIAI5j6S2bHzUNK2LoPTCfascHl3xy9VLPGOotQ?purpose=inline)
- **macOS**
  ![macOS](https://images.openai.com/static-rsc-4/IVW7144_ATcaqjTlwJ90GxRnqYwDEGhexeWj4aW8Wff9C9f7yirziKBkTIRAaqvwK4imGG9lB56A8_hG4nGyosoxv-WMa1jjGt79nit1Glxh-yh-xtX_4t4ILa9z1N-vDoAY283QTXWkSriw3VWa98PLBv3ij_K4iOOjopdHcYM?purpose=inline)

Imagine you're running three applications simultaneously:

- Google Chrome.
- WebStorm.
- VLC Media Player.

All three applications need computer resources:

- Chrome needs RAM and CPU time.
- WebStorm needs RAM, CPU time and storage access.
- VLC needs CPU time, RAM and access to audio hardware.

Who coordinates these resources?
The operating system!

Its responsibilities include:

| Responsibility         | What it means                    |
| ---------------------- | -------------------------------- |
| **Process management** | Controls running programs.       |
| **Memory management**  | Allocates and manages RAM.       |
| **File management**    | Organises files and folders.     |
| **Device management**  | Coordinates hardware devices.    |
| **Security**           | Controls access and permissions. |

Without an operating system, using a modern computer would be considerably more complicated.

#### Layer 5: Kernel

The kernel is the core component of an operating system.
Think of the operating system as an entire organisation, while the kernel is the department responsible for directly managing the most fundamental computer resources.

The kernel:

- Manages CPU scheduling.
- Manages memory.
- Controls processes.
- Coordinates hardware through device drivers.
- Handles system calls from applications.

Let's use an example.
Suppose you open CodeBlocks or VS Code and start writing a C program.
The code editor needs memory to store the information it's working with.
It requests memory from the operating system through system interfaces.
The kernel handles the underlying memory allocation and management.
You don't need to manually tell your RAM where to store every single instruction. The kernel and the operating system handle that complexity.

> **Remember:** The kernel is part of the operating system, not a completely separate program installed alongside it.

#### Layer 6: Hardware

This is the physical equipment that makes up the computer.
![Computer Hardware](https://images.openai.com/static-rsc-4/RIFYyVVCNbt3uHVlBuVaAC5N_diUkAguulW77ji5y-vNVic3Sdr4uusJfJsE51lcgkv4nCnnZR6XX61i52HOX9LRj_Y5T8ksLkNSO6c814gw4PaV-IaYvIfVprDKQ4gP7RL76-y6myfklRqCqH7OQxFllaMx68ACErSuA0ksQDo?purpose=inline)

Examples:

- **CPU** – executes instructions.
- **RAM** – temporarily stores data and instructions.
- **SSD** – stores files permanently.
- **Keyboard** – provides input.
- **Monitor** – displays output.
- **GPU** – processes graphics.

The kernel coordinates access to these resources, allowing software to use them.

---

### 3. Let's connect everything using a real example

When you open Google Chrome and visit Youtube,
What happens?

```text
Opening YouTube on your laptop:

USER
  ↓  You click the Google Chrome icon.

APPLICATION
  ↓  Google Chrome starts and requests the resources it needs.

SHELL / INTERFACE
  ↓  The graphical environment provides the interaction through which you launch and control Chrome.

OPERATING SYSTEM
  ↓  Windows coordinates Chrome's requests for memory, files, networking and other services.

KERNEL
  ↓  The kernel manages processes, memory and hardware access, using appropriate drivers and system interfaces.

HARDWARE
     Your CPU executes instructions, RAM holds working data, your network adapter communicates over the internet, and your screen displays YouTube.
```

**Result: YouTube appears on your screen!**

Notice something interesting?
You simply clicked an icon. You didn't have to manually allocate RAM, instruct the CPU or configure the network adapter.
The different layers abstract those complicated operations away from you.
That's one of the most important ideas in computer science: **abstraction**.
