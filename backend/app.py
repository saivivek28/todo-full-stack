from flask import Flask, request, jsonify
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager

app = Flask(__name__)
bcrypt = Bcrypt(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
app.config['JWT_SECRET_KEY'] = 'details'
jwt = JWTManager(app)


client = MongoClient("mongodb+srv://saiviveknakirikanti:8VH1rjtFBS7NvqMg@cluster0.xnwlwm4.mongodb.net/")
db = client["flaskdb"]
collection = db["user"]
tasks = db['tasks']


@app.route('/register', methods=['POST'])
def register():
    users_data = request.json
    print(users_data)
    hash_pwd = bcrypt.generate_password_hash(users_data['password']).decode('utf-8')
    users_data['passoword'] = hash_pwd
    collection.insert_one(users_data)
    print(hash_pwd)
    return jsonify({"message": "Regisration Done"}), 201

@app.route('/login', methods=['POST'])
def login():
    users_data = request.json
    user_details = collection.find_one({'name': users_data['name'], "email": users_data['email']})

    if not user_details:
        return jsonify({'err': "Entered user details not found"})

    hashed_pwd = user_details['passoword']
    if not bcrypt.check_password_hash(hashed_pwd, users_data['password']):
        return jsonify({'err': "Entered password is invalid"})
    
    token = create_access_token(identity = {'name':user_details['name'], 'email':user_details['email']})
    print(token)
    return jsonify({
        "message": "Login Done!",
        "_id": str(user_details['_id']) ,
        'token':token
    }), 200


@app.route('/add', methods=['POST'])
def add_todo():
    task_data = request.json
    inserted_task = tasks.insert_one(task_data)
    print(inserted_task.inserted_id)
    print(task_data)
    return jsonify({"message":"Task Added!!!!"})

@app.route('/update/<id>', methods=['GET', "PUT"])
def update_tasks(id):
    if request.method == "GET":
        task_details = tasks.find_one({"_id": ObjectId(id)})
        print(task_details)
        return jsonify({"message":"Task Details not found!"})
    elif request.method == "PUT":
        updated_details = request.json
        tasks.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "task_title": updated_details['task_title'],
                "task_description": updated_details['task_description']
            }}
        )
        print(updated_details)
        return jsonify({"message":"task Upadated!"})

@app.route('/delete/<id>', methods=["DELETE"])
def delete(id):
    tasks.delete_one({'_id': ObjectId(id)})
    return jsonify({"message":"Task Deleted!!!!"})

@app.route("/get_tasks/<id>")
def tasks_get(id):
    user_tasks = []
    for task in tasks.find({'user_id': id}): 
        user_tasks.append({
            "_id": str(task['_id']),
            "task_title": task.get('task_title'),
            "task_description": task.get('task_description')
        })
    return jsonify(user_tasks)


if __name__ == '__main__':
    app.run(debug=True)
