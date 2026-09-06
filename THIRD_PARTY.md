# Third-Party Use & References

This file tracks external projects/libraries considered or used by AURA. No external source code has been copied into this bootstrap commit.

| Project | Intended use | License / status | Reuse mode |
|---|---|---|---|
| `cayank/packet-client` | Habbo/Polaris headless protocol reference/seed | ISC | evaluate for adaptation |
| XState | lifecycle state machines | MIT | planned dependency after F0 |
| Zod | runtime/type/AI schemas | MIT | planned dependency after F0 |
| Vitest | test runner | MIT | planned dependency after F0 |
| fast-check | property/state-machine testing | MIT | planned for critical tests |
| Drizzle ORM | persistence/migrations | Apache-2.0 | planned evaluation |
| Pino | structured logging | MIT | planned dependency |
| AgentSociety / AI Town / Concordia / OASIS / TinyTroupe | architecture/social-agent research | reference | concepts only unless explicitly reviewed |

## Reuse labels

- **dependency** — installed external library.
- **adapted** — compatible source/concept ported with attribution/license compliance.
- **vendored** — external source kept in repository.
- **reference** — studied only; no source copied.

Any code reuse must update this file and preserve required attribution/license obligations.
