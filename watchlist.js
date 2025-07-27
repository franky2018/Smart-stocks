const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "Light Mode";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const mode = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    toggleBtn.textContent = mode === "dark" ? "Light Mode" : "Dark Mode";
});

const grid = document.getElementById("watchlist-grid");
const apiKey = "542b79d46c4142b0846620f71e800432";

const saved = JSON.parse(localStorage.getItem("watchlist")) || [];

async function fetchStocks(symbol) {
    try {
        const res = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        const data = await res.json();

        return `<div class="stock-card">
            <h3>${data.name || symbol} (${data.symbol || symbol})</h3>
            <p>Price: $${data.price || data.close || "N/A"}</p>
            <p style="color: ${(data.change || "0").startsWith('-') ? 'red' : 'green'};">${data.change || data.percent_change || "N/A"}</p>
            </div>`;
    }
    catch (error) {
        return `<div class="stock-card">
            <p>Error fetching data for ${symbol}</p>
        </div>`;
    }
}

async function loadWatchlist() {
    if (saved.length === 0) {
        grid.innerHTML = "<p>You have no saved stocks.</p>";
        return;
    }

    const cards = await Promise.all(saved.map(fetchStocks));
    grid.innerHTML = cards.join("");
}

loadWatchlist();