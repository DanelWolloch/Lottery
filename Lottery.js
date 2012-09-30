function GetNumberString(number) {
    if (!isNaN(number)) {
        if (number < 10 && number > 0) {
            return "0" + number;
        } else {
            return number;
        }
    } else {
        // TODO: Handle error not number was entered.
    }
}

function GetUrl(numberString, subGame) {
    // TODO: Add input checks
    var theUrl = "http://www.pais.co.il/Lotto/Pages/RequestsHandler.ashx?Command=Win_Clarification&Game=Lotto&SubGame=Lotto&SearchBy=Range&From=" + subGame + "&To=" + subGame + "&UserInput=" + numberString + "&FormType=&stmp=1337358182530";
    return theUrl;
}

function getTablesString() {
    // TODO: make an itaration for each input number and  not hardcoded the ids of each..
    var tablesNumber = GetNumberString($('#Number1').val()) + "%2C";
    tablesNumber += GetNumberString($('#Number2').val()) + "%2C";
    tablesNumber += GetNumberString($('#Number3').val()) + "%2C";
    tablesNumber += GetNumberString($('#Number4').val()) + "%2C";
    tablesNumber += GetNumberString($('#Number5').val()) + "%2C";
    tablesNumber += GetNumberString($('#Number6').val()) + "%2C";
    tablesNumber += GetNumberString($('#StrongNumber').val());
    return tablesNumber + "%7C";
}

function getSubGame() {
    // TODO: Handle invalid inputs...
    if (!isNaN($('#subGame').val())) {
        return $('#subGame').val();
    }
}

function Check() {
    var select = "select * from html where url="
    var theUrl = GetUrl(getTablesString(), 2388);

    var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(select + '"' + theUrl + '"') + "&callback=?";

    $.getJSON(yqlQuery, function (data) {
        var winnigPrice = data.results[0].split("<td class=\"PaisSeventh\">")[1].split('<p>')[1].split('</p>')[0];
        $('#winningPrice').text("זכית ב- " + winnigPrice + " שקלים!");
    });
}