# Panel manufacturing features

Panel manufacturing controls cover tooling rails, holes and fiducials, tab placement, silkscreen, and finished-size validation. Props describe author intent.

## Tab controls use child elements

```tsx
<panel panelizationMethod="tab-routing" tabCountPerEdge={2}>
  <board name="B1" width="20mm" height="20mm" />
  <paneltabkeepout boardName="B1" boardEdge="top" from="0mm" to="7mm" />
</panel>
```

Connector edges and sensitive board areas may require sections without breakaway tabs. `<paneltabkeepout>` reserves an inclusive interval of the board edge, not a copper/trace keepout. Automatic tabs whose full span touches the interval are omitted. An explicit tab overlapping it is an error. There is no `tabKeepouts` object prop.

For explicit tabs, omit `tabCountPerEdge` and author children instead:

```tsx
<panel panelizationMethod="tab-routing">
  <board name="B1" width="20mm" height="20mm" />
  <paneltab boardName="B1" boardEdge="right" centerOffsetFromBoardTopEdge="6mm" />
  <paneltab boardName="B1" boardEdge="top" centerOffsetFromBoardLeftEdge="12mm" tabWidth="3mm" />
</panel>
```

`<paneltab>` replaces automatic tabs within its containing panel/subpanel; do not combine it with `tabCountPerEdge`. Omit all controls to retain existing automatic placement.

Both elements must be direct panel/subpanel children using `panelizationMethod="tab-routing"`. An omitted `boardName` applies to every contained board; a specified name must match. A `<paneltab>` gives exactly one offset to its centre, measured from the board edge it names: `centerOffsetFromBoardTopEdge` or `centerOffsetFromBoardBottomEdge` for a tab on the left or right edge, and `centerOffsetFromBoardLeftEdge` or `centerOffsetFromBoardRightEdge` for a tab on the top or bottom edge. Its optional `tabWidth` is that tab's width along the board edge and defaults to the panel's `tabLength`. Count is a positive integer; offsets and keepout intervals are finite nonnegative distances; `tabWidth` is positive; `to >= from`. Numbers mean mm. Keepout intervals run left-to-right on horizontal edges and bottom-to-top on vertical edges in board/circuit space (+X right, +Y up). Current controls support axis-aligned rectangular boards. Existing `tabLength`, `tabWidth`, and `mouseBites` describe the generated geometry. Invalid/out-of-bounds/overlapping tabs and insufficient router clearance produce readable errors.

## Other panel manufacturing features

- **Rails:** `<toolingrail panelSide="left" width="5mm">` identifies a region in existing panel edge padding; children use its local centre. It does not silently grow the panel.
- **Holes and fiducials:** reuse existing `<hole>` and `<fiducial>` elements directly inside a panel or supported rail. No new object props are needed.
- **Silkscreen:** reuse `<silkscreentext>` for a panel ID, revision, date, or board names. These are not new label configuration objects.
- **Size limits:** scalar `minWidth`, `maxWidth`, `minHeight`, `maxHeight` keep finished root panels within assembly-line conveyor/fixture limits. Finished dimensions include edge padding. A grid layout picks rows and columns to fit the maximums, an auto-sized panel grows to the minimums, and limits no layout can meet are reported. No equipment limits are imposed by default. Bounds must be finite positive distances with ordered min/max pairs.
