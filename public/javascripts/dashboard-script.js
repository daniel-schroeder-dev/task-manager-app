import { DialogBox } from './modules/dialog-box.mjs';

let taskLists = [];
let activeTaskList = {};
let trashTaskList = {};
const dialogBoxes = [];
const ENTER_KEYCODE = 13;

const leftCol = document.getElementById('leftCol');
const centerCol = document.getElementById('centerCol');

const taskListNavContainer = document.getElementById('taskListNavContainer');
const incompleteTaskContainer = new TaskContainer(document.getElementById('incompleteTaskContainer'));
const completedTaskContainer = new TaskContainer(document.getElementById('completedTaskContainer'));

const listsHeading = document.getElementById('listsHeading');

const completedTaskToggle = document.getElementById('completedTaskToggle');

const createListInput = document.getElementById('createList');
const createTaskInput = document.getElementById('createTask');

const addListDialogBox = new DialogBox(document.getElementById('addListDialogBox'));
const editTaskDialogBox = new DialogBox(document.getElementById('editTaskDialogBox'));
const deleteTaskDialogBox = new DialogBox(document.getElementById('deleteTaskDialogBox'));

dialogBoxes.push(addListDialogBox);
dialogBoxes.push(editTaskDialogBox);
dialogBoxes.push(deleteTaskDialogBox);

const addListButton = document.getElementById('addListButton');
const saveListButton = document.querySelector('#addListDialogBox .btn-save');
const deleteTaskButton = document.querySelector('#editTaskDialogBox .btn-delete');

const siteIcon = document.getElementById('siteIcon');


/**************** Constructor Functions **********************/

/********************/
/******* Task *******/
/********************/


function Task(name, ownerId, description, completed, _id) {

  this.name = name;
  this.description = description;
  this.completed = completed || false;
  this.ownerId = ownerId;
  this._id = _id;

  this.createTaskDOMElement();

};

Task.prototype.createTaskDB = async function() {
    
  const data = {
    name: this.name,
    completed: this.completed,
    ownerId: this.ownerId,
    description: this.description,
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const task = await response.json();

  this._id = task._id;

};

Task.prototype.createTaskDOMElement = function() {

  this.element = document.createElement('li');
  const i = document.createElement('i');
  const spanTaskName = document.createElement('span');
  const spanEllipsis = document.createElement('span');
  
  if (this.completed) {
    i.classList.add('fas', 'fa-check-square');
  } else {
    i.classList.add('far', 'fa-square');
  }

  spanEllipsis.classList.add('ellipsis');
  
  spanTaskName.setAttribute('contenteditable', 'true');
  spanTaskName.textContent = this.name;

  // Fix wierd margin collapse when DOM element is added but page isn't reloaded.
  spanTaskName.style.marginLeft = '3.5px' 
  
  spanEllipsis.innerHTML = '&hellip;';
  
  this.element.appendChild(i);
  this.element.appendChild(spanTaskName);
  this.element.appendChild(spanEllipsis);

};

/*
*   Removes the Task from all taskLists that the Task is a part of and adds
*   the Task to the trashTaskList.
*/
Task.prototype.remove = function() {

  this.element.remove();

  /*
  
  *** NOTE ***
  
  Originally used activeTaskList, but this won't work because what if the 
  Task is marked completed in 'Inbox', but the user Deletes the Task from 
  the 'Completed' taskList? Then, activeTaskList would be the 
  completedTaskList, and the Task would only be removed from that list, and
  would still show up in 'Inbox' as marked complete.
  
  */
  const taskOwner = taskLists.find((taskList) => taskList._id === this.ownerId);

  taskOwner.removeTask(this);

  if (this.completed) {
    const completedTaskList = taskLists.find((taskList) => {
      return taskList.name === 'Completed';
    });
    completedTaskList.removeTask(this);
  }

  trashTaskList.addTask(this);

};

Task.prototype.toggleCompletedStatus = function() {

  this.completed = !this.completed;
  
  /*

  *** NOTE ***

  This should be handled by the taskContainer that the Task is a part of

  */
  // this.element.remove();
  this.element.classList.remove('active-task');
  
  const completedTaskList = taskLists.find((taskList) => {
    return taskList.name === 'Completed';
  });

  if (this.completed) {
    incompleteTaskContainer.remove(this.element);
    completedTaskList.addTask(this);
    completedTaskContainer.add(this.element);
  } else {
    completedTaskContainer.remove(this.element);
    completedTaskList.removeTask(this);
    if (activeTaskList.name !== 'Completed') {
      incompleteTaskContainer.add(this.element);
    }
  }
  
  this.update();

};

Task.prototype.update = async function() {

  const data = this;

  const response = await fetch('/tasks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

};


/*****************************/
/******* TaskContainer *******/
/*****************************/


function TaskContainer(element) {
  this.element = element;
  this.numTasks = 0;
};

TaskContainer.prototype.add = function(element) {
  siteIcon.classList.add('hidden');
  this.element.prepend(element);
  this.numTasks++;
  if (this === completedTaskContainer) {
    completedTaskToggle.classList.remove('hidden');
  }
};

TaskContainer.prototype.remove = function(element) {
  element.remove();
  this.numTasks--;
  if (this === completedTaskContainer && !this.numTasks) {
    completedTaskToggle.classList.add('hidden');
  }
};

TaskContainer.prototype.removeAllTasks = function() {
  while (this.element.hasChildNodes()) {
    this.element.removeChild(this.element.firstChild);
  }
  this.numTasks = 0;
  if (this === completedTaskContainer) {
    completedTaskToggle.classList.add('hidden');
  }
};


/************************/
/******* TaskList *******/
/************************/


function TaskList(name, url, tasks, ownerId, _id) {
  
  this.name = name;
  this.url = url || '/' + name.toLowerCase().replace(/\s/gi, '-');
  this.tasks = tasks || [];
  this.ownerId = ownerId;
  this._id = _id;
  
  this.createTaskListNavDOMElement();

};

/*

*** REFACTOR? ***

It seems like this method should also be responsible for adding the Task to the
UI.

*/

TaskList.prototype.addTask = async function(task) {

  this.tasks.push(task);

  const response = await fetch(`/taskLists/${this._id}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id: task._id }),
  });

  const json = await response.json();

};

TaskList.prototype.createTaskListDB = async function() {

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

  const taskList = await response.json();

  this._id = taskList._id;

};

TaskList.prototype.createTaskListNavDOMElement = function() {
    
  this.navElement = document.createElement('div');
  const i = document.createElement('i');
  const span = document.createElement('span');
  const a = document.createElement('a');

  this.navElement.classList.add('task-list-nav-item');
  
  a.classList.add('task-list-nav');
  a.href = this.url;

  span.textContent = this.name;

  // Fix wierd margin collapse when DOM element is added but page isn't reloaded.
  span.style.marginLeft = '4px' 

  i.classList.add('fas', 'fa-bars');

  a.appendChild(i);
  a.appendChild(span);
  this.navElement.appendChild(a);

};

TaskList.prototype.populateTaskContainers = function() {
  this.tasks.forEach((task, i) => {
    if (i === this.tasks.length - 1) {
      task.element.classList.add('active-task');
    }
    if (this.name === 'Trash') {
      task.element.querySelector('i').classList.add('not-allowed');
    }
    if (task.completed) {
      completedTaskContainer.add(task.element);
    } else {
      incompleteTaskContainer.add(task.element);
    }
  });
};

TaskList.prototype.removeTask = async function(taskToRemove) {

  this.tasks = this.tasks.filter(task => task !== taskToRemove);

  if (this === activeTaskList && !this.tasks.length) {
    siteIcon.classList.remove('hidden');
    completedTaskToggle.classList.add('hidden');
  }
  
  const response = await fetch(`/taskLists/${this._id}/tasks/${taskToRemove._id}`, {
    method: 'DELETE',
  });

  const taskList = await response.json();


};

/*************** Global Helper Functions *******************/


const changeActiveTaskList = (newActiveTaskList) => {
  changePageURL(newActiveTaskList);
  updatePageState(newActiveTaskList);
  updateTaskListUI(newActiveTaskList);

  if (activeTaskList.name === 'Trash') {
    toggleDumpsterIcon();
  }

  if (newActiveTaskList.name === 'Completed') {
    siteIcon.querySelector('p').textContent = 'No completed tasks yet';
    createTaskInput.classList.add('hidden');
  } else if (newActiveTaskList.name === 'Trash') {
    siteIcon.querySelector('p').textContent = 'No deleted tasks yet';
    createTaskInput.classList.add('hidden');
    toggleDumpsterIcon();
  } else {
    siteIcon.querySelector('p').textContent = 'Tap the input box to create some new tasks';
    createTaskInput.classList.remove('hidden');
  }
  createTaskInput.placeholder = `Add Task to "${newActiveTaskList.name}"`;
  createTaskInput.focus();
  activeTaskList = newActiveTaskList;
};

/*
*   Set the page URL to the newActiveTaskList.name.
*/
const changePageURL = (newActiveTaskList) => {
  
  const url = '/' + newActiveTaskList.name.toLowerCase().replace(/\s/gi, '-');
  
  /*

  *** RESEARCH ***
  
  I'm not exactly sure how the HistoryAPI works, or if I'm using this
  correctly. I copied this from a project I did using the HistoryAPI, 
  but I need to understand what's happening here if this code is going
  to stay in this project.

  */

  window.history.pushState({ taskListName: activeTaskList.name }, '', url);
  
};

/*
*   1. Loads TaskLists from the DB and instantiates the appropriate TaskList 
*   and Task objects for client-side use and store in the taskLists array.
*   2. Sets the activeTaskList to the currently loaded TaskList.
*   3. Associates server-generated Task DOM elements with correct Task.element 
*   in the activeTaskList array.
*   4. Associates server-generated TaskListNav DOM elements with correct 
*   taskList.navElement.
*/
const initTaskLists = async () => {

  taskLists = await instantiateTasksAndTaskLists();
  setActiveTaskList();
  setTaskElementsInActiveTaskList();
  setTaskListNavElements();

  /**************** Special Object Properties *******************/

  trashTaskList = taskLists.find(taskList => taskList.name === 'Trash');

  trashTaskList.clearTrash = async function() {
    
    siteIcon.classList.remove('hidden');
    completedTaskToggle.classList.add('hidden');
    
    this.tasks.forEach(task => task.element.remove());

    const response = await fetch(`/taskLists/${this._id}/tasks`, {
      method: 'DELETE',
    });

    const taskList = await response.json();

  };

};

/*
*   Loads TaskLists from the DB.
*/
const loadTaskLists = async () => {

  const responseTaskLists = await fetch('/taskLists');
  const taskLists = await responseTaskLists.json();

  return taskLists;

};

/*
*   Uses the taskLists loaded from the DB to create Task and TaskList objects
*   and returns an array of TaskList objects.
*/
const instantiateTasksAndTaskLists = async () => {
  return (await loadTaskLists()).map((taskList) => {
    taskList.tasks = taskList.tasks.map((task) => {
      return new Task(task.name, task.ownerId, task.description, task.completed, task._id);
    });
    return new TaskList(taskList.name, taskList.url, taskList.tasks, taskList.ownerId, taskList._id);
  });;
};

/*
*   Sets the .active-task to the Task represented by clickedElement.
*/
const setActiveTask = (clickedElement) => {
  
  const taskElement = clickedElement.tagName === 'LI' ? clickedElement : clickedElement.parentElement;

  centerCol.querySelector('.active-task').classList.remove('active-task');

  taskElement.classList.add('active-task');

};

/*
*   Sets the activeTaskList global variable to the taskList that is currently
*   displayed on the page.
*/
const setActiveTaskList = () => {

  const currentDisplayedTaskListName = document.getElementById('pageTitle').textContent;

  activeTaskList = taskLists.find(taskList => taskList.name === currentDisplayedTaskListName);

};

/*
*   Sets up the task.element property of the tasks in the activeTaskList to 
*   reference the DOM elements displayed on the page.
*/
const setTaskElementsInActiveTaskList = () => {

  const currentDisplayedTasks = document.querySelectorAll('.task-container li');

  activeTaskList.tasks.forEach((task) => {
    task.element = Array.prototype.find.call(currentDisplayedTasks, ((taskElement) => taskElement.children[1].textContent === task.name));
  });

};

/*
*   Sets the taskList.navElement of each taskList in the global taskLists
*   array to reference the taskListNavElements in the DOM.
*/
const setTaskListNavElements = () => {

  const taskListNavElements = document.querySelectorAll('.task-list-nav-item');

  taskLists.forEach((taskList) => {
    taskList.navElement = Array.prototype.find.call(taskListNavElements, ((taskListNavElement) => taskListNavElement.lastElementChild.lastElementChild.textContent === taskList.name));
  });

};

/*
*   Sets the date in the 'Today' icon representing tasks due today.
*/
const setTodaysDate = () => {
  
  const dateSpan = document.getElementById('date');
  const todaysDate = new Date().getDate();
  
  dateSpan.textContent = todaysDate;

  // When there is only 1 character, this will help center the date inside the calendar icon.
  if (todaysDate < 10) {
    dateSpan.style.marginLeft = '3px';
  }

};

const setToggleIcon = (clickedElement) => {
  
  let toggleIcon = '';

  if (clickedElement.tagName === 'I') {
    toggleIcon = clickedElement;
  } else if (clickedElement.id === 'completedTaskToggle') {
    toggleIcon = clickedElement.querySelector('i');
  } else {
    toggleIcon = clickedElement.previousElementSibling;
  }

  return toggleIcon;

};

const toggleCaretIcon = (clickedElement) => {
  
  const toggleIcon = setToggleIcon(clickedElement);

  toggleIcon.classList.toggle('fa-caret-down');
  toggleIcon.classList.toggle('fa-caret-right');

};

const toggleCompletedCheckbox = (checkbox) => {
  checkbox.classList.toggle('far');
  checkbox.classList.toggle('fa-square');
  checkbox.classList.toggle('fas');
  checkbox.classList.toggle('fa-check-square');
};

const toggleCompletedStatus = (checkbox) => {

  if (activeTaskList.name === 'Trash') return;
  
  toggleCompletedCheckbox(checkbox);

  const taskElement = checkbox.parentElement;
  const task = activeTaskList.tasks.find(task => task.element === taskElement);

  task.toggleCompletedStatus();

};

const toggleDumpsterIcon = () => {
  const pageTitleContainerSpanElements = document.querySelectorAll('.page-title-container span');
  pageTitleContainerSpanElements.forEach(element => element.classList.toggle('hidden'));
};

/*
*   Changes the page title and placeholder for the createTaskInput to match
*   the newActiveTaskList that will be loaded.
*/
const updatePageState = (newActiveTaskList) => {

  const pageTitleElement = document.getElementById('pageTitle');
  
  pageTitleElement.textContent = newActiveTaskList.name;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${newActiveTaskList.name}"`);

};

/*
*   1. Wipes the activeTaskList tasks from the DOM.
*   2. Adds all tasks in newActiveTaskList to the DOM.
*/
const updateTaskListUI = (newActiveTaskList) => {
  incompleteTaskContainer.removeAllTasks();
  completedTaskContainer.removeAllTasks();
  newActiveTaskList.populateTaskContainers();
  if (!incompleteTaskContainer.numTasks && !completedTaskContainer.numTasks) {
    siteIcon.classList.remove('hidden');
  }
};

/********************* Event Listeners ***********************/

/*
*   Allows the browser's 'back' button to function correctly.
*/
window.onpopstate = (e) => {
  const newActiveTaskList = taskLists.find(taskList => taskList.url === window.location.pathname);
  changeActiveTaskList(newActiveTaskList);
};

/*
*   This listener will perform ONE of the following options on 'click':
*
*     a.) Removes addListDialogBox or editTaskDialogBox from the DOM when a close button 
*     is clicked.
*
*     b.) Shows the editTaskDialogBox when the ellipsis is clicked.
*/
document.addEventListener('click', (e) => {

  /*
  *   Close the addListDialogBox or the editTaskDialogBox.
  */
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    
    const dialogBox = dialogBoxes.find(dialogBox => dialogBox.element.id === e.target.getAttribute('data-target'));
    
    dialogBox.hideDialogBox();
    
    return;
  }
  
  /*
  *   Show the editTaskDialogBox and set the editTaskDialogBox.task property to
  *   the task to edit.
  */
  if (e.target.classList.contains('ellipsis')) {

    editTaskDialogBox.showDialogBox();

    const task = activeTaskList.tasks.find((task) => {
      return task.element === e.target.parentElement;
    });

    editTaskDialogBox.task = task;

    return;

  }

  if (e.target.id === 'clearTrash' || e.target.parentElement.id === 'clearTrash') {

    deleteTaskDialogBox.showDialogBox();

  }

});

/*
*   Show the addListDialogBox when the addListButton is clicked and give the 
*   createListInput focus.
*/
addListButton.addEventListener('click', () => {
  addListDialogBox.showDialogBox();
  createListInput.focus();
});

/*
*   This event listener performs ONE of the following options on 'click':
*
*     a.) Toggles the completed checkbox of a Task.
*
*     b.) Sets the .active-task to the clicked Task.
*/
centerCol.addEventListener('click', function(e) {

  /*
  *   Toggles the completed status of a Task, changing the checkbox icon, 
  *   taskContainer, and completed status on the Task object.
  */
  if (e.target.tagName === 'I' && e.target.parentElement !== completedTaskToggle) return toggleCompletedStatus(e.target);

  /*
  *   Set the .active-task to the clicked Task.
  */
  if (e.target.tagName === 'LI' || e.target.hasAttribute('contenteditable')) {
    return setActiveTask(e.target);
  }
  
});

/*
*   Give focus to the createTaskInput whenever a user is editing a task 
*   in a taskContainer and hits 'Enter'.
*/
centerCol.addEventListener('keydown', (e) => {
 
  if (e.keyCode !== ENTER_KEYCODE) return;
  if (!e.target.hasAttribute('contenteditable')) return;
 
  e.target.blur();
  createTaskInput.focus();

});

/*
*   Toggles the caret icon, and shows/hides the completedTaskContainer.
*/
completedTaskToggle.addEventListener('click', function(e) {
  toggleCaretIcon(e.target);
  this.classList.toggle('tasks-hidden');
  completedTaskContainer.element.classList.toggle('hidden');
});

/* 

*** NOTE ***

The createListInput event listener below has to be a 'keyup' event. You 
refactored once before to make it match the createTaskInput event listener, 
but it broke the functionality because the saveListButton stayed disabled when 
only 1 character was entered. Apparently, when the 'keydown' event fires, the 
createListInput will not have the value of the character in the input stored 
yet, so you can't check for it the listener.

*/

/*
*   This listener will perform ONE of the following options on 'keyup':
*
*     a.) Shorcut to create a new TaskList from the createListInput when 
*     'Enter' key is pressed.
*
*     b.) Only allow 'save' button to be clicked when there are characters in 
*     the createListInput.
*/
createListInput.addEventListener('keyup', function(e) {

  /*
  *   Save the list when 'Enter' key is pressed. Shortcut for just clicking the
  *   'Save' button. 
  */
  if (e.keyCode === ENTER_KEYCODE) {
    return document.querySelector('#addListDialogBox .btn-save').click();
  }

  /*
  *   Enable the saveListButton when there are no characters in the
  *   createListInput.
  */
  if (this.value.length) return saveListButton.removeAttribute('disabled');
  
  saveListButton.setAttribute('disabled', true);

});

/*
*   When the user presses the 'Enter' key in the createTaskInput, this 
*   event listener handles all Task creation logic:
*   
*   1. Creates a new Task.
*   2. Adds the Task to the DB.
*   3. Adds the Task to the appropriate TaskList.
*   4. Ensures the Task is set as the .active-task.
*   5. Adds the Task to the incompleteTaskContainer in the DOM.
*   6. Wipes the value from the createTaskInput.
*/
createTaskInput.addEventListener('keydown', async function(e) {
  
  if (e.keyCode !== ENTER_KEYCODE) return;

  const task = new Task(this.value, activeTaskList._id);

  /*
  *   The task that is just created will be the .active-task, so make sure to 
  *   remove .active-task from any tasks in the centerCol before adding the 
  *   newly created task to the DOM.
  */
  if (centerCol.querySelector('.active-task')) {
    centerCol.querySelector('.active-task').classList.remove('active-task');
  }

  task.element.classList.add('active-task');
  incompleteTaskContainer.add(task.element);

  /* 
  *   Have to 'await' this Task to be created in the DB because the _id field
  *   that Mongoose adds to the Task will be needed for the taskList.addTask()
  *   call to work correctly.
  */
  await task.createTaskDB();

  activeTaskList.addTask(task);
  this.value = '';

});

editTaskDialogBox.element.addEventListener('click', function(e) {

  if (e.target === deleteTaskButton) {
    editTaskDialogBox.task.remove();
    deleteTaskButton.previousElementSibling.click();
    return;
  }

});

deleteTaskDialogBox.element.addEventListener('click', function(e) {

  if (e.target.classList.contains('btn-delete')) {
    trashTaskList.clearTrash();
    e.target.previousElementSibling.click();
  }

});

/*
*   1. Create a new TaskList.
*     - Add the taskList.navElement to the taskListNavContainer.
*     - Add the taskList to the taskLists array.
*     - Store the new taskList in the DB.
*   2. Change the activeTaskList to the newly created TaskList.
*   3. Hide the addList dialog box.
*   4. Give the createTaskInput focus.
*/
saveListButton.addEventListener('click', function(e) {

  const newActiveTaskList = new TaskList(createListInput.value);

  /*
  *   All new TaskLists will be added right under the 'Lists' heading
  *   in the taskListNavContainer.
  */
  listsHeading.after(newActiveTaskList.navElement);
  
  taskLists.push(newActiveTaskList);
  newActiveTaskList.createTaskListDB();
  
  addListDialogBox.hideDialogBox();
  
  changeActiveTaskList(newActiveTaskList);

});

/*
*   Loads the appropriate TaskList into the centerCol and changes the URL to
*   the TaskList name.
*/
taskListNavContainer.addEventListener('click', (e) => {

  if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') return;
  
  e.preventDefault();

  const taskListLink = e.target.tagName === 'A' ? e.target : e.target.parentElement;
  
  const newActiveTaskList = taskLists.find(taskList => taskList.url === taskListLink.getAttribute('href'));

  changeActiveTaskList(newActiveTaskList);

});

/************************** Init Page Load ************************/

if (window.location.pathname === '/completed') {
  siteIcon.querySelector('p').textContent = 'No completed tasks yet';
  createTaskInput.classList.add('hidden');
} else if (window.location.pathname === '/trash') {
  siteIcon.querySelector('p').textContent = 'No deleted tasks yet';
  createTaskInput.classList.add('hidden');
  centerCol.querySelectorAll('li i').forEach(i => i.classList.add('not-allowed'));
  toggleDumpsterIcon();
} else {
  createTaskInput.focus();
}

/*
*   Sets the date in the 'Today' icon representing tasks due today.
*/
setTodaysDate();

/*
*   Loads TaskLists from the DB and instantiates the appropriate TaskList and 
*   Task objects for client-side use. Stores all TaskLists in the taskLists 
*   array.
*/
initTaskLists();

