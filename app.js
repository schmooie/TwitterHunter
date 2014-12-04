var url = require('url');
var Q = require('q');
var websiteCrawler = require('./web_crawler');
var twitterCrawler = require('./twitter_crawler');
var parseUri = require('./uri_parser');

var findTwitter = function (url) {
    websiteCrawler(url)
    .then(twitterCrawler)
    .then(function(result) {
        for (var twitterUrl in result) {
            var twitterBioUrls = result[twitterUrl];
            var i;
            for (i = 0; i < twitterBioUrls.length; i++) {
                console.log('Comparing input uri:', parseUri(url).authority, 'against Twitter bio uri:', parseUri(twitterBioUrls[i]).authority)
                if (parseUri(url).authority.split('.').slice(-2).join('.') === parseUri(twitterBioUrls[i]).authority.split('.').slice(-2).join('.')) {
                    console.log('\n\nBOOM! FOUND IT.\n' + twitterUrl);
                    return twitterUrl;
                }
            }
        }
        console.log('\n\nCouldn\'t find the Twitter. :(');
        // try google here
    });
}

findTwitter('http://uniqlo.com')

