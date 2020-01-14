const loginButton = document.querySelector('.login');
const signupButton = document.querySelector('.signup');

loginButton.addEventListener('click', () => {
  window.location = '/login';
});

signupButton.addEventListener('click', () => {
  window.location = '/signup';
});