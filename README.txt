마곡상품권 관리자 버전

공개 홈페이지: /
관리자 페이지: /admin.html  (공개 홈페이지에는 링크가 없습니다.)

Vercel 환경변수:
1) ADMIN_PASSWORD = 사장님만 아는 관리자 비밀번호
2) KV_REST_API_URL = Upstash 연결 시 자동 생성
3) KV_REST_API_TOKEN = Upstash 연결 시 자동 생성

현재 Vercel Upstash 연결은 KV_REST_API_URL / KV_REST_API_TOKEN을 자동 생성합니다. 코드에는 예전 UPSTASH_REDIS_REST_URL / TOKEN 이름도 호환되도록 처리되어 있습니다.
가격 저장 후 모든 방문자가 /api/prices에서 같은 데이터를 읽습니다.
