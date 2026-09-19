/**
 * LLog 브랜드 에셋 생성기.
 *
 * 디자인: 다크(#0E0F12) 위에 시안 단일 강조(#22D3EE)로 그린 "LL" 레이어드 모노그램.
 * 두 개의 L을 겹쳐 "전적이 쌓이는 기록 층(log)"을 은유한다. 그라데이션/글로우 없이 평면·기하학.
 *
 * 실행:  node scripts/generate-brand-assets.js
 * 의존:  sharp (SVG -> PNG 래스터라이즈)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'assets', 'images');

const BG = '#0E0F12';
const FRONT = '#22D3EE'; // 시안 (강조, 앞 레이어)
const BACK = '#1AA9BF'; // 약화 시안 (뒤 레이어)
const WHITE = '#FFFFFF';

// 모노그램 기하 (1024 기준)
const T = 120; // 획 두께
const H = 470; // L 높이
const FOOT = 260; // 발(가로) 길이
const TOP = 270;
const FOOT_Y = TOP + H - T; // 620
const BACK_X = 282;
const FRONT_X = 482;

/** 한 개의 L (세로획 + 발). sep>0 이면 분리용 외곽선 추가 */
function lShape(x, color, sep) {
  const stroke = sep ? ` stroke="${sep}" stroke-width="22"` : '';
  return (
    `<rect x="${x}" y="${TOP}" width="${T}" height="${H}" rx="18"${stroke} fill="${color}"/>` +
    `<rect x="${x}" y="${FOOT_Y}" width="${FOOT}" height="${T}" rx="18"${stroke} fill="${color}"/>`
  );
}

/** 겹친 LL 모노그램. 뒤(BACK) → 앞(FRONT) 순. sep = 겹침 분리선 색 */
function mark({ front = FRONT, back = BACK, sep = null } = {}) {
  return lShape(BACK_X, back, null) + lShape(FRONT_X, front, sep);
}

/** 모노그램을 중심 기준으로 scale 배율 적용해 감싼다 */
function scaled(inner, scale) {
  const c = 512;
  return `<g transform="translate(${c} ${c}) scale(${scale}) translate(${-c} ${-c})">${inner}</g>`;
}

function svg(body, { bg = null } = {}) {
  const bgRect = bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${bgRect}${body}</svg>`;
}

async function render(name, svgStr, size) {
  const buf = Buffer.from(svgStr);
  let img = sharp(buf, { density: 384 }).resize(size, size);
  await img.png().toFile(path.join(OUT, name));
  console.log(`  ✓ ${name} (${size}x${size})`);
}

async function main() {
  console.log('LLog 브랜드 에셋 생성:');

  // 앱 아이콘 — 다크 풀블리드 + 겹침 분리선(BG색)
  await render('icon.png', svg(mark({ sep: BG }), { bg: BG }), 1024);

  // 스플래시 — 투명 배경 모노그램(앱이 backgroundColor #0E0F12 위에 올림)
  await render('splash-icon.png', svg(scaled(mark({ sep: BG }), 1.0)), 1024);

  // 파비콘(웹)
  await render('favicon.png', svg(mark({ sep: BG }), { bg: BG }), 196);

  // 안드로이드 적응형 아이콘 — 전경(세이프존 66%), 배경(단색), 모노크롬(흰색)
  await render('android-icon-foreground.png', svg(scaled(mark({ sep: BG }), 0.62)), 1024);
  await render('android-icon-background.png', svg('', { bg: BG }), 1024);
  await render(
    'android-icon-monochrome.png',
    svg(scaled(mark({ front: WHITE, back: WHITE }), 0.62)),
    1024,
  );

  console.log('완료. assets/images/ 갱신됨.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
