# Assembly drawing stages and explosions

`assembly.drawing.stage` names a reusable set of parts. `assembly.drawing.explosion` declares a drawing pose relative to assembled geometry. These are separate from ordered `assembly.explosion.stage` playback: their offsets are simultaneous, world-space, and do not accumulate or execute existing CAD stages.

```tsx
<assembly.drawing.stage name="pcba" boardRefs={[".board"]} partRefs={[".board > .U1", ".board > .BT1"]} />
<assembly.drawing.stage name="rotor" partRefs={[".cap", ".encoder", ".bearing"]} />
<assembly.drawing.stage name="complete" includeStageRefs={[".stationary", ".rotor"]} />
<assembly.drawing.explosion name="join" showTrails moves={[
  { includeStageRefs: [".rotor"], offZ: "40mm" },
]} />
<assembly.drawing.page width="297mm" height="210mm">
  <assembly.drawing.partview name="joinView" stageRef=".complete" explosionRef=".join"
    direction="isometric" width="130mm" height="140mm">
    <assembly.drawing.partlabel partRefs={[".cap"]} text="Rotor"
      anchor={{ x: 0, y: 0, z: "5mm" }} paperX="60mm" paperY="40mm" />
  </assembly.drawing.partview>
  <assembly.drawing.note text="Lower the completed rotor" paperX="-120mm" paperY="90mm" />
</assembly.drawing.page>
```

The surrounding circuit supplies all referenced parts and the stationary stage. Include every fitted component in the PCBA stage; the abbreviated example lists only two. This PR defines and validates the props contract. Resolving selectors and emitting Circuit JSON in `@tscircuit/core` remain follow-up work; the renderer PR contains an executable fixture producer for evaluation.

Accepted inputs and canonical output:

- Selections use nonempty arrays `partRefs`, `boardRefs`, `includeStageRefs`; references are trimmed nonblank strings. Supply at least one selection field. There are no aliases or implicit descendants. Core resolves these to `source_component_ids`, `pcb_board_ids`, `includes_stage_ids`.
- A stage requires a stable `name` and optionally `displayName`. Nested includes form a set and must be acyclic. There is no implicit order or previous-stage accumulation.
- An explosion requires a stable `name` and a nonempty `moves` array. `factor` defaults to 1 and is finite in 0..1. `showTrails` defaults false. Each move requires a selection and at least one of `offX/offY/offZ`; numeric values are CAD-world mm (+Z up), unit strings normalize to mm, omitted axes parse to zero. Core emits a `translation` point. Expanded move targets must not overlap; graph validation is downstream.
- A partview accepts exactly one of existing `partRef` or new `stageRef`. `explosionRef` requires `stageRef`; no explosion is selected implicitly. Existing partRef-only usage, direction names and relative page layout are unchanged.
- Part labels require a selection, nonblank `text`, an explicit assembled-world `anchor`, and paper-space `paperX/paperY`. They emit `drawing_part_label` under the parent view; core resolves selection IDs. Anchor coordinates normalize to mm and follow the target's translation; paper text coordinates stay fixed. Selected parts must be visible and share a translation.
- Notes require nonblank `text` and `paperX/paperY`. `fontSize` is positive paper mm (unit strings accepted), default 2.7mm. They emit `drawing_page_note` under the parent page. Text is plain text, not markup.

There are no deprecated fields or migration steps. The additions are opt-in; default behavior for existing drawing props is preserved. Separation guides illustrate relationships, not certified insertion paths.
