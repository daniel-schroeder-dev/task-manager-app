let lastActive = {};

document.addEventListener('focusin', function(e) {
  if (e.target.type === 'submit') return;
  lastActive = e.target.previousElementSibling.firstChild;
  lastActive.classList.add('active');
});

document.addEventListener('focusout', function(e) {
  lastActive.classList.remove('active');
});