const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('./logger');
// const methods = require('./discord-methods'); // Debug

const connectBot = async (token) => {
    try {
        await client.login(token);      // Even if we wait for the promise to resolve, we can't cache anything immediately, weird
        logger.log('Discord bot Online')
        setTimeout(async () => {
            // Even after the promise resolved, we need to wait a little before caching or querying the guild, put your code here
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