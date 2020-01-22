const dateSpan = document.getElementById('date');

const todaysDate = new Date().getDate();
dateSpan.textContent = todaysDate;

if (todaysDate < 10) {
  dateSpan.style.marginLeft = '2px';
}

const createListInput = document.getElementById('createList');
const createListsContainer = document.querySelector('.create-lists-container');
const saveButton = document.querySelector('.btn-save');
const addListBox = document.getElementById('addListBox');

const createTaskList = (listName) => {
  const div = document.createElement('div');
  const i = document.createElement('i');
  const span = document.createElement('span');
  i.classList.add('fas', 'fa-bars');
  span.textContent = listName;
  div.appendChild(i);
  div.appendChild(span);
  createListsContainer.firstElementChild.after(div);
};

const removeAddListBox = () => {
  addListBox.classList.remove('fade-in');
  addListBox.classList.add('fade-out');
  setTimeout(() => {
    addListBox.classList.add('is-paused');
    addListBox.classList.add('fade-in');
    addListBox.classList.remove('fade-out');
    createListInput.value = '';
    saveButton.setAttribute('disabled', true);
  }, 100);
};

document.addEventListener('click', (e) => {
  if (e.target.id === 'addListButton' || e.target.parentElement.id === 'addListButton') {
    return addListBox.classList.remove('is-paused');
  }
  if (e.target.id === 'close' || e.target.classList.contains('btn-close')) {
    return removeAddListBox();
  }
  if (e.target.classList.contains('btn-save')) {
    createTaskList(createListInput.value);
    removeAddListBox();
    return;
  }
});

createListInput.addEventListener('keyup', function(e) {
  if (this.value.length) return saveButton.removeAttribute('disabled');
  saveButton.setAttribute('disabled', true);
});