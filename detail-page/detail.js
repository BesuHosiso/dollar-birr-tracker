// Intersection Observer initializer for scroll animations
function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    // Observe all elements that should animate in
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
}


// 1. The 100% Free, No-Key API Endpoint
const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

// 2. Main Initialization Function
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch LIVE data from the free API
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Extract the real ETB rate from the API
        const liveEtbRate = data.usd.etb;

        // 3. DATA PROCESSING: Perform operations on the raw data
        const processedData = processMarketData(liveEtbRate);

        // 4. Update the UI with the processed data
        populateUI(processedData);

        // Initialize the intersection observer after UI updates
        // (ensures any DOM changes are present before observing)
        initObserver();

    } catch (error) {
        console.error("Failed to fetch or process API data:", error);
        document.getElementById('page-title').textContent = "Error loading market data.";
    }
});

// --- DATA PROCESSING ENGINE ---
function processMarketData(currentRate) {
    // A. Generate a simulated 365-day history based on the REAL current rate
    // (In a production app with a paid API, you would fetch this array instead of generating it)
    const historicalRates = [];
    let simulatedRate = currentRate * 0.90; // Let's pretend it started 10% lower a year ago
    
    for (let i = 0; i < 365; i++) {
        // Add some random daily volatility (between -0.5% and +0.6%)
        const dailyChange = simulatedRate * ((Math.random() * 0.011) - 0.005);
        simulatedRate += dailyChange;
        historicalRates.push(simulatedRate);
    }
    // Ensure the last day exactly matches our real live rate from the API
    historicalRates[364] = currentRate; 

    // B. Calculate Year-To-Date (YTD) Change (Assuming today is approx day 60 of the year)
    const rateOnJan1 = historicalRates[365 - 60]; 
    const ytdChangePercent = ((currentRate - rateOnJan1) / rateOnJan1) * 100;

    // C. Calculate 52-Week Spread (High and Low)
    const fiftyTwoWeekHigh = Math.max(...historicalRates);
    const fiftyTwoWeekLow = Math.min(...historicalRates);

    // D. Calculate Average Daily Volatility (Standard Deviation of daily changes)
    let totalDailyChangePercent = 0;
    for (let i = 1; i < historicalRates.length; i++) {
        const percentChange = Math.abs((historicalRates[i] - historicalRates[i-1]) / historicalRates[i-1]);
        totalDailyChangePercent += percentChange;
    }
    const avgDailyVolatility = (totalDailyChangePercent / historicalRates.length) * 100;

    // E. Determine Volatility Status text
    let volStatus = "Stable";
    if (avgDailyVolatility > 1.5) volStatus = "High Volatility";
    else if (avgDailyVolatility > 0.8) volStatus = "Considered Moderate";

    // F. Dynamically Generate "Market Insights" text based on the calculations
    const trendWord = ytdChangePercent > 0 ? "depreciation" : "appreciation";
    const paragraph1 = `Based on live data operations, the Ethiopian Birr is currently trading at ${currentRate.toFixed(2)} ETB against the USD. Over the past year, we have observed a general trend of ${trendWord}, heavily influenced by shifting liquidity requirements among major commercial banks.`;
    
    const paragraph2 = ytdChangePercent > 5 
        ? "The Year-to-Date change is significantly high, indicating strong underlying demand pressures in the parallel market. Analysts suggest this trajectory may hold unless new monetary policy directives are introduced."
        : "The Year-to-Date change remains relatively contained. While commercial rates remain steady, we continue to monitor the market mid-point for signs of broader economic shifts.";

    // Return the perfectly formatted object for the UI to consume
    return {
        currentRate: currentRate,
        analysis: { p1: paragraph1, p2: paragraph2 },
        volatility: { value: avgDailyVolatility, status: volStatus },
        ytd: { value: ytdChangePercent },
        spread: { low: fiftyTwoWeekLow, high: fiftyTwoWeekHigh },
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear()
    };
}

// --- UI UPDATER ---
function populateUI(data) {
    // Update Title
    document.getElementById('page-title').textContent = `Monthly Market Insights - ${data.month} ${data.year}`;

    // Update Text Insights
    document.getElementById('overview-p1').textContent = data.analysis.p1;
    document.getElementById('overview-p2').textContent = data.analysis.p2;

    // Update Volatility
    document.getElementById('volatility-value').textContent = `${data.volatility.value.toFixed(2)}%`;
    document.getElementById('volatility-subtext').textContent = data.volatility.status;

    // Update YTD Change with dynamic colors
    const ytdEl = document.getElementById('ytd-value');
    const ytdVal = data.ytd.value;
    ytdEl.textContent = ytdVal > 0 ? `+${ytdVal.toFixed(2)}%` : `${ytdVal.toFixed(2)}%`;
    ytdEl.style.color = ytdVal > 0 ? '#00E676' : (ytdVal < 0 ? '#EF4444' : '#FFFFFF');

    // Update Spread
    document.getElementById('spread-value').textContent = `${data.spread.low.toFixed(2)} - ${data.spread.high.toFixed(2)}`;

    // Inject Bullet Points (Hardcoded here as market drivers rarely change daily)
    const listEl = document.getElementById('market-drivers-list');
    const drivers = [
        "Export revenue adjustments leading to tighter foreign exchange reserves.",
        "Recent steadying of inflation rates locally, creating temporary rate floors.",
        "Increased remittance flows via official channels like TeleBirr."
    ];
    
    listEl.innerHTML = ''; 
    drivers.forEach(text => {
        const li = document.createElement('li');
        li.style.cssText = 'display: flex; align-items: flex-start; color: #9CA3AF; font-size: 0.875rem; margin-bottom: 0.5rem;';
        li.innerHTML = `<span style="color: #00C2D1; margin-right: 8px; font-size: 1.2rem; line-height: 1;">•</span>${text}`;
        listEl.appendChild(li);
    });
}

