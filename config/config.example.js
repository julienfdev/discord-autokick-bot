/*
    CONFIG FILE
    when filling in the gaps, remove the < > obviously
*/

const config = {
    botToken: '<your_bot_token>',
    mongoose: {
        user: '<mongodb_user>',
        pass: '<mongodb_pass>',
        host: '<mongodb_host>',
        dbName: '<mongodb_database>'
    },
    kickDelay: 43200, // Number in seconds, example : 12 hours
    kickCheckInterval: 30000, //Number in ms, example : 30 seconds
    discordConfig: {
        guildId: '<guild_id>',
        infoChannel: '<mean_message_channel_id>',
        rulesChannel: '<rules_channel_id>',
        rulesMessage: '<rules_message_id>',
        reactionEmoji: '🤝', // utf-8 emoji matching the emoji you reacted to your message with
        defaultRole: '<role_you_want_to_assign_after_reaction_id>',
        channelsToPostIn: ['<channel_1_id>', '<channel_2_id>', '<...>'] // an array of channels which will be listened for the new user to post
    },
    discordText: {
        userLeftMessage: "a mean message when the user left or is being kicked",
        kickMessage: 'kick reason string'
    },
    commands: {
        prefix: '$',
        defaultReply: '<missing_command_reply>',
        haikuUrl: 'you need to figure this out yourself',
        haikuParameters: {
            // An object with the urlSearchParams
        }
    },
    kick: {
        rolesAuthorized: ['<role_authorized_to_kick_id>', '...'],
        rolesProtected: ['<unkickable_role_id>', '...'],
        messageUnauthorized: 'Unauthorized to kick',
        messageMissingArg: 'Missing Arguments',
        messageTooManyArgs: 'One kick at a time',
        messageNeedMention: 'Need a proper @mention',
        messageProtected: 'Can\'t kick protected role',
        messageKickIntro: "You can unroll a short script with these messages, you can even use gifs",
        messageKickFirst: "by pasting their links",
        messageKickSecond: 'https://tenor.com/view/xxxx',
        messageKickThird: 'Have fun',
        messageKickFourth: 'Imagining',
        messageKickFifth: 'A neat',
        messageKickSixth: 'Kick',
        messageKickSeventh: 'Routine'
    },
    metar: {
        avwxToken: 'your AVWX API token',
        avwxUrl: 'https://avwx.rest/api/metar',
        avwxStationUrl: 'https://avwx.rest/api/station',
        messageMissingArg: 'Missing METAR arg',
        messageTooManyArgs: 'Only one METAR at a time',
        messageNotAMetar: "Not an ICAO code",
        messageMetarNotFound: "Metar not found",
        messageMetar: 'There\'s your last METAR for : **[ICAO]** :\n```[METAR]```'
    },
    icao: {
        messageReply: 'I think you meant :\n >>> [MESSAGE]'
    }
};

module.exports = config;