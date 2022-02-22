require('dotenv').config();
const mongoose = require('mongoose');

// Connect database
const mySecret = process.env['MONGO_URI'];
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(mySecret, connectionOptions)
    .then(() => console.debug('Connection to the Atlas Cluster is succesful!'))
    .catch((err) => console.error(err));

const { Schema } = mongoose;
const shortUrlSchema = new Schema({
    short_url: Number,
    original_url: String,
});
let ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// Create short url:
const createAndSaveShortUrl = (done) => {

};


// Find short url:
const findShortUrlByNumber = (number, done) => {

};