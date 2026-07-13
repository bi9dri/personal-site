// src/pages/index.astro から claude.ai/design「bidri.dev」プロジェクト用の index.html を生成する。
// ソースの整形を保ったまま Astro 式を展開し、画像パスをデザインプロジェクト側の img/*.png に
// 差し替え、デプロイ専用の要素（GA4・favicon）を除去する。
//
// 使い方: node .design-sync/gen-design-html.mjs [出力先]  (省略時 .design-sync/out/index.html)
// 生成物は DesignSync ツールで index.html としてアップロードする（プロジェクトIDは config.json）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(repoRoot, 'src/pages/index.astro'), 'utf8');

const m = src.match(/^---\n([\s\S]*?)\n---\n/);
if (!m) throw new Error('no frontmatter');
const fm = m[1];
let html = src.slice(m[0].length);

function extractArray(name) {
  const am = fm.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  if (!am) throw new Error(`array ${name} not found`);
  return [...am[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
}
const mm = extractArray('murderMysteryScenarios');
const coc = extractArray('cocScenarios');
const emo = extractArray('emocloreScenarios');

html = html.replace(
  /\{murderMysteryScenarios\.map\(\(s\) => <span>\{s\}<\/span>\)\}/,
  mm.map((s) => `<span>${s}</span>`).join('')
);
html = html.replace(
  /\{cocScenarios\.map\(\(s, i\) => <>\{i > 0 && <span class="sep">❧<\/span>\}\{s\}<\/>\)\}/,
  coc.join('<span class="sep">❧</span>')
);
html = html.replace(
  /\{emocloreScenarios\.map\(\(s\) => <span>\{s\}<\/span>\)\}/,
  emo.map((s) => `<span>${s}</span>`).join('')
);
html = html.replace(/\{currentYear\}/, String(new Date().getFullYear()));

html = html.replace('<style is:global>', '<style>');
html = html.replace('<script is:inline>', '<script>');
html = html.replace(/<Fragment set:html=\{ga4Script\} \/>\n/, '');
html = html.replace(/<link rel="icon"[^>]*\/>\n/, '');

html = html
  .replaceAll('/assets/arknights.webp', 'img/arknights-profile.png')
  .replaceAll('/assets/endfield.webp', 'img/endfield-profile.png')
  .replaceAll('/assets/fgo.webp', 'img/fgo-profile.png')
  .replaceAll('/assets/icon.webp', 'img/bidri-avatar.png');

const leftovers = html.match(/\{[a-zA-Z]|is:global|is:inline|set:html|\/assets\/|gtag/g);
if (leftovers) throw new Error('unexpanded template bits remain: ' + leftovers.join(', '));

const out = process.argv[2] ?? path.join(repoRoot, '.design-sync/out/index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('written', out, html.length, 'bytes');
