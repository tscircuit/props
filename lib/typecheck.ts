export const expectTypesMatch = <T1, T2>(
  shouldBe: T1 extends T2 ? (T2 extends T1 ? true : false) : false,
): void => {}
