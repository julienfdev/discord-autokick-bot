const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('./logger');
const methods = require('./discord-methods');

const connectBot = async (token) => {
    try {
        await client.login(token);
        logger.log('Discord bot Online')
        setTimeout(async () => {
            //methods.listChannels()
            //methods.setExistingMembers();
        }, 2000)

    } catch (error) {
        logger.error(`Problem : ${error.message}`)
    }
}

const logout = async () => {
    try {
        client.destroy();
        logger.log('Discord bot destroyed');
    } catch (error) {
        logger.error('Error destroying the bot');
    }
}

module.exports.client = client;
module.exports.connectBot = connectBot;
module.exports.logout = logout;