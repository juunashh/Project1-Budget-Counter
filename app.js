var incomeArray = [];
var expenseArray = [];

// Check if Arrays exist in local storage

if (localStorage.getItem('incomeList') === null) {
    saveIncomeList();
} else {
    getIncomeList();
    updateIncomeTable();
}

if (localStorage.getItem('expenseList') === null) {
    saveExpenseList();
} else {
    getExpenseList();
    updateExpenseTable();
}

// Get incomeArray[] from local storage
function getIncomeList() {
    incomeArray = JSON.parse(localStorage.getItem('incomeList'));
}

// Save incomeArray[] to local storage
function saveIncomeList() {
    localStorage.setItem('incomeList',JSON.stringify(incomeArray));
}

// Get expenseArray[] from local storage
function getExpenseList() {
    expenseArray = JSON.parse(localStorage.getItem('expenseList'));
}

// Save expenseArray[] to local storage
function saveExpenseList() {
    localStorage.setItem('expenseList',JSON.stringify(expenseArray));
}


function validateIncomeInput() {
    let name = document.forms["income"]["i-name"];
    if (name.value.length > 15 || name.value.length < 3 || name.value == "") {
        name.style.borderColor = "red";
        alert("Check the name field! 3-15 characters allowed");
        return false;
    } else {
        name.style.borderColor = "";
    }
    let amount = document.forms["income"]["i-amount"];
    if (amount.value === "" || amount.value === NaN || amount.value < 1) {
        amount.style.borderColor = "red";
        alert("Check the amount! Value should be more than 1");
        return false;
    } else {
        amount.style.borderColor = "";
    }
    return true;
}

function incomeBtn() {
    if (validateIncomeInput()) {
        var name = document.forms["income"]["i-name"].value;
        var amount = document.forms["income"]["i-amount"].value;
        incomeAdd(name, amount);
        
    }
}

function incomeAdd(n, a) {
    incomeArray.push({ name: n, amount: a })
    //console.log(incomeArray);
    saveIncomeList();
    updateIncomeTable();


}

function updateIncomeTable() {
    let table = document.getElementById("income-table");
    let removable = document.getElementsByClassName("i-data");

    // delete everything 
    for (let i = removable.length - 1; i >= 0; i--) {
        removable[i].remove();
    }

    //rebuild list from array
    for (let i = 0; i < incomeArray.length; i++) {
        var name = incomeArray[i].name;
        var amount = incomeArray[i].amount;
        var uusiRivi = document.createElement('tr');
        uusiRivi.setAttribute('class', 'i-data');
        var uusiID = "income-" + i;
        uusiRivi.setAttribute('id', uusiID);

        uusiRivi.innerHTML = '<td>' + name + '</td><td>' + amount + '</td><td><input type="checkbox" class="income-checkbox" id="checkbox-' + uusiID + '" onchange="iRemoveRow()">';

        table.appendChild(uusiRivi);
    }
    calculateIncome();
    calculateBudget();
}

function iRemoveRow() {
    var checkRows = document.getElementsByClassName("income-checkbox");
    // Go thru all checked boxes
    for (let i = 0; i < checkRows.length; i++) {

        if (checkRows[i].checked) {
            //var deleteRow = document.getElementById("income-" + i);

            incomeArray.splice(i, 1);
            saveIncomeList();
            updateIncomeTable();
        }
    }
}

function calculateIncome() {
    let total = 0;
    for (let i = 0; i < incomeArray.length; i++) {
        var n = parseInt(incomeArray[i].amount);
        total = total + n;
    }
    var itemTotal = document.getElementById("income-total");
    itemTotal.innerHTML = total;
    return total;
}


// EXPENSES

function validateExpenseInput() {
    let name = document.forms["expenses"]["e-name"];
    if (name.value.length > 15 || name.value.length < 3 || name.value == "") {
        name.style.borderColor = "red";
        alert("Check the name field! 3-15 characters allowed");
        return false;
    } else {
        name.style.borderColor = "";
    }
    let amount = document.forms["expenses"]["e-amount"];
    if (amount.value === "" || amount.value === NaN || amount.value < 1) {
        amount.style.borderColor = "red";
        alert("Check the amount! Value should be more than 1");
        return false;
    } else {
        amount.style.borderColor = "";
    }
    return true;
}

function expensesBtn() {
    if (validateExpenseInput()) {
        var name = document.forms["expenses"]["e-name"].value;
        var type = document.forms["expenses"]["e-type"].value;
        var amount = document.forms["expenses"]["e-amount"].value;

        expenseAdd(name, type, amount);
    }
}

function expenseAdd(n, t, a) {

    expenseArray.push({ name: n, type: t, amount: a })
    //console.log(expenseArray);
    updateExpenseTable();
    saveExpenseList();
}

function updateExpenseTable() {
    let table = document.getElementById("expenses-table");
    let removable = document.getElementsByClassName("e-data");

    // delete everything 
    for (let i = removable.length - 1; i >= 0; i--) {
        removable[i].remove();
    }

    //rebuild list from array
    for (let i = 0; i < expenseArray.length; i++) {
        var name = expenseArray[i].name;
        var type = expenseArray[i].type;
        var amount = expenseArray[i].amount;
        var uusiRivi = document.createElement('tr');
        uusiRivi.setAttribute('class', 'e-data');
        var uusiID = "expense-" + i;
        uusiRivi.setAttribute('id', uusiID);
        uusiRivi.innerHTML = '<td>' + name + '</td><td>' + type + '</td><td>' + amount + '</td><td><input type="checkbox" class="expenses-checkbox" id="checkbox-' + uusiID + '" onchange="eRemoveRow()">';
        table.appendChild(uusiRivi);
        calculateExpenses();
        calculateBudget();
        expenseBreakdown();
    }
}

function eRemoveRow() {
    var checkRows = document.getElementsByClassName("expenses-checkbox");
    // Go thru all checked boxes
    for (let i = 0; i < checkRows.length; i++) {

        if (checkRows[i].checked) {
            //var deleteRow = document.getElementById("expense-" + i);
            expenseArray.splice(i, 1);
            updateExpenseTable();
            saveExpenseList();
        }
    }
}

function calculateExpenses() {
    let total = 0;
    for (let i = 0; i < expenseArray.length; i++) {
        var n = parseInt(expenseArray[i].amount);
        total = total + n;
    }
    var itemTotal = document.getElementById("expenses-total");
    itemTotal.innerHTML = total;
    return total;
}

// CALCULATE THE TOTAL
function calculateBudget() {
    var leftover = 0;
    var results = document.getElementById("leftover");
    if (incomeArray === "" || expenseArray === "") {
        return false;
    } else {
        leftover = calculateIncome() - calculateExpenses();
    }
    if (leftover < 0) {
        results.style.color = "red";
    }
    results.innerHTML = "<b>" + leftover + "</b>";
}

function expenseBreakdown() {
    
    // HOUSING
    var housing = expenseArray.filter(function(x) {return x.type === "Housing"});
    let housingTotal = 0;
    for (let i = 0; i < housing.length; i++) {
        var n = parseInt(housing[i].amount);
        housingTotal = housingTotal + n;
    }
    var housingP = Math.floor(housingTotal * 100 / calculateExpenses());
    document.getElementById("housing-data").innerHTML = housingP + "%";

    // UTILITIES
    var utilities = expenseArray.filter(function(x) {return x.type === "Utilities"});
    let utilitiesTotal = 0;
    for (let i = 0; i < utilities.length; i++) {
        var n = parseInt(utilities[i].amount);
        utilitiesTotal = utilitiesTotal + n;
    }
    var utilitiesP = Math.floor(utilitiesTotal * 100 / calculateExpenses());
    document.getElementById("utilities-data").innerHTML = utilitiesP + "%";

    // GROCERIES
    var groceries = expenseArray.filter(function(x) {return x.type === "Groceries"});
    let groceriesTotal = 0;
    for (let i = 0; i < groceries.length; i++) {
        var n = parseInt(groceries[i].amount);
        groceriesTotal = groceriesTotal + n;
    }
    var groceriesP = Math.floor(groceriesTotal * 100 / calculateExpenses());
    document.getElementById("groceries-data").innerHTML = groceriesP + "%";

    // SUBSCRIPTIONS
    var subscriptions = expenseArray.filter(function(x) {return x.type === "Subscriptions"});
    let subscriptionsTotal = 0;
    for (let i = 0; i < subscriptions.length; i++) {
        var n = parseInt(subscriptions[i].amount);
        subscriptionsTotal = subscriptionsTotal + n;
    }
    var subscriptionsP = Math.floor(subscriptionsTotal * 100 / calculateExpenses());
    document.getElementById("subscriptions-data").innerHTML = subscriptionsP + "%";

    // CLOTHINGS
    var clothing = expenseArray.filter(function(x) {return x.type === "Clothing"});
    let clothingTotal = 0;
    for (let i = 0; i < clothing.length; i++) {
        var n = parseInt(clothing[i].amount);
        clothingTotal = clothingTotal + n;
    }
    var clothingP = Math.floor(clothingTotal * 100 / calculateExpenses());
    document.getElementById("clothing-data").innerHTML = clothingP + "%";
    
    // OTHER
    var other = expenseArray.filter(function(x) {return x.type === "Other"});
    let otherTotal = 0;
    for (let i = 0; i < other.length; i++) {
        var n = parseInt(other[i].amount);
        otherTotal = otherTotal + n;
    }
    var otherP = Math.floor(otherTotal * 100 / calculateExpenses());
    document.getElementById("other-data").innerHTML = otherP + "%";
    
}