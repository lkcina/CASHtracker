const editCatBtn = document.getElementById("edit-cat-btn");
const editWindow = document.getElementById("edit-window");
const budgetContainer = document.getElementById("budget-container");
const budgetPlaceholder = document.getElementById("budget-placeholder");
const toolbarDiv = document.getElementById("toolbar");
const newBudgetBtn = document.getElementsByClassName("new-budget-btn");
const budgetName = document.getElementById("budget-name");
const addReceiptBtn = document.getElementById("add-receipt-btn");

let isCurrentBudget = true;
const categories = [
    {
        "name": "Giving",
        "subcategories": [
            {
                "name": "Tithe",
                "budgeted": 0,
                "spent": 0,
                "remaining": 0
            },
            {
                "name": "Charity",
                "budgeted": 0,
                "spent": 0,
                "remaining": 0
            }
        ]
    },
    {
        "name": "Housing",
        "subcategories": [
            {
                "name": "Rent",
                "budgeted": 0,
                "spent": 0,
                "remaining": 0
            }
        ]
    }
];

setDisplay();

editCatBtn.addEventListener("click", editCategories);

function setDisplay() {
    if (isCurrentBudget) {
        toolbarDiv.style.display = "block";
        budgetContainer.style.display = "block";
        budgetPlaceholder.style.display = "none";
    } else {
        toolbar.style.display = "none";
        budgetContainer.style.display = "none";
        budgetPlaceholder.style.display = "block";
    };
};


function editCategories() {
    editWindow.style.display = "block";
    displayEditCatWindow();

    function displayEditCatWindow() {
        editWindow.innerHTML = `
        <h3>Categories</h3>
        <button id="edit-cat-cancel-btn">X</button>
        <div id="edit-cat-container">
            ${editCatHtml(categories)}
        </div>
        <button id="add-category-btn">+ New Category</button>
        `;
    };

    function editCatHtml(categoriesArr) {
        let htmlResult = "";

        categoriesArr.forEach((categoryObj) => {
            const subcategoriesArr = categoryObj.subcategories;
            const categoryNameId = categoryObj.name.replace(/\s/g, "-").toLowerCase();

            htmlResult += `
                <details class="category">
                    <summary class="edit-cat-name">${categoryObj.name}</summary>
                    <div class="edit-cat-subcat-container">
            `;

            subcategoriesArr.forEach((subcatObj) => {
                htmlResult += `
                    <p class="edit-cat-subcat">${subCatObj.name}</p>
                `;
            });

            htmlResult += `
                    </div>
                </details>
            `;
        });

        return htmlResult;
    };
};