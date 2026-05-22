import { readTextFile, readBinaryFile } from '@tauri-apps/api/fs'
import MarkdownIt from 'markdown-it'
import { getFormatFromPath } from './bookUtils'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

function splitChapters(text) {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) {
    return [{ title: '开始', content: '' }]
  }

  const lines = normalized.split('\n')
  const chapters = []
  let current = { title: '开始', content: '' }
  const chapterPattern = /^第[零一二三四五六七八九十百千万0-9]+章.*$/

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && chapterPattern.test(trimmed)) {
      if (current.content.trim()) {
        chapters.push(current)
      }
      current = { title: trimmed, content: '' }
      continue
    }

    current.content += current.content ? `\n${line}` : line
  }

  if (current.content.trim()) {
    chapters.push(current)
  }

  if (!chapters.length) {
    return [{ title: '开始', content: normalized }]
  }

  return chapters
}

export async function loadBookContent(book) {
  const format = book.format || (await getFormatFromPath(book.path))

  if (!format) {
    throw new Error('Unsupported format')
  }

  if (format === 'epub') {
    const binary = await readBinaryFile(book.path)
    const arrayBuffer = binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength)
    return { format, epubData: arrayBuffer }
  }

  const text = await readTextFile(book.path)

  if (format === 'markdown') {
    return {
      format,
      chapters: [{ title: book.title || 'Markdown', content: markdown.render(text), isHtml: true }],
      rawText: text,
    }
  }

  return { format, chapters: splitChapters(text), rawText: text }
}
