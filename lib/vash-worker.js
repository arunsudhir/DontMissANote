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
var today = new Date().toDateString();

var fixupOffset = function(date) {
    date.setHours(date.getHours() - 7);
	return new Date(date);
}

var markUpHits = function (inputstring, termstring) {
    return inputstring.replace(termstring, "<span style=\"background-color: #FFFF00\">" + termstring + "</span>");
}

var tpl4 = vash.compile(
    '<html><head>'+
    '</head>' +
    '<body>' +
        '<div align="center"><table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td style="padding:0in 0in 0in 0in">' +
        '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td valign="top" style="padding:0in 0in 0in 0in">' +
        '<p style="margin:0in;margin-bottom:.0001pt"><img src="http://mywimbo.com/onenotelogo.png" width="35" height="35" style="align:center;margin-top:0px;background-color: white;"><span style="align:center;font-size:21pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#1570A6">OneNote Daily Shared Notes Alerts</span></p>' +
        '<p style="margin-top:3.75pt;margin-right:0in;margin-bottom:3.75pt;margin-left:0in"><span style="font-size:13.5pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#626262">' + today + '</span></p>' + 
        '</td></tr></tbody></table></td></tr></tbody></table></div><p style="margin:0in;margin-bottom:.0001pt"></p>' +
        '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td style="padding:0in 0in 0in 0in">' +
    '@model.forEach(' +
    ' function(t) {' +
         '<table border="1" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;border:none;border-bottom:solid #E0E0E0 1pt;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td width="20" style="width:15pt;border:none;padding:.25in 0in 9pt 0in">' + 
         '<table border="0" cellspacing="0" cellpadding="0" style="mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;height:13pt">' +
         '<td width="18" style="width:13pt;background:purple;padding:0in 0in 0in 0in;height:13pt"><div><p style="margin:0in;margin-bottom:.0001pt">&nbsp;&nbsp;&nbsp;&nbsp;</p></div></td></tr></tbody></table></td><td width="6" style="width:4.5pt;border:none;padding:.25in 0in 9pt 0in"></td>' +
         '<td style="border:none;padding:.25in 0in 9pt 0in"><p style="margin:0in;margin-bottom:.0001pt;line-height:15pt"><span style="font-size:15pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#444444">@t.name</span></p></td></tr></tbody></table>' +
    '@t.pages.forEach(' +
    'function(pmd) {' +
        '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td style="padding:0in 0in 0in 0in">' +
        '<p style="margin-top:2.0pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt"><span style="font-family:&quot;Segoe UI&quot;,sans-serif">@{var color = pmd.isNew ? "red" : "green";} <font color="@color">&#10084;</font> <a href="@pmd.pageWebUrl">@pmd.pageTitle</a></span></p></td></tr></tbody></table>' +
       '@pmd.paragraphs.forEach( function(paramd) { ' +
           '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td style="padding:0in 0in 0in 0in">' +
           '<p style="margin-top:1pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;font-size:10pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#444444"> @html.raw(paramd.text) … </p>' +
           '<p style="margin-top:1pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt"><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#111111">  was last modified by  @paramd.author  </span><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#999999"> &#8226; </span>' + 
           '<span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#111111">  @paramd.lastModifiedTime  </span><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#999999"> &#8226; </span></p>' +
           '</td></tr></tbody></table>})' +
       '@pmd.images.forEach( function(paramd) { ' +
           '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;mso-cellspacing:0in;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in"><tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes"><td style="padding:0in 0in 0in 0in">' +
           '<p style="margin-top:1pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt";font-size:10pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#444444">Found an image containing : @paramd.text … </p>' +
           '<p style="margin-top:1pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt"><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#111111">  was last modified by  @paramd.author  </span><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#999999"> &#8226; </span>' + 
           '<span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#111111">  @paramd.lastModifiedTime  </span><span style="font-size:8pt;font-family:&quot;Segoe UI&quot;,sans-serif;color:#999999"> &#8226; </span></p>' +
           '</td></tr></tbody></table>})' +
    '})' +
    '})' +
   '</td></tr></tbody></table></body></html>');

var Vasher = function() {
    this.composeMailBody = function (apiJson) {
        for (var i in apiJson) {
            if (apiJson.hasOwnProperty(i)) {
                for (var j in apiJson[i].pages) {
                    if (apiJson[i].pages.hasOwnProperty(j)) {
                        for (var k in apiJson[i].pages[j].paragraphs) {
                            if (apiJson[i].pages[j].paragraphs.hasOwnProperty(k)) {
                                apiJson[i].pages[j].paragraphs[k].lastModifiedTime = dateDiff(fixupOffset(apiJson[i].pages[j].paragraphs[k].lastModifiedTime), new Date());
	                            apiJson[i].pages[j].paragraphs[k].text = markUpHits(apiJson[i].pages[j].paragraphs[k].text, apiJson[i].name);
                            }
                        }
                        for (var k in apiJson[i].pages[j].images) {
                            if (apiJson[i].pages[j].images.hasOwnProperty(k)) {
                                apiJson[i].pages[j].images[k].lastModifiedTime = dateDiff(fixupOffset(apiJson[i].pages[j].images[k].lastModifiedTime), new Date());
                            }
                        }
                    }
                }
            }
        }
        return tpl4(apiJson);
    };
};

module.exports = new Vasher();
