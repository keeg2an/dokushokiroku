# 読書記録アプリ (dokushokiroku)

## プロジェクト概要

本の読書記録を管理するWebアプリケーション。

## Git 運用ルール

**コードを変更するたびに、必ずGitHubへプッシュすること。**

手順：
1. 変更をステージング: `git add <変更ファイル>`
2. コミット: `git commit -m "種別: 変更内容の要約"`
3. プッシュ: `git push origin master`

コミットメッセージの種別：
- `feat:` 新機能追加
- `fix:` バグ修正
- `chore:` 設定・ビルド関連
- `refactor:` リファクタリング
- `style:` スタイル変更

## 開発環境

- リモートリポジトリ: https://github.com/keeg2an/task-board
- ブランチ戦略: `master` ブランチで開発

## ディレクトリ構成

```
dokushokiroku/
├── CLAUDE.md
├── index.html
├── src/
└── ...
```
