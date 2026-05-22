# Novel Reader

[English](README.md) | 中文

一个本地桌面小说阅读器，包含书架、章节目录与阅读进度恢复。支持 txt、epub、markdown。

## 功能

- 本地书库扫描与目录选择
- 章节目录与一键跳转
- 记住每本书的上次阅读章节
- 支持格式：txt / epub / markdown

## 使用 Release

如果你已经有发布版的 EXE，直接运行即可。应用离线工作，只读取本地文件夹。

## 开发

```bash
npm install
npm run tauri:dev
```

## 构建

```bash
npm run tauri:build
```

输出目录：

```
src-tauri/target/release/
```
