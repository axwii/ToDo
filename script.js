// Controller
document.addEventListener('DOMContentLoaded', () => {
    // View elements
    const taskInput = document.getElementById('taskInput');
    const quantityInput = document.getElementById('quantityInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');

    // Model
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // View
    function renderTasks() {
        todoList.textContent = '';
        completedList.textContent = '';

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.dataset.id = task.id;

            // Vis opgavebeskrivelse, og kun kvantitet hvis den findes
            const taskDescription = document.createElement('span');
            taskDescription.textContent = task.quantity ? 
                `${task.description} (Antal: ${task.quantity})` : 
                `${task.description}`;
            if (task.completed) {
                taskDescription.classList.add('completed');
            }
            taskDiv.appendChild(taskDescription);

            // Task-knapper: Færdiggør, Fortryd, Slet
            const taskButtons = document.createElement('div');
            taskButtons.className = 'task-buttons';
            
            // Knapper genereres dynamisk baseret på task-status
            const createButton = (text, onClickHandler, className) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.onclick = onClickHandler;
                if (className) {
                    button.classList.add(className);
                }
                return button;
            };
            
            // Opret opgaveknapper
            if (!task.completed) {
                const completeButton = createButton('Færdig', () => completeTask(task.id), 'complete-button');
                taskButtons.appendChild(completeButton);
            } else {
                const undoButton = createButton('Fortryd', () => undoTask(task.id), 'undo-button');
                taskButtons.appendChild(undoButton);
            }
            const deleteButton = createButton('Slet', () => deleteTask(task.id), 'delete-button');
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

    // Tilføj opgave-funktion - Controller
    function addTask() {
        const taskDescription = taskInput.value.trim();
        const quantity = quantityInput.value.trim();

        if (taskDescription === '') {
            alert('Indtast en opgave.');
            return;
        }

        const newTask = {
            id: self.crypto.randomUUID(),
            description: taskDescription,
            quantity: quantity || null, // Hvis kvantitet ikke er indtastet, gem null
            completed: false
        };

        // Opdater model
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        quantityInput.value = '';
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