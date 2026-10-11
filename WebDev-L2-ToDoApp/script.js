// ----- 1. Grab elements from the page -----
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const errorMessage = document.getElementById('error-message');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

// ----- 2. The app's memory -----
let tasks = [];        // every task lives here
let editingId = null;  // id of the task being edited (null = none)

// ----- 3. Save and load (localStorage) -----
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function saveAndRender() {
  saveTasks();
  render();
}

// ----- 4. Add a task -----
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    errorMessage.textContent = 'Please type a task first.';
    return;
  }

  tasks.push({
    id: Date.now(),                          // unique number for each task
    text: text,
    completed: false,
    createdAt: new Date().toLocaleString(),  // timestamp
    completedAt: null
  });

  taskInput.value = '';
  errorMessage.textContent = '';
  saveAndRender();
}

// ----- 5. Complete / undo -----
function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toLocaleString() : null;
  saveAndRender();
}

// ----- 6. Delete -----
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  if (editingId === id) {
    editingId = null;
  }
  saveAndRender();
}

// ----- 7. Edit (inline) -----
function startEdit(id) {
  editingId = id;
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function saveEdit(id, newText) {
  const text = newText.trim();
  if (text === '') {
    return; // do not allow an empty task
  }
  const task = tasks.find(function (t) { return t.id === id; });
  task.text = text;
  editingId = null;
  saveAndRender();
}

// ----- 8. Helper: build a button -----
function makeButton(label, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener('click', onClick);
  return btn;
}

// ----- 9. Helper: build one task row -----
function createTaskItem(task) {
  const li = document.createElement('li');
  li.className = task.completed ? 'task done' : 'task';

  const info = document.createElement('div');
  info.className = 'task-info';

  const actions = document.createElement('div');
  actions.className = 'actions';

  if (task.id === editingId) {
    // Editing mode: show a text box with Save and Cancel
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    input.className = 'edit-input';
    input.id = 'edit-input';

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') saveEdit(task.id, input.value);
      if (event.key === 'Escape') cancelEdit();
    });

    info.appendChild(input);
    actions.appendChild(makeButton('Save', 'btn-save', function () {
      saveEdit(task.id, input.value);
    }));
    actions.appendChild(makeButton('Cancel', 'btn-cancel', cancelEdit));
  } else {
    // Normal mode: show text, timestamp and the action buttons
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const time = document.createElement('small');
    time.textContent = task.completed
      ? 'Completed: ' + task.completedAt
      : 'Added: ' + task.createdAt;

    info.appendChild(text);
    info.appendChild(time);

    if (task.completed) {
      actions.appendChild(makeButton('Undo', 'btn-undo', function () {
        toggleTask(task.id);
      }));
    } else {
      actions.appendChild(makeButton('Complete', 'btn-complete', function () {
        toggleTask(task.id);
      }));
      actions.appendChild(makeButton('Edit', 'btn-edit', function () {
        startEdit(task.id);
      }));
    }

    actions.appendChild(makeButton('Delete', 'btn-delete', function () {
      deleteTask(task.id);
    }));
  }

  li.appendChild(info);
  li.appendChild(actions);
  return li;
}

// ----- 10. Helper: friendly message for an empty list -----
function createEmptyMessage(message) {
  const li = document.createElement('li');
  li.className = 'empty';
  li.textContent = message;
  return li;
}

// ----- 11. Redraw everything from the tasks array -----
function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pending = tasks.filter(function (t) { return !t.completed; });
  const completed = tasks.filter(function (t) { return t.completed; });

  pendingCount.textContent = pending.length + ' pending';
  completedCount.textContent = completed.length + ' completed';

  pending.forEach(function (task) {
    pendingList.appendChild(createTaskItem(task));
  });
  completed.forEach(function (task) {
    completedList.appendChild(createTaskItem(task));
  });

  if (pending.length === 0) {
    pendingList.appendChild(createEmptyMessage('No pending tasks. Add one above!'));
  }
  if (completed.length === 0) {
    completedList.appendChild(createEmptyMessage('No completed tasks yet.'));
  }

  // Put the cursor inside the edit box if one is open
  const editBox = document.getElementById('edit-input');
  if (editBox) {
    editBox.focus();
  }
}

// ----- 12. Connect the Add button and Enter key -----
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

taskInput.addEventListener('input', function () {
  errorMessage.textContent = ''; // clear the error when typing starts
});

// ----- 13. Start the app -----
loadTasks();
render();