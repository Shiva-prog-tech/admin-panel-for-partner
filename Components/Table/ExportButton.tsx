"use client";

import Icon from "@/Components/Icons/Icon";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";

export interface ExportColumn<T> {
  label: string;
  value: (row: T) => string | number | null | undefined;
}

interface ExportButtonProps<T> {
  filename: string;
  rows: T[];
  columns: ExportColumn<T>[];
  label?: string;
}

function escapeCell(value: string | number | null | undefined): string {
  if (value == null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Builds a CSV in the browser and hands it to the download manager. */
export default function ExportButton<T>({
  filename,
  rows,
  columns,
  label = "Export",
}: ExportButtonProps<T>) {
  const dispatch = useAppDispatch();

  const handleExport = () => {
    const header = columns.map((c) => escapeCell(c.label)).join(",");
    const body = rows
      .map((row) => columns.map((c) => escapeCell(c.value(row))).join(","))
      .join("\n");

    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    dispatch(
      pushToast({
        tone: "success",
        title: "Export ready",
        text: `${rows.length} rows written to ${filename}`,
      })
    );
  };

  return (
    <button type="button" className="btn btn--outline" onClick={handleExport}>
      <Icon name="download" size={17} />
      <span>{label}</span>
    </button>
  );
}
