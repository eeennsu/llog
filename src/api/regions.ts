/**
 * 지역 고정: 한국(KR).
 *
 * 이 앱은 지역 선택 기능이 없다. 모든 요청은 KR 플랫폼으로 라우팅된다.
 *  - platform routing : 'kr'   (summoner-v4, league-v4, champion-mastery-v4)
 *  - regional routing : 'asia' (account-v1, match-v5)
 *
 * 프록시 client.ts 의 hostKey 로 그대로 쓰인다 (kr.api... / asia.api...).
 */

/** summoner / league / mastery 용 platform 호스트 키 */
export const PLATFORM = 'kr' as const;

/** match-v5 용 regional 호스트 키 */
export const REGIONAL = 'asia' as const;

/** account-v1 용 regional 호스트 키 (KR → asia) */
export const ACCOUNT_REGIONAL = 'asia' as const;
