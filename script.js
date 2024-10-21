// Controller
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');

    // Model
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // View
    function renderTasks() {
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.setAttribute('data-id', task.id);

            const taskDescription = document.createElement('span');
            taskDescription.textContent = task.description;
            if (task.completed) {
                taskDescription.classList.add('completed');
            }
            taskDiv.appendChild(taskDescription);

            const taskButtons = document.createElement('div');
            taskButtons.className = 'task-buttons';

            // Færdiggør opgave-knap
            if (!task.completed) {
                const completeButton = document.createElement('button');
                completeButton.textContent = 'Færdig';
                completeButton.onclick = () => completeTask(task.id);
                taskButtons.appendChild(completeButton);
            } else {
                // Fortryd færdiggørelse-knap
                const undoButton = document.createElement('button');
                undoButton.textContent = 'Fortryd';
                undoButton.onclick = () => undoTask(task.id);
                taskButtons.appendChild(undoButton);
            }

            // Slet opgave-knap
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Slet';
            deleteButton.onclick = () => deleteTask(task.id);
            taskButtons.appendChild(deleteButton);

            taskDiv.appendChild(taskButtons);
            // Vis opgaven i den rigtige liste
            if (task.completed) {
                completedList.appendChild(taskDiv);
            } else {
                todoList.appendChild(taskDiv);
            }
        });
    }

    // Tilføj opgave-funktion
    function addTask() {
        const taskDescription = taskInput.value.trim();
        if (taskDescription === '') {
            alert('Indtast en opgave.');
            return;
        }

        const newTask = {
            id: Date.now(),
            description: taskDescription,
            completed: false
        };

        // Opdater model
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks(); // Opdater visningen
    }

    // Færdiggør opgave-funktion
    function completeTask(id) {
        // Opdater model
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: true } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Opdater visningen
    }

    // Fortryd færdiggørelse-funktion
    function undoTask(id) {
        // Opdater model
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: false } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Opdater visningen
    }

    // Slet opgave-funktion
    function deleteTask(id) {
        // Opdater model
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Opdater visningen
    }

    // Tilføj event listener til knappen
    addTaskButton.addEventListener('click', addTask);
    renderTasks(); // Initial visning af opgaver
});