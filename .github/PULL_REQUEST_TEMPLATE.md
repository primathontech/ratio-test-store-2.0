# Pull Request Checklist

Please review and check the following before submitting your PR:

## Code Quality

- [ ] Code follows **consistent naming conventions** (variables, functions, components)
- [ ] No **magic numbers or strings**; constants or enums are used
- [ ] No **unused code, imports, console logs, or commented-out blocks**
- [ ] No **redundant loops or repeated logic**
- [ ] No _hard coded colors or px values unless it's not supported by tailwind_
- [ ] No sensitive keys/tokens exposed in code

## Error Handling

- [ ] All **undefined/null/empty values** are handled
- [ ] **API errors and edge cases** are handled gracefully
- [ ] User inputs are **validated** where necessary

## Performance & State

- [ ] **Unnecessary re-renders** avoided in React components
- [ ] Reused values are stored in **constants or memoized** where applicable

## Git & PR Practices

- [ ] Branch name follows **naming conventions** and includes ticket ID
- [ ] Commit messages are **clear and descriptive**
- [ ] PR description clearly explains **what, why, and how**
- [ ] Only **relevant changes** included; linter/formatter run successfully
- [ ] Attach images for both mobile and desktop view.

## Optional AI Check

- [ ] AI-assisted check done (naming consistency, unused variables, null checks)
