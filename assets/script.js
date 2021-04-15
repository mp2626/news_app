// Top Stories Vars
const newCard = $("#newCards");
const nextNews = $("#topNews");
const toDaysDate = $("#date");
const mainWeatherEl = $("#currentWeatherlocation");
// let weatherData = ""
// date 
toDaysDate.text(moment().format('ddd Do MMM, YYYY'));


//current weather at current location - When I land on the web page I am greeted with the current weather in my current location -JB
// Gets User location
function getLocation() {
  const successCallBack = (position) => {
    console.log(position);
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(lat, lon);
    localWeather(lat, lon);
  }
  const errorCallBack = (error) => {
    console.error(error)
  }
  navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
}
getLocation();

// Display's local weather
function localWeather(lat, lon) {
  var openWeather = "https:/api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=e29cd95f952ebb202a3a51f08c0a0d46"
  console.log(openWeather)
  fetch(openWeather)
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      weatherData = data;
      displayLocalWeather(weatherData);
      // console.log(weatherData);
      $("#currentWeatherlocation").text()
    });
};

function displayLocalWeather(weatherData) {
  console.log(weatherData.main.temp_max);
  let weatherDataTemp = weatherData.main.temp;
  let weatherDataWind = weatherData.wind.speed;
  var weatherTempEl = $("<h5>").text("T: " + weatherDataTemp + " ℃").addClass("");
  var weatherWindEl = $("<h5>").text("W: " + weatherDataWind + " Km/h").addClass("")
  // var weatherImgEl = $("<img>")
  mainWeatherEl.append(weatherTempEl, weatherWindEl);
  console.log(weatherDataTemp);
}
// displayLocalWeather()

// bootstrap

let topNewsMin = 0;
let topNewsMax = 5;

// Top Stories API Var
const topStoriesAPI = "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=Va9UoQ7BSpY4GzfHt7uLq6ZX16HCjwu2";

// Top Stories Fetch API Function
function getTopStories(search) {
  fetch(topStoriesAPI)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        alert("No result found")
      };
    })
    .then(data => {
      topNews = data;
      renderTopStories(topNews);
    });
}
// Top Stories Card Render Function

function renderTopStories(topNews) {
  // clear section
  $('#tS').text('Top Stories');
  artCardsEl.children().remove(); //remove previous searched article results
  newCard.children().remove('div');
  // vars
  news = topNews.results;

  // loop to gather data and create feed
  for (i = 0; i < news.length; i++) {

    if (i >= topNewsMin && i < topNewsMax) {

      tile = news[i].title;
      newsAbstract = news[i].abstract;
      author = news[i].byline;
      articleUrl = news[i].url;
      newsLocalLocation = news[i].subsection;
      if (newsLocalLocation != "") {
        capNewsLocalLocation = newsLocalLocation[0].toUpperCase() + newsLocalLocation.slice(1);
      }
      articleUrl = news[i].url;

      // create elements
      newCardDiv = $('<div>').addClass('card col-11 col-md-11 col-lg-4');
      cardTile = $('<h1>').addClass('card-header').text(tile);
      cardLocation = $('<h2>').text(capNewsLocalLocation);
      cardBody = $('<div>').addClass('card-body');
      cardAbstract = $('<p>').text(newsAbstract);
      cardAuthor = $('<h3>').text(author);
      cardsUrlButton = $('<a>').text('Article').attr('href', articleUrl).attr('target', '""').addClass('btn btn-light')
      // Build cards
      cardBody.append(cardLocation, cardAbstract, cardAuthor, cardsUrlButton);
      newCardDiv.append(cardTile, cardBody);
      newCard.append(newCardDiv);
    }
  }

  if (topNewsMin < news.length) {
    topNewsMin += 5;
    topNewsMax += 5;
  }
}

function scroll() {
  window.scrollTo(0, 160);
}

nextNews.on("click", (event) => {
  event.preventDefault();
  renderTopStories(topNews);
  scroll();
});

getTopStories();

//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT
//Article Search API Script below
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT

const zhouTianKey = "gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6";
//DOM elements
var searchModalEl = $('#searchModal');
var searchFormEl = $('#project-form');
var artCardsEl = $('#articleCards');

//Search inputs
var artKey, artSort, newsDesk, artBegin, artEnd;

//LocalStorage variables
var index;
var searchObj;
var searchHistory = [];
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
//---------------------------------------------------------------------------------------------------------------------
const newsDeskArray = ['Arts', 'Automobiles', 'Business', 'Culture', 'Education', 'Environment', 'Fashion', 'Food', 'Foreign', 'Health', 'Movies', 'Politics', 'Science', 'Sports', 'SundayBusiness', 'Technology', 'Travel', 'U.S.', 'Weather', 'World']
createNewsDeskTypes();
function createNewsDeskTypes() {
  for (var i = 0; i < newsDeskArray.length; i++) {
    var newsDeskType = $('<option>').text(newsDeskArray[i]);
    $('#newsDeskInput').append(newsDeskType);
  }
};

//Article Searching starts from here.
$('#modalBtn').on('click', modalUpdate);
//Load previous search and create drop down buttons
function modalUpdate() {
  $('#dropdownBtn').children().remove(); //Needs to clean up buttons generated from previous event clicks.
  if (searchHistory) { historyBtns() } else { return };
}
//---------------------------------------------------------------------------------------------------------------------
function historyBtns() {
  for (var i = 0; i < searchHistory.length; i++) {
    var count = i + 1;
    var searchItem = $('<a>').addClass('dropdown-item').attr('data-index', i).text("Search No: " + count);
    $('#dropdownBtn').append(searchItem);
  }
}
//---------------------------------------------------------------------------------------------------------------------
$('#clearBtn').on('click', clearHistory);
function clearHistory(event) {
  event.preventDefault();
  searchHistory = [];
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  $('#dropdownBtn').children().remove();
}
//---------------------------------------------------------------------------------------------------------------------
//Click on drop down buttons to auto complete previous inputs.
$('#dropdownBtn').on('click', '.dropdown-item', autoComplete);
function autoComplete(event) {
  event.preventDefault();
  var btnClicked = $(event.target);
  if (searchHistory) {
    //get the index of the clicked button
    index = parseInt(btnClicked.attr("data-index"));
    $('#art-key-input').val(searchHistory[index].keyword);
    $('#sortInput').val(searchHistory[index].sort);
    $('#newsDeskInput').val(searchHistory[index].type);
    var reformatBegin = searchHistory[index].begin_date;
    var reformatEnd = searchHistory[index].end_date;
    $('#begin-date-input').val(moment(reformatBegin, "YYYYMMDD").format("D MMM, YY"));
    $('#end-date-input').val(moment(reformatEnd, "YYYYMMDD").format("D MMM, YY"));
  }
}
//---------------------------------------------------------------------------------------------------------------------
//Actions after click on search.
searchFormEl.on('click', '#searchBtn', modalSubmit);
function modalSubmit(event) {
  event.preventDefault();
  newCard.children().remove('div'); // clear top story cards.
  $('#tS').text('Article Search Results');
  if ($('#begin-date-input').val() && $('#end-date-input').val()) {
    artCardsEl.children().remove(); //remove previous searched article results
    artKey = $('#art-key-input').val().trim();
    artSort = $('#sortInput').val();
    newsDesk = $('#newsDeskInput').val();
    var formatedBegin = $('#begin-date-input').val();
    var formatedEnd = $('#end-date-input').val();
    artBegin = moment(formatedBegin, "D MMM, YY").format("YYYYMMDD");
    artEnd = moment(formatedEnd, "D MMM, YY").format("YYYYMMDD");
    displayArticles(artKey, artSort, newsDesk, artBegin, artEnd); //pass inputs to fetch data.docs from Article Search API.
    searchFormEl[0].reset();
    searchModalEl.modal('hide');
  } else { alert('Please specify Begin and End Date!') }
}
//---------------------------------------------------------------------------------------------------------------------
function saveSearch(artKey, artSort, newsDesk, artBegin, artEnd) {
  searchObj = { keyword: artKey, sort: artSort, type: newsDesk, begin_date: artBegin, end_date: artEnd };
  if (searchHistory) {
    for (var i = 0; i < searchHistory.length; i++) {
      //if this searchObj found in searchHistory, jump out.
      if (JSON.stringify(searchHistory[i]) == JSON.stringify(searchObj)) { return }
    }
    searchHistory.push(searchObj);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
  else {
    searchHistory = [];
    searchHistory.push(searchObj);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}
//---------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------
//EXAMPLE：https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=20210409&end_date=20210411&query=nets&fq=news_desk:(%22Sports%22)&sort=newest&api-key=gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6
function displayArticles(artKey, artSort, newsDesk, artBegin, artEnd) {
  //console.log(artKey); console.log(newsDesk);console.log(artSort);console.log(artBegin);console.log(artEnd);
  var targetUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=' + artBegin + '&end_date='
    + artEnd + '&query=' + artKey + '&fq=news_desk:(%22' + newsDesk + '%22)&sort=' + artSort + '&api-key=' + zhouTianKey;
  fetch(targetUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data.response.docs);
          if (!data.response.docs.length) { alert("Result Not Found, please make new searches.") }
          else {
            saveSearch(artKey, artSort, newsDesk, artBegin, artEnd); //Search inputs only save if result found.
            for (var i = 0; i < data.response.docs.length; i++) {
              var artEl = $('<div>').addClass('card col-11 col-md-11 col-lg-4');
              var artTypeEl = $('<h5>').text(data.response.docs[i].news_desk);
              var pubDate = data.response.docs[i].pub_date.split("T");
              var dateEl = $('<h5>').text(pubDate[0]);
              var artTitleEl = $('<h1>').addClass('card-header').text(data.response.docs[i].headline.main);
              var cardBody = $('<div>').addClass('card-body');
              var snippetEl = $('<p>').text(data.response.docs[i].snippet);
              var authorEl = $('<h3>').text(data.response.docs[i].byline.original);
              var artLinkEl = $('<a>').addClass('btn btn-light').attr("href", data.response.docs[i].web_url).text("Article");
              artLinkEl.attr("target", "_blank");
              cardBody.append(snippetEl, authorEl, artLinkEl);
              artEl.append(artTypeEl, dateEl, artTitleEl, cardBody);
              artCardsEl.append(artEl);
            };
          }
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to NY Times Article Search API');
    });
};
//---------------------------------------------------------------------------------------------------------------------

//Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget 
//JQuery Datepicker, select date range function.
$(function () {
  var dateFormat = "d M, y",
    from = $("#begin-date-input")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        maxDate: 0,
        dateFormat: "d M, y"
      })
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));
      }),
    to = $("#end-date-input").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      maxDate: 0,
      dateFormat: "d M, y"
    })
      .on("change", function () {
        from.datepicker("option", "maxDate", getDate(this));
      });

  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }
});
