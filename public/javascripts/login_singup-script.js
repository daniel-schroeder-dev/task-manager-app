let lastActive = {};

document.addEventListener('focusin', function(e) {
  if (e.target.type === 'submit' || e.target.tagName === 'A') return;
  lastActive = e.target.previousElementSibling.firstChild;
  lastActive.classList.add('active');
});

document.addEventListener('focusout', function(e) {
  if (!lastActive.classList) return;
  lastActive.classList.remove('active');
});