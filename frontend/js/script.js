console.log("Personal Finance App is running!");

const addTransactionButton =
    document.getElementById("add-transaction-btn");

const transactionFormSection =
    document.getElementById("transaction-form-section");

const transactionForm =
    document.getElementById("transaction-form");

const cancelTransactionButton =
    document.getElementById("cancel-transaction-btn");

const transactionFormTitle =
    document.getElementById("transaction-form-title");

const transactionSubmitButton =
    document.getElementById("transaction-submit-btn");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const addCategoryButton =
    document.getElementById("add-category-btn");

const categoryFormSection =
    document.getElementById("category-form-section");

const categoryNameInput =
    document.getElementById("category-name");

const saveCategoryButton =
    document.getElementById("save-category-btn");

const cancelCategoryButton =
    document.getElementById("cancel-category-btn");

const summaryMonthInput =
    document.getElementById("summary-month");

const totalBalanceElement =
    document.getElementById("total-balance");

const totalIncomeElement =
    document.getElementById("total-income");

const totalExpenseElement =
    document.getElementById("total-expense");

const setBudgetButton =
    document.getElementById("set-budget-btn");

const budgetFormSection =
    document.getElementById("budget-form-section");

const budgetForm =
    document.getElementById("budget-form");

const cancelBudgetButton =
    document.getElementById("cancel-budget-btn");

const budgetMonthInput =
    document.getElementById("budget-month");

const budgetAmountInput =
    document.getElementById("budget-amount");

const budgetOverviewMonthInput =
    document.getElementById("budget-overview-month");

const monthlyBudgetElement =
    document.getElementById("monthly-budget");

const totalSpentElement =
    document.getElementById("total-spent");

const remainingBudgetElement =
    document.getElementById("remaining-budget");

const budgetPercentageElement =
    document.getElementById("budget-percentage");

const progressFill =
    document.getElementById("progress-fill");

const budgetMonthDisplay =
    document.getElementById("budget-month-display");

const transactionTableBody =
    document.getElementById("transaction-table-body");

const transactionSearchInput =
    document.getElementById("transaction-search");

const transactionTypeFilter =
    document.getElementById("transaction-type-filter");

const transactionCategoryFilter =
    document.getElementById("transaction-category-filter");

const transactionSortInput =
    document.getElementById("transaction-sort");

const pagination =
    document.getElementById("pagination");

const previousPageButton =
    document.getElementById("previous-page-btn");

const paginationNumbers =
    document.getElementById("pagination-numbers");

const nextPageButton =
    document.getElementById("next-page-btn");

let editingTransactionId = null;

let currentPage = 1;

const transactionsPerPage = 5;

const defaultCategories = [
    "Salary",
    "Food",
    "Transportation",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other"
];

function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatMonth(month) {
    const date =
        new Date(month + "-01");

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }).format(date);
}

function getCategories() {

    const savedCategories =
        localStorage.getItem("categories");

    if (savedCategories) {
        return JSON.parse(savedCategories);
    }

    localStorage.setItem(
        "categories",
        JSON.stringify(defaultCategories)
    );

    return defaultCategories;
}

function saveCategories(categories) {

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );
}

function updateTransactionCategoryOptions() {

    const categories =
        getCategories();

    categoryInput.innerHTML = `
        <option value="">
            Select category
        </option>
    `;

    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value =
            category
                .toLowerCase()
                .replace(/\s+/g, "-");

        option.textContent =
            category;

        categoryInput.appendChild(option);
    });
}

function updateTransactionCategoryFilter() {

    const categories =
        getCategories();

    const currentFilterValue =
        transactionCategoryFilter.value;

    transactionCategoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value =
            category
                .toLowerCase()
                .replace(/\s+/g, "-");

        option.textContent =
            category;

        transactionCategoryFilter.appendChild(
            option
        );
    });

    const categoryStillExists =
        categories.some(
            function (category) {

                return (
                    category
                        .toLowerCase()
                        .replace(/\s+/g, "-") ===
                    currentFilterValue
                );
            }
        );

    if (
        currentFilterValue === "all" ||
        categoryStillExists
    ) {
        transactionCategoryFilter.value =
            currentFilterValue;
    } else {
        transactionCategoryFilter.value =
            "all";
    }
}

addCategoryButton.addEventListener(
    "click",
    function () {

        categoryFormSection.classList.remove(
            "hidden"
        );

        categoryNameInput.value = "";

        categoryNameInput.focus();
    }
);

cancelCategoryButton.addEventListener(
    "click",
    function () {

        categoryFormSection.classList.add(
            "hidden"
        );

        categoryNameInput.value = "";
    }
);

saveCategoryButton.addEventListener(
    "click",
    function () {

        const categoryName =
            categoryNameInput.value.trim();

        if (categoryName === "") {

            alert(
                "Please enter a category name."
            );

            return;
        }

        const categories =
            getCategories();

        const categoryExists =
            categories.some(
                function (category) {

                    return category.toLowerCase() ===
                        categoryName.toLowerCase();
                }
            );

        if (categoryExists) {

            alert(
                "This category already exists."
            );

            return;
        }

        categories.push(categoryName);

        saveCategories(categories);

        updateTransactionCategoryOptions();

        updateTransactionCategoryFilter();

        const newCategoryValue =
            categoryName
                .toLowerCase()
                .replace(/\s+/g, "-");

        categoryInput.value =
            newCategoryValue;

        categoryFormSection.classList.add(
            "hidden"
        );

        categoryNameInput.value = "";

        alert(
            "Category added successfully!"
        );
    }
);

function updateSummaryMonthOptions() {

    const currentYear =
        new Date().getFullYear();

    summaryMonthInput.innerHTML = "";

    for (let month = 1; month <= 12; month++) {

        const monthNumber =
            String(month).padStart(2, "0");

        const monthValue =
            currentYear + "-" + monthNumber;

        const option =
            document.createElement("option");

        option.value =
            monthValue;

        option.textContent =
            formatMonth(monthValue);

        summaryMonthInput.appendChild(option);
    }

    const currentMonth =
        currentYear + "-" +
        String(
            new Date().getMonth() + 1
        ).padStart(2, "0");

    summaryMonthInput.value =
        currentMonth;
}

function updateBudgetOverviewMonthOptions() {

    const currentYear =
        new Date().getFullYear();

    budgetOverviewMonthInput.innerHTML = "";

    for (let month = 1; month <= 12; month++) {

        const monthNumber =
            String(month).padStart(2, "0");

        const monthValue =
            currentYear + "-" + monthNumber;

        const option =
            document.createElement("option");

        option.value =
            monthValue;

        option.textContent =
            formatMonth(monthValue);

        budgetOverviewMonthInput.appendChild(
            option
        );
    }

    const currentMonth =
        currentYear + "-" +
        String(
            new Date().getMonth() + 1
        ).padStart(2, "0");

    budgetOverviewMonthInput.value =
        currentMonth;
}

function updateFinancialSummary() {

    const transactions =
        getTransactions();

    const selectedMonth =
        summaryMonthInput.value;

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(
        function (transaction) {

            const transactionMonth =
                transaction.date.substring(0, 7);

            if (
                transactionMonth !==
                selectedMonth
            ) {
                return;
            }

            if (
                transaction.type ===
                "income"
            ) {
                totalIncome +=
                    transaction.amount;
            }

            if (
                transaction.type ===
                "expense"
            ) {
                totalExpense +=
                    transaction.amount;
            }
        }
    );

    const totalBalance =
        totalIncome - totalExpense;

    totalIncomeElement.textContent =
        formatCurrency(totalIncome);

    totalExpenseElement.textContent =
        formatCurrency(totalExpense);

    totalBalanceElement.textContent =
        formatCurrency(totalBalance);
}

function calculateMonthlySpent(month) {

    const transactions =
        getTransactions();

    let monthlySpent = 0;

    transactions.forEach(
        function (transaction) {

            const transactionMonth =
                transaction.date.substring(0, 7);

            if (
                transactionMonth === month &&
                transaction.type === "expense"
            ) {
                monthlySpent +=
                    transaction.amount;
            }
        }
    );

    return monthlySpent;
}

function getBudgets() {

    const savedBudgets =
        localStorage.getItem("budgets");

    if (savedBudgets) {
        return JSON.parse(savedBudgets);
    }

    const oldBudget =
        localStorage.getItem("budget");

    if (oldBudget) {

        const oldBudgetData =
            JSON.parse(oldBudget);

        const budgets = {};

        budgets[oldBudgetData.month] =
            oldBudgetData.amount;

        localStorage.setItem(
            "budgets",
            JSON.stringify(budgets)
        );

        return budgets;
    }

    return {};
}

function saveBudgets(budgets) {

    localStorage.setItem(
        "budgets",
        JSON.stringify(budgets)
    );
}

function updateBudgetOverview() {

    const selectedMonth =
        budgetOverviewMonthInput.value;

    const budgets =
        getBudgets();

    const monthlyBudget =
        budgets[selectedMonth] || 0;

    const totalSpent =
        calculateMonthlySpent(selectedMonth);

    const remainingBudget =
        monthlyBudget - totalSpent;

    let progressPercentage = 0;

    if (monthlyBudget > 0) {

        progressPercentage =
            (totalSpent / monthlyBudget) * 100;
    }

    if (progressPercentage > 100) {
        progressPercentage = 100;
    }

    monthlyBudgetElement.textContent =
        formatCurrency(monthlyBudget);

    totalSpentElement.textContent =
        formatCurrency(totalSpent);

    remainingBudgetElement.textContent =
        formatCurrency(remainingBudget);

    budgetPercentageElement.textContent =
        progressPercentage.toFixed(1) + "%";

    progressFill.style.width =
        progressPercentage + "%";

    budgetMonthDisplay.textContent =
        "Budget for: " +
        formatMonth(selectedMonth);
}

function loadSavedBudget() {

    const budgets =
        getBudgets();

    const selectedMonth =
        budgetOverviewMonthInput.value;

    if (budgets[selectedMonth]) {

        budgetMonthInput.value =
            selectedMonth;

        budgetAmountInput.value =
            budgets[selectedMonth];
    }
}

function getTransactions() {

    const savedTransactions =
        localStorage.getItem("transactions");

    if (savedTransactions) {
        return JSON.parse(savedTransactions);
    }

    return [];
}

function saveTransactions(transactions) {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function sortTransactions(transactions) {

    const sortOption =
        transactionSortInput.value;

    const sortedTransactions =
        [...transactions];

    if (sortOption === "newest") {

        sortedTransactions.sort(
            function (a, b) {

                return new Date(b.date) -
                    new Date(a.date);
            }
        );
    }

    if (sortOption === "oldest") {

        sortedTransactions.sort(
            function (a, b) {

                return new Date(a.date) -
                    new Date(b.date);
            }
        );
    }

    if (sortOption === "highest") {

        sortedTransactions.sort(
            function (a, b) {

                return b.amount -
                    a.amount;
            }
        );
    }

    if (sortOption === "lowest") {

        sortedTransactions.sort(
            function (a, b) {

                return a.amount -
                    b.amount;
            }
        );
    }

    return sortedTransactions;
}

function updatePagination(totalTransactions) {

    const totalPages =
        Math.ceil(
            totalTransactions /
            transactionsPerPage
        );

    if (totalPages <= 1) {

        pagination.classList.add(
            "hidden"
        );

        return;
    }

    pagination.classList.remove(
        "hidden"
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    previousPageButton.disabled =
        currentPage === 1;

    nextPageButton.disabled =
        currentPage === totalPages;

    paginationNumbers.innerHTML = "";

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement("button");

        pageButton.type =
            "button";

        pageButton.textContent =
            page;

        if (page === currentPage) {

            pageButton.classList.add(
                "active"
            );
        }

        pageButton.addEventListener(
            "click",
            function () {

                currentPage = page;

                displayTransactions();
            }
        );

        paginationNumbers.appendChild(
            pageButton
        );
    }
}

function displayTransactions() {

    const transactions =
        getTransactions();

    const searchKeyword =
        transactionSearchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        transactionTypeFilter.value;

    const selectedCategory =
        transactionCategoryFilter.value;

    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                const description =
                    transaction.description
                        .toLowerCase();

                const category =
                    transaction.category
                        .toLowerCase();

                const type =
                    transaction.type
                        .toLowerCase();

                const matchesSearch =
                    description.includes(
                        searchKeyword
                    ) ||
                    category.includes(
                        searchKeyword
                    ) ||
                    type.includes(
                        searchKeyword
                    );

                const matchesType =
                    selectedType === "all" ||
                    type === selectedType;

                const matchesCategory =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );
            }
        );

    const sortedTransactions =
        sortTransactions(
            filteredTransactions
        );

    const totalTransactions =
        sortedTransactions.length;

    const totalPages =
        Math.ceil(
            totalTransactions /
            transactionsPerPage
        );

    if (
        totalPages > 0 &&
        currentPage > totalPages
    ) {
        currentPage = totalPages;
    }

    if (totalPages === 0) {
        currentPage = 1;
    }

    const startIndex =
        (currentPage - 1) *
        transactionsPerPage;

    const endIndex =
        startIndex +
        transactionsPerPage;

    const paginatedTransactions =
        sortedTransactions.slice(
            startIndex,
            endIndex
        );

    transactionTableBody.innerHTML = "";

    paginatedTransactions.forEach(
        function (transaction, index) {

            if (!transaction.id) {

                transaction.id =
                    Date.now() + index;
            }

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${transaction.date}</td>

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ${formatCurrency(
                        transaction.amount
                    )}
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            type="button"
                            class="edit-btn"
                            data-id="${transaction.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${transaction.id}"
                        >
                            Delete
                        </button>

                    </div>
                </td>
            `;

            transactionTableBody.appendChild(row);
        }
    );

    updatePagination(
        totalTransactions
    );

    saveTransactions(transactions);
}

function deleteTransaction(transactionId) {

    const transactions =
        getTransactions();

    const updatedTransactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !==
                    transactionId;
            }
        );

    saveTransactions(
        updatedTransactions
    );

    displayTransactions();

    updateFinancialSummary();

    updateBudgetOverview();
}

function editTransaction(transactionId) {

    const transactions =
        getTransactions();

    const transaction =
        transactions.find(
            function (transaction) {

                return transaction.id ===
                    transactionId;
            }
        );

    if (!transaction) {
        return;
    }

    editingTransactionId =
        transactionId;

    descriptionInput.value =
        transaction.description;

    amountInput.value =
        transaction.amount;

    typeInput.value =
        transaction.type;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;

    transactionFormTitle.textContent =
        "Edit Transaction";

    transactionSubmitButton.textContent =
        "Update Transaction";

    transactionFormSection.classList.remove(
        "hidden"
    );
}

transactionTableBody.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            const transactionId =
                Number(
                    event.target.dataset.id
                );

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this transaction?"
                );

            if (!confirmDelete) {
                return;
            }

            deleteTransaction(
                transactionId
            );
        }

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            const transactionId =
                Number(
                    event.target.dataset.id
                );

            editTransaction(
                transactionId
            );
        }
    }
);

addTransactionButton.addEventListener(
    "click",
    function () {

        editingTransactionId = null;

        transactionForm.reset();

        categoryFormSection.classList.add(
            "hidden"
        );

        transactionFormTitle.textContent =
            "Add Transaction";

        transactionSubmitButton.textContent =
            "Add Transaction";

        transactionFormSection.classList.remove(
            "hidden"
        );

        const today =
            new Date();

        const formattedDate =
            today.toISOString().split("T")[0];

        dateInput.value =
            formattedDate;
    }
);

cancelTransactionButton.addEventListener(
    "click",
    function () {

        editingTransactionId = null;

        transactionForm.reset();

        categoryFormSection.classList.add(
            "hidden"
        );

        transactionFormTitle.textContent =
            "Add Transaction";

        transactionSubmitButton.textContent =
            "Add Transaction";

        transactionFormSection.classList.add(
            "hidden"
        );
    }
);

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const description =
            descriptionInput.value;

        const amount =
            Number(amountInput.value);

        const type =
            typeInput.value;

        const category =
            categoryInput.value;

        const date =
            dateInput.value;

        const transactions =
            getTransactions();

        if (editingTransactionId !== null) {

            const transactionIndex =
                transactions.findIndex(
                    function (transaction) {

                        return transaction.id ===
                            editingTransactionId;
                    }
                );

            if (transactionIndex !== -1) {

                transactions[transactionIndex] = {
                    id: editingTransactionId,
                    date: date,
                    description: description,
                    category: category,
                    type: type,
                    amount: amount
                };

                saveTransactions(
                    transactions
                );

                displayTransactions();

                updateSummaryMonthOptions();

                summaryMonthInput.value =
                    date.substring(0, 7);

                updateFinancialSummary();

                updateBudgetOverview();

                alert(
                    "Transaction updated successfully!"
                );
            }

        } else {

            const transaction = {
                id: Date.now(),
                date: date,
                description: description,
                category: category,
                type: type,
                amount: amount
            };

            transactions.push(
                transaction
            );

            saveTransactions(
                transactions
            );

            displayTransactions();

            updateSummaryMonthOptions();

            summaryMonthInput.value =
                date.substring(0, 7);

            updateFinancialSummary();

            updateBudgetOverview();

            console.log(
                "New Transaction:",
                transaction
            );

            console.log(
                "All Transactions:",
                transactions
            );

            alert(
                "Transaction saved successfully!"
            );
        }

        editingTransactionId = null;

        transactionForm.reset();

        categoryFormSection.classList.add(
            "hidden"
        );

        transactionFormTitle.textContent =
            "Add Transaction";

        transactionSubmitButton.textContent =
            "Add Transaction";

        transactionFormSection.classList.add(
            "hidden"
        );
    }
);

summaryMonthInput.addEventListener(
    "change",
    function () {

        updateFinancialSummary();
    }
);

budgetOverviewMonthInput.addEventListener(
    "change",
    function () {

        loadSavedBudget();

        updateBudgetOverview();
    }
);

transactionSearchInput.addEventListener(
    "input",
    function () {

        currentPage = 1;

        displayTransactions();
    }
);

transactionTypeFilter.addEventListener(
    "change",
    function () {

        currentPage = 1;

        displayTransactions();
    }
);

transactionCategoryFilter.addEventListener(
    "change",
    function () {

        currentPage = 1;

        displayTransactions();
    }
);

transactionSortInput.addEventListener(
    "change",
    function () {

        currentPage = 1;

        displayTransactions();
    }
);

previousPageButton.addEventListener(
    "click",
    function () {

        if (currentPage > 1) {

            currentPage--;

            displayTransactions();
        }
    }
);

nextPageButton.addEventListener(
    "click",
    function () {

        const transactions =
            getTransactions();

        const searchKeyword =
            transactionSearchInput.value
                .toLowerCase()
                .trim();

        const selectedType =
            transactionTypeFilter.value;

        const selectedCategory =
            transactionCategoryFilter.value;

        const filteredTransactions =
            transactions.filter(
                function (transaction) {

                    const description =
                        transaction.description
                            .toLowerCase();

                    const category =
                        transaction.category
                            .toLowerCase();

                    const type =
                        transaction.type
                            .toLowerCase();

                    const matchesSearch =
                        description.includes(
                            searchKeyword
                        ) ||
                        category.includes(
                            searchKeyword
                        ) ||
                        type.includes(
                            searchKeyword
                        );

                    const matchesType =
                        selectedType === "all" ||
                        type === selectedType;

                    const matchesCategory =
                        selectedCategory === "all" ||
                        category === selectedCategory;

                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesCategory
                    );
                }
            );

        const totalPages =
            Math.ceil(
                filteredTransactions.length /
                transactionsPerPage
            );

        if (currentPage < totalPages) {

            currentPage++;

            displayTransactions();
        }
    }
);

setBudgetButton.addEventListener(
    "click",
    function () {

        budgetFormSection.classList.remove(
            "hidden"
        );

        const selectedMonth =
            budgetOverviewMonthInput.value;

        budgetMonthInput.value =
            selectedMonth;

        const budgets =
            getBudgets();

        if (budgets[selectedMonth]) {

            budgetAmountInput.value =
                budgets[selectedMonth];

        } else {

            budgetAmountInput.value = "";
        }
    }
);

cancelBudgetButton.addEventListener(
    "click",
    function () {

        budgetForm.reset();

        budgetFormSection.classList.add(
            "hidden"
        );
    }
);

budgetForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const budgetMonth =
            budgetMonthInput.value;

        const budgetAmount =
            Number(
                budgetAmountInput.value
            );

        if (budgetAmount <= 0) {

            alert(
                "Budget amount must be greater than 0."
            );

            return;
        }

        const budgets =
            getBudgets();

        budgets[budgetMonth] =
            budgetAmount;

        saveBudgets(
            budgets
        );

        budgetOverviewMonthInput.value =
            budgetMonth;

        updateBudgetOverview();

        console.log(
            "Budget Saved:",
            budgetMonth,
            budgetAmount
        );

        console.log(
            "All Budgets:",
            budgets
        );

        alert(
            "Budget saved successfully!"
        );

        budgetForm.reset();

        budgetFormSection.classList.add(
            "hidden"
        );
    }
);

updateSummaryMonthOptions();

updateBudgetOverviewMonthOptions();

updateTransactionCategoryOptions();

updateTransactionCategoryFilter();

loadSavedBudget();

displayTransactions();

updateFinancialSummary();

updateBudgetOverview();