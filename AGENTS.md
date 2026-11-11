# Personal Site - Astro Static Site

## Project Overview

bidriの個人サイト。Astroで構築された静的サイト（1ページ構成）。
デザインは claude.ai/design の「bidri.dev」プロジェクトで作成したものを実装している。

## Tech Stack

- **Framework**: Astro v5
- **Styling**: 素のCSS（`index.astro` 内の `<style is:global>` で完結）
- **Package Manager**: Bun (mise 経由)
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
├── .agents/skills/        # エージェント用スキル
├── .github/workflows/     # CI/CD
│   └── deploy.yml         # GitHub Pagesデプロイ
├── mise.toml              # Bun などツールチェーン定義
├── astro.config.mjs       # Astro設定
└── package.json
```

## Commands

```bash
mise install                  # mise.toml のツール（Bun）をインストール
bun install                   # 依存関係インストール
bun run dev                   # 開発サーバー起動
bun run build                 # 本番ビルド（dist/に出力）
bun run preview               # ビルド結果プレビュー
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

## Skills (`.agents/skills/`)

- **modern-web-guidance** — Web標準のUI・CSS・アクセシビリティ・パフォーマンスベストプラクティスを適用する

## Dependency Management

- **固定バージョンのみ** — `^` / `~` を使わない（例: `bun add package@1.2.3`）。サプライチェーン対策。
- **公開から 7 日以上経ったバージョンを使う**（セキュリティ更新を除く）。公開直後に発覚する悪意あるリリースを避ける。
- **GitHub Actions** は `.github/workflows/actions.lock`（`gh actions-lock`）で commit に固定する。workflow 側は `actions/checkout@v7.0.1` のようなタグで書き、実行時は lockfile に記録された commit が使われる。
  - `uses:` を追加・変更したら `gh actions-lock` を実行し、workflow と `actions.lock` を同じ PR でコミットする（要 `gh extension install github/gh-actions-lock`）。
  - `.github/workflows/verify-actions-lock.yml` が `gh actions-lock --verify` で workflow と lockfile の乖離を検出する。
  - lockfile に載っている依存はリポジトリ設定「Require actions to be pinned to a full-length commit SHA」を満たす扱いになるため、workflow はタグ参照のままでよい。
- **更新は Renovate（GitHub App, `.github/renovate.json5`）が提案する** — 上記のルールは Renovate と gh actions-lock が強制している。手でバージョンを上げず、Renovate の PR をレビューする。
  - GitHub Actions の更新 PR では、Renovate が `actions.lock` も同時に再生成する。
  - bun の更新は `mise.toml` / `packageManager` / `@types/bun` をまとめた 1 PR で来る。
  - Renovate PR で CI が落ちたら、PR を閉じずにそのブランチで直す（新 API への追従など）。

## Deployment

GitHub Actionsで自動デプロイ:

1. mainブランチへのpush時に発火
2. Bunで依存関係インストール・ビルド
3. GitHub Pagesにデプロイ
4. bidri.devでアクセス可能