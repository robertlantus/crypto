
// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Initial fetch of coin data
    fetchCoinsMarkets();

    // Refresh the displayed data every 5 minutes (300,000 milliseconds)
    setInterval(fetchCoinsMarkets, 300000);
});

async function fetchCoinsMarkets() {

    // Hide the error message before fetching data
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch('/api/coins/markets');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching coin data:', error);

        // Display the error message on the page
        errorMessage.textContent = 'Failed to fetch coins markets data';
        errorMessage.style.display = 'block';
    }
}

// Function to render the table

function renderTable(coins) {

    const tableContainer = document.getElementById('coin-table');
    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Coin</th>
                    <th>Price (USD)</th>
                    <th>24h</th>
                    <th>24h Volume</th>
                    <th>Market Cap</th>
                </tr>
            </thead>
            <tbody>
    `;

    coins.forEach(coin => {
        tableHTML += `
            <tr>
                <td>${coin.market_cap_rank}</td>
                <td>${coin.name} ${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price.toFixed(2)}</td>
                <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
                <td>$${coin.total_volume.toLocaleString()}</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}


