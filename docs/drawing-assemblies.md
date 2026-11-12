# Assembly drawing stages and explosions

`assembly.drawing.stage` names a reusable set of parts. `assembly.drawing.explosion` declares a drawing pose relative to assembled geometry. These are separate from ordered `assembly.explosion.stage` playback: their offsets are simultaneous, world-space, and do not accumulate or execute existing CAD stages.

```tsx
<assembly.drawing.stage name="pcba" boardRefs={[".board"]} partRefs={[".board > .U1", ".board > .BT1"]} />
<assembly.drawing.stage name="rotor" partRefs={[".cap", ".encoder", ".bearing"]} />
<assembly.drawing.stage name="complete" includeStageRefs={[".stationary", ".rotor"]} />
<assembly.drawing.explosion name="join" showTrails moves={[
  { includeStageRefs: [".rotor"], offZ: "40mm" },
]} />
<assembly.drawing.page width="297mm" height="210mm" origin={{ x: "10mm", y: "10mm" }}>
  <assembly.drawing.explosionview name="joinView" stageRef=".complete" explosionRef=".join"
    direction="isometric" width="130mm" height="140mm" centerX="138.5mm" centerY="95mm">
    <assembly.drawing.partlabel partRefs={[".cap"]} text="Rotor"
      anchor={{ x: 0, y: 0, z: "5mm" }} xOffsetFromViewCenter="60mm" yOffsetFromViewCenter="40mm" />
  </assembly.drawing.explosionview>
  <assembly.drawing.note text="Lower the completed rotor" paperX="18.5mm" paperY="185mm" />
</assembly.drawing.page>
```

The surrounding circuit supplies all referenced parts and the stationary stage. Include every fitted component in the PCBA stage; the abbreviated example lists only two. This PR defines and validates the props contract. Resolving selectors and emitting Circuit JSON in `@tscircuit/core` remain follow-up work; the renderer PR contains an executable fixture producer for evaluation.

Accepted inputs and canonical output:

- Selections use nonempty arrays `partRefs`, `boardRefs`, `includeStageRefs`; references are trimmed nonblank strings. Supply at least one selection field. There are no aliases or implicit descendants. Core resolves these to `source_component_ids`, `pcb_board_ids`, `includes_stage_ids`.
- A stage requires a stable `name` and optionally `displayName`. Nested includes form a set and must be acyclic. There is no implicit order or previous-stage accumulation.
- An explosion requires a stable `name` and a nonempty `moves` array. `factor` defaults to 1 and is finite in 0..1. `showTrails` defaults false. Each move requires a selection and at least one of `offX/offY/offZ`; numeric values are CAD-world mm (+Z up), unit strings normalize to mm, omitted axes parse to zero. Core emits a `translation` point. Expanded move targets must not overlap; graph validation is downstream.
- A `partview` accepts exactly one of existing `partRef` or new `stageRef`, and shows assembled geometry. It rejects `explosionRef`.
- An `explosionview` requires both `stageRef` and `explosionRef` (trimmed nonblank selectors), and rejects `partRef`. Core emits `drawing_explosion_view` with its own `drawing_explosion_view_id`, plus `drawing_assembly_stage_id` and `drawing_explosion_id`. No stage or explosion is selected implicitly.
- Both views share direction, positive unit-aware width/height, center defaults, relative sibling placement, hidden edges, section controls, and nested dimension/partlabel annotations. Relative references may target either kind of sibling view. Unit strings normalize to mm; opposing references and explicit coordinates on the same axis conflict.
- Part labels require a selection, nonblank `text`, an explicit assembled-world `anchor`, and a text position for each axis. Use drawing-origin-relative `paperX/paperY` or `xOffsetFromViewCenter/yOffsetFromViewCenter` relative to the parent view. They emit `drawing_part_label` with exactly one parent reference (`drawing_part_view_id` or `drawing_explosion_view_id`); core resolves selection IDs. Anchor coordinates normalize to mm and follow the target's translation; paper text coordinates stay fixed. Selected parts must be visible and share a translation.
- Notes require nonblank `text` and a position per axis using the same absolute/offset fields. A note inside a view uses that view by default; a page-level note with offsets requires `viewRef`. An explicit `viewRef` takes precedence over the enclosing view. Core must resolve exactly one view on the same page and emit its typed ID. `fontSize` is positive paper mm (unit strings accepted), default 2.7mm. They emit `drawing_page_note` under the parent page. Text is plain text, not markup.

This is an unreleased proposal. Migrate the earlier `<assembly.drawing.partview explosionRef="…">` spelling to `<assembly.drawing.explosionview>`; there is no alias. Existing assembled partview usage is unchanged. Separation guides illustrate relationships, not certified insertion paths.

## Drawing origin and view-relative annotation positions

The page accepts `origin={{ x: "10mm", y: "10mm" }}`, measured from the physical sheet's lower-left corner with +X right and +Y up. Both finite numeric mm and unit strings are accepted; values normalize to mm. Omit `origin` to use the sheet center, preserving existing drawings. Origins may lie outside the sheet; drawing content must still fit the physical paper. The page border and title block remain attached to the physical sheet.

`centerX`/`centerY`, annotation `paperX`/`paperY`, and resolved dimension points are relative to this drawing origin. Changing the origin changes their physical placement. It does not transform model anchors or explosion displacements. Core emits `drawing_page.origin` and keeps all resolved paper coordinates relative to it.

For each annotation axis, provide exactly one absolute coordinate or view offset: `paperX` versus `xOffsetFromViewCenter`, and `paperY` versus `yOffsetFromViewCenter`. An explicit zero counts as supplied. Missing axes and both modes on one axis are errors; mixed modes across axes are allowed. There are no position defaults or aliases. Offsets use paper mm (unit strings accepted), independent of model scale or explosion factor. A label always uses its parent view; notes use `viewRef` or their enclosing view. Moving that view moves only the offset-based axes.

Core maps absolute coordinates to `label_position` (labels) or `position` (notes), and offsets to `x_offset_from_view_center`/`y_offset_from_view_center`. Offset axes are omitted from the absolute point. It emits exactly one typed parent-view ID for labels, and a typed view ID for view-relative notes. Registration, selector resolution and emission in core remain follow-up work.
