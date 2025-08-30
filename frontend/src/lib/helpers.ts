function removeNullAndUndefinedKeys(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => value !== null && value !== undefined,
    ),
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { removeNullAndUndefinedKeys, capitalizeFirstLetter };
