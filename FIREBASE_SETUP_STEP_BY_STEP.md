# Firebase 실제 설정 가이드 (한 줄씩)

## ✅ 1단계: Firebase 프로젝트 생성

### 방법 1: 콘솔 접속
```
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 만들기" 버튼 클릭
4. 프로젝트 이름: health-ai (아무거나 상관없음)
5. Google 애널리틱스는 체크 해제 (선택사항)
6. "프로젝트 만들기" 클릭
```

완료하면 → **프로젝트 ID** 확인 (예: `health-ai-abc123`)

---

## ✅ 2단계: Firestore Database 생성

```
1. Firebase 콘솔 왼쪽 메뉴 → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. 프로덕션 모드 선택 (개발 모드는 나중에)
4. 위치: asia-southeast1 (가장 가깝고 빠름) 선택
5. "만들기" 클릭
```

---

## ✅ 3단계: Authentication 설정

```
1. Firebase 콘솔 왼쪽 메뉴 → "Authentication"
2. "Sign-in method" 탭 클릭
3. "이메일/비밀번호" 선택
4. "이메일/비밀번호" 토글 활성화
5. "저장" 클릭
```

---

## ✅ 4단계: 웹 앱 등록 & 설정값 복사

```
1. Firebase 콘솔 홈 → 톱니 아이콘 (설정) 클릭
2. "프로젝트 설정" 클릭
3. "앱" 탭에서 "</>" (웹) 선택
4. 앱 닉네임: health-ai-web (아무거나)
5. 등록 클릭
6. 나타나는 설정값 복사 (아래 형식)
```

**복사할 설정값:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## ✅ 5단계: Firestore 보안 규칙 설정

```
1. Firebase 콘솔 → "Firestore Database"
2. "Rules" 탭 클릭
3. 기존 코드 삭제 후 다음 붙여넣기:
```

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 컬렉션: 자신의 데이터만 접근
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // 건강 데이터: 자신의 데이터만 접근
    match /health_data/{document=**} {
      allow read, write: if request.auth.uid == resource.data.user_id;
      allow create: if request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

4. "발행" 클릭

---

## 🎯 완료! 다음은 뭘 하나요?

위 단계를 모두 완료하셨으면, **설정값들**을 말씀해주세요:

```
📋 필요한 정보:
1. apiKey: 
2. authDomain:
3. projectId:
4. storageBucket:
5. messagingSenderId:
6. appId:
```

그럼 제가 자동으로 `.env.local` 파일을 만들어드리겠습니다! ✨
