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
  
  this.siteIcon = document.getElementById('siteIcon');
  
  this.createTaskListNavDOMElement();
  this.createIncompleteTaskContainer();
  this.createCompletedTaskHeader();
  this.createCompletedTaskContainer();
  this.createTopLevelDOMElement();

};

TaskList.prototype.addTask = function(task) {
  
  this.tasks.push(task);
  
  task.element.classList.add('active-task');
  this.incompleteTaskContainer.prepend(task.element);
  
  this.updateTaskListDB(task);

};

TaskList.prototype.createCompletedTaskContainer = function() {
  this.completedTaskContainer = document.createElement('ul');
  this.completedTaskContainer.classList.add('task-container');
  this.completedTaskContainer.id = 'completedTaskContainer';
};

TaskList.prototype.createCompletedTaskHeader = function() {
  this.completedTaskHeader = document.createElement('div');
  const i = document.createElement('i');
  const span = document.createElement('span');

  this.completedTaskHeader.id = 'completedTaskHeader';
  i.classList.add('fas', 'fa-caret-down');
  span.textContent = 'Completed';

  this.completedTaskHeader.append(i);
  this.completedTaskHeader.append(span);

  return this.completedTaskHeader;
};

TaskList.prototype.createIncompleteTaskContainer = function() {
  this.incompleteTaskContainer = document.createElement('ul');
  this.incompleteTaskContainer.classList.add('task-container');
  this.incompleteTaskContainer.id = 'incompleteTaskContainer';
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

  this.navElement.classList.add('task-list-nav-container');
  
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

TaskList.prototype.createTopLevelDOMElement = function() {
  this.element = document.createElement('div');
  this.element.append(this.incompleteTaskContainer);
  this.element.append(this.completedTaskHeader)
  this.element.append(this.completedTaskContainer);
};

TaskList.prototype.populateTaskContainers = function() {
  this.tasks.forEach((task, i) => {
    if (i === this.tasks.length - 1) {
      task.element.classList.add('active-task');
    }
    if (task.completed) {
      this.completedTaskContainer.prepend(task.element);
    } else {
      this.incompleteTaskContainer.prepend(task.element);
    }
  });
};

TaskList.prototype.updateTaskListDB = async function(task) {

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

    const task = await response.json();

    this._id = task._id;

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

    // Fix wierd margin collapse when DOM element is added but page isn't reloaded.
    spanTaskName.style.marginLeft = '3.5px' 
    
    spanEllipsis.innerHTML = '&hellip;';
    
    li.appendChild(i);
    li.appendChild(spanTaskName);
    li.appendChild(spanEllipsis);

    return li;

  }

};

Task.prototype.setTaskList = function(taskList) {
  this.taskList = taskList;
};


/*************** Global Helper Functions *******************/

/*
*   Set the URL to the taskListName.
*/
const changePageURL = (taskListName) => {
  
  const url = '/' + taskListName.toLowerCase().replace(/\s/gi, '-');
  
  window.history.replaceState({ taskListName }, '', url);
  
};

/*
*   1. Loads TaskLists from the DB and instantiates the appropriate TaskList 
*   and Task objects for client-side use. 
*   2. Stores all TaskLists in the taskLists array.
*   3. Associates server-generated DOM elements with correct Task.element in
*   in the taskLists array and TaskList.navElement.
*/
const initTaskLists = async () => {
  
  const lists = await loadTaskLists();

  lists.forEach((taskList) => {

    const tasks = taskList.tasks.map((task) => {
      const task = new Task(task.name, task.ownerId, task.description, task.completed, task._id);
      task.setTaskList(taskList);
      return task;
    });

    taskLists.push(new TaskList(taskList.name, taskList.url, tasks, taskList.ownerId, taskList._id));
  
  });

  /*
  *   1. Determine the current taskList that is loaded.
  *   2. Get a reference from the taskLists array to the loaded taskList.
  *   3. Associate the DOM elements representing Tasks with the correct Task 
  *   in the taskList.tasks array.
  */

  const currentDisplayedTaskListName = document.getElementById('pageTitle').textContent;

  const currentDisplayedTaskList = taskLists.find(taskList => taskList.name === currentDisplayedTaskListName);

  currentDisplayedTaskList.incompleteTaskContainer = document.getElementById('incompleteTaskContainer');

  currentDisplayedTaskList.completedTaskHeader = document.getElementById('completedTaskHeader');

  currentDisplayedTaskList.completedTaskContainer = document.getElementById('completedTaskContainer');

  currentDisplayedTaskList.element = document.querySelector('#centerCol div');

  const currentDisplayedTasks = Array.from(document.querySelectorAll('.task-container li'));

  currentDisplayedTaskList.tasks.forEach((task) => {
    task.element = currentDisplayedTasks.find(taskElement => taskElement.children[1].textContent === task.name);
  });

  /*
  *   1. Get all TaskList nav elements.
  *   2. Assign them to the appropriate taskList.navElement.
  */

  const taskListNavElements = Array.from(document.querySelectorAll('.task-list-nav-container'));

  taskLists.forEach((taskList) => {
    taskList.navElement = taskListNavElements.find((taskListNavElement) => {
      return taskListNavElement.lastElementChild.lastElementChild.textContent === taskList.name;
    });
  });

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
const removeBox = (boxID) => {
  
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
    
    saveButton.setAttribute('disabled', true);

  }, 100);

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

/*
*   Changes the page title and placeholder for the createTaskInput to match
*   the currently loaded TaskList.
*/
const updatePageState = (taskListName) => {

  const pageTitleElement = document.getElementById('pageTitle');
  
  pageTitleElement.textContent = taskListName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${taskListName}"`);

};

/*

*** TODO ***

This method should wipe all tasks from the centerCol, not just the 
incompleteTaskContainer, as there could be Tasks in the completedTaskContainer 
that need to be removed as well.

*/

/*
*   1. Wipes the incompleteTaskContainer of all Tasks.
*   2. Toggles the siteIcon.
*   3. Adds all Tasks in the TaskList to the incompleteTaskContainer.
*/
const updateTaskListUI = (taskListToAdd, taskListToRemove) => {

  taskListToRemove.element.remove();

  if (!taskListToAdd.tasks.length) {
    taskListToAdd.siteIcon.style.display = 'block';
  } else {
    taskListToAdd.siteIcon.style.display = 'none';
  }

  taskListToAdd.populateTaskContainers();

  centerCol.append(taskListToAdd.element);
  
};


/********************* Event Listeners ***********************/

/*
*   This listener will perform ONE of the following options on 'click':
*
*     a.) Removes addListBox or editTaskBox from the DOM when a close button 
*     is clicked.
*
*     b.) Creates a new TaskList in the DOM/DB and updates the URL to be the 
*     TaskList name when a save button is clicked.
*
*     c.) Shows the editTaskBox when the ellipsis is clicked.
*/
document.addEventListener('click', (e) => {

  /*
  *   Close the addListBox or the editTaskBox.
  */
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return removeBox(e.target.getAttribute('data-target'));
  }
  
  /*
  *   Create a new TaskList in the DOM/DB, update the URL and page state.
  */
  if (e.target.classList.contains('btn-save')) {

    /*

    *** TODO ***
    
    Make getting the taskListToRemove into a function, you use it in two places.

    */
    
    const taskListNameToRemove = document.getElementById('pageTitle').textContent;
    const taskListToRemove = taskLists.find(taskList => taskList.name === taskListNameToRemove);

    const createListsContainer = document.getElementById('createListsContainer');
    const taskList = new TaskList(createListInput.value);
    
    createListsContainer.firstElementChild.after(taskList.navElement);
    
    taskLists.push(taskList);
    taskList.createTaskListDB();
    
    changePageURL(taskList.name);
    updatePageState(taskList.name);
    updateTaskListUI(taskList, taskListToRemove);
    
    removeBox('addListBox');

    createTaskInput.focus();

    siteIcon.style.display = 'block';
    
    return;

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
*     a.) Toggles the caret icon and shows/hides the completedTaskContainer.
*
*     b.) Toggles the completed checkbox of a Task.
*
*     c.) Adds focus to the Task that was clicked and makes it the only
*     .active-task.
*/
centerCol.addEventListener('click', function(e) {

  /*
  *   The createTaskInput has it's own handler attached, if the user clicks 
  *   into that input this listener will run, but there is no proccessing that
  *   needs to be handled here so just exit the listener.
  */  
  if (e.target.id === 'createTask') return;
  
  /*
  *   Toggles the caret icon, and shows/hides the completedTaskContainer.
  */
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

  /*
  
  *** TODO ***

  This should also toggle the completed status of the Task object, and move 
  the Task into the completedTaskContainer, along with adding it to the 
  completedTaskList.

  */

  /*
  *   1. Toggles the completed checkbox of a Task.
  *   2. Toggles which taskContainer the Task is in.
  */
  if (e.target.tagName === 'I') {
    
    e.target.classList.toggle('far');
    e.target.classList.toggle('fa-square');
    e.target.classList.toggle('fas');
    e.target.classList.toggle('fa-check-square');

    const taskElement = e.target.parentElement;

    /*

    *** NOTE ***
    
    This is a point where I realized that I need to be associating the DOM
    elements that are generated server-side with the task.element property
    whenever the page is loaded, so that marking a task as completed won't
    involve so much convoluted querying. I'm leaving the code below just in 
    case I'm wrong about my new direction, I'll have where I left off saved.

    const taskName = taskElement.querySelector('span[contenteditable="true"]').textContent;

    const taskListName = document.getElementById('pageTitle').textContent;

    const [ taskList ] = taskLists.filter(taskList => taskList.name === taskListName);

    const [ task ] = taskList.tasks.filter(task => task.name === taskName);
    
    */

    taskElement.remove();
    taskElement.classList.remove('active-task');

    if (e.target.classList.contains('fa-check-square')) {
      taskElement.classList.add('completed-task');
      completedTaskContainer.prepend(taskElement);
    } else {
      taskElement.classList.remove('completed-task');
      incompleteTaskContainer.append(taskElement);
    }

    return;

  }

  /*
  *   At this point, other options have been ruled out so I assume that the 
  *   user is clicking a Task and wants to edit it. So, here I add focus to 
  *   the Task that was clicked and make it the only .active-task.
  */
  
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

*** NOTE ***

The createListInput event listener below has to be a 'keyup' event. You 
refactored once before to make it match the createTaskInput event listener, 
but it broke the functionality because the saveButton stayed disabled when 
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
    this.nextElementSibling.querySelector('.btn-save').click();
  }

  /*
  *   Enable the saveButton when there are no characters in the
  *   createListInput.
  */
  if (this.value.length) return saveButton.removeAttribute('disabled');
  
  saveButton.setAttribute('disabled', true);

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

  const taskList = taskLists.find((taskList) => {
    return taskList.name === this.previousElementSibling.textContent;
  });

  const task = new Task(this.value, taskList._id);

  /* 
  *   Have to 'await' this Task to be created in the DB because the _id field
  *   that Mongoose adds to the Task will be needed for the taskList.addTask()
  *   call to work correctly.
  */
  await task.createTaskDB();

  /*
  *   The task that is just created will be the .active-task, so make sure to 
  *   remove .active-task from any tasks in the centerCol before adding the 
  *   newly created task to the DOM.
  */
  if (centerCol.querySelector('.active-task')) {
    centerCol.querySelector('.active-task').classList.remove('active-task');
  }

  taskList.addTask(task);

  /*

  *** REFACTOR? ***
  
  I'm not sure this if() is neccessary, it may be more efficient not to
  perform the DOM query every time a Task is created, an instead just always
  set the siteIcon's display property to none. As of now, the condition will 
  run only when the first Task is added. But, I'm querying the DOM everytime
  to run the conditional, so I dunno...
  
  */
  if (!centerCol.querySelector('li')) {
    taskList.siteIcon.style.display = 'none';
  }
  
  this.value = '';

});

/*
*   Loads the appropriate TaskList into the centerCol and changes the URL to
*   the TaskList name.
*/
leftCol.addEventListener('click', (e) => {

  if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') return;
  
  e.preventDefault();
  
  let taskList = null;
  
  if (e.target.tagName === 'A') {

    taskList = taskLists.find((taskList) => {
      return taskList.url === e.target.getAttribute('href');
    });

  } else {

    taskList = taskLists.find((taskList) => {
      return taskList.name === e.target.textContent;
    });

  }

  const taskListNameToRemove = document.getElementById('pageTitle').textContent;
  const taskListToRemove = taskLists.find(taskList => taskList.name === taskListNameToRemove);
  
  changePageURL(taskList.name);
  updatePageState(taskList.name);
  updateTaskListUI(taskList, taskListToRemove);

});


/************************** Init Page Load ************************/


/*
*   When the page first loads, check to see if we need to wipe the siteIcon 
*   from the centerCol.
*/
if (centerCol.querySelector('li')) {
  siteIcon.style.display = 'none';
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