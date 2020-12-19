const commandConfig = require('../config/config').commands;
const fetch = require('node-fetch');

const commandHandler = async (client) => {
    client.on('message', async (message) => {
        if (!message.content.startsWith(commandConfig.prefix)) return;
        const rawCommand = message.content.slice(commandConfig.prefix.length);
        const commandArray = rawCommand.split(' ');
        const command = commandArray[0];
        let args = undefined;
        if (commandArray.length > 1) {
            args = commandArray.shift();
        }

        switch (command) {
            case 'haiku':
                haiku(message);
                break;
            default:
                message.reply(commandConfig.defaultReply);
                break;
        }
    })
};

const haiku = async (message) => {
    const url = new URL(commandConfig.haikuUrl);
    url.search = new URLSearchParams(commandConfig.haikuParameters).toString();

    const responseObject = await fetch(url)
    let responseString = await responseObject.text();

    // Replying to the message
    const replyString = haikuParser(responseString);
    message.reply(`\n${replyString}`);
}

// need to be adapted to your Haiku generator
const haikuParser = (responseString) => {
    // Parsing reply string
    responseString = responseString.replace('<div>', '');
    responseString = responseString.replace('</div>', '');
    const responseArray = responseString.split('<br/>');
    responseArray.pop();
    responseArray.shift();
    let replyArray = [];
    for (let string of responseArray) {
        replyArray.push(string.trim());
    }
    return replyArray.join('\n');
}

module.exports = commandHandler;