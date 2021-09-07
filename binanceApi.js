const config = require('./config');
const fetch = require('node-fetch');


const getPrice = async(coinTicket,coinTicketToPair) =>{
    const symbol = coinTicket + coinTicketToPair;
    const adress = config.baseBinanceURL + '/api/v3/ticker/price?symbol=' + symbol;
    let response = await fetch(adress);
    let jsonResponse = await response.json()
    return jsonResponse.price;
}

const run = async() =>{
    console.log('started')
    let price = await getPrice('BTC','USDT');
    console.log(price);
}
run();