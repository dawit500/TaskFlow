// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

/**
 * Saves tasks to localStorage and triggers a re-render
 */
function updateState() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

/**
 * Adds a new task to the array
 * @param {string} description 
 */
function addTask(description) {
    const newTask = {
        id: Date.now(),
        description: description,
        completed: false
    };
    tasks.push(newTask);
    updateState();
}

/**
 * Toggles the completed status of a task
 * @param {number} id 
 */
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    updateState();
}

/**
 * Deletes a task from the array
 * @param {number} id 
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateState();
}

/**
 * Clears all completed tasks
 */
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    updateState();
}

/**
 * Renders the task list to the DOM
 */
function renderTasks() {
    // Clear current list
    taskList.innerHTML = '';

    // Sort tasks: incomplete first
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

    if (sortedTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet. Enjoy your day! ✨</p>
            </div>
        `;
    }

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.description}</span>
            <button class="delete-btn" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y1="17"></line><line x1="14" y1="11" x2="14" y1="17"></line></svg>
            </button>
        `;

        // Event Listeners for the item
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    // Update remaining count
    const remainingCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${remainingCount} task${remainingCount !== 1 ? 's' : ''} remaining`;
}

// Event Listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = taskInput.value.trim();
    if (description) {
        addTask(description);
        taskInput.value = '';
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial Render
renderTasks();
