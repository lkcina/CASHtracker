const editCatBtn = document.getElementById("edit-cat-btn");
const editWindow = document.getElementById("edit-window");
const budgetContainer = document.getElementById("budget-container");
const budgetPlaceholder = document.getElementById("budget-placeholder");
const toolbarDiv = document.getElementById("toolbar");
const newBudgetBtn = document.getElementsByClassName("new-budget-btn");
const budgetName = document.getElementById("budget-name");
const addReceiptBtn = document.getElementById("add-receipt-btn");

let isCurrentBudget = false;
let categories = [];
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
        toolbarDiv.style.display = "none";
        budgetContainer.style.display = "none";
        budgetPlaceholder.style.display = "block";
    };
};

function displayEditCatWindow() {
    editWindow.innerHTML = `
    <h3>Categories</h3>
    <button class="edit-window-cancel-btn" id="edit-cat-cancel-btn">X</button>
    <div id="edit-cat-container">
        ${editCatHtml()}
    </div>
    <button id="add-category-btn">+ New Category</button>
    <button id="edit-cat-confirm-btn">Confirm Changes</button>
    `;


    function editCatHtml() {
        let htmlResult = "";
    
        categoriesAlt.forEach((categoryObj) => {
            const subcategoriesArr = categoryObj.subcategories;
            const categoryNameId = categoryObj.name.replace(/\s/g, "-").toLowerCase();
            htmlResult += `
                <div class="edit-cat-category">
                    <input class="edit-cat-name" type="text" value="${categoryObj.name}" id="${categoryNameId}">
                    <button class="edit-cat-del-cat-btn" id="${categoryNameId}-del-btn">X</button>
                    <div class="edit-cat-subcat-container">
            `;
    
            subcategoriesArr.forEach((subcatObj) => {
                const subCatNameId = subcatObj.name.replace(/\s/g, "-").toLowerCase();
    
                htmlResult += `
                    <input class="edit-cat-subcat-name" type="text" value="${subcatObj.name}" id="${subCatNameId}"</input>
                    <button class="edit-cat-del-sub-btn" id="${subCatNameId}-del-btn">X</button>
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

    // Category Inputs and Delete Buttons Event Listeners
    const catInputs = [...document.getElementsByClassName("edit-cat-name")];    
    catInputs.forEach((input) => {
        const category = categoriesAlt[catInputs.indexOf(input)];        
        input.addEventListener("change", () => {
            category.name = input.value;
        });
        
        const catDelBtns = [...document.getElementsByClassName("edit-cat-del-cat-btn")];
        
            if (category.subcategories.length === 0) {
                catDelBtns[catInputs.indexOf(input)].style.display = "inline-block";
                
                catDelBtns[catInputs.indexOf(input)].addEventListener("click", () => {
                    categoriesAlt.splice(catInputs.indexOf(input), 1);
                    displayEditCatWindow();
                });
            } else {
                catDelBtns[catInputs.indexOf(input)].style.display = "none";
            };

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

        const subcatDelBtns = [...document.getElementsByClassName("edit-cat-del-sub-btn")].slice(subcatStart, subcatStart + category.subcategories.length);
        subcatDelBtns.forEach((delBtn) => {
            if (category.subcategories[subcatDelBtns.indexOf(delBtn)].receipts.length === 0) {
                delBtn.addEventListener("click", () => {
                    category.subcategories.splice(subcatDelBtns.indexOf(delBtn), 1);
                    displayEditCatWindow();
                });
            } else {
                delBtn.style.display = "none";
            };
        });
    });

    // Cancel Button Event Listener
    const cancelBtn = document.getElementById("edit-cat-cancel-btn");
    cancelBtn.addEventListener("click", () => {
        if (JSON.stringify(categoriesAlt) !== JSON.stringify(categories)) {
            const cancel = confirm("Are you sure you want to close the window and lose your changes?");
            
            if (cancel) {
                categoriesAlt = [];
                editWindow.style.display = "none";
                editWindow.innerHTML = "";
            } else {
                displayEditCatWindow();
            };
        } else {
            categoriesAlt = [];
            editWindow.style.display = "none";
            editWindow.innerHTML = "";
        };
    });

    // Confirm Button Event Listener
    const confirmBtn = document.getElementById("edit-cat-confirm-btn");
    confirmBtn.addEventListener("click", () => {
        const confirmChanges = confirm("Are you sure you want to confirm changes? This action cannot be undone.");

        if (confirmChanges) {
            categories = JSON.parse(JSON.stringify(categoriesAlt));
            categoriesAlt = [];
            editWindow.style.diplay = "none";
            editWindow.innerHTML = "";
            console.log(categories);
        } else {
            displayEditCatWindow();
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
            categoriesAlt[addSubcatBtn.indexOf(btn)].subcategories.push({"name": "", "budgeted": 0, "receipts": []});
            displayEditCatWindow();
        });
    });

};

