# FE-03 Workflow Comparison

## Feature

Duplicate row detection, built twice on separate branches with two different prompts, to compare outcomes.

## Attempt 1: Vague Prompt (feature/dupes-vague)

Prompt used:

"Add a feature to detect duplicate rows in a dataset."

What the AI produced:

It built a full CSV upload flow, not just a function. It made every design decision on its own, since none were specified. It chose to compare rows on trimmed cell text rather than exact values. It added a feature to let the user exclude specific columns from comparison. It invented a labeling scheme (First of group, Copy 2, Copy 3). It decided XLSX support was out of scope for now.

Lesson: none of these choices were wrong, but none were mine either. A vague prompt hands every open decision to the AI, including decisions I might have made differently if asked.

## Attempt 2: Precise Prompt (feature/dupes precise)

Prompt used: a fully specified function signature, exact input and output types, a stated comparison rule (order independent key comparison, not full JSON match), explicit constraints (pure, synchronous, no network calls, no side effects), and named test cases.

What the AI produced:

A single pure function in the exact file path requested, matching the exact input and output contract. It only made implementation level decisions, the kind a precise spec is supposed to leave open, such as how to build a stable signature string for comparison, and how to handle edge values like NaN and negative zero. Partway through, it reconsidered whether duplicateCount should count only extra copies or every row in a group, and correctly landed on flagging every duplicate row, matching what was actually asked.

Lesson: a precise prompt keeps scope narrow and keeps the meaningful decisions with me, while still leaving room for the AI to handle implementation details well.

## Complication worth recording honestly

Before starting the precise attempt, a leftover file from the vague attempt was still present in the working directory. The AI noticed it, removed it, and proceeded. The branch was not a fully clean slate at the start. This was a process mistake, not a prompt quality issue, and it is now a fixed habit, always confirm git status is clean on main before creating a new feature branch.

## Three rules added to [CLAUDE.md](http://CLAUDE.md) as a result

1. Do not install or configure new tooling, such as test runners, dependencies, or config files, inside a feature generation request. Set those up manually first.
2. Always specify exact file paths, input and output types, and constraints (pure, synchronous, no side effects) for any data processing function. Do not rely on the AI to infer scope.
3. Always confirm git status is clean on main before creating a new feature branch, so a new attempt never inherits another attempt's leftover files.

