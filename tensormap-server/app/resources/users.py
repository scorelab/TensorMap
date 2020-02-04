from flask_restful import fields, marshal_with, reqparse, Resource

# Request parser
req_parser = reqparse.RequestParser()
req_parser.add_argument('id', dest='id', required=True, help='Id is required')
req_parser.add_argument('username', dest='username', required=True, help='Username is required')

# Response structure
user_response = {
    'id': fields.String,
    'username': fields.String
}

# User class
class User(object):
    def __init__(self, id, username):
        self.id = id
        self.username = username

# Users resource
class Users(Resource):
    # Get user by its id
    @marshal_with(user_response)
    def get(self, id):
        # << Find user and return >>
        return User(id, 'username')

    # Add new user
    @marshal_with(user_response)
    def post(self):
        args = req_parser.parse_args()
        # << Create user and return >>
        return User(id=args.id, username=args.username)
 