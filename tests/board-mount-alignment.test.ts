import { expect, test } from "bun:test"
import { type BoardProps, boardProps, boardMountRotation } from "lib"

test("board owns a relative mounting alignment and layer-facing orientation", () => {
  const input: BoardProps = {
    name: "CONTROLLER",
    mountedTo: "NEMA17.backface",
    mountRotationAnchor: "J_USB",
    mountRotation: "calc(NEMA17.wireside-90degcw)",
    mountOrientation: "bottom_layer_toward_mount_face",
    mountGap: "6mm",
  }
  expect(boardProps.parse(input)).toMatchObject({ ...input, mountGap: 6 })
  expect(input.mountGap).toBe("6mm")
  // A toward-facing board can have positive clearance; orientation is not flush.
  expect(boardProps.parse({ ...input, mountGap: 0 }).mountGap).toBe(0)
})

test("mounting rotation accepts qualified identities and safe relative degree expressions", () => {
  for (const mountRotation of [
    "NEMA17.wireside",
    "NEMA17.shaftflat",
    "CONTROLLER.rightedge",
    "DEVICE.MOTOR-1.wireside",
    "calc(NEMA17.wireside)",
    "calc(NEMA17.wireside-90degcw)",
    "calc(NEMA17.wireside + 45.5degccw)",
    "calc(NEMA17.wireside - .5 degcw)",
  ]) {
    expect(boardMountRotation.parse(`  ${mountRotation}  `)).toBe(mountRotation)
  }
  // Case-sensitive component identity must not be lowercased by parsing.
  expect(
    boardProps.parse({ mountRotation: "MotorA.wireside" }).mountRotation,
  ).toBe("MotorA.wireside")
})

test("mountRotationAnchor accepts edges and component paths, without inventing defaults", () => {
  for (const anchor of [
    "topedge",
    "bottomedge",
    "leftedge",
    "rightedge",
    "J_USB",
    "USB_BOARD.J_USB",
    "J-USB",
  ]) {
    expect(
      boardProps.parse({ mountRotationAnchor: ` ${anchor} ` })
        .mountRotationAnchor,
    ).toBe(anchor)
  }
  const parsed = boardProps.parse({ mountedTo: "NEMA17.backface" })
  expect(parsed.mountRotation).toBeUndefined()
  expect(parsed.mountRotationAnchor).toBeUndefined()
  expect(parsed.mountOrientation).toBeUndefined()
  expect(
    boardProps.pick({ mountRotation: true, mountOrientation: true }).parse({}),
  ).toEqual({})
})

test("mount orientation uses explicit layer-toward-mount-face enums", () => {
  for (const orientation of [
    "top_layer_toward_mount_face",
    "bottom_layer_toward_mount_face",
  ] as const) {
    expect(
      boardProps.parse({ mountOrientation: orientation }).mountOrientation,
    ).toBe(orientation)
  }
  for (const mountOrientation of [
    "top_layer_toward",
    "bottom_layer_flush",
    "top_layer_away",
    "faceUp",
    "top_layer_toward_mount_face ",
    null,
    true,
  ]) {
    expect(boardProps.safeParse({ mountOrientation }).success).toBe(false)
  }
})

test("mounting rotation rejects standalone offsets, ambiguous units, executable input and overflow", () => {
  for (const mountRotation of [
    90,
    NaN,
    Infinity,
    "90",
    "90degcw",
    "wireside",
    "NEMA17.",
    "calc(NEMA17.wireside+90)",
    "calc(NEMA17.wireside+90deg)",
    "calc(NEMA17.wireside+90rad)",
    "calc(NEMA17.wireside+-90degcw)",
    "calc(NEMA17.wireside/0)",
    "calc(NEMA17.wireside+alert(1))",
    "calc(NEMA17.wireside+Infinitydegcw)",
    `calc(NEMA17.wireside+${"9".repeat(400)}degcw)`,
    "",
    null,
    {},
  ]) {
    expect(boardProps.safeParse({ mountRotation }).success).toBe(false)
  }
  for (const mountRotationAnchor of [
    "",
    "  ",
    "J USB",
    "calc(J_USB)",
    null,
    90,
    {},
  ]) {
    expect(boardProps.safeParse({ mountRotationAnchor }).success).toBe(false)
  }
})
