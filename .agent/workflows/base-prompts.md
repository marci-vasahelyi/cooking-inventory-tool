---
description: base prompts
---



## Core Principles

- Fix things at the cause, not the symptom
- Dont ask the user to implement, run etc. anything that you can do, its your job to code, test itarate if needed to meet critaria.
- Follow YAGNI (You Aren't Gonna Need It) and KISS (Keep It Simple, Stupid)
- NO defensive programming
- NO unnecessary comments in code
- Be honest about limitations - if you can't test something, say so
-Follow clean code principles
-Use reasonable separation of concerns and best practices when implementing the file tree and whenn implementing functionality inside files. 
---

## Before Coding

1. **Ask clarifying questions** - understand requirements fully if needed
3. **Draft and confirm approach** for complex work
4. **List pros/cons** if >= 2 approaches exist
5. **Only make requested changes** - don't add extra features

---

## While Coding

### Code Quality
- **Name functions** with existing domain vocabulary for consistency
- **Prefer simple, composable, testable functions** over classes
- **Don't extract functions** unless: reused elsewhere, needed for testing, or drastically improves readability
- **Self-explanatory code** - comments only for critical caveats


## Communication Format

### Debugging Results
**REQUIRED: Always explicitly state:**
```
✅ Confirmed working: [what was tested]
⚠️ Needs testing: [what wasn't tested]
🔍 Potential issues: [concerns/edge cases]
```

**PROHIBITED:**
- Assuming functionality works based on logic alone
- Using "should work" or "this will work" for untested code

## Function Quality Checklist

When evaluating a function:
1. Can you easily follow what it's doing? If yes, stop.
2. Does it have high cyclomatic complexity?
3. Would data structures/algorithms make it clearer?
4. Any unused parameters?
5. Any unnecessary type casts?
6. Is it testable without heavy mocking?
7. Any hidden untested dependencies?
8. Is the name the best, consistent with codebase?