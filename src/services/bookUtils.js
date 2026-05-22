import { basename, extname } from '@tauri-apps/api/path'

const formatMap = {
  '.txt': 'txt',
  '.md': 'markdown',
  '.markdown': 'markdown',
  '.epub': 'epub',
}

export const supportedExtensions = Object.keys(formatMap)

export async function getFormatFromPath(filePath) {
  let ext = await extname(filePath)
  if (ext && !ext.startsWith('.')) {
    ext = `.${ext}`
  }
  ext = (ext || '').toLowerCase()
  return formatMap[ext] || null
}

export async function getTitleFromPath(filePath) {
  const name = await basename(filePath)
  let ext = await extname(name)
  if (ext && !ext.startsWith('.')) {
    ext = `.${ext}`
  }
  return ext ? name.slice(0, name.length - ext.length) : name
}
