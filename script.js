const categories = {
    income: [
        { value: "business", text: "Business" },
        { value: "investments", text: "Investments" },
        { value: "extra", text: "Extra Income" },
        { value: "deposits", text: "Deposit" },
        { value: "lottery", text: "Lottery" },
        { value: "gifts", text: "Gifts" },
        { value: "salary", text: "Salary" },
        { value: "savings", text: "Savings" },
        { value: "rental", text: "Rental Income" },
    ],
    expense: [
        { value: "bill", text: "Bills" },
        { value: "car", text: "Car" },
        { value: "cloth", text: "Clothes" },
        { value: "travel", text: "Travel" },
        { value: "food", text: "Food" },
        { value: "shopping", text: "Shopping" },
        { value: "house", text: "House" },
        { value: "entertainment", text: "Entertainment" },
        { value: "phone", text: "Phone" },
        { value: "pets", text: "Pets" },
        { value: "other", text: "Other" },
    ]
};

const typeSelect = document.getElementById("expense-type");
const categorySelect = document.getElementById("expense-category");
const amountInput = document.getElementById("expense-amount");
const dateInput = document.getElementById("date");
const createBtn = document.getElementById("create");
const balanceDisplay = document.getElementById("expense-tracker-amount");
const incomeDisplay = document.getElementById("income-amount");
const expenseDisplay = document.getElementById("total-expense-display");

const incContainer = document.getElementById("income-list-container");
const expContainer = document.getElementById("expense-list-container");

let transactions = [];

// Load transactions
function loadFromLocalStorage() {
    const stored = localStorage.getItem("transactions");
    if (stored) transactions = JSON.parse(stored);
}

// Save transactions
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Dynamic category dropdown
typeSelect.addEventListener("change", () => {
    const selectedType = typeSelect.value;
    categorySelect.innerHTML = '<option value="">Select category</option>';
    if (!categories[selectedType]) return;
    categories[selectedType].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.text;
        categorySelect.appendChild(option);
    });
});

// Create transaction
createBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const category = categorySelect.options[categorySelect.selectedIndex]?.text;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (!type || !category || isNaN(amount) || !date) {
        alert("Please fill in all fields");
        return;
    }

    const transaction = { id: Date.now(), type, category, amount, date };
    transactions.push(transaction);
    saveToLocalStorage();
    updateUI();
    clearInputs();
});

// Update UI
function updateUI() {
    // Clear previous items
    incContainer.innerHTML = "";
    expContainer.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    // Populate containers
    transactions.forEach(t => {
        const itemHtml = `
            <div class="history-item ${t.type === 'income' ? 'income-style' : 'expense-style'}">
                <div>
                    <strong>${t.category}</strong><br>
                    <small>${t.date}</small>
                </div>
                <span>$${t.amount.toFixed(2)}</span>
                <button onclick="deleteTransaction(${t.id})">&times;</button>
            </div>
        `;
        if (t.type === "income") {
            totalIncome += t.amount;
            incContainer.insertAdjacentHTML('beforeend', itemHtml);
        } else {
            totalExpense += t.amount;
            expContainer.insertAdjacentHTML('beforeend', itemHtml);
        }
    });

    // Update totals
    const totalBalance = totalIncome - totalExpense;
    balanceDisplay.textContent = `Total Balance: $${totalBalance.toFixed(2)}`;
    incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    updateUI();
}

// Clear inputs
function clearInputs() {
    amountInput.value = "";
    dateInput.value = "";
    typeSelect.value = "";
    categorySelect.innerHTML = '<option value="">Select category</option>';
}

// Initialize
loadFromLocalStorage();
updateUI();
