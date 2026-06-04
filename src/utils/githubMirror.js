export const GITHUB_MIRRORS = [
  { id: 'gh-proxy', name: 'gh-proxy.com', defaultSelected: true, type: 'prefix', base: 'https://gh-proxy.com/' },
  { id: 'ghproxy', name: 'ghproxy.net', defaultSelected: false, type: 'prefix', base: 'https://ghproxy.net/' },
  { id: 'ghfast', name: 'ghfast.top', defaultSelected: false, type: 'prefix', base: 'https://ghfast.top/' },
  { id: 'jsdelivr', name: 'jsDelivr', defaultSelected: true, type: 'jsdelivr', base: 'https://cdn.jsdelivr.net/gh' },
  { id: 'jsdelivr-cf', name: 'jsDelivr-CF', defaultSelected: false, type: 'jsdelivr', base: 'https://testingcf.jsdelivr.net/gh' }
]

export function convertGithubMirrors(input, selectedIds) {
  const raw = input.trim()
  if (!raw) return { links: [], warnings: [] }

  const parsed = parseGithubUrl(raw)
  const selected = new Set(selectedIds)
  const links = []
  const warnings = []

  for (const mirror of GITHUB_MIRRORS) {
    if (!selected.has(mirror.id)) continue
    if (mirror.type === 'prefix') {
      links.push({ name: mirror.name, url: `${mirror.base}${raw}` })
      continue
    }

    const url = parsed && toJsdelivrUrl(parsed, mirror.base)
    if (url) {
      links.push({ name: mirror.name, url })
    } else if (mirror.type === 'jsdelivr') {
      warnings.push(`${mirror.name}: ${getJsdelivrSkipReason(parsed)}`)
    }
  }

  if (parsed?.type === 'release-asset' && GITHUB_MIRRORS.some(m => selected.has(m.id) && m.type === 'jsdelivr')) {
    warnings.push('jsDelivr release 链接是仓库文件候选，需文件实际存在于对应分支或 tag')
  }

  return { links, warnings: [...new Set(warnings)] }
}

function parseGithubUrl(raw) {
  let url
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase()
  const parts = url.pathname.split('/').filter(Boolean).map(safeDecode)
  if (host === 'github.com') return parseGithubWeb(parts)
  if (host === 'raw.githubusercontent.com') return parseGithubRaw(parts)
  return null
}

function parseGithubWeb(parts) {
  const [owner, repoName, section] = parts
  const repo = normalizeRepo(repoName)
  if (!owner || !repo) return null
  if (!section) return { type: 'repo', owner, repo, ref: 'main', path: '' }

  if (section === 'blob' || section === 'raw' || section === 'tree') {
    const ref = parts[3]
    const path = parts.slice(4).join('/')
    return ref ? { type: section, owner, repo, ref, path } : null
  }

  if (section === 'releases' && parts[3] === 'download') {
    const ref = parts[4] === 'latest' ? 'release' : parts[4]
    const path = parts.slice(5).join('/')
    return ref && path ? { type: 'release-asset', owner, repo, ref, path } : null
  }

  return null
}

function parseGithubRaw(parts) {
  const [owner, repoName, ref, ...fileParts] = parts
  const repo = normalizeRepo(repoName)
  if (!owner || !repo || !ref || !fileParts.length) return null
  return { type: 'raw', owner, repo, ref, path: fileParts.join('/') }
}

function toJsdelivrUrl(parsed, base) {
  if (!parsed.owner || !parsed.repo || !parsed.ref) return ''
  const path = parsed.path ? `/${parsed.path}` : '/'
  return `${base}/${parsed.owner}/${parsed.repo}@${parsed.ref}${path}`
}

function getJsdelivrSkipReason(parsed) {
  if (!parsed) return '仅支持 github.com 或 raw.githubusercontent.com 链接'
  if (parsed.type === 'release-asset') return 'GitHub release 上传资产不能可靠映射到 /gh/ 仓库文件'
  return '该 GitHub 页面无法转换为仓库文件路径'
}

function normalizeRepo(repo) {
  return repo?.replace(/\.git$/i, '')
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
