export type DuplicateGroup = {
  key: string;
  rowIndexes: number[];
  sample: string[];
};

export type DuplicateReport = {
  totalRows: number;
  uniqueRowCount: number;
  extraRowCount: number;
  duplicateGroupCount: number;
  groups: DuplicateGroup[];
  occurrenceByRow: number[];
  extraRowIndexes: number[];
  inDuplicateGroup: boolean[];
};

export function detectDuplicateRows(
  rows: string[][],
  columnIndexes: number[],
): DuplicateReport {
  if (columnIndexes.length === 0) {
    return {
      totalRows: rows.length,
      uniqueRowCount: rows.length,
      extraRowCount: 0,
      duplicateGroupCount: 0,
      groups: [],
      occurrenceByRow: rows.map(() => 1),
      extraRowIndexes: [],
      inDuplicateGroup: rows.map(() => false),
    };
  }

  const groupsByKey = new Map<string, DuplicateGroup>();
  const occurrenceByRow: number[] = [];
  const extraRowIndexes: number[] = [];

  rows.forEach((row, rowIndex) => {
    const key = buildRowKey(row, columnIndexes);
    const existing = groupsByKey.get(key);
    if (existing) {
      existing.rowIndexes.push(rowIndex);
      occurrenceByRow[rowIndex] = existing.rowIndexes.length;
      extraRowIndexes.push(rowIndex);
      return;
    }

    groupsByKey.set(key, {
      key,
      rowIndexes: [rowIndex],
      sample: columnIndexes.map((columnIndex) => row[columnIndex] ?? ""),
    });
    occurrenceByRow[rowIndex] = 1;
  });

  const groups = [...groupsByKey.values()]
    .filter((group) => group.rowIndexes.length > 1)
    .sort((left, right) => right.rowIndexes.length - left.rowIndexes.length);

  const inDuplicateGroup = occurrenceByRow.map(() => false);
  for (const group of groups) {
    for (const rowIndex of group.rowIndexes) {
      inDuplicateGroup[rowIndex] = true;
    }
  }

  return {
    totalRows: rows.length,
    uniqueRowCount: groupsByKey.size,
    extraRowCount: extraRowIndexes.length,
    duplicateGroupCount: groups.length,
    groups,
    occurrenceByRow,
    extraRowIndexes,
    inDuplicateGroup,
  };
}

function buildRowKey(row: string[], columnIndexes: number[]): string {
  return columnIndexes
    .map((columnIndex) => normalizeCell(row[columnIndex] ?? ""))
    .join("\u0001");
}

function normalizeCell(value: string): string {
  return value.trim();
}
