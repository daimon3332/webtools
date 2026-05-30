export function formatJson(text, indent = 2) {
  return JSON.stringify(JSON.parse(text), null, indent)
}

export function minifyJson(text) {
  return JSON.stringify(JSON.parse(text))
}

export function parseJson(text) {
  return JSON.parse(text)
}

export function jsonError(text, err) {
  const msg = err.message
  const posMatch = /position (\d+)/.exec(msg)
  let where = ''
  if (posMatch) {
    const pos = +posMatch[1]
    const before = text.slice(0, pos)
    const line = before.split('\n').length
    const col = pos - (before.lastIndexOf('\n') + 1) + 1
    where = `（第 ${line} 行，第 ${col} 列）`
  }
  return `JSON 解析失败${where}：${msg}`
}
