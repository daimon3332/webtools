export function dedent(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  let min = Infinity
  for (const line of lines) {
    if (!line.trim()) continue
    const indent = line.match(/^[ \t]*/)[0].length
    if (indent < min) min = indent
  }
  if (!isFinite(min) || min === 0) return lines.join('\n')
  return lines.map(l => (l.trim() ? l.slice(min) : l)).join('\n')
}
