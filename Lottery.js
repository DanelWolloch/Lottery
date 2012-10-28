var lineCounter = 1;
var cachedLastDrawNumber = -1; // Cache to the draw number - we dont want to check any way..

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
    var numOfBoxesWithoutStrongNumber = 6
    $('#lines').children().each(function (index) {
        var unique_values = {};
        var list_of_values = [];
        $(this).children().each(function (item) {
            if (item < numOfBoxesWithoutStrongNumber) {
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
        $(element).first().css('background-color', 'red');
    }
}

function getSubGame() {
    var subGame = $('#txtSubGame').val();

    if (subGame && !isNaN(subGame) && subGame > 1) {
        return $('#txtSubGame').val();
    } else {
        var ex = { message: "מספר ההגרלה אינו תקין" };
        handleError(ex, $('#txtSubGame'));
    }
}

function resetMessages() {
    if ($('#winningPrice').is(':visible')) {
        $('#winningPrice').text('');
        $('#winningPrice').fadeOut('slow');
    }
    if ($('#errorMsg').is(':visible')) {
        $('#errorMsg').text('');
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

function showProgressBar() {
    var progress = '<div id="progressBar"><img src="ajax-loader.gif" />' +
                   '<br />' +
                   '<span>בודק סכום זכייה...</span></div>';
    $('#Waiting').append(progress);

}

function hideProgressBar() {
    if ($('#progressBar')) {
        $('#progressBar').remove();
    }
}

function Check() {
    var drawNumber = getSubGame();
    if (drawNumber != cachedLastDrawNumber) {
        cachedCheck();
    }
}

function cachedCheck() {

    showProgressBar()

    // Clear the messages in the GUI
    resetMessages();

    // Get the URL query to the pais site using yql
    var select = "select * from html where url=";
    var drawNumber = getSubGame();
    var theUrl = GetUrl(getTablesString(), drawNumber);
    var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(select + '"' + theUrl + '"') + "&callback=?";

    // Set new draw results
    GetDrawResults(drawNumber);

    // Check if there was an error with the inputs
    if (!$('#errorMsg').text()) {

        // Get the HTML page with the response for the loto results
        // Url: The url to request
        // DataType: Jason request type.
        // Success: The function that parsing the html response and show the winning price
        // Error: Error handling when the website is unreachable
        // Timeout: The timeout to get the response
        $.ajax(
        {
            url: yqlQuery,
            dataType: 'json',
            success: function (data) {
                try {
                   // Parse the winning price
                    var winnigPrice = data.results[0].split("<td class=\"PaisSeventh\">")[1].split('<p>')[1].split('</p>')[0];
                }
                catch (ex) {
                    // If no winning set to 0
                    winnigPrice = 0;
                }

                // Check if double loto checked
                var isChecked = $('#doubleLotoCheckbox:checked').val() ? true : false;
                if (isChecked) {
                    winnigPrice *= 2;
                }

                hideProgressBar();

                // Show the winning price
                $('#winningPrice').text("זכית ב- " + winnigPrice + " שקלים!");
                $('#winningPrice').fadeIn('slow');
                cachedLastDrawNumber = drawNumber;
            },
            error: function (data) {
                try {
                    hideProgressBar();
                    throw ({ message: "אירעה שגיאה בזמן הפנייה לשרת. אנא בדוק חיבור אינטרנט." });
                }
                catch (ex) {
                    handleError(ex);
                }
            },
            timeout: 7000
        });
    } else {
        hideProgressBar();
    }
}

function addLine() {
    $('#btnAdd' + lineCounter).attr('disabled', 'true');
    $('#btnMinus' + lineCounter).attr('disabled', 'true');

    ++lineCounter;

    // Most ugly thing ever! 
    var line = "<div id='line" + lineCounter + "'>" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "1' />" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "2' />" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "3' />" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "4' />" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "5' />" +
                    "<input type='tel' class='Numbers added' id='Number" + lineCounter + "6' />" +
                    "<input type='tel' class='Numbers StrongNumber added' id='StrongNumber" + lineCounter + "' style='background-color:cyan' />" +
                    "<button class='btn btn-primary addbtns added' id='btnAdd" + lineCounter + "' onclick='addLine()'>+</button>" +
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

function load() {
    var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'www.pais.co.il'&diagnostics=true&callback=?";
    document.getElementById('BodyContainer').style.visibility = 'hidden';
    $.ajax({
        type: "POST",
        url: yqlQuery,
        dataType: 'json',
        async: false,
        success: function (message) {
            try {
                // date of the next draw (also print it into screen)
                getNextDrawTime(message);
                // last draw's number - both print into screen and return the draw number
                var lastDrawNumber = getLastDrawNumber(message);
                // set the draw's winning numbers - print it into screen (sets the last draw at loading)
                GetDrawResults(lastDrawNumber);
            } catch (e) {
                // try again
                getNextDrawTime(message);
                var lastDrawNumber = getLastDrawNumber(message);
                GetDrawResults(lastDrawNumber);
            } finally {
                document.getElementById('BodyContainer').style.visibility = 'visible';
                $('#ProgressBar').remove();
            }
        },
        error: function (data) {
            try {
                hideProgressBar();
                document.getElementById('BodyContainer').style.visibility = 'visible';
                $('#ProgressBar').remove();
                throw ({ message: "אירעה שגיאה בזמן הפנייה לשרת. אנא בדוק חיבור אינטרנט." });
            }
            catch (ex) {
                handleError(ex);
            }
        },
        timeout: 7000
    });
}

function getLastDrawNumber(data) {
    var lastDraw = data.results[0].split("תוצאות הגרלה מס' ")[1].split('</h4>')[0];
    $('#txtSubGame').val(lastDraw);
    return lastDraw;
}

function getNextDrawTime(data) {
    var lastDraw = data.results[0].split('<p class="PaisNext">')[1].split('</p>')[0];
    $('#nextDraw').text(lastDraw);
}

function GetDrawResults(drawNumber) {
    if (drawNumber != cachedLastDrawNumber)
    {
        document.getElementById('navi').style.visibility = 'hidden';
        document.getElementById('errori').style.visibility = 'hidden';
        document.getElementById('infoi').style.visibility = 'visible';
        var yqlQuery = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.pais.co.il%2FLotto%2FPages%2FResultsArchive.aspx'&diagnostics=true&callback=?";
        $.ajax({
            type: "POST",
            url: yqlQuery,
            data: { PaisFromRange: drawNumber, PaisToRange: drawNumber, PaisRangeSearchType: "Range" },
            dataType: 'json',
            async: false,
            success: function (message) {
                try {
                    var drawResults = message.results[0].split(drawNumber)[1].split("PaisList")[1].split('<ul>')[1].split('</ul>')[0].split('<li>');
                    for (i = 1; i < 7; i++) {
                        var currNumber = drawResults[i].split('<p>')[1].split('</p>')[0];
                        $('#winning' + i).text(currNumber);
                    }

                    var danielIsStronger = message.results[0].split(drawNumber)[1].split("PaisStrong")[1].split("<p>")[1].split("</p>")[0];
                    $('#winningStrong').text("המספר החזק: " + danielIsStronger);
                    document.getElementById('navi').style.visibility = 'visible';
                    document.getElementById('infoi').style.visibility = 'hidden';
                    cachedLastDrawNumber = drawNumber;
                }
                catch (e) {
                    document.getElementById('navi').style.visibility = 'hidden';
                    document.getElementById('infoi').style.visibility = 'hidden';
                    document.getElementById('errori').style.visibility = 'visible';
                }
            }
        });
    }
}