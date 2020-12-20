const logger = require('./logger');
const config = require('../config/config');
const discordConfig = require('../config/config').discordConfig;
const discordText = require('../config/config').discordText;

// Creating an eventListener on guildMemberAdd to initialize a User object in database when someone joins
const watchForNewUser = async (client, User) => {
    client.on('guildMemberAdd', async (member) => {
        // Creating database object
        try {
            await User.create({
                uniqueId: member.user.id,
                username: member.user.username,
                joinedAt: Date.now()
            });
            logger.log(`${member.user.username} successfully created into database`);
        } catch (error) {
            logger.error(`Error creating the User: ${error.message}`);
        }
    });
};

// The User database object must be deleted if the User is kicked or leaves the server, 
// We send a mean message into the information feed for good measure
const flushLeavingUser = async (client, User) => {
    client.on('guildMemberRemove', async (member) => {
        // Sending mean message
        const guild = await client.guilds.fetch(discordConfig.guildId);
        const infoChannel = await guild.channels.cache.find(ch => ch.id === discordConfig.infoChannel);
        infoChannel.send(`**${member.user.username}** ${discordText.userLeftMessage}`);
        // Deleting from database
        try {
            await User.deleteOne({
                uniqueId: member.user.id
            });
            logger.log(`${member.user.username} successfully deleted from database`);
        } catch (error) {
            logger.error(`Error deleting the User: ${error.message}`);
        }

    });
};

// To allow the user to browse the server, he must react to the server rules, thus we create the appropriate eventListener
const updateReactionUser = async (client, User) => {
    // messageReactionAdd needs the message to be cached
    const guild = await client.guilds.fetch(discordConfig.guildId);
    setTimeout(async () => { // because of the "await" client login bug, that's not pretty...
        // We find the channel and fetch the message to listen
        const ruleChannel = await guild.channels.cache.find(ch => ch.id === discordConfig.rulesChannel);
        await ruleChannel.messages.fetch(discordConfig.rulesMessage);
    }, 2000)

    // With the message cached, we can add a listener.
    client.on('messageReactionAdd', async (reaction, user) => {
        // When the event is triggered, we check if this is added to the message we want to monitor
        if (reaction.message.id === discordConfig.rulesMessage) {
            // If not the designated emoji, we remove it
            if (!(reaction._emoji.name === discordConfig.reactionEmoji)) {
                reaction.users.remove(user.id);
            } else {
                // If the user added the right emoji, we try to find the user into the db
                const userFound = await User.findOne({
                    uniqueId: user.id
                });
                // If we found the user and he's not reacted yet with the handshake
                if (userFound && !userFound.reactedToRules) {
                    // he has now reacted to Rules
                    userFound.reatedToRules = true;
                    // We assign him the role to unlock the server :
                    const role = await guild.roles.cache.find(role => role.id === discordConfig.defaultRole);
                    const member = await guild.members.fetch(user.id);
                    member.roles.add(role);
                    // We update the User in DB
                    try {
                        await User.updateOne({
                            uniqueId: userFound.uniqueId
                        }, {
                            reactedToRules: true
                        });
                        logger.log(`${user.username} has now reacted to rules`)
                    } catch (error) {
                        logger.error(`Can\'t update user : ${error.message}`)
                    }

                }
            }
        }
    })
};

// We need to monitor messages sent to the server to check if it's the first message of an User into the authorized channels
const updateSaidHelloUser = async (client, User) => {
    client.on('message', async (message) => {
        // If the message doesn't come from the authorized channels, return
        if (!(discordConfig.channelsToPostIn.includes(message.channel.id))) return;
        // We search if the user is in database and if he hasn't said hello yet
        const userFound = await User.findOne({
            uniqueId: message.author.id,
            saidHello: false
        });
        // If we found the user, that means he has now spoken into the authorized channels, 
        // and is now safe from being kicked, we need to update its 'saidHello' bool
        if (userFound) {
            try {
                await User.updateOne({
                    uniqueId: message.author.id
                }, {
                    saidHello: true
                });
                logger.log(`${message.author.username} has said hello!`);
            } catch (error) {
                logger.error(`Error updating ${message.author.username} "saidHello" status`);
            }

        }
    })
};

// Checks if one or more users are now to be kicked
const setKickWatcher = async (client, User, delay) => {
    const guild = await client.guilds.fetch(discordConfig.guildId);
    setInterval(async () => {
        // We check is some users are older than the "kickDelay" substracted to the current date 
        const usersToKick = await User.find({
            saidHello: false
        }).where('joinedAt').lt(new Date((Date.now() - 1000 * delay)));
        // If the usersToKick array isn't empty, we kick each member
        if (usersToKick.length) {
            for (let user of usersToKick) {
                const member = await guild.members.fetch(user.uniqueId);
                if (member) {
                    member.kick(discordText.kickMessage);
                    logger.log(`Kicked ${user.username}, he was rude for not saying hello`)
                }
            }
        }
    }, config.kickCheckInterval);
}

const setIcaoWatcher = async (client, Airfield) => {
    const guild = client.guilds.fetch(discordConfig.guildId);
    // We set a message eventListener
    client.on('message', async (message) => {
        // First we need to make sure the user is not typing a command
        if (message.content.startsWith(config.commands.prefix)) return;
        // We need to make sure a bot isn't issuing the message
        if (message.author.bot) return;

        // Now that we know the user not typing a command and is not a bot, we need to match every 4 letters word ignoring case
        const regExIcao = new RegExp(/LF[a-z]{2}/gi);
        // We extract the potential candidates
        const arraySearch = message.content.match(regExIcao);
        let arrayFoundIcao = []
        // If we've got candidates, we query the database and store the Promises in the array
        if (arraySearch.length) {
            for (candidate of arraySearch) {
                arrayFoundIcao.push(Airfield.findOne({
                    icao: candidate.toUpperCase()
                }));
            }
        }
        // Once all async Promises have resolved
        Promise.all(arrayFoundIcao).then(icaoCodes => {
            let stringToSend = message.content;
            let modified = false;
            // And the icao candidates are actual icao codes, at least 1
            if (icaoCodes.length) {
                for (icao of icaoCodes) {
                    if (icao !== null) {
                        // If we don't find any words related to the Airfield Name in the message, we complete the expression
                        const wordsToSearch = icao.airfieldName.split('-');
                        const searchRegEx = new RegExp(`${wordsToSearch.join('|')}`, 'ig');
                        if (!stringToSend.match(searchRegEx)) {
                            // Using a regex allows to ignore case sensitivity
                            const replaceRegExp = new RegExp(icao.icao, 'ig');
                            stringToSend = stringToSend.replace(replaceRegExp, `${icao.icao} *- ${icao.airfieldName} -*`);
                            modified = true;
                        }
                    }
                }
                if (modified) {
                    message.reply(config.commands.icao.messageReply.replace('[MESSAGE]', stringToSend));
                }
            }
        })

    });
}

module.exports.watchForNewUser = watchForNewUser;
module.exports.flushLeavingUser = flushLeavingUser;
module.exports.updateReactionUser = updateReactionUser;
module.exports.updateSaidHelloUser = updateSaidHelloUser;
module.exports.setKickWatcher = setKickWatcher;
module.exports.setIcaoWatcher = setIcaoWatcher;