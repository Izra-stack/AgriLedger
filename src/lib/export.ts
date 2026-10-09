import { toast } from "sonner";

const escapeCsvValue = (value: unknown) => {
  const text = value == null ? "" : String(value);
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
};

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<unknown>>,
) {
  try {
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export generated successfully.");
  } catch (error) {
    console.error("Failed to generate CSV export:", error);
    toast.error("Unable to generate the export.");
  }
}
