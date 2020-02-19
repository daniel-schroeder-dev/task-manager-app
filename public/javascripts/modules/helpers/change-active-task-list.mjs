import { toggleDumpsterIcon } from './toggle-dumpster-icon.mjs';

const siteIcon = document.getElementById('siteIcon');
const createTaskInput = document.getElementById('createTask');

/*
*   Set the page URL to the newActiveTaskList.name.
*/
const changePageURL = (newActiveTaskList, activeTaskList) => {
  
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
*   Changes the page title and placeholder for the createTaskInput to match
*   the newActiveTaskList that will be loaded.
*/
const updatePageState = (newActiveTaskList) => {

  const pageTitleHeading = document.getElementById('pageTitle');
  const pageTitleElement = document.querySelector('title');

  if (newActiveTaskList.name === 'Inbox') {
    pageTitleHeading.nextElementSibling.classList.add('hidden');
  } else {
    pageTitleHeading.nextElementSibling.classList.remove('hidden');
    pageTitleHeading.nextElementSibling.setAttribute('data-target', newActiveTaskList.name);
  }

  pageTitleHeading.textContent = newActiveTaskList.name;
  pageTitleElement.innerHTML = newActiveTaskList.name + ' &#45; Task Manager';
  pageTitleHeading.nextElementSibling.setAttribute('placeholder', `Add Task to "${newActiveTaskList.name}"`);

};

/*
*   1. Wipes the activeTaskList tasks from the DOM.
*   2. Adds all tasks in newActiveTaskList to the DOM.
*/
const updateTaskListUI = (newActiveTaskList, incompleteTaskContainer, completedTaskContainer) => {
  incompleteTaskContainer.removeAllTasks();
  completedTaskContainer.removeAllTasks();
  newActiveTaskList.populateTaskContainers(completedTaskContainer, incompleteTaskContainer);
  if (!incompleteTaskContainer.numTasks && !completedTaskContainer.numTasks) {
    siteIcon.classList.remove('hidden');
  }
};

const changeActiveTaskList = (newActiveTaskList, activeTaskList, incompleteTaskContainer, completedTaskContainer) => {
  
  changePageURL(newActiveTaskList, activeTaskList);
  updatePageState(newActiveTaskList);
  updateTaskListUI(newActiveTaskList, incompleteTaskContainer, completedTaskContainer);

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
};

export { changeActiveTaskList };