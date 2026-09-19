---
name: LLog
description: 게임 직후 펼쳐보는 KR 전적 장부 — 다크 전용, 시안 하나의 절제된 모바일 전적검색
colors:
  signal-cyan: "#22D3EE"
  signal-cyan-dim: "#1AA9BF"
  signal-cyan-surface: "rgba(34, 211, 238, 0.10)"
  signal-cyan-border: "rgba(34, 211, 238, 0.35)"
  on-signal-cyan: "#04181C"
  win-blue: "#3D7DE0"
  win-blue-surface: "rgba(61, 125, 224, 0.10)"
  win-blue-border: "rgba(61, 125, 224, 0.40)"
  loss-red: "#E0555B"
  loss-red-surface: "rgba(224, 85, 91, 0.10)"
  loss-red-border: "rgba(224, 85, 91, 0.40)"
  ledger-black: "#0E0F12"
  sunken-well: "#0B0C0F"
  slate-surface: "#16181D"
  raised-slate: "#1C1F26"
  press-slate: "#22262E"
  hairline: "#24272E"
  hairline-strong: "#30343D"
  ink: "#E8EAED"
  ink-secondary: "#A0A6AE"
  ink-muted: "#858B94"
  ink-disabled: "#4A4F57"
typography:
  display:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
  headline:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  headline-small:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  title:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  body-strong:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  label:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  label-small:
    fontFamily: "System (Roboto on Android, SF Pro on iOS)"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "14px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  xxxl: "32px"
  huge: "48px"
components:
  card:
    backgroundColor: "{colors.slate-surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-elevated:
    backgroundColor: "{colors.raised-slate}"
    rounded: "{rounded.lg}"
    padding: "16px"
  match-row-win:
    backgroundColor: "{colors.win-blue-surface}"
    rounded: "{rounded.lg}"
    padding: "12px 12px 12px 16px"
  match-row-loss:
    backgroundColor: "{colors.loss-red-surface}"
    rounded: "{rounded.lg}"
    padding: "12px 12px 12px 16px"
  search-input:
    backgroundColor: "{colors.sunken-well}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
  button-retry:
    backgroundColor: "{colors.signal-cyan-surface}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  chip-filter-selected:
    backgroundColor: "{colors.signal-cyan-surface}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  segmented-toggle:
    backgroundColor: "{colors.slate-surface}"
    rounded: "{rounded.md}"
    padding: "2px"
  segmented-toggle-selected:
    backgroundColor: "{colors.signal-cyan-surface}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sm}"
    padding: "8px 0"
  badge:
    backgroundColor: "{colors.raised-slate}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label-small}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-highlight:
    backgroundColor: "{colors.signal-cyan-surface}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.label-small}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: LLog

## Overview

**Creative North Star: "The Post-Game Ledger"**

LLog는 게임이 끝난 직후, 혹은 로딩 화면의 수십 초 동안 펼쳐보는 장부다. 거의 검은 중립 그레이 위에 숫자가 고정폭으로 정렬되고, 영역은 선 하나와 아주 얕은 표면 단차로만 나뉜다. 장식은 없다. 장부가 말을 거는 곳은 두 군데뿐이다: 승/패를 알리는 블루·레드, 그리고 "이 게임에서 무슨 일이 있었나"를 짚는 Signal Cyan.

밀도는 중간 이상이다. 한 매치 행에 챔피언·스펠·룬·KDA·결과·아이템·CS·뱃지가 모두 들어가지만, 텍스트 위계(ink → secondary → muted)와 8pt 간격으로 정돈되어 한 손 스크롤 중에도 읽힌다. 깊이는 그림자가 아니라 표면의 밝기 단계로 표현한다.

확정된 거부 대상: 과한 그라데이션, 네온 글로우, 드롭섀도 남발, 이모지, 고채도 남용, 두 번째 강조색.

**Key Characteristics:**
- 다크 전용. 라이트 테마는 존재하지 않는다.
- 강조색은 Signal Cyan 하나. 승/패 블루·레드는 결과 표시 전용 시맨틱.
- 1px hairline 보더 + 5단계 표면 단차로 영역을 가른다. 섀도 없음.
- 모든 수치는 tabular-nums로 정렬.
- 시스템 폰트(Android는 Roboto), 8단계 고정 타입 스케일.

## Colors

거의 검은 쿨 그레이 램프 위에 신호색 하나, 결과색 둘.

### Primary
- **Signal Cyan** (`signal-cyan`): 활성·포커스·핵심 해석에만 켜지는 신호등. 선택된 칩·세그먼트 텍스트, 포커스된 검색창 아이콘, 즐겨찾기 활성 별, 로딩 인디케이터, 재시도 버튼, MVP·펜타킬 등 하이라이트 뱃지. 면으로 쓸 때는 반드시 `signal-cyan-surface`(10%)와 `signal-cyan-border`(35%) 조합으로만 쓴다.
- **Signal Cyan Dim** (`signal-cyan-dim`): 시안이 보더·보조 역할로 물러나야 할 때.
- **On Signal Cyan** (`on-signal-cyan`): 시안을 꽉 채운 면 위 텍스트. 현재 꽉 찬 시안 면은 쓰지 않으므로 예약 토큰이다.

### Secondary
- **Win Blue** (`win-blue`, `-surface`, `-border`): 승리 전용. 매치 행 배경 틴트, 좌측 3px 액센트 바, "승리" 라벨, 스코어보드 승리 팀.
- **Loss Red** (`loss-red`, `-surface`, `-border`): 패배 전용, 그리고 KDA의 데스 숫자와 에러 문구(`danger`와 같은 값). 승/패 쌍은 `outcomeColors(win, remake)` 헬퍼로 한 번에 꺼낸다.
- **다시하기(remake)**: 승패가 아니므로 결과색을 쓰지 않는다. `outcomeColors(_, true)`가 중립(`ink-secondary` / `slate-surface` / `hairline`)을 돌려준다.

### Neutral
- **Ledger Black** (`ledger-black`): 앱 배경, 헤더, 스플래시·어댑티브 아이콘 배경.
- **Sunken Well** (`sunken-well`): 가장 깊은 면. 검색 입력, 아이콘 스프라이트 바탕.
- **Slate Surface** (`slate-surface`): 기본 카드·패널·세그먼트 트랙.
- **Raised Slate** (`raised-slate`): 카드 위 한 단 올린 영역, 중립 뱃지, 스켈레톤 블록.
- **Press Slate** (`press-slate`): 눌림·선택 피드백.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): 모든 보더와 디바이더. Strong은 중립 뱃지처럼 raised 면 위에서 선이 묻힐 때.
- **Ink 4단계** (`ink`, `ink-secondary`, `ink-muted`, `ink-disabled`): 본문 → 보조 수치 → 메타(큐·시간·라벨) → 빈 상태 아이콘. `ink-muted`는 배경·카드 위 4.5:1 이상으로 맞춰져 있다. `ink-disabled`는 정보를 담는 텍스트에 쓰지 않는다.

### Tier Palette (데이터 색, 브랜드 색 아님)
랭크 티어 색은 `src/lib/lol.ts`의 `tierColor()`에 있다. 랭크 카드의 티어명과 좌측 액센트 바에만 쓰며, 그 밖의 UI 요소에 가져다 쓰지 않는다.

### Named Rules
**The One Signal Rule.** 강조색은 Signal Cyan 하나뿐이다. 한 화면에서 시안이 켜진 요소는 "지금 선택된 것" 또는 "이 게임의 핵심"이어야 하며, 장식으로 켜지는 시안은 없다.

**The Outcome-Only Rule.** 블루와 레드는 승/패(와 에러)를 말할 때만 쓴다. 차트·링크·일반 강조에 빌려 쓰지 않는다.

**The Tint-Not-Fill Rule.** 색이 면을 차지할 때는 10% 틴트 표면 + 35~40% 보더로만 쓴다. 채도 100% 면은 3px 액센트 바가 최대다.

## Typography

**Display Font:** 시스템 폰트 (Android Roboto, iOS SF Pro)
**Body Font:** 동일
**Label/Mono Font:** 별도 폰트 없음. 숫자는 `tabular` prop으로 `tabular-nums`를 켠다.

**Character:** 커스텀 서체 없이 시스템 산세리프의 굵기와 크기만으로 위계를 만든다. 장부의 글자는 눈에 띄지 않아야 숫자가 읽힌다.

### Hierarchy
- **Display** (700, 28/34): 화면 최상위 한 줄. 드물게 쓴다.
- **Headline** (`h1`, 700, 22/28): 소환사 이름.
- **Headline Small** (`h2`, 600, 18/24): 섹션 제목.
- **Title** (600, 16/22): 카드 제목, 티어명, 빈 상태 제목, 검색 입력 텍스트, 태그라인.
- **Body** (400, 14/20) / **Body Strong** (600, 14/20): 본문과 KDA·승패·버튼 라벨.
- **Label** (`caption`, 500, 12/16): 큐 이름·경과 시간·CS·LP 같은 메타, 필터 칩.
- **Label Small** (`micro`, 500, 11/14): 뱃지 등 가장 작은 태그.

코드의 variant 이름은 괄호 안의 것(`h1`, `h2`, `caption`, `micro`)을 쓴다. 크기는 RN 기본대로 시스템 글꼴 크기 설정을 따른다.

### Named Rules
**The Tabular Ledger Rule.** 행마다 비교되는 숫자(KDA, 승률, LP, CS, 게임 시간)는 반드시 `tabular`로 렌더한다.

**The Eight Steps Rule.** 타입은 `typography` 토큰 8단계에서만 고른다. 화면별로 fontSize를 새로 만들지 않는다.

## Layout

8pt 그리드(보조로 2·4 허용). 모든 터치 영역은 최소 48dp(`touchTarget` 토큰). 칩처럼 작게 보여야 하는 요소는 바깥 Pressable이 48dp를 갖고 안쪽 View가 시각 크기를 갖는다. 화면 좌우 거터는 `lg`(16). 매치 목록은 `FlatList` 한 줄 세로 스택이며 카드 간격은 `sm`~`md`. 카드 내부 패딩은 `lg`(16), 매치 행은 좌측 액센트 바를 피해 좌 16 / 우 12 / 상하 12. 행 내부 요소 간격은 `md`(12)가 기본이다.

폰 세로 모드 한 손 사용이 전제다. 가로 모드와 태블릿 레이아웃은 없다(`orientation: portrait`). 목록 하단은 `huge`(48) 여백으로 제스처 바와 겹치지 않게 한다.

화면 구조: 네이티브 Stack 헤더(배경 `ledger-black`) + 본문. 하단 탭 없음. 검색 → 소환사 → 매치 상세의 단방향 드릴다운.

## Elevation & Depth

그림자를 쓰지 않는다. 깊이는 표면 밝기 5단계로만 표현한다: `sunken-well`(눌린/입력) < `ledger-black`(배경) < `slate-surface`(카드) < `raised-slate`(카드 위 영역) < `press-slate`(눌림). 각 면의 경계는 1px hairline이 잡는다.

### Named Rules
**The Flat Ledger Rule.** 드롭섀도·elevation·글로우는 없다. 한 단 올리고 싶으면 `raised-slate`로, 눌림은 `press-slate` 또는 opacity 0.85로 표현한다.

## Shapes

절제된 둥근 모서리. 컨테이너(카드·매치 행·검색창)는 `lg`(12), 버튼·세그먼트 트랙·즐겨찾기 버튼은 `md`(8), 뱃지·세그먼트 선택면·스프라이트는 `sm`(6). 완전한 알약형(`pill`)은 큐 필터 칩에만 쓴다. 원형은 프로필 아바타와 원형 옵션이 켜진 스프라이트.

보더는 `StyleSheet.hairlineWidth`(기기 최소 두께). 강조 바는 좌측 3px 세로 막대로, 매치 행(승/패 색)과 랭크 카드(티어 색)에 있다.

## Components

정돈되고 절제된. hairline 보더와 표면 단차로 형태를 잡고, 상태 변화는 색 톤으로만 알린다.

### Buttons
- **Shape:** `md`(8) 라운드, hairline 보더.
- **Retry (유일한 텍스트 버튼):** 시안 틴트 표면 + 시안 보더 + 시안 `body-strong` 라벨, 좌측 14px 아이콘. 패딩 8 × 16.
- **Icon Button (즐겨찾기):** 40×40, 비활성은 투명 + `hairline` 보더 + `ink-muted` 아이콘, 활성은 시안 틴트 표면·보더·아이콘. `hitSlop` 8로 터치 영역을 48 이상 확보.
- **Pressed:** 배경 `press-slate`.

### Chips
- **Queue Filter:** 알약형, 가로 스크롤 한 줄. 기본은 투명 + `hairline` 보더 + `ink-secondary`, 선택은 시안 틴트 + 시안 보더 + 시안 텍스트.
- **Match Badge:** `sm` 라운드 소형 태그(`label-small`). 기본은 `raised-slate` + `hairline-strong` + `ink-secondary`. MVP·펜타킬처럼 `highlight`인 뱃지만 시안 틴트.

### Cards / Containers
- **Corner Style:** `lg`(12).
- **Background:** `slate-surface`, `elevated` 시 `raised-slate`.
- **Shadow Strategy:** 없음(Elevation 참조).
- **Border:** hairline `hairline`.
- **Internal Padding:** 16.

### Inputs / Fields
- **Search Bar:** 높이 48, `sunken-well` 배경, `lg` 라운드, 좌측 18px 검색 아이콘, 입력 텍스트는 `title` 크기. 플레이스홀더 "소환사명 #태그".
- **Focus:** 보더가 `signal-cyan-border`로, 아이콘이 시안으로 바뀐다. 커서·선택색도 시안.
- **Error:** 입력 아래 `label` 크기 레드 문구.

### Navigation
- 네이티브 Stack 헤더, 배경 `ledger-black`. 화면 전환은 `goToSummoner`/`goToMatch`. 하단 내비게이션 바 없음.
- **Segmented Toggle:** `slate-surface` 트랙(패딩 2) 안에 균등 분할 세그먼트, 선택만 시안 틴트 + 시안 텍스트.

### Match Row (시그니처)
결과 틴트 표면(승 블루 / 패 레드 10%) + 같은 계열 40% 보더 + 좌측 3px 풀 채도 액센트 바. 세 줄 구조: ① 챔피언 아이콘(44) · 스펠/룬 · 큐·시간 / KDA(데스만 레드) / KDA 비율 · 우측 결과 라벨과 게임 시간, ② 뱃지 줄, ③ 아이템 슬롯(20) · CS와 분당 CS. 5분 미만 게임은 "다시하기". 로딩 중에는 같은 외형의 스켈레톤 블록(`raised-slate`)을 보여준다.

### Rank Card
`card` 위 좌측 3px 티어색 바, `label` 큐 이름 → `title` 티어명(티어색) → LP → 승·패와 승률. 로딩 중에는 스켈레톤, 실패하면 "불러오지 못함". "Unranked"(`ink-secondary`)는 조회에 성공했고 기록이 없을 때만.

### Recent Summary
랭크 카드 바로 아래의 한눈 판정 카드. 좌측에 "최근 N판" 라벨과 `headline-small` 크기의 승(win-blue)·패(loss-red) 수, 승률(`ink-secondary`). 우측에 가장 많이 한 챔피언 3개(32px 아이콘 + 판수·승률). 다시하기는 집계에서 뺀다. 시안은 쓰지 않는다.

### States
- **Loading:** 가운데 시안 `ActivityIndicator` + `ink-muted` 라벨.
- **Error:** `ink-muted` 경고 아이콘(28) + `ink-secondary` 한국어 메시지(최대 폭 280) + Retry 버튼.
- **Empty:** `ink-disabled` 아이콘(28) + `title` 제목 + `label` 설명.

## Do's and Don'ts

### Do:
- **Do** 모든 색·간격·타이포·라운드를 `src/theme` 토큰에서 가져온다.
- **Do** 새 UI는 `src/components/ui/`의 `Text`, `Card`, `Pill`, `Sprite`, `States`부터 조립한다.
- **Do** 시안은 선택·포커스·핵심 해석(하이라이트 뱃지)에만 켠다.
- **Do** 색 면은 10% 틴트 + 35~40% 보더 조합으로 쓴다.
- **Do** 비교되는 숫자에 `tabular`를 켠다.
- **Do** 로딩·에러·빈 상태를 `States` 프리미티브로 모든 데이터 화면에 둔다. 로딩과 실패를 "없음"으로 뭉개지 않는다.
- **Do** 모든 Pressable에 `accessibilityRole`과 한국어 `accessibilityLabel`을 단다. 선택형 컨트롤은 `accessibilityState={{ selected }}`.
- **Do** 터치 영역은 48dp 이상. Pressable을 Pressable 안에 중첩하지 않는다.

### Don't:
- **Don't** 두 번째 강조색을 들이지 않는다. 티어색도 랭크 표시 밖으로 꺼내지 않는다.
- **Don't** 드롭섀도·elevation·네온 글로우·그라데이션을 쓰지 않는다.
- **Don't** 블루·레드를 승/패·에러 이외의 의미로 쓰지 않는다.
- **Don't** 이모지를 UI에 쓰지 않는다. 아이콘은 Feather.
- **Don't** 컴포넌트 안에 hex 값을 하드코딩하지 않는다.
- **Don't** Riot 로고나 공식 브랜딩을 차용하지 않는다.
