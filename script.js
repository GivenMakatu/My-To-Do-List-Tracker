let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    taskList.innerHTML = '';
    
    taskCounter.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks</li>';
        return;
    }
    
    // Sort tasks by completion time
    const sortedTasks = tasks.map((task, index) => ({...task, originalIndex: index}))
        .sort((a, b) => {
            if (!a.completionTime && !b.completionTime) return 0;
            if (!a.completionTime) return 1;
            if (!b.completionTime) return -1;
            return a.completionTime.localeCompare(b.completionTime);
        });
    
    sortedTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const timeStr = task.startTime || task.completionTime ? 
            `<span class="time-range">Start: ${task.startTime || 'Not set'} | End: ${task.completionTime || 'Not set'}</span>` : 
            '<span class="time-range">No times set</span>';
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.originalIndex})">
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                ${timeStr}
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.originalIndex})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const startTimeInput = document.getElementById('startTimeInput');
    const timeInput = document.getElementById('timeInput');
    const text = input.value.trim();
    const startTime = startTimeInput.value;
    const completionTime = timeInput.value;
    
    if (text) {
        tasks.push({ 
            text, 
            completed: false, 
            startTime: startTime || null,
            completionTime: completionTime || null
        });
        input.value = '';
        startTimeInput.value = '';
        timeInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();