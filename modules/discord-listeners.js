const logger = require('./logger');
const discordConfig = require('../config/config').discordConfig;

const watchForNewUser = async (client, User) => {
    client.on('guildMemberAdd',async (member) => {
        // Creating database object
        try {
           await User.create({
                uniqueId: member.user.id,
                username: member.user.username,
                joinedAt: Date.now()
            });
            logger.log(`${member.user.username} successfully created into database`);
        } catch (error) {
            logger.error(error.message);
        }
    });
};

const flushLeavingUser = async (client, User) => {
    client.on('guildMemberRemove',async (member) => {
        // Sending mean message
        const guild = await client.guilds.fetch(discordConfig.guildId);
        const infoChannel = await guild.channels.cache.find(ch => ch.id === discordConfig.infoChannel);
        infoChannel.send(`**${member.user.username}** t'es parti? Bah casse toi alors pov' con va!`);
        // Deleting from database
        try {
            await User.deleteOne({uniqueId: member.user.id});
            logger.log(`${member.user.username} successfully deleted from database`);
        } catch (error) {
            logger.error(error.message);
        }

    });
};

const updateReactionUser = async(client, User) => {
    // Cache message to listen to messageReactions
    const guild = await client.guilds.fetch(discordConfig.guildId);
    setTimeout(async () => {
        const ruleChannel = await guild.channels.cache.find(ch => ch.id === discordConfig.rulesChannel);
        await ruleChannel.messages.fetch(discordConfig.rulesMessage);
    },2000)

    client.on('messageReactionAdd', async (reaction, user) => {
        // We check if this is added to the rule message
        if(reaction.message.id === '746757360059416738'){
            // If not an handshake, we remove the user from it
            if(!(reaction._emoji.name === '🤝')){
                reaction.users.remove(user.id);
            }
            else{
                // We search the user into the DB
                const userFound = await User.findOne({uniqueId : user.id});
                // If we found the user and he's not reacted yet with the handshake
                if(userFound && !userFound.reactedToRules){
                    // he has now reacted to Rules
                    userFound.reatedToRules = true;
                    // We assign him the role member :
                    const role =  await guild.roles.cache.find(role => role.id === discordConfig.defaultRole);
                    const member = await guild.members.fetch(user.id);
                    member.roles.add(role);
                    // We update the User in DB
                    await User.updateOne({uniqueId: userFound.uniqueId}, {reactedToRules : true});
                }
            }
        }
    })
};

const updateSaidHelloUser = async (client, User) =>{
    client.on('message', async (message) => {
        // If the message doesn't come from general or presentation, return
        if(!(discordConfig.channelsToPostIn.includes(message.channel.id))) return;
        // We search if the user is in database and if he hasn't said hello yet
        const userFound = await User.findOne({uniqueId: message.author.id, saidHello: false});
        if(userFound){
            await User.updateOne({uniqueId: message.author.id}, {saidHello: true});
            logger.log(`${message.author.username} has said hello!`);
        }
    })
};

const setKickWatcher = async (client, User, delay) =>{
    const guild = await client.guilds.fetch(discordConfig.guildId);
    setInterval(async () =>{
        const usersToKick = await User.find({saidHello: false}).where('joinedAt').lt(new Date((Date.now() - 1000*delay)));
        if(usersToKick.length){
            for(let user of usersToKick){
                const member = await guild.members.fetch(user.uniqueId);
                if(member){
                    member.kick('La prochaine fois tu diras bonjour...');
                }
            }
        }
    }, 30000)
}

module.exports.watchForNewUser = watchForNewUser;
module.exports.flushLeavingUser = flushLeavingUser;
module.exports.updateReactionUser = updateReactionUser;
module.exports.updateSaidHelloUser = updateSaidHelloUser;
module.exports.setKickWatcher = setKickWatcher;

    // channel to post in : 746744693580365855
    // rules : 746737710730838097
    // rules message : 746757360059416738
    // Discord invite link : https://discord.gg/RaHcUB6
    // emoji 🤝

    // role : 

    // presentation : 777857987002761226
    // general : 714142344852799541