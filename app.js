var Crawler = require('crawler');
var url = require('url');
var visitedUrls = [];
var target = {
    potentialTwitterUrl: null,
    bioUrl: null,
    origin: null,
};

var websiteCrawler = new Crawler({
    maxConnections: 1,
    callback: function (error, result, $) {
        Array.prototype.forEach.call($('a'), function(el, idx) {
            var uri = parseUri($(el).attr('href'));
            var url = uri.source;
            var host = uri.host;
            // var url = parseUri($(el).attr('href'));
            // console.log(url)

            if (typeof url !== 'string') return;
            if (visitedUrls.indexOf(url) > -1) {
                return;
            } else {
                visitedUrls.push(url);
            }

            if (!!url.match(/(twitter.com)/gi)) {
                console.log('CHECKING TWITTER', url, '\n')
                twitterCrawler.queue(url);
                target.potentialTwitterUrl = url;
            } else if (!!host.length && result.options.uri.indexOf(host) > -1) {
                // console.log('source:',url,'TLD:',host, 'scraped from', result.options.uri, '\n')
                console.log('Adding to the queue:', url, 'from', result.options.uri, '\n')
                websiteCrawler.queue(url);
            }
        })
    },
    onDrain: function () {
        console.log('Clearing out the cache.');
        visitedUrls = [];
    }
})

var twitterCrawler = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        var bioLink = [parseUri($('.ProfileHeaderCard-url a').attr('href')).source, parseUri($('.ProfileHeaderCard-url a').attr('title')).source];
        console.log('TWITTER BIO URL', bioLink,'\n');
        target.bioUrl = bioLink;
        isTwitterFound(target);
    }
})

var findTwitter = function (url) {
    target.origin = url;
    websiteCrawler.queue(url);
}

var isTwitterFound = function (target) {
    var i;
    for (i = 0; i < target.bioUrl.length; i++) {
        if (target.origin === target.bioUrl[i]) {
            console.log('==============');
            console.log('Found match for', target.origin, ':', target.potentialTwitterUrl);
            console.log('==============');
            return target.potentialTwitterUrl;
        }
    }
    console.log('==============');
    console.log('Could not find match',target);
    console.log('==============');
    return false;
}

function parseUri (str) {
    var o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

parseUri.options.strictMode = true;
findTwitter('http://amtrak.com');
