import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authServiceFirebase } from '../services/firebase';
import HealthDataForm from '../components/HealthDataForm';
import HealthDataList from '../components/HealthDataList';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authServiceFirebase.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
      } else {
        setUser(currentUser);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const result = await authServiceFirebase.logout();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleDataAdded = () => {
    // 데이터 추가 후 목록 새로고침
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>💪 Health AI Dashboard</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 대시보드
          </button>
          <button 
            className={`tab ${activeTab === 'health-data' ? 'active' : ''}`}
            onClick={() => setActiveTab('health-data')}
          >
            📈 건강 데이터
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="welcome-card">
              <h2>환영합니다, {user?.displayName || user?.email}님!</h2>
              <p>건강 관리 AI 대시보드에 접속하셨습니다.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <h3>📊 건강 데이터 분석</h3>
                <p>일일 건강 데이터를 입력하고 AI가 분석해드립니다.</p>
              </div>
              <div className="feature-card">
                <h3>🏃 운동 추적</h3>
                <p>일일 운동량 및 진전 상황을 추적합니다.</p>
              </div>
              <div className="feature-card">
                <h3>🥗 영양 관리</h3>
                <p>식단 및 영양 정보를 관리합니다.</p>
              </div>
              <div className="feature-card">
                <h3>💤 수면 분석</h3>
                <p>수면 패턴을 분석하고 개선 방안을 제시합니다.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'health-data' && (
          <div className="health-data-section">
            <HealthDataForm userId={user.uid} onDataAdded={handleDataAdded} />
            <HealthDataList userId={user.uid} refreshKey={refreshKey} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
