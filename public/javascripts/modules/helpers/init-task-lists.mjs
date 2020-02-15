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

  taskLists = await instantiateTasksAndTaskLists();
  setActiveTaskList();
  setTaskElementsInActiveTaskList();
  setTaskListNavElements();

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

};

export { initTaskLists };