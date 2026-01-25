# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)로 이동
2. "프로젝트 만들기" 클릭
3. 프로젝트 이름: `health-ai`
4. Google 애널리틱스는 선택 사항 (건너뛸 수 있음)

## 2. Authentication 설정

1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "Sign-in method" 탭에서 "이메일/비밀번호" 활성화
3. "저장" 클릭

## 3. Firestore Database 생성

1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 프로덕션 모드 선택
4. 위치: `asia-southeast1` (서울은 지원 안 함, 가장 가까운 위치 선택)
5. "만들기" 클릭

### Firestore 보안 규칙 설정

"Rules" 탭에서 다음 규칙으로 업데이트:

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

## 4. 웹 앱 등록

1. 프로젝트 설정 (톱니 아이콘) 클릭
2. "앱 추가" > "</>" (웹) 선택
3. 앱 닉네임: `health-ai-web`
4. 등록 완료 후 나타나는 Firebase 설정 복사

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

5. `.env.local` 파일 생성 후 붙여넣기:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 5. 서비스 어카운트 (백엔드용)

1. 프로젝트 설정 > "서비스 어카운트" 탭
2. "새 개인 키 생성" 클릭
3. JSON 파일 다운로드
4. `backend/firebase-credentials.json`으로 저장

## 6. 데이터베이스 구조

### users 컬렉션
```
{
  "name": "string",
  "email": "string",
  "age": number,
  "gender": "string",
  "createdAt": timestamp
}
```

### health_data 컬렉션
```
{
  "user_id": "string",
  "steps": number,
  "heart_rate": number,
  "sleep_hours": number,
  "water_intake": number,
  "calories": number,
  "timestamp": timestamp
}
```
