let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'not-completed') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-text ${task.completed ? 'completed' : ''}">${
      task.text
    }</span>
      <div class="task-actions">
        <button onclick="completeTask(${index})">Complete</button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function completeTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(getCurrentFilter());
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks(getCurrentFilter());
  }
}

function deleteTask(index) {
  if (confirm('Menghapus?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getCurrentFilter());
  }
}

document.getElementById('task-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = this.querySelector('input[name="task"]');
  const taskText = input.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks(getCurrentFilter());
    input.value = '';
  }
});

function getCurrentFilter() {
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  if (selectedRating) {
    return selectedRating.value;
  }
  return 'all';
}

document.querySelectorAll('input[name="rating"]').forEach((radio) => {
  radio.addEventListener('change', function () {
    const filter = this.value;
    if (filter === 'super-happy') {
      renderTasks('completed');
    } else if (filter === 'super-sad') {
      renderTasks('not-completed');
    } else {
      renderTasks('all');
    }
  });
});

renderTasks();
