# Novel Reader

English | [中文](README.zh-CN.md)

A local desktop novel reader with a library view, chapter navigation, and reading progress restore. Supports txt, epub, and markdown.

## Features

- Local library scanning and folder selection
- Chapter list with one-click jump
- Remember last read chapter per book
- Formats: txt / epub / markdown

## Use the Release

If you already have the release EXE, just run it. The app works offline and reads from local folders.

## Development

```bash
npm install
npm run tauri:dev
```

## Build

```bash
npm run tauri:build
```

Output is under:

```
src-tauri/target/release/
```

