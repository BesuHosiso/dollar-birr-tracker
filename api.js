export function getUSDToETB() {
    // We are wrapping everything in a Promise so we can handle the delay manually
    return new Promise((resolve, reject) => {
        
        // 1. The Menu (The URL where the data lives)
        const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

        // 2. The Waiter (fetch) goes to get the data
        fetch(url)
            .then(response => {
                // The Waiter returns. 'response' is the raw package.
                // We check if the package is damaged (404 error, server down)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // We open the package and convert it to JSON (readable text)
                // This ALSO takes time, so it returns another Promise
                return response.json(); 
            })
            .then(data => {
                // 3. The Data is ready! (The Coffee is here)
                // 'data' is the actual JSON object from the internet
                
                // We look inside the data for the specific rate
                const etbRate = data.usd.etb;
                const convertedAmount = 1 * etbRate;
                
                // 4. We hit the SUCCESS button on our main Promise
                // We send the final string back to whoever called this function
                resolve(`${convertedAmount.toFixed(2)}`);
            })
            .catch(error => {
                // 5. If anything went wrong above (Network error, parsing error)
                // We hit the PANIC button
                reject('Error fetching data: ' + error);
            });
    });
}