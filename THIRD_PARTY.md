# Third-Party Use & References

This file tracks external projects/libraries considered or used by AURA. No external source code has been copied into the repository.

| Project | Intended use | License / status | Reuse mode |
|---|---|---|---|
| `cayank/packet-client` | Habbo/Polaris headless protocol reference/seed | ISC | evaluate for adaptation |
| XState | lifecycle state machines | MIT | planned dependency after F1 |
| Zod | runtime/type/AI schemas | MIT | planned dependency after F1 |
| Vitest 5.0.0 | test runner | MIT | dependency |
| fast-check | property/state-machine testing | MIT | planned for critical tests |
| Drizzle ORM | persistence/migrations | Apache-2.0 | planned evaluation |
| Pino | structured logging | MIT | planned dependency in F1.4 |
| TypeScript 7.0.2 | compiler/type checking | Apache-2.0 | dependency |
| AgentSociety / AI Town / Concordia / OASIS / TinyTroupe | architecture/social-agent research | reference | concepts only unless explicitly reviewed |

## Reuse labels

- **dependency** — installed external library.
- **adapted** — compatible source/concept ported with attribution/license compliance.
- **vendored** — external source kept in repository.
- **reference** — studied only; no source copied.

Any code reuse must update this file and preserve required attribution/license obligations.
