const setToggleIcon = (clickedElement) => {
  
  let toggleIcon = '';

  if (clickedElement.tagName === 'I') {
    toggleIcon = clickedElement;
  } else if (clickedElement.id === 'completedTaskToggle') {
    toggleIcon = clickedElement.querySelector('i');
  } else {
    toggleIcon = clickedElement.previousElementSibling;
  }

  return toggleIcon;

};

const toggleCaretIcon = (clickedElement) => {
  
  const toggleIcon = setToggleIcon(clickedElement);

  toggleIcon.classList.toggle('fa-caret-down');
  toggleIcon.classList.toggle('fa-caret-right');

};

export { toggleCaretIcon };