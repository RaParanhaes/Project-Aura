# aura-core

Future deployable AURA service/composition root.

The composition is now executable for a real Polaris session. It reads `AURA_WS_URL`, `AURA_AGENT_ID` and the short-lived `AURA_SSO_TICKET` only from the process environment, creates the WebSocket/session/authentication boundaries and exits fail-closed when the ticket is absent. No credential is stored in the repository.

Run with the workspace Node 24 runtime:

```sh
AURA_SSO_TICKET='temporary-ticket' pnpm --filter @aura/core start
```

The ticket must be obtained from the local CMS login flow. The executable does not attempt to infer or persist passwords.
