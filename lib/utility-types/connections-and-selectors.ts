/**


Sometimes people want to define subcircuit modules, or collections of chips in
a group then have a prop that represents all the connections to the internal
components.

There are two ways to do this, via "selectors" or "connections". You can use
either to make it easy to connect up to modules.

A module will export connections like so:

export const MyModule = (props: { connections: { GND: string, VCC: string } }) => {
  return (
    <group>
      <capacitor name="C1" connections={{
        anode: props.connections.GND,
        cathode: props.connections.VCC,
      }} />
    </group>
  )
}

Later, the user may use "sel" to reference the connections:

sel.M1(MyModule).GND // ".M1 > .C1 > .anode"


A user can also use selectors to define the connections, this is helpful when
there's multiple chips in the group.

```tsx
const MyModule = (props: {
  selectors: {
    U1: { GND: string, VCC: string },
    R1: { GND: string, VCC: string }
  }
}) => {
  return (
    <group>
      <resistor name="R1" connections={{
        pin1: props.selectors.R1.GND,
        pin2: props.selectors.R1.VCC,
      }} />
      <capacitor name="C1" connections={{
        anode: props.selectors.U1.GND,
        cathode: props.selectors.U1.VCC,
      }} />
    </group>
  )
}
```

These selectors can also be used with "sel":

sel.M1(MyModule).U1.GND // ".M1 > .C1 > .anode"

*/

// export type ConnectionNames<T extends > =

/**
 * Defines a mapping of strings to connection paths e.g.
 *
 * const connections: Connections = {
 *   GND: ".U1 > .GND",
 *   VCC: ".U1 > .VCC",
 * }
 */
export type Connections = Record<string, string>

/**
 * Defines a mapping of strings (usually chip names) to connections e.g.
 *
 * const selectors: Selectors = {
 *   U1: { GND: ".U1 > .GND", VCC: ".U1 > .VCC" },
 *   U2: {
 *     GND: ".U2 > .pin1",
 *     VCC: ".U2 > .pin2",
 *     CUSTOM_DATA_1: ".U2 > .pin3",
 *     CUSTOM_DATA_2: ".U2 > .pin4",
 *   },
 * }
 */
export type Selectors = Record<string, Connections>
