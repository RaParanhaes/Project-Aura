# Post-Foundation product plan

Foundation stability is the starting point for resident behavior. Product layers must continue to consume confirmed runtime state and invoke semantic capabilities; they do not bypass the protocol, Polaris authority or action confirmation boundaries.

## P1 — Perception and attention

Goal: give each resident a bounded, current and explainable view of the shared room, then select what deserves attention without requiring an LLM.

### P1.1 — Resident-relative perception

- project one resident's perception from a `WorldStateSnapshot`;
- require the resident to be confirmed in the current room roster;
- filter nearby units by tile radius and result capacity;
- preserve the source world revision and deterministic ordering;
- fail closed when room/self context is incomplete.

**Done when:** unit tests prove bounded filtering, stable ordering, truncation and incomplete-context behavior. **Status: COMPLETE.**

### P1.2 — Deterministic attention ranking

- rank perceived units using explicit signals such as proximity and direct interaction;
- keep scoring inspectable and independent of any model provider;
- apply stable tie-breaking and a bounded focus set;
- retain the source perception/world revision.

**Done when:** the same perception always produces the same ranked focus set and invalid/stale inputs fail safely. **Status: COMPLETE.**

### P1.3 — Perception event window

- combine room roster, movement, typing and chat observations into a bounded recent window;
- preserve ordered social events while coalescing replaceable position updates;
- keep untrusted chat text as data;
- expose enough evidence to explain why attention changed.

**Done when:** tests cover ordering, coalescing, expiration and untrusted text handling. **Status: COMPLETE.**

### P1.4 — Live shared-room validation

- run two AURA residents with Cabana in AAA;
- confirm each resident sees a distinct resident-relative snapshot;
- exercise movement, typing and speech observations;
- verify attention changes from observed evidence and remains stable across reconnect.

**P1 done when:** perception and attention operate repeatably in the local Polaris room without an LLM and without accessing raw packets or the complete world outside their runtime boundary.

P1.4 was validated live with `aura_f7_1`, `aura_f7_2` and `Cabana` in AAA. The resident-relative view contained the other AURA resident and Cabana, the explicit interaction signal selected the other resident as focus, the event window retained the scenario evidence, and reconnect returned `sessionResumed=true` in room 1.

## P2 — Goals and activities

The next layer turns durable resident objectives into bounded activities while keeping execution behind validated capabilities.

### P2.1 — Goal and activity contracts

- define goal, activity, status and cancellation contracts;
- keep desired intent separate from observed world state;
- attach world/perception revisions to plans;
- reject stale or unsupported activity proposals.

**Done when:** contracts and lifecycle tests exist without introducing an LLM dependency. **Status: COMPLETE.**

### P2.2 — Activity execution boundary

- revalidate accepted activities against current world/perception revisions;
- route execution only through the capability registry;
- keep execution pending until Polaris confirms the resulting observation.

**Done when:** stale, rejected and valid activities have focused boundary tests. **Status: COMPLETE.**

### P2.3 — Goal scheduling and cancellation

- schedule active goals in deterministic FIFO order;
- cancel queued goals explicitly;
- propagate goal cancellation to unfinished activities.

**Done when:** queue ordering and cancellation propagation have focused tests. **Status: COMPLETE.**

### P2.4 — Activity confirmation reconciliation

- accept completion only from an explicit observed confirmation;
- reject confirmations older than the activity's source world revision;
- keep unconfirmed execution pending.

**Done when:** current, stale and absent confirmations have focused tests. **Status: COMPLETE.**

### P2.5 — Bounded activity retry policy

- retry only transient transport or confirmation timeouts;
- cap attempts and require a fresh world revision for each retry;
- stop retries when the goal is cancelled or a capability is rejected.

**Done when:** retry limits, backoff decisions and cancellation are deterministic and tested. **Status: COMPLETE.**

## P3 — Room interaction capabilities

P3 turns validated activities into observable room actions. Every action remains behind the capability registry and must be confirmed by Polaris observations.

### P3.1 — Social gestures

- wave, blow a kiss and other explicit gestures;
- raise and lower a selected sign or hand item;
- target a specific visible user when the action requires a recipient.

**Done when:** gesture selection, target validation and completion observations are covered by live or contract tests. **Status: COMPLETE (contract boundary).**

### P3.2 — Dance and posture

- start dancing with an explicit dance type;
- stop dancing and confirm the returned posture;
- sit, stand and use supported furniture interactions.

**Done when:** dance type, posture transitions and invalid furniture targets are confirmed from room observations. **Status: COMPLETE (contract boundary).**

### P3.3 — Object use and item transfer

- use an allowed room or inventory object;
- pass an item to another user with recipient confirmation;
- reject unavailable, out-of-range or unauthorized transfers.

**Done when:** object use and transfer lifecycle tests prove authorization, confirmation and failure handling. **Status: COMPLETE (contract boundary).**

### P3.4 — Room creation and management

- create a room with validated name, access and layout inputs;
- confirm the created room identifier before entering it;
- leave or cancel creation without leaking pending activities.

**Done when:** room creation is exercised against the CMS/Polaris boundary with durable activity results. **Status: COMPLETE (contract boundary).**

### P3.5 — View direction and orientation

- turn toward a tile or visible user;
- confirm the resulting head/body direction from room status;
- reject targets outside the current perception snapshot.

**Done when:** orientation commands and confirmations preserve world/perception revisions. **Status: COMPLETE (contract boundary).**

### P3.6 — User profile and appearance inspection

- inspect another visible user's outfit, bio, badges and achievement summary;
- read the resident's own profile data through the same observation boundary;
- treat returned profile text and metadata as untrusted data.

**Done when:** self and visible-user reads have parsers and contract tests. **Status: COMPLETE (bounded profile contract).**

### P3.7 — Inventory and achievement inspection

- read the resident's own wardrobe, badges, achievements and inventory;
- keep private self data separate from public user inspection;
- reject requests that exceed the requested bounded page or category.

**Done when:** bounded self-data reads and malformed responses are tested. **Status: COMPLETE (bounded observation contract).**

### P3.8 — Shop and catalog browsing

- browse catalog pages and offers;
- inspect item metadata and prices before any purchase activity;
- keep purchase commands separate from read-only shop inspection.

**Done when:** catalog page/offer reads are validated without performing purchases. **Status: COMPLETE (bounded observation contract).**

### P3.9 — Integrated room interaction scenarios

- compose goal, activity, capability execution and observed confirmation in one flow;
- cover a social gesture and a posture transition;
- keep purchase and other irreversible actions outside the scenario.

**Done when:** the integrated flow is deterministic and each action closes only after confirmation. **Status: COMPLETE (contract scenario).**

### P3.10 — Polaris packet implementation

- implement exact composers/parsers and frozen byte fixtures for P3 actions and reads;
- keep `ORIENT` canonical and retain `LOOK_AT` only as a compatibility alias;
- correlate each command with its concrete Polaris confirmation.

**Done when:** the packet matrix has implemented codecs and contract tests for every supported action. **Status: COMPLETE.**

### P3.11 — aura-core action adapters

- connect semantic capabilities to the P3 packet composers;
- feed confirmation parsers into activity reconciliation;
- apply bounded timeout and cancellation.

**Status: COMPLETE.** The `PolarisActionAdapter` now owns byte composition, transport sends and confirmation decoding for the supported room actions, with semantic capability registration in `aura-core`.

### P3.12 — Live AAA interaction validation

- validate gestures, signs, dance, posture and orientation with Cabana observing;
- confirm the same actions through a second headless resident;
- verify no unexpected effect or appearance transition.

**Status: COMPLETE.** A two-user AAA run observed Cabana in the shared roster and confirmed action, dance, posture, orientation and sign packets through Polaris. The run produced no non-zero effect.

### P3.13 — Live profile, inventory and catalog reads

- compare AURA observations with the Octane client;
- validate public/private field boundaries and malformed data handling;
- perform no purchase during read validation.

**Status: COMPLETE.** The four read requests and responses were confirmed live without a purchase. Profile and badge fields are decoded with bounds; inventory fragment metadata and catalog page metadata are validated while variable payload sections remain bounded and opaque.

### P3.14 — Permissions, cooldowns and rate limits

- mirror Polaris permissions, room rights and cooldown failures at the capability boundary;
- throttle repeated gestures, profile reads and catalog requests.

**Status: IN PROGRESS.** Local cooldown/window enforcement is implemented and tested at the capability boundary; a restricted Polaris account is still required to verify permission-denial responses.

### P3.15 — Protected economy operations

- require two-step confirmation for trade, transfer and purchase;
- record price and balance observations before and after the operation;
- never retry an economic write automatically after an ambiguous timeout.

## Later layers

Skills/habits, social/group conversation, memory/knowledge, shared LLM gateway, human realism and extended economy/gameplay remain sequenced after these deterministic room interaction capabilities.
