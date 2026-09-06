# Third-Party Use & References

This file tracks external projects/libraries considered or used by AURA. No external source code has been copied into the repository.

| Project | Intended use | License / status | Reuse mode |
|---|---|---|---|
| `cayank/packet-client` | Habbo/Polaris headless protocol reference for framing/session/room patterns | ISC; F2.2 reviewed against frozen Polaris evidence | reference only; no dependency/vendor copy |
| XState | lifecycle state machines | MIT | planned dependency after F1 |
| Zod | runtime/type/AI schemas | MIT | planned dependency after F1 |
| Vitest 5.0.0 | test runner | MIT | dependency |
| dependency-cruiser 18.2.0 | architecture/import dependency enforcement | MIT; evaluated, deferred because TypeScript 7.0.2 is not supported | reference/evaluation |
| fast-check | property/state-machine testing | MIT | planned for critical tests |
| Drizzle ORM | persistence/migrations | Apache-2.0 | planned evaluation |
| Pino 10.3.1 | structured JSON logging | MIT | dependency |
| @types/node 24.6.1 | Node.js type declarations required by observability/Pino | MIT | dev dependency |
| TypeScript 7.0.2 | compiler/type checking | Apache-2.0 | dependency |
| AgentSociety / AI Town / Concordia / OASIS / TinyTroupe | architecture/social-agent research | reference | concepts only unless explicitly reviewed |

## Reuse labels

- **dependency** — installed external library.
- **dev dependency** — installed build/test/type tooling that is not part of runtime delivery.
- **adapted** — compatible source/concept ported with attribution/license compliance.
- **vendored** — external source kept in repository.
- **reference** — studied only; no source copied.
- **evaluation** — actively considered, but not installed/adopted because current constraints do not justify it.

`cayank/packet-client` is currently evidence only. AURA will implement its minimal protocol core against the frozen Polaris contract/handlers. If selected source or implementation logic is adapted later, change the reuse label at that time and preserve ISC attribution requirements.

Any code reuse must update this file and preserve required attribution/license obligations.
