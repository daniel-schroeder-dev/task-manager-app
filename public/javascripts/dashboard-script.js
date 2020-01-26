const taskLists = [];
const ENTER_KEYCODE = 13;

const leftCol = document.getElementById('leftCol');
const createListInput = document.getElementById('createList');
const taskContainer = document.getElementById('taskContainer');
const createTaskInput = document.getElementById('createTask');
const addListButton = document.getElementById('addListButton');
const saveButton = document.querySelector('.btn-save');

const TaskList = function(name, url, tasks, ownerId, _id) {
  
  this.name = name;
  this.url = url || '/' + name.toLowerCase().replace(/\s/gi, '-');
  this.tasks = tasks || [];
  this.ownerId = ownerId;
  this._id = _id;

  this.createTaskListDOMElement = function() {
    
    const div = document.createElement('div');
    const i = document.createElement('i');
    const span = document.createElement('span');
    const a = document.createElement('a');
    
    a.classList.add('task-list-nav');
    a.href = this.url

    span.textContent = this.name;

    // fix wierd margin collapse when DOM element is added but page isn't reloaded.
    span.style.marginLeft = '4px' 

    i.classList.add('fas', 'fa-bars');

    a.appendChild(i);
    a.appendChild(span);
    div.appendChild(a);

    return div;

  };

  this.createTaskListDB = async function() {
    
    const data = {
      url: this.url,
      name: this.name,
    };

    const response = await fetch('/taskLists', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    const json = await response.json();

    this._id = json._id;

  };

  this.addTask = function(task) {
    this.tasks.push(task);
    updateTaskListDB(task);
  }

  async function updateTaskListDB(task) {

    const data = {
      task,
    };

    const response = await fetch('/taskLists', {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    const json = await response.json();

  };

};

const Task = function(name, ownerId, description, completed, _id) {

  this.name = name;
  this.description = description;
  this.completed = completed || false;
  this.ownerId = ownerId;
  this._id = _id;

  this.createTaskDOMElement = function() {
    
    const li = document.createElement('li');
    const i = document.createElement('i');
    const spanTaskName = document.createElement('span');
    const spanEllipsis = document.createElement('span');
    
    li.classList.add('active-task');
    i.classList.add('far', 'fa-square');
    spanEllipsis.classList.add('ellipsis');
    
    spanTaskName.setAttribute('contenteditable', 'true');
    spanTaskName.textContent = this.name;

    // fix wierd margin collapse when DOM element is added but page isn't reloaded.
    spanTaskName.style.marginLeft = '3.5px' 
    
    spanEllipsis.innerHTML = '&hellip;';
    
    li.appendChild(i);
    li.appendChild(spanTaskName);
    li.appendChild(spanEllipsis);

    return li;

  };

  this.createTaskDB = async function() {
    
    const data = {
      name: this.name,
      completed: this.completed,
      ownerId: this.ownerId,
    };

    const response = await fetch('/tasks', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    const json = await response.json();

    this._id = json._id;

  };

}

const loadTaskLists = async () => {

  const responseTaskLists = await fetch('/taskLists');
  const taskLists = await responseTaskLists.json();

  return taskLists;

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

const setTodaysDate = () => {
  
  const dateSpan = document.getElementById('date');
  const todaysDate = new Date().getDate();
  
  dateSpan.textContent = todaysDate;

  // when there is only 1 character, this will help center the date inside the calendar icon
  if (todaysDate < 10) {
    dateSpan.style.marginLeft = '2px';
  }

};

const changePageURL = (pageName) => {
  
  const url = '/' + pageName.toLowerCase().replace(/\s/gi, '-');
  
  window.history.replaceState({ pageName }, '', url);
  
};

const updatePageState = (pageName) => {

  const pageTitleElement = document.getElementById('pageTitle');
  
  pageTitleElement.textContent = pageName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${pageName}"`);

  while (taskContainer.firstChild) {
    taskContainer.firstChild.remove();
  }

};

const updateTaskListUI = (taskListName) => {
  const taskList = taskLists.find(taskList => taskList.name === taskListName);
  if (!taskList.tasks.length) {
    document.getElementById('siteIcon').style.display = 'block';
  } else {
    document.getElementById('siteIcon').style.display = 'none';
  }
  taskList.tasks.forEach((task, i) => {
    const taskDOMElement = task.createTaskDOMElement();
    if (i !== taskList.tasks.length - 1) {
      taskDOMElement.classList.remove('active-task');
    }
    taskContainer.prepend(taskDOMElement);
  });
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


/********************* Event Listeners ***********************/


addListButton.addEventListener('click', () => {

  const addListBox = document.getElementById('addListBox');

  addListBox.style.display = 'block';
  addListBox.classList.remove('is-paused');

});

document.addEventListener('click', (e) => {

  // works to close the addListBox or the editTaskBox
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return removeBox(e.target.getAttribute('data-target'));
  }
  
  // create a new TaskList in the DOM/DB, update the URL and page state
  if (e.target.classList.contains('btn-save')) {
    
    const createListsContainer = document.getElementById('createListsContainer');
    const taskListName = createListInput.value;
    const taskList = new TaskList(taskListName);
    const taskListDOMElement = taskList.createTaskListDOMElement();
    
    createListsContainer.firstElementChild.after(taskListDOMElement);
    
    taskLists.push(taskList);
    taskList.createTaskListDB();
    
    changePageURL(taskListName);
    updatePageState(taskListName);
    
    removeBox('addListBox');

    createTaskInput.focus();

    document.getElementById('siteIcon').style.display = 'block';
    
    return;
  
  }
  
  if (e.target.classList.contains('ellipsis')) {
    
    const editTaskBox = document.getElementById('editTaskBox');
    
    editTaskBox.style.display = 'block';
    editTaskBox.classList.remove('is-paused');
    
    return;
  }

});

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
  const taskDOMElement = task.createTaskDOMElement();

  // we need the _id field of this task for the taskList.updateTaskListDB(task) call below, so make sure to await the result so that the task has the _id field.
  await task.createTaskDB();

  taskList.addTask(task);
  
  // the task that is just created will be the .active-task, so make sure to remove .active-task from any tasks in the taskContainer before adding the newly created task
  if (taskContainer.querySelector('.active-task')) {
    taskContainer.querySelector('.active-task').classList.remove('active-task');
  }

  if (!taskContainer.querySelector('li')) {
    document.getElementById('siteIcon').style.display = 'none';
  }
  
  taskContainer.prepend(taskDOMElement);
  this.value = '';

});

taskContainer.addEventListener('click', (e) => {
  
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
    currentNode = currentNode.querySelector('span');
  }

  currentNode.focus();

});

taskContainer.addEventListener('keydown', (e) => {
  if (e.keyCode !== ENTER_KEYCODE) return;
  e.target.blur();
  createTaskInput.focus();
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


// When the page first loads, check to see if we need to wipe the siteIcon from the taskContainer 
if (taskContainer.querySelector('li')) {
  document.getElementById('siteIcon').style.display = 'none';
}

// sets the date in the 'Today' icon
setTodaysDate();

// creates TaskList and Task objects to mirror the DB data
initTaskLists();