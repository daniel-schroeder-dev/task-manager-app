const centerCol = document.getElementById('centerCol');

/*
*   Sets the .active-task to the Task represented by clickedElement.
*/
const setActiveTask = (clickedElement) => {
  
  const taskElement = clickedElement.tagName === 'LI' ? clickedElement : clickedElement.parentElement;

  if (centerCol.querySelector('.active-task')) {
    centerCol.querySelector('.active-task').classList.remove('active-task');
  }

  taskElement.classList.add('active-task');

};

export { setActiveTask };