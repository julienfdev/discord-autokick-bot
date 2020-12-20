const logger = require('./logger');
const discordClient = require('./discord-client');
const discordConfig = require('../config/config').discordConfig;
const jsonfile = require('jsonfile');
const Airfield = require('../models/Airfield');
const path = require('path');

// Used for debugging - no further comment

const listChannels = async () => {
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch(discordConfig.guildId);
    const channels = guild.channels.cache.map(channel => channel);
    logger.log(`Listing channels, ${channels.length} channels found :`);
    for (let channel of channels) {
        console.log(`${channel.name} - id : ${channel.id}`);
    }
};



const setExistingMembers = async () => {
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch(discordConfig.guildId);
    const role = guild.roles.cache.find(role => role.id === discordConfig.defaultRole);

    const members = await guild.members.fetch();
    for (let member of members.map(member => member)) {
        if (!member._roles.length) {
            await member.roles.add(role);
            console.log(`role ajouté à ${member.user.username}`);
        }
    }
};

const importIcao = async () => {
    const airfields = (await jsonfile.readFile(`${path.dirname(__dirname)}/resources/aerodromes.json`)).features;

    //Flushing DB
    await Airfield.deleteMany({});

    // Formatting and creating : 
    for (let airfield of airfields) {

        if (airfield.properties.codeicao) {
            // Capitalizing and linking
            let array = airfield.properties.name.split(' ');
            let newArray = []
            for (let word of array) {
                let capitalizedWord = word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
                newArray.push(capitalizedWord)
            }
            airfield.properties.name = newArray.join('-');
            console.log(airfield.properties.name);
            await Airfield.create({icao: airfield.properties.codeicao, airfieldName: airfield.properties.name});
        }
    }

};

module.exports.listChannels = listChannels;
module.exports.setExistingMembers = setExistingMembers;
module.exports.importIcao = importIcao;