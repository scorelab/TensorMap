from shared.utils import get_db_ref, create_db_connection
from shared.services.config import get_configs
import os

configs = get_configs()


"""
All the application related settings handle through here
"""


class SettingUp:

    def __init__(self, app):
        self.app = app
        self.app.config['SECRET_KEY'] = os.getenv("secret_key")
        self.file_setup()
        self.database_setup()
        self.swagger_setup()

    def swagger_setup(self):
        pass

    def file_setup(self):
        self.app.config['UPLOAD_FOLDER'] = configs['api']['upload']['folder']
        self.app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

    def database_setup(self):
        connection = create_db_connection()

        self.app.config['SQLALCHEMY_DATABASE_URI'] = connection
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db = get_db_ref()
        db.init_app(self.app)
        with self.app.app_context():
            db.create_all()
