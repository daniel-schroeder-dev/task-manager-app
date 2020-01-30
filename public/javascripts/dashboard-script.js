let taskLists = [];
let activeTaskList = {};
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

const addListButton = document.getElementById('addListButton');
const saveListButton = document.querySelector('#addListBox .btn-save');

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

Task.prototype.toggleCompletedStatus = function() {
  
  this.completed = !this.completed;
  
  this.element.remove();
  this.element.classList.remove('active-task');
  
  if (this.completed) {
    completedTaskContainer.add(this.element);
    // const completedTaskList = taskLists.find((taskList) => {
    //   return taskList.name === 'Completed';
    // });
    // console.log(completedTaskList);
    // completedTaskList.addTask(this);
  } else {
    incompleteTaskContainer.add(this.element);
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
};

TaskContainer.prototype.add = function(element) {
  siteIcon.style.display = 'none';
  completedTaskToggle.style.display = 'block';
  this.element.prepend(element);
};

// completedTaskContainer.add = function(task) {
//   TaskContainer.prototype.add.call(this, task.element);
//   const completedTaskList = taskLists.find((taskList) => {
//     return taskList.name === 'Completed';
//   });
//   completedTaskList.addTask(task);
// };


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
  if (!this.tasks.length) {
    siteIcon.style.display = 'block';
    completedTaskToggle.style.display = 'none';
  }
  this.tasks.forEach((task, i) => {
    if (i === this.tasks.length - 1) {
      task.element.classList.add('active-task');
    }
    if (task.completed) {
      completedTaskContainer.add(task.element);
    } else {
      incompleteTaskContainer.add(task.element);
    }
  });
};

// TaskList.prototype.updateTaskListDB = async function(task) {

//   const data = task;

//   const response = await fetch('/taskLists', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   const json = await response.json();

// };


/*************** Global Helper Functions *******************/

const changeActiveTaskList = (newActiveTaskList) => {
  changePageURL(newActiveTaskList);
  updatePageState(newActiveTaskList);
  updateTaskListUI(newActiveTaskList);
  if (newActiveTaskList.name === 'Completed') {
    completedTaskToggle.style.display = 'block';
    siteIcon.querySelector('p').textContent = 'No completed tasks yet';
    createTaskInput.classList.add('hidden');
  } else {
    siteIcon.querySelector('p').textContent = 'Tap the input box to create some new taskst';
    createTaskInput.classList.remove('hidden');
  }
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

  window.history.replaceState({ taskListName: activeTaskList.name }, '', url);
  
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
*   Removes the box with boxID from the DOM and resets the state of the box.
*/
const hideDialogBox = (boxID) => {
  
  const box = document.getElementById(boxID);
  
  box.classList.remove('fade-in');
  box.classList.add('fade-out');
  
  /*

  *** RESEARCH ***
  
  I honestly don't understand why I need this setTimeout() call to get this 
  fade-in/fade-out animation to work, but it was the only thing I tried that 
  worked so I'm using it. I'm not sure if the issue is the animation itself, 
  or the way in which I'm triggering it. I have a vague understanding that 
  setTimeout() will run this code in a different portion of the event loop, 
  but I really need to understand this concept deeply if I'm going to use it 
  in my code.

  */

  /* 
  *   This is neccessary to give the fade-out animation time to run before 
  *   adding back the .fade-in and .is-paused classes.
  */
  setTimeout(() => {

    box.classList.add('is-paused');
    box.classList.add('fade-in');
    box.classList.remove('fade-out');
    
    box.style.display = 'none';
    
    if (boxID === 'addListBox') createListInput.value = '';
    
    saveListButton.setAttribute('disabled', true);

  }, 100);

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
    dateSpan.style.marginLeft = '2px';
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
  
  toggleCompletedCheckbox(checkbox);

  const taskElement = checkbox.parentElement;
  const task = activeTaskList.tasks.find(task => task.element === taskElement);

  task.toggleCompletedStatus();

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
  activeTaskList.tasks.forEach(task => task.element.remove());
  newActiveTaskList.populateTaskContainers();
};


/********************* Event Listeners ***********************/

/*
*   This listener will perform ONE of the following options on 'click':
*
*     a.) Removes addListBox or editTaskBox from the DOM when a close button 
*     is clicked.
*
*     b.) Shows the editTaskBox when the ellipsis is clicked.
*/
document.addEventListener('click', (e) => {

  /*
  *   Close the addListBox or the editTaskBox.
  */
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return hideDialogBox(e.target.getAttribute('data-target'));
  }
  
  /*
  *   Show the editTaskBox.
  */
  if (e.target.classList.contains('ellipsis')) {
    
    const editTaskBox = document.getElementById('editTaskBox');
    
    editTaskBox.style.display = 'block';
    editTaskBox.classList.remove('is-paused');
    
    return;

  }

});

/*
*   Show the addListBox when the addListButton is clicked and give the 
*   createListInput focus.
*/
addListButton.addEventListener('click', () => {

  const addListBox = document.getElementById('addListBox');

  addListBox.style.display = 'block';
  addListBox.classList.remove('is-paused');

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
  
  *** TODO ***

  This should add the Task to the completedTaskList.

  */

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
    return document.querySelector('#addListBox .btn-save').click();
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
  
  hideDialogBox('addListBox');
  
  changeActiveTaskList(newActiveTaskList);

});


/************************** Init Page Load ************************/


/*
*   When the page first loads, if there are any tasks in the centerCol, 
*   remove the siteIcon. If there aren't any tasks, remove the 
*   completedTaskToggle.
*/
if (centerCol.querySelector('li')) {
  siteIcon.style.display = 'none';
} else {
  completedTaskToggle.style.display = 'none';
}

if (window.location.pathname === '/completed') {
  completedTaskToggle.style.display = 'block';
  siteIcon.querySelector('p').textContent = 'No completed tasks yet';
  createTaskInput.classList.add('hidden');
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

