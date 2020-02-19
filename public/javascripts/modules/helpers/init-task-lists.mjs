import { TaskList } from '../task-list.mjs';
import { Task } from '../task.mjs';

/*
*   Loads TaskLists from the DB.
*/
const loadTaskLists = async () => {

  const responseTaskLists = await fetch('/taskLists');
  const taskLists = await responseTaskLists.json();

  return taskLists;

};

/*
*   Uses the taskLists loaded from the DB to create Task and TaskList objects
*   and returns an array of TaskList objects.
*/
const instantiateTasksAndTaskLists = async () => {
  return (await loadTaskLists()).map((taskList) => {
    taskList.tasks = taskList.tasks.map((task) => {
      return new Task(task.name, task.ownerId, task.description, task.completed, task._id);
    });
    return new TaskList(taskList.name, taskList.url, taskList.tasks, taskList.ownerId, taskList._id);
  });;
};

/*
*   Sets the activeTaskList global variable to the taskList that is currently
*   displayed on the page.
*/
const setActiveTaskList = (taskLists) => {

  const currentDisplayedTaskListName = document.getElementById('pageTitle').textContent;

  return taskLists.find(taskList => taskList.name === currentDisplayedTaskListName);

};

/*
*   Sets up the task.element property of the tasks in the activeTaskList to 
*   reference the DOM elements displayed on the page.
*/
const setTaskElementsInActiveTaskList = (activeTaskList) => {

  const currentDisplayedTasks = document.querySelectorAll('.task-container li');

  activeTaskList.tasks.forEach((task) => {
    task.element = Array.prototype.find.call(currentDisplayedTasks, ((taskElement) => taskElement.children[1].textContent === task.name));
  });

};

/*
*   Sets the taskList.navElement of each taskList in the global taskLists
*   array to reference the taskListNavElements in the DOM.
*/
const setTaskListNavElements = (taskLists) => {

  const taskListNavElements = document.querySelectorAll('.task-list-nav-item');

  taskLists.forEach((taskList) => {
    taskList.navElement = Array.prototype.find.call(taskListNavElements, ((taskListNavElement) => taskListNavElement.firstElementChild.lastElementChild.textContent === taskList.name));
  });

};

/*
*   1. Loads TaskLists from the DB and instantiates the appropriate TaskList 
*   and Task objects for client-side use and store in the taskLists array.
*   2. Sets the activeTaskList to the currently loaded TaskList.
*   3. Associates server-generated Task DOM elements with correct Task.element 
*   in the activeTaskList array.
*   4. Associates server-generated TaskListNav DOM elements with correct 
*   taskList.navElement.
*/
const initTaskLists = async () => {

  const taskLists = await instantiateTasksAndTaskLists();
  const activeTaskList = setActiveTaskList(taskLists);
  setTaskElementsInActiveTaskList(activeTaskList);
  setTaskListNavElements(taskLists);

  return { taskLists, activeTaskList };

};

export { initTaskLists };