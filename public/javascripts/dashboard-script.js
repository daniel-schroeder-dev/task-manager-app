const taskLists = [];
const ENTER_KEYCODE = 13;

const leftCol = document.getElementById('leftCol');
const centerCol = document.getElementById('centerCol');
const createListInput = document.getElementById('createList');
const incompleteTaskContainer = document.getElementById('incompleteTaskContainer');
const completedTaskHeader = document.getElementById('completedTaskHeader');
const completedTaskContainer = document.getElementById('completedTaskContainer');
const createTaskInput = document.getElementById('createTask');
const addListButton = document.getElementById('addListButton');
const saveButton = document.querySelector('.btn-save');
const siteIcon = document.getElementById('siteIcon');


/**************** Constructor Functions **********************/


const TaskList = function(name, url, tasks, ownerId, _id) {
  
  this.name = name;
  this.url = url || '/' + name.toLowerCase().replace(/\s/gi, '-');
  this.tasks = tasks || [];
  this.ownerId = ownerId;
  this._id = _id;
  this.element = createTaskListDOMElement(this.name, this.url);

  this.createTaskListDB = async function() {
    
    const data = {
      url: this.url,
      name: this.name,
    };

    const response = await fetch('/taskLists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    this._id = json._id;

  };

  this.addTask = function(task) {
    this.tasks.push(task);
    updateTaskListDB(task);
  }

  function createTaskListDOMElement(taskListName, url) {
    
    const div = document.createElement('div');
    const i = document.createElement('i');
    const span = document.createElement('span');
    const a = document.createElement('a');
    
    a.classList.add('task-list-nav');
    a.href = url

    span.textContent = taskListName;

    // fix wierd margin collapse when DOM element is added but page isn't reloaded.
    span.style.marginLeft = '4px' 

    i.classList.add('fas', 'fa-bars');

    a.appendChild(i);
    a.appendChild(span);
    div.appendChild(a);

    return div;

  }

  async function updateTaskListDB(task) {

    const data = {
      task,
    };

    const response = await fetch('/taskLists', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

  }

};

const Task = function(name, ownerId, description, completed, _id) {

  this.name = name;
  this.description = description;
  this.completed = completed || false;
  this.ownerId = ownerId;
  this._id = _id;
  this.element = createTaskDOMElement(this.name);

  this.createTaskDB = async function() {
    
    const data = {
      name: this.name,
      completed: this.completed,
      ownerId: this.ownerId,
    };

    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    this._id = json._id;

  };

  function createTaskDOMElement(taskName) {

    const li = document.createElement('li');
    const i = document.createElement('i');
    const spanTaskName = document.createElement('span');
    const spanEllipsis = document.createElement('span');
    
    i.classList.add('far', 'fa-square');
    spanEllipsis.classList.add('ellipsis');
    
    spanTaskName.setAttribute('contenteditable', 'true');
    spanTaskName.textContent = taskName;

    // fix wierd margin collapse when DOM element is added but page isn't reloaded.
    spanTaskName.style.marginLeft = '3.5px' 
    
    spanEllipsis.innerHTML = '&hellip;';
    
    li.appendChild(i);
    li.appendChild(spanTaskName);
    li.appendChild(spanEllipsis);

    return li;

  }

};


/*************** Global Helper Functions *******************/


const changePageURL = (pageName) => {
  
  const url = '/' + pageName.toLowerCase().replace(/\s/gi, '-');
  
  window.history.replaceState({ pageName }, '', url);
  
};

const initTaskLists = async () => {
  
  const lists = await loadTaskLists();

  lists.forEach((taskList) => {

    const tasks = taskList.tasks.map((task) => {
      return new Task(task.name, task.ownerId, task.description, task.completed, task._id);
    });

    taskLists.push(new TaskList(taskList.name, taskList.url, tasks, taskList.ownerId, taskList._id));
  
  });

};

const loadTaskLists = async () => {

  const responseTaskLists = await fetch('/taskLists');
  const taskLists = await responseTaskLists.json();

  return taskLists;

};

const removeBox = (boxID) => {
  
  const box = document.getElementById(boxID);
  
  box.classList.remove('fade-in');
  box.classList.add('fade-out');
  
  // this is neccessary to give the fade-out animation time to run before adding back the .fade-in and .is-paused classes.  
  setTimeout(() => {

    box.classList.add('is-paused');
    box.classList.add('fade-in');
    box.classList.remove('fade-out');
    
    box.style.display = 'none';
    
    if (boxID === 'addListBox') createListInput.value = '';
    
    saveButton.setAttribute('disabled', true);

  }, 100);

};

const setTodaysDate = () => {
  
  const dateSpan = document.getElementById('date');
  const todaysDate = new Date().getDate();
  
  dateSpan.textContent = todaysDate;

  // when there is only 1 character, this will help center the date inside the calendar icon
  if (todaysDate < 10) {
    dateSpan.style.marginLeft = '2px';
  }

};

const updatePageState = (pageName) => {

  const pageTitleElement = document.getElementById('pageTitle');
  
  pageTitleElement.textContent = pageName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${pageName}"`);

  while (incompleteTaskContainer.firstChild) {
    incompleteTaskContainer.firstChild.remove();
  }

};

const updateTaskListUI = (taskListName) => {

  const taskList = taskLists.find(taskList => taskList.name === taskListName);
  
  if (!taskList.tasks.length) {
    siteIcon.style.display = 'block';
  } else {
    siteIcon.style.display = 'none';
  }
  
  taskList.tasks.forEach((task, i) => {
    if (i === taskList.tasks.length - 1) {
      task.element.classList.add('active-task');
    }
    incompleteTaskContainer.prepend(task.element);
  });

};


/********************* Event Listeners ***********************/


document.addEventListener('click', (e) => {

  // works to close the addListBox or the editTaskBox
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return removeBox(e.target.getAttribute('data-target'));
  }
  
  // create a new TaskList in the DOM/DB, update the URL and page state
  if (e.target.classList.contains('btn-save')) {
    
    const createListsContainer = document.getElementById('createListsContainer');
    const taskList = new TaskList(createListInput.value);
    
    createListsContainer.firstElementChild.after(taskList.element);
    
    taskLists.push(taskList);
    taskList.createTaskListDB();
    
    changePageURL(taskList.name);
    updatePageState(taskList.name);
    
    removeBox('addListBox');

    createTaskInput.focus();

    siteIcon.style.display = 'block';
    
    return;

  }
  
  if (e.target.classList.contains('ellipsis')) {
    
    const editTaskBox = document.getElementById('editTaskBox');
    
    editTaskBox.style.display = 'block';
    editTaskBox.classList.remove('is-paused');
    
    return;

  }

});

addListButton.addEventListener('click', () => {

  const addListBox = document.getElementById('addListBox');

  addListBox.style.display = 'block';
  addListBox.classList.remove('is-paused');

  createListInput.focus();

});

centerCol.addEventListener('click', function(e) {
  
  if (e.target.id === 'completedTaskHeader' || e.target.parentElement.id === 'completedTaskHeader') {

    let toggleIcon = '';

    if (e.target.tagName === 'I') {
      toggleIcon = e.target;
    } else if (e.target.id === 'completedTaskHeader') {
      toggleIcon = e.target.querySelector('i');
    } else {
      toggleIcon = e.target.previousElementSibling;
    }
    
    toggleIcon.classList.toggle('fa-caret-down');
    toggleIcon.classList.toggle('fa-caret-right');
    completedTaskHeader.classList.toggle('tasks-hidden');
    completedTaskContainer.classList.toggle('hidden');

    return;
    
  }

  // toggle completed icon
  /* TODO: toggle completed status of Task */
  if (e.target.tagName === 'I') {
    
    e.target.classList.toggle('far');
    e.target.classList.toggle('fa-square');
    e.target.classList.toggle('fas');
    e.target.classList.toggle('fa-check-square');

    return;

  }
  
  let currentNode = e.target;

  if (currentNode.tagName !== 'SPAN') {
    currentNode = currentNode.querySelector('span[contenteditable="true"]');
  }

  currentNode.focus();

  if (!currentNode.parentElement.classList.contains('active-task')) {
    const currentActiveTask = this.querySelector('.active-task');
    if (currentActiveTask) currentActiveTask.classList.remove('active-task');
    currentNode.parentElement.classList.add('active-task');
  }

});

// will give focus to the createTaskInput whenever a user is editing a task in a taskContainer and hits 'Enter'
centerCol.addEventListener('keydown', (e) => {
 
  if (e.keyCode !== ENTER_KEYCODE) return;
  if (!e.target.hasAttribute('contenteditable')) return;
 
  e.target.blur();
  createTaskInput.focus();

});

// NOTE: this has to be a 'keyup' event. You refactored once before to make it match the createTaskInput, but it broke the functionality because the saveButton stayed disabled when only 1 character was entered. Apparently, when the 'keydown' event fires, the createListInput will not have the value of the character in the input stored yet, so you can't check for it the listener.
createListInput.addEventListener('keyup', function(e) {

  // save the list when 'Enter' is pressed. Shortcut for just clicking the 'Save' button.
  if (e.keyCode === ENTER_KEYCODE) {
    this.nextElementSibling.querySelector('.btn-save').click();
  }

  // disable the saveButton when there are no characters in the createListInput
  if (this.value.length) return saveButton.removeAttribute('disabled');
  
  saveButton.setAttribute('disabled', true);

});

createTaskInput.addEventListener('keydown', async function(e) {
  
  if (e.keyCode !== ENTER_KEYCODE) return;

  const taskList = taskLists.find((taskList) => {
    return taskList.name === this.previousElementSibling.textContent;
  });

  const task = new Task(this.value, taskList._id);

  // we need the _id field of this task for the taskList.updateTaskListDB(task) call below, so make sure to await the result so that the task has the _id field.
  await task.createTaskDB();

  taskList.addTask(task);
  
  // the task that is just created will be the .active-task, so make sure to remove .active-task from any tasks in the incompleteTaskContainer before adding the newly created task
  if (centerCol.querySelector('.active-task')) {
    centerCol.querySelector('.active-task').classList.remove('active-task');
  }

  if (!centerCol.querySelector('li')) {
    siteIcon.style.display = 'none';
  }
  
  task.element.classList.add('active-task');
  incompleteTaskContainer.prepend(task.element);
  this.value = '';

});

leftCol.addEventListener('click', (e) => {

  if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') return;
  
  e.preventDefault();
  
  let taskListName = '';
  
  if (e.target.tagName === 'A') {

    const taskList = taskLists.find((taskList) => {
      return taskList.url === e.target.getAttribute('href');
    });

    taskListName = taskList.name;

  } else {
    taskListName = e.target.textContent;
  }
  
  changePageURL(taskListName);
  updatePageState(taskListName);
  updateTaskListUI(taskListName);

});


/************************** Init Page Load ************************/


// When the page first loads, check to see if we need to wipe the siteIcon from the incompleteTaskContainer 
if (centerCol.querySelector('li')) {
  siteIcon.style.display = 'none';
}

// sets the date in the 'Today' icon
setTodaysDate();

// creates TaskList and Task objects to mirror the DB data
initTaskLists();