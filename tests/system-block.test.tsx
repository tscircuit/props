import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  type SystemBlockPageProps,
  type SystemBlockGroupProps,
  type SystemBlockComponentProps,
  type SystemBlockConnectionProps,
  systemBlockProps,
  systemBlockPageProps,
  systemBlockGroupProps,
  systemBlockComponentProps,
  systemBlockConnectionProps,
} from "lib"

test("exports the four systemblock validators through the package namespace", () => {
  expect(systemBlockProps).toEqual({
    page: systemBlockPageProps,
    group: systemBlockGroupProps,
    component: systemBlockComponentProps,
    connection: systemBlockConnectionProps,
  })
})

test("normalizes identities and applies only layout and relationship defaults", () => {
  expect(systemBlockProps.page.parse({ name: " overview " })).toEqual({
    name: "overview",
    direction: "right",
  })
  for (const schema of [systemBlockProps.component, systemBlockProps.group]) {
    expect(schema.parse({ name: " sensor " })).toEqual({ name: "sensor" })
    expect(
      schema.parse({
        name: " sensor ",
        displayName: " Environment sensor ",
        description: " Measures temperature. ",
      }),
    ).toEqual({
      name: "sensor",
      displayName: "Environment sensor",
      description: " Measures temperature. ",
    })
  }
  expect(
    systemBlockProps.connection.parse({ from: " sensor ", to: " mcu " }),
  ).toEqual({ from: "sensor", to: "mcu", kind: "signal", direction: "forward" })
  for (const direction of ["right", "left", "down", "up"] as const) {
    expect(
      systemBlockProps.page.parse({ name: "overview", direction }).direction,
    ).toBe(direction)
  }
  for (const direction of ["forward", "both", "none"] as const) {
    const props = {
      name: " rail ",
      from: "regulator",
      to: "mcu",
      kind: "power",
      label: "3.3 V",
      direction,
    } satisfies SystemBlockConnectionProps
    expect(systemBlockProps.connection.parse(props)).toEqual({
      ...props,
      name: "rail",
    })
  }
})

test("both blocks and groups accept scoped PCB references without resolving them", () => {
  for (const schema of [systemBlockProps.component, systemBlockProps.group]) {
    for (const references of [
      { pcbComponentName: " U1 " },
      { pcbComponentNames: [" U1 ", " C1 ", " U1 "] },
      { pcbSubcircuitName: " power " },
      { pcbSubcircuitName: " power ", pcbComponentName: " U1 " },
      { pcbSubcircuitName: " power ", pcbComponentNames: [" U1 ", " C1 "] },
    ]) {
      const result = schema.parse({ name: "block", ...references })
      expect(result).toEqual({
        name: "block",
        ...Object.fromEntries(
          Object.entries(references).map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.map((name) => name.trim())
              : value.trim(),
          ]),
        ),
      })
    }
  }
})

test("rejects conflicting single and multiple PCB names with a useful field path", () => {
  for (const schema of [systemBlockProps.component, systemBlockProps.group]) {
    for (const pcbComponentNames of [["U1"], ["U2"]]) {
      const result = schema.safeParse({
        name: "block",
        pcbComponentName: "U1",
        pcbComponentNames,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["pcbComponentNames"],
            message:
              "Provide either pcbComponentName or pcbComponentNames, not both",
          }),
        )
      }
    }
  }
})

test("rejects missing identities, invalid reference values, and unsupported modes", () => {
  for (const schema of [
    systemBlockProps.page,
    systemBlockProps.group,
    systemBlockProps.component,
  ]) {
    for (const name of [undefined, "", " ", 123, null]) {
      expect(schema.safeParse({ name }).success).toBe(false)
    }
    expect(schema.safeParse({ name: "valid", displayName: " " }).success).toBe(
      false,
    )
    expect(schema.safeParse({ name: "valid", description: 123 }).success).toBe(
      false,
    )
  }
  for (const schema of [systemBlockProps.component, systemBlockProps.group]) {
    for (const key of ["pcbComponentName", "pcbSubcircuitName"]) {
      for (const value of ["", " ", 1, null, ["U1"]]) {
        expect(schema.safeParse({ name: "valid", [key]: value }).success).toBe(
          false,
        )
      }
    }
    for (const value of [[], [" "], ["U1", 1], [null], "U1", null]) {
      expect(
        schema.safeParse({ name: "valid", pcbComponentNames: value }).success,
      ).toBe(false)
    }
  }
  for (const props of [
    {},
    { from: "sensor" },
    { from: " ", to: "mcu" },
    { from: "sensor", to: null },
    { from: 123, to: "mcu" },
    { from: "sensor", to: "mcu", kind: "electrical" },
    { from: "sensor", to: "mcu", direction: "reverse" },
    { from: "sensor", to: "mcu", label: 123 },
    { from: "sensor", to: "mcu", name: " " },
  ]) {
    expect(systemBlockProps.connection.safeParse(props).success).toBe(false)
  }
  expect(
    systemBlockProps.page.safeParse({
      name: "overview",
      direction: "horizontal",
    }).success,
  ).toBe(false)
})

test("typed TSX preserves nested groups, children, and PCB associations", () => {
  // Props supplies validators and types; core must supply the JSX components.
  const systemblock = {
    page: (props: SystemBlockPageProps) =>
      createElement("systemblock.page", props),
    group: (props: SystemBlockGroupProps) =>
      createElement("systemblock.group", props),
    component: (props: SystemBlockComponentProps) =>
      createElement("systemblock.component", props),
    connection: (props: SystemBlockConnectionProps) =>
      createElement("systemblock.connection", props),
  }
  const sensor = (
    <systemblock.component
      name="sensor"
      pcbComponentName="U2"
      pcbSubcircuitName="sensing"
    />
  )
  const controller = (
    <systemblock.group
      name="controller"
      pcbComponentNames={["U1", "Y1"]}
      pcbSubcircuitName="main"
    >
      <systemblock.component name="mcu" description="Processes samples" />
    </systemblock.group>
  )
  const group = (
    <systemblock.group name="node" pcbSubcircuitName="main">
      {sensor}
      {controller}
    </systemblock.group>
  )
  const page = (
    <systemblock.page name="overview" displayName="Sensor node">
      {group}
      <systemblock.connection
        from="sensor"
        to="mcu"
        label="I2C"
        direction="both"
      />
    </systemblock.page>
  )
  expect(systemBlockProps.page.parse(page.props).children).toBe(
    page.props.children,
  )
  expect(systemBlockProps.group.parse(group.props).children).toBe(
    group.props.children,
  )
  expect(
    systemBlockProps.group.parse(controller.props).pcbComponentNames,
  ).toEqual(["U1", "Y1"])
  expect(systemBlockProps.component.parse(sensor.props)).toEqual({
    name: "sensor",
    pcbComponentName: "U2",
    pcbSubcircuitName: "sensing",
  })
  expect(
    systemBlockProps.group.parse({ name: "empty", children: null }).children,
  ).toBeNull()
})
