<<<<<<< HEAD
#!/usr/bin/env python3
=======
>>>>>>> f4680c217941cae3990de591426d28ab38f6751d
from app import create_app, socketio
from flask_cors import CORS

app = create_app(debug=True)
CORS(app)

if __name__ == '__main__':
    socketio.run(app)
