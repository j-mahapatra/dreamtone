function removeNullAndUndefinedKeys(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => value !== null && value !== undefined,
    ),
  );
}
export { removeNullAndUndefinedKeys };
