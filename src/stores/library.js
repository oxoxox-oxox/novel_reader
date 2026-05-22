import { defineStore } from 'pinia'
import { getDefaultLibraryDir, listLibraryBooks, pickLibraryFolder } from '../services/libraryService'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    books: [],
    isLoading: false,
    libraryPath: '',
    error: '',
  }),
  actions: {
    async loadLibrary(dirPath) {
      this.isLoading = true
      this.error = ''
      try {
        const targetPath = dirPath || this.libraryPath || (await getDefaultLibraryDir())
        this.libraryPath = targetPath
        this.books = await listLibraryBooks(targetPath)
      } catch (error) {
        this.error = error?.message || 'Failed to load library'
        this.books = []
      } finally {
        this.isLoading = false
      }
    },
    async selectLibraryFolder() {
      const selected = await pickLibraryFolder()
      if (selected) {
        await this.loadLibrary(selected)
      }
    },
  },
})
