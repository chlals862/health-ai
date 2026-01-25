import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// ===== 인증 서비스 =====
export const authServiceFirebase = {
  // 로그인
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        uid: userCredential.user.uid,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 회원가입
  signup: async (email, password, name) => {
    try {
      // 사용자 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 프로필 업데이트
      await updateProfile(user, {
        displayName: name,
      });

      // Firestore에 사용자 데이터 저장
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        age: null,
        gender: null,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        user: user,
        uid: user.uid,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 현재 사용자 확인
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // 로그인 상태 리스너
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};

// ===== Firestore 사용자 서비스 =====
export const userServiceFirebase = {
  // 사용자 정보 조회
  getUserData: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data(),
        };
      } else {
        return {
          success: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 사용자 정보 업데이트
  updateUserData: async (userId, data) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: '사용자 정보가 업데이트되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default {
  authServiceFirebase,
  userServiceFirebase,
};
