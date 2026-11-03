# System block diagrams

System blocks describe what a circuit does: functional blocks, subsystem groups,
and labeled relationships. They are intended for a System tab in runframe, with
automatic layout and an eventual `system_block_*` representation in Circuit JSON.

This package supplies the prop types and Zod validators only. The `systemblock`
JSX components, graph validation, Circuit JSON records, layout, and runframe viewer
require follow-up changes in their respective packages.

## Authoring model

| Element | Meaning |
| --- | --- |
| `systemblock.page` | A named overview with an automatic layout direction |
| `systemblock.group` | A subsystem boundary; may contain nested groups |
| `systemblock.component` | A functional block with an optional purpose description |
| `systemblock.connection` | A labeled relationship between components in the same page |

`name` is stable identity. `displayName` supplies human-facing text, falling back
to `name` in a consumer. `description` explains a page, group, or block's purpose.
Connections use `label` for interface annotations such as I2C or 3.3 V, not identity.

Page names must be unique within the circuit. Component and group names must be
unique across their page, including nested groups. Connections refer to component
names using `from` and `to`; grouping does not introduce a new name scope. Optional
connection names must be unique among connections within the page. Endpoint lookup,
name uniqueness, missing PCB targets, and group structure are consumer validations;
these individual prop schemas do not inspect the graph or resolve references.

Blocks may represent an IC, several components, an external device, or a conceptual
function. They do not require physical components, pin declarations, or coordinates.
Connections do not create electrical traces or nets. PCB associations are metadata
for inspection/navigation; they do not place components or change connectivity.

## PCB references on components and groups

Both `SystemBlockComponentProps` and `SystemBlockGroupProps` extend
`SystemBlockPcbReferenceProps`:

| Prop | Accepted input and meaning |
| --- | --- |
| `pcbComponentName` | Nonblank string naming one PCB component |
| `pcbComponentNames` | Nonempty array of nonblank strings naming several PCB components |
| `pcbSubcircuitName` | Nonblank string naming the subcircuit in which those components are resolved; used alone, associates the entire subcircuit |

All three props are optional. `pcbComponentName` and `pcbComponentNames` are
mutually exclusive, even if they identify the same component. Either can be
combined with `pcbSubcircuitName`. Without an explicit subcircuit, the consumer
resolves names in the owning circuit scope. These values are names, not selectors.
Group associations do not implicitly populate or override their children's props.

Parsing trims reference strings and preserves the singular/plural field supplied.
Array order and duplicates are preserved; consumers may highlight their union.
The parser neither resolves references nor supplies PCB defaults.

## Example target JSX

The following illustrates the intended authoring API once core supplies the
`systemblock` namespace; `@tscircuit/props` does not export JSX components.

```tsx
<systemblock.page name="overview" displayName="Wireless sensor node">
  <systemblock.group name="power" displayName="Power supply" pcbSubcircuitName="power">
    <systemblock.component name="usb" displayName="USB-C input"
      description="Receives 5 V from an external supply" pcbComponentName="J1"
      pcbSubcircuitName="power" />
    <systemblock.component name="regulator" displayName="3.3 V regulator"
      description="Provides a stable rail for the electronics"
      pcbComponentNames={["U1", "L1", "C1", "C2"]} pcbSubcircuitName="power" />
  </systemblock.group>

  <systemblock.group name="node" displayName="Sensing and communication"
    pcbComponentNames={["U2", "U3", "U4"]} pcbSubcircuitName="main">
    <systemblock.component name="sensor" displayName="Environment sensor"
      description="Measures temperature and humidity"
      pcbComponentName="U2" pcbSubcircuitName="main" />
    <systemblock.component name="mcu" displayName="Microcontroller"
      description="Samples, processes, and schedules readings"
      pcbComponentName="U3" pcbSubcircuitName="main" />
    <systemblock.component name="radio" displayName="Radio module"
      description="Transmits measurements to a gateway"
      pcbComponentName="U4" pcbSubcircuitName="main" />
  </systemblock.group>

  <systemblock.connection from="usb" to="regulator" label="5 V" kind="power" />
  <systemblock.connection from="regulator" to="sensor" label="3.3 V" kind="power" />
  <systemblock.connection from="regulator" to="mcu" label="3.3 V" kind="power" />
  <systemblock.connection from="regulator" to="radio" label="3.3 V" kind="power" />
  <systemblock.connection from="sensor" to="mcu" label="I2C" direction="both" />
  <systemblock.connection from="mcu" to="radio" label="SPI" direction="both" />
</systemblock.page>
```

## Validation and canonical output

```ts
import { systemBlockProps, type SystemBlockComponentProps } from "@tscircuit/props"

const input: SystemBlockComponentProps = {
  name: " regulator ",
  displayName: "3.3 V regulator",
  pcbComponentNames: [" U1 ", "L1"],
  pcbSubcircuitName: " power ",
}

systemBlockProps.component.parse(input)
// { name: "regulator", displayName: "3.3 V regulator",
//   pcbComponentNames: ["U1", "L1"], pcbSubcircuitName: "power" }

systemBlockProps.page.parse({ name: "overview" })
// { name: "overview", direction: "right" }

systemBlockProps.connection.parse({ from: "sensor", to: "mcu" })
// { from: "sensor", to: "mcu", kind: "signal", direction: "forward" }
```

- Required names and endpoint references are trimmed nonblank strings. Optional
  `displayName` and connection `name` follow the same rule. Descriptions and
  connection labels are optional strings preserved verbatim, including empty text.
- Page `direction` accepts `right`, `left`, `down`, or `up` and defaults to `right`.
- Connection `kind` accepts `signal` or `power` and defaults to `signal`.
- Connection `direction` accepts `forward` (from → to), `both`, or `none` and
  defaults to `forward`. Reverse a connection by exchanging `from` and `to`.
- Children on pages and groups are preserved unchanged. Other optional fields
  remain absent when omitted; explicit `null` is invalid except as a React child.
- Schemas strip unknown keys, matching Zod object behavior elsewhere in the
  package. There are no aliases, including no `title` alias for `displayName`.
- Exported `SystemBlock*Props` and `SystemBlock*PropsInput` describe accepted
  inputs. Use `z.output<typeof systemBlockPageProps>` or the corresponding
  validator when a type with materialized defaults is needed.
- This is an additive API with no changes to existing component props or migrations.
