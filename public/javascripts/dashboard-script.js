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
const pageTitleElement = document.getElementById('pageTitle');

const changePageURL = async (pageName) => {
  if (window.history.state && window.history.state.pageName === pageName) return;
  const formattedPageName = pageName.toLowerCase().replace(/\s/gi, '-');
  const url = '/' + formattedPageName;
  window.history.replaceState({ pageName }, '', url);
  /* TODO: fetch the task data from the server here */
  //   const response = await fetch(url);
  //   const pageData = await response.json();
};

const updatePageState = (pageName) => {
  pageTitleElement.textContent = pageName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${pageName}"`);
};

const createTaskList = (listName) => {
  const div = document.createElement('div');
  const i = document.createElement('i');
  const span = document.createElement('span');
  const a = document.createElement('a');
  a.classList.add('task-list-nav');
  /* TODO: this happens in changePageURL as well, make it DRY */
  a.href = '/' + listName.toLowerCase().replace(/\s/gi, '-');
  a.textContent = listName;
  i.classList.add('fas', 'fa-bars');
  span.appendChild(a);
  div.appendChild(i);
  div.appendChild(span);
  createListsContainer.firstElementChild.after(div);
  changePageURL(listName);
  updatePageState(listName);
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

