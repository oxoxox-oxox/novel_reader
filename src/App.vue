<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">NR</div>
        <div>
          <div class="title">Novel Reader</div>
          <div class="subtitle">Local Library</div>
        </div>
      </div>

      <nav class="nav">
        <RouterLink class="nav-link" to="/">Library</RouterLink>
        <RouterLink class="nav-link" to="/reader">Reader</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="status">
          <span class="dot" />
          Offline ready
        </div>
        <p class="muted">Tauri + Vue core skeleton</p>
      </div>
    </aside>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
