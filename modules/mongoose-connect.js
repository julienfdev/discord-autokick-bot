const mongoose = require('mongoose');
const logger = require('./logger');

const init = async (config) => {
    try {
        await mongoose.connect(` mongodb+srv://${config.user}:${config.pass}@${config.host}/${config.dbName}?retryWrites=true&w=majority`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        logger.log('Database connected!')
    } catch (error) {
        logger.error('Database error')
    }
};

module.exports.init = init;