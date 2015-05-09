var $loginBtn, $searchBtn, $keyBtn, $visibleKeywordCount, searchTerms;
var $doneTxt = "Congratulations! You're the 100th visitor!!! Also, you'll recieve daily alerts for the search terms you entered.";
var $inProgressText = "Please sip your cup of coffee while we look for the relevant notes... ";

$(function () {
    searchTerms = [];
    $('#containerActive').hide();
    $loginBtn = $('#loginButton');
    $searchBtn = $('#searchBtn');
    $keyBtn = $('#addKeywordBtn');
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

function ProcessFailedApiResponse(xmlHttpRequest, textStatus, errorThrown) {
    alert('Error when saving search terms. Skipping note... status:' + xmlHttpRequest.status + ', status text: ' + xmlHttpRequest.statusText);
}

function ProcessSuccesfulApiResponse(passedObject) {
    //alert('Successfully processed API response + // TODO: What should we do in the UI after successfully registering the terms? ' + passedObject);
    $('#prgBar').hide();
    $('#status').text($doneTxt);
    $('.list-group-item').hide();
    $('#li0').show();
	$('#keywordList').hide();
	searchTerms = [];
	// TODO: What should we do after successfully registering the terms?
}

function clickOnPlusButton() {
    $visibleKeywordCount++;
    if ($visibleKeywordCount === 1) {
        $('#keywordList').show();
        $('#containerActive').hide();
    }
    var listelem = '#li' + $visibleKeywordCount.toString();
    var tt = listelem + 'Text';
    $(listelem).show();
    var txt = $('#keywordText').val();
    searchTerms.push(txt); // We'll need to remember this when the user clicks "go"
    $(tt).text(txt);
    $('#keywordText').val("");
    $('#keywordText').focus(); // move the cursor to the textbox
}

function deleteKeywords(compId) {
    $(compId).hide();
    
}

function updateButtons() {
    $visibleKeywordCount = 0;
    $('#keywordList').hide();
    $loginBtn.on('click', function () {
        deleteAllCookies();
        $('#signout').click();
    });

    $searchBtn.on('click', function () {
        //$('#keywordList').hide();
        $('#containerActive').show();
        // Use the searchTerms list to send a POST request to the server
        $.ajax({
            url: "/registerTerms", 
            data: {
                terms: searchTerms
            },
            type: 'post',
            error: ProcessFailedApiResponse,
            success: ProcessSuccesfulApiResponse
        });
    });
    
    $('#keywordText').keydown(function (event) {
        // check for enter - add the item if user clicked that button
        if (event.which === 13) {
            event.preventDefault();
            clickOnPlusButton();
        }
    });

    $keyBtn.on('click', function () {
	    clickOnPlusButton();
    });

	$(".delete_button").click(function(event) {
        $(event.target).closest('li').hide();
		searchTerms.pop();
		$visibleKeywordCount--;
	});
}

function disableCreateButtons(disabled) {
    $('#createExamples').find('button').each(function () {
        $(this).attr('disabled', disabled);
    });
}