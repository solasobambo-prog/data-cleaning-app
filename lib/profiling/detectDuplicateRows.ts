export type DuplicateRowsResult = {
  duplicateCount: number;
  duplicateRowIndexes: number[];
};

/**
 * Finds rows that share identical values across all columns.
 * Column key order on each object is ignored so `{ a: 1, b: 2 }` matches `{ b: 2, a: 1 }`.
 * Every index in a duplicate group is reported, sorted ascending.
 */
export function detectDuplicateRows(
  rows: Record<string, unknown>[],
): DuplicateRowsResult {
  const indexesBySignature = new Map<string, number[]>();

  for (let index = 0; index < rows.length; index += 1) {
    const signature = rowSignature(rows[index]);
    const indexes = indexesBySignature.get(signature);
    if (indexes) {
      indexes.push(index);
    } else {
      indexesBySignature.set(signature, [index]);
    }
  }

  const duplicateRowIndexes: number[] = [];
  for (const indexes of indexesBySignature.values()) {
    if (indexes.length > 1) {
      duplicateRowIndexes.push(...indexes);
    }
  }

  duplicateRowIndexes.sort((left, right) => left - right);

  return {
    duplicateCount: duplicateRowIndexes.length,
    duplicateRowIndexes,
  };
}

function rowSignature(row: Record<string, unknown>): string {
  const keys = Object.keys(row).sort();
  return keys
    .map((key) => `${escapeSegment(key)}:${stableValue(row[key])}`)
    .join("\u0001");
}

function stableValue(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "string") {
    return `s:${escapeSegment(value)}`;
  }
  if (typeof value === "number") {
    return `n:${Object.is(value, -0) ? "-0" : String(value)}`;
  }
  if (typeof value === "boolean") {
    return `b:${value}`;
  }
  if (typeof value === "bigint") {
    return `bi:${value.toString()}`;
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableValue(entry)).join(",")}]`;
  }
  if (typeof value === "object") {
    const nested = value as Record<string, unknown>;
    const keys = Object.keys(nested).sort();
    return `{${keys
      .map((key) => `${escapeSegment(key)}:${stableValue(nested[key])}`)
      .join(",")}}`;
  }
  return `x:${escapeSegment(String(value))}`;
}

function escapeSegment(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/:/g, "\\:");
}
