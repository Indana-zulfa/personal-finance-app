console.log("Personal Finance App is running!");

const addTransactionButton = document.getElementById("add-transaction-btn");
const transactionFormSection = document.getElementById("transaction-form-section");
const transactionForm = document.getElementById("transaction-form");
const cancelTransactionButton = document.getElementById("cancel-transaction-btn");
const dateInput = document.getElementById("date");

addTransactionButton.addEventListener("click", function () {
    transactionFormSection.classList.remove("hidden");

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    dateInput.value = formattedDate;
});

cancelTransactionButton.addEventListener("click", function () {
    transactionForm.reset();
    transactionFormSection.classList.add("hidden");
});

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Transaction saved successfully!");

    transactionForm.reset();
    transactionFormSection.classList.add("hidden");
});