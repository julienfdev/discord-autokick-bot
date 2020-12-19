const mongoose = require('mongoose');
const logger = require('./logger');

// Careful, it's designed for an Atlas mongoDB, you can delete the +srv if you have a local mongoDB database
const init = async (config) => {
    try {
        await mongoose.connect(` mongodb+srv://${config.user}:${config.pass}@${config.host}/${config.dbName}?retryWrites=true&w=majority`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        logger.log('Database connected!')
    } catch (error) {
        logger.error(`Database error - ${error.message}`)
    }
};

module.exports.init = init;