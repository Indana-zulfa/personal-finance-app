console.log("Personal Finance App is running!");

/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */

// Dashboard
const summaryMonthInput =
    document.getElementById("summary-month");

const totalIncomeElement =
    document.getElementById("total-income");

const totalExpenseElement =
    document.getElementById("total-expense");

const balanceElement =
    document.getElementById("balance");

const dashboardBudgetOverviewMonthInput =
    document.getElementById("budget-overview-month");

const dashboardOverviewBudgetElement =
    document.getElementById("overview-budget");

const dashboardOverviewSpentElement =
    document.getElementById("overview-spent");

const dashboardOverviewRemainingElement =
    document.getElementById("overview-remaining");

const dashboardBudgetProgress =
    document.getElementById("budget-progress");

const dashboardBudgetProgressText =
    document.getElementById("budget-progress-text");

const dashboardTransactionTableBody =
    document.getElementById("transaction-table-body");


// Transactions Page
const transactionForm =
    document.getElementById("transaction-form");

const transactionTypeInput =
    document.getElementById("transaction-type");

const transactionAmountInput =
    document.getElementById("transaction-amount");

const transactionCategoryInput =
    document.getElementById("transaction-category");

const transactionDescriptionInput =
    document.getElementById("transaction-description");

const transactionDateInput =
    document.getElementById("transaction-date");

const transactionSubmitButton =
    document.getElementById("transaction-submit");

const cancelEditButton =
    document.getElementById("cancel-edit");

const showCategoryFormButton =
    document.getElementById("show-category-form");

const categoryInputContainer =
    document.getElementById("category-input-container");

const newCategoryInput =
    document.getElementById("new-category");

const saveCategoryButton =
    document.getElementById("save-category");

const cancelCategoryButton =
    document.getElementById("cancel-category");

const transactionSearchInput =
    document.getElementById("transaction-search");

const transactionTypeFilter =
    document.getElementById("filter-type");

const transactionCategoryFilter =
    document.getElementById("filter-category");

const transactionSortInput =
    document.getElementById("transaction-sort");

const transactionHistoryTableBody =
    document.getElementById("transaction-table-body");

const pagination =
    document.getElementById("pagination");


// Budget Page
const budgetForm =
    document.getElementById("budget-form");

const budgetMonthInput =
    document.getElementById("budget-month");

const budgetAmountInput =
    document.getElementById("budget-amount");

const budgetCancelButton =
    document.getElementById("cancel-budget");

const budgetOverviewMonthInput =
    document.getElementById("budget-overview-month");

const budgetOverviewElement =
    document.getElementById("overview-budget");

const budgetSpentElement =
    document.getElementById("overview-spent");

const budgetRemainingElement =
    document.getElementById("overview-remaining");

const budgetProgress =
    document.getElementById("budget-progress");

const budgetProgressText =
    document.getElementById("budget-progress-text");


// Analytics Page
const expenseChartMonthInput =
    document.getElementById("expense-chart-month");

const expenseChartCanvas =
    document.getElementById("expense-chart");

const analyticsTotalIncomeElement =
    document.getElementById("analytics-total-income");

const analyticsTotalExpenseElement =
    document.getElementById("analytics-total-expense");

const analyticsNetBalanceElement =
    document.getElementById("analytics-net-balance");

const financialInsightsElement =
    document.getElementById("financial-insights");

const expenseComparisonChartCanvas =
    document.getElementById("expense-comparison-chart");


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let editingTransactionId = null;

let currentPage = 1;

const transactionsPerPage = 5;

let expenseChart = null;

let expenseComparisonChart = null;


/* =========================================================
   DEFAULT CATEGORIES
   ========================================================= */

const defaultCategories = [
    "Salary",
    "Food",
    "Transportation",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other"
];


/* =========================================================
   CURRENCY & MONTH FORMAT
   ========================================================= */

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


/* =========================================================
   CATEGORY STORAGE
   ========================================================= */

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


/* =========================================================
   CATEGORY OPTIONS
   ========================================================= */

function categoryToValue(category) {

    return category
        .toLowerCase()
        .replace(/\s+/g, "-");
}


function updateTransactionCategoryOptions() {

    if (!transactionCategoryInput) {
        return;
    }

    const categories =
        getCategories();

    transactionCategoryInput.innerHTML = `
        <option value="">
            Select category
        </option>
    `;

    categories.forEach(
        function (category) {

            const option =
                document.createElement("option");

            option.value =
                categoryToValue(category);

            option.textContent =
                category;

            transactionCategoryInput.appendChild(
                option
            );
        }
    );
}


function updateTransactionCategoryFilter() {

    if (!transactionCategoryFilter) {
        return;
    }

    const categories =
        getCategories();

    const currentFilterValue =
        transactionCategoryFilter.value;

    transactionCategoryFilter.innerHTML = `
        <option value="">
            All Categories
        </option>
    `;

    categories.forEach(
        function (category) {

            const option =
                document.createElement("option");

            option.value =
                categoryToValue(category);

            option.textContent =
                category;

            transactionCategoryFilter.appendChild(
                option
            );
        }
    );

    const categoryStillExists =
        categories.some(
            function (category) {

                return (
                    categoryToValue(category) ===
                    currentFilterValue
                );
            }
        );

    if (
        currentFilterValue === "" ||
        categoryStillExists
    ) {

        transactionCategoryFilter.value =
            currentFilterValue;

    } else {

        transactionCategoryFilter.value = "";
    }
}


/* =========================================================
   CATEGORY FORM
   ========================================================= */

if (showCategoryFormButton) {

    showCategoryFormButton.addEventListener(
        "click",
        function () {

            categoryInputContainer.hidden = false;

            newCategoryInput.value = "";

            newCategoryInput.focus();
        }
    );
}


if (cancelCategoryButton) {

    cancelCategoryButton.addEventListener(
        "click",
        function () {

            categoryInputContainer.hidden = true;

            newCategoryInput.value = "";
        }
    );
}


if (saveCategoryButton) {

    saveCategoryButton.addEventListener(
        "click",
        function () {

            const categoryName =
                newCategoryInput.value.trim();

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

                        return (
                            category.toLowerCase() ===
                            categoryName.toLowerCase()
                        );
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

            transactionCategoryInput.value =
                categoryToValue(categoryName);

            categoryInputContainer.hidden = true;

            newCategoryInput.value = "";

            alert(
                "Category added successfully!"
            );
        }
    );
}


/* =========================================================
   TRANSACTION STORAGE
   ========================================================= */

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


/* =========================================================
   TRANSACTION DISPLAY
   ========================================================= */

function getCategoryDisplayName(categoryValue) {

    const categories =
        getCategories();

    const matchingCategory =
        categories.find(
            function (category) {

                return (
                    categoryToValue(category) ===
                    categoryValue
                );
            }
        );

    if (matchingCategory) {

        return matchingCategory;
    }

    return categoryValue
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            function (letter) {

                return letter.toUpperCase();
            }
        );
}


/* =========================================================
   SORT TRANSACTIONS
   ========================================================= */

function sortTransactions(transactions) {

    if (!transactionSortInput) {

        return transactions;
    }

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


/* =========================================================
   TRANSACTION FILTERING
   ========================================================= */

function getFilteredTransactions() {

    const transactions =
        getTransactions();

    if (
        !transactionSearchInput ||
        !transactionTypeFilter ||
        !transactionCategoryFilter
    ) {

        return transactions;
    }

    const searchKeyword =
        transactionSearchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        transactionTypeFilter.value;

    const selectedCategory =
        transactionCategoryFilter.value;

    return transactions.filter(
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
                selectedType === "" ||
                type === selectedType;

            const matchesCategory =
                selectedCategory === "" ||
                category === selectedCategory;

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );
        }
    );
}


/* =========================================================
   PAGINATION
   ========================================================= */

function updatePagination(totalTransactions) {

    if (
        !pagination ||
        !transactionHistoryTableBody
    ) {

        return;
    }

    const totalPages =
        Math.ceil(
            totalTransactions /
            transactionsPerPage
        );

    if (totalPages <= 1) {

        pagination.innerHTML = "";

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

    pagination.innerHTML = "";

    const previousButton =
        document.createElement("button");

    previousButton.type =
        "button";

    previousButton.textContent =
        "Previous";

    previousButton.disabled =
        currentPage === 1;

    previousButton.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                displayTransactions();
            }
        }
    );

    pagination.appendChild(
        previousButton
    );

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

        pagination.appendChild(
            pageButton
        );
    }

    const nextButton =
        document.createElement("button");

    nextButton.type =
        "button";

    nextButton.textContent =
        "Next";

    nextButton.disabled =
        currentPage === totalPages;

    nextButton.addEventListener(
        "click",
        function () {

            if (currentPage < totalPages) {

                currentPage++;

                displayTransactions();
            }
        }
    );

    pagination.appendChild(
        nextButton
    );
}


/* =========================================================
   DISPLAY TRANSACTIONS - TRANSACTIONS PAGE
   ========================================================= */

function displayTransactions() {

    if (!transactionHistoryTableBody) {

        return;
    }

    const filteredTransactions =
        getFilteredTransactions();

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

    transactionHistoryTableBody.innerHTML = "";

    if (paginatedTransactions.length === 0) {

        transactionHistoryTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No transactions found.
                </td>
            </tr>
        `;

    } else {

        paginatedTransactions.forEach(
            function (transaction, index) {

                if (!transaction.id) {

                    transaction.id =
                        Date.now() + index;
                }

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>
                        ${transaction.date}
                    </td>

                    <td>
                        ${transaction.description}
                    </td>

                    <td>
                        ${getCategoryDisplayName(
                            transaction.category
                        )}
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

                transactionHistoryTableBody.appendChild(
                    row
                );
            }
        );
    }

    updatePagination(
        totalTransactions
    );

    saveTransactions(
        getTransactions()
    );
}


/* =========================================================
   DASHBOARD - RECENT TRANSACTIONS
   ========================================================= */

function displayRecentTransactions() {

    if (!dashboardTransactionTableBody) {

        return;
    }

    const transactions =
        getTransactions();

    const sortedTransactions =
        [...transactions].sort(
            function (a, b) {

                return new Date(b.date) -
                    new Date(a.date);
            }
        );

    const recentTransactions =
        sortedTransactions.slice(0, 5);

    dashboardTransactionTableBody.innerHTML = "";

    if (recentTransactions.length === 0) {

        dashboardTransactionTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions yet.
                </td>
            </tr>
        `;

        return;
    }

    recentTransactions.forEach(
        function (transaction) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${transaction.date}
                </td>

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${getCategoryDisplayName(
                        transaction.category
                    )}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ${formatCurrency(
                        transaction.amount
                    )}
                </td>
            `;

            dashboardTransactionTableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   DELETE TRANSACTION
   ========================================================= */

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

    currentPage = 1;

    displayTransactions();

    displayRecentTransactions();

    updateFinancialSummary();

    updateDashboardBudgetOverview();

    updateBudgetOverview();

    updateAnalytics();

    updateExpenseChart();

    updateExpenseComparisonChart();
}


/* =========================================================
   EDIT TRANSACTION
   ========================================================= */

function editTransaction(transactionId) {

    if (
        !transactionForm ||
        !transactionTypeInput ||
        !transactionAmountInput ||
        !transactionCategoryInput ||
        !transactionDescriptionInput ||
        !transactionDateInput ||
        !transactionSubmitButton
    ) {

        return;
    }

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

    transactionTypeInput.value =
        transaction.type;

    transactionAmountInput.value =
        transaction.amount;

    transactionCategoryInput.value =
        transaction.category;

    transactionDescriptionInput.value =
        transaction.description;

    transactionDateInput.value =
        transaction.date;

    transactionSubmitButton.textContent =
        "Update Transaction";

    if (cancelEditButton) {

        cancelEditButton.hidden = false;
    }

    transactionForm.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   TRANSACTION TABLE ACTIONS
   ========================================================= */

if (transactionHistoryTableBody) {

    transactionHistoryTableBody.addEventListener(
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
}


/* =========================================================
   TRANSACTION FORM
   ========================================================= */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const type =
                transactionTypeInput.value;

            const amount =
                Number(
                    transactionAmountInput.value
                );

            const category =
                transactionCategoryInput.value;

            const description =
                transactionDescriptionInput.value.trim();

            const date =
                transactionDateInput.value;

            if (amount <= 0) {

                alert(
                    "Amount must be greater than 0."
                );

                return;
            }

            const transactions =
                getTransactions();

            if (
                editingTransactionId !== null
            ) {

                const transactionIndex =
                    transactions.findIndex(
                        function (transaction) {

                            return (
                                transaction.id ===
                                editingTransactionId
                            );
                        }
                    );

                if (
                    transactionIndex !== -1
                ) {

                    transactions[
                        transactionIndex
                    ] = {

                        id:
                            editingTransactionId,

                        type:
                            type,

                        amount:
                            amount,

                        category:
                            category,

                        description:
                            description,

                        date:
                            date
                    };

                    saveTransactions(
                        transactions
                    );

                    alert(
                        "Transaction updated successfully!"
                    );
                }

            } else {

                const transaction = {

                    id:
                        Date.now(),

                    type:
                        type,

                    amount:
                        amount,

                    category:
                        category,

                    description:
                        description,

                    date:
                        date
                };

                transactions.push(
                    transaction
                );

                saveTransactions(
                    transactions
                );

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

            transactionSubmitButton.textContent =
                "Add Transaction";

            if (cancelEditButton) {

                cancelEditButton.hidden = true;
            }

            if (categoryInputContainer) {

                categoryInputContainer.hidden = true;
            }

            displayTransactions();

            displayRecentTransactions();

            updateSummaryMonthOptions();

            if (
                summaryMonthInput &&
                date
            ) {

                summaryMonthInput.value =
                    date.substring(0, 7);
            }

            updateFinancialSummary();

            updateDashboardBudgetOverview();

            updateBudgetOverview();

            updateAnalytics();

            updateExpenseChart();

            updateExpenseComparisonChart();
        }
    );
}


/* =========================================================
   CANCEL EDIT
   ========================================================= */

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            editingTransactionId = null;

            transactionForm.reset();

            transactionSubmitButton.textContent =
                "Add Transaction";

            cancelEditButton.hidden = true;

            if (categoryInputContainer) {

                categoryInputContainer.hidden = true;
            }
        }
    );
}


/* =========================================================
   SET TODAY AS DEFAULT TRANSACTION DATE
   ========================================================= */

function setDefaultTransactionDate() {

    if (!transactionDateInput) {

        return;
    }

    if (transactionDateInput.value !== "") {

        return;
    }

    const today =
        new Date();

    const formattedDate =
        today.toISOString().split("T")[0];

    transactionDateInput.value =
        formattedDate;
}


/* =========================================================
   SEARCH / FILTER / SORT
   ========================================================= */

if (transactionSearchInput) {

    transactionSearchInput.addEventListener(
        "input",
        function () {

            currentPage = 1;

            displayTransactions();
        }
    );
}


if (transactionTypeFilter) {

    transactionTypeFilter.addEventListener(
        "change",
        function () {

            currentPage = 1;

            displayTransactions();
        }
    );
}


if (transactionCategoryFilter) {

    transactionCategoryFilter.addEventListener(
        "change",
        function () {

            currentPage = 1;

            displayTransactions();
        }
    );
}


if (transactionSortInput) {

    transactionSortInput.addEventListener(
        "change",
        function () {

            currentPage = 1;

            displayTransactions();
        }
    );
}


/* =========================================================
   FINANCIAL SUMMARY - DASHBOARD
   ========================================================= */

function updateSummaryMonthOptions() {

    if (!summaryMonthInput) {

        return;
    }

    const currentYear =
        new Date().getFullYear();

    summaryMonthInput.innerHTML = "";

    for (
        let month = 1;
        month <= 12;
        month++
    ) {

        const monthNumber =
            String(month).padStart(2, "0");

        const monthValue =
            currentYear + "-" +
            monthNumber;

        const option =
            document.createElement("option");

        option.value =
            monthValue;

        option.textContent =
            formatMonth(monthValue);

        summaryMonthInput.appendChild(
            option
        );
    }

    const currentMonth =
        currentYear + "-" +
        String(
            new Date().getMonth() + 1
        ).padStart(2, "0");

    summaryMonthInput.value =
        currentMonth;
}


function calculateMonthlyTotals(month) {

    const transactions =
        getTransactions();

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(
        function (transaction) {

            const transactionMonth =
                transaction.date.substring(0, 7);

            if (
                transactionMonth !== month
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

    return {
        totalIncome,
        totalExpense,
        balance:
            totalIncome - totalExpense
    };
}


function updateFinancialSummary() {

    if (
        !summaryMonthInput ||
        !totalIncomeElement ||
        !totalExpenseElement ||
        !balanceElement
    ) {

        return;
    }

    const selectedMonth =
        summaryMonthInput.value;

    const totals =
        calculateMonthlyTotals(
            selectedMonth
        );

    totalIncomeElement.textContent =
        formatCurrency(
            totals.totalIncome
        );

    totalExpenseElement.textContent =
        formatCurrency(
            totals.totalExpense
        );

    balanceElement.textContent =
        formatCurrency(
            totals.balance
        );
}


if (summaryMonthInput) {

    summaryMonthInput.addEventListener(
        "change",
        function () {

            updateFinancialSummary();
        }
    );
}


/* =========================================================
   BUDGET STORAGE
   ========================================================= */

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


/* =========================================================
   MONTHLY SPENDING
   ========================================================= */

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


/* =========================================================
   BUDGET MONTH OPTIONS
   ========================================================= */

function updateBudgetOverviewMonthOptions() {

    if (!budgetOverviewMonthInput) {

        return;
    }

    const currentYear =
        new Date().getFullYear();

    budgetOverviewMonthInput.innerHTML = "";

    for (
        let month = 1;
        month <= 12;
        month++
    ) {

        const monthNumber =
            String(month).padStart(2, "0");

        const monthValue =
            currentYear + "-" +
            monthNumber;

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


/* =========================================================
   DASHBOARD BUDGET OVERVIEW
   ========================================================= */

function updateDashboardBudgetOverview() {

    if (
        !dashboardBudgetOverviewMonthInput ||
        !dashboardOverviewBudgetElement ||
        !dashboardOverviewSpentElement ||
        !dashboardOverviewRemainingElement ||
        !dashboardBudgetProgress ||
        !dashboardBudgetProgressText
    ) {

        return;
    }

    const selectedMonth =
        dashboardBudgetOverviewMonthInput.value;

    const budgets =
        getBudgets();

    const monthlyBudget =
        budgets[selectedMonth] || 0;

    const totalSpent =
        calculateMonthlySpent(
            selectedMonth
        );

    const remainingBudget =
        monthlyBudget - totalSpent;

    let progressPercentage = 0;

    if (monthlyBudget > 0) {

        progressPercentage =
            (totalSpent / monthlyBudget) * 100;
    }

    const displayProgress =
        Math.min(
            Math.max(progressPercentage, 0),
            100
        );

    dashboardOverviewBudgetElement.textContent =
        formatCurrency(
            monthlyBudget
        );

    dashboardOverviewSpentElement.textContent =
        formatCurrency(
            totalSpent
        );

    dashboardOverviewRemainingElement.textContent =
        formatCurrency(
            remainingBudget
        );

    dashboardBudgetProgress.style.width =
        displayProgress + "%";

    dashboardBudgetProgressText.textContent =
        progressPercentage.toFixed(1) +
        "% used";
}


/* =========================================================
   BUDGET PAGE OVERVIEW
   ========================================================= */

function updateBudgetOverview() {

    if (
        !budgetOverviewMonthInput ||
        !budgetOverviewElement ||
        !budgetSpentElement ||
        !budgetRemainingElement ||
        !budgetProgress ||
        !budgetProgressText
    ) {

        return;
    }

    const selectedMonth =
        budgetOverviewMonthInput.value;

    const budgets =
        getBudgets();

    const monthlyBudget =
        budgets[selectedMonth] || 0;

    const totalSpent =
        calculateMonthlySpent(
            selectedMonth
        );

    const remainingBudget =
        monthlyBudget - totalSpent;

    let progressPercentage = 0;

    if (monthlyBudget > 0) {

        progressPercentage =
            (totalSpent / monthlyBudget) * 100;
    }

    const displayProgress =
        Math.min(
            Math.max(progressPercentage, 0),
            100
        );

    budgetOverviewElement.textContent =
        formatCurrency(
            monthlyBudget
        );

    budgetSpentElement.textContent =
        formatCurrency(
            totalSpent
        );

    budgetRemainingElement.textContent =
        formatCurrency(
            remainingBudget
        );

    budgetProgress.style.width =
        displayProgress + "%";

    budgetProgressText.textContent =
        progressPercentage.toFixed(1) +
        "% used";
}


/* =========================================================
   LOAD SAVED BUDGET
   ========================================================= */

function loadSavedBudget() {

    if (
        !budgetOverviewMonthInput ||
        !budgetMonthInput ||
        !budgetAmountInput
    ) {

        return;
    }

    const budgets =
        getBudgets();

    const selectedMonth =
        budgetOverviewMonthInput.value;

    budgetMonthInput.value =
        selectedMonth;

    if (
        budgets[selectedMonth] !== undefined
    ) {

        budgetAmountInput.value =
            budgets[selectedMonth];

    } else {

        budgetAmountInput.value = "";
    }
}


/* =========================================================
   BUDGET FORM
   ========================================================= */

if (budgetForm) {

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

            if (!budgetMonth) {

                alert(
                    "Please select a month."
                );

                return;
            }

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

            if (budgetOverviewMonthInput) {

                budgetOverviewMonthInput.value =
                    budgetMonth;
            }

            updateBudgetOverview();

            updateDashboardBudgetOverview();

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

            loadSavedBudget();
        }
    );
}


if (budgetCancelButton) {

    budgetCancelButton.addEventListener(
        "click",
        function () {

            budgetForm.reset();

            loadSavedBudget();
        }
    );
}


if (budgetOverviewMonthInput) {

    budgetOverviewMonthInput.addEventListener(
        "change",
        function () {

            loadSavedBudget();

            updateBudgetOverview();
        }
    );
}


if (dashboardBudgetOverviewMonthInput) {

    dashboardBudgetOverviewMonthInput.addEventListener(
        "change",
        function () {

            updateDashboardBudgetOverview();
        }
    );
}


/* =========================================================
   ANALYTICS MONTH OPTIONS
   ========================================================= */

function updateExpenseChartMonthOptions() {

    if (!expenseChartMonthInput) {

        return;
    }

    const currentYear =
        new Date().getFullYear();

    expenseChartMonthInput.innerHTML = "";

    for (
        let month = 1;
        month <= 12;
        month++
    ) {

        const monthNumber =
            String(month).padStart(2, "0");

        const monthValue =
            currentYear + "-" +
            monthNumber;

        const option =
            document.createElement("option");

        option.value =
            monthValue;

        option.textContent =
            formatMonth(monthValue);

        expenseChartMonthInput.appendChild(
            option
        );
    }

    const currentMonth =
        currentYear + "-" +
        String(
            new Date().getMonth() + 1
        ).padStart(2, "0");

    expenseChartMonthInput.value =
        currentMonth;
}


/* =========================================================
   ANALYTICS SUMMARY
   ========================================================= */

function updateAnalytics() {

    if (
        !expenseChartMonthInput ||
        !analyticsTotalIncomeElement ||
        !analyticsTotalExpenseElement ||
        !analyticsNetBalanceElement
    ) {

        return;
    }

    const selectedMonth =
        expenseChartMonthInput.value;

    const totals =
        calculateMonthlyTotals(
            selectedMonth
        );

    analyticsTotalIncomeElement.textContent =
        formatCurrency(
            totals.totalIncome
        );

    analyticsTotalExpenseElement.textContent =
        formatCurrency(
            totals.totalExpense
        );

    analyticsNetBalanceElement.textContent =
        formatCurrency(
            totals.balance
        );
}


/* =========================================================
   EXPENSE BY CATEGORY CHART
   ========================================================= */

function updateExpenseChart() {

    if (
        !expenseChartMonthInput ||
        !expenseChartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }

    const selectedMonth =
        expenseChartMonthInput.value;

    const transactions =
        getTransactions();

    const expenseByCategory = {};

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
                transaction.type !==
                "expense"
            ) {

                return;
            }

            const category =
                transaction.category;

            if (
                !expenseByCategory[category]
            ) {

                expenseByCategory[category] =
                    0;
            }

            expenseByCategory[category] +=
                transaction.amount;
        }
    );

    const categories =
        Object.keys(
            expenseByCategory
        );

    const amounts =
        Object.values(
            expenseByCategory
        );

    if (expenseChart) {

        expenseChart.destroy();

        expenseChart = null;
    }

    if (categories.length === 0) {

        return;
    }

    const categoryLabels =
        categories.map(
            function (category) {

                return getCategoryDisplayName(
                    category
                );
            }
        );

    expenseChart =
        new Chart(
            expenseChartCanvas,
            {
                type: "pie",

                data: {

                    labels:
                        categoryLabels,

                    datasets: [
                        {
                            label:
                                "Expenses",

                            data:
                                amounts
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            position:
                                "bottom"
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        const value =
                                            context.raw;

                                        return (
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                value
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================================
   EXPENSE COMPARISON CHART
   ========================================================= */

function updateExpenseComparisonChart() {

    if (
        !expenseChartMonthInput ||
        !expenseComparisonChartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }

    const selectedMonth =
        expenseChartMonthInput.value;

    const transactions =
        getTransactions();

    const expenseByCategory = {};

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
                transaction.type !==
                "expense"
            ) {

                return;
            }

            const category =
                transaction.category;

            if (
                !expenseByCategory[category]
            ) {

                expenseByCategory[category] =
                    0;
            }

            expenseByCategory[category] +=
                transaction.amount;
        }
    );

    const categories =
        Object.keys(
            expenseByCategory
        );

    const amounts =
        Object.values(
            expenseByCategory
        );

    if (expenseComparisonChart) {

        expenseComparisonChart.destroy();

        expenseComparisonChart = null;
    }

    if (categories.length === 0) {

        return;
    }

    const categoryLabels =
        categories.map(
            function (category) {

                return getCategoryDisplayName(
                    category
                );
            }
        );

    expenseComparisonChart =
        new Chart(
            expenseComparisonChartCanvas,
            {
                type: "bar",

                data: {

                    labels:
                        categoryLabels,

                    datasets: [
                        {
                            label:
                                "Expense",

                            data:
                                amounts
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function (value) {

                                        return formatCurrency(
                                            value
                                        );
                                    }
                            }
                        }
                    },

                    plugins: {

                        legend: {
                            display:
                                false
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            "Expense: " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================================
   FINANCIAL INSIGHTS
   ========================================================= */

function updateFinancialInsights() {

    if (
        !expenseChartMonthInput ||
        !financialInsightsElement
    ) {

        return;
    }

    const selectedMonth =
        expenseChartMonthInput.value;

    const totals =
        calculateMonthlyTotals(
            selectedMonth
        );

    const transactions =
        getTransactions();

    const monthlyExpenses =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.date.substring(0, 7) ===
                    selectedMonth &&
                    transaction.type ===
                    "expense"
                );
            }
        );

    if (totals.totalIncome === 0 &&
        totals.totalExpense === 0) {

        financialInsightsElement.innerHTML = `
            <p>
                No financial data available for this month.
            </p>
        `;

        return;
    }

    if (monthlyExpenses.length === 0) {

        financialInsightsElement.innerHTML = `
            <p>
                No expenses recorded for this month.
            </p>
        `;

        return;
    }

    let highestCategory =
        monthlyExpenses[0].category;

    let highestAmount =
        monthlyExpenses[0].amount;

    const categoryTotals = {};

    monthlyExpenses.forEach(
        function (transaction) {

            if (
                !categoryTotals[
                    transaction.category
                ]
            ) {

                categoryTotals[
                    transaction.category
                ] = 0;
            }

            categoryTotals[
                transaction.category
            ] += transaction.amount;
        }
    );

    Object.keys(categoryTotals).forEach(
        function (category) {

            if (
                categoryTotals[category] >
                highestAmount
            ) {

                highestCategory =
                    category;

                highestAmount =
                    categoryTotals[category];
            }
        }
    );

    const expenseRatio =
        totals.totalIncome > 0
            ? (
                totals.totalExpense /
                totals.totalIncome
            ) * 100
            : 0;

    financialInsightsElement.innerHTML = `
        <p>
            Your highest expense category this month is
            <strong>
                ${getCategoryDisplayName(
                    highestCategory
                )}
            </strong>
            with
            <strong>
                ${formatCurrency(
                    highestAmount
                )}
            </strong>.
        </p>

        <p>
            Your expenses represent approximately
            <strong>
                ${expenseRatio.toFixed(1)}%
            </strong>
            of your income this month.
        </p>
    `;
}


/* =========================================================
   ANALYTICS MONTH CHANGE
   ========================================================= */

if (expenseChartMonthInput) {

    expenseChartMonthInput.addEventListener(
        "change",
        function () {

            updateAnalytics();

            updateExpenseChart();

            updateExpenseComparisonChart();

            updateFinancialInsights();
        }
    );
}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

updateSummaryMonthOptions();

updateBudgetOverviewMonthOptions();

updateExpenseChartMonthOptions();

updateTransactionCategoryOptions();

updateTransactionCategoryFilter();

setDefaultTransactionDate();

loadSavedBudget();

displayTransactions();

displayRecentTransactions();

updateFinancialSummary();

updateDashboardBudgetOverview();

updateBudgetOverview();

updateAnalytics();

updateExpenseChart();

updateExpenseComparisonChart();

updateFinancialInsights();