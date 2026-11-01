# Face mounting for ordinary parts and subassemblies

This proposal builds on [local CAD placement](assembly-local-placement.md),
proposed in [#966](https://github.com/tscircuit/props/pull/966). It defines and
validates the authoring API; resolving generic-part and subassembly mounts
requires a corresponding core implementation.

## Problem

The 158-part gantry comparison used a native face mount for its printed spindle
clamp. Ordinary rails, machined brackets, and imported STEP parts could not use
the same props. Grouping a Z module did not make the group a mountable unit.
Converting a machined component to `assembly.printedpart` would misrepresent
its material and manufacturing role.

Extend the existing printed-part and motor contract without changing what
those elements mean or adding a second mounting vocabulary.

```tsx
<assembly.device name="GANTRY">
  <assembly.part name="BRIDGE" modelUrl="./bridge.step">
    <assembly.referencesurface
      name="rail"
      plane="xz"
      normalDirection="y-"
      centerYOffset="-20mm"
    />
  </assembly.part>
  <assembly.part
    name="RAIL"
    modelUrl="./rail.step"
    mountedTo="BRIDGE.rail"
    mountFace="base"
    mountGap="0.2mm"
  >
    <assembly.referencesurface name="base" plane="xz" normalDirection="y+" />
  </assembly.part>
</assembly.device>
```

## Accepted inputs, output and defaults

`assembly.part`, `assembly.subassembly`, and its exact `assembly.cadassembly`
alias gain the following props. Printed parts and motors use the same shared
field validators and refinement, preserving their existing behavior.

| Prop | Accepted input | Parsed output | Omission |
| --- | --- | --- | --- |
| `mountedTo` | Nonblank qualified `part.face` string; paired with `mountFace` | Surrounding whitespace trimmed | Absent; no mount |
| `mountFace` | Nonblank name of this element's reference surface; paired with `mountedTo` | Surrounding whitespace trimmed | Absent; no mount |
| `mountGap` | Finite, nonnegative mm number or existing distance-unit string; requires `mountedTo` | Number in mm | Remains absent; means zero clearance in core |

There are no aliases or new material/model defaults. Explicit zero gap is valid.
The existing qualified-reference syntax remains unchanged; props parsing does
not perform selector resolution or require the target to have been declared
earlier. Invalid pairs, negative/nonfinite/unparseable gaps, blank names and
unqualified target strings are rejected.

`AssemblyFaceMountProps` is an exported shared interface. Each element's
existing public validator validates the complete element contract. The shared
field/refinement helpers are implementation details rather than additional
standalone props validators.

## Face and frame semantics

All reference origins are points in mm, in the owner's right-handed local
frame (+X right, +Y top, +Z above). Outward normals and in-plane X tangents are
directions. A face mount fixes the element's complete rigid pose:

- The owner's mating-face origin coincides with the target-face origin plus
  `mountGap` along the target's outward normal.
- The two outward normals oppose.
- Their in-plane X directions align, determining roll as well as shaft/face
  direction.

For reference frames with local +Z as the outward normal, this is equivalent to:

```text
ownerWorld = targetFaceWorld * translate(0, 0, gap) * Rx(180deg)
             * inverse(ownerFaceLocal)
```

Transform normals as directions, not points. This is the existing face-mating
rule, extended to additional owners, not a general constraint solver.
Face alignment does not check bolt-hole patterns, clearances, or collisions.

A generic part supplies faces through `assembly.referencesurface` children.
An imported model is not assumed to contain named mount faces. Its import
alignment remains inside the part frame; mounting does not promote a model
offset to a part transform.

A subassembly may define its own `assembly.referencesurface` children in its
container frame, including when the container has no model. Mounting that frame
must move all descendant assembly geometry together. A child's named face is
not implicitly promoted to a container face; authors declare the container
datum explicitly. Supporting reference-surface ownership by subassemblies is
part of the required core follow-up.

Resolve targets using the containing assembly-device scope and the existing
selector/identity rules. Nested targets and forward declarations must retain
their resolved world frames. Do not choose an arbitrary match or silently fall
back to the world origin for an unresolved mount.

## Conflicts and compatibility

- A mount conflicts with `cadPosition` and `cadRotation`, including explicit
  zero objects. Authors must choose a mount or an explicit local pose. A local
  parent placement still applies to an unmounted container; a mounted element's
  pose is determined by its target's resolved world frame, not an additional
  parent transform applied afterward.
- Motors still reject `shaftFacingDirection` when mounted, and still default to
  `z+` only when unmounted. Their standard/model-selection rules are unchanged.
- `assembly.subassembly` still rejects `connectsTo` at the type boundary; this
  remains an `assembly.screen` prop. Mounting does not revive that old alias.
- Board mounting retains its board-specific nearest-surface semantics and has
  no `mountFace` addition here. Screens, cables, the root device and the
  unnamespaced `cadassembly` receive no new mounting props.
- Fasteners and bolts retain their existing optional `mountFace`, authored
  mounting-origin semantics, and `fastenedTo` alias. They share model/placement
  validation with parts, not the ordinary part's paired-face refinement. Local
  placement inherited from parts is valid only when unfastened; either mounting
  target spelling conflicts with `cadPosition` or `cadRotation`.
- Generic part/subassembly geometry stays optional. Props can preserve
  forward-declared or geometry-less datums; core validates that the selected
  named surfaces exist and can be resolved.

Existing unmounted designs and valid printed-part/motor mounts parse as before.
Adopting the new props on ordinary parts or containers requires a supporting
core version; old core versions may ignore them. Do not reclassify every part
as printed to obtain mounting behavior or STEP output.

## Acceptance cases for core and consumers

1. A rail or machined bracket can mate to a part, printed part, motor, or named
   subassembly datum with the same face/gap rule. Check nonzero clearance and
   roll, not just a coincident origin.
2. Moving/rotating a target parent moves a mounted child and its reference
   surfaces consistently. A mounted subassembly carries its nested X/Z carriages
   without adding world offsets to child datums.
3. Forward-declared targets resolve independently of render order. Missing
   faces, ambiguous selectors, self mounts and cycles fail with readable names.
   Detect cycles that mix attachment and containment, including mounting a
   container to one of its own descendants.
4. Model alignment, local part frames, inherited frames, drawings and exported
   CAD geometry use the same resolved pose. The target's world placement is
   applied once, including for targets outside the owner's immediate container.
5. Existing NEMA face directions, gap parsing and shaft-direction conflicts
   remain unchanged; legacy printed-part and board mounting regressions pass.

The props suite exercises the shared parsing contract across all five element
schemas, explicit-placement conflicts, model-source compatibility, omission,
and motor defaults. The geometry cases above require core tests and are not
implemented by this props-only proposal. Complete assembly STEP export and
analytic curves remain separate exporter/kernel work.
