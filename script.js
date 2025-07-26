const toggleBtn = document.getElementById("theme-toggle");
		const body = document.body;

        if (localStorage.getItem("theme") === "dark") { 
            body.classList.add("dark-mode");
            toggleBtn.textContent = "Light Mode";
        }

		toggleBtn.addEventListener("click", ()=> {
			body.classList.toggle("dark-mode");

            const mode = body.classList.contains("dark-mode") ? "dark" : "light";
            localStorage.setItem("theme", mode);

			toggleBtn.textContent = mode === "dark" ? "Light Mode" : "Dark Mode";
		});

const stockList = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA"];
const apiKey = "542b79d46c4142b0846620f71e800432";

async function fetchStockData(symbol) {
    try {
        const res = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        const data = await res.json();
        // Debug log for API response
        console.log(`API response for ${symbol}:`, data);
        // Use fallback values if fields are missing
        return {
            name: data.name || symbol,
            price: data.price || data.close || "N/A",
            change: data.change || data.percent_change || "N/A",
            symbol: data.symbol || symbol,
        };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
}
async function displayStocks() {
    const grid = document.querySelector(".stock-grid");
    grid.innerHTML = "<p>Loading stock data...</p>";

    const stockCards = await Promise.all(stockList.map(fetchStockData));
    grid.innerHTML = "";

    stockCards.forEach(stock => {
        if (!stock) return;

        const card = document.createElement("div");
        card.className = "stock-card";
        card.innerHTML = `
            <h3>${stock.name} (${stock.symbol})</h3>
            <p>Price: $${stock.price}</p>
            <p style="color: ${stock.change.startsWith('-') ? 'red' : 'green'};">
            ${stock.change}
            </p>
            `;
        grid.appendChild(card);
    });
}

displayStocks();