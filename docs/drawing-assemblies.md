# Assembly drawing stages and explosions

`assembly.drawing.stage` names a reusable set of parts for assembled part views. An `assembly.drawing.explosionview` references an existing `assembly.explosion.stage` and inherits its `assembly.explosion.move` children. Authors define the motion once in the assembly; drawing views only select the stage and control its presentation with `factor` and `showTrails`.

```tsx
<assembly.device name="counter">
  {/* The circuit supplies the base and the populated rotor subassembly. */}
  <assembly.explosion.stage name="lift-rotor">
    <assembly.explosion.move targetRefs="rotor" offZ="40mm" />
  </assembly.explosion.stage>
  <assembly.drawing.page width="297mm" height="210mm" anchorAlignment="bottom_left">
    <assembly.drawing.explosionview name="joinView" stageRef="lift-rotor" showTrails
      direction="isometric" width="130mm" height="140mm" centerX="148.5mm" centerY="105mm">
      <assembly.drawing.partlabel partRefs={[".rotor"]} text="Rotor"
        anchor={{ x: 0, y: 0, z: "5mm" }} xOffsetFromViewCenter="60mm" yOffsetFromViewCenter="40mm" />
    </assembly.drawing.explosionview>
    <assembly.drawing.note text="Lower the completed rotor" paperX="28.5mm" paperY="195mm" />
  </assembly.drawing.page>
</assembly.device>
```

This PR defines and validates the props contract. Resolving stage references and emitting Circuit JSON in `@tscircuit/core` remain follow-up work; the renderer PR contains an executable fixture producer for evaluation.

Accepted inputs and canonical output:

- Selections use nonempty arrays `partRefs`, `boardRefs`, `includeStageRefs`; references are trimmed nonblank strings. Supply at least one selection field. There are no aliases or implicit descendants. Core resolves these to `source_component_ids`, `pcb_board_ids`, `includes_stage_ids`.
- A drawing membership stage requires a stable `name` and optionally `displayName`. Nested includes form a set and must be acyclic. There is no implicit order or previous-stage accumulation.
- An explosion view requires a trimmed nonblank `stageRef` identifying an `assembly.explosion.stage`. It inherits that stage's move children rather than accepting a `moves` prop. Short names resolve within the owning assembly; qualified names such as `rotor.lift-cap` address stages inside subassemblies, following the existing [assembly explosion reference rules](./proposals/assembly-explosion.md). There is no default stage or reference alias.
- `factor` defaults to 1 and is finite in 0..1; 0 shows assembled placement and 1 the resolved stage pose. `showTrails` defaults false. Several views can reference one stage with different presentation settings without copying or changing its moves.
- An `explosionview` rejects `moves`, `partRef` and the removed `explosionRef`. It shows geometry from the referenced explosion stage's owning assembly, including stationary parts for context. A drawing membership stage is not an explosion stage and cannot supply its motion; core must reject references to the wrong element kind, missing/ambiguous stages and stages without moves.
- A `partview` accepts exactly one of `partRef` or `stageRef`, and shows assembled geometry. Its `stageRef` still selects an `assembly.drawing.stage` membership set. It rejects explosion settings.
- Both views share direction, positive unit-aware width/height, center defaults, relative sibling placement, hidden edges, section controls, and nested dimension/partlabel annotations. Relative references may target either kind of sibling view. Unit strings normalize to mm; opposing references and explicit coordinates on the same axis conflict.
- Part labels require a selection, nonblank `text`, an explicit assembled-world `anchor`, and a text position for each axis. Use page-anchor-relative `paperX/paperY` or `xOffsetFromViewCenter/yOffsetFromViewCenter` relative to the parent view. They emit `drawing_part_label` with exactly one parent reference (`drawing_part_view_id` or `drawing_explosion_view_id`); core resolves selection IDs. Anchor coordinates normalize to mm and follow the target's translation; paper text coordinates stay fixed. Selected parts must be visible and share a translation.
- Notes require nonblank `text` and a position per axis using the same absolute/offset fields. A note inside a view uses that view by default; a page-level note with offsets requires `viewRef`. An explicit `viewRef` takes precedence over the enclosing view. Core must resolve exactly one view on the same page and emit its typed ID. `fontSize` is positive paper mm (unit strings accepted), default 2.7mm. They emit `drawing_page_note` under the parent page. Text is plain text, not markup.

## Circuit JSON emission

The authoring API and renderer records serve different purposes. Core must resolve the referenced assembly explosion stage using the existing ordered, incremental move semantics and assembly-owner coordinate frames. Evaluate the sequence through that stage from assembled placement, including preceding stages, then flatten the resulting per-part displacements into CAD-world translations. Repeated targets and parent/child moves must resolve to one final translation per part; do not forward overlapping incremental moves directly to the renderer.

Core emits a `drawing_assembly_stage` for the stage owner's visible geometry and a `drawing_explosion_view` with that membership ID, resolved `moves`, `factor` and `show_trails`. Apply the drawing factor once to the resolved translations. The merged Circuit JSON schema retains its nonempty `moves` array as compiled data; it is not a TSX prop. The renderer consumes these resolved simultaneous translations rather than scheduling assembly stages itself. Props validation preserves `stageRef` and checks scalar settings; it cannot resolve an assembly tree or synthesize move data.

## Migration

From props #1009, remove `<assembly.drawing.explosion>` and `explosionRef`. From the earlier inline proposal, remove the view's `moves` prop. Author the movements as `<assembly.explosion.move>` children of `<assembly.explosion.stage>` and point the view's `stageRef` at that explosion stage. Convert drawing-only selections to the corresponding assembly part/subassembly `targetRefs`; do not point the view at the old drawing membership stage. Keep `factor` and `showTrails` on each view. The standalone drawing explosion schema/type and the drawing move helper are removed; there is no compatibility alias. Existing assembled partview usage is unchanged. Separation guides illustrate relationships, not certified insertion paths.

## Page anchor alignment and view-relative annotation positions

The page accepts `anchorAlignment="bottom_left"`, using the same nine-point enum as board `anchorAlignment`: `top_left`, `top_center`, `top_right`, `center_left`, `center`, `center_right`, `bottom_left`, `bottom_center`, and `bottom_right`. Omit it to use `center`, preserving existing drawings. The named location on the sheet becomes (0, 0); axes stay +X right and +Y up, so coordinates below a top anchor are negative Y. The anchor is resolved after sheet size and orientation. No arbitrary coordinate or `origin` prop is supported.

`centerX`/`centerY`, annotation `paperX`/`paperY`, and resolved dimension points are relative to this page anchor. Model anchors and explosion displacements are unaffected. Border and title-block placement stays sheet-relative. Core emits `drawing_page.anchor_alignment`. This replaces the unreleased numeric-origin proposal; it is not an alias.

For each annotation axis, provide exactly one absolute coordinate or view offset: `paperX` versus `xOffsetFromViewCenter`, and `paperY` versus `yOffsetFromViewCenter`. An explicit zero counts as supplied. Missing axes and both modes on one axis are errors; mixed modes across axes are allowed. There are no position defaults or aliases. Offsets use paper mm (unit strings accepted), independent of model scale or explosion factor. A label always uses its parent view; notes use `viewRef` or their enclosing view. Moving that view moves only the offset-based axes.

Core maps absolute coordinates to `label_position` (labels) or `position` (notes), and offsets to `x_offset_from_view_center`/`y_offset_from_view_center`. Offset axes are omitted from the absolute point. It emits exactly one typed parent-view ID for labels, and a typed view ID for view-relative notes. Registration, selector resolution and emission in core remain follow-up work.
