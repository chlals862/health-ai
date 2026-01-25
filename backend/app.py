from flask import Flask
from flask_cors import CORS
from config import config
import os

def create_app(config_name=None):
    """Flask 앱 팩토리"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # CORS 설정
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # 블루프린트 등록
    from routes.auth import auth_bp
    from routes.health import health_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(health_bp)
    
    # 헬스 체크 엔드포인트
    @app.route('/api/health-check', methods=['GET'])
    def health_check():
        return {'status': 'OK', 'message': 'Backend is running'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
