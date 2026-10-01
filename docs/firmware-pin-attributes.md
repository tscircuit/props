# Firmware pin attributes

Firmware configuration uses the existing `pinAttributes` API on the MCU chip.
Use `isInput` or `isOutput` for GPIO direction and `activeCapability` for a
selected peripheral. `isGpio`, `capabilities`, and `canUse*` describe hardware
capabilities; they do not by themselves select a firmware configuration.

`initialOutputState` accepts `"low"` or `"high"` and describes the level after
GPIO driver initialization, not the pin's silicon reset state. `interruptTrigger`
accepts `"none"`, `"rising"`, `"falling"`, or `"both"`; selecting a trigger does
not generate an application interrupt handler.

Declare `i2cMaxBitRate` on the configured MCU SCL pin. Numbers are bits/s.
Strings such as `"100kbps"`, `"100 kbit/s"`, and `"0.1Mbps"` normalize to
`100000`. Positive finite integer bit rates are accepted. Unitless strings and
frequency units are rejected. This is a bus maximum; application code still
selects its operating speed.

`doNotConfigure: true` explicitly leaves a pin outside generated firmware
configuration, for example for debug ownership. It is distinct from
`doNotConnect`, which describes electrical connectivity.

Chip-level `firmwareRtos` accepts `"nortos"` or `"freertos"`;
`firmwareLfClockSource` accepts `"internal_rc"` or `"external_crystal"`.
These describe author choices, not promises of exporter support.

All new props are optional and have no inferred default or alias. Missing
firmware settings do not prevent normal circuit rendering. Exporters validate
required settings, supported target modes, conflicting direction/drive/pull
choices, and pin ownership. Preserve explicit `false` and `"none"`; neither is
equivalent to a missing declaration. Existing boards remain parseable unchanged.
