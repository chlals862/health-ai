import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import './HealthDataList.css';

function HealthDataList({ userId, refreshKey }) {
  const [healthDataList, setHealthDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    try {
      const healthDataRef = collection(db, 'health_data');
      const q = query(
        healthDataRef,
        where('user_id', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setHealthDataList(data);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId, refreshKey]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="health-data-loading">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="health-data-error">오류: {error}</div>;
  }

  return (
    <div className="health-data-list-container">
      <h3>📊 건강 데이터 기록</h3>

      {healthDataList.length === 0 ? (
        <div className="no-data">
          <p>저장된 건강 데이터가 없습니다.</p>
          <p>위의 양식에서 데이터를 입력해주세요!</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>날짜 및 시간</th>
                <th>🚶 걸음</th>
                <th>❤️ 심박수</th>
                <th>😴 수면</th>
                <th>💧 물</th>
                <th>🔥 칼로리</th>
              </tr>
            </thead>
            <tbody>
              {healthDataList.map((data) => (
                <tr key={data.id}>
                  <td className="date-cell">{formatDate(data.timestamp)}</td>
                  <td>{data.steps || 0}</td>
                  <td>{data.heart_rate || 0}</td>
                  <td>{data.sleep_hours || 0}h</td>
                  <td>{data.water_intake || 0}ml</td>
                  <td>{data.calories || 0}kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HealthDataList;
