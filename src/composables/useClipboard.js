import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)

  async function copy(text) {
    if (!text) return false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
      return true
    } catch {
      return false
    }
  }

  return { copied, copy }
}
