const { By, Key, Builder } = require("selenium-webdriver");
const config = require('./exchanges');
const fs = require('fs');
const filePath = './currentCoins.json';
require("chromedriver");
const chrome = require('selenium-webdriver/chrome');
let jsonCoins = require('./currentCoins.json');
const { resolve } = require("path");
const contacts = require('./telegramContacts.json');
const { bot, startBot, sendMessageToAllContacts,updateNewCoins } = require('./telegramBot');
const moment = require('moment');


const setupDriver = async (url, driver) => {
    await driver.get(url);
};

const timeOut = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const saveCoinsToJson = (jsonFile, coins) => {
    fs.writeFileSync(jsonFile, JSON.stringify(coins, null, 2));

}
const extractLoadedElements = async (elementName, driver,numOfPostToWaitFor) => {
    let currentDriver = driver;
    let loaded = false;
    let elements = [];
    if(numOfPostToWaitFor === undefined){
        elements = await currentDriver.findElements(By.className(elementName));
        return elements;
    }
    while(loaded === false){
        await currentDriver.manage().setTimeouts( { implicit: 1000 } );
        elements = await currentDriver.findElements(By.className(elementName));
        if(elements.length >= numOfPostToWaitFor){
            loaded = true;
            return elements;
        }
    }
};

const extractElements = async (elementName, driver) => {
    let currentDriver = driver;
    let elements = [];
    await currentDriver.manage().setTimeouts( { implicit: 1000 } );
    elements = await currentDriver.findElements(By.className(elementName));
    return elements;
};

const extractTextFromElements = async (elements) => {
    let textFromElements = [];
    for (let i = 0; i < elements.length; i++) {
        let currentText = await elements[i].getText();
        textFromElements.push(currentText);
    }
    return textFromElements;
};

const extractFilteredText = async (elements, filter) => {
    let filteredElements = [];
    for (let i = 0; i < elements.length; i++) {
        for(let o = 0; o < filter.length; o++){
            if (elements[i].includes(filter[o])) {
                filteredElements.push(elements[i]);
            };
        }
    }
    return filteredElements;
};

const extractFilteredRegex = async (elements) => {
    let filteredElements = [];
    for (let i = 0; i < elements.length; i++) {
        let extracts = elements[i].match(/\(.*?\)/g);
        filteredElements.push(extracts);
    }
    let flattenElements = filteredElements.flat();
    let finalElements = [];
    for (let o = 0; o < flattenElements.length; o++) {
        finalElements.push(flattenElements[o].replace(/[()]/g, ''));
    }
    return finalElements;
};

const checkIfThereIsNewCoin = (json, currentCoinsLists, currentNumOfSite) => {
    let savedCoinFile = JSON.parse(fs.readFileSync(filePath));
    if(savedCoinFile[currentNumOfSite] === undefined){return;}
    if (savedCoinFile[currentNumOfSite]['coins'][0] !== currentCoinsLists['coins'][0] && currentCoinsLists['coins'][0] !== null) {
        sendMessageToAllContacts('found new coins in exchange: ' + currentCoinsLists['exchangeName'] + ' The coin is: ' + currentCoinsLists['coins'][0], bot, contacts);
        console.log('found new coins in exchange: ' + currentCoinsLists['exchangeName']);
        return;
    }
    return;
};

const extractCoins = async (driver,numOfSite,sitesList) =>{
    let posts = await extractLoadedElements(sitesList[numOfSite]['ClassNames']['postsClassName'], driver,sitesList[numOfSite]['numOfPostsToWaitFor']);
    let postTitles = await extractTextFromElements(posts);
    let filteredTitles = await extractFilteredText(postTitles, sitesList[numOfSite]['titleFilter']);
    let filteredCoins = await extractFilteredRegex(filteredTitles);
    return filteredCoins;
};


const extractFromMultiplieSources = async (sites) => {
    startBot(bot,filePath);
    //sendMessageToAllContacts('Hey guys, please sub to me again by write: Sub me',bot,contacts);
    let extractedCoins = [];
    let turnOff = false;
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();
    while (turnOff === false) {
        for (let i = 0; i < sites.length; i++) {
            await driver.get(sites[i]['url']);
            let filteredCoins = await extractCoins(driver,i,sites);
            let coinsList = {
                lastUpdate: moment().format('LLLL'),
                url: sites[i]['url'],
                exchangeName: sites[i]['name'],
                coins: filteredCoins
            };
            extractedCoins.push(coinsList);
            checkIfThereIsNewCoin(jsonCoins, coinsList, i);
        }
        saveCoinsToJson(filePath, extractedCoins);
        extractedCoins = [];
        await timeOut(10000);
    }
    await driver.quit();
};

extractFromMultiplieSources([config.binance, config.coinbase,config.kraken]);
