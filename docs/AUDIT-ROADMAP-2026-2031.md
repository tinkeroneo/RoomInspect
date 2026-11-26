# RoomInspect — Engineering audit and roadmap
Stand: 2026-11-26. Baseline v0.10.7; audit patches v0.10.8–0.10.9. Public repository only: never commit property files, photos, addresses or user backups.

## Release status
Development preview, not yet a verified production inspection tool. All 13 core test bodies passed in the available JavaScript runtime; actual Node CI, real browser, WebGL, Android and iOS execution remain separate release gates. No private data used in tests.

## Audit register
| ID | Priority | Finding | Status / required remedy |
|---|---|---|---|
| A01 | P0 | Native camera/file picker lost photo-walk intent on backgrounding | Fixed with frozen file request context; device test open |
| A02 | P0 | Context-menu notes could use a later selection | Fixed frozen context, stop sensor on explicit long press; device test open |
| A03 | P0 | Wall indices are unstable when polygon is edited | Conservative model/backup guard shipped; stable IDs and explicit remapping still needed |
| A04 | P0 | Project model in localStorage and evidence in IndexedDB, no atomic cross-store transaction | Open: transactional schema and migration, validated restore |
| A05 | P1 | Legacy openings differed across plan, renderer and photo reference | Shared resolver shipped; estimated openings labelled in reference editor |
| A06 | P1 | Import validation doesn't check all geometry, ownership and references | Partial: render guards and same-ID geometry protection; schema and repair UI needed |
| A07 | P1 | Last-writer-wins backup merge resurrects deleted entries | Open: tombstones, revisions, explicit conflicts |
| A08 | P0 | Multiple tabs can write stale snapshots to same database | Open: writer lease or revision CAS, read-only secondary sessions |
| A09 | P1 | Photo rectification on main thread, repeated base64 snapshots | Open: worker, Blob assets, content-addressed storage |
| A10 | P1 | Old tests extracted math together with browser-only code | Fixed extraction; expanded core regressions 4 to 13 |
| A11 | P1 | Camera capture pose is approximate, FOV constant; not calibrated metric surveying | Open: calibrated intrinsics/EXIF where reliable, provenance |
| A12 | P1 | Renderer still has flat opening panels, approximate AO, limited light and shadow, SVG cannot show photos | Open: scene graph, real openings, fallback, browser shader tests |
| A13 | P1 | Model positions, openings and checklists may drift in import/resize | Partial: evidence guard, explicit validation, persistent entity IDs planned |
| A14 | P1 | Saved images may be compressed/resized; original is not guaranteed full resolution | Open: original assets, hashes, metadata, export |
| A15 | P1 | Export/restore unbounded data and full state copies may exhaust memory/quota | Open: streamed package, size limits, verified restore |
| A16 | P2 | Accessibility and touch gestures not comprehensively tested | Open: keyboard, screen reader, large text, touch, accessible alternatives |
| A17 | P1 | PWA and main branch release updates can drift | Open: atomic versioned release, rollback, cache tests |
| A18 | P1 | Geometry is not proof of actual measurements; inferred features may appear authoritative | Open: per-field source, accuracy class, verification state |
| A19 | P1 | Deletion immediate, no global undo | Open: reversible command log, tombstones, trash |
| A20 | P1 | No browser-level runtime regression suite verified | Open: E2E and real device release gates |

## Roadmap — aggressive capability targets, not delivery promises
### Dec 2026 / Q1 2027: Foundation (0.11–1.0)
- Extract pure geometry, camera/selection, photo registration, domain model, persistence, rendering, UI modules. One coordinate convention (plan axes, inward camera, surface UV), one opening resolver, one typed selection context.
- Stable project/floor/room/wall/opening/asset/finding IDs, schema version, migration fixtures, transactional IndexedDB, blobs and hashed exports, recovery, revision conflicts, multi-tab writer protection.
- Local read-only integrity audit; explicit spatial remap/review, no silent data reassignment. Model edits reversible and separated from evidence.
- Release gating: 100% core/critical workflow tests pass; Android Chrome + iOS Safari + desktop Chromium + offline reopen + export/restore + WebGL and fallback. No open P0. 0 loss/misassignment in synthetic test fixtures, restore matches hashes, at least 1000 photos load incrementally.
### 2027: Inspection and planning (1.x)
- Phone-first capture, stable context, visual capture queue, defect history, PDF/HTML/ZIP export, voice notes, guided inspection templates, PDF floorplan import and explicit scale, exact model editing, clear measured vs estimated.
- Semantic 3D furniture/sanitary catalog, real door/window openings, walk-through, stairs/multi-level, lighting/materials, snap/constraints, undo/redo, dimension plans. Baseline compare, cost ranges with sources and editable assumptions.
- Targets: first useful room <5 min with known floorplan; 30 fps on defined mid-range device in reference scene; capture response <500 ms excluding camera hardware and encoding; 200+ automated tests, 20+ E2E workflows.
### 2028: Spatial capture (2.x)
- Assisted scan via camera/AR where supported, sensor fusion with calibration, optional depth/LiDAR, photo stitching and model alignment, room/door detection with human review. Local/offline fallback always.
- Photo registration across images; quality/residual indicators, reference distances, measured/estimated/unknown status. Native companion only if browser capabilities insufficient.
- Target: validated room reconstruction within 2–5 cm for supported calibrated capture under defined test conditions; no accuracy promise without validation.
### 2029: Renovation intelligence (3.x)
- Semantic building model with materials, elements, services, costs, dependency graph, work packages, variant comparison, collision/clearance, quantities and optional IFC/GLB/DXF exchange.
- Local AI assists with document extraction, evidence matching, risk summaries and cost scenarios; sources, uncertainty, manual confirmation; never certify structural, electrical or legal safety.
- Optional local model integration and optional sync, encrypted backups. Targets: traceable cost assumptions for every priced item; reproducible exports; round-trip interoperability tests.
### 2030: Property lifecycle platform (4.x)
- Handover/maintenance/renovation history, recurrent inspections, warranties, document linkage, inventory, condition trends, change detection, collaboration roles and conflict handling. User-controlled on-prem/private sync, offline-first.
- Targets: multi-year histories, 10k assets, incremental load, restore drill and access-control tests; no cross-project leakage.
### 2031: Digital twin workspace (5.x)
- Unified building, documents, measurements, photos, planning, costs, maintenance and decisions. Optional simulation integrations (energy/daylight) with provenance and explicit assumptions. Human-reviewed AI agents for planning and evidence questions.
- Open exchange formats, portable encrypted packages, plugins, local-first ownership. Target: credible end-to-end inspection-to-lifecycle workflow, not a substitute for licensed professionals.
## Rules
- No additional feature before P0 release gate. Separate experimental and stable channels.
- Never silently move evidence after geometry change. Reject or explicitly remap and retain original association.
- Keep private real-estate data out of public source, tests, logs and analytics.
- AI suggestions are editable hypotheses; authoritative measurements require verified method and source.
- Roadmap reviewed quarterly; budgets, capacity and platform constraints decide delivery. No autonomous background execution implied.
