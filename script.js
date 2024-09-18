let db;
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expnese-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Open (or create) IndexedDB database
function openDatabase() {
    let request = indexedDB.open("ExpensesDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        let objectStore = db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("category", "category", { unique: false });
        objectStore.createIndex("description", "description", { unique: false });
        objectStore.createIndex("amount", "amount", { unique: false });
        objectStore.createIndex("date", "date", { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadExpenses();
    };

    request.onerror = function(event) {
        console.error("Database error: " + event.target.errorCode);
    };
}

// Add expense to IndexedDB
function addExpenseToDatabase(expense) {
    let transaction = db.transaction(["expenses"], "readwrite");
    let objectStore = transaction.objectStore("expenses");

    let request = objectStore.add(expense);
    request.onsuccess = function() {
        console.log("Expense added to the database");
    };
    request.onerror = function(event) {
        console.error("Unable to add expense", event.target.errorCode);
    };
}

// Load expenses from IndexedDB
function loadExpenses() {
    totalAmount = 0;
    let transaction = db.transaction(["expenses"], "readonly");
    let objectStore = transaction.objectStore("expenses");

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            const expense = cursor.value;
            totalAmount += expense.amount;
            totalAmountCell.textContent = totalAmount;

            addExpenseToTable(expense);
            cursor.continue();
        }
    };
}

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
        deleteExpenseFromDatabase(expense.id, newRow, expense.amount);
    });

    categoryCell.textContent = expense.category;
    descriptionCell.textContent = expense.description;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
}

// Delete expense from IndexedDB and the table
function deleteExpenseFromDatabase(expenseId, rowElement, amount) {
    let transaction = db.transaction(["expenses"], "readwrite");
    let objectStore = transaction.objectStore("expenses");

    let request = objectStore.delete(expenseId);
    request.onsuccess = function() {
        console.log("Expense removed from database");
        totalAmount -= amount;
        totalAmountCell.textContent = totalAmount;
        expensesTableBody.removeChild(rowElement);
    };
    request.onerror = function(event) {
        console.error("Error removing expense", event.target.errorCode);
    };
}

// Add a new expense
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

    // Create expense object
    const expense = { category, description, amount, date };

    // Add to the database and table
    addExpenseToDatabase(expense);
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Open the database on page load
document.addEventListener('DOMContentLoaded', openDatabase);
