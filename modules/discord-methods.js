const logger = require('./logger');
const discordClient = require('./discord-client');
const discordConfig = require('../config/config').discordConfig;

const listChannels = async () =>{
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch('714142344408072302');
    const channels = guild.channels.cache.map(channel => channel);
    logger.log(`Listing channels, ${channels.length} channels found :`);
    for(let channel of channels){
        console.log(`${channel.name} - id : ${channel.id}`);
    }
};

const setExistingMembers = async () =>{
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch('714142344408072302');
    const role =  guild.roles.cache.find(role => role.id === '789809665222639616');

    const members = await guild.members.fetch();
    for(let member of members.map(member => member)){
        if(!member._roles.length){
            await member.roles.add(role);
            console.log("role ajouté");
        }
    }
};

module.exports.listChannels = listChannels;
module.exports.setExistingMembers = setExistingMembers;

// role membre : 789809665222639616