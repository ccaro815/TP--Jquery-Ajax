from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = []
task_id_counter = 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-task', methods=['POST'])
def create_task():
    global task_id_counter
    task = request.json.get('task')
    new_task = {'id': task_id_counter, 'task': task, 'completed': False}
    tasks.append(new_task)
    task_id_counter += 1
    return jsonify(new_task), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks), 200

@app.route('/update-task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            return jsonify(task), 200
    return jsonify({'error': 'Task not found'}), 404

@app.route('/delete-task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
