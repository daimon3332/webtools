const SIGNATURES = [
  { type: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { type: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { type: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }
]

function sniff(bytes) {
  for (const sig of SIGNATURES) {
    if (!sig.bytes.every((b, i) => bytes[i] === b)) continue
    if (sig.type === 'image/webp') {
      const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
      if (!isWebp) continue
    }
    return sig.type
  }
  return ''
}

function base64ToBytes(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function bytesToBase64(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(bin)
}

function normalizeBase64(input) {
  const raw = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  return raw + '='.repeat((4 - (raw.length % 4)) % 4)
}

export function encodeBase64Text(text) {
  return bytesToBase64(new TextEncoder().encode(text))
}

export function decodeBase64Text(input) {
  let bytes
  try {
    bytes = base64ToBytes(normalizeBase64(input))
  } catch {
    throw new Error('Base64 解码失败，请检查输入是否完整')
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('解码失败：内容不是有效的 UTF-8 文本')
  }
}

export function decodeBase64Image(input) {
  const raw = input.trim()
  if (!raw) throw new Error('请输入 Base64 内容')
  const match = raw.match(/^data:([\w./+-]+)?;base64,(.*)$/is)
  const b64 = normalizeBase64(match ? match[2] : raw)

  let bytes
  try {
    bytes = base64ToBytes(b64)
  } catch {
    throw new Error('Base64 解码失败，请检查输入是否完整')
  }

  const type = sniff(bytes)
  if (!type) throw new Error('未识别的图片格式（仅支持 PNG / JPEG / GIF / WebP，SVG 已禁用）')

  return { url: URL.createObjectURL(new Blob([bytes], { type })), type, size: bytes.length }
}
