require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect database
const mySecret = process.env['MONGO_URI'];
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(mySecret, connectionOptions)
    .then(() => console.debug('Connection to the Atlas Cluster was succesful!'))
    .catch((err) => console.error(err));

const shortUrlSchema = new Schema({
    shortUrl: { type: Number, default: 0 }, // automatic number
    originalUrl: { type: String, required: true },
});
let ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// Create short url
const createAndSaveShortUrl = (shortUrlObj, done) => {
    ShortUrl.count({}, function(err, count) {
        if (err) done(err);
        const shortUrl = new ShortUrl({
            shortUrl: count,
            originalUrl: shortUrlObj.original_url,
        });
        shortUrl.save((err, doc) => {
            if (err) done(err);
            done(null, doc);
        });
    })
};

// Find short url
const findShortUrlByNumber = (number, done) => {
    ShortUrl.findOne({ shortUrl: number }, (err, doc) => {
        if (err) done(err);
        done(null, doc);
    });
};

exports.createAndSaveShortUrl = createAndSaveShortUrl;
exports.findShortUrlByNumber = findShortUrlByNumber;