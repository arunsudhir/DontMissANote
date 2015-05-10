$(function () {
    $('#createExamples').find('button').each(function(){
        $(this).on('mouseup',function(e){
            $(e.target).after('<img src="images/spinner.gif" style="margin-left: 5px;"/>');
            window.setTimeout(function(){disableCreateButtons(true);},0);
        });
    });
});