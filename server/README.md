# LoL History — Riot API 프록시

Riot API 키를 은닉하기 위한 패스스루 프록시입니다. 앱은 이 프록시에만 통신하고,
프록시가 `X-Riot-Token` 헤더로 키를 주입합니다. (Riot은 CORS 미지원 + 클라이언트 키 노출 금지)

## 로컬 실행

```bash
cd server
npm install
cp .env.example .env.local   # .env.local 에 RIOT_API_KEY 입력
npm run dev                  # http://localhost:3000 에서 구동
```

앱 쪽에서는 루트 `.env` 의 `EXPO_PUBLIC_API_BASE=http://localhost:3000` 로 이 프록시를 가리킵니다.

## 엔드포인트

```
GET /api/riot/<hostKey>/<riot path...>?<query>
```

- `hostKey`: platform(`kr`,`na1`…) 또는 regional(`asia`,`americas`,`europe`,`sea`)
- 예: `/api/riot/asia/riot/account/v1/accounts/by-riot-id/Hide on bush/KR1`

## 배포 (선택)

```bash
vercel deploy --prod
```

배포 후 Vercel 프로젝트 환경변수에 `RIOT_API_KEY` 를 등록하고,
앱의 `EXPO_PUBLIC_API_BASE` 를 배포 URL로 바꾸세요.

> 주의: 개발용 키는 24시간마다 만료됩니다. 만료 시 `.env.local`(또는 Vercel 환경변수)을 갱신하세요.
