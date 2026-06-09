import yaml from 'js-yaml'
import { dedent } from './dedent'

const DUMP_OPTS = { indent: 2, lineWidth: -1, noRefs: true }

function splitPath(path) {
  const parts = path.trim().split('.').map(p => p.trim()).filter(Boolean)
  if (!parts.length) throw new Error('请输入字段路径')
  return parts
}

function getByPath(data, parts) {
  let cur = data
  for (const part of parts) {
    if (Array.isArray(cur) && /^\d+$/.test(part)) {
      cur = cur[Number(part)]
    } else if (cur && typeof cur === 'object' && Object.prototype.hasOwnProperty.call(cur, part)) {
      cur = cur[part]
    } else {
      return undefined
    }
  }
  return cur
}

const indentOf = line => line.match(/^[ \t]*/)[0].length
const isBlank = line => !line.trim()
const isComment = line => line.trim().startsWith('#')

function readKey(line) {
  const t = line.trimStart()
  if (!t || t.startsWith('#') || t.startsWith('-') || t === '---' || t === '...') return ''
  if (t.startsWith('"') || t.startsWith("'")) {
    const quote = t[0]
    let escaped = false
    for (let i = 1; i < t.length; i++) {
      if (escaped) {
        escaped = false
        continue
      }
      if (quote === '"' && t[i] === '\\') {
        escaped = true
        continue
      }
      if (t[i] === quote && /^\s*:/.test(t.slice(i + 1))) return t.slice(1, i)
    }
    return ''
  }
  const match = t.match(/^([^:[\]{}#,][^:]*?):(?:\s|$)/)
  return match ? match[1].trim() : ''
}

function findBlockEnd(lines, start, end, indent) {
  for (let i = start + 1; i < end; i++) {
    if (isBlank(lines[i])) continue
    if (indentOf(lines[i]) <= indent) return i
  }
  return end
}

function childIndent(lines, start, end, parentIndent) {
  let min = Infinity
  for (let i = start; i < end; i++) {
    if (isBlank(lines[i]) || isComment(lines[i])) continue
    const indent = indentOf(lines[i])
    if (indent > parentIndent && readKey(lines[i])) min = Math.min(min, indent)
  }
  return min
}

function leadingCommentsStart(lines, line, start, indent) {
  let first = line
  for (let i = line - 1; i >= start; i--) {
    if (isBlank(lines[i])) break
    if (!isComment(lines[i]) || indentOf(lines[i]) !== indent) break
    first = i
  }
  return first
}

function trimBlankEdges(lines) {
  let start = 0
  let end = lines.length
  while (start < end && isBlank(lines[start])) start++
  while (end > start && isBlank(lines[end - 1])) end--
  return lines.slice(start, end)
}

function extractOriginalBlock(source, parts) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  let start = 0
  let end = lines.length
  let parentIndent = -1
  for (let depth = 0; depth < parts.length; depth++) {
    const directIndent = childIndent(lines, start, end, parentIndent)
    if (!isFinite(directIndent)) return ''
    let found = -1
    for (let i = start; i < end; i++) {
      if (indentOf(lines[i]) === directIndent && readKey(lines[i]) === parts[depth]) {
        found = i
        break
      }
    }
    if (found < 0) return ''
    const blockEnd = findBlockEnd(lines, found, end, directIndent)
    if (depth === parts.length - 1) {
      const blockStart = leadingCommentsStart(lines, found, start, directIndent)
      return dedent(trimBlankEdges(lines.slice(blockStart, blockEnd)).join('\n'))
    }
    start = found + 1
    end = blockEnd
    parentIndent = directIndent
  }
  return ''
}

export function formatYaml(text) {
  return yaml.dump(yaml.load(dedent(text)), DUMP_OPTS)
}

export function yamlToJson(text) {
  return JSON.stringify(yaml.load(dedent(text)), null, 2)
}

export function jsonToYaml(text) {
  return yaml.dump(JSON.parse(text), DUMP_OPTS)
}

export function extractYamlField(text, path) {
  const source = dedent(text)
  const parts = splitPath(path)
  const value = getByPath(yaml.load(source), parts)
  if (value === undefined) throw new Error(`未找到字段：${parts.join('.')}`)

  const original = extractOriginalBlock(source, parts)
  if (original) return original
  return yaml.dump({ [parts[parts.length - 1]]: value }, DUMP_OPTS)
}

export function yamlError(err) {
  if (err.mark) {
    return `YAML 解析失败（第 ${err.mark.line + 1} 行，第 ${err.mark.column + 1} 列）：${err.reason || err.message}`
  }
  return `解析失败：${err.message}`
}
