const dateSpan = document.getElementById('date');

const todaysDate = new Date().getDate();
dateSpan.textContent = todaysDate;

if (todaysDate < 10) {
  dateSpan.style.marginLeft = '2px';
}

const addListBox = document.getElementById('addListBox');

document.addEventListener('click', (e) => {
  if (e.target.id === 'addListButton' || e.target.parentElement.id === 'addListButton') {
    return addListBox.classList.remove('is-paused');
  }
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    addListBox.classList.remove('fade-in');
    addListBox.classList.add('fade-out');
    return setTimeout(() => {
      addListBox.classList.add('is-paused');
      addListBox.classList.add('fade-in');
      addListBox.classList.remove('fade-out');
    }, 100);
  }
});