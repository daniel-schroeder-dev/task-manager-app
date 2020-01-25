const taskLists = [];


const createListInput = document.getElementById('createList');

const taskContainer = document.getElementById('taskContainer');
const createTaskInput = document.getElementById('createTask');
const addListButton = document.getElementById('addListButton');
const saveButton = document.querySelector('.btn-save');


const TaskList = function(listName) {
  
  this.listName = listName;
  this.url = '/' + listName.toLowerCase().replace(/\s/gi, '-');

  this.createTaskListDOMElement = function() {
    const div = document.createElement('div');
    const i = document.createElement('i');
    const span = document.createElement('span');
    const a = document.createElement('a');
    a.classList.add('task-list-nav');
    /* TODO: this happens in changePageURL as well, make it DRY */
    a.href = this.url
    span.textContent = this.listName;
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
      pageUrl: this.url,
      name: this.listName,
    };

    const response = await fetch('/createTaskList', {
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
    
    console.log('Saved taskList to DB: ', json);

  };

};

const setTodaysDate = () => {
  
  const dateSpan = document.getElementById('date');
  const todaysDate = new Date().getDate();
  
  dateSpan.textContent = todaysDate;

  if (todaysDate < 10) {
    dateSpan.style.marginLeft = '2px';
  }

};

const changePageURL = (pageName) => {

  if (window.history.state && window.history.state.pageName === pageName) return;
  
  const formattedPageName = pageName.toLowerCase().replace(/\s/gi, '-');
  const url = '/' + formattedPageName;
  
  window.history.replaceState({ pageName }, '', url);
  
};

const updatePageState = (pageName) => {
  const pageTitleElement = document.getElementById('pageTitle');
  pageTitleElement.textContent = pageName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${pageName}"`);
};

const removeBox = (boxID) => {
  const box = document.getElementById(boxID);
  box.classList.remove('fade-in');
  box.classList.add('fade-out');
  setTimeout(() => {
    box.classList.add('is-paused');
    box.classList.add('fade-in');
    box.classList.remove('fade-out');
    box.style.display = 'none';
    createListInput.value = '';
    saveButton.setAttribute('disabled', true);
  }, 100);
};

addListButton.addEventListener('click', () => {
  const addListBox = document.getElementById('addListBox');
  addListBox.style.display = 'block';
  addListBox.classList.remove('is-paused');
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return removeBox(e.target.getAttribute('data-target'));
  }
  if (e.target.classList.contains('btn-save')) {
    const createListsContainer = document.querySelector('.create-lists-container');
    const taskListName = createListInput.value;
    const taskList = new TaskList(taskListName);
    const taskListDOMElement = taskList.createTaskListDOMElement();
    createListsContainer.firstElementChild.after(taskListDOMElement);
    taskLists.push(taskList);
    taskList.createTaskListDB();
    changePageURL(taskListName);
    updatePageState(taskListName);
    removeBox('addListBox');
    return;
  }
  if (e.target.classList.contains('ellipsis')) {
    const editTaskBox = document.getElementById('editTaskBox');
    editTaskBox.style.display = 'block';
    return editTaskBox.classList.remove('is-paused');
  }
});

createListInput.addEventListener('keyup', function(e) {
  if (this.value.length) return saveButton.removeAttribute('disabled');
  saveButton.setAttribute('disabled', true);
});

createTaskInput.addEventListener('keydown', function(e) {
  if (e.keyCode !== 13) return;
  const li = document.createElement('li');
  const i = document.createElement('i');
  const spanTaskName = document.createElement('span');
  const spanEllipsis = document.createElement('span');
  li.classList.add('active-task');
  i.classList.add('far', 'fa-square');
  spanEllipsis.classList.add('ellipsis');
  spanTaskName.setAttribute('contenteditable', 'true');
  spanTaskName.textContent = this.value;
  spanEllipsis.innerHTML = '&hellip;';
  li.appendChild(i);
  li.appendChild(spanTaskName);
  li.appendChild(spanEllipsis);
  if (taskContainer.querySelector('.active-task')) {
    taskContainer.querySelector('.active-task').classList.remove('active-task');
  }
  if (!taskContainer.querySelector('li')) {
    document.querySelector('.site-icon').style.display = 'none';
  }
  taskContainer.prepend(li);
  this.value = '';
});

taskContainer.addEventListener('click', (e) => {
  if (e.target.tagName === 'I') {
    e.target.classList.toggle('far');
    e.target.classList.toggle('fa-square');
    e.target.classList.toggle('fas');
    e.target.classList.toggle('fa-check-square');
    return;
  }
  let currentNode = e.target;
  if (currentNode.tagName !== 'SPAN') currentNode = currentNode.querySelector('span');
  currentNode.focus();
});

taskContainer.addEventListener('keydown', (e) => {
  if (e.keyCode !== 13) return;
  e.target.blur();
  createTaskInput.focus();
});

/* Init stuff to run on page load */

// When the page first loads, check to see if we need to wipe the .site-icon from the taskContainer 
if (taskContainer.querySelector('li')) {
  document.querySelector('.site-icon').style.display = 'none';
}

// sets the date in the 'Today' icon
setTodaysDate();