HEAD
# Health AI 프로젝트

건강과 AI를 결합한 헬스케어 솔루션입니다.

## 프로젝트 구조

- **frontend/** - React 기반 프론트엔드 (로그인, 대시보드, 건강 데이터)
- **backend/** - Python Flask 기반 백엔드 (API)
- **FIREBASE_SETUP.md** - Firebase 초기 설정 가이드

## 기술 스택

### Frontend
- React 18
- React Router v6
- Firebase Authentication
- Firestore Database
- CSS3

### Backend
- Python 3.9+
- Flask
- Firebase Admin SDK
- Flask-CORS

### Database
- Firebase Firestore
- Firebase Authentication

## 시작하기

### 1. Firebase 설정

[FIREBASE_SETUP.md](./FIREBASE_SETUP.md) 문서를 참고하여 Firebase 프로젝트를 설정하세요.

### 2. Frontend 설정

```bash
cd frontend
npm install
cp .env.example .env.local
```

`.env.local`에 Firebase 설정 추가 (FIREBASE_SETUP.md 참고):
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_BACKEND_URL=http://localhost:5000
```

Frontend 실행:
```bash
npm start
```

브라우저에서 `http://localhost:3000`로 접속합니다.

### 3. Backend 설정

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

`.env`에 설정 추가:
```
DEBUG=True
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

Firebase 서비스 어카운트 JSON을 `backend/firebase-credentials.json`으로 복사합니다.

Backend 실행:
```bash
python app.py
```

API는 `http://localhost:5000`에서 실행됩니다.

## 주요 기능

### 🔐 인증
- 이메일/비밀번호 기반 회원가입
- Firebase 인증 통합
- 로그인/로그아웃

### 📊 건강 데이터 관리
- 일일 건강 데이터 입력
  - 🚶 걸음 수
  - ❤️ 심박수
  - 😴 수면 시간
  - 💧 물 섭취량
  - 🔥 칼로리 섭취

### 📈 데이터 분석
- 건강 데이터 조회 및 필터링
- 기간별 건강 데이터 요약
- 실시간 데이터 동기화

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/verify-token` - 토큰 검증
- `GET /api/auth/user-data/<user_id>` - 사용자 데이터 조회
- `PUT /api/auth/update-user/<user_id>` - 사용자 데이터 업데이트

### 건강 데이터 (Health)
- `POST /api/health/data` - 건강 데이터 추가
- `GET /api/health/data/<user_id>` - 사용자 건강 데이터 조회
  - 쿼리 파라미터: `order_by`, `order`, `limit`
- `PUT /api/health/data/<doc_id>` - 건강 데이터 업데이트
- `DELETE /api/health/data/<doc_id>` - 건강 데이터 삭제
- `GET /api/health/summary/<user_id>` - 건강 데이터 요약

## Database 구조

### users 컬렉션
```javascript
{
  uid: "string",
  name: "string",
  email: "string",
  age: number | null,
  gender: "string" | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### health_data 컬렉션
```javascript
{
  user_id: "string",
  steps: number,
  heart_rate: number,
  sleep_hours: number,
  water_intake: number,
  calories: number,
  timestamp: timestamp,
  updated_at: timestamp
}
```

## 화면 구성

### 로그인 화면
- 이메일/비밀번호 입력
- 회원가입 링크

### 회원가입 화면
- 이름, 이메일, 비밀번호 입력
- 입력값 검증

### 대시보드
- **개요 탭**: 기능 소개 및 요약
- **건강 데이터 탭**: 
  - 데이터 입력 양식
  - 저장된 데이터 테이블
  - 실시간 동기화

## 향후 개발 계획

- [ ] AI 기반 건강 분석 및 추천
- [ ] 운동 추적 및 분석
- [ ] 영양 관리 시스템
- [ ] 수면 패턴 분석
- [ ] 모바일 앱 (React Native)
- [ ] 실시간 알림 시스템
- [ ] 의료 전문가 상담 기능
- [ ] 소셜 공유 기능
- [ ] 데이터 내보내기 (CSV, PDF)

## 개발 팁

### Frontend 개발
```bash
cd frontend
npm start  # 개발 서버 시작 (http://localhost:3000)
npm run build  # 프로덕션 빌드
npm test  # 테스트 실행
```

### Backend 개발
```bash
cd backend
python app.py  # 개발 서버 시작 (http://localhost:5000)
# 또는
flask run
```

### 환경변수 확인
```bash
# Frontend
cat .env.local

# Backend
cat .env
```

## 문제 해결

### CORS 오류
- Backend의 CORS 설정 확인 (app.py)
- Frontend의 REACT_APP_BACKEND_URL 확인

### Firebase 연결 오류
- Firebase 자격증명 확인
- Firestore 보안 규칙 확인

### 데이터가 표시되지 않음
- Firestore 콘솔에서 데이터 확인
- 브라우저 개발자 도구에서 API 응답 확인

## 라이센스

MIT

## 문의

이 프로젝트에 대한 질문이나 제안이 있으신가요? 이슈를 생성해주세요!

=======
# health-ai
9d8d97eed85e96d800aa06a43c753d42b89cff93
