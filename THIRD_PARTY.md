# Third-Party Use & References

This file tracks external projects/libraries considered or used by AURA. No external source code has been copied into the repository so far.

| Project | Intended use | License / status | Reuse mode |
|---|---|---|---|
| TypeScript 7.0.2 | compiler and static type checking | Apache-2.0 | dependency |
| `cayank/packet-client` | Habbo/Polaris headless protocol reference/seed | ISC | evaluate for adaptation |
| XState | lifecycle state machines | MIT | planned dependency when lifecycle code requires it |
| Zod | runtime/type/AI schemas | MIT | planned dependency when runtime contracts begin |
| Vitest | test runner | MIT | planned dependency in F1.2 |
| fast-check | property/state-machine testing | MIT | planned for critical protocol/recovery tests |
| Drizzle ORM | persistence/migrations | Apache-2.0 | planned evaluation in F6 |
| Pino | structured logging | MIT | planned dependency in F1.4 |
| AgentSociety / AI Town / Concordia / OASIS / TinyTroupe | architecture/social-agent research | reference | concepts only unless explicitly reviewed |

## Reuse labels

- **dependency** — installed external library.
- **adapted** — compatible source/concept ported with attribution/license compliance.
- **vendored** — external source kept in repository.
- **reference** — studied only; no source copied.

Any code reuse must update this file and preserve required attribution/license obligations.
