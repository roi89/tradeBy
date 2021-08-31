const { Telegraf } = require('telegraf')
const fs = require('fs');
const contactsFile = require('./telegramContacts.json');
const contactsPath = './telegramContacts.json';

const bot = new Telegraf('1935850235:AAFVyLZu3m6cmphAqZkbn_rxkr-WfW_xwLo');

const addToContacts = (contacts, path, currentId) => {
    let contactsList = contacts
    for (let i = 0; i < contactsList.length; i++) {
        if (contactsList[i] === currentId) {
            bot.telegram.sendMessage(currentId, 'Already subbed');
            return;
        }
    }
    contactsList.push(currentId);
    fs.writeFileSync(path, JSON.stringify(contactsList, null, 2));
};

const sendMessageToAllContacts = (context, bot, contacts) => {
    for (let i = 0; i < contacts.length; i++) {
        bot.telegram.sendMessage(contacts[i], context);
    }
};

const startBot = (bot, coinsFilePath) => {
    bot.start((ctx) => ctx.reply('Welcome, if you want to subscibe send me: Sub me'));
    bot.hears('Sub me', (ctx) => addToContacts(contactsFile, contactsPath, ctx.message.chat.id))
    bot.hears('New coins', (ctx) => ctx.reply(updateNewCoins(coinsFilePath)));
    bot.launch();
}

const updateNewCoins = (currentCoinsFilePath) => {
    let savedCoinFile = JSON.parse(fs.readFileSync(currentCoinsFilePath));
    let result = "";
    for (let i = 0; i < savedCoinFile.length; i++) {
        let currentCoinsListString = "\nLast update: " + savedCoinFile[i]['lastUpdate'] + "\nexchange name: " + savedCoinFile[i]['exchangeName'] + "\nExchange new listing url: " + savedCoinFile[i]['url'] +
            "\nThe coins: " + savedCoinFile[i]['coins'];
        result = result + currentCoinsListString;
    }
    return result;
}

module.exports = {
    bot,
    startBot,
    sendMessageToAllContacts
}
