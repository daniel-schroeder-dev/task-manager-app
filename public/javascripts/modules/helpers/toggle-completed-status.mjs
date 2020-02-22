const toggleCompletedCheckbox = (checkbox) => {
  checkbox.classList.toggle('far');
  checkbox.classList.toggle('fa-square');
  checkbox.classList.toggle('fas');
  checkbox.classList.toggle('fa-check-square');
};

const toggleCompletedStatus = (checkbox, activeTaskList, completedTaskList, incompleteTaskContainer, completedTaskContainer) => {

  if (activeTaskList.name === 'Trash') return;
  
  toggleCompletedCheckbox(checkbox);

  const taskElement = checkbox.parentElement;
  const task = activeTaskList.tasks.find(task => task.element === taskElement);

  task.toggleCompletedStatus();

  if (task.completed) {
    incompleteTaskContainer.remove(task.element);
    completedTaskList.addTask(task);
    completedTaskContainer.add(task.element);
  } else {
    completedTaskContainer.remove(task.element);
    completedTaskList.removeTask(task);
    if (activeTaskList.name !== 'Completed') {
      incompleteTaskContainer.add(task.element);
    }
  }

  activeTaskList.navElement.querySelector('.num-tasks').textContent = activeTaskList.numIncompleteTasks() || '';

};

export { toggleCompletedStatus };