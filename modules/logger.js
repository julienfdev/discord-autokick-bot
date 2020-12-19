// We just add a timestamp to console.log and console.error

const log = (string) =>{
    const timestamp = new Date(Date.now())
    console.log(`[${timestamp.toISOString()}] - ${string}`)

};
const error = (string) =>{
    const timestamp = new Date(Date.now())
    console.error(`[${timestamp.toISOString()}] - ${string}`)
};

module.exports.log = log;
module.exports.error = error;