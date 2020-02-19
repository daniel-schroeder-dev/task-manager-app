const toggleDumpsterIcon = () => {
  const dumpsterIcon = document.getElementById('clearTrash');
  dumpsterIcon.classList.toggle('hidden');
};

export { toggleDumpsterIcon };