/*****************************/
/******* TaskContainer *******/
/*****************************/

const completedTaskToggle = document.getElementById('completedTaskToggle');

function TaskContainer(element) {
  this.element = element;
  this.numTasks = 0;
};

TaskContainer.prototype.add = function(element) {
  siteIcon.classList.add('hidden');
  this.element.prepend(element);
  this.numTasks++;
  if (this.element.id === 'completedTaskContainer') {
    completedTaskToggle.classList.remove('hidden');
  }
};

TaskContainer.prototype.remove = function(element) {
  element.remove();
  this.numTasks--;
  if (this.element.id === 'completedTaskContainer' && !this.numTasks) {
    completedTaskToggle.classList.add('hidden');
  }
};

TaskContainer.prototype.removeAllTasks = function() {
  while (this.element.hasChildNodes()) {
    this.element.removeChild(this.element.firstChild);
  }
  this.numTasks = 0;
  if (this.element.id === 'completedTaskContainer') {
    completedTaskToggle.classList.add('hidden');
  }
};

export { TaskContainer };