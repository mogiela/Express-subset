function Req() {
    this.hasError = undefined;
    this.method = null;
    this.params = {};
    this.query = {};
    this.cookies = {};
    this.path = null;
    this.host = null;
    this.protocol = null;
    this.get = function(name){
        return this.headerArry[name];
    };
    this.is = function (type){
        return (this.headerArry['Content-Type'] === type);
    };
    this.param = function (name){
        if(this.params.name){
            return this.params.name;
        }
        if(this.query.name){
            return this.query.name;
        }else{
            return null;
        }
    };
    this.body = null;
    this.headerArry = {};
    this.route = {};
}

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}


exports.Parser = function() {
    var tillNow = "";
    var Sperator = /\r\n\r\n/;
    var lenHeader = /Content-Length: (\d+)/i;
    var whatsLeft = 0;
    var areThereMoreToCome = false;


    this.howToParse = function(data){

        tillNow += data;
        var len = null;

        if(!areThereMoreToCome) {
            var twoParts = tillNow.split(Sperator);
            len = lenHeader.exec(twoParts[0]);
            if(len !== null){
                whatsLeft = parseInt(len[1]);
                areThereMoreToCome = true;
            }
            else{
                return(iKnowHowToParse(tillNow));
            }
            data = twoParts[1];
        }

        if(areThereMoreToCome){
            whatsLeft -= data.length;
            if(whatsLeft <= 0){
                var overFlow = -whatsLeft;
                var whatToParse = tillNow.slice(0, tillNow.length - overFlow);
                tillNow = tillNow.slice(tillNow.length - overFlow);
                areThereMoreToCome = false;
                return iKnowHowToParse(whatToParse);
            }
        }

        return null;

    };

    var iKnowHowToParse = function(toParse) {
        var EndOfLine = /\r\n/;
        var firstLine = /(POST|GET|POST|PUT|DELETE|OPTIONS|TRACE) (.+) (HTTP\/1.1|HTTP\/1.0)/i;
        var Sperator = /\r\n\r\n/;
        var parts = toParse.split(Sperator);
        var lines = parts[0].split(EndOfLine);
        var req = new Req();

        if (!firstLine.test(lines[0])) {
            req.hasError = {statCode:500, message:"Wrong request format"};
            return req;
        }

        var theFirst = firstLine.exec(lines[0]);
        req.method = theFirst[1];
        req.protocol = "http";
        var pathParts = theFirst[2].split("?");
        req.path = pathParts[0];//TODO
        if (pathParts.length > 1){
            var queryParts = pathParts[1].replace("+"," ").split("&");
            for(var part in queryParts){
                var sliced = queryParts[part].split("=");
                req.query[sliced[0]] = sliced[1]
            }
        }
        for(var i = 1; i < lines.length; i++){
            var headerLine = lines[i].split(":");
            headerLine[1] = headerLine[1].trim();
            req.headerArry[headerLine[0]] = headerLine[1];
            if(headerLine[0] === "Cookie"){
                var cookieSplit = headerLine[1].split(";");
                for(var cookie in cookieSplit){
                    var cookieHeader = cookieSplit[cookie].split("=");
                    cookieHeader[0] = cookieHeader[0].trim();
                    req.cookies[cookieHeader[0]] = cookieHeader[1];
                }

            }
            else if(headerLine[0] === "Host"){
                req.host = headerLine[1];
                // if(headerLine[2]){
                //     req.host += ":" +headerLine[2];
                // }
            }
            else if(headerLine[0] === "Request URL"){
                req.path = headerLine[1];
            }
            else if(headerLine[0] === "Route path"){
                req.route = headerLine[1];
            }
        }

        if(parts.length > 1){
            if (req.headerArry["Content-Type"] === "application/json"){
                try{
                    req.body = JSON.parse(parts[1]);
                }catch (e){
                    req.body = parts[1];
                }
            }
            else if(req.headerArry["Content-Type"] === "application/x-www-form-urlencoded"){
                req.body = {};
                var bodyParts = parts[1].replace("+"," ").split("&");
                for(var part in bodyParts){
                var bSliced = bodyParts[part].split("=");
                req.body[bSliced[0]] = bSliced[1]
                }
            }
            else{
                req.body = parts[1];
            }
        }
        return req;
    }
};

