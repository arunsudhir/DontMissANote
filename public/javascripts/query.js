var $loginBtn;

$(function () {
    $loginBtn = $('#loginButton');
    updateLoginButton();
    $('#createExamples').find('button').each(function () {
        $(this).on('mouseup', function (e) {
            $(e.target).after('<img src="images/spinner.gif" style="margin-left: 5px;"/>');
            window.setTimeout(function () { disableCreateButtons(true); }, 0);
        });
    });
});

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

function updateLoginButton() {
    $loginBtn.on('click', function () {
        deleteAllCookies();
        $('#signout').click();
    });
}

function disableCreateButtons(disabled) {
    $('#createExamples').find('button').each(function () {
        $(this).attr('disabled', disabled);
    });
}