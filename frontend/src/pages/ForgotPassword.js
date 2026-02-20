import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authServiceFirebase } from '../services/firebase';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasCode, setHasCode] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL에서 oobCode 파라미터 확인 (Firebase 이메일 링크에서 올 때)
  useEffect(() => {
    // Firebase는 ?oobCode= 또는 ?code= 형식으로 보낼 수 있음
    const oobCode = searchParams.get('oobCode') || searchParams.get('code');
    const mode = searchParams.get('mode');
    
    console.log('URL params:', { oobCode, mode, allParams: Object.fromEntries(searchParams) }); // 디버깅용
    
    if (oobCode || (mode === 'resetPassword')) {
      // 코드 검증
      verifyResetCode(oobCode || searchParams.get('code'));
    }
  }, [searchParams]);

  // 비밀번호 재설정 코드 검증
  const verifyResetCode = async (code) => {
    try {
      const result = await authServiceFirebase.verifyResetCode(code);
      if (result.success) {
        setHasCode(true);
        setEmail(result.email || '');
        console.log('코드 검증 성공, 이메일:', result.email);
      } else {
        setError('유효하지 않은 비밀번호 재설정 링크입니다.');
        console.error('코드 검증 실패:', result.error);
      }
    } catch (err) {
      setError('링크 검증 중 오류가 발생했습니다.');
      console.error('검증 오류:', err);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email.trim()) {
      setError('이메일을 입력하세요.');
      setLoading(false);
      return;
    }

    try {
      const result = await authServiceFirebase.sendPasswordReset(email);
      
      if (result.success) {
        setSuccess(
          '✓ 비밀번호 재설정 이메일이 전송되었습니다.\n' +
          '이메일의 링크를 클릭하면 바로 재설정 화면으로 이동합니다.'
        );
        // 이메일 입력창 비우기
        setTimeout(() => {
          setEmail('');
        }, 2000);
      } else {
        setError(result.error || '이메일 전송에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력하세요.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const oobCode = searchParams.get('oobCode') || searchParams.get('code');
      if (!oobCode) {
        setError('유효하지 않은 링크입니다. 이메일에서 다시 시도하세요.');
        setLoading(false);
        return;
      }

      const result = await authServiceFirebase.confirmPasswordReset(oobCode, newPassword);
      
      if (result.success) {
        setSuccess('✓ 비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.');
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>🔑 비밀번호 재설정</h1>
          {!hasCode ? (
            <p>가입된 이메일을 입력하면 재설정 링크를 보내드립니다</p>
          ) : (
            <p>새로운 비밀번호를 설정하세요</p>
          )}
        </div>

        {!hasCode ? (
          // 이메일 입력 단계 (처음 진입할 때)
          <form onSubmit={handleSendResetEmail} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? '전송 중...' : '재설정 이메일 전송'}
            </button>
          </form>
        ) : (
          // 비밀번호 재설정 단계 (이메일 링크에서 온 경우)
          <form onSubmit={handleResetPassword} className="forgot-form">
            {email && (
              <div className="email-info">
                <p>이메일: <strong>{email}</strong></p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                id="newPassword"
                type="password"
                placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              {confirmPassword && newPassword === confirmPassword && (
                <small className="match">✓ 비밀번호가 일치합니다</small>
              )}
              {confirmPassword && newPassword !== confirmPassword && (
                <small className="mismatch">✗ 비밀번호가 일치하지 않습니다</small>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? '설정 중...' : '비밀번호 재설정'}
            </button>
          </form>
        )}

        <div className="forgot-footer">
          <p>
            <Link to="/login" className="back-to-login-link">
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
