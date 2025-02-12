const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

updateFinances();
updatetransactions();

function formatDate(inputDate) {
    let date = new Date(inputDate);

    let day = date.getDate();
    let month = date.toLocaleString("en-US", { month: "short" }); // "Feb"
    let year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

document.querySelector('.add').addEventListener('click', () => {
    const nameInput = document.querySelector('.transaction-name');
    const amountInput = document.querySelector('.transaction-amount');
    const categoryInput = document.getElementById("category");
    const dateInput = document.querySelector('.transaction-date');

    const name = nameInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    let valid = true;

    if (name === '') {
        nameInput.classList.add('is-invalid');
        valid = false;
    } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
    }

    if (isNaN(amount) || amountInput.value === '') {
        amountInput.classList.add('is-invalid');
        valid = false;
    } else {
        amountInput.classList.remove('is-invalid');
        amountInput.classList.add('is-valid');
    }

    if (category === 'Choose...') {
        categoryInput.classList.add('is-invalid');
        valid = false;
    } else {
        categoryInput.classList.remove('is-invalid');
        categoryInput.classList.add('is-valid');
    }

    if (date === '') {
        dateInput.classList.add('is-invalid');
        valid = false;
    } else {
        dateInput.classList.remove('is-invalid');
        dateInput.classList.add('is-valid');
    }

    if (!valid) {
        const notificationBox = document.querySelector('.notification');
        notificationBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Please Complete Empty Fields!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        setTimeout(() => {
            let alert = notificationBox.querySelector('.alert');
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 1500);
    } else {
        transactions.push({
            name,
            amount: (amount * 100),
            category,
            date
        });

        const notificationBox = document.querySelector('.notification');
        notificationBox.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Added Successfully!</strong>
        </div>`;

        setTimeout(() => {
            let alert = notificationBox.querySelector('.alert');
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 200);
        }, 1500);

        nameInput.value = '';
        nameInput.classList.remove('is-valid');
        amountInput.value = '';
        amountInput.classList.remove('is-valid');
        dateInput.value = '';
        dateInput.classList.remove('is-valid');
        categoryInput.value = 'Choose...';
        categoryInput.classList.remove('is-valid');
    }


    saveTransactions();
    updateFinances();
    updatetransactions();
});


document.querySelector('.print').addEventListener('click', () => {
    const elementsToHide = document.querySelectorAll('.add-transaction,.transaction-name,.transaction-amount,.transaction-date,.transaction-category,.add,.search-bar ,.delete ,.edit ,.bx');
    elementsToHide.forEach(el => el.style.display = 'none');

    window.print();

    elementsToHide.forEach(el => el.style.display = '');
});

document.querySelector('.download-csv').addEventListener('click', () => {
    let csvContent = "Transaction Name,Amount,Category,Date\n";

    transactions.forEach(transaction => {
        csvContent += `"${transaction.name}",${(transaction.amount / 100).toFixed(2)},"${transaction.category}","${transaction.date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

function nameStyle(text) {
    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function updateFinances() {
    let income = 0;
    let expenses = 0;
    let balance = 0;
    let categoryTotals = {};

    transactions.forEach((transaction) => {
        if (transaction.category === 'Income') {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;

            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        }
        balance = income - expenses;
    });

    const incomeElement = document.querySelector('.income');
    const expensesElement = document.querySelector('.expenses');
    const balanceElement = document.querySelector('.balance');

    incomeElement.style.opacity = '0.5';
    expensesElement.style.opacity = '0.5';
    balanceElement.style.opacity = '0.5';

    setTimeout(() => {
        incomeElement.textContent = `$${(income / 100).toFixed(2)}`;
        expensesElement.textContent = `$${(expenses / 100).toFixed(2)}`;
        balanceElement.textContent = `$${(balance / 100).toFixed(2)}`;

        balanceElement.style.transform = "scale(1.1)";
        setTimeout(() => {
            balanceElement.style.transform = "scale(1)";
        }, 200);

        incomeElement.style.opacity = '1';
        expensesElement.style.opacity = '1';
        balanceElement.style.opacity = '1';

        if (balance > 0) {
            balanceElement.classList.remove('text-danger');
        } else {
            balanceElement.classList.add('text-danger');
        }

        updateCharts(income, expenses, categoryTotals);

    }, 200);
}

document.querySelector('.search-bar').addEventListener('keydown', (event) => {
    setTimeout(() => {
        const searchText = event.target.value.toLowerCase();
        updatetransactions(searchText);
    }, 100);
});

function updatetransactions(searchText = '') {
    let html = '';
    transactions.forEach((transaction, index) => {
        if ((transaction.name.toLowerCase().includes(searchText)) || (transaction.category.toLowerCase().includes(searchText))) {
            html += `
                <div class="row d-flex justify-content-start mb-3" data-index="${index}">
                    <div class="col-3 d-flex justify-content-center">
                        <p class="fw-bold">${nameStyle(transaction.name)}</p>
                    </div>
                    <div class="col-2 d-flex justify-content-center">
                        <p class="fw-bold">$${(transaction.amount / 100).toFixed(2)}</p>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <p class="fw-bold">${transaction.category}</p>
                    </div>
                    <div class="col-2 d-flex justify-content-center">
                        <p class="fw-bold">${formatDate(transaction.date)}</p>
                    </div>
                    <div class="col-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-primary fw-bold text-center edit me-2" data-index="${index}" data-toggle="tooltip" data-placement="top" title="Edit"> <i class='bx bxs-pencil'></i> </button>
                        <button type="button" class="btn btn-danger fw-bold text-center delete" data-index="${index}"  data-toggle="tooltip" data-placement="top" title="Delete"> <i class='bx bxs-trash'></i> </button>
                    </div>
                </div>
                <hr class="text-primary">
            `;
        }
    });
    document.querySelector('.transactions').innerHTML = html;


    document.querySelectorAll('.delete').forEach((button) => {
        button.addEventListener('click', () => {
            const btnIndex = button.dataset.index;
            transactions.splice(btnIndex, 1);
            saveTransactions();
            updateFinances();
            updatetransactions();
        })
    });


    document.querySelectorAll('.edit').forEach((button) => {
        button.addEventListener('click', () => {
            const btnIndex = button.dataset.index;
            editTransaction(btnIndex);
        })
    });
}

function editTransaction(index) {
    const transactionRow = document.querySelector(`[data-index='${index}']`);
    const transaction = transactions[index];

    transactionRow.innerHTML = `
            <div class="col-3 d-flex justify-content-center">
                <input type="text" class="form-control edit-name" value="${transaction.name}">
            </div>
            <div class="col-2 d-flex justify-content-center">
                <input type="number" class="form-control edit-amount" value="${(transaction.amount / 100).toFixed(2)}">
            </div>
            <div class="col-3 d-flex justify-content-center">
                <select class="form-select edit-category">
                    <option value="Income" ${transaction.category === 'Income' ? 'selected' : ''}>Income</option>
                    <option value="Housing" ${transaction.category === 'Housing' ? 'selected' : ''}>Housing</option>
                    <option value="Food" ${transaction.category === 'Food' ? 'selected' : ''}>Food</option>
                    <option value="Transportation" ${transaction.category === 'Transportation' ? 'selected' : ''}>Transportation</option>
                    <option value="Healthcare" ${transaction.category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                    <option value="Clothing" ${transaction.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
                    <option value="Entertainment" ${transaction.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="Utilities" ${transaction.category === 'Utilities' ? 'selected' : ''}>Utilities</option>
                    <option value="Debts" ${transaction.category === 'Debts' ? 'selected' : ''}>Debts</option>
                </select>
            </div>
            <div class="col-2 d-flex justify-content-center me-4">
                <input type="date" class="form-control edit-date" value="${transaction.date}">
            </div>
            <div class="col-1 d-flex justify-content-center">
                <button type="button" class="btn btn-success fw-bold text-center save-edit me-2" data-toggle="tooltip" data-placement="top" title="Save">✔</button>
                <button type="button" class="btn btn-danger fw-bold text-center cancel-edit" data-toggle="tooltip" data-placement="top" title="Cancel">✖</button>
            </div>
    `;

    document.querySelector('.save-edit').addEventListener('click', () => {
        const newName = transactionRow.querySelector('.edit-name').value;
        const newAmount = parseFloat(transactionRow.querySelector('.edit-amount').value) * 100;
        const newCategory = transactionRow.querySelector('.edit-category').value;
        const newDate = transactionRow.querySelector('.edit-date').value;

        transactions[index] = { name: newName, amount: newAmount, category: newCategory, date: newDate };
        saveTransactions();
        updateFinances();
        updatetransactions();
    });

    document.querySelector('.cancel-edit').addEventListener('click', () => {
        updatetransactions();
    });
}