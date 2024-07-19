const editCatBtn = document.getElementById("edit-cat-btn");
const editWindow = document.getElementById("edit-window");
const editDialog = document.getElementById("edit-dialog");
const budgetContainer = document.getElementById("budget-container");
const budgetPlaceholder = document.getElementById("budget-placeholder");
const toolbarDiv = document.getElementById("toolbar");
const newBudgetBtn = [...document.getElementsByClassName("new-budget-btn")];
const budgetNameInput = document.getElementById("budget-name");
const addReceiptBtn = document.getElementById("add-receipt-btn");
const saveBudgetBtn = document.getElementById("save-budget-btn");

let isCurrentBudget = localStorage.getItem("currentBudget") ? JSON.parse(localStorage.getItem("currentBudget")) : false;
let categories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : [];
let categoriesAlt = [];
let budgetName = localStorage.getItem("budgetName") ? localStorage.getItem("budgetName") : "";
let receipts = localStorage.getItem("receipts") ? JSON.parse(localStorage.getItem("receipts")) : [];
let totalBudget = localStorage.getItem("totalBudget") ? JSON.parse(localStorage.getItem("totalBudget")) : 0;

setDisplay();

window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    return true;
})

newBudgetBtn.forEach((btn) => {
    btn.addEventListener("click", () => {        
        editWindow.style.display = "block";
        document.querySelector("body").style.overflow = "hidden";
        editDialog.innerHTML = `
            <h3>Budget Name</h3>
            <hr class="edit-dialog-title-divider">
            <button class="edit-window-cancel-btn"></button>
            <input id="new-budget-name" type="text">
            <button id="new-budget-continue-btn">Continue</button>
        `;

        const cancelBtn = document.querySelector(".edit-window-cancel-btn");
        cancelBtn.addEventListener("click", () => {
            editWindow.style.display = "none";
            editDialog.innerHTML = "";
            document.querySelector("body").style.overflow = "scroll";
        });

        const continueBtn = document.getElementById("new-budget-continue-btn");
        const newBudgetName = document.getElementById("new-budget-name");

        continueBtn.addEventListener("click", () => {
            if (newBudgetName.value === "") {
                alert("Please provide a name for your new budget.");
            } else {
                const replaceBudget = confirm("Are you sure you want to create a new budget? Any existing budget information will be overwritten.");
                if (replaceBudget) {
                    isCurrentBudget = true;
                    budgetName = newBudgetName.value;
                    categoriesAlt = [];
                    displayEditCatWindow(true);
                } else {
                    return;
                };
            };
        });        
    });
});

editCatBtn.addEventListener("click", () => {
    editWindow.style.display = "block";
    document.querySelector("body").style.overflow = "hidden";
    categoriesAlt = JSON.parse(JSON.stringify(categories));
    displayEditCatWindow(false);
});

budgetNameInput.addEventListener("change", () => {
    budgetName = budgetNameInput.value;
});

budgetNameInput.addEventListener("input", budgetNameFontSize);
window.addEventListener("mousemove", budgetNameFontSize);

function budgetNameFontSize() {
    let newFontSize = parseInt(window.getComputedStyle(budgetNameInput).fontSize.replace(/a-z/, ""));
    if (newFontSize < 35) {
        budgetNameInput.style.textShadow = "1px 1px 1px rgba(30, 30, 30, 0.9)";
    } else if (newFontSize < 50) {
        budgetNameInput.style.textShadow = "2px 2px 2px rgba(30, 30, 30, 0.9)";
    } else {
        budgetNameInput.style.textShadow = "3px 3px 3px rgba(30, 30, 30, 0.9)";
    };

    if (budgetNameInput.scrollWidth > budgetNameInput.clientWidth) {
        while (budgetNameInput.scrollWidth > budgetNameInput.clientWidth) {
            newFontSize -= 1;
            budgetNameInput.style.fontSize = `${newFontSize}px`;
        };
    } else if (newFontSize < 80) {
        while (newFontSize < 80) {
            newFontSize += 1;
            budgetNameInput.style.fontSize = `${newFontSize}px`;
            
            if (budgetNameInput.scrollWidth > budgetNameInput.clientWidth) {
                newFontSize -= 1;
                budgetNameInput.style.fontSize = `${newFontSize}px`;
                return;
            }
        };
    
    };
};

saveBudgetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to save your changes? This cannot be undone.")) {
        localStorage.clear()
        localStorage.setItem("currentBudget", JSON.stringify(isCurrentBudget));
        localStorage.setItem("budgetName", budgetName);
        localStorage.setItem("totalBudget", JSON.stringify(totalBudget));
        localStorage.setItem("categories", JSON.stringify(categories));
        localStorage.setItem("receipts", JSON.stringify(receipts));
    } else {
        return;
    };
});

addReceiptBtn.addEventListener("click", () => {
    editWindow.style.display = "block";
    document.querySelector("body").style.overflow = "hidden";
    displayAddReceiptWindow();
});

function setDisplay() {
    if (isCurrentBudget) {
        toolbarDiv.style.display = "flex";
        budgetContainer.style.display = "block";
        budgetPlaceholder.style.display = "none";
        budgetNameInput.value = budgetName;

        budgetContainer.innerHTML = `
            <div id="budget-header-container">
                
                <div class="header-item"><label for="total-budget">Total Budget</label><hr><p>$<input id="total-budget" type="number" value="${totalBudget}" min="0"></p></div>
                <div id="budget-assigned" class="header-item">Assigned Income<hr><p>$${getAssignedIncome().toFixed(2)}</p></div>
                <div id="budget-remainder" class="header-item">Unassigned Income<hr><p>$${getUnassignedIncome().toFixed(2)}</p></div>
                <div id="total-expenses" class="header-item">Total Expenses<hr><p>$${getTotalExpenses().toFixed(2)}</p></div>
            </div>
            <div id="budget-categories-container" data-masonry="{ 'itemSelector': '.budget-category', 'columnWidth': 'calc(50% - 10px)' }">
                ${budgetCategoriesHtml()}
            </div>
        `;

        function getAssignedIncome() {
            let assignedTotal = 0;
            categories.forEach((cat) => {
                cat.subcategories.forEach((subcat) => {
                    assignedTotal += subcat.budgeted;
                });
            });
            return assignedTotal;
        }

        function getUnassignedIncome() {
            let remainingTotal = totalBudget;
            categories.forEach((cat) => {
                cat.subcategories.forEach((subcat) => {
                    remainingTotal -= subcat.budgeted;
                });
            });
            return remainingTotal;
        };

        function getTotalExpenses() {
            let totalExpenses = 0;
            if (categories.length > 0) {
                categories.forEach((cat) => {
                    if (cat.subcategories.length > 0) {
                        cat.subcategories.forEach((subcat) => {
                            totalExpenses += subcat.receipts.length > 0 ? subcat.receipts.reduce((a, b) => a + b) : 0;
                        });
                    };
                    
                });
            };
            
            return totalExpenses;
        };

        function budgetCategoriesHtml() {
            let htmlResult = "";
            if (categories.length > 0) {
                categories.forEach((cat) => {
                    let categoryTotalBudgeted = 0;
                    let categoryTotalSpent = 0;
                    htmlResult += `
                        <div class="budget-category">
                            <div class="budget-category-header">${cat.name}</div>
                            <div class="budget-category-table-heads">
                                <span>Subcategory</span>
                                <span>Budgeted</span>
                                <span>Spent</span>
                                <span>Remaining</span>
                            </div>
                    `;
                    
                    if (cat.subcategories.length > 0) {
                        cat.subcategories.forEach((subcat) => {
                            categoryTotalBudgeted += subcat.budgeted;
        
                            const subcatReceiptsTotal = subcat.receipts.length > 0 ? subcat.receipts.reduce((a, b) => a + b) : 0;
                            categoryTotalSpent += parseFloat(subcatReceiptsTotal);
        
                            htmlResult += `
                                <div class="subcategory-container">
                                    <span>${subcat.name}</span>
                                    <span>$<input id="${subcat.name.toLowerCase().replace(/\s/g, "-")}-budgeted" type="number" min="0" value="${subcat.budgeted}"></span>
                                    <span>$${subcatReceiptsTotal.toFixed(2)}</span>
                                    <span>$${(subcat.budgeted - subcatReceiptsTotal).toFixed(2)}</span>
                                </div>
                                <hr>
                            `;
                        });
                    };
                    
    
                    htmlResult += `
                        <div class="category-footer">
                            <span>Total</span>
                            <span>$${categoryTotalBudgeted.toFixed(2)}</span>
                            <span>$${categoryTotalSpent.toFixed(2)}</span>
                            <span>$${(categoryTotalBudgeted - categoryTotalSpent).toFixed(2)}</span>
                        </div>
                        </div>
                    `;
                });
            };
            
            return htmlResult;
        };

        const budgetCatContainer = new Masonry("#budget-categories-container", {
            "itemSelector": ".budget-category"
        });

        const totalBudgetInput = document.getElementById("total-budget");
        totalBudgetInput.addEventListener("change", () => {
            totalBudget = parseFloat(totalBudgetInput.value);
            setDisplay();
        });

        if (categories.length > 0) {
            categories.forEach((cat) => {
                if (cat.subcategories.length > 0) {
                    cat.subcategories.forEach((subcat) => {
                        const subcatBudgetedInput = document.getElementById(`${subcat.name.toLowerCase().replace(/\s/g, "-")}-budgeted`);
                        subcatBudgetedInput.addEventListener("change", () => {
                            subcat.budgeted = parseFloat(subcatBudgetedInput.value);
                            setDisplay();
                        });
                    });
                };
                
            });
        };
        

    } else {
        toolbarDiv.style.display = "none";
        budgetContainer.style.display = "none";
        budgetPlaceholder.style.display = "block";
    };
};

function displayEditCatWindow(isRequired) {
    editDialog.innerHTML = `
    <h3>Categories</h3>
    <hr class="edit-dialog-title-divider">
    <button class="edit-window-cancel-btn"></button>
    <div id="edit-cat-container">
        ${editCatHtml()}
        <p id="add-category-btn">+ New Category</p>
    </div>
    
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
                    <button class="edit-cat-del-cat-btn" id="${categoryNameId}-del-btn"></button>
                    <div class="edit-cat-subcat-container">
            `;
    
            subcategoriesArr.forEach((subcatObj) => {
                const subCatNameId = subcatObj.name.replace(/\s/g, "-").toLowerCase();
    
                htmlResult += `
                    <input class="edit-cat-subcat-name" type="text" value="${subcatObj.name}" id="${subCatNameId}"</input>
                    <button class="edit-cat-del-sub-btn" id="${subCatNameId}-del-btn"></button>
                `;

                
            });
    
            htmlResult += `
                        <p class="add-subcat-btn" id="${categoryNameId}-subcat-btn">+ New Subcategory</p>
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
                    displayEditCatWindow(isRequired);
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
                    displayEditCatWindow(isRequired);
                });
            } else {
                delBtn.style.display = "none";
            };
        });
    });

    // Cancel Button Event Listener
    const cancelBtn = document.querySelector(".edit-window-cancel-btn");
    if (isRequired) {
        cancelBtn.style.display = "none";
    } else {
        cancelBtn.style.display = "inline-block";
        cancelBtn.addEventListener("click", () => {
            if (JSON.stringify(categoriesAlt) !== JSON.stringify(categories)) {
                const cancel = confirm("Are you sure you want to close the window and lose your changes?");
                
                if (cancel) {
                    categoriesAlt = [];
                    editWindow.style.display = "none";
                    editDialog.innerHTML = "";
                    document.querySelector("body").style.overflow = "scroll";
                } else {
                    displayEditCatWindow(isRequired);
                };
            } else {
                categoriesAlt = [];
                editWindow.style.display = "none";
                editDialog.innerHTML = "";
                document.querySelector("body").style.overflow = "scroll";
            };
        });
    };
    

    // Confirm Button Event Listener
    const confirmBtn = document.getElementById("edit-cat-confirm-btn");
    confirmBtn.addEventListener("click", () => {
        const confirmChanges = confirm("Are you sure you want to confirm changes? This action cannot be undone.");

        if (confirmChanges) {
            categories = JSON.parse(JSON.stringify(categoriesAlt));
            categoriesAlt = [];
            editWindow.style.diplay = "none";
            editDialog.innerHTML = "";
            document.querySelector("body").style.overflow = "scroll";
            setDisplay();
        } else {
            displayEditCatWindow(isRequired);
        };
    });

    // Add Category and Subcategory Button Event Listeners
    const addCategoryBtn = document.getElementById("add-category-btn");
    addCategoryBtn.addEventListener("click", () => {
        categoriesAlt.push({"name": "", "subcategories": []});
        displayEditCatWindow(isRequired);
    });

    const addSubcatBtn = [...document.getElementsByClassName("add-subcat-btn")];
    addSubcatBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            categoriesAlt[addSubcatBtn.indexOf(btn)].subcategories.push({"name": "", "budgeted": 0, "receipts": []});
            displayEditCatWindow(isRequired);
        });
    });
};

function displayAddReceiptWindow() {
    editDialog.innerHTML = `
        <h3>New Receipt</h3>
        <hr class="edit-dialog-title-divider">
        <button class="edit-window-cancel-btn"></button>
        <form id="add-receipt-form">
            <label for="add-receipt-cat">Category</label>
            <select name="category" id="add-receipt-cat" required>
            </select>
            <label for="add-receipt-subcat">Subcategory</label>
            <select name="subcategory" id="add-receipt-subcat" required>
            </select>
            <label for="add-receipt-total">Total</label>
            <span>$<input id="add-receipt-total" name="total" type="float" required></span>
            <label for="add-receipt-memo">Memo</label>
            <input id="add-receipt-memo" name="memo" type="text">
            <button type="submit" id="add-receipt-submit">Submit</button>
        </form>
    `;

    const addReceiptForm = document.getElementById("add-receipt-form");
    const selectCategory = document.getElementById("add-receipt-cat");
    const selectSubcategory = document.getElementById("add-receipt-subcat");
    const totalInput = document.getElementById("add-receipt-total");
    const memoInput = document.getElementById("add-receipt-memo");

    selectCategory.innerHTMl = "";
    for (let i = 0; i < categories.length; i ++) {
        selectCategory.innerHTML += `
            <option class="cat-option" value="${i}">${categories[i].name}</option>
        `;
    };
    setSubcategoryOptions(selectCategory.value);


    function setSubcategoryOptions(categoryIndex) {
        selectSubcategory.innerHTML = "";
        for (let i = 0; i < categories[categoryIndex].subcategories.length; i ++) {
            selectSubcategory.innerHTML += `
                <option class="subcat-option" value="${i}">${categories[categoryIndex].subcategories[i].name}</option>
            `;
        };
    }

    selectCategory.addEventListener("change", () => {
        setSubcategoryOptions(selectCategory.value);
    });
    
    addReceiptForm.addEventListener("submit", (event) => {
        event.preventDefault();
        receipts.unshift({"category": selectCategory.value, "subcategory": selectSubcategory.value, "total": parseFloat(totalInput.value), "memo": memoInput.value});
        syncReceipts();
        editWindow.style.diplay = "none";
        editDialog.innerHTML = "";
        document.querySelector("body").style.overflow = "scroll";
        setDisplay();
    });

    const cancelBtn = document.querySelector(".edit-window-cancel-btn");
    cancelBtn.addEventListener("click", () => {
        const cancel = confirm("Are you sure you want to close the window and lose your changes?");
                
        if (cancel) {
            editWindow.style.display = "none";
            editDialog.innerHTML = "";
            document.querySelector("body").style.overflow = "scroll";
        } else {
            return;
        };
    })
};

function syncReceipts() {
    categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
            subcategory.receipts = [];
        })
    })

    receipts.forEach((receipt) => {
        categories[receipt.category].subcategories[receipt.subcategory].receipts.push(receipt.total);
    });
};