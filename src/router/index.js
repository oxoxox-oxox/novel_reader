import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../pages/LibraryView.vue'
import ReaderView from '../pages/ReaderView.vue'

const routes = [
  { path: '/', name: 'library', component: LibraryView },
  { path: '/reader', name: 'reader', component: ReaderView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
