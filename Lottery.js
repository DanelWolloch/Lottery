var lineCounter = 1;

function GetNumberString(number) {
    if (!number) {
        throw { message: "חובה למלא את כל השדות" };
    } else if (number < 1 || number > 37) {
        throw { message: "יש להכניס מספרים בין 1-37" };
    } else if (!isNaN(number)) {
        if (number < 10 && number > 0) {
            return "0" + number;
        } else {
            return number;
        }
    } else {
        throw { message: "יש להכניס מספרים בלבד" };
    }
}

function checkDuplicateNumber() {
    var unique_values = {};
    var list_of_values = [];
    $('#lines').children().each(function (index) {
        $(this).children().each(function (item) {
            if (item < 7) {
                if (!unique_values[$(this).val()]) {
                    unique_values[$(this).val()] = true;
                    list_of_values.push($(this).val());
                } else {
                    $(this).css('background-color', 'red');
                    throw { message: "אין להכניס אותו מספר פעמיים" };
                }
            }
        });
    });
}

function GetUrl(numberString, subGame) {
    var theUrl = "http://www.pais.co.il/Lotto/Pages/RequestsHandler.ashx?Command=Win_Clarification&Game=Lotto&SubGame=Lotto&SearchBy=Range&From=" + subGame + "&To=" + subGame + "&UserInput=" + numberString + "&FormType=&stmp=1337358182530";
    return theUrl;
}

function getTablesString() {

    var tablesNumber = "";

    for (var i = 1; i <= lineCounter; i++) {
        tablesNumber += getLineNumbers(i) + "%7C";
    }

    return tablesNumber;
}

function getLineNumbers(index) {
    var numOfBoxes = 6
    var first = $('#line' + index).children();
    var next = $(first).next();
    var lineNumbers = "";

    try {
        checkDuplicateNumber();
        lineNumbers = GetNumberString($(first).val()) + "%2C";
    } catch (e) {
        handleError(e, first);
    }
    for (var i = 0; i < numOfBoxes; i++) {
        try {
            lineNumbers += GetNumberString($(next).val()) + "%2C";
        } catch (e) {
            handleError(e, next);
        }
        next = $(next).next();
    }

    return lineNumbers;
}

function handleError(exception, element) {
    $('#errorMsg').text(exception.message);
    $('#errorMsg').fadeIn('slow');
    if (element.html()) {
        alert($(element).html());
        $(element).first().css('background-color', 'red');
    }
}

function getSubGame() {
    // TODO: Handle invalid inputs...
    if (!isNaN($('#txtSubGame').val())) {
        return $('#txtSubGame').val();
    }
}

function resetMessages() {
    if ($('#winningPrice').is(':visible')) {
        $('#winningPrice').fadeOut('slow');
    }
    if ($('#errorMsg').is(':visible')) {
        $('#errorMsg').fadeOut('slow');
    }

    $('#lines').children().each(function (index) {
        $(this).children().each(function (i) {
            if (i < 7) {
                $(this).css('background-color', 'white');
            }
        });
    });
}

function Check() {
    resetMessages();

    var select = "select * from html where url="
    var theUrl = GetUrl(getTablesString(), 2388);

    var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(select + '"' + theUrl + '"') + "&callback=?";

    $.getJSON(yqlQuery, function (data) {
        var winnigPrice = data.results[0].split("<td class=\"PaisSeventh\">")[1].split('<p>')[1].split('</p>')[0];
        
        var isChecked = $('#doubleLotoCheckbox:checked').val() ? true : false;
        if (isChecked)
        {
            winnigPrice *= 2;
        }

        $('#winningPrice').text("זכית ב- " + winnigPrice + " שקלים!");
        $('#winningPrice').fadeIn('slow');
    });
}

function addLine() {
    $('#btnAdd' + lineCounter).attr('disabled', 'true');
    $('#btnMinus' + lineCounter).attr('disabled', 'true');

    ++lineCounter;

    var line = "<div id='line" + lineCounter + "'>" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers' id='Number" + lineCounter + "' />" +
                    "<input type='tel' class='Numbers StrongNumber' id='StrongNumber" + lineCounter + "' />" +
                    "<button class='btn btn-primary addbtns' id='btnAdd" + lineCounter + "' onclick='addLine()'>+</button>" +
                    "<button class='btn btn-primary addbtns' id='btnMinus" + lineCounter + "' onclick='removeLine()'>-</button>" +
                "</div>";
    $('#lines').append(line).fadeIn('slow');
}

function removeLine() {
    $('#line' + lineCounter).remove().fadeOut('slow');
    --lineCounter;
    $('#btnAdd' + lineCounter).removeAttr('disabled');

    // No need to enable the first line '-'
    if (lineCounter > 1) {
        $('#btnMinus' + lineCounter).removeAttr('disabled');
    }
}