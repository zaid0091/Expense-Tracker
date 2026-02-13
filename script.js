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


let typeSelect = document.getElementById("expense-type");
let categorySelect = document.getElementById("expense-category");
let amountInput = document.getElementById("expense-amount");
let dateInput = document.getElementById("date");
let createBtn = document.getElementById("create");

let balanceDisplay = document.getElementById("expense-tracker-amount");
let incomeDisplay = document.getElementById("income-amount");
let expenseDisplay = document.getElementById("total-expense-display");

let incContainer = document.getElementById("income-list-container");
let expContainer = document.getElementById("expense-list-container");

//ye array sari transactions ko store karegi
let transactions = [];

//1) localStorage se data load karna
function loadFromLocalStorage() {
    let data = localStorage.getItem("transactions");
    if (data) {
        transactions = JSON.parse(data); //string ko array/object mein convert karna
    }
}

//2) localStorage mein data save karna
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions)); //array ko string bana kar save karna
}

//3) jab user income ya expense select kare, uske hisaab se category dropdown change hoga
typeSelect.onchange = function () {
    let selectedType = typeSelect.value; //selected type (income ya expense)
    categorySelect.innerHTML = '<option value="">Select category</option>';

    if (!categories[selectedType]) {
        return;
    }

    //selected type ki sari categories dropdown mein add karna
    for (let i = 0; i < categories[selectedType].length; i++) {
        let option = document.createElement("option"); //naya option banana
        option.value = categories[selectedType][i].value; //option ki value set karna
        option.innerText = categories[selectedType][i].text; //option ka text set karna
        categorySelect.appendChild(option); //dropdown mein option add karna
    }
};

//4)create button click par transaction add karna
createBtn.onclick = function () {
    let type = typeSelect.value;
    let category = categorySelect.options[categorySelect.selectedIndex]?.text; //selected category ka naam
    let amount = Number(amountInput.value); //amount ko number mein convert karna
    let date = dateInput.value;

    //agr koi b field khali ho to alert show karo
    if (type === "" || category === "" || amount === 0 || date === "") {
        alert("Please fill in all fields");
        return;
    }

    //nayi transaction ka object banana
    let transaction = {
        id: Date.now(), //unique id
        type: type,
        category: category,
        amount: amount,
        date: date
    };

    transactions.push(transaction); //transaction array mein add karna
    saveToLocalStorage();
    updateUI();
    clearInputs();
};

//5)income, expense aur balance screen par show karna
function updateUI() {
    incContainer.innerHTML = "";
    expContainer.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    //sari transactions par loop chalana
    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i]; //current transaction

        let itemHtml = `
            <div class="history-item ${t.type === "income" ? "income-style" : "expense-style"}">
                <div>
                    <strong>${t.category}</strong><br>
                    <small>${t.date}</small>
                </div>
                <span>$${t.amount.toFixed(2)}</span>
                <button onclick="deleteTransaction(${t.id})">&times;</button>
            </div>
            `;


        //agar income ho to income list mein add karo
        if (t.type === "income") {
            totalIncome = totalIncome + t.amount;
            incContainer.innerHTML = incContainer.innerHTML + itemHtml;
        }
        else {
            totalExpense = totalExpense + t.amount;
            expContainer.innerHTML = expContainer.innerHTML + itemHtml;
        }
    }

    //total balance calculate
    let totalBalance = totalIncome - totalExpense;
    balanceDisplay.innerText = "Total Balance: $" + totalBalance.toFixed(2);
    incomeDisplay.innerText = "$" + totalIncome.toFixed(2);
    expenseDisplay.innerText = "$" + totalExpense.toFixed(2);
}

//6)transaction delete karna
function deleteTransaction(id) {
    let newArray = [];

    //sab transactions ko ek ek karke check karo
    for (let i = 0; i < transactions.length; i++) {

        //agar transaction ki id delete wali id ke barabar nahi hai
        if (transactions[i].id != id) {

            // to us transaction ko newArray me add kar do
            newArray.push(transactions[i]);
        }
    }

    transactions = newArray;
    saveToLocalStorage();
    updateUI();
}

function clearInputs() {
    amountInput.value = "";
    dateInput.value = "";
    typeSelect.value = "";
    categorySelect.innerHTML = '<option value="">Select category</option>';
}

loadFromLocalStorage();
updateUI();
