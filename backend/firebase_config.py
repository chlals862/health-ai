import firebase_admin
from firebase_admin import credentials, db, firestore
import os

def init_firebase():
    """Firebase 초기화"""
    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase-credentials.json')
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

firebase_db = init_firebase()
