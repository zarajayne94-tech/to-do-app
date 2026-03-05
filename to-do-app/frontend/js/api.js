// =========================================
// API CONFIGURATION
// =========================================

const API_URL = 'http://localhost:3000';

// =========================================
// Protect Dashboard.html
// =========================================

if (!localStorage.getItem('token')) {
  window.location.href = './login.html';
}

// =========================================
// DOM ELEMENTS
// =========================================
const taskForm = document.getElementById('taskForm');
const toDoList = document.getElementById('toDoList');
const completedList = document.getElementById('completedList');

// =========================================
// AUTH HELPER FUNCTIONS
// =========================================

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// =========================================
// HELPER FUNCTIONS
// =========================================

const formatTask = (task) => {
  const li = document.createElement('li');
  li.classList.add('card', 'p-3', 'shadow-sm', 'mt-2');

  const done = task.completed ? 'text-decoration-line-through opacity-50' : ''; // Class list if task is completed or not

  li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <h4 class="${done} col-11">${task.title}</h4>
        <button data-id="${task._id}" type="button" class="btn-close delete" aria-label="Close"></button>
      </div>
      <p class="${done}">${task.description}</p>
      <p class="${done}"><strong>Due: </strong>${task.dueDate}</p>
      <div class="d-flex justify-content-between align-items-end">
        <div>
          ${
            task.completed
              ? `<button data-id="${task._id}" class="btn btn-primary shadow-sm notDone" type="button">Make incomplete</button>`
              : `
              <button data-id="${task._id}" class="btn btn-primary shadow-sm done" type="button">Make complete</button>
            `
          }
        </div>
        <p class="m-0 ${done}"><strong>Created on: </strong>${task.dateCreated}</p>
      </div>
    `;
  return li;
};

// =========================================
// FETCH ALL TASKS
// =========================================

const displayTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: getAuthHeaders(),
    });

    const tasks = await response.json();

    toDoList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach((task) => {
      const formattedTask = formatTask(task);
      task.completed
        ? completedList.appendChild(formattedTask)
        : toDoList.appendChild(formattedTask);
    });

    console.log('Tasks loaded from server:', tasks.length);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toDoList.innerHTML = `
            <li class="card p-3 shadow-sm mt-2 text-center text-danger">
                <p class="m-0">Error loading tasks. Is the server running?</p>
            </li>
    `;
  }
};

// ========================================================
//  CREATE NEW TASK
// ========================================================
const createNewTask = async () => {
  const title = taskForm.taskName.value.trim();
  const description = taskForm.taskDescription.value.trim();
  const dueDate = taskForm.dueDate.value;

  if (!title) {
    alert('Please enter a task name');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(), // headers = metadata that we provide to the server
      body: JSON.stringify({
        title: title,
        description: description,
        dueDate: dueDate,
      }),
    });

    if (!response.ok) {
      // ok = it's okay we have an error, we will handle it with our code
      throw new Error('Failed to create task');
    }

    const newTask = await response.json();
    console.log('Task created:', newTask);

    taskForm.reset();
    displayTasks();
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating this task');
  }
};
// ========================================================
// MAKE TASK COMPLETE
// ========================================================

const completeTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to update this task');
    }

    console.log('Task marked complete:', taskId);
    displayTasks();
  } catch (error) {
    console.error('Error marking task complete:', error);
    alert('Error updating task');
  }
};

// ========================================================
// MAKE TASK INCOMPLETE
// ========================================================

const taskNotCompleted = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/incomplete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to update this task');
    }

    console.log('Task marked incomplete:', taskId);
    displayTasks();
  } catch (error) {
    console.error('Error marking task incomplete:', error);
    alert('Error updating task');
  }
};

// ========================================================
// DELETE TASK
// ========================================================

const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete this task');
    }

    console.log('Task deleted:', taskId);
    displayTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task');
  }
};

// ========================================================
// EVENT LISTENERS
// ========================================================

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createNewTask();
});

[toDoList, completedList].forEach((list) => {
  list.addEventListener('click', (event) => {
    if (event.target.classList.contains('done')) {
      // Completes the task when 'Done' button is clicked
      const taskId = event.target.getAttribute('data-id');
      completeTask(taskId);
    } else if (event.target.classList.contains('notDone')) {
      // Marks the task as not completed when 'Not done' button is clicked
      const taskId = event.target.getAttribute('data-id');
      taskNotCompleted(taskId);
    } else if (event.target.classList.contains('delete')) {
      // Deletes the task when 'Delete' button is clicked
      const taskId = event.target.getAttribute('data-id');
      deleteTask(taskId);
    }
  });
});

// ========================================================
// INITIALISATION
// ========================================================

displayTasks();
console.log('Dashboard initialised - connected to:', API_URL);

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = './login.html';
};

const greetingElement = document.getElementById('greeting');

const loadUserGreeting = () => {
  const user = getUserFromToken();
  if (user && greetingElement) {
    greetingElement.textContent = `Welcome back, ${user.name}`;
  }
};

loadUserGreeting();
