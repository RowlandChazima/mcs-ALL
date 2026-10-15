# Contributing to Maths & CS Hub

Thanks for helping! This guide is written for people who have **never used GitHub
before**. Follow it top to bottom and you'll have your first contribution in. If
you get stuck, open an issue and ask. Everyone starts somewhere.

You don't need database access, passwords or keys. You write notes, check them on
your laptop, and send them to the maintainer for review.

---

## Pick your route

| I want to...                              | Use                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| Fix a typo or a small mistake in one note | [Route A: edit on GitHub](#route-a-fix-a-small-mistake-on-the-github-website) (no installs) |
| Write a new topic or make bigger changes  | [Route B: work on your laptop](#route-b-write-or-change-notes-on-your-laptop)               |

---

## Route A: fix a small mistake on the GitHub website

1. Create a free account at [github.com](https://github.com).
2. Open the note you want to fix in the repository (inside the `notes/` folder).
3. Click the **pencil icon** (Edit this file). GitHub creates your own copy (a _fork_) for you.
4. Make your change, then click **Commit changes** and choose **Propose changes**.
5. Click **Create pull request**, then write one sentence about what you fixed.

An automatic check runs on your pull request. The maintainer reviews it and merges it.

---

## Route B: write or change notes on your laptop

### One-time setup

**1. Install the tools**

| Tool                         | Get it from                                            | Check it worked  |
| ---------------------------- | ------------------------------------------------------ | ---------------- |
| Git                          | [git-scm.com](https://git-scm.com/downloads)           | `git --version`  |
| Node.js 20 or newer          | [nodejs.org](https://nodejs.org)                       | `node --version` |
| pnpm                         | after Node: `npm i -g pnpm`                            | `pnpm --version` |
| VS Code (recommended editor) | [code.visualstudio.com](https://code.visualstudio.com) |                  |

Run the check commands in a terminal (on Windows, use _Git Bash_ or the VS Code terminal).

**2. Make your own copy (fork)**

Open [the repository](https://github.com/RowlandChazima/mcs-ALL) and click **Fork** at the top right, then **Create fork**.

**3. Download your copy**

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR-USERNAME/mcs-ALL.git
cd mcs-ALL
pnpm install
```

**4. Link to the original repository**

This lets you pick up other people's merged work later:

```bash
git remote add upstream https://github.com/RowlandChazima/mcs-ALL.git
```

You do **not** need a `.env.local` file to write and check notes.

---

### Every time you contribute

**Step 1: Start from the latest version**

```bash
git checkout main
git pull upstream main
git push origin main
```

**Step 2: Make a branch.** A branch is a separate workspace for one change. Give it a short descriptive name:

```bash
git checkout -b notes/calculus-chain-rule
```

**Step 3: Write your notes**

- New topic: copy `notes/_TEMPLATE.md` into the unit's folder and name it with the next free number, e.g. `07-chain-rule.md`.
- The header needs `title` and `summary`.
- What you can write (maths, graphs, photos, videos) is in the [README](README.md#what-you-can-put-in-a-note). The full reference is [`docs/writing-notes.md`](docs/writing-notes.md).
- Photos go in an `images/` folder next to your note.

**Step 4: Check your work.** Both must pass:

```bash
pnpm notes:check
pnpm lint
```

`notes:check` tells you the file and line of any problem. Fix everything it lists, then run it again until it says **All notes look good**.

**Step 5: Save your work (commit)**

```bash
git add notes
git commit -m "Add chain rule notes to Calculus I"
```

Write the message as a short sentence saying what you did, like "Fix sign error in worked example 2".

**Step 6: Upload it to your fork**

```bash
git push -u origin notes/calculus-chain-rule
```

**Step 7: Open a pull request**

Go to your fork on GitHub. A yellow banner appears with **Compare & pull request**. Click it, fill in the checklist, and submit.

---

## After you open the pull request

1. **An automatic check runs** (you'll see a green tick or red cross). If it's red, click **Details** to see why, fix it on your laptop, then commit and push again. The pull request updates itself.
2. **The maintainer reviews it.** Mostly they check the maths, the structure and that it renders properly.
3. **If changes are requested,** that's normal and not a rejection. Make the changes, commit, and push to the same branch.
4. **When it's approved and merged,** your note is in the repository. The maintainer then publishes it to the live site.

Merging into GitHub does not instantly change the website. The maintainer publishes separately, so there may be a short delay.

---

## What makes a good contribution

- **Correct maths.** Check your working and final answers. Wrong maths is worse than missing maths.
- **Your own words.** Don't copy text from textbooks, lecture slides or websites. Explain it the way you understand it. Link to the source instead.
- **One thing per pull request.** One topic or one fix is easier and faster to review.
- **Leave scripts and components alone.** If you think something in the code needs changing, open an issue first.
- **Never commit secrets.** No passwords, keys or `.env` files.

## Common problems

| Problem                          | What to do                                                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notes:check` shows an error     | Read the file and line it names. Usual causes: an unclosed tag, a stray `{`, or array props in `{}` instead of quoted JSON (`xDomain="[-4, 4]"`).         |
| I committed to `main` by mistake | Don't panic. Ask in an issue and we'll sort it out. Your work isn't lost.                                                                                 |
| "Merge conflict"                 | Someone changed the same lines. Run `git pull upstream main` on your branch, open the files it lists, and keep the right version. Ask for help if unsure. |
| `git push` is rejected           | Check you pushed to `origin` (your fork) and not `upstream`.                                                                                              |
| `pnpm` isn't recognised          | Install Node first, then `npm i -g pnpm`, then reopen the terminal.                                                                                       |
| I made a mess                    | Delete the branch and start again from Step 1. Nothing is lost on GitHub.                                                                                 |

## Prefer a visual tool?

[GitHub Desktop](https://desktop.github.com) does the fork, branch, commit and
push steps with buttons instead of commands. You still run `pnpm notes:check`
in a terminal before you commit.

## Code of conduct

Be kind and be constructive. We're all students learning the same material.
Critique the note, not the person, and assume good intentions.
