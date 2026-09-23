import { describe, expect, test } from "vitest";
import { detectDuplicateRows } from "./detectDuplicateRows";

describe("detectDuplicateRows", () => {
  test("returns no duplicates for an empty array", () => {
    expect(detectDuplicateRows([])).toEqual({
      duplicateCount: 0,
      duplicateRowIndexes: [],
    });
  });

  test("returns no duplicates when every row is unique", () => {
    const rows: Record<string, unknown>[] = [
      { id: 1, name: "Ada" },
      { id: 2, name: "Bo" },
      { id: 3, name: "Chi" },
    ];

    expect(detectDuplicateRows(rows)).toEqual({
      duplicateCount: 0,
      duplicateRowIndexes: [],
    });
  });

  test("reports every row in each duplicate group", () => {
    const rows: Record<string, unknown>[] = [
      { id: 1, city: "Lagos" },
      { id: 2, city: "Abuja" },
      { id: 1, city: "Lagos" },
      { id: 3, city: "Kano" },
      { id: 2, city: "Abuja" },
    ];

    expect(detectDuplicateRows(rows)).toEqual({
      duplicateCount: 4,
      duplicateRowIndexes: [0, 1, 2, 4],
    });
  });

  test("treats the same values as duplicates even when object keys are in a different order", () => {
    const rows: Record<string, unknown>[] = [
      { name: "Ada", city: "Lagos" },
      { city: "Lagos", name: "Ada" },
    ];

    expect(detectDuplicateRows(rows)).toEqual({
      duplicateCount: 2,
      duplicateRowIndexes: [0, 1],
    });
  });
});
