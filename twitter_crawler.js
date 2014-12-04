var Crawler = require('crawler');
var Q = require('q');
var parseUri = require('./uri_parser');

module.exports = function (twitterUrls) {
    return Q.promise(function(resolve, reject, notify) {
        var bioUrls = {};

        var twitterCrawler = new Crawler({
            callback: function (err, res, $) {
                bioUrls[res.options.uri] = [
                    parseUri($('.ProfileHeaderCard-url a').attr('href')).source,
                    parseUri($('.ProfileHeaderCard-url a').attr('title')).source
                ]
            },
            onDrain: function () {
                // resolve this shit
                for (var twitterUrl in bioUrls) {
                    bioUrls[twitterUrl].forEach(function(url, index, arr) {
                        return arr.indexOf(url) === index;
                    });
                }
                resolve(bioUrls);
            }
        });
        twitterCrawler.queue(twitterUrls);
    });
}
