var Crawler = require('crawler');
var Q = require('q');
var parseUri = require('./uri_parser');

module.exports = function (url) {
    return Q.promise(function(resolve, reject, notify) {
        var twitterUrls = [];
        var visitedUrls = [];

        var websiteCrawler = new Crawler({
            maxConnections: 1,
            skipDuplicates: true,
            callback: function (err, res, $) {
                if (err) {
                    reject(err);
                }

                Array.prototype.forEach.call($('a'), function(el, i) {
                    var uri = parseUri($(el).attr('href'));
                    var url = uri.source;
                    var host = uri.host;

                    if (typeof url !== 'string' || !url.length) return;

                    if (visitedUrls.indexOf(url) > -1 || twitterUrls.indexOf(url) > -1) {
                        return;
                    } else {
                        visitedUrls.push(url);
                    }

                    if (!!url.match(/(twitter.com)/gi)) {
                        console.log('=====\nFound a Twitter url: ' + url + '\n=====');
                        twitterUrls.push(url);
                    } else if (!!host.length && res.options.uri.indexOf(host) > -1) {
                        console.log('Adding to the queue:', url);
                        websiteCrawler.queue(url)
                    }
                });
            },
            onDrain: function () {
                console.log ('\nWeb queue drained. Emptying cache.');
                console.log('Potential Twitter URLs:', twitterUrls + '\n');
                resolve(twitterUrls);
            }
        });

        websiteCrawler.queue(url);
    });
}
