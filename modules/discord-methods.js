const logger = require('./logger');
const discordClient = require('./discord-client');
const discordConfig = require('../config/config').discordConfig;


// Used for debugging - no further comment

const listChannels = async () =>{
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch(discordConfig.guildId);
    const channels = guild.channels.cache.map(channel => channel);
    logger.log(`Listing channels, ${channels.length} channels found :`);
    for(let channel of channels){
        console.log(`${channel.name} - id : ${channel.id}`);
    }
};



const setExistingMembers = async () =>{
    const client = discordClient.client;
    const guild = await discordClient.client.guilds.fetch(discordConfig.guildId);
    const role =  guild.roles.cache.find(role => role.id === discordConfig.defaultRole);

    const members = await guild.members.fetch();
    for(let member of members.map(member => member)){
        if(!member._roles.length){
            await member.roles.add(role);
            console.log(`role ajouté à ${member.user.username}`);
        }
    }
};

module.exports.listChannels = listChannels;
module.exports.setExistingMembers = setExistingMembers;