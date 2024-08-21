document.getElementById('stockForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    getStockData(symbol);
    const option=document.querySelector("#option");
    const dropdown=document.getElementById("dropdown");
    dropdown.style.display="block";
    
});

async function getStockData(symbol) {
    const apiKey = 'D17O5KR76QWW75SU';
    const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const chartUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    try {
        // Fetch stock price
        const priceResponse = await fetch(priceUrl);
        const priceData = await priceResponse.json();
        console.log(priceData['Global Quote']['05. price']);
        const datas=Object.values(priceData);
        console.log(datas[0]);
        const keys=Object.keys(datas['0']);
        const values=Object.values(datas['0']);
        console.log(keys);
        // console.log(values);
        for (let i = 0; i < keys.length; i++) {
            const element=`<option value="${keys[i]}">${keys[i]}</option>`;
            option.innerHTML+=element;

            // const element = keys[i];
            console.log(element);
        }
        const valueDisplay = document.getElementById('valueDisplay');

        option.addEventListener('change', function() {
            let selectedKey =option.selectedIndex + 1 ;
            console.log(selectedKey);
            for (let i = 0; i < selectedKey; i++) {
                const element = values[i];
                console.log(element);
                // Display the corresponding value or "None" if no key is selected
                valueDisplay.textContent = element;      
            }
        });


        if (priceData['Global Quote'] && priceData['Global Quote']['05. price']) {
            const price = priceData['Global Quote']['05. price'];
            
            document.getElementById('result').innerHTML = `Current price of ${symbol} is ₹${price}`;
        } else {
            document.getElementById('result').innerHTML = 'Invalid symbol or data not available.';
        }

        // Fetch stock chart data
        const chartResponse = await fetch(chartUrl);
        const chartData = await chartResponse.json();
        
        if (chartData['Time Series (Daily)']) {
            const timeSeries = chartData['Time Series (Daily)'];
            const dates = [];
            const prices = [];
            for (const date in timeSeries) {
                dates.push(date);
                prices.push(timeSeries[date]['4. close']);
            }
            createChart(dates.reverse(), prices.reverse(), symbol);
        } else {
            console.error('Chart data not available.');
        }
    } catch (error) {
        document.getElementById('result').innerHTML = 'An error occurred. Please try again later.';
        console.error('Error fetching stock data:', error);
    }
}

function createChart(dates, prices, symbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Stock Price`,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}