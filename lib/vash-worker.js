var vash = require('vash');

var headerStyle = "font-weight:200; font-size:2rem; line-height:1.3; color:purple";

var tpl4 = vash.compile(
    '<html><head>'+
    '<style>' +
    '.header ' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<p style="' + headerStyle + '">Good morning,</p>' +
    '<p style="' + headerStyle + '">Here are the <b>Shared Notes</b> that were updated yesterday.<br> Happy kibitzing!</p><br>' +
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
         '<li class="paralititem"><a href="@paramd.paragraphWebUrl"><p class="para">@paramd.text</p></a> was last modified at @paramd.lastModifiedTime by @paramd.author' +
    '</li> } )</ul></li>' +
    ' })' +
    '</ul></li>' +
    '} )' +
    '</ul></body></html>');

var Vasher = function() {
    this.composeMailBody = function(apiJson) {
        return tpl4(apiJson);
    };
};

module.exports = new Vasher();
