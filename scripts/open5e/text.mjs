// Text helpers shared by the Open5e converters.

/** Open5e text is Markdown, sometimes with escaped newlines; the sheet shows plain text. */
export function plain(md) {
  const lines = String(md || "")
    // Cross-references left from the source's markup: "Cover|XPHB|Total Cover" shows as "Total Cover", and
    // "Cylinder [Area of Effect]|XPHB|Cylinder" as "Cylinder".
    .replace(/\w+ \[[^\]]*\]\|[A-Z]{2,5}\||\w+\|[A-Z]{2,5}\|/g, "")
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  const text = [];
  for (const line of lines) {
    const t = line.trim();
    // Tables: the separator row goes, the others become "a · b · c".
    if (/^\|?[\s:|-]+\|[\s:|-]*$/.test(t)) continue;
    if (t.startsWith("|")) {
      text.push(t.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()).join(" · "));
      continue;
    }
    text.push(t.replace(/^[-*]\s+/, "• "));
  }
  return text
    .join("\n")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^\w*])[*_]([^*_\n]+?)[*_](?![\w*])/g, "$1$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
