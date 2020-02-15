const toggleDumpsterIcon = () => {
  const pageTitleContainerSpanElements = document.querySelectorAll('.page-title-container span');
  pageTitleContainerSpanElements.forEach(element => element.classList.toggle('hidden'));
};

export { toggleDumpsterIcon };