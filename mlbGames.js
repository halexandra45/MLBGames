var date = "2019-06-24";
var requestURL = `http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap)))%2Cdecisions&date=${date}&sportId=1&fbclid=IwAR13zWLt0ZZxrQXy-6oQMnY847KQUyonpOtoJlxOx1MCMbYKVclqArawLi0`;
var request = new XMLHttpRequest();
var array, index = 0;

request.open("GET", requestURL);
request.responseType = "text";
request.send();
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        array = _("squares").children;
        var baseballText = request.response;
        var majorBaseball = JSON.parse(baseballText);
        populateContent(majorBaseball);
        showPictures(majorBaseball);
        array[0].style.border = "5px solid white";
    }
    else {
        alert("Wrong status request.Check back later!");
    }
}

// This simple function returns object reference for elements by ID
function _(x) {
    return document.getElementById(x);
}

//display pictures depending on JSON array lenght 
function showPictures(jsonObj) {
    for (i = 0; i < jsonObj.dates[0].games.length; i++) {
        var el = _("squares"),
            elChild = document.createElement("div");
        elChild.setAttribute("onclick", "squares(" + i + ")");
        elChild.innerHTML = "<img src='" + jsonObj.dates[0].games[i].content.editorial.recap.mlb.image.cuts[17].src + "'/>";
        el.appendChild(elChild);
        _("squares").innerHTML.background = "url(" + jsonObj.dates[0].games[i].content.editorial.recap.mlb.image.cuts[17].src + ")";

    }
}

//show header and return array lenght 
function populateContent(jsonObj) {
    _("textHeader").innerHTML = jsonObj.dates[0].games[0].venue.name;
    _("textContext").innerHTML = jsonObj.dates[0].games[0].content.editorial.recap.mlb.headline;
    mlbContent = [];
    for (i = 0; i < jsonObj.dates[0].games.length; i++) {
        mlbContent.push("<h4>" + jsonObj.dates[0].games[i].venue.name + "</h4><p>" +
            jsonObj.dates[0].games[i].content.editorial.recap.mlb.headline + "</p>");
    }
    return mlbContent;
}

// This function is triggered when the keyboard is changed to keep track of what content up with the index
function squares(index) {
    _("squarecontent").style.opacity = 0;
    for (var i = 0; i < mlbContent.length; i++) {
        array[i].style.border = "0";
    }
    array[index].style.border = "5px solid white";

    // Smooth Transition Effect + change content text
    setTimeout(function () {
        _("squarecontent").innerHTML = mlbContent[index];
        _("squarecontent").style.opacity = 1;
    }, 200);
}

// Control with left and right keyboard clicks
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            //left
            e.preventDefault();
            if (index == 0) {
                index = mlbContent.length - 1;
            }
            else
                index--;
            squares(index);
            break;
        case 39:
            //right
            e.preventDefault();
            if (index == mlbContent.length - 1) {
                index = 0;
            }
            else
                index++;
            squares(index);
            break;
    }
}
