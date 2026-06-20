# 読書記録アプリ (dokushokiroku)

## プロジェクト概要

本の読書記録を管理するWebアプリケーション。

## ディレクトリ構成

```
dokushokiroku/
├── CLAUDE.md
├── index.html   # マークアップ
├── style.css    # スタイル
└── app.js       # ロジック・localStorage操作
```

## 開発環境

- リモートリポジトリ: https://github.com/keeg2an/dokushokiroku
- ブランチ戦略: `master` ブランチで開発
- データ永続化: localStorage（キー: `dokusho_books`）

---

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

---

## プログラミングルール

### 基本方針

- シンプルに書く。必要以上の抽象化・汎用化をしない
- 動くコードより、読めるコードを優先する
- 変更は小さく・1コミット1目的にする

### 命名規則

- 変数・関数: キャメルケース（`bookTitle`, `formatDate`）
- 定数: アッパースネークケース（`STATUS_LABELS`）
- ID属性・CSSクラス: ケバブケース（`books-list`, `btn-save`）
- 名前は省略しない。`e` より `event`、`el` より `element`  
  ただし慣例的な略語（`idx`, `str`, `min`）は許容

### JavaScript

- `var` は使わない。`const` を基本とし、再代入が必要な場合のみ `let`
- DOM操作は `innerHTML` への直接代入を避け、XSS対策としてエスケープ関数（`escHtml`）を通す
- イベントハンドラはインラインより `addEventListener` を優先する
  （ただし動的生成テーブル行の `onclick` は例外として許容）
- 関数は単一責任にする。1関数につき1つのことだけやる
- マジックナンバーは定数に切り出す

### CSS

- グローバルなスタイルは `*` セレクタで `box-sizing: border-box` を適用
- クラス名はBEM風（`block__element--modifier`）を緩く参考にする
- インラインスタイルは原則使わない。動的な値（幅・色）のみ許容

### HTML

- セマンティックなタグを使う（`div` より `header`, `main`, `section`）
- フォーム要素には必ず `id` と対応する `label` を付ける
- `required` など適切なバリデーション属性を活用する

### セキュリティ

- ユーザー入力を DOM に挿入するときは必ずエスケープする
- `eval()` は使わない
- `innerHTML` にユーザー入力を直接渡さない

### パフォーマンス

- DOM 操作はまとめて行う（ループ内で毎回 `document.getElementById` しない）
- 不要な再レンダリングを避ける（差分更新より全体再描画で十分な規模では許容）

### コメント

- 「何をしているか」ではなく「なぜそうしているか」を書く
- 自明なコードにコメントは不要
