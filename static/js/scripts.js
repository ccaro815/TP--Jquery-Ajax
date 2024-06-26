$(document).ready(function() {
    function loadTasks() {
        $.ajax({
            url: '/tasks',
            method: 'GET',
            success: function(tasks) {
                $('#task-list').empty();
                tasks.forEach(function(task) {
                    $('#task-list').append(
                        '<li class="task-item" data-id="' + task.id + '">' +
                        '<span class="task-text ' + (task.completed ? 'completed' : '') + '">' + task.task + '</span>' +
                        '<button class="edit-btn">Editar</button>' +
                        '<button class="complete-btn">Completar/Incompleta</button>' +
                        '<button class="delete-btn">Eliminar</button>' +
                        '</li>'
                    );
                });
            }
        });
    }

    $('#task-form').submit(function(event) {
        event.preventDefault();
        var task = $('#task-input').val();
        var taskId = $('#task-input').data('id');

        if (task) {
            if (taskId) {
                $.ajax({
                    url: '/update-task/' + taskId,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ task: task }),
                    success: function(response) {
                        loadTasks();
                        $('#task-input').val('').removeData('id');
                    }
                });
            } else {
                $.ajax({
                    url: '/create-task',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ task: task }),
                    success: function(response) {
                        loadTasks();
                        $('#task-input').val('');
                    }
                });
            }
        }
    });

    $(document).on('click', '.edit-btn', function() {
        var item = $(this).closest('.task-item');
        var taskId = item.data('id');
        var taskText = item.find('.task-text').text();

        $('#task-input').val(taskText).data('id', taskId);
    });

    $(document).on('click', '.complete-btn', function() {
        var item = $(this).closest('.task-item');
        var taskId = item.data('id');
        $.ajax({
            url: '/toggle-complete-task/' + taskId,
            method: 'PUT',
            success: function() {
                loadTasks();
            }
        });
    });

    $(document).on('click', '.delete-btn', function() {
        var item = $(this).closest('.task-item');
        var taskId = item.data('id');
        $.ajax({
            url: '/delete-task/' + taskId,
            method: 'DELETE',
            success: function() {
                loadTasks();
            }
        });
    });

    loadTasks();
});
