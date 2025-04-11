export type ConnectionTarget = string
/**
 * Defines a mapping of strings to connection paths e.g.
 *
 * const connections: Connections = {
 *   GND: ".U1 > .GND",
 *   VCC: ".U1 > .VCC",
 * }
 *
 * Connections are used as both inputs and outputs. For example, you might
 * receive connections when using `sel` to select a chip.
 *
 * const u1Connections = sel.U1(MyChip)
 *
 * You can also define a module with connections like this:
 *
 * export const MyModule = (props: { connections: { GND: string, VCC: string } }) => {
 *   return (
 *     <group>
 *       <capacitor name="C1" connections={{
 *         anode: props.connections.GND,
 *         cathode: props.connections.VCC,
 *       }} />
 *     </group>
 *   )
 * }
 */
export type Connections<PinLabel extends string = string> = Partial<
  Record<
    PinLabel,
    ConnectionTarget | ConnectionTarget[] | readonly ConnectionTarget[]
  >
>

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
 *
 * A user can also use selectors to define the connections, this is helpful when
 * there's multiple chips in the group.
 *
 * ```tsx
 * const MyModule = (props: {
 *   selectors: {
 *     U1: { GND: string, VCC: string },
 *     R1: { GND: string, VCC: string }
 *   }
 * }) => {
 *   return (
 *     <group>
 *       <resistor name="R1" connections={{
 *         pin1: props.selectors.R1.GND,
 *         pin2: props.selectors.R1.VCC,
 *       }} />
 *       <capacitor name="C1" connections={{
 *         anode: props.selectors.U1.GND,
 *         cathode: props.selectors.U1.VCC,
 *       }} />
 *     </group>
 *   )
 * }
 * ```
 *
 * These selectors can also be used with "sel":
 *
 * sel.M1(MyModule).U1.GND // ".M1 > .C1 > .anode"
 */
export type Selectors = Record<string, Connections>
