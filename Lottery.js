var lineCounter = 1;

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

    var tablesNumber = "";

    for (var i = 1; i <= lineCounter; i++) {
        tablesNumber += getLineNumbers(i) + "%7C";
    }

    //var tablesNumber = GetNumberString($('#Number1').val()) + "%2C";
    //tablesNumber += GetNumberString($('#Number2').val()) + "%2C";
    //tablesNumber += GetNumberString($('#Number3').val()) + "%2C";
    //tablesNumber += GetNumberString($('#Number4').val()) + "%2C";
    //tablesNumber += GetNumberString($('#Number5').val()) + "%2C";
    //tablesNumber += GetNumberString($('#Number6').val()) + "%2C";
    //tablesNumber += GetNumberString($('#StrongNumber').val());
    return tablesNumber;
}

function getLineNumbers(index) {
    var numOfBoxes = 6
    var first = $('#line' + index).children();
    var lineNumbers = GetNumberString($(first).val()) + "%2C";
    var next = $(first).next();
    for (var i = 0; i < numOfBoxes; i++) {
        lineNumbers += GetNumberString($(next).val()) + "%2C";
        next = $(next).next();
    }

    return lineNumbers;
}

function getSubGame() {
    // TODO: Handle invalid inputs...
    if (!isNaN($('#txtSubGame').val())) {
        return $('#txtSubGame').val();
    }
}

function Check() {
    var select = "select * from html where url="
    var theUrl = GetUrl(getTablesString(), 2388);

    var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(select + '"' + theUrl + '"') + "&callback=?";

    $.getJSON(yqlQuery, function (data) {
        var winnigPrice = data.results[0].split("<td class=\"PaisSeventh\">")[1].split('<p>')[1].split('</p>')[0];
        $('#winningPrice').text("זכית ב- " + winnigPrice + " שקלים!");
        $('#winningPrice').show();
    });
}

function addLine() {
    $('#btnAdd' + lineCounter).attr('disabled', 'true');
    $('#btnMinus' + lineCounter).attr('disabled', 'true');

    ++lineCounter;

    var line = "<div id='line" + lineCounter + "'><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='Number" + lineCounter + "' /><input type='tel' class='Numbers' id='StrongNumber" + lineCounter + "' /><button class='btn btn-primary addbtns' id='btnAdd" + lineCounter + "' onclick='addLine()'>+</button><button class='btn btn-primary addbtns' id='btnMinus" + lineCounter + "' onclick='removeLine()'>-</button></div>";
    $('#lines').append(line);
}

function removeLine() {
    $('#line' + lineCounter).remove();
    --lineCounter;
    $('#btnAdd' + lineCounter).removeAttr('disabled');

    // No need to enable the first line '-'
    if (lineCounter > 1) {
        $('#btnMinus' + lineCounter).removeAttr('disabled');
    }
}