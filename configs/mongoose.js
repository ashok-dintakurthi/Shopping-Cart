let configs = require('./configs');
let mongoose = require('mongoose');

let mongoDBOptions = {
    retryWrites: true,
    useNewUrlParser: true
}
module.exports = () => {
    let db = mongoose.connect(configs.db, mongoDBOptions).then(
        (success) => { console.log(`MongoDB Connected`) },
        (err) => { console.log(`Error in Connecting to DB`, err) }
    )
    mongoose.set('useCreateIndex', true);
    return db;
}
