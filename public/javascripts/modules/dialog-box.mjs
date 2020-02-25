/*************************/
/******* DialogBox *******/
/*************************/

function DialogBox(element) {
  this.element = element;
};

/*
*   Removes the box with boxID from the DOM and resets the state of the box.
*/
DialogBox.prototype.hideDialogBox = function() {
  
  this.element.classList.remove('fade-in');
  this.element.classList.add('fade-out');

  this.isActive = false;
  
  /*

  *** RESEARCH ***
  
  I honestly don't understand why I need this setTimeout() call to get this 
  fade-in/fade-out animation to work, but it was the only thing I tried that 
  worked so I'm using it. I'm not sure if the issue is the animation itself, 
  or the way in which I'm triggering it. I have a vague understanding that 
  setTimeout() will run this code in a different portion of the event loop, 
  but I really need to understand this concept deeply if I'm going to use it 
  in my code.

  */

  /* 
  *   This is neccessary to give the fade-out animation time to run before 
  *   adding back the .fade-in and .is-paused classes.
  */
  setTimeout(() => {

    this.element.classList.add('is-paused');
    this.element.classList.add('fade-in');
    this.element.classList.remove('fade-out');
    
    this.element.style.display = 'none';
    
    if (this.element.id === 'addListDialogBox') {
      document.getElementById('createList').value = '';
    }
    
  }, 100);

};

DialogBox.prototype.showDialogBox = function() {
  this.element.style.display = 'block';
  this.element.classList.remove('is-paused');
  this.isActive = true;
};

export { DialogBox };