import { readDir } from '@tauri-apps/api/fs'
import { open } from '@tauri-apps/api/dialog'
import { resolve } from '@tauri-apps/api/path'
import { getFormatFromPath, getTitleFromPath, supportedExtensions } from './bookUtils'

const LIBRARY_DIR_KEY = 'novel_reader_library_dir'

function getStoredLibraryDir() {
  return localStorage.getItem(LIBRARY_DIR_KEY)
}

function setStoredLibraryDir(dirPath) {
  if (dirPath) {
    localStorage.setItem(LIBRARY_DIR_KEY, dirPath)
  }
}

export async function getDefaultLibraryDir() {
  const stored = getStoredLibraryDir()
  if (stored) {
    return stored
  }

  // Default to a local "novel" folder next to the app when running in dev.
  return resolve('novel')
}

export async function pickLibraryFolder() {
  const selected = await open({
    directory: true,
    multiple: false,
    title: 'Select novel folder',
  })

  if (typeof selected === 'string' && selected.trim()) {
    setStoredLibraryDir(selected)
    return selected
  }

  return null
}

export async function listLibraryBooks(dirPath) {
  const entries = await readDir(dirPath, { recursive: false })
  const files = entries
    .filter((entry) => entry.path && !entry.children)
    .filter((entry) => supportedExtensions.some((ext) => entry.path.toLowerCase().endsWith(ext)))

  const books = []
  for (const entry of files) {
    const format = await getFormatFromPath(entry.path)
    if (!format) {
      continue
    }
    const title = await getTitleFromPath(entry.path)
    books.push({
      id: entry.path,
      title,
      author: 'Unknown',
      format,
      path: entry.path,
      lastOpened: 'just now',
    })
  }

  books.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  return books
}
