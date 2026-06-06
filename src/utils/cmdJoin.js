function joinCommand(input, cont) {
  const parts = []
  for (const raw of input.replace(/\r\n?/g, '\n').split('\n')) {
    let t = raw.trim()
    if (t.endsWith(cont)) t = t.slice(0, -cont.length).trim()
    if (t) parts.push(t)
  }
  return parts.join(' ')
}

export const joinShell = input => joinCommand(input, '\\')
export const joinCurl = joinShell
export const joinPowershell = input => joinCommand(input, '`')
