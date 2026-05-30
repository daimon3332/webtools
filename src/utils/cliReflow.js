import { dedent } from './dedent'

const TERM = /[。！？；.!?;：:]['")\]）」』]*$/

function isCJK(ch) {
  if (!ch) return false
  const c = ch.codePointAt(0)
  return (
    (c >= 0x4e00 && c <= 0x9fff) ||
    (c >= 0x3400 && c <= 0x4dbf) ||
    (c >= 0x3000 && c <= 0x303f) ||
    (c >= 0xff00 && c <= 0xffef)
  )
}

const isAlnum = ch => !!ch && /[0-9A-Za-z]/.test(ch)
const indentOf = line => line.match(/^[ \t]*/)[0].length

function isStructural(line) {
  const t = line.replace(/^\s+/, '')
  return (
    /^([-*+]\s|\d+[.)]\s|[A-Za-z][.)]\s)/.test(t) || // 列表 / 编号
    /^#{1,6}\s/.test(t) ||                            // 标题
    /^\|/.test(t) ||                                  // 表格
    /^[\w.-]+\s*:(\s|$)/.test(t) ||                   // key: value
    /^( {4,}|\t)/.test(line)                          // 缩进代码
  )
}

function joinTwo(a, b) {
  const left = a.replace(/\s+$/, '')
  const right = b.replace(/^\s+/, '')
  const lc = left.slice(-1)
  const rc = right.slice(0, 1)
  const noSpace =
    (isCJK(lc) && isCJK(rc)) || lc === '/' || lc === '\\' || rc === '/' || rc === '\\'
  const space = !noSpace && (isAlnum(lc) || isAlnum(rc)) ? ' ' : ''
  return left + space + right
}

export function reflowCli(input, { join = true } = {}) {
  const lines = dedent(input).split('\n')
  if (!join) return lines.join('\n')

  const out = []
  let inFence = false
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    const prev = out[out.length - 1]
    const canJoin =
      prev !== undefined &&
      prev.trim() !== '' &&
      line.trim() !== '' &&
      !inFence &&
      !/^\s*(```|~~~)/.test(prev) &&
      !TERM.test(prev.replace(/\s+$/, '')) &&
      !isStructural(line) &&
      indentOf(line) >= indentOf(prev)
    if (canJoin) out[out.length - 1] = joinTwo(prev, line)
    else out.push(line)
  }
  return out.join('\n')
}
