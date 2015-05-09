var vash = require('vash');

var dateDiff = function(fromdate, todate) {
    var seconds = Math.abs(todate - fromdate) / 1000;
    var divideBy = {
        w: 604800,
        d: 86400,
        h: 3600,
        n: 60,
        s: 1
    };
    var weeks = Math.floor(seconds / divideBy['w']);
    if (weeks > 0)
        return weeks + " weeks ago";
    var days = Math.floor(seconds / divideBy['d']);
    if (days > 0)
        return days + " days ago";
    var hours = Math.floor(seconds / divideBy['h']);
    if (hours > 0)
        return hours + " hours ago";
    var minutes = Math.floor(seconds / divideBy['n']);
    if (minutes > 0)
        return minutes + " minutes ago";
    var secs = Math.floor(seconds / divideBy['s']);
    if (secs > 0)
        return secs + " seconds ago";
};


var headerStyle = "font-weight:200; font-size:2rem; line-height:1.3; color:purple";

var tpl4 = vash.compile(
    '<html><head>'+
    '</head>' +
    '<body>' +
    '<p style="' + headerStyle + '">Good morning,</p>' +
    '<p style="' + headerStyle + '">Here are the <b>Shared Notes</b> that were updated yesterday.<br> Happy kibitzing!</p><br>' +
    '<img src="http://mywimbo.com/onenotelogo.png">' +
    '<ul class="termlist">' +
    '@model.forEach(' +
    ' function(t) {' +
    '<li class="termlistitem"><p class="searchterm">@t.name</p>' +
    '<ul class="pagelist">' +
    '@t.pages.forEach(' +
    'function(pmd) {' +
    '<li class="pagelistitem">' +
    '<a href="@pmd.pageWebUrl" class="pagetitleLink">@pmd.pageTitle</a>' +
    '<ul class="paralist">@pmd.paragraphs.forEach( function(paramd) { ' +
         '<li class="paralititem"><a href="@paramd.paragraphWebUrl"><p class="para">@paramd.text</p></a> was last modified ' +
         '@paramd.lastModifiedTime' + 
    ' by @paramd.author' +
    '</li> } )</ul></li>' +
    ' })' +
    '</ul></li>' +
    '} )' +
    '</ul></body></html>');

var Vasher = function() {
    this.composeMailBody = function (apiJson) {
        for (var i in apiJson) {
            if (apiJson.hasOwnProperty(i)) {
                for (var j in apiJson[i].pages) {
                    if (apiJson[i].pages.hasOwnProperty(j)) {
                        for (var k in apiJson[i].pages[j].paragraphs) {
                            if (apiJson[i].pages[j].paragraphs.hasOwnProperty(k)) {
                                apiJson[i].pages[j].paragraphs[k].lastModifiedTime = dateDiff(apiJson[i].pages[j].paragraphs[k].lastModifiedTime, new Date());
                            }
                        }
                    }
                }
            }
            //var s = dateDiff(someTime, new Date())); //displays 625
        }
        return tpl4(apiJson);
    };
};

module.exports = new Vasher();
