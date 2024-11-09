
// frontend script.js

function frontend() {

    document.addEventListener('DOMContentLoaded', () => {
        // Fetch coin data from the backend
        fetch('/api/coins/markets')
            .then(response => response.json())
            .then(data => {
                renderTable(data);
            })
            .catch (error => {
                console.error('Error fetching coin data:', error);
            });
    });
    
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
}

frontend();
setInterval(frontend, 1000);
