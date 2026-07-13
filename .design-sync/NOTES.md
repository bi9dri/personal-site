# design-sync notes

このリポジトリの /design-sync は通常のスキル（デザインシステムのアップロード）とは**逆方向**:
`src/pages/index.astro` を正として、claude.ai/design の「bidri.dev」プロジェクト
（`config.json` の `projectId`、通常のプロジェクトでありデザインシステム型ではない）の
`index.html` を現状のサイトに合わせて更新する。

理由: サイトは 2026-07-06 にデザインプロジェクトの index.html を実装した後、
リポジトリ側だけで進化している（Bluesky を Contact のメインに、EMO-KLORE TRPG の
3色ブランディング、シナリオ追加など）。デザイン側で新しい変更が無いことを確認してから
上書きすること（`v1/`・`v2/` は過去イテレーションなので比較対象は root の `index.html`）。

## 手順

1. `node .design-sync/gen-design-html.mjs` → `.design-sync/out/index.html` を生成
2. DesignSync ツールで対象プロジェクトの `index.html` を確認し、デザイン側に
   リポジトリ未反映の変更が無いかを diff で確認
3. `finalize_plan`（writes: ["index.html"]、localDir: `.design-sync/out`）→ `write_files`

## 生成時の変換

- Astro 式を展開: シナリオ配列 3 種（frontmatter）、`{currentYear}`
- `is:global` / `is:inline` / `<Fragment set:html>` を素の HTML に
- 除去: GA4 (gtag)、favicon link（デザインプレビューには不要）
- 画像パスの対応（デザインプロジェクト側には webp が無いため png を参照）:
  - `/assets/arknights.webp` → `img/arknights-profile.png`
  - `/assets/endfield.webp` → `img/endfield-profile.png`
  - `/assets/fgo.webp` → `img/fgo-profile.png`
  - `/assets/icon.webp` → `img/bidri-avatar.png`

## 既知の差分（意図的にリポジトリ側を採用）

- デザイン旧版にあった Discord の Contact 行・`.chan.accent` スタイルは
  2026-07-10 の Bluesky 再構成で置き換え済み
- デザイン旧版の Memphis カード SVG の波線・三角形パスは `d` 属性内の
  `%` 指定が不正な SVG のため実装時に削除済み（復活させない）
- 旧版の未使用フォント（Archivo, Poiret One, Orbitron, Bungee）と未使用の
  `.hero` CSS は同期対象外

同期履歴: 2026-07-13 初回 repo→design 同期（このノート作成時）
