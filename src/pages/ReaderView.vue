<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ePub from 'epubjs'
import { useReaderStore } from '../stores/reader'
import { useLibraryStore } from '../stores/library'

const readerStore = useReaderStore()
const libraryStore = useLibraryStore()

const epubContainer = ref(null)
const readerContent = ref(null)
const epubRendition = ref(null)
let epubBook = null

const progressLabel = computed(() => {
  const percent = Math.round(readerStore.progress * 100)
  return `${percent}%`
})

const chapterLabel = computed(() => {
  if (!readerStore.chapterCount) {
    return '0 / 0'
  }
  return `${readerStore.chapterIndex + 1} / ${readerStore.chapterCount}`
})

const isChapterMode = computed(() => readerStore.format !== 'epub')
const isTocOpen = ref(false)
const canPrev = computed(() => readerStore.chapterIndex > 0)
const canNext = computed(() => readerStore.chapterIndex < readerStore.chapterCount - 1)

const handleOpenDialog = async () => {
  await readerStore.openBookFromDialog()
}

const handlePrev = async () => {
  if (readerStore.format === 'epub' && epubRendition.value) {
    await epubRendition.value.prev()
    return
  }
  readerStore.prevChapter()
}

const handleNext = async () => {
  if (readerStore.format === 'epub' && epubRendition.value) {
    await epubRendition.value.next()
    return
  }
  readerStore.nextChapter()
}

const toggleToc = () => {
  isTocOpen.value = !isTocOpen.value
}

const teardownEpub = () => {
  if (epubRendition.value) {
    epubRendition.value.destroy()
    epubRendition.value = null
  }
  if (epubBook) {
    epubBook.destroy()
    epubBook = null
  }
}

const renderEpub = async (data) => {
  if (!data || !epubContainer.value) {
    return
  }
  teardownEpub()
  epubBook = ePub(data)
  epubRendition.value = epubBook.renderTo(epubContainer.value, {
    width: '100%',
    height: '100%',
  })
  await epubRendition.value.display()
}

watch(
  () => readerStore.epubData,
  async (data) => {
    if (readerStore.format === 'epub') {
      await renderEpub(data)
    } else {
      teardownEpub()
    }
  }
)

watch(
  () => readerStore.chapterIndex,
  () => {
    if (readerContent.value) {
      readerContent.value.scrollTop = 0
    }
  }
)

onMounted(() => {
  if (!readerStore.book && libraryStore.books.length) {
    readerStore.openBook(libraryStore.books[0])
  }
})

onUnmounted(() => {
  teardownEpub()
})
</script>

<template>
  <section class="view reader">
    <header class="view-header">
      <div>
        <h1>Reader</h1>
        <p class="muted">Preview area for txt/markdown/epub rendering.</p>
      </div>
      <div class="actions">
        <button class="btn ghost" type="button" @click="toggleToc" v-if="isChapterMode">
          目录
        </button>
        <button class="btn ghost" type="button" @click="handlePrev">Prev</button>
        <button class="btn ghost" type="button" @click="handleNext">Next</button>
        <button class="btn primary" type="button" @click="handleOpenDialog">Open Book</button>
      </div>
    </header>

    <div class="reader-shell">
      <div class="reader-toolbar">
        <span class="reader-title">{{ readerStore.book?.title || 'No book opened' }}</span>
        <span class="reader-progress">Progress: {{ progressLabel }}</span>
      </div>
      <div v-if="readerStore.isLoading" class="reader-content">Loading...</div>
      <div v-else-if="readerStore.error" class="reader-content error">{{ readerStore.error }}</div>
      <div v-else-if="!readerStore.book" class="reader-content muted">
        No book opened. Go to Library and select a book.
      </div>
      <div v-else class="reader-body">
        <aside v-if="isChapterMode" :class="['reader-toc', { open: isTocOpen }]">
          <div class="toc-title">Chapters</div>
          <ul class="toc-list">
            <li
              v-for="(chapter, index) in readerStore.chapters"
              :key="`${chapter.title}-${index}`"
              :class="['toc-item', { active: index === readerStore.chapterIndex }]"
              @click="readerStore.selectChapter(index)"
            >
              {{ chapter.title || `Chapter ${index + 1}` }}
            </li>
          </ul>
        </aside>
        <div v-if="readerStore.format === 'epub'" class="reader-content epub">
          <div ref="epubContainer" class="epub-container"></div>
        </div>
        <div ref="readerContent" v-else class="reader-content text">
          <div class="page-meta">Chapter {{ chapterLabel }}</div>
          <div class="reader-chapter-title">{{ readerStore.currentChapter?.title }}</div>
          <div
            v-if="readerStore.currentChapter?.isHtml"
            class="reader-page markdown"
            v-html="readerStore.currentChapter.content"
          ></div>
          <div v-else class="reader-page">{{ readerStore.currentChapter?.content }}</div>
          <div class="reader-nav">
            <button class="btn ghost" type="button" :disabled="!canPrev" @click="handlePrev">
              Prev Chapter
            </button>
            <button class="btn ghost" type="button" :disabled="!canNext" @click="handleNext">
              Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
