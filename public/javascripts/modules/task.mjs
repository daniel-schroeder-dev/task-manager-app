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
  spanEllipsis.dataset.trigger = 'taskDialogBox';
  
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