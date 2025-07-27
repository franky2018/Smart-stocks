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
        const watchBtn = document.createElement("button");
        watchBtn.className = "watchlist-btn";
        watchBtn.setAttribute("data-symbol", stock.symbol);
        // Set initial button text based on watchlist
        let list = JSON.parse(localStorage.getItem("watchlist")) || [];
        watchBtn.textContent = list.includes(stock.symbol) ? "✅ Added" : "⭐ Watch";
        watchBtn.addEventListener("click", () => {
            let list = JSON.parse(localStorage.getItem("watchlist")) || [];
            if (list.includes(stock.symbol)) {
                // Remove from watchlist
                list = list.filter(s => s !== stock.symbol);
                watchBtn.textContent = "⭐ Watch";
            } else {
                // Add to watchlist
                list.push(stock.symbol);
                watchBtn.textContent = "✅ Added";
            }
            localStorage.setItem("watchlist", JSON.stringify(list));
            loadWatchlistSidebar();
        });
        card.appendChild(watchBtn);
        grid.appendChild(card);
    });
}

displayStocks();

document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const card = document.querySelectorAll(".stock-card");

    card.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
    });
});

function saveToWatchlist(symbol) {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!list.includes(symbol)) {
        list.push(symbol);
        localStorage.setItem("watchlist", JSON.stringify(list));
    }
}

function loadWatchlistSidebar(){
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    const sidebar = document.getElementById("watchlist-sidebar");
    if (!sidebar) return; // Prevent error if element not found
    sidebar.innerHTML = "";

    if (list.length === 0) {
        sidebar.innerHTML = "<li>No stocks saved.</li>";
    } else {
        list.forEach(symbol => {
            const li = document.createElement("li");
            li.textContent = symbol;
            sidebar.appendChild(li);
        });
    }
}

loadWatchlistSidebar();

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const user = localStorage.getItem("username");
    
    const userDisplay = document.getElementById("welcome-user");
    const loginLink = document.getElementById("login-link");
    if (isLoggedIn && user) {
        userDisplay.textContent = `Welcome, ${user}`;
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", () => {
            localStorage.clear();
            window.location.reload();
        });
    }
});