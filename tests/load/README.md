# Load Tests

Validate AURA under multiple concurrent headless sessions.

Foundation progression:
1 → 4 → 10 → 20 → 30 sessions.

F7.1 provides the in-process `SessionFleet` baseline. F7.2, F7.3 and F7.4 have live four-, ten- and twenty-session entry/roster results against Polaris. Its default capacity is 30 sessions; live Polaris runs must use unique CMS identities and fresh short-lived SSO tickets. The twenty-session run required a temporary room-capacity change and a Polaris reload; the original AAA configuration was restored afterward.

Measure at least:
- stable authenticated sessions
- reconnect behavior under load
- event throughput
- memory/CPU growth
- failure isolation between agents

Load tests must not silently depend on LLM availability during Foundation validation.
