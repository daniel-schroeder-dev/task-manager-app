/*
*   Sets the date in the 'Today' icon representing tasks due today.
*/
const setTodaysDate = () => {
  
  const dateSpan = document.getElementById('date');
  const todaysDate = new Date().getDate();
  
  dateSpan.textContent = todaysDate;

  // When there is only 1 character, this will help center the date inside the calendar icon.
  if (todaysDate < 10) {
    dateSpan.style.marginLeft = '3px';
  }
  
};

export { setTodaysDate };