# Wire harness drawings

A cable manufacturing sheet: both connectors, the pin-to-pin wiring, the cut
length, a wiring list and a numbered parts list. The cable is described once on
`assembly.cable`; the drawing elements only place views of it on a page.

```tsx
<assembly.cable
  name="MOTOR_CABLE"
  from="MOTOR.wireside"
  to=".CONTROLLER > .J_MOTOR"
  model="adaptercable_a(jst_ph_pins6)_b(jst_ph_pins4)"
  length="50mm"
  lengthTolerance="3mm"
  fromConnectorName="H1"
  toConnectorName="H2"
  wireAwg="22awg"
>
  <assembly.cablewire fromPin={1} toPin={1} color="black" />
  <assembly.cablewire fromPin={3} toPin={3} color="black" />
  <assembly.cablewire fromPin={4} toPin={2} color="black" />
  <assembly.cablewire fromPin={6} toPin={4} color="black" />
</assembly.cable>

<assembly.drawing.page size="iso_a4" anchorAlignment="bottom_left">
  <assembly.drawing.titleblock title="PH-6P to PH-4P, UL1007 22AWG, L=50mm" />
  <assembly.drawing.harnessview
    cableRef="MOTOR_CABLE"
    centerX={148.5}
    centerY={148}
    width={230}
    height={76}
    showBalloons
  />
  <assembly.drawing.wiringtable
    cableRef="MOTOR_CABLE"
    title="Wiring"
    paperX={212}
    paperY={98}
    anchorAlignment="top_left"
  />
  <assembly.drawing.bomtable
    partRef="MOTOR_CABLE"
    paperX={5}
    paperY={5}
    anchorAlignment="bottom_left"
  />
  <assembly.drawing.note
    text="100% electrical testing: no shorts, no opens."
    paperX={14}
    paperY={55}
  />
</assembly.drawing.page>
```

## `assembly.cable` additions

| Prop | Accepted input | Parsed output | Omission |
| --- | --- | --- | --- |
| `length` | Positive mm number or distance string | Number in mm | No build length; harness views draw no length dimension |
| `lengthTolerance` | Nonnegative mm number or distance string; requires `length` | Number in mm | Length is dimensioned without a tolerance |
| `fromConnectorName`, `toConnectorName` | Nonblank string | Trimmed | Drawings label the ends `A` and `B` |
| `wireAwg` | Number, or string with an optional `awg` suffix | Number | Wires state their own gauge or none |
| `children` | `assembly.cablewire` elements | Preserved | Wiring is unstated |

`length` is the manufactured length between the two connector wire exits. It is
a build specification: routing, waypoints and slack never change it, and core
does not derive it from the route. All additions are optional; existing cables
parse as before.

## `assembly.cablewire`

One insulated conductor of its parent cable.

| Prop | Accepted input | Parsed output |
| --- | --- | --- |
| `fromPin`, `toPin` | Required. Positive integer, numeric string, or `pinN` label | Positive integer |
| `color` | Nonblank string, e.g. `"black"`, `"red/white"` | Trimmed |
| `awg` | Same as `wireAwg` | Number; omitted inherits the cable's `wireAwg` |
| `name` | Nonblank signal or conductor name, e.g. `"A+"` | Trimmed |

Pins are 1-based contact positions on the cable's own connectors, as defined by
the cableprinter `model`. A cavity with no wire is unpopulated, so the ends may
have different contact counts. Core rejects a pin outside its connector and two
wires on one pin. No wiring is inferred when there are no `cablewire` children.

## Drawing elements

`assembly.drawing.harnessview` draws the cable flattened: from end at left, to
end at right, one line per wire. It takes `cableRef`, `width`, `height` and the
same `centerX`/`centerY`/`leftOfRef`/`rightOfRef`/`aboveRef`/`belowRef` layout
props as `partview`, with the same conflicts. The cable lies flat and untwisted,
so both connectors show the same face: from-end pin 1 is at the top, to-end
pin 1 at the bottom, and a cable wired 1:1 is drawn crossing. Connector
designators, end pin numbers and the length dimension come from the cable.
Connectors are drawn to a common scale; the span between them is not to scale.
`showBalloons` (default `false`) adds item-number callouts for each connector
and for the wire, and requires a `bomtable` on the same page.

`assembly.drawing.wiringtable` lists the wires of `cableRef` in from-pin order.
`title` is an optional heading row.

`assembly.drawing.bomtable` is a numbered parts list. `partRef` selects the
cable or subassembly whose direct BOM children are the rows; omitted, it lists
the top-level BOM of the assembly that owns the page. Balloons show the item
numbers of this table.

Both tables require `paperX`, `paperY` and `anchorAlignment`. `anchorAlignment`
is one of the nine anchor points and names the point of the table that
`paperX`/`paperY` locates; it has no default, so a table's position is never
implied. A table anchored at its bottom edge lists its rows upward from the
heading row.

## Circuit JSON

| TSX | Circuit JSON |
| --- | --- |
| `assembly.cable` additions | `cad_cable.nominal_length`, `length_tolerance`, `from_connector_name`, `to_connector_name` |
| `assembly.cablewire` | `cad_cable_wire`, with inherited gauge resolved |
| `assembly.drawing.harnessview` | `drawing_wiring_harness_view`; `showBalloons` becomes `drawing_balloon` records with resolved text and position |
| `assembly.drawing.wiringtable`, `assembly.drawing.bomtable` | `drawing_table` plus one `drawing_table_cell` per cell, with resolved text, column widths and row heights |

Circuit JSON has one table element. The wiring list and the parts list are
authoring elements only: core resolves their rows into cells, so a renderer
draws text and never looks up wires or BOM items.

For a cable with wires, core derives the BOM children: one housing per end, one
contact per wire end, and one line per distinct wire gauge and color, counted in
cut pieces.

## Follow-ups

- Core emission of the records above, including the derived BOM children.
- cableprinter rejects adapter cables whose ends differ in contact count
  (`adaptercable_a(jst_ph_pins6)_b(jst_ph_pins4)`); it needs to accept them
  when the wiring is stated.
- Branched harnesses, splices, shields, twisted pairs and per-wire lengths.
