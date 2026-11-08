# RFC: mechanical explosion motion, geometry states, and contact diagnostics

Status: draft proposal only. None of the new syntax below is implemented by this
PR. The existing [stage/move contract](assembly-explosion.md) remains unchanged.

## Problem observed in a real assembly

The FLEX17 40 mm NEMA17 adjustable spur actuator has four TSX catalog poses,
six 625ZZ bearings on split printed snap axles, a rack/pinion, a removable lid,
and a shared screw-adjusted lower bearing carrier. Each enclosed pose has 18
explosion stages; open inspection has 16. Geometry is authored with
`jscad-fiber`, evaluated using `@tscircuit/jscad-to-manifold`, and the site is
built with `tsci build --site`.

On the tested stack (`@tscircuit/cli` 0.1.2444, `tscircuit` 0.0.3115,
`jscad-fiber` 0.0.93), bearing withdrawal produces six
`cad_explosion_collision_error` records per pose: approximately 1.2108 mm³ of
new swept overlap per bearing against its retaining ears. Those errors are
correct for rigid, undeformed geometry. Physical removal requires squeezing the
split axle; a translation-only animation cannot represent that operation.

The prototype uses `--ignore-errors` followed immediately by a separate strict
audit that accepts only those six named contacts per pose within a narrow
observed volume range. All diagnostics remain in Circuit JSON. This is a
prototype workaround, not an API to standardize or a physical safety claim.

Other observations:

- Removing the pinion before withdrawing the rack avoids coupled rotation for
  this disassembly, but does not solve rolling gears or threaded fasteners.
- A removed part can obstruct a later move. Both checker and viewer must retain
  previously displaced geometry, including installed inserts with their hosts.
- Stage IDs such as `squeeze_snap_axle_remove_bearing_1` carry instructions today.
- Fully exploded assemblies can extend outside the initial camera framing.
- A four-pose, 4,400-position independent sampled audit found no other new
  overlaps after correcting removed-part parking paths. Sampling is not proof
  of continuous clearance, material strain, tool access, or safe assembly.

The public implementation work in [3d-viewer#1124](https://github.com/tscircuit/3d-viewer/pull/1124)
adds playback controls/timing and a self-contained FLEX17 fixture. Coordinate
with that work rather than introducing another playback API. A minimized split
axle/ring fixture should be added for collision-state tests; it must not depend
on an authenticated hosted site or a complete actuator mesh.

## Ownership and suggested delivery order

| Repository | Responsibility |
| --- | --- |
| `props` | Authoring intent, units, validation and compatibility contracts |
| `circuit-json` | Serializable motion, geometry-state and diagnostic records |
| `core` | Reference resolution, deterministic pose/state evaluation and checks |
| `3d-viewer` | Consume resolved transforms/states, instructions and diagnostics; camera fitting |
| `cli` | Build policy for structured results, without globally disabling checks |

1. Agree stage display/instruction metadata; implement its serialization and viewer consumption.
2. Define rotation and parallel-motion records; implement shared evaluation and explicit unsupported-check results before claiming rotational verification.
3. Add named geometry states and scoped contact annotations with separate verification statuses.
4. Implement camera fitting in the viewer independently of the props release.

A props-only release must not imply that core, collision checking, or viewers
support a new motion. Consumers need capability/version checks and explicit
unsupported-operation diagnostics. In particular, current Zod objects strip
unknown fields: new authoring examples must not silently become translations
when evaluated by an older runtime.

## A. Rotation and synchronized motion

Proposed additive move prop (spelling subject to review):

```tsx
<assembly.explosion.move
  targetRefs="pinion"
  rotate={{ axis: [0, 0, 1], angle: "-720deg", pivot: [0, 0, "13mm"] }}
/>
```

`rotate` contains a finite, nonzero dimensionless axis vector, a signed angle
(number means degrees; unit-aware strings accepted), and a required pivot of
three distances (number means millimeters). Normalize axis length and units in
parsed output; retain the signed angle, including whole turns. No Euler-order
ambiguity, shortest-path angle wrapping, or implicit center-of-mass pivot.

The axis and pivot are in the stage owner's coordinate frame captured at move
start, matching the existing offset frame. At progress `t`, transform a point
`p` by `pivot + R(axis, t * angle) * (p - pivot) + t * offset`, after resolving
that captured frame to world coordinates. Rotation and any supplied translation
happen simultaneously. A move requires at least one offset or a rotation;
explicit zero offsets retain today's meaning. Omitted rotation means none.
Existing targetRef/targetRefs conflicts and descendant deduplication remain.
Group rotation uses one common pivot, not each part's individual origin.

For a rack and gear, different transforms must share progress. Proposed explicit
parallel grouping, rather than changing the meaning of existing stage children:

```tsx
<assembly.explosion.stage name="withdraw-rack">
  <assembly.explosion.parallel>
    <assembly.explosion.move targetRefs="rack" offX="113.097335529mm" />
    <assembly.explosion.move
      targetRefs="pinion, shaft, set_screw"
      rotate={{ axis: [0, 0, 1], angle: "-360deg", pivot: [0, 0, 0] }}
    />
  </assembly.explosion.parallel>
</assembly.explosion.stage>
```

One parallel group is one sequence operation. Its children start from the same
snapshot and share normalized progress; surrounding operations stay sequential.
Initially allow only move children, without nested groups. Reject two children
that resolve to overlapping target/descendant sets; do not apply competing
transforms in an incidental order. Moving-vs-moving collision checks are needed
between groups of targets, not only against static obstacles. There is no
implicit gear, screw, or mate solver in this first increment.

Acceptance cases: non-origin pivots, rotated/moved owners, parent-child target
selection, negative and multi-turn angles, a screw combining axial/rotational
motion, a rack moving one pitch circumference with one gear revolution, reversed
scrubbing and Reset without drift, and a mid-path collision absent at endpoints.
If rotational swept checks are unavailable, report incomplete verification;
endpoint checks must not report a verified path.

## B. Named geometry states for snap release

Propose named CAD geometry states on a printed part, with stage operations that
select and transition states by reference. A state preserves the same part ID,
material/BOM identity, datum frame and nominal print geometry. Example intent:

1. Transition the axle-bearing host from `rest` to `retaining-ears-compressed`.
2. Withdraw the bearing using the compressed collision geometry.
3. Restore `rest` after the bearing clears the head.

A whole-host state can be a first implementation; subregions are a later
optimization. Resolve state names in core. Missing states, changed coordinate
frames, or unsupported geometry representations are errors, not fallbacks to
nominal geometry. Scrubbing must reconstruct state from the assembled baseline.
Nominal STL export must stay unchanged unless an explicit state export is requested.

Do not define arbitrary vertex interpolation between unrelated meshes. Initially
support authored state transitions only when a trajectory or conservative swept
geometry is available to the checker. Endpoint-only states may be displayed as
explicitly illustrative keyframes, but transition verification stays incomplete.
No JavaScript callbacks should be serialized into Circuit JSON.

This is authored geometry, not a PETG material solver. Even a verified geometric
transition says nothing about strain, force, creep, fatigue, or print orientation.
Exact authoring shape (`cadStates`, separate named elements, or a state registry)
is an open design decision; do not publish an unimplemented prop just to reserve it.

Acceptance: a minimized split axle plus ring collides in the rigid baseline;
a supplied compressed state clears the ring; an unrelated obstacle still fails;
missing/intermediate unsupported states remain incomplete; nominal STL is identical;
viewer and checker use the same state and transform at every evaluated progress.

## C. Scoped expected-contact annotations, not blanket exemptions

Where physical deformation remains unmodeled, authors need an explicit annotation
that a particular contact requires an external/manual operation. Proposed data:

- Exactly one move and a resolved moving/obstacle part pair.
- A required explanation and reference to the intended manual operation/state.
- A spatial contact region in a declared part-local frame, optionally narrowed
  by a progress interval; merely naming the pair is not sufficient.
- Optional quantitative bounds as extra guards, never the sole classifier.

An annotation must retain the measured collision and its provenance and mark it
as expected but unverified. It cannot convert it to a verified clear path, exempt
other regions of the same part pair, or suppress later-stage collisions. A tiny
collision elsewhere is still unexpected even if its volume is smaller than the
retention-ear overlap. Ambiguous/unresolved selectors are errors.

Separate result categories should distinguish verified clear, unexpected
collision, annotated unverified contact, and incomplete/unsupported checking.
A future CLI policy may explicitly permit annotated unverified contacts while
still failing unrelated errors and incomplete checks. Default behavior should
continue to require acknowledgement; avoid a global `ignoreCollisions` prop.
This should extend the existing mating-contact intent in the original proposal,
not replace geometry checks with an allowlist of part names or volumes.

Acceptance: retain all six snap diagnostics; a seventh obstacle or contact outside
the annotated region fails; the same pair colliding in another stage fails;
missing geometry cannot be relabeled as expected contact; source annotations and
resolved diagnostic scope survive JSON round-trips and are visible in the viewer.

## D. Stage instructions and presentation

Propose optional `displayName` (nonblank trimmed string) and `instructions`
(nonblank plain text) on `assembly.explosion.stage`. `name` remains stable identity
and reference key; omitted displayName falls back to name. Omitted instructions
produce no placeholder text. Render instructions as text, not arbitrary HTML.
No aliases or changes to existing scheduling props.

An optional unit-aware stage duration can follow after coordinating with viewer
#1124: raw numbers should mean seconds, finite positive values only, canonical
seconds. Omission uses the viewer's global playback preference. Duration must
not affect geometric transforms or collision verdicts. Stage descriptions should
explain prerequisites such as squeezing retaining ears and loosening preload.

Camera fitting is viewer behavior, not a geometry/props concern. Offer a Fit
explosion action and an opt-in fit-on-stage-change mode. Compute bounds from the
resolved visible solids after transforms, including previously removed parts;
respect manual orbit/zoom and isolation, and avoid continuous camera jitter.
Test large displacements, PCB-less assemblies, both render engines, mobile
aspect ratios, and Reset after arbitrary scrubbing.

## Questions to resolve before implementation

- Should parallel motion be a new element or a separate synchronized-move record?
- Which reusable CAD-state representation supports both display and validation?
- How should contact-region geometry be authored, serialized and versioned?
- Which package should own the shared evaluation/capability contract so viewer
  and checker cannot independently interpret motion semantics?

No runtime prop, schema, renderer, STL, or collision-policy change is made by this
RFC. Implement each agreed slice with cross-package tests before advertising it
as available to TSX authors.
