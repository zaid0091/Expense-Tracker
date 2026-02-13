
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

// HTML elements ko get karna
// yahan hum HTML ke elements ko JavaScript ke sath connect kar rahe hain
var typeSelect = document.getElementById("expense-type");        // income ya expense select karne ka dropdown
var categorySelect = document.getElementById("expense-category"); // category select karne ka dropdown
var amountInput = document.getElementById("expense-amount");     // amount likhne ka input
var dateInput = document.getElementById("date");                 // date select karne ka input
var createBtn = document.getElementById("create");               // transaction add karne ka button

var balanceDisplay = document.getElementById("expense-tracker-amount"); // total balance show karne ke liye
var incomeDisplay = document.getElementById("income-amount");           // total income show karne ke liye
var expenseDisplay = document.getElementById("total-expense-display");  // total expense show karne ke liye

var incContainer = document.getElementById("income-list-container");   // income ki list dikhane ka container
var expContainer = document.getElementById("expense-list-container");  // expense ki list dikhane ka container

// yeh array sari transactions ko store karegi
var transactions = [];

// localStorage se data load karna
// page reload hone par purani saved transactions wapas lane ke liye
function loadFromLocalStorage() {
    var data = localStorage.getItem("transactions"); // localStorage se data lena
    if (data) {
        transactions = JSON.parse(data); // string ko array/object mein convert karna
    }
}

// localStorage mein data save karna
// jab bhi nayi transaction add ya delete ho
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions)); // array ko string bana kar save karna
}

// jab user income ya expense select kare
// uske hisaab se category dropdown change hoga
typeSelect.onchange = function () {
    var selectedType = typeSelect.value; // selected type (income ya expense)
    categorySelect.innerHTML = '<option value="">Select category</option>'; // purani categories clear karna

    // agar selected type ki categories mojood na hon to kuch na karo
    if (!categories[selectedType]) {
        return;
    }

    // selected type ki sari categories dropdown mein add karna
    for (var i = 0; i < categories[selectedType].length; i++) {
        var option = document.createElement("option"); // naya option banana
        option.value = categories[selectedType][i].value; // option ki value set karna
        option.innerText = categories[selectedType][i].text; // option ka text set karna
        categorySelect.appendChild(option); // dropdown mein option add karna
    }
};

// create button click par transaction add karna
createBtn.onclick = function () {
    var type = typeSelect.value; // income ya expense
    var category = categorySelect.options[categorySelect.selectedIndex]?.text; // selected category ka naam
    var amount = Number(amountInput.value); // amount ko number mein convert karna
    var date = dateInput.value; // selected date

    // simple validation
    // agar koi field khali ho to alert show karo
    if (type === "" || category === "" || amount === 0 || date === "") {
        alert("Please fill in all fields");
        return;
    }

    // nayi transaction ka object banana
    var transaction = {
        id: Date.now(), // unique id
        type: type,     // income ya expense
        category: category, // category ka naam
        amount: amount,     // amount
        date: date          // date
    };

    transactions.push(transaction); // transaction array mein add karna
    saveToLocalStorage();            // localStorage mein save karna
    updateUI();                      // screen ko update karna
    clearInputs();                   // input fields clear karna
};

// UI update karna
// income, expense aur balance screen par show karna
function updateUI() {
    incContainer.innerHTML = ""; // purani income list clear
    expContainer.innerHTML = ""; // purani expense list clear

    var totalIncome = 0;  // total income store karne ke liye
    var totalExpense = 0; // total expense store karne ke liye

    // sari transactions par loop chalana
    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i]; // current transaction

        // transaction ka HTML banana
        var itemHtml =
            '<div class="history-item ' + (t.type === "income" ? "income-style" : "expense-style") + '">' +
            '<div>' +
            '<strong>' + t.category + '</strong><br>' +
            '<small>' + t.date + '</small>' +
            '</div>' +
            '<span>$' + t.amount.toFixed(2) + '</span>' +
            '<button onclick="deleteTransaction(' + t.id + ')">&times;</button>' +
            '</div>';

        // agar income ho to income list mein add karo
        if (t.type === "income") {
            totalIncome += t.amount; // income add karna
            incContainer.innerHTML += itemHtml; // income list mein show karna
        }
        // warna expense list mein add karo
        else {
            totalExpense += t.amount; // expense add karna
            expContainer.innerHTML += itemHtml; // expense list mein show karna
        }
    }

    // total balance calculate karna
    var totalBalance = totalIncome - totalExpense;
    balanceDisplay.innerText = "Total Balance: $" + totalBalance.toFixed(2); // balance show
    incomeDisplay.innerText = "$" + totalIncome.toFixed(2); // total income show
    expenseDisplay.innerText = "$" + totalExpense.toFixed(2); // total expense show
}

// transaction delete karna
// jab user delete button dabaye
function deleteTransaction(id) {
    var newArray = []; // nayi array banana

    // sari transactions check karna
    for (var i = 0; i < transactions.length; i++) {
        // jis id wali transaction delete karni ho usko skip kar do
        if (transactions[i].id !== id) {
            newArray.push(transactions[i]);
        }
    }

    transactions = newArray; // updated array set karna
    saveToLocalStorage();    // localStorage update
    updateUI();              // screen refresh
}

// inputs clear karna
// transaction add hone ke baad fields empty karna
function clearInputs() {
    amountInput.value = ""; // amount clear
    dateInput.value = "";   // date clear
    typeSelect.value = "";  // type reset
    categorySelect.innerHTML = '<option value="">Select category</option>'; // category reset
}

// page load par data load aur UI update
// taake purani saved transactions show ho jayein
loadFromLocalStorage();
updateUI();
