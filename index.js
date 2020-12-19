const config = require('./config/config');
const mongooseConnect = require('./modules/mongoose-connect');
const discordClient = require('./modules/discord-client');
const listener = require('./modules/discord-listeners');
const methods = require('./modules/discord-methods');
const User = require('./models/User');
const commandHandler = require('./modules/discord-commands');

// Database connection
mongooseConnect.init(config.mongoose);
//Bot connect
discordClient.connectBot(config.botToken);
//Listeners
listener.watchForNewUser(discordClient.client, User);
listener.flushLeavingUser(discordClient.client, User);
listener.updateReactionUser(discordClient.client, User);
listener.updateSaidHelloUser(discordClient.client, User);
listener.setKickWatcher(discordClient.client, User, config.kickDelay);

//Commands
commandHandler(discordClient.client);
