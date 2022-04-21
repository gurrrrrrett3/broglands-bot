const ticker = document.getElementById('ticker')

const getTickerContent = () => {
    return fetch('/api/ticker')
        .then(res => res.json())
}

const updateTicker = () => {
    
    getTickerContent()
        .then(data => {
            ticker.innerHTML = data.content;
        })
        .catch(err => {
            console.log(err);
        })
};

const interval = setInterval(updateTicker, 5000);
document.addEventListener('DOMContentLoaded', updateTicker);