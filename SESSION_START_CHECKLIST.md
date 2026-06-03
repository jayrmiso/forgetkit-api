# Session Start Checklist (Mandatory)

Run this checklist at the beginning of every new session before implementation work.

1. Re-read `AGENTS.md` and confirm workflow mode for the task.
2. Classify task:
   - Non-trivial: MUST run `zuggie-spec` first.
   - Trivial mechanical one-liner only: may proceed direct.
3. For non-trivial tasks, do not write code until:
   - `zuggie-spec` output is shared
   - explicit user approval is received
4. After approval, run `zuggie-impl` and reviewer/project gates.
5. Before final handoff, report gate outcomes (`lint`, tests, build or reason skipped).

If any mandatory step is skipped, STOP and self-correct before continuing.
