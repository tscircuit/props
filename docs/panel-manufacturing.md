# Panel manufacturing features

Ray's core issue #5067 requests six independent capabilities. They are reviewed separately: tooling rails, panel holes/fiducials, V-score, tab controls, panel silkscreen, and finished-size validation. Props only describes author intent; Core must implement it before a feature works.

## Tab controls use child elements

```tsx
<panel panelizationMethod="tab-routing" tabCountPerEdge={2}>
  <board name="B1" width="20mm" height="20mm" />
  <paneltabkeepout boardName="B1" edge="top" from="0mm" to="7mm" />
</panel>
```

Ray explicitly requested keep-outs: connector edges and sensitive board areas must not receive breakaway tabs. `<paneltabkeepout>` reserves an inclusive interval of the board edge, not a copper/trace keepout. Automatic tabs whose full span touches the interval are omitted. An explicit tab overlapping it is an error. There is no `tabKeepouts` object prop.

For explicit tabs, omit `tabCountPerEdge` and author children instead:

```tsx
<panel panelizationMethod="tab-routing">
  <board name="B1" width="20mm" height="20mm" />
  <paneltab boardName="B1" edge="right" offset="6mm" />
  <paneltab boardName="B1" edge="left" offset="12mm" />
</panel>
```

`<paneltab>` replaces automatic tabs within its containing panel/subpanel; do not combine it with `tabCountPerEdge`. Omit all controls to retain existing automatic placement. There are no `tabs`, `tabPlacement`, or `sizeConstraints` object props and no aliases for the unpublished proposal.

Core's `Subpanel._generatePanelizationFeatures` reads the child elements and passes their parsed attributes to `generateControlledPanelTabs`. Both elements must be direct panel/subpanel children using `panelizationMethod="tab-routing"`. An omitted `boardName` applies to every contained board; a specified name must match. Count is a positive integer; offsets and intervals are finite nonnegative distances; `to >= from`. Numbers mean mm. Offsets run left-to-right on horizontal edges and bottom-to-top on vertical edges in board/circuit space (+X right, +Y up). Current controls support axis-aligned rectangular boards. Existing `tabLength`, `tabWidth`, and `mouseBites` describe the generated geometry. Invalid/out-of-bounds/overlapping tabs and insufficient router clearance produce readable errors.

## Other features have their own proposals

- **Rails:** `<toolingrail side="left" width="5mm">` identifies a region in existing panel edge padding; children use its local centre. Core's `Toolingrail` supplies its transform and group. It does not silently grow the panel.
- **Holes and fiducials:** reuse existing `<hole>` and `<fiducial>` elements directly inside a panel or supported rail. Core must accept and transform them without fabricating component owners. No new object props are needed.
- **Silkscreen:** reuse `<silkscreentext>` for a panel ID, revision, date, or board names. Core supplies panel ownership and placement; these are not new label configuration objects.
- **V-score:** `panelizationMethod="v_score"` requests labelled fabrication lines from Core's `generatePanelVScoreAnnotations`, on rectangular zero-gap root panels. It does not promise machine-specific tooling or scoring depth.
- **Size validation:** scalar `minWidth`, `maxWidth`, `minHeight`, `maxHeight` let assembly lines reject finished panels outside their conveyor/fixture limits. Core checks finished root-panel dimensions including edge padding. It does not resize or repack. No equipment limits are imposed by default. Bounds must be finite positive distances with ordered min/max pairs. This is separate from tab controls and has its own props and Core PRs.

Examples show proposed APIs, not a claim that unpublished features are already shipped. Each feature's PR records its publication and downstream requirements.
