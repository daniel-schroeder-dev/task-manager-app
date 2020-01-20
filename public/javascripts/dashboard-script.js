const dateSpan = document.getElementById('date');

const todaysDate = new Date().getDate();
dateSpan.textContent = todaysDate;

if (todaysDate < 10) {
  dateSpan.style.marginLeft = '2px';
}

const addListButton = document.getElementById('addListButton');
const addListBox = document.getElementById('addListBox');

addListButton.addEventListener('click', () => {
  addListBox.classList.remove('is-paused');
  // addListBox.style.height = '500px';
});