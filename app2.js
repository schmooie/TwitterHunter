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
                console.log('Comparing input uri:', parseUri(url).source, 'against Twitter bio uri:', parseUri(twitterBioUrls[i]).source)
                if (parseUri(url).source === parseUri(twitterBioUrls[i]).source) {
                    console.log('\n\nBOOM! FOUND IT.\n' + twitterUrl);
                    return twitterUrl;
                }
            }
        }
        console.log('\n\nCouldn\'t find the Twitter. :(');
    });
}

findTwitter('http://boostmobile.com')

