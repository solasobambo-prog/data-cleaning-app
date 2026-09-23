export type ParsedTable = {
  headers: string[];
  rows: string[][];
};

export function parseCsv(text: string): ParsedTable {
  const records = splitCsvRecords(text);
  if (records.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = records[0].map((header, index) =>
    header.trim() === "" ? `Column ${index + 1}` : header.trim(),
  );
  const columnCount = headers.length;
  const rows = records
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const padded = row.slice(0, columnCount);
      while (padded.length < columnCount) {
        padded.push("");
      }
      return padded;
    });

  return { headers, rows };
}

function splitCsvRecords(text: string): string[][] {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\r") {
      if (text[index + 1] === "\n") {
        continue;
      }
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (inQuotes) {
    throw new Error("CSV has an unclosed quoted field.");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  return records;
}
