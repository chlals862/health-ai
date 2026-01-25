import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import './HealthDataForm.css';

function HealthDataForm({ userId, onDataAdded }) {
  const [formData, setFormData] = useState({
    steps: '',
    heart_rate: '',
    sleep_hours: '',
    water_intake: '',
    calories: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const healthDataRef = collection(db, 'health_data');
      const newData = {
        user_id: userId,
        steps: formData.steps || 0,
        heart_rate: formData.heart_rate || 0,
        sleep_hours: formData.sleep_hours || 0,
        water_intake: formData.water_intake || 0,
        calories: formData.calories || 0,
        timestamp: serverTimestamp(),
      };

      await addDoc(healthDataRef, newData);

      setSuccess('건강 데이터가 저장되었습니다!');
      setFormData({
        steps: '',
        heart_rate: '',
        sleep_hours: '',
        water_intake: '',
        calories: '',
      });

      // 부모 컴포넌트에 데이터 추가 완료 알림
      if (onDataAdded) {
        onDataAdded();
      }

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-data-form-container">
      <div className="form-card">
        <h3>📝 오늘의 건강 데이터 입력</h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="health-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="steps">
                <span>🚶</span> 걸음 수 (걸음)
              </label>
              <input
                id="steps"
                type="number"
                name="steps"
                placeholder="0"
                value={formData.steps}
                onChange={handleChange}
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="heart_rate">
                <span>❤️</span> 심박수 (bpm)
              </label>
              <input
                id="heart_rate"
                type="number"
                name="heart_rate"
                placeholder="0"
                value={formData.heart_rate}
                onChange={handleChange}
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sleep_hours">
                <span>😴</span> 수면 시간 (시간)
              </label>
              <input
                id="sleep_hours"
                type="number"
                name="sleep_hours"
                placeholder="0"
                value={formData.sleep_hours}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="water_intake">
                <span>💧</span> 물 섭취량 (ml)
              </label>
              <input
                id="water_intake"
                type="number"
                name="water_intake"
                placeholder="0"
                value={formData.water_intake}
                onChange={handleChange}
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="calories">
              <span>🔥</span> 칼로리 섭취 (kcal)
            </label>
            <input
              id="calories"
              type="number"
              name="calories"
              placeholder="0"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '저장 중...' : '데이터 저장'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HealthDataForm;
