
let currentclass = ''
var allcities = []

$(document).ready(function () {
    $("#wicon").hide()
    $("#uvindexlabel").hide()

    window.localStorage.setItem('allcities', JSON.stringify(allcities))

});

function getData(data) {
    $.ajax({
        type: "POST",

        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.lon + "&exclude=hourly,minutely,timezone,timezone_offset,lat,lon&units=imperial&appid=d74253fb28712ee382eea0a312fe5490",
        dataType: "json",

        success: function (result, status, xhr) {

            cityFetchedData(result, data.cityname)

        },
        error: function (xhr, status, error) {
            console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
} //end function

function getDataForSavedCity(cityname) {

    $('#cityname').val(cityname)
    getCityLongLat()
}

function cityFetchedData(data, cityname) {


    var allcities = JSON.parse(window.localStorage.getItem('allcities'))

    if (!allcities.includes(cityname)) {
        allcities.push(cityname)
        window.localStorage.setItem('allcities', JSON.stringify(allcities))
    }
    allcities = JSON.parse(window.localStorage.getItem('allcities'))

    $('#citynametbdy').empty()
    for (var i = 0; i < allcities.length; i++) {
        $('#citynames tbody').append(
            '<tr><td><button class="btn btncity buttonWidth" onclick="getDataForSavedCity(\'' + allcities[i] + '\')">' + allcities[i] + '</button></td></tr>'
        )
    }




    var currentDate = new Date() //current date
    var formatedDayMonth = moment(currentDate).format("L")    //formatting complete day name and date 
    $('#currentdate').text(formatedDayMonth)
    $('#currentcityname').text(cityname)

    let currenticon = data.current.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + currenticon + ".png"
    $('#wicon').attr('src', iconurl)

    let temp = data.current.temp
    let wind = data.current.wind_speed
    let humidity = data.current.humidity
    let uvindex = data.current.uvi

    $('#temp').text("Temp: " + temp + " F")
    $('#wind').text("Wind: " + wind + " MPH")
    $('#humidity').text("Humidity: " + humidity + " %")
    $('#uvindex').text(uvindex)
    $("#wicon").show()
    $("#uvindexlabel").show()
    if (uvindex >= 0 && uvindex <= 2) {
        $('#uvindex').removeClass(currentclass)
        $('#uvindex').addClass('unindex1')
        currentclass = 'unindex1'
    } else if (uvindex > 2 && uvindex <= 5) {
        $('#uvindex').removeClass(currentclass)
        $('#uvindex').addClass('unindex2')
        currentclass = 'unindex2'
    } else if (uvindex > 5 && uvindex <= 7) {
        $('#uvindex').removeClass(currentclass)
        $('#uvindex').addClass('unindex3')
        currentclass = 'unindex3'
    }
    else if (uvindex > 7 && uvindex <= 10) {
        $('#uvindex').removeClass(currentclass)
        $('#uvindex').addClass('unindex4')
        currentclass = 'unindex4'
    }
    else if (uvindex >= 11) {
        $('#uvindex').removeClass(currentclass)
        $('#uvindex').addClass('unindex5')
        currentclass = 'unindex5'
    }

    //5 day forecoast

    let fivedaysofcity = []

    for (var i = 1; i < 6; i++) {
        fivedaysofcity.push(data.daily[i])
    }

    var fivedays = []
    for (var i = 0; i < fivedaysofcity.length; i++) {

        let forcastedday = {
            dt: moment.unix(fivedaysofcity[i].dt).format("MM/DD/YYYY"),
            icon: fivedaysofcity[i].weather[0].icon,
            temp: fivedaysofcity[i].temp.max,
            wind: fivedaysofcity[i].wind_speed,
            humidity: fivedaysofcity[i].humidity
        }

        fivedays.push(forcastedday)
    }


    $('#fivedaysfrsttbdy').empty()
    $('#fivedaysfrsttbdy').append('<tr id="outer">' +
        '<td class="fivedaybg" id="day0"></td>' +
        '<td style="width: 30px;"></td>' +
        '<td class="fivedaybg" id="day1"></td>' +
        '<td style="width: 30px;"></td>' +
        '<td class="fivedaybg" id="day2"></td>' +
        '<td style="width: 30px;"></td>' +
        '<td class="fivedaybg" id="day3"></td>' +
        '<td style="width: 30px;"></td>' +
        '<td class="fivedaybg" id="day4"></td>' +
        '</tr>')
    for (var i = 0; i < fivedays.length; i++) {
        $('#day' + i + '').append(
            '<tr><td>' + fivedays[i].dt + '</td></tr>' +
            '<tr><td><img id="wicon" src="http://openweathermap.org/img/w/' + fivedays[i].icon + '.png" alt="Weather icon" class="currentCityWeather"></td></tr>' +
            '<tr><td>Temp: ' + fivedays[i].temp + ' F</td></tr>' +
            '<tr><td>Wind: ' + fivedays[i].wind + ' MPH</td></tr>' +
            '<tr><td>Humidiy: ' + fivedays[i].humidity + ' %</td></tr>'
        )
    }





} //end function



//getting city longitude and latitude and then passed to get data function
function getCityLongLat() {
    var cityname = $('#cityname').val()
    var citycoords = {
        lat: 0,
        lon: 0,
        cityname: ''
    }

    $.ajax({
        type: "GET",

        url: "http://api.openweathermap.org/geo/1.0/direct?q=" + cityname + "&limit=1&appid=d74253fb28712ee382eea0a312fe5490",

        success: function (result, status, xhr) {

            citycoords.lat = result[0].lat
            citycoords.lon = result[0].lon
            citycoords.cityname = cityname

            getData(citycoords)

        },
        error: function (xhr, status, error) {
            console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    })

}
