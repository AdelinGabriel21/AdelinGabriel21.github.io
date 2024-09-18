let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expnese-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Load expenses from LocalStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = savedExpenses;
    loadExpenses();
});

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const description = String(descriptionInput.value);
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (description === '') {
        alert('Please enter a valid description');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    // Add the new expense to the array
    const expense = { category, description, amount, date };
    expenses.push(expense);

    // Update total amount
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    // Add the new expense to the table
    addExpenseToTable(expense);

    // Save updated expenses to LocalStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear input fields
    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

<<<<<<< HEAD
// Open the database on page load
document.addEventListener('DOMContentLoaded', openDatabase);

// Handle theme changes
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        document.body.className = theme;
    });
});
=======
// Add the expense to the table
function addExpenseToTable(expense) {
    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);

        // Update total amount
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;

        // Remove the row from the table
        expensesTableBody.removeChild(newRow);

        // Save updated expenses to LocalStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
    });

    categoryCell.textContent = expense.category;
    descriptionCell.textContent = expense.description;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
}

// Load saved expenses from LocalStorage
function loadExpenses() {
    totalAmount = 0;

    for (const expense of expenses) {
        totalAmount += expense.amount;
        totalAmountCell.textContent = totalAmount;

        // Add each expense to the table
        addExpenseToTable(expense);
    }
}
>>>>>>> parent of 5790a45 (IndexedDB)
