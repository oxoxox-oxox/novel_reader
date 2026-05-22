# Local Novel Reader Plan (Tauri + Vue 3)

## 1. Goals and Scope
- Desktop app for local reading with future cross-platform option.
- Supported formats: txt, epub, markdown.
- Local library management, reading progress, bookmarks, and themes.

## 2. Recommended Tech Stack
- Desktop: Tauri
- UI: Vue 3 + Vite
- State: Pinia
- Router: Vue Router
- Local DB: SQLite (Tauri plugin)
- File system: Tauri FS API
- Parsing/rendering:
  - TXT: custom chapter split + paging
  - Markdown: markdown-it
  - EPUB: epub.js

## 3. High-Level Architecture
- App shell (Tauri): window management, FS access, DB access
- Frontend (Vue): UI, state, routing
- Services:
  - Library service: import, scan, metadata
  - Reader service: format-specific rendering and progress
  - Settings service: theme, font, layout

## 4. Module Breakdown
### 4.1 Library
- Scan folders and import files (single/batch)
- Detect file type and parse metadata
- Store book list, cover, and tags in SQLite
- Library list, filters, and search

### 4.2 Reader
- TXT:
  - Chapter split by regex (e.g., "第X章")
  - Paging by viewport with cached pages
- Markdown:
  - Render with markdown-it
  - Build TOC from headings
- EPUB:
  - Render via epub.js
  - TOC and CFI-based progress

### 4.3 Progress and Bookmarks
- Save last reading position on exit or interval
- Track percentage, last open time
- Bookmarks with label and location

### 4.4 Settings
- Font family, size, line height, margins
- Themes: day, night, eye-care
- Reading width and column style

## 5. Data Model (SQLite)
- books
  - id, title, author, format, file_path, cover_path, added_at, updated_at
- book_meta
  - book_id, language, description, publisher, published_at, extra_json
- reading_progress
  - book_id, location, percentage, updated_at
- bookmarks
  - id, book_id, location, label, created_at
- tags
  - id, name
- book_tags
  - book_id, tag_id

## 6. Key Implementation Details
- Import:
  - Allow selecting a library folder
  - Incremental scan by file mtime
- TXT parsing:
  - Normalize line endings
  - Split chapters with configurable regex
  - Cache page breaks for fast navigation
- Markdown:
  - Sanitize HTML
  - Extract headings for TOC
- EPUB:
  - Use epub.js rendition
  - Persist progress with CFI

## 7. Development Milestones
1) Project initialization
   - Tauri + Vue app scaffold, routing, state
2) Library MVP
   - Import/scan, DB storage, list UI
3) Reader MVP
   - TXT + Markdown rendering, progress save
4) EPUB integration
   - epub.js reader, TOC, bookmarks
5) UX polish
   - Themes, typography, shortcuts, performance

## 8. Risks and Mitigations
- Large TXT performance: use virtualization and cached paging
- EPUB rendering quirks: test multiple files early
- Metadata accuracy: allow manual edit

## 9. Testing Plan
- Unit tests for parsers and chapter split
- Manual test set for txt/epub/markdown
- Regression tests for progress save/restore
