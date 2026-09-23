# FE-03 Workflow Comparison

## Feature

Duplicate row detection, built twice on separate branches with two different prompts, to compare outcomes.

## Attempt 1: Vague Prompt (feature/dupes-vague)

Prompt: "Add a feature to detect duplicate rows in a dataset."

Result: a full CSV upload flow, not just a function. The AI made every design decision alone. It compared rows on trimmed text rather than exact values. It let users exclude columns from comparison. It invented a labeling scheme (First of group, Copy 2, Copy 3). It left XLSX out of scope.

Lesson: none of these choices were wrong, but none were mine either. A vague prompt hands every open decision to the AI.

## Attempt 2: Precise Prompt (feature/dupes precise)

Prompt: a fully specified function signature, exact input and output types, a stated comparison rule (order independent key comparison, not full JSON match), explicit constraints (pure, synchronous, no network calls, no side effects), and named test cases.

Result: a single pure function at the exact file path requested, matching the exact contract. The AI only made implementation level decisions, such as building a stable signature string and handling edge values like NaN and negative zero.

## AI mistake caught

Partway through, the AI first implemented duplicateCount using a pandas style definition, counting only the extra copies in each group, not the full group. This did not match the specification, which required every duplicate row counted. The mistake was caught before the function was finished, and the AI corrected it to flag every row in each duplicate group. This shows why stating exact semantics up front matters, a vague count definition left room for the wrong convention.

## Complication worth recording honestly

Before the precise attempt started, a leftover file from the vague attempt was still in the working directory. The AI noticed it, removed it, and proceeded. The branch was not a fully clean slate. This was a process mistake, not a prompt quality issue, and it is now a fixed habit: confirm git status is clean on main before creating a new feature branch.

## Three rules added to [CLAUDE.md](http://CLAUDE.md)

1. Do not install or configure new tooling (test runners, dependencies, config files) inside a feature generation request. Set those up manually first.
2. For data processing functions, follow the exact file path, input and output types, and constraints given in the prompt. If any are missing, choose the most sensible default, state the assumption in a comment, and proceed without stopping to ask.
3. Always confirm git status is clean on main before creating a new feature branch, so a new attempt never inherits another attempt's leftover files.

