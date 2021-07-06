from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_session import Session
from dotenv import load_dotenv
import os

socketio = SocketIO()
db = SQLAlchemy()
sess = Session()

def create_app(debug=False):
    
    app = Flask(__name__)

    # Load environment variables
    load_dotenv()

    app.debug = debug
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['USE_PERMANENT_SESSION'] = True
    # app.config['SECRET_KEY'] = os.urandom(25)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from .resources import main
    app.register_blueprint(main)

    socketio.init_app(app)
    db.init_app(app)
    sess.init_app(app)
    CORS(app, expose_headers='Authorization', support_credentials=True)
    return app