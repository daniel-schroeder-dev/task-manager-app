# Task Manager App

A simple task management app.

## Project Goals

This project is meant to showcase some skills I've learned over the past 6 months while taking courses on NodeJS development. The back-end will use Node/Express/MongoDB, and the front-end will use JS/CSS/HTML, with no frameworks. 

There will be four sections to the app:

1. Splash page that shows features of the app
2. Simple user signup/login page
3. Task manangement dashboard
4. User profile page

The task management dashboard will allow the user to:

1. Group related tasks into lists.
2. View tasks that are due today.
3. View tasks that are due in the next 7 days.
4. View completed tasks.
5. View deleted tasks.

The main workflow for a user should be:

Task Creation:

- Create a task
  - Add a description
  - Add a due date
  - Add the task to a list (will be stored in 'Inbox' by default)

Mark Task Complete:

- Mark a task as complete
  - Task will be stored in 'Completed' folder, and in a 'Completed' section of the list. The 'Today' and 'Next 7 Days' folders will also show the completed tasks.
- Delete task
  - This adds the task to the trash
  - Can then optionally restore or completely remove the task

Task Update: 

- Can change any of the attributes of a task:
  - Description
  - Due date
  - List
  - Completed status
  - Deleted status

## Caveats

As this is just a simple project app for my portfolio, I won't be focusing on certain aspects, such as:

1. Mobile-friendly/Mobile-first
  - I've done this with client sites, and while essential for any real app, the time it would take to do so in this app isn't worth it for me.
2. Extensive error-handling/testing
  - I will have some minimal error-handling and testing (through Postman) built-in, but nothing like what I would have in a real app.
3. Cross-browser compatibility
  - I'm just going to target the latest version of Google Chrome. The time trade-off for cross-browser testing isn't worth it for this app.


