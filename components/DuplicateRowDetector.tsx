"use client";

import { useMemo, useState } from "react";
import { detectDuplicateRows } from "@/lib/detectDuplicateRows";
import { parseCsv, type ParsedTable } from "@/lib/parseCsv";

type ViewFilter = "all" | "duplicates";

export default function DuplicateRowDetector() {
  const [table, setTable] = useState<ParsedTable | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  const [filter, setFilter] = useState<ViewFilter>("all");

  const report = useMemo(() => {
    if (!table) {
      return null;
    }
    return detectDuplicateRows(table.rows, selectedColumns);
  }, [table, selectedColumns]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Load a .csv file. Spreadsheets stay in this browser tab.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.headers.length === 0) {
        setTable(null);
        setFileName("");
        setError("That file has no header row.");
        return;
      }

      setTable(parsed);
      setFileName(file.name);
      setSelectedColumns(parsed.headers.map((_, index) => index));
      setFilter("all");
      setError("");
    } catch (caught) {
      setTable(null);
      setFileName("");
      setError(
        caught instanceof Error ? caught.message : "Could not read that CSV.",
      );
    }
  }

  function toggleColumn(columnIndex: number) {
    setSelectedColumns((current) => {
      if (current.includes(columnIndex)) {
        return current.filter((index) => index !== columnIndex);
      }
      return [...current, columnIndex].sort((left, right) => left - right);
    });
  }

  const visibleRowIndexes = useMemo(() => {
    if (!table || !report) {
      return [];
    }
    if (filter === "duplicates") {
      return table.rows
        .map((_, index) => index)
        .filter((index) => report.inDuplicateGroup[index]);
    }
    return table.rows.map((_, index) => index);
  }, [filter, report, table]);

  return (
    <section className="w-full max-w-6xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Duplicate rows
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Compare every row, or a subset of columns. Matching uses trimmed cell
          text. Nothing is uploaded.
        </p>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/60">
          <span className="text-sm font-medium text-slate-800">
            Choose a CSV file
          </span>
          <span className="mt-1 text-xs text-slate-500">
            Parsed locally with the File API
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        {fileName ? (
          <p className="mt-3 text-sm text-slate-600">
            Loaded <span className="font-medium text-slate-900">{fileName}</span>
          </p>
        ) : null}
      </div>

      {table && report ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Rows" value={report.totalRows} />
            <StatCard
              label="Duplicate groups"
              value={report.duplicateGroupCount}
            />
            <StatCard
              label="Extra copies"
              value={report.extraRowCount}
              hint="Rows after the first match in each group"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Match on columns
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Uncheck columns that should not define a duplicate (for example IDs
              that differ on otherwise identical records).
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {table.headers.map((header, index) => {
                const checked = selectedColumns.includes(index);
                return (
                  <label
                    key={`${header}-${index}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                      checked
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(index)}
                    />
                    {header}
                  </label>
                );
              })}
            </div>
            {selectedColumns.length === 0 ? (
              <p className="mt-3 text-xs text-amber-800">
                Select at least one column to compare.
              </p>
            ) : null}
          </div>

          {report.groups.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Duplicate groups
              </h3>
              <ul className="mt-3 space-y-3">
                {report.groups.map((group) => (
                  <li
                    key={group.key}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-slate-800"
                  >
                    <p className="font-medium">
                      {group.rowIndexes.length} matching rows
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Spreadsheet rows{" "}
                      {group.rowIndexes
                        .map((rowIndex) => rowIndex + 2)
                        .join(", ")}{" "}
                      (header is row 1)
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              No duplicate rows for the selected columns.
            </p>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">Preview</h3>
              <div className="flex gap-2">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All rows
                </FilterButton>
                <FilterButton
                  active={filter === "duplicates"}
                  onClick={() => setFilter("duplicates")}
                >
                  Duplicates only
                </FilterButton>
              </div>
            </div>
            <div className="max-h-[28rem] overflow-auto">
              <table className="min-w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Row
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    {table.headers.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="px-3 py-2 font-semibold text-slate-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRowIndexes.map((rowIndex) => {
                    const occurrence = report.occurrenceByRow[rowIndex] ?? 1;
                    const isDuplicate = report.inDuplicateGroup[rowIndex];
                    const isExtra = occurrence > 1;
                    return (
                      <tr
                        key={rowIndex}
                        className={
                          isDuplicate
                            ? "bg-amber-50 text-slate-900"
                            : "bg-white text-slate-800"
                        }
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-mono">
                          {rowIndex + 2}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          {!isDuplicate
                            ? "Unique"
                            : isExtra
                              ? `Copy ${occurrence}`
                              : "First of group"}
                        </td>
                        {table.rows[rowIndex].map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="max-w-xs truncate px-3 py-2"
                            title={cell}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
