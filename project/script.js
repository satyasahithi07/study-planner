const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const totalTime = deadline - new Date(task.createdAt);
    const elapsedTime = now - new Date(task.createdAt);
    const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100).toFixed(2);

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    taskDiv.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>📅 Due: ${new Date(task.deadline).toLocaleDateString()}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${progressPercent}%"></div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(taskDiv);

    // Reminder Alert (1 day before)
    const oneDay = 24 * 60 * 60 * 1000;
    if (deadline - now < oneDay && deadline - now > 0) {
      alert(`Reminder: "${task.title}" is due in less than 24 hours!`);
    }
  });
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const deadline = document.getElementById('deadline').value;

  if (!title || !description || !deadline) return;

  const newTask = {
    title,
    description,
    deadline,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

renderTasks();