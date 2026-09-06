# Load Tests

Validate AURA under multiple concurrent headless sessions.

Foundation progression:
1 → 4 → 10 → 20 → 30 sessions.

Measure at least:
- stable authenticated sessions
- reconnect behavior under load
- event throughput
- memory/CPU growth
- failure isolation between agents

Load tests must not silently depend on LLM availability during Foundation validation.
