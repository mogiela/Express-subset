var loginDiv = $('<div/>').appendTo(document.body);
var loginForm = $('<form/>').submit(loginFunc).appendTo(loginDiv);
var username = $('<input/>').prop('required',true).attr("placeholder","username").text("username").appendTo(loginForm);
var password = $('<input/>').prop('required',true).prop('type',"password").attr("placeholder","password").text("password").appendTo(loginForm);
var loginbutton = $('<button/>').prop('type',"submit").attr("id","loginButton").text("login").appendTo(loginForm);


function loginFunc(event){
    event.preventDefault();
    if (username.val() != "admin" || password.val() != "admin"){
        alert("wrong username or password");
    }
    else{
        username.val("");
        password.val("");
        loginDiv.hide();
        profileDiv.show();
    }
    return false;
}

var profileDiv = $('<div/>').appendTo(document.body).hide();
var calcbutton = $('<button/>').text("calculator").click(calcFunc).appendTo(profileDiv);
var proftologbutton = $('<button/>').text("login").click(profileTologinFunc).appendTo(profileDiv);
var title = $('<h1/>').text("Almog Bar-Shalom").appendTo(profileDiv);
var myid = $('<h2/>').text("308174788").appendTo(profileDiv);
var pic = $('<img/>').attr("src","belle.jpeg").attr("width","400").attr("height","300")
    .attr("alt","me").appendTo(profileDiv);
var fave = $('<h3/>').text("My favorite page in the web:").appendTo(profileDiv);
var favelink = $('<a/>').attr("href","https://greatbritishpublictoiletmap.rca.ac.uk/")
    .text("The Great British Public Toilet Map").appendTo(profileDiv);
var about = $('<h3/>').text("Something about myself:").appendTo(profileDiv);
var det1 = $('<p/>').text("Little town").appendTo(profileDiv);
var det2 = $('<p/>').text("It's a quiet village").appendTo(profileDiv);
var det3 = $('<p/>').text("Every day").appendTo(profileDiv);
var det4 = $('<p/>').text("Like the one before").appendTo(profileDiv);
var det5 = $('<p/>').text("Little town").appendTo(profileDiv);
var det6 = $('<p/>').text("Full of little people").appendTo(profileDiv);
var det7 = $('<p/>').text("Waking up to say").appendTo(profileDiv);



function calcFunc(){
    profileDiv.hide();
    calcDiv.show();
}

function profileTologinFunc() {
    profileDiv.hide();
    loginDiv.show();
}

var calcDiv = $('<div/>').appendTo(document.body).hide();
var buttonAdd = $('<button/>').text("Add").appendTo(calcDiv).click(addFunc);
var calctologbutton = $('<button/>').text("login").click(calcTologinFunc).appendTo(calcDiv);
$('<br/>').appendTo(calcDiv);
new Calc();

function Calc(){
    var curCalcDiv = $('<section/>').addClass("border").appendTo(calcDiv)
    var arg1;
    var arg2;
    var oper;

    var screen = $('<input/>').attr("disabled","true").addClass("screen").appendTo(curCalcDiv);
    $('<br/>').appendTo(curCalcDiv);
    var buttonone = $('<button/>').text("1").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttontwo = $('<button/>').text("2").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonthree = $('<button/>').text("3").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonplus = $('<button/>').text("+").addClass("calculator").appendTo(curCalcDiv).click(operFunc);
    var buttonfour = $('<button/>').text("4").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonfive = $('<button/>').text("5").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonsix = $('<button/>').text("6").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonminus = $('<button/>').text("-").addClass("calculator").appendTo(curCalcDiv).click(operFunc);
    var buttonseven = $('<button/>').text("7").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttoneight = $('<button/>').text("8").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonnine = $('<button/>').text("9").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonmult = $('<button/>').text("*").addClass("calculator").appendTo(curCalcDiv).click(operFunc);
    var buttonzero = $('<button/>').text("0").addClass("calculator").appendTo(curCalcDiv).click(numFunc);
    var buttonc = $('<button/>').text("C").addClass("calculator").appendTo(curCalcDiv).click(operFunc);
    var buttondivide = $('<button/>').text("/").addClass("calculator").appendTo(curCalcDiv).click(operFunc);
    var buttoneq = $('<button/>').text("=").addClass("calculator").appendTo(curCalcDiv).click(eqFunc);


    function numFunc(event) {
        console.log(event.target.textContent);
        var elm = event.srcElement || event.target;
        if (oper){
            arg2 = elm.textContent;
            screen.val(screen.val()+arg2);
        }
        else{
            arg1 = elm.textContent;
            screen.val(arg1);
        }
    }

    function operFunc(event) {
        var elm = event.srcElement || event.target;
        var key = elm.textContent;
        if (key == "C"){
            arg1 = null;
            arg2 = null;
            oper = null;
            screen.val("0");
        }
        else if(arg1 && oper && arg2) {
            var eq = eval(arg1 + oper + arg2);
            screen.val(eq.toString());
            arg1 = eq.toString();
            oper = key;
            screen.val(screen.val()+oper);
        }
        else{
            oper = key;
            screen.val(screen.val()+oper);
        }
    }

    function eqFunc() {
        if (arg2){
            var eq = eval(arg1+oper+arg2);
            screen.val(eq.toString());
            arg1 = eq.toString();
            arg2 = null;
            oper = null;
        }
    }
}

function addFunc() {
    new Calc();
}

function calcTologinFunc() {
    calcDiv.hide();
    loginDiv.show();
}