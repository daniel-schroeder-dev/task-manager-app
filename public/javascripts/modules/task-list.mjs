/************************/
/******* TaskList *******/
/************************/

const completedTaskToggle = document.getElementById('completedTaskToggle');
const siteIcon = document.getElementById('siteIcon');

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
  const ellipsis = document.createElement('span');

  this.navElement.classList.add('task-list-nav-item');
  
  a.classList.add('task-list-nav');
  a.href = this.url;

  span.textContent = this.name;

  // Fix wierd margin collapse when DOM element is added but page isn't reloaded.
  span.style.marginLeft = '4px' 

  i.classList.add('fas', 'fa-bars');

  ellipsis.classList.add('ellipsis', 'hidden');
  ellipsis.innerHTML = '&#8230;';
  ellipsis.dataset.triggerOpen = 'editTaskListDialogBox';

  a.appendChild(i);
  a.appendChild(span);
  this.navElement.appendChild(a);
  this.navElement.appendChild(ellipsis);

};

TaskList.prototype.delete = async function() {

  const response = await fetch(`/taskLists/${this._id}`, {
    method: 'DELETE',
  });

  const taskList = await response.json();

  console.log(taskList);

};

TaskList.prototype.populateTaskContainers = function(completedTaskContainer, incompleteTaskContainer) {
  this.tasks.forEach((task, i) => {
    if (this.name === 'Trash') {
      task.element.querySelector('i').classList.add('not-allowed');
    }
    if (task.completed) {
      completedTaskContainer.add(task.element);
    } else {
      incompleteTaskContainer.add(task.element);
    }
  });
  if (incompleteTaskContainer.element.querySelector('li')) {
    incompleteTaskContainer.element.firstElementChild.classList.add('active-task');
  }
};

TaskList.prototype.removeTask = async function(taskToRemove) {

  this.tasks = this.tasks.filter(task => task !== taskToRemove);

  if (this === TaskList.activeTaskList && !this.tasks.length) {
    siteIcon.classList.remove('hidden');
    completedTaskToggle.classList.add('hidden');
  }
  
  const response = await fetch(`/taskLists/${this._id}/tasks/${taskToRemove._id}`, {
    method: 'DELETE',
  });

  const taskList = await response.json();

};

export { TaskList };