<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '../stores/library'
import { useReaderStore } from '../stores/reader'

const router = useRouter()
const libraryStore = useLibraryStore()
const readerStore = useReaderStore()

onMounted(() => {
  libraryStore.loadLibrary()
})

const handleRescan = async () => {
  await libraryStore.loadLibrary()
}

const handleSelectFolder = async () => {
  await libraryStore.selectLibraryFolder()
}

const openBook = async (book) => {
  await readerStore.openBook(book)
  if (!readerStore.error) {
    router.push('/reader')
  }
}
</script>

<template>
  <section class="view">
    <header class="view-header">
      <div>
        <h1>Library</h1>
        <p class="muted">Import local txt/epub/markdown files and keep your library organized.</p>
      </div>
      <div class="actions">
        <button class="btn primary" type="button" @click="handleSelectFolder">Select Folder</button>
        <button class="btn ghost" type="button" @click="handleRescan">Scan Folder</button>
      </div>
    </header>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Recent Books</span>
        <span class="panel-meta">{{ libraryStore.books.length }} items</span>
      </div>
      <p class="muted" v-if="libraryStore.libraryPath">
        Library path: {{ libraryStore.libraryPath }}
      </p>
      <p class="error" v-if="libraryStore.error">{{ libraryStore.error }}</p>

      <div v-if="libraryStore.isLoading" class="empty">
        Loading library...
      </div>
      <div v-else-if="!libraryStore.books.length" class="empty">
        No books yet. Import a file to get started.
      </div>
      <ul v-else class="book-grid">
        <li
          v-for="book in libraryStore.books"
          :key="book.id"
          class="book-card"
          @click="openBook(book)"
        >
          <div class="book-cover">
            <span class="badge">{{ book.format ? book.format.toUpperCase() : 'UNK' }}</span>
          </div>
          <div class="book-info">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-author">{{ book.author }}</div>
            <div class="book-meta">Last opened {{ book.lastOpened }}</div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
