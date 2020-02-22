import { DialogBox } from './modules/dialog-box.mjs';
import { TaskContainer } from './modules/task-container.mjs';
import { Task } from './modules/task.mjs';
import { TaskList } from './modules/task-list.mjs';
import { setTodaysDate, toggleDumpsterIcon, initTaskLists, changeActiveTaskList, setActiveTask, toggleCaretIcon, toggleCompletedStatus } from './modules/helpers.mjs';

let taskLists = [];
let trashTaskList = {};

const dialogBoxes = [];
const ENTER_KEYCODE = 13;

const leftCol = document.getElementById('leftCol');
const centerCol = document.getElementById('centerCol');

const taskListNavContainer = document.getElementById('taskListNavContainer');

const incompleteTaskContainer = new TaskContainer(document.getElementById('incompleteTaskContainer'));
const completedTaskContainer = new TaskContainer(document.getElementById('completedTaskContainer'));

const listsHeading = document.getElementById('listsHeading');

const completedTaskToggle = document.getElementById('completedTaskToggle');
const siteIcon = document.getElementById('siteIcon');

const createListInput = document.getElementById('createList');
const createTaskInput = document.getElementById('createTask');

const addListDialogBox = new DialogBox(document.getElementById('addListDialogBox'));
const editTaskListDialogBox = new DialogBox(document.getElementById('editTaskListDialogBox'));
const editTaskDialogBox = new DialogBox(document.getElementById('editTaskDialogBox'));
const clearTrashDialogBox = new DialogBox(document.getElementById('clearTrashDialogBox'));

dialogBoxes.push(addListDialogBox);
dialogBoxes.push(editTaskListDialogBox);
dialogBoxes.push(editTaskDialogBox);
dialogBoxes.push(clearTrashDialogBox);

const addListButton = document.getElementById('addListButton');
const saveListButton = document.querySelector('#addListDialogBox .btn-save');


/********************* Event Listeners ***********************/

/*
*   Allows the browser's 'back' button to function correctly.
*/
window.onpopstate = (e) => {
  const newActiveTaskList = taskLists.find(taskList => taskList.url === window.location.pathname);
  changeActiveTaskList(newActiveTaskList, TaskList.activeTaskList, incompleteTaskContainer, completedTaskContainer);
  TaskList.activeTaskList = newActiveTaskList;
};

/*
*   This listener will perform ONE of the following options on 'click':
*
*     a.) Closes a dialogBox.
*
*     b.) Shows a dialogBox when the ellipsis is clicked.
*
*     c.) Shows a dialogBox when the dumpsterIcon is clicked.
*/
document.addEventListener('click', (e) => {

  /*
  *   Close a dialogBox.
  */
  if (e.target.dataset.triggerClose) {
    
    const dialogBox = dialogBoxes.find(dialogBox => dialogBox.element.id === e.target.dataset.triggerClose);
    
    dialogBox.hideDialogBox();
    
    return;
  }

  /*
  *   Show the correct type of dialogBox based on the data-trigger attribute.
  */
  if (e.target.dataset.triggerOpen) {
    
    if (e.target.dataset.triggerOpen === 'editTaskListDialogBox') {

      editTaskListDialogBox.showDialogBox();

      const taskList = taskLists.find(taskList => {
        return taskList.name === e.target.dataset.target;
      });

      editTaskListDialogBox.taskList = taskList;

    } else if (e.target.dataset.triggerOpen === 'editTaskDialogBox') {

      editTaskDialogBox.showDialogBox();

      const task = TaskList.activeTaskList.tasks.find((task) => {
        return task.element === e.target.parentElement;
      });

      editTaskDialogBox.task = task;

    }

    return;

  }

  /*
  *   Show the clearTrashDialogBox.
  */
  if (e.target.id === 'dumpsterIcon' || e.target.parentElement.id === 'dumpsterIcon') {

    clearTrashDialogBox.showDialogBox();

    return;

  }

});

/*
*   Show the addListDialogBox when the addListButton is clicked and give the 
*   createListInput focus.
*/
addListButton.addEventListener('click', () => {
  addListDialogBox.showDialogBox();
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
  *   Toggles the completed status of a Task, changing the checkbox icon, 
  *   taskContainer, and completed status on the Task object.
  */
  if (e.target.tagName === 'I' && e.target.parentElement !== completedTaskToggle) {
    const completedTaskList = taskLists.find((taskList) => {
      return taskList.name === 'Completed';
    });
    toggleCompletedStatus(e.target, TaskList.activeTaskList, completedTaskList, incompleteTaskContainer, completedTaskContainer);
    return;
  }

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
    return document.querySelector('#addListDialogBox .btn-save').click();
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

  const task = new Task(this.value, TaskList.activeTaskList._id);

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

  TaskList.activeTaskList.addTask(task);
  
  TaskList.activeTaskList.navElement.querySelector('.num-tasks').textContent = TaskList.activeTaskList.numIncompleteTasks();
  
  this.value = '';

});

editTaskDialogBox.element.addEventListener('click', function(e) {

  if (e.target.classList.contains('btn-delete')) {
    
    const taskToRemove = editTaskDialogBox.task;

    taskToRemove.element.remove();

    const taskOwner = taskLists.find((taskList) => taskList._id === taskToRemove.ownerId);

    taskOwner.removeTask(taskToRemove);

    if (taskToRemove.completed) {
      const completedTaskList = taskLists.find((taskList) => {
        return taskList.name === 'Completed';
      });
      completedTaskList.removeTask(taskToRemove);
      completedTaskList.navElement.querySelector('.num-tasks').textContent = completedTaskList.tasks.length || '';
    }

    trashTaskList.addTask(taskToRemove);

    taskOwner.navElement.querySelector('.num-tasks').textContent = taskOwner.numIncompleteTasks() || '';
    trashTaskList.navElement.querySelector('.num-tasks').textContent = trashTaskList.tasks.length;
    
    editTaskDialogBox.hideDialogBox();

    return;
  }

});

editTaskListDialogBox.element.addEventListener('click', async function(e) {

  if (e.target.classList.contains('btn-delete')) {

    taskLists = taskLists.filter(taskList => taskList.name !== editTaskListDialogBox.taskList.name);

    const completedTasks = editTaskListDialogBox.taskList.tasks.filter(task => task.completed);

    const completedTaskList = taskLists.find((taskList) => {
        return taskList.name === 'Completed';
    });

    editTaskListDialogBox.taskList.navElement.remove();

    completedTasks.forEach(task => completedTaskList.removeTask(task));

    const res = await editTaskListDialogBox.taskList.delete();
    editTaskListDialogBox.hideDialogBox();
    document.querySelector('.task-list-nav-item a[href="/inbox"]').click();
  }

});

clearTrashDialogBox.element.addEventListener('click', function(e) {

  if (e.target.classList.contains('btn-delete')) {
    trashTaskList.clearTrash();
    clearTrashDialogBox.hideDialogBox();
  }

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
  
  addListDialogBox.hideDialogBox();
  
  changeActiveTaskList(newActiveTaskList, TaskList.activeTaskList, incompleteTaskContainer, completedTaskContainer);

  TaskList.activeTaskList = newActiveTaskList;

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

  changeActiveTaskList(newActiveTaskList, TaskList.activeTaskList, incompleteTaskContainer, completedTaskContainer);

  TaskList.activeTaskList = newActiveTaskList;

});

/************************** Init Page Load ************************/

if (window.location.pathname === '/trash') {
  centerCol.querySelectorAll('li i').forEach(i => i.classList.add('not-allowed'));
  toggleDumpsterIcon();
}

if (incompleteTaskContainer.element.querySelector('li')) {
  incompleteTaskContainer.element.firstElementChild.classList.add('active-task');
}

createTaskInput.focus();

/*
*   Sets the date in the 'Today' icon representing tasks due today.
*/
setTodaysDate();

/*
*   Loads TaskLists from the DB and instantiates the appropriate TaskList and 
*   Task objects for client-side use. Stores all TaskLists in the taskLists 
*   array.
*/
initTaskLists().then((results) => {
  
  taskLists = results.taskLists;
  TaskList.activeTaskList = results.activeTaskList;

  /**************** Special Object Properties *******************/

  trashTaskList = taskLists.find(taskList => taskList.name === 'Trash');

  trashTaskList.clearTrash = async function() {
    
    siteIcon.classList.remove('hidden');
    completedTaskToggle.classList.add('hidden');
    
    this.tasks.forEach(task => task.element.remove());

    const response = await fetch(`/taskLists/${this._id}/tasks`, {
      method: 'DELETE',
    });

    const taskList = await response.json();

  };
});



