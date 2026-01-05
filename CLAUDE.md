# Personal Site - Astro Static Site

## Project Overview

びどりの個人サイト。Astro + Tailwind CSSで構築された静的サイト。

## Tech Stack

- **Framework**: Astro v5
- **Styling**: Tailwind CSS v3
- **Package Manager**: Bun
- **Hosting**: GitHub Pages (bidri.dev)

## Directory Structure

```
personal-site/
├── src/
│   ├── components/        # Astroコンポーネント
│   │   ├── Navigation.astro      # ナビゲーション
│   │   ├── ProfileHeader.astro   # プロフィールヘッダー
│   │   └── ScrollableList.astro  # スクロール可能リスト
│   ├── layouts/
│   │   └── BaseLayout.astro      # 共通レイアウト
│   ├── pages/             # ルーティング
│   │   ├── index.astro           # トップページ
│   │   └── profile.astro         # プロフィールページ
│   └── config.ts          # サイト設定（NAV_ITEMS, PAGE_TITLES）
├── public/                # 静的アセット
│   ├── assets/            # 画像ファイル
│   └── CNAME              # カスタムドメイン設定
├── .github/workflows/     # CI/CD
│   └── deploy.yml         # GitHub Pagesデプロイ
├── astro.config.mjs       # Astro設定
├── tailwind.config.mjs    # Tailwind設定
└── package.json
```

## Commands

```bash
bun install     # 依存関係インストール
bun run dev     # 開発サーバー起動
bun run build   # 本番ビルド（dist/に出力）
bun run preview # ビルド結果プレビュー
```

## Components

### BaseLayout
共通のHTML構造、ヘッダー、フッター、目次サイドバーを提供。
- `title`: ページタイトル
- `headings`: 目次用の見出し配列（2つ以上でサイドバー表示）

### Navigation
NAV_ITEMSに基づいてナビゲーションリンクを生成。
- 内部リンク: アクティブ状態のハイライト
- 外部リンク: 新しいタブで開く

### ProfileHeader
プロフィールページのヘッダー。アイコンと吹き出しメッセージを表示。

### ScrollableList
スクロール可能なリスト。最大5.5行表示、下部にフェードグラデーション。

## Design System

### Colors (Dark Theme)
```
primary:      #38BDF8 (sky blue)
primary-dark: #7DD3FC (lighter blue for text)
background:   #0F172A (dark navy)
surface:      #1E293B (card background)
text:         #E2E8F0 (light gray)
```

### Spacing Scale
```
xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
```

### Breakpoints
- 1024px: サイドバーが横並びレイアウトに変更
- 768px: ヘッダーが縦並びに、フォントサイズ縮小
- 480px: さらにコンパクトなレイアウト

## Configuration

### src/config.ts
```typescript
// ナビゲーション項目
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', internal: true },
  { href: '/profile', label: 'Profile', internal: true },
  { href: 'https://...', label: 'Side Oripathy', internal: false },
];

// ページタイトル
export const PAGE_TITLES: Record<string, string> = {
  '/': 'bidri',
  '/profile': 'Profile - bidri',
};
```

## Deployment

GitHub Actionsで自動デプロイ:
1. mainブランチへのpush時に発火
2. Bunで依存関係インストール・ビルド
3. GitHub Pagesにデプロイ
4. bidri.devでアクセス可能

### 手動設定（初回のみ）
1. GitHub Settings → Pages → Source: GitHub Actions
2. Custom domain: bidri.dev
3. DNSでAレコードをGitHub Pagesに向ける
