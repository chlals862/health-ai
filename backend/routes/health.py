from flask import Blueprint, request, jsonify
from firebase_config import firebase_db
from datetime import datetime
from firebase_admin import firestore

health_bp = Blueprint('health', __name__, url_prefix='/api/health')

@health_bp.route('/data', methods=['POST'])
def add_health_data():
    """건강 데이터 추가"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': '사용자 ID가 필요합니다'}), 400
        
        health_entry = {
            'user_id': user_id,
            'steps': data.get('steps', 0),
            'heart_rate': data.get('heart_rate', 0),
            'sleep_hours': data.get('sleep_hours', 0),
            'water_intake': data.get('water_intake', 0),
            'calories': data.get('calories', 0),
            'timestamp': firestore.SERVER_TIMESTAMP,
        }
        
        # Firestore에 추가
        doc_ref = firebase_db.collection('health_data').add(health_entry)
        
        return jsonify({
            'success': True,
            'message': '건강 데이터가 저장되었습니다',
            'doc_id': doc_ref[1].id
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/data/<user_id>', methods=['GET'])
def get_health_data(user_id):
    """사용자의 건강 데이터 조회"""
    try:
        # 쿼리 필터 및 정렬
        query = firebase_db.collection('health_data').where('user_id', '==', user_id)
        
        # 정렬 파라미터 확인
        order_by = request.args.get('order_by', 'timestamp')
        order_direction = request.args.get('order', 'desc')
        
        # Firestore 정렬
        if order_direction == 'asc':
            query = query.order_by(order_by, direction=firestore.Query.ASCENDING)
        else:
            query = query.order_by(order_by, direction=firestore.Query.DESCENDING)
        
        # 제한 추가
        limit = request.args.get('limit', 50, type=int)
        query = query.limit(limit)
        
        docs = query.stream()
        
        health_data = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            health_data.append(data)
        
        return jsonify({
            'success': True,
            'data': health_data,
            'count': len(health_data)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/data/<doc_id>', methods=['PUT'])
def update_health_data(doc_id):
    """건강 데이터 업데이트"""
    try:
        data = request.get_json()
        data['updated_at'] = firestore.SERVER_TIMESTAMP
        
        firebase_db.collection('health_data').document(doc_id).update(data)
        
        return jsonify({
            'success': True,
            'message': '건강 데이터가 업데이트되었습니다'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/data/<doc_id>', methods=['DELETE'])
def delete_health_data(doc_id):
    """건강 데이터 삭제"""
    try:
        firebase_db.collection('health_data').document(doc_id).delete()
        
        return jsonify({
            'success': True,
            'message': '건강 데이터가 삭제되었습니다'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/summary/<user_id>', methods=['GET'])
def get_health_summary(user_id):
    """사용자 건강 데이터 요약"""
    try:
        query = firebase_db.collection('health_data').where('user_id', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING).limit(30)
        docs = query.stream()
        
        total_steps = 0
        total_sleep = 0
        avg_heart_rate = 0
        total_water = 0
        total_calories = 0
        count = 0
        
        for doc in docs:
            data = doc.to_dict()
            total_steps += data.get('steps', 0)
            total_sleep += data.get('sleep_hours', 0)
            avg_heart_rate += data.get('heart_rate', 0)
            total_water += data.get('water_intake', 0)
            total_calories += data.get('calories', 0)
            count += 1
        
        summary = {
            'success': True,
            'total_steps': total_steps,
            'avg_heart_rate': round(avg_heart_rate / count, 1) if count > 0 else 0,
            'total_sleep': round(total_sleep, 1),
            'total_water': total_water,
            'total_calories': total_calories,
            'days_tracked': count,
        }
        
        return jsonify(summary), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

