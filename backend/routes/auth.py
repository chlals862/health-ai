from flask import Blueprint, request, jsonify
from firebase_admin import auth
from firebase_config import firebase_db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Firebase 토큰 검증"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': '토큰이 필요합니다'}), 400
        
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Firestore에서 사용자 정보 조회
        user_ref = firebase_db.collection('users').document(uid)
        user_data = user_ref.get()
        
        if user_data.exists:
            return jsonify({
                'success': True,
                'uid': uid,
                'user': user_data.to_dict()
            }), 200
        else:
            return jsonify({'error': '사용자를 찾을 수 없습니다'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@auth_bp.route('/user-data/<user_id>', methods=['GET'])
def get_user_data(user_id):
    """사용자 데이터 조회"""
    try:
        user_ref = firebase_db.collection('users').document(user_id)
        user_data = user_ref.get()
        
        if user_data.exists:
            return jsonify({
                'success': True,
                'user': user_data.to_dict()
            }), 200
        else:
            return jsonify({'error': '사용자를 찾을 수 없습니다'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/update-user/<user_id>', methods=['PUT'])
def update_user_data(user_id):
    """사용자 데이터 업데이트"""
    try:
        data = request.get_json()
        user_ref = firebase_db.collection('users').document(user_id)
        user_ref.update(data)
        
        return jsonify({
            'success': True,
            'message': '사용자 정보가 업데이트되었습니다'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
