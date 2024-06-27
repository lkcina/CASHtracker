const editCatBtn = document.getElementById("edit-cat-btn");
const editWindow = document.getElementById("edit-window");
const budgetContainer = document.getElementById("budget-container");
const budgetPlaceholder = document.getElementById("budget-placeholder");
const toolbar = document.getElementById("toolbar");
const newBudgetBtn = document.getElementsByClassName("new-budget-btn");
const budgetName = document.getElementById("budget-name");
const addReceiptBtn = document.getElementById("add-receipt-btn");

let isCurrentBudget = false;
const categories = [];

setDisplay();

function setDisplay() {
    if (isCurrentBudget) {
        toolbar.style.display = "block";
        budgetContainer.style.display = "block";
        budgetPlaceholder.style.display = "none";
    } else {
        toolbar.style.display = "none";
        budgetContainer.style.display = "none";
        budgetPlaceholder.style.display = "block";
    };
};


function editCategories() {

};