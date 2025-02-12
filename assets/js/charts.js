initializeCharts();

function initializeCharts() {
    const ctx1 = document.getElementById("financeChart").getContext("2d");
    financeChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                label: "Amount ($)",
                data: [0, 0], // Initially empty
                backgroundColor: ["#4CAF50", "#FF5733"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctx2 = document.getElementById("categoryChart").getContext("2d");
    categoryChart = new Chart(ctx2, {
        type: "pie",
        data: {
            labels: [], // Empty initially
            datasets: [{
                label: "Expenses by Category",
                data: [],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD"]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function updateCharts(income, expenses, categoryTotals) {
    financeChart.data.datasets[0].data = [income / 100, expenses / 100]; // Convert cents to dollars
    financeChart.update();

    // Update Pie Chart for Categories
    categoryChart.data.labels = Object.keys(categoryTotals);
    categoryChart.data.datasets[0].data = Object.values(categoryTotals).map(value => value / 100);
    categoryChart.update();
}
