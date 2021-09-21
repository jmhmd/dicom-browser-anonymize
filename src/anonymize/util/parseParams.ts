export default function parseParams(functionString: string) {
  const paramMatch = functionString.match(/\(([^,]+)(?:,([^,]+))?(?:,([^,]+))?(?:,([^,]+))?\)/);
  if (!paramMatch) {
    throw new Error(`Rule function '${functionString}' did not parse parameters correctly.`);
  }
  let [, ...params] = paramMatch;
  return params;
}
