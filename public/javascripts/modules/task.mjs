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
  
  this.element.classList.remove('active-task');
  
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

export { Task };