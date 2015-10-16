$(document).ready(function() {

$('button').click(function(e) {
    if ($(this).attr('name') == 'simple') {
        $('<div class="simplesearch"><input class="simple first" placeholder="cloud" type="text"/><input class="simple second" placeholder="butt" type="text"/></div>').insertBefore('#submit');
    } else if ($(this).attr('name') == 'regex') {
        $('<div class="regexsearch"><input class="regex first" placeholder="/\\bcloud\\b/g" type="text"/><input class="regex second" placeholder="butt" type="text"/></div>').insertBefore('#submit');
    } else if ($(this).attr('name') == 'submit') {
        var payload = generateJSFromForm();
        $.ajax({
            url : 'post',
            type : 'POST',
            data: { payload : payload },
            dataType : 'json',
            success: function (result) {
                console.log(result);
                $('body').append('<a href="/'+result.files[0]+'">Firefox XPI</a>');
                $('body').append('<a href="/'+result.files[1]+'">Chrome ZIP</a>');
            },
            error: function (xhr, options, err) {
                console.log(xhr, options, err);
            }
        });
    }
});




RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function generateJSFromForm() {
   var simpleTemplate = 'v = v.replace(/\\b{{cloud}}\\b/g, "{{butt}}");';
   var regexTemplate = 'v = v.replace({{cloud}}, "{{butt}}");';

   var simples = [];
   var regexs = [];

   $.each($('.simplesearch'), function(index, value) {
        if (!$(value).children().first().val() && !$(value).children().eq(1).val()) 
            return;
        simples.push(simpleTemplate.replace(/\{\{cloud\}\}/g, RegExp.escape($(value).children().first().val())).replace(/\{\{butt\}\}/g, $(value).children().eq(1).val()));
   });
   $.each($('.regexsearch'), function(index, value) {
        if (!$(value).children().first().val() && !$(value).children().eq(1).val()) 
            return;
       regexs.push(regexTemplate.replace(/\{\{cloud\}\}/g, $(value).children().first().val()).replace(/\{\{butt\}\}/g, $(value).children().eq(1).val()));
   });

   return regexs.join('\n') + simples.join('\n');
}



});
