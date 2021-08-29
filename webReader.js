const { By, Key, Builder } = require("selenium-webdriver");
const config = require('./config');
require("chromedriver");


const setupDriver = async(url,driver) =>{
    await driver.get(url);
};

const extractElements = async(elementName,driver) =>{
    let currentDriver = driver;
    let elements = await currentDriver.findElements(By.className(elementName));
    return elements;
};

const extractTextFromElements = async(elements) =>{
    let textFromElements = [];
    for (let i = 0; i < elements.length; i++) {
        let currentText = await elements[i].getText();
        textFromElements.push(currentText);
    }
    return textFromElements;
};

const extractFilteredText = async(elements,filters) =>{
    let filteredElements = [];
    for(let i = 0; i < elements.length; i++){
        for(let o = 0; o < filters.length; o++ ){
            if(elements[i].includes(filters[o])){
                filteredElements.push(elements[i]);
            }
        }
    }
    return filteredElements;
};

const extractFilteredRegex = async(elements,regex) =>{
    let filteredElements = [];
    for(let i = 0; i < elements.length; i++){
        for(let o = 0; o < regex.length; o++ ){
            if(elements[i].match(/(?:\()[^\(\)]*?(?:\))/g) !== null){
                filteredElements.push(elements[i].match(/(?:\()[^\(\)]*?(?:\))/g));
            }
        }
    }
    return filteredElements;
}

const run = async () =>{
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(config.coinbase.url.coinbaseBlog);
    let posts = await extractElements(config.coinbase.ClassNames.postsClassName,driver);
    let postTitles = await extractTextFromElements(posts);
    postTitles.push('Axie Infinity (AXS), Request (REQ), TrueFi (TRU) and Wrapped Luna (WLUNA) are launching on Coinbase…')
    postTitles.push('COTI (COTI) is launching on Coinbase Pro');
    let filteredTitles = await extractFilteredText(postTitles,['launching on Coinbase']);
    let filteredCoins = await extractFilteredRegex(filteredTitles,['/\((.*?)\)/']);
    console.log(filteredCoins);
    await driver.quit();
}
run()