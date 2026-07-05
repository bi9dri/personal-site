# Personal Site - Astro Static Site

## Project Overview

bidriの個人サイト。Astroで構築された静的サイト（1ページ構成）。
デザインは claude.ai/design の「bidri.dev」プロジェクトで作成したものを実装している。

## Tech Stack

- **Framework**: Astro v5
- **Styling**: 素のCSS（`index.astro` 内の `<style is:global>` で完結）
- **Package Manager**: Bun (devbox 経由)
- **Hosting**: GitHub Pages (bidri.dev)

## Directory Structure

```
personal-site/
├── src/
│   └── pages/
│       └── index.astro    # 唯一のページ（マークアップ・CSS・JSを内包）
├── public/                # 静的アセット
│   ├── assets/            # 画像ファイル（webp）
│   └── CNAME              # カスタムドメイン設定
├── .github/workflows/     # CI/CD
│   └── deploy.yml         # GitHub Pagesデプロイ
├── devbox.json            # Bun などツールチェーン定義
├── astro.config.mjs       # Astro設定
└── package.json
```

## Commands

```bash
devbox run -- bun install     # 依存関係インストール
devbox run -- bun run dev     # 開発サーバー起動
devbox run -- bun run build   # 本番ビルド（dist/に出力）
devbox run -- bun run preview # ビルド結果プレビュー
```

## Page Structure (index.astro)

自己完結型の1ページ。9つのセクションカードがそれぞれ異なるデザイン様式を持つ:

1. **アークナイツ** (`#arknights`) — Suprematism
2. **エンドフィールド** (`#endfield`) — Swiss
3. **Fate/Grand Order** (`#fgo`) — Art Deco
4. **マーダーミステリー** (`#murder-mystery`) — Punk
5. **クトゥルフ神話TRPG** (`#coc`) — Baroque/Victorian
6. **エモクロア** (`#emoclore`) — Memphis
7. **その他アナログ** (`#analog`) — Bauhaus
8. **外部リンク** (`#links`) — Retro
9. **Contact** (`#contact`) — Modernism

- 各セクションの `data-bg` 属性に基づき、スクロールで `body` の背景色が遷移する（末尾の inline script）
- シナリオ一覧は frontmatter の配列（`murderMysteryScenarios` など）で管理
- フォントは Google Fonts（Inter, Zen Kaku Gothic New, JetBrains Mono ほか）
- GA4 (gtag) を head 内で読み込み

## Assets

`public/assets/` の画像はカードの背景やアバターとして CSS / img から参照:

- `icon.webp` — ナビのアバター & favicon
- `arknights.webp` / `endfield.webp` / `fgo.webp` — 各ゲームカードの背景

パッケージ追加時は固定バージョン指定を推奨（例: `bun add package@1.2.3`）

## Deployment

GitHub Actionsで自動デプロイ:

1. mainブランチへのpush時に発火
2. Bunで依存関係インストール・ビルド
3. GitHub Pagesにデプロイ
4. bidri.devでアクセス可能
