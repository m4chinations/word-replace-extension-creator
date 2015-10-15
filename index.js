var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/post', function (req, res) {
    console.log(req.body);
});


function jsFromForm() {

}




var server = app.listen(3000, function() {});
