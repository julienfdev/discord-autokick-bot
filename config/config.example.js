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
    kickDelay: 43200,   // Number in seconds, example : 12 hours
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
        userLeftMessage : "a mean message when the user left or is being kicked",
        kickMessage: 'kick reason string'
    },
    commands:{
        prefix: '$',
        defaultReply: '<missing_command_reply>',
        haikuUrl: 'you need to figure this out yourself',
        haikuParameters: {
            // An object with the urlSearchParams
        }
    }
};

module.exports = config;