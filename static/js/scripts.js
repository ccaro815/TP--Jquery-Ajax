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
                        '<span class="' + (task.completed ? 'completed' : '') + '">' + task.task + '</span>' +
                        '<button class="complete-btn">Completar</button>' +
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
        if (task) {
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
    });

    $(document).on('click', '.complete-btn', function() {
        var item = $(this).closest('.task-item');
        var taskId = item.data('id');
        $.ajax({
            url: '/update-task/' + taskId,
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
