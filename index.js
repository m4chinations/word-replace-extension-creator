var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    replace = require('replace'),
    fs = require('fs.extra'),
    uuid = require('node-uuid'),
    zipdir = require('zip-dir'),
    rimraf = require('rimraf'),
    exec = require('child_process').exec;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/post', function (req, res) {
    console.dir(req.body);
    var ff_dir = './ff_tmp'+uuid.v4();
    fs.copyRecursive('./extension_base/source/firefox', ff_dir, function (err) {
        if (err)
            console.err(err);
        console.log("---Building Firefox XPI---");
        replace({
            regex: 'CONTENT',
            replacement: req.body.payload,
            paths: [ff_dir.slice(2)],
            recursive: true,
            silent: false
        });
        exec('cd '+ff_dir+' && jpm xpi', function() {
        });
        app.get('/'+ff_dir.slice(7), function (req, res) {
            res.sendFile('@firefox-0.0.1.xpi', { root : ff_dir });
            setTimeout(function() {
                rimraf(ff_dir, function() {});
                for(i = 0; i < app.routes.get.length; i++){
                    if(app.routes.get[i].path === '/'+ff_dir.slice(7)){
                        app.routes.get.splice(i,1); 
                    }
                }
            }, 30000);
        });
        console.log("---DONE. Serving XPI---");
    });
    console.log("---Building Chrome ZIP---");
    var chrome_dir = './chrome_tmp'+uuid.v4();
    fs.copyRecursive('./extension_base/source/chrome', chrome_dir, function (err) {
        if (err)
            console.log(err);
        replace({
            regex: 'CONTENT',
            replacement: req.body.payload,
            paths: [chrome_dir.slice(2)],
            recursive: true,
            silent: false
        });
        zipdir(chrome_dir, { saveTo : chrome_dir + '.zip' }, function () {});
        app.get('/'+chrome_dir.slice(12), function (req, res) {
            res.sendFile(chrome_dir + '.zip', { root : '.' });
            setTimeout(function() {
                rimraf(chrome_dir);
                for(i = 0; i < app.routes.get.length; i++){
                    if(app.routes.get[i].path === '/'+chrome_dir.slice(7)){
                        app.routes.get.splice(i,1); 
                    }
                }
            }, 30000);
        });
    });

    res.type('json');
    res.send({ files: [ff_dir.slice(7), chrome_dir.slice(12)] });
});
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


var port = process.env.PORT || 8080;

var server = app.listen(port, function() {});
