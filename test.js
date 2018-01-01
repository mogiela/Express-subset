var hujiwebserver = require("./hujiwebserver.js");
var fs = require("fs");

var PORT = 8080;

hujiwebserver.use('/hello/world', function (req, res, next) {
    res.status(200).send("hello world");
});

hujiwebserver.use('/add/:n/:m', function (req, res, next) {
    var json = {result: req.params.n*req.params.m};
    res.status(200).json(json);
});

hujiwebserver.use('/filez/:file', function (req, res, next) {
    var filesDic = {"html": "text/html", "js":"application/javascript", "css":"text/css"};
    var folder = "./filez/";
    try{
        var resolvedPath = fs.realpathSync(folder + req.params.file);
        var suffix = resolvedPath.slice(resolvedPath.lastIndexOf(".") + 1);
                if (suffix in filesDic){
                    res.set('Content-Type',filesDic[suffix]);
                    try {
                        var data = fs.readFileSync(resolvedPath, "utf8");
                         res.status(200).send(data);
                    }catch (e){
                        res.status(500).send("can't read the file");
                    }
                }
    }catch (e){
        res.status(500).send("can't read the file");
    }
});

hujiwebserver.use('/cookie', function (req, res, next) {
    console.log(req.cookies);
	res.status(200);
	res.send(req.cookies);
});

var server = hujiwebserver.start(PORT, function(err) {
        if (err) {
        console.log("test failed :" + err);
        }
        setTimeout(function() {server.stop();console.log("server shutdown")},300000);
});
