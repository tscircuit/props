# Assembly Explosion Stage and Move Elements

`assembly.explosion.stage` names an explosion step, and
`assembly.explosion.move` declares one straight movement for one or more targets.
Stages are direct children of their owning device or subassembly. There is no
explosion container, `run`, `detach`, `translate`, or explicit collision-check
element.

```tsx
<assembly.device name="instrument">
  <assembly.part name="base" modelUrl="./base.step" />

  <assembly.subassembly name="cover">
    <assembly.part name="shell" modelUrl="./shell.step" />
    <assembly.part name="window" modelUrl="./window.step" />
    <assembly.part name="seal" modelUrl="./seal.step" />

    <assembly.explosion.stage name="remove-window">
      <assembly.explosion.move targetRefs="window, seal" offZ="15mm" />
    </assembly.explosion.stage>
  </assembly.subassembly>

  <assembly.explosion.stage name="lift-cover">
    <assembly.explosion.move targetRefs={["cover"]} offZ="12mm" />
  </assembly.explosion.stage>

  <assembly.explosion.stage
    name="remove-cover"
    nextStageRef="cover.remove-window"
  >
    <assembly.explosion.move targetRefs={["cover"]} offX="60mm" />
  </assembly.explosion.stage>
</assembly.device>
```

The intended sequence lifts the intact cover, moves it sideways, then removes
the window and its seal together at the cover's new location.

## Accepted props and canonical output

`AssemblyExplosionStageProps` / `assemblyExplosionStageProps` accept:

- `name`: required nonblank string; stable identity unique within its assembly.
- `nextStageRef`: optional nonblank string identifying a stage that executes later.
- `prevStageRef`: optional nonblank string identifying a stage that executes earlier.
- `children`: optional React nodes, preserved unchanged and in authored order.

Identity and reference strings are trimmed. Omitted optional props remain omitted;
no ordering references or children are synthesized.

`AssemblyExplosionMoveProps` / `assemblyExplosionMoveProps` accept:

- `targetRefs`: preferred target selector, accepting a comma-separated string or
  an array of strings. Each reference identifies a part or subassembly relative
  to the stage owner; qualified names can address descendants. String input is
  split on commas, and every reference is trimmed. Array entries each identify
  one target and are also trimmed. The resulting list must contain at least one
  reference, and every member must be nonblank.
- `targetRef`: compatibility input alias accepting one nonblank string. It is
  trimmed and normalized to the one-element list `targetRefs: [reference]`.
  React reserves `ref`, so selectors use ordinary props instead.
- Exactly one of `targetRefs` and `targetRef` is required. Neither has a default.
  Supplying both is an error, even when they select the same target.
- `offX`, `offY`, `offZ`: optional signed distances, with at least one required.
  Numbers mean millimeters; unit strings use the existing distance parser.
  Parsed offsets are finite numbers in millimeters. Negative and explicit zero
  offsets are accepted. Omitted axes stay omitted and mean zero in the consumer.

The canonical parsed selector is always `targetRefs: string[]`; parsed output
never retains `targetRef`. For example, `targetRefs=" module, battery "` and
`targetRefs={[" module ", "battery"]}` both produce
`targetRefs: ["module", "battery"]`. Empty lists, empty comma-separated members,
and blank array entries fail validation rather than being silently removed.

All selected targets and all supplied axes move together along one straight
segment, incrementally from their current poses. Every target receives the same
displacement in the stage owner's coordinate frame, captured when the move
begins. The offsets are not interpreted separately in each target's local frame.
Sequential moves accumulate. An L-shaped path uses two moves rather than one
diagonal move:

```tsx
<assembly.explosion.stage name="extract-module">
  <assembly.explosion.move targetRefs={["module", "battery"]} offZ="10mm" />
  <assembly.explosion.move targetRefs={["module", "battery"]} offX="40mm" />
</assembly.explosion.stage>
```

Existing single-target authors can keep the compatibility form:

```tsx
<assembly.explosion.move targetRef="module" offZ="10mm" />
```

To migrate, replace it with `targetRefs="module"` or `targetRefs={["module"]}`;
the parsed result and movement are the same. Use `targetRefs` for new examples
and for moves with several targets. Do not supply both selector props.

Unknown fields are stripped, matching existing assembly Zod objects; TypeScript
rejects fields outside the declared interfaces. Missing or conflicting selectors,
empty references, invalid or nonfinite distances, and moves without offsets
fail props validation.

Validators are exported individually and as `assemblyProps.explosion.stage` and
`assemblyProps.explosion.move`. `assemblyExplosionProps` exposes the same nested
namespace. The namespace is a registry, not a validator for a container element.

## Intended core behavior

This package supplies types and props validation. Core must supply the actual
namespaced JSX elements, stage scheduling, movement, and assembly checks. The
example syntax requires that corresponding core support; this props change does
not execute or verify a disassembly.

Within a root assembly, collect all stages after TSX expansion, including stages
inside subassemblies. Nesting defines ownership and coordinate frames, not an
automatic execution boundary. A stage named `remove-window` in `cover` can be
referenced from its parent as `cover.remove-window`. Short references resolve
within the owning assembly; qualified references traverse named subassemblies.
Do not guess between ambiguous references.

`prevStageRef` adds an edge from the referenced stage to this stage;
`nextStageRef` adds an edge from this stage to the referenced stage. These are
precedence constraints, not a requirement that stages be immediately adjacent.
Use a stable topological sort, selecting the earliest stage in depth-first TSX
document order among currently eligible stages. Document order is a fallback,
not an additional edge. Without references, stages follow document order.
Operations inside each stage execute sequentially in their authored order.

Core should report unresolved or ambiguous references, duplicate names within a
scope, self-references, cycles, and invalid move targets as check errors. Props
validation cannot resolve these relationships without the assembly tree.

Moves retain their resulting poses across stages. Moving a subassembly carries
all its descendants in their current relative poses. Multiple selected targets
move together using the same stage-owner displacement. Resolve the selected
targets first, then move the union of their descendants: duplicate references or
an overlapping parent/child selection must never apply the displacement twice
to a descendant. At partial motion progress, apply the same fraction of the
displacement to every selected target and descendant, preserving their relative
poses.

When showing explosion guides, capture each distinct explicitly selected target's
anchor before the move and draw its guide to the displaced anchor. Duplicate
references to the same target produce one guide. An explicitly selected parent
and child can each have a guide, while the child still moves only once. Relative
and qualified references resolve by the same rules for both selector forms.

A removed subassembly stays in the scene, and its child stages execute relative
to its displaced frame.
Logical containment is preserved; removal does not hide geometry or require a
detach operation. Evaluation starts from the assembled pose, and viewer scrubbing
must reconstruct this state deterministically rather than repeatedly applying
offsets to a previously evaluated scene.

## Intended automatic assembly checks

Declaring explosion stages should include motion checks in the normal check
pipeline, without a collision-check element. The viewer and checker should use
the same resolved sequence and transforms.

Check each move's full swept path, not only its endpoints or animation frames.
Previously displaced geometry remains an obstacle. Moving a rigid subassembly
checks its constituent solids against external geometry. A move with several
targets checks the union of their moving solids against geometry outside that
selection; a selected child's unmoved siblings remain obstacles. Validate the
initial geometry as well. Bounding boxes can accelerate candidate selection but
must not fill holes or cavities for the final collision decision.

Intentional mating contact needs support through assembly relationships and
tolerances; it must not exempt an entire part pair from path collision checks.
Missing collision geometry or unsupported constraints must produce incomplete
verification rather than a successful result.

Motion errors should identify the qualified stage, move index, moving and blocking
parts, and position along the segment so the viewer can replay the failing pose.
A verified reversible rigid-motion sequence establishes a geometric assembly
path within the modeled constraints. Fastening, cable behavior, tool access,
deformation, and manufacturing tolerances need additional modeling and checks.
