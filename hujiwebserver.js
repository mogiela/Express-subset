var net = require('net');
var Parser = require('./reqParser.js').Parser;


var TIMEOUT = 25000;
var resources = [];


function serverObj(port,callBack) {
    this.port = port;
    var server = net.createServer(function(connection){
        var req = null;
        connection.parser = new Parser();

        connection.setEncoding('utf8');

        connection.on('data',function (data) {
            if((req = connection.parser.howToParse(data)) !== null){
                respond(req,send);
            }
        });


        connection.on('error', function (error) {
            console.log("socket error:   " + error);//TODO
        });

        connection.setTimeout(TIMEOUT, close);


        function close() {
            connection.end();
        }

        function send(response) {
            connection.end(response);
        }
    });

    server.on('error', function (err) {
        if (err.code === "EADDRINUSE") {
            callBack(err);
        }
    });

    server.stop = function() {
        server.close();
    };

    server.listen(port, callBack);

    function respond(request,send) {
        var pass = 0;
        var res = new Res(send);
        var middleTimeOut = 10000;
        var values = [];
        setTimeout(function() {
            if(!res.alreadySent){
                res.status(404).send
            }
        },middleTimeOut);

        if(request.hasError !== undefined){
            return res.status(request.hasError.statCode).send(request.hasError.message);
        }

        function next() {//TODO :(
            for (pass; pass < resources.length; pass++) {

                var resource = resources[pass];
                values = resource.command.exec(request.path);
                if (values){//TODO
                    for (var name in resource.params){
                        request.params[name] = values[resource.params[name]+1];

                    }
                    pass++;
                    resource.middleware(request, res, next);
                    break;
                }
            }
        }

        try{
            next();
        }
        catch(e){
            return res.status(500).send();
        }

        if(!res.alreadySent){
            return res.status(404).send();
        }
    }

    return server;

}

exports.start = function(port, callback) {//TODO
    return new serverObj(port,callback);
};

exports.use = function (command, middleware) {
    if(middleware === undefined){
        middleware = command;
        command = "/";
    }
    var counter = 0;
    var i = 0;
    var placesToGo ={};
    while(i < command.length){
        var string = "";
        if (command[i] === ":"){
            i++;
            while(i < command.length && command[i] !== "/"){
                string += command[i];
                i++;
            }
        }
        if(string !== ""){
            placesToGo[string] = counter;
            counter++;
        }
        i++;
    }



    command = command.replace(/:[^/]+/g,"([^/\n]+)");
    if(command[command.length-1] === "/"){
        command += ".*";
    }
    else{
        command += "(?:/.*)*$";
    }
    resources.push({command: new RegExp("^" + command), middleware: middleware, params:placesToGo});
    return this;
};

function Res(func) {
    var properties = {"content-length": 0};
    var statCode = 200;
    var resBody = undefined;
    this.alreadySent = false;
    var that = this;

    this.set = function(fields,value){
        if (fields === "Content-Type" && this.get("Content-Type")){
            return;
        }
        if (value === undefined){
            for (var field in fields){
                properties[field.toLowerCase()] = fields[field];
            }
        }
        else{
            properties[fields.toLowerCase()] = value;
        }
    };
    this.status = function(Code){
        statCode = Code;
        return that;
    };

    this.get = function (field) {
        return properties[field.toLowerCase()]
    };

    this.cookie = function (name, value) {
        properties["set-cookie"] = name + "=" + value;
    };

    var testJSON = function (body) {
        try{
            JSON.parse(body);
            return true;
        }catch (e){
            return false;
        }
    };


    this.send = function (body) {
        if (that.alreadySent){
            return console.log("send method is called multiple times");
        }
        that.alreadySent = true;

        if (body != undefined){
            if(typeof body === "string"){

                that.set("Content-Length", body.length);

                if(testJSON(body)){
                // resBody = JSON.parse(body);
                // resBody = JSON.stringify(resBody)
                    that.set("Content-Type", "application/json");
                }
                else{
                    that.set("Content-Type","text/html");
                }
                resBody = body;
            }
            else{
                that.set("Content-Type", "application/json");
                resBody = JSON.stringify(body);
                that.set("Content-Length", resBody.length);
            }
        }
        else{
            resBody = "";
        }

        func(that.rep() + resBody);

    };

    this.json = function (body) {
        if(that.alreadySent){
            return console.log("send method is called multiple times");
        }
        that.alreadySent = true;
        that.set("Content-Type","application/json");
        resBody = JSON.stringify(body);
        that.set("Content-Length", resBody.length);
        func(that.rep() + resBody);
    };

    this.rep = function() {

        var PROTOCOL = "HTTP/1.1 ";
        var EndOfLine = "\r\n";
        var message = " OK";

        var res = PROTOCOL + statCode.toString() + message + EndOfLine;

        for(var property in properties) {
            res += property + ": " + properties[property] + EndOfLine;
        }

        return res + EndOfLine;
    }
}