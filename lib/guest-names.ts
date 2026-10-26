export function parseCompanionNames(value: string): string[] {
  return value
    .split(/\r?\n|[;,]/)
    .map(name => name.trim())
    .filter(Boolean);
}

export function serializeCompanionNames(names: string[]): string {
  return names.map(name => name.trim()).filter(Boolean).join("\n");
}
