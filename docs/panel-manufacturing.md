# Panel manufacturing props

These props express the six manufacturing requests in [Core #5067](https://github.com/tscircuit/core/issues/5067). Props validates author input; [Core #5081](https://github.com/tscircuit/core/pull/5081) consumes the parsed values to generate or check the panel. The feature requires that Core implementation and the published schema prerequisite. Merging props alone does not make the feature available downstream.

## Why panel size limits exist

An assembly line can have both a minimum panel size, needed for conveyor rails or fixtures to hold it, and a maximum size that fits its equipment. A panel that is too small can therefore be just as unsuitable as one that is too large. Ray explicitly requested both limits.

`minWidth`, `maxWidth`, `minHeight` and `maxHeight` are optional checks on the **finished outer panel dimensions, including edge padding**. They are separate from `width` and `height`, which set dimensions, and from `cellWidth` and `cellHeight`, which affect grid cells. A limit reports an unsuitable result; it does not resize, pad, repack or scale the panel.

These limits belong on the root `<panel>`; Core rejects them on `<subpanel>` rather than silently ignoring them.

There are no default manufacturing limits. Use limits supplied by the actual assembly line or fabricator; the numbers below are examples, not universal manufacturing requirements. Core's `Panel.doInitialPanelLayout()` compares the final `pcb_panel` dimensions with each supplied bound and emits the existing `pcb_panelization_placement_error` diagnostic if a bound is exceeded.

```tsx
<panel
  layoutMode="grid"
  edgePadding="5mm"
  minWidth="50mm"
  maxWidth="250mm"
  minHeight="40mm"
  maxHeight="200mm"
>
  <board name="CONTROL" width="60mm" height="40mm" />
</panel>
```

The example's single board and padding produce a 70 × 50 mm panel, within the stated limits. A smaller panel stays smaller and receives a diagnostic instead of being silently enlarged.

## Tabs: count or explicit tabs

The public type is `PanelTab`. Each tab is a flat record with `edge`, `offset`, and an optional `boardName`.

| Prop | Purpose | Core consumer |
| --- | --- | --- |
| `tabCountPerEdge` | Request a positive integer number of evenly spaced tabs on each edge of each rectangular board. | `generateControlledPanelTabs()` chooses the centres. |
| `tabs` | Specify individual tab centres. Replaces automatic tabs; `[]` requests no tabs. | The same helper resolves board names and edge offsets. |
| `tabKeepouts` | Exclude edge intervals from the entire tab span. | The helper omits conflicting automatic tabs and rejects conflicting explicit tabs. |
| `tabLength`, `tabWidth`, `mouseBites` | Existing controls for tab span, routed-slot width and perforations. | The tab helpers generate cutouts and optional mouse-bite holes. |

`tabCountPerEdge` and `tabs` cannot be supplied together, even when `tabs` is empty. Keepouts can accompany either mode. If all three new tab-control props are omitted, Core keeps its existing automatic-tab path.

Distances accept millimetre numbers or unit strings such as `"6mm"`. Offsets run from left to right on horizontal edges, and bottom to top on vertical edges. Omitting `boardName` applies a record to all matching rectangular boards; supplying it targets that board's stable name. A keepout's `from` and `to` are inclusive, nonnegative edge offsets, with `to >= from`.

```tsx
<panel
  layoutMode="grid"
  panelizationMethod="tab-routing"
  boardGap="2mm"
  tabLength="3mm"
  tabCountPerEdge={2}
  tabKeepouts={[
    { boardName: "CONTROL", edge: "top", from: "0mm", to: "7mm" },
  ]}
>
  <board name="CONTROL" width="20mm" height="20mm" />
</panel>
```

For explicit tabs, replace `tabCountPerEdge` with a flat array:

```tsx
tabs={[
  { boardName: "CONTROL", edge: "top", offset: "10mm" },
  { boardName: "CONTROL", edge: "bottom", offset: "10mm" },
]}
```

Core checks unknown board names, tabs outside the edge, overlapping tabs, keepouts and space for the configured router width. These explicit controls currently require axis-aligned rectangular boards. They do not promise automatic copper-aware tab relocation or acceptance by every manufacturer.

## Rails, tooling holes and fiducials

`edgePadding` already defines the panel frame. A `<toolingrail>` identifies a side of that existing frame and supplies a convenient local origin for its children. It does not add a second frame or enlarge the panel.

- `side` is required: `top`, `right`, `bottom` or `left`.
- `width` is a positive distance across the rail, and must fit the selected edge padding.
- Child coordinates are relative to the rail centre, in millimetres, with +X right and +Y up. Core's `Toolingrail` resolves that origin from the panel dimensions and padding, then uses the normal group transforms.

```tsx
<panel layoutMode="grid" edgePadding="5mm">
  <board width="60mm" height="40mm" />
  <toolingrail name="LEFT_RAIL" side="left" width="5mm">
    <hole diameter="3mm" pcbY={-10} />
    <fiducial name="F1" padDiameter="1mm" pcbY={10} />
  </toolingrail>
  <silkscreentext text="PANEL A / REV 1" pcbY={23} fontSize={0.8} />
</panel>
```

`<hole>`, `<fiducial>` and `<silkscreentext>` already have their own props. Core must allow them under a panel or rail and emit their panel/group ownership without inventing a component reference. No duplicate `panelHole`, `panelFiducial` or panel-text configuration object is needed. Authors supply identifiers, board names, revisions or dates as ordinary text; Core does not insert a changing timestamp.

## V-score

`panelizationMethod="v_score"` requests straight fabrication-note score lines for a root panel of rectangular boards. Core uses zero board gap when the gap is omitted, rejects a nonzero gap and rejects nonrectangular or crossing score geometry. `generatePanelVScoreAnnotations()` emits the paths and readable labels. [KiCad #828](https://github.com/tscircuit/circuit-json-to-kicad/pull/828) exports panel-level paths on fabrication layers.

```tsx
<panel layoutMode="grid" row={2} col={2} panelizationMethod="v_score">
  {boards}
</panel>
```

V-score output is a fabrication drawing. It does not specify machine instructions, cutter settings or process depth, and it does not create mouse bites.

## Input and compatibility rules

The props remain flat: size bounds are scalar panel attributes, and tab/keepout arrays contain flat records. Physical strings normalize to millimetres. Bounds must be finite and positive, with each maximum at least its corresponding minimum. Counts must be positive integers. Existing panelization spellings, including `tab-routing` and `outline_routing`, remain supported; the new spelling is `v_score`.

New controls have no manufacturing defaults or compatibility aliases. Omitting them keeps existing behavior. Consumers must validate geometry-dependent conditions in Core, where final board positions and panel dimensions are available; props validation cannot determine those conditions on its own.
