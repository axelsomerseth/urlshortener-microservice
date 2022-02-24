require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// URL Shortener endpoint
const createAndSaveShortUrl = require('./repository').createAndSaveShortUrl;
app.post('/api/shorturl', (req, res, next) => {
    const parsedURL = url.parse(req.body.url, false);
    const options = { family: 0, hints: dns.ADDRCONFIG };
    dns.lookup(parsedURL.hostname, options, (err, address, family) => {
        if (err) console.error(err);
        console.debug('address: %j family: IPv%s', address, family);
    });
    next();
}, (req, res) => {
    const parsedURL = url.parse(req.body.url, false);
    if (!parsedURL.hostname) {
        res.json({ error: 'invalid url' });
        return;
    }
    createAndSaveShortUrl({ original_url: parsedURL.href }, (err, doc) => {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        const result = {
            original_url: doc.originalUrl,
            short_url: doc.shortUrl
        };
        res.json(result);
    });
});

const findShortUrlByNumber = require('./repository').findShortUrlByNumber;
app.get('/api/shorturl/:shorturl', (req, res) => {
    const shortURL = req.params.shorturl;
    findShortUrlByNumber(shortURL, (err, doc) => {
        if (err) {
            res.json({ error: err });
            return;
        }
        const result = {
            original_url: doc.originalUrl,
            short_url: doc.shortUrl
        };
        // TODO: redirect
        console.debug(`ShortURL: ${result.short_url}, redirecting to ${result.original_url}`);
        res.redirect(result.original_url);
    });
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});