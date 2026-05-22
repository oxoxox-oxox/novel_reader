# Novel Reader (Core Skeleton)

Local novel reader desktop app using Tauri + Vue 3. This is a core skeleton with a library view and a reader view, plus placeholder services for import/progress.

## Scripts
- `npm run dev` - start the Vue dev server
- `npm run build` - build the frontend
- `npm run preview` - preview the frontend build
- `npm run tauri:dev` - run the desktop app (Tauri dev)
- `npm run tauri:build` - build the desktop app (Tauri build)

## Desktop Prerequisites (Windows)
- Rust toolchain with MSVC target
- Visual Studio Build Tools: "Desktop development with C++"
- WebView2 Runtime

## Notes
- Tauri scaffolding is included in `src-tauri/`.
- Replace mock services with real file system and database logic.
