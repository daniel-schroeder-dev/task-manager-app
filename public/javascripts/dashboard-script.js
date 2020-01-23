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

const changePageURL = (pageName) => {
  if (window.history.state && window.history.state.pageName === pageName) return;
  const formattedPageName = pageName.toLowerCase().replace(/\s/gi, '-');
  const url = '/' + formattedPageName;
  window.history.replaceState({ pageName }, '', url);
  
};

const updatePageState = (pageName) => {
  pageTitleElement.textContent = pageName;
  pageTitleElement.nextElementSibling.setAttribute('placeholder', `Add Task to "${pageName}"`);
};

const createTaskListDOMElement = (listName) => {
  const div = document.createElement('div');
  const i = document.createElement('i');
  const span = document.createElement('span');
  const a = document.createElement('a');
  a.classList.add('task-list-nav');
  /* TODO: this happens in changePageURL as well, make it DRY */
  a.href = '/' + listName.toLowerCase().replace(/\s/gi, '-');
  span.textContent = listName;
  // fix wierd margin collapse when DOM element is added but page isn't reloaded.
  span.style.marginLeft = '4px' 
  i.classList.add('fas', 'fa-bars');
  a.appendChild(i);
  a.appendChild(span);
  div.appendChild(a);
  createListsContainer.firstElementChild.after(div);
};

const createTaskList = async (listName) => {
  createTaskListDOMElement(listName);
  
  const pageUrl = '/' + listName.toLowerCase().replace(/\s/gi, '-');
  
  const data = {
    pageUrl,
    name: listName,
  };

  const response = await fetch('/createTaskList', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  const json = await response.json();
  
  console.log('Saved taskList to DB: ', json);

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
    changePageURL(createListInput.value);
    updatePageState(createListInput.value);
    removeAddListBox();
    return;
  }
});

createListInput.addEventListener('keyup', function(e) {
  if (this.value.length) return saveButton.removeAttribute('disabled');
  saveButton.setAttribute('disabled', true);
});

