const { Telegraf } = require('telegraf')
const fs = require('fs');
const contactsFile = require('./telegramContacts.json');
const contactsPath = './telegramContacts.json';
const botToken = require('./telegramToken.json')

const bot = new Telegraf(botToken.token);

const addToContacts = (contacts, path, ctx) => {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]['id'] === ctx.message.chat.id) {
            bot.telegram.sendMessage(ctx.message.chat.id, 'Already subbed');
            return;
        }
    }
    let contact;
    if (ctx.message.chat.username === undefined) {
        contact = {
            userName: ctx.message.chat.first_name,
            id: ctx.message.chat.id
        }
    } else {
        contact = {
            userName: ctx.message.chat.username,
            id: ctx.message.chat.id
        }
    }
    contacts.push(contact);
    fs.writeFileSync(path, JSON.stringify(contacts, null, 2));
};

const sendMessageToAllContacts = (context, bot, contacts) => {
    for (let i = 0; i < contacts.length; i++) {
        bot.telegram.sendMessage(contacts[i]['id'], context);
    }
};

const startBot = (bot, coinsFilePath) => {
    bot.start((ctx) => ctx.reply('Welcome, if you want to subscibe send me: Sub me'));
    bot.hears('Sub me', (ctx) => addToContacts(contactsFile, contactsPath, ctx))
    bot.hears('New coins', (ctx) => ctx.reply("Hey " + ctx.message.chat.first_name + ' There is the coins:\n' + updateNewCoins(coinsFilePath)));
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
