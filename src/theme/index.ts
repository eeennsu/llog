/**
 * 디자인 토큰 — 단일 진실 소스.
 *
 * 원칙(디자이너 톤, "AI 슬롭" 회피):
 *  - 강조색은 시안 1개뿐. 큰 면적 채움이 아니라 활성/포커스/핵심 수치 등 의도 있는 지점에만.
 *  - 베이스는 중립 그레이 스케일. 승/패는 블루/레드(시맨틱 한정).
 *  - 8pt 그리드 간격. 명확한 타이포 위계. 얇은 보더 + 미묘한 표면 단차로 영역 분리.
 *  - 과한 그라데이션/네온 글로우/드롭섀도 남발/이모지/고채도 남용 금지.
 *
 * 다크 전용(app.json userInterfaceStyle: dark).
 */

export const colors = {
  // 표면 단차 (어두운 → 밝은 순)
  bg: '#0E0F12', // 앱 배경
  surface: '#16181D', // 카드/패널
  surfaceElevated: '#1C1F26', // 카드 위 강조 영역
  surfaceSunken: '#0B0C0F', // 입력 등 눌린 영역
  hover: '#22262E', // 선택/프레스

  // 보더 (얇고 미묘하게)
  border: '#24272E',
  borderStrong: '#30343D',

  // 텍스트 위계
  text: '#E8EAED',
  textSecondary: '#A0A6AE',
  textMuted: '#6C727B',
  textDisabled: '#4A4F57',
  onPrimary: '#04181C', // 시안 위 텍스트

  // 강조색 — 시안 (유일)
  primary: '#22D3EE',
  primaryDim: '#1AA9BF', // 보더/세컨더리 용 약화
  primarySurface: 'rgba(34, 211, 238, 0.10)', // 아주 옅은 시안 표면
  primaryBorder: 'rgba(34, 211, 238, 0.35)',

  // 시맨틱 (승/패 한정)
  win: '#3D7DE0',
  winSurface: 'rgba(61, 125, 224, 0.10)',
  winBorder: 'rgba(61, 125, 224, 0.40)',
  loss: '#E0555B',
  lossSurface: 'rgba(224, 85, 91, 0.10)',
  lossBorder: 'rgba(224, 85, 91, 0.40)',

  // 상태
  danger: '#E0555B',
  transparent: 'transparent',
} as const;

/** 8pt 그리드 (half=2 허용) */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

/** 모서리 — 절제 있게 (남발 금지) */
export const radii = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const borderWidths = {
  hairline: 1,
} as const;

/** 타이포 스케일 — 명확한 위계 */
export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  h1: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  title: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const },
} as const;

export type TypographyVariant = keyof typeof typography;

/** 승/패에 따른 시맨틱 색 묶음 */
export function outcomeColors(win: boolean) {
  return win
    ? { main: colors.win, surface: colors.winSurface, border: colors.winBorder }
    : { main: colors.loss, surface: colors.lossSurface, border: colors.lossBorder };
}
