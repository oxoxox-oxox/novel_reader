import { defineStore } from 'pinia'
import { open } from '@tauri-apps/api/dialog'
import { loadBookContent } from '../services/readerService'
import { getFormatFromPath, getTitleFromPath } from '../services/bookUtils'

const PROGRESS_KEY = 'novel_reader_progress'

function loadProgressMap() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgressMap(map) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map))
}

function getBookId(book) {
  return book?.path || book?.id || ''
}

export const useReaderStore = defineStore('reader', {
  state: () => ({
    book: null,
    format: '',
    chapters: [],
    chapterIndex: 0,
    epubData: null,
    isLoading: false,
    error: '',
  }),
  getters: {
    chapterCount(state) {
      return state.chapters.length
    },
    currentChapter(state) {
      if (!state.chapters.length) {
        return ''
      }
      return state.chapters[state.chapterIndex] || ''
    },
    progress(state) {
      if (!state.chapters.length) {
        return 0
      }
      return (state.chapterIndex + 1) / state.chapters.length
    },
  },
  actions: {
    async openBook(book) {
      this.isLoading = true
      this.error = ''
      try {
        const content = await loadBookContent(book)
        this.book = book
        this.format = content.format
        this.chapters = content.chapters || []
        const progressMap = loadProgressMap()
        const savedIndex = progressMap[getBookId(book)]
        const maxIndex = Math.max(this.chapters.length - 1, 0)
        this.chapterIndex = Number.isInteger(savedIndex) ? Math.min(savedIndex, maxIndex) : 0
        this.epubData = content.epubData || null
      } catch (error) {
        this.error = error?.message || 'Failed to open book'
      } finally {
        this.isLoading = false
      }
    },
    persistProgress() {
      if (!this.book || !this.chapters.length) {
        return
      }
      const progressMap = loadProgressMap()
      progressMap[getBookId(this.book)] = this.chapterIndex
      saveProgressMap(progressMap)
    },
    async openBookFromDialog() {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'Books', extensions: ['txt', 'md', 'markdown', 'epub'] },
        ],
      })

      if (typeof selected !== 'string' || !selected.trim()) {
        return
      }

      const format = await getFormatFromPath(selected)
      if (!format) {
        this.error = 'Unsupported format'
        return
      }

      await this.openBook({
        id: selected,
        title: await getTitleFromPath(selected),
        author: 'Unknown',
        format,
        path: selected,
        lastOpened: 'just now',
      })
    },
    nextChapter() {
      if (this.chapterIndex < this.chapters.length - 1) {
        this.chapterIndex += 1
        this.persistProgress()
      }
    },
    prevChapter() {
      if (this.chapterIndex > 0) {
        this.chapterIndex -= 1
        this.persistProgress()
      }
    },
    selectChapter(index) {
      if (index < 0 || index >= this.chapters.length) {
        return
      }
      this.chapterIndex = index
      this.persistProgress()
    },
  },
})
