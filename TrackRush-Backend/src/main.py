"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, render_template
from flask_socketio import SocketIO, join_room, leave_room
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_swagger import swagger
from flask_cors import CORS
from dotenv import load_dotenv
from utils import APIException, generate_sitemap
from admin import setup_admin
from models import db, User, Post, Chat, Friend, LikesPost, CommentaryPost
from libs import img_type_file
from werkzeug.utils import secure_filename
#from models import Person

load_dotenv()

IMG_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = 'secreto'
app.config['ENV'] = 'development'
app.config["SECRET_KEY"] = "abc123"
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_CONNECTION_STRING')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
socketio = SocketIO(app, cors_allowed_origins='*') # Inicializar Socket

db.init_app(app)
MIGRATE = Migrate(app, db)
CORS(app)
setup_admin(app)
manager = Manager(app)
socketio = SocketIO(app, cors_allowed_origins="*")
manager.add_command("db", MigrateCommand)



@socketio.on('connected')
def connected(data):
    print(data)


@socketio.on("message")
def get_message(json, methods=['POST']):
    print("mensaje:" + str(json))
    
    socketio.emit("response", json)


# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints

@app.route("/")
def root():
    return render_template('index.html')





@socketio.on('connected')
def connected(data):
    print(data)

@socketio.on('message')
def get_message(json, method=["POST"]):
    print('received json: ' + str(json))
    socketio.emit("response", json)


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    socketio.send(username + ' has entered the room.', room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)





@app.route('/')
def sitemap():
    return generate_sitemap(app)

@app.route('/api/users', methods=['GET', 'POST'])
@app.route('/api/user/<string:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id = None):
    if request.method == 'GET':
        if id is not None:
            user = User.query.get(id)
            if not user: return jsonify({"msg": "User not found"}), 404
            return jsonify(user.serialize()), 200
        else:
            user = User.query.all()
            user = list(map(lambda user: user.serialize(), user))
            return jsonify(user), 200

   
    if request.method == 'POST':
        user_id = request.json.get("user_id")
        name = request.json.get("name")
        email = request.json.get("email")
        followers = request.json.get("followers")
        photo = request.json.get("photo")
        recentTracks = request.json.get("recentTracks")
        topArtists = request.json.get("topArtists")

        if not user_id: return jsonify({"msg": "user_id is required"}), 400
        if not name: return jsonify({"msg": "name is required"}), 400
        if not email: return jsonify({"msg": "email is required"}), 400

        user2 = User.query.filter_by(email=email).first()
        if user2: return jsonify({"msg": "email already exists"}), 400

        user = User()
        user.user_id = user_id
        user.name = name
        user.email = email
        user.followers = followers
        user.photo = photo
        user.recentTracks = recentTracks
        user.topArtists = topArtists
        user.save()
        return jsonify(user.serialize()), 201

    if request.method == 'PUT':
        name = request.json.get("name")
        email = request.json.get("email")
        followers = request.json.get("followers")
        photo = request.json.get("photo")
        recentTracks = request.json.get("recentTracks")
        topArtists = request.json.get("topArtists")

        if not name: return jsonify({"msg": "name is required"}), 400
        if not email: return jsonify({"msg": "email is required"}), 400

    
        user = User.query.get(id)
        user.name = name
        user.email = email
        user.followers = followers
        user.photo = photo
        user.recentTracks = recentTracks
        user.topArtists = topArtists
        user.update() 

        user2 = User.query.filter_by(email=email).first()
        if user2 and user2.user_id != id: return jsonify({"msg": "email already exists"}), 400
        
        return jsonify(user.serialize()), 200    

    if request.method == 'DELETE':
        user = User.query.get(id)
        if not user: return jsonify({"msg": "User not found"}), 404
        user.delete()
        return jsonify({"result": "User has been deleted"}), 200

@app.route('/api/posts', methods=['GET', 'POST'])
@app.route('/api/post/<string:user_id>', methods=['GET', 'PUT', 'DELETE'])
def posts(id = None):
    if request.method == 'GET':
        if id is not None:
            post = Post.query.get(id)
            if not post: return jsonify({"msg": "Post not found"}), 404
            return jsonify(post.serialize()), 200
        else:
            post = Post.query.all()
            post = list(map(lambda post: post.serialize(), post))
            return jsonify(post), 200

   
    if request.method == 'POST':
        commentary = request.form.get("commentary")
        user_id = request.form.get("user_id")
        path = request.form.get("path")
        
        if not commentary: 
            return jsonify({"msg": "commentary is required"}), 400
        if not user_id: 
            return jsonify({"msg": "commentary is required"}), 400

        image = request.files['image']

        if image and img_type_file(image.filename, IMG_EXTENSIONS):
             image_filename = secure_filename(image.filename)
             image.save(os.path.join(
                path, image_filename))
        else:
            return jsonify({"msg": "Extension not allowed"}), 400

        post = Post()
        post.commentary = commentary
        post.image = image_filename
        post.user_id = user_id
        post.path = path

        post.save()

        return jsonify(post.serialize()), 201

    """ if request.method == 'PUT':
        your_commentary = request.json.get("your_commentary")
        likes = request.json.get("likes")

        if not commentary: return jsonify({"msg": "Commentary is required"}), 400
        if not user_id: return jsonify({"msg": "Commentary is required"}), 400


        post = Post.query.get(user_id)
        post.your_commentary = your_commentary
        post.likes = likes
        post.update()

                
        return jsonify(post.serialize_with_likes_commentary()), 200   

    if request.method == 'DELETE':
        post = Post.query.get(user_id)
        if not post: return jsonify({"msg": "Post not found"}), 404
        post.delete()
        return jsonify({"result": "Post has been deleted"}), 200  """

@app.route('/api/likespost', methods=['GET', 'POST'])
@app.route('/api/likespost/<string:id>', methods=['GET', 'PUT'])
def likepost(id = None):
    if request.method == 'GET':
        if id is not None:
            likepost = LikesPost.query.get(id)
            if not likepost: return jsonify({"msg": "Like not found"}), 404
            return jsonify(likepost.serialize()), 200
        else:
            likespost = LikesPost.query.all()
            likespost = list(map(lambda likespost: likespost.serialize(), likespost))
            return jsonify(likespost), 200

    if request.method == 'POST':
        likes = request.json.get("likes")
        active = request.json.get("active")
        post_id = request.json.get("post_id")
        user_id = request.json.get("user_id")
        
        if not post_id: 
            return jsonify({"msg": "user is required"}), 400
        if not user_id: 
            return jsonify({"msg": "user is required"}), 400

        likespost = LikesPost()
        likespost.likes = likes
        likespost.active = active
        likespost.post_id = post_id
        likespost.user_id = user_id

        likespost.save()

        return jsonify(likespost.serialize()), 201

    if request.method == 'PUT':
        likes = request.json.get("likes")
        active = request.json.get("active")

        likespost = LikesPost()
        likespost.likes = likes
        likespost.active = active

        likespost.update()

                
        return jsonify(likespost.serialize()), 200   

@app.route('/api/commentspost', methods=['GET', 'POST'])
@app.route('/api/commentspost/<string:id>', methods=['GET', 'PUT'])
def commentsPost(id = None):
    if request.method == 'GET':
        if id is not None:
            commentsPost = CommentaryPost.query.get(id)
            if not commentsPost: return jsonify({"msg": "commentsPost not found"}), 404
            return jsonify(commentsPost.serialize()), 200
        else:
            commentsPost = CommentaryPost.query.all()
            commentsPost = list(map(lambda commentsPost: commentsPost.serialize(), commentsPost))
            return jsonify(commentsPost), 200

    if request.method == 'POST':
        commentary = request.json.get("commentary")
        post_id = request.json.get("post_id")
        user_id = request.json.get("user_id")
        
        if not commentary: 
            return jsonify({"msg": "commentary is required"}), 400
        if not post_id: 
            return jsonify({"msg": "user is required"}), 400
        if not user_id: 
            return jsonify({"msg": "user is required"}), 400

        commentsPost = CommentaryPost()
        commentsPost.commentary = commentary
        commentsPost.post_id = post_id
        commentsPost.user_id = user_id

        commentsPost.save()

        return jsonify(commentsPost.serialize()), 201

@app.route('/api/chats', methods=['GET', 'POST'])
@app.route('/api/chat/<string:id>', methods=['GET', 'PUT', 'DELETE'])
def chats(id = None):
    if request.method == 'GET':
        if id is not None:
            chat = Chat.query.get(id)
            if not chat: return jsonify({"msg": "chat not found"}), 404
            return jsonify(chat.serialize()), 200
        else:
            chat = Chat.query.all()
            chat = list(map(lambda chat: chat.serialize(), chat))
            return jsonify(chat), 200

    if request.method == 'POST':
        user_id = request.json.get("user_id")
        message = request.json.get("message")
        
        
        if not message: return jsonify({"msg": "message is required"}), 400
        if not user_id: return jsonify({"msg": "message is required"}), 400

        chat = Chat()
        chat.user_id = user_id
        chat.message = message
        chat.save()

        return jsonify(chat.serialize()), 201
   
    if request.method == 'DELETE':
        chat = Chat.query.get(id)
        if not chat: return jsonify({"msg": "Chat not found"}), 404
        chat.delete()
        return jsonify({"result": "Chat has been deleted"}), 200

@app.route('/api/friends/', methods=['GET', 'POST'])
@app.route('/api/friends/<string:user_id>', methods=['GET'])
def get_friends(user_id = None):
    if request.method == 'GET':
            if user_id is not None:
                friend = Friend.query.filter_by(user_id=user_id).all()
                friend = list(map(lambda friend: friend.serialize(), friend))
                return jsonify(friend), 200
            else:
                friend = Friend.query.all()
                friend = list(map(lambda friend: friend.serialize(), friend))
                return jsonify(friend), 200

    if request.method == 'POST':
        user_id = request.json.get("user_id")
        friends =  request.json.get("friends")
        personId = request.json.get("personId")
        photo = request.json.get("photo")
        
    
        if not friends: return jsonify({"msg": "friend is required"}), 400
        if not user_id: return jsonify({"msg": "id is required"}), 400

        newFriend = Friend()
        newFriend.user_id = user_id
        newFriend.friends = friends
        newFriend.personId = personId
        newFriend.photo = photo

        newFriend.save()

        return jsonify(newFriend.serialize()), 201

@app.route('/api/friends/<string:user_id>/<string:personId>/', methods=['DELETE'])
def deleteFriend(user_id, personId):
    if request.method == 'DELETE':
        friend = Friend.query.filter_by(user_id=user_id, personId=personId).first()
        if not friend: return jsonify({"msg": "friend not found"}), 404
        friend.delete()
        return jsonify({"result": "friend has been deleted"}), 200

    
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    app.run(host='localhost', port=PORT, debug=False)
   