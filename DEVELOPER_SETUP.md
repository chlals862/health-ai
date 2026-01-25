# Health AI - 개발자 설정 가이드

다른 개발자가 이 프로젝트에서 함께 개발하기 위한 가이드입니다.

## 🚀 빠른 시작

### 1단계: 프로젝트 Clone

```bash
git clone https://github.com/YOUR_USERNAME/health-ai.git
cd health-ai
```

### 2단계: Frontend 환경 설정

```bash
cd frontend

# .env.local 파일 생성
copy .env.example .env.local
```

### 3단계: Firebase 설정값 추가

`.env.local` 파일을 열어서 다음 값들을 추가하세요:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyATz0gx1SQpH6EItX3KKhA-Mc8rx3q_Qh8
REACT_APP_FIREBASE_AUTH_DOMAIN=health-ai-242d7.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=health-ai-242d7
REACT_APP_FIREBASE_STORAGE_BUCKET=health-ai-242d7.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=582629561510
REACT_APP_FIREBASE_APP_ID=1:582629561510:web:d92eb5938e59fec7d25067
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4단계: 의존성 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm start
```

---

## 📚 프로젝트 구조

```
health-ai/
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 (Login, Signup, Dashboard)
│   │   ├── services/       # API 및 Firebase 서비스
│   │   ├── config/         # Firebase 설정
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example        # 환경변수 템플릿
│   ├── package.json
│   └── README.md
│
├── backend/                # Python Flask 백엔드
│   ├── routes/             # API 라우트
│   ├── app.py              # Flask 메인 앱
│   ├── config.py           # 설정
│   ├── requirements.txt
│   └── .env.example
│
├── FIREBASE_SETUP.md       # Firebase 설정 가이드
├── DB_INTEGRATION.md       # DB 연동 가이드
├── README.md               # 프로젝트 소개
└── .gitignore              # Git 제외 파일
```

---

## 🔧 Git 워크플로우

### 새 기능 개발할 때:

```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 새 브랜치 생성
git checkout -b feature/기능이름
# 예: git checkout -b feature/user-profile

# 3. 코드 작성 및 테스트

# 4. 변경사항 커밋
git add .
git commit -m "feat: 기능 설명"

# 5. 브랜치 push
git push origin feature/기능이름

# 6. GitHub에서 Pull Request 생성
# → Merge 후 브랜치 삭제
```

### 커밋 메시지 규칙:

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 코드 구조 변경
test: 테스트 추가
```

---

## 🚨 주의사항

### ⚠️ 절대 GitHub에 올리면 안 되는 것:

- `.env.local` (Firebase 설정값 포함)
- `firebase-credentials.json` (서비스 계정)
- `node_modules/` (자동 제외)
- `.env` 파일들

→ `.gitignore` 파일에 이미 등록됨 ✅

---

## 📞 개발 중 문제가 생기면:

### 1. 의존성 문제
```bash
# node_modules 재설치
rm -r node_modules
npm install
```

### 2. Firebase 연결 오류
- `.env.local` 파일 확인
- 모든 설정값이 올바른지 확인
- Firebase 콘솔에서 프로젝트 상태 확인

### 3. 포트 충돌
```bash
# 다른 포트에서 실행
npm start -- --port 3001
```

---

## 🎯 개발 팁

### Frontend 개발:
```bash
cd frontend
npm start  # 개발 서버 (자동 새로고침)
```

### Backend 개발:
```bash
cd backend
python app.py  # Flask 서버
```

### 동시에 실행하기:
- Terminal 1: `cd frontend && npm start`
- Terminal 2: `cd backend && python app.py`

---

## 📖 유용한 문서

- [Firebase 설정 가이드](./FIREBASE_SETUP.md)
- [DB 연동 가이드](./DB_INTEGRATION.md)
- [README](./README.md)

---

**질문이 있으면 README.md를 참고하거나 팀원에게 연락하세요!** 🚀
