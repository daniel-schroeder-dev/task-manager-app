const months = [
  'January',
  'Februray',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function buildCalendar(currentDate) {
  
  const days = [];

  const currentMonth = currentDate;
  const previousMonth = new Date();

  currentMonth.setDate(1);

  previousMonth.setMonth(currentMonth.getMonth() - 1);
  previousMonth.setDate(1);

  const previousMonthNum = previousMonth.getMonth();
  let daysInPreviousMonth = 1;

  while (previousMonth.getMonth() === previousMonthNum) {
    previousMonth.setDate(++daysInPreviousMonth);
  }
  // the number of days in the previous month is now correct;
  --daysInPreviousMonth;

  let daysToDisplayFromPreviousMonth = currentMonth.getDay();

  // reset the previousMonth to the correct month
  previousMonth.setMonth(currentMonth.getMonth() - 1);

  // pull the number of days we need from the previous month
  while (daysToDisplayFromPreviousMonth--) {
    previousMonth.setDate(daysInPreviousMonth--);
    days.unshift({ date: previousMonth.getDate(), monthDisplay: 'previous' });
  }

  const currentMonthNum = currentMonth.getMonth();
  while (currentMonth.getMonth() === currentMonthNum) {
    days.push({ date: currentMonth.getDate(), monthDisplay: 'current', month: currentMonth.getMonth() });
    currentMonth.setDate(currentMonth.getDate() + 1);
  }

  currentMonth.setDate(currentMonth.getDate() - 1);

  let LAST_DAY_OF_WEEK = 6;
  let DAYS_IN_WEEK = 7;
  let daysInNextMonthToAdd = LAST_DAY_OF_WEEK - currentMonth.getDay() + DAYS_IN_WEEK;

  const nextMonth = new Date();

  nextMonth.setMonth(currentMonth.getMonth() + 1);
  nextMonth.setDate(1);

  while (daysInNextMonthToAdd--) {
    days.push({ date: nextMonth.getDate(), monthDisplay: 'next' });
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';

  let weekElement = null;
  
  days.forEach((day, i) => {
  
    if (!(i % 7)) {
      if (weekElement) tbody.appendChild(weekElement);
      weekElement = document.createElement('tr');
    }
  
    let td = document.createElement('td');
  
    td.textContent = day.date;
  
    if (day.monthDisplay !== 'current') {
      td.classList.add('grey-out');
    }
    
    if (day.date === new Date().getDate() && day.month === new Date().getMonth()) {
      td.classList.add('current-date');
    }
  
    weekElement.appendChild(td);
  
    if (i === days.length - 1) {
      tbody.appendChild(weekElement);
    }
  
  });

  const monthSpan = document.querySelector('#calendarNav span:first-of-type');
  const yearSpan = document.querySelector('#calendarNav span:last-of-type');

  monthSpan.textContent = months[currentMonth.getMonth()];
  yearSpan.textContent = currentMonth.getFullYear();

  return currentMonth.getMonth();

}

export { buildCalendar };