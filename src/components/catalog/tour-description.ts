export function descriptionImageMarkdown(url: string, altText: string): string {
  const safeAltText = altText
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("\\", "")
    .trim() || "Tour image";
  return `![${safeAltText}](${url})`;
}

export function insertDescriptionImage(
  description: string,
  markdown: string,
  selectionStart: number,
  selectionEnd: number,
): { value: string; cursor: number } {
  const start = Math.max(0, Math.min(selectionStart, description.length));
  const end = Math.max(start, Math.min(selectionEnd, description.length));
  const before = description.slice(0, start);
  const after = description.slice(end);
  const prefix = before.length === 0 ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const suffix = after.length === 0 ? "" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  const inserted = `${prefix}${markdown}${suffix}`;

  return {
    value: `${before}${inserted}${after}`,
    cursor: before.length + inserted.length,
  };
}
