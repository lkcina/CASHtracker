const editCatBtn = document.getElementById("edit-cat-btn");
const editWindow = document.getElementById("edit-window");
const budgetContainer = document.getElementById("budget-container");
const budgetPlaceholder = document.getElementById("budget-placeholder");
const toolbarDiv = document.getElementById("toolbar");
const newBudgetBtn = document.getElementsByClassName("new-budget-btn");
const budgetName = document.getElementById("budget-name");
const addReceiptBtn = document.getElementById("add-receipt-btn");

let isCurrentBudget = true;
let categories = [
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
let categoriesAlt = [];

setDisplay();

editCatBtn.addEventListener("click", ()=> {
    editWindow.style.display = "block";
    categoriesAlt = JSON.parse(JSON.stringify(categories));
    displayEditCatWindow();
});

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

function displayEditCatWindow(categoriesArr) {
    editWindow.innerHTML = `
    <h3>Categories</h3>
    <button class="edit-window-cancel-btn" id="edit-cat-cancel-btn">X</button>
    <div id="edit-cat-container">
        ${editCatHtml(categoriesAlt)}
    </div>
    <button id="add-category-btn">+ New Category</button>
    `;


    function editCatHtml(categoriesAlt) {
        let htmlResult = "";
    
        categoriesAlt.forEach((categoryObj) => {
            const subcategoriesArr = categoryObj.subcategories;
            const categoryNameId = categoryObj.name.replace(/\s/g, "-").toLowerCase();
            htmlResult += `
                <div class="edit-cat-category">
                    <input class="edit-cat-name" type="text" value="${categoryObj.name}" id="${categoryNameId}">
                    <div class="edit-cat-subcat-container">
            `;
    
            subcategoriesArr.forEach((subcatObj) => {
                const subCatNameId = subcatObj.name.replace(/\s/g, "-").toLowerCase();
    
                htmlResult += `
                    <input class="edit-cat-subcat-name" type="text" value="${subcatObj.name}" id="${subCatNameId}"</input>
                `;
            });
    
            htmlResult += `
                        <button class="add-subcat-btn" id="${categoryNameId}-subcat-btn">+ New Subcategory</button>
                    </div>
                </div>
            `;
        });

        return htmlResult;
    };

    // Category Inputs Event Listeners
    const catInputs = [...document.getElementsByClassName("edit-cat-name")];    
    catInputs.forEach((input) => {
        const category = categoriesAlt[catInputs.indexOf(input)];
        
        input.addEventListener("change", () => {
            category.name = input.value;
        });
        
        let subcatStart = 0;
        for (let i = 0; categoriesAlt[i] !== category; i ++) {
            subcatStart += categoriesAlt[i].subcategories.length;
        };        
        const subcatInputs = [...document.getElementsByClassName("edit-cat-subcat-name")].slice(subcatStart, subcatStart + category.subcategories.length);
        subcatInputs.forEach((subInput) => {
            subInput.addEventListener("change", () => {
                category.subcategories[subcatInputs.indexOf(subInput)].name = subInput.value;
            });
        });
    });

    // Cancel Button Event Listener
    const cancelBtn = document.getElementById("edit-cat-cancel-btn");
    cancelBtn.addEventListener("click", () => {
        if (categoriesAlt !== categories) {
            const cancel = confirm("Are you sure you want to close the window and lose your changes?");
            
            if (cancel) {
                categoriesAlt = [];
                editWindow.style.display = "none";
                editWindow.innerHTML = "";
                console.log(categories);
            } else {
                displayEditCatWindow(categoriesAlt);
            };
        } else {
            categoriesAlt = [];
            editWindow.style.display = "none";
            editWindow.innerHTML = "";
        };
    });

    // Add Category and Subcategory Button Event Listeners
    const addCategoryBtn = document.getElementById("add-category-btn");
    addCategoryBtn.addEventListener("click", () => {
        categoriesAlt.push({"name": "", "subcategories": []});
        displayEditCatWindow();
    });

    const addSubcatBtn = [...document.getElementsByClassName("add-subcat-btn")];
    addSubcatBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            categoriesAlt[addSubcatBtn.indexOf(btn)].subcategories.push({"name": "", "budgeted": 0, "spent": 0, "remaining": 0});
            displayEditCatWindow();
        })
    })
};

