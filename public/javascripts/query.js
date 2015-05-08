﻿var $loginBtn, $searchBtn;

$(function () {
    $('#containerActive').hide();
    $loginBtn = $('#loginButton');
    $searchBtn = $('#searchBtn');
    updateButtons();
    $('#createExamples').find('button').each(function () {
        $(this).on('mouseup', function (e) {
            $(e.target).after('<img src="images/spinner.gif" style="margin-left: 5px;"/>');
            window.setTimeout(function () { disableCreateButtons(true); }, 0);
        });
    });
});

var progress = setInterval(function () {
    var $bar = $('.bar');
    
    if ($bar.width() >= 400) {
        clearInterval(progress);
        $('.progress').removeClass('active');
    } else {
        $bar.width($bar.width() + 40);
    }
    $bar.text($bar.width() / 4 + "%");
}, 800);

function getCookie(name) {
    var cookies = document.cookie;
    name += "=";
    var start = cookies.indexOf(name);
    if (start >= 0) {
        start += name.length;
        
        var end = cookies.indexOf(';', start);
        if (end < 0) {
            end = cookies.length;
        }
        return cookies.substring(start, end);
    }
    return null;
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function updateButtons() {
    $loginBtn.on('click', function () {
        deleteAllCookies();
        $('#signout').click();
    });
    $searchBtn.on('click', function () {
        $('#searchBtn').hide();
        $('#containerActive').show();
    });
}

function disableCreateButtons(disabled) {
    $('#createExamples').find('button').each(function () {
        $(this).attr('disabled', disabled);
    });
}