var vash = require('vash');

var tpl4 = vash.compile(
    '<style> TBD </style>' +
    '<p class="header">Hi there, here are your shared note alerts for today.</p>' +
    '<ul class="termlist">' +
    '@model.forEach(' +
    ' function(t) {' +
    '<li class="termlistitem"><p class="searchterm">@t.name</p>' +
    '<ul class="pagelist">' +
    '@t.pages.forEach(' +
    'function(pmd) {' +
    '<li class="pagelistitem"><p class="pagetitle">@pmd.pageTitle -- @pmd.lastModifiedTime</p>' +
    '<ul class="paralist">@pmd.paragraphs.forEach( function(paramd) { <li class="paralititem"><p class="para">@paramd.text -- @paramd.author</p></li> } )</ul></li>' +
    ' })' +
    '</ul></li>' +
    '} )' +
    '</ul>');

var Vasher = function() {
    this.composeMailBody = function(apiJson) {
        return tpl4(apiJson);
    };
};

module.exports = new Vasher();
