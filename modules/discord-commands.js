const commandConfig = require('../config/config').commands;
const discordConfig = require('../config/config').discordConfig;
const fetch = require('node-fetch');
const logger = require('./logger');

const commandHandler = async (client) => {
    client.on('message', async (message) => {
        if (!message.content.startsWith(commandConfig.prefix)) return;
        const rawCommand = message.content.slice(commandConfig.prefix.length);
        const commandArray = rawCommand.split(' ');
        const command = commandArray[0];
        let args = [];
        if (commandArray.length > 1) {
            args = [...commandArray];
            args.shift();
        }
        switch (command) {
            case 'haiku':
                haikuHandler(message);
                break;
            case 'kick':
                // We first check if the author has the right to invoke the kick command
                if (await messageAuthorAuthorized(message, commandConfig.kick.rolesAuthorized, client)) {
                    // We use the kickHandler to react to the command
                    kickHandler(client, message, args);
                } else {
                    message.reply(commandConfig.kick.messageUnauthorized);
                }
                break;
            case 'metar':
                metarHandler(message, args)
                break;
            default:
                message.reply(commandConfig.defaultReply);
                break;
        }
    })
};

const haikuHandler = async (message) => {
    const url = new URL(commandConfig.haiku.haikuUrl);
    url.search = new URLSearchParams(commandConfig.haiku.haikuParameters).toString();

    const responseObject = await fetch(url)
    let responseString = await responseObject.text();

    // Replying to the message
    const replyString = haikuParser(responseString);
    message.reply(`\n${replyString}`);
}

const kickHandler = async (client, message, args) => {
    // First, we check that a single argument is provided
    if (!args.length) return message.reply(commandConfig.kick.messageMissingArg);
    if (args.length > 1) return message.reply(commandConfig.kick.messageTooManyArgs);

    try {
        // We try to get the member, if it throws an exception, it's likely due to an incorrect mention
        const memberToKick = await getMember(client, tagToId(args[0]));
        if(memberToKick){
            // We then check if the member we want to kick is protected
            if(!protectedRole(memberToKick.roles.cache.map(role => role.id), commandConfig.kick.rolesProtected)){
                // If not protected, we can kick the user
                kickRoutine(message, memberToKick);
            }
            else{
                message.reply(commandConfig.kick.messageProtected);
            }
        }

    } catch (error) {
        message.reply(commandConfig.kick.messageNeedMention);
        logger.error(error.message);
    }
}

const metarHandler = async (message, args) =>{

    // Validation
    if (!args.length) return message.reply(commandConfig.metar.messageMissingArg);
    if (args.length > 1) return message.reply(commandConfig.metar.messageTooManyArgs);
    if(!args[0].match(/[A-Za-z]{4}/g)) return message.reply(commandConfig.metar.messageNotAMetar);

    const url = new URL(`${commandConfig.metar.avwxUrl}/${args[0]}`);
    
    const fetchResponse = await fetch(url, {
        headers: { 'Authorization': `TOKEN ${commandConfig.metar.avwxToken}`}
    })
    if(fetchResponse.status === 200){
        const fetchObject = await fetchResponse.json();
        message.reply(formatMetarString(commandConfig.metar.messageMetar, fetchObject));
    }
    else{
        message.reply(commandConfig.metar.messageMetarNotFound);
    }

};

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

// Funny kick routine
const kickRoutine = (message, member) =>{
    const channel = message.channel;

    channel.send(formatKickString(commandConfig.kick.messageKickIntro, member));
    setTimeout(() =>{
        channel.send(formatKickString(commandConfig.kick.messageKickFirst, member));
        channel.send(formatKickString(commandConfig.kick.messageKickSecond, member));
    }, 3500);
    setTimeout(()=>{
        channel.send(formatKickString(commandConfig.kick.messageKickThird, member));
    }, 7000);
    setTimeout(()=>{
        channel.send(formatKickString(commandConfig.kick.messageKickFourth, member));
        channel.send(formatKickString(commandConfig.kick.messageKickFifth, member));
    }, 10500)
    setTimeout(()=>{
        channel.send(formatKickString(commandConfig.kick.messageKickSixth, member));
    }, 14000)
    setTimeout(()=>{
        channel.send(formatKickString(commandConfig.kick.messageKickSeventh, member));
        member.kick();
    }, 15000);
}

const messageAuthorAuthorized = async (message, authorizedRoles, client) => {
    // First we get the roles the author has inside the guild
    const guild = await client.guilds.fetch(discordConfig.guildId);
    const member = await guild.members.fetch(message.author.id);
    const roles = member.roles.cache.map(role => role.id);
    // We try to match the roles of the author with the authorized roles
    const matchingRoles = roles.filter(role => authorizedRoles.includes(role));
    return Boolean(matchingRoles.length);
};

const tagToId = (tag) =>{
    return tag.replace(/[\\<>@#&!]/g, "");
}

const getMember = async (client, id) => {
    const guild = await client.guilds.fetch(discordConfig.guildId);
    const member = await guild.members.fetch(id);

    return member;
}

const protectedRole = (roles, protectedRoles) =>{
    return Boolean(roles.filter(role => protectedRoles.includes(role)).length);
};

const formatKickString = (string, member) =>{
    return string.replace('[member]', `<@${member.user.id}>`);
};

const formatMetarString = (string, responseObject) =>{
    return string.replace('[ICAO]', responseObject.station).replace('[METAR]', responseObject.sanitized);
};

module.exports = commandHandler;