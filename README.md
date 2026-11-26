EXPENSE TRACKER WEBSITE
=======================
Author: Nitin Kumar
Email: 2630btech2106@kiet.edu
Project type: Project 2 (Mini Website Project, Option 7)

ABOUT
-----
An expense management web app to record income and expenses,
categorise transactions, calculate balances and view a spending
summary. It is built with HTML, CSS and JavaScript only. No
frameworks, libraries or backend are used.

HOW TO RUN
----------
Open index.html in any modern browser (Chrome, Edge, Firefox, Safari).
No installation is required.

FILES
-----
index.html    Page structure
style.css     Styling, layout, light/dark themes, responsive rules
script.js     App logic, data storage and rendering

FEATURES
--------
- Add, edit and delete transactions (income or expense)
- Categories: Food, Transport, Shopping, Bills, Health, Education,
  Entertainment, Salary, Other
- Automatic calculation of balance, total income and total expenses
- Search by description
- Filters by type, category and month
- Spending-by-category summary chart (percentage of expenses)
- Monthly budget limit with a progress bar that turns red when the
  budget is exceeded
- Form validation (description, amount greater than 0, date)
- Light/dark theme (choice is remembered)
- Responsive layout for mobile, tablet and desktop

DATA STORAGE
------------
All data is saved in the browser using localStorage, so
transactions and budgets stay after the page is reloaded or the
browser is closed. Data stays on the user's own device. Clearing
the browser's site data will delete the records.

HOW TO USE
----------
1. Choose Expense or Income.
2. Enter a description, amount, date and category.
3. Click "Add transaction".
4. Use Edit or Delete next to any transaction to change it.
5. Use the search box and filters to find transactions.
6. Enter a monthly budget to track spending against it.

TECHNOLOGIES
------------
HTML5, CSS3 (Grid, Flexbox, CSS variables, media queries),
JavaScript (ES6, DOM manipulation, localStorage, Intl number and
date formatting)
