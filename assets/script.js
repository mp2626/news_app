// Const Vars
const newCard = $("#newCards");
const nextNews = $("#topNews");
const toDaysDate = $("#date");
const mainWeatherEl = $("#currentWeatherlocation");
const currentDay = moment().format("DD/MM/YY");
const openWeather = "https://api.openweathermap.org/data/2.5/weather?q=sydney&units=metric&appid=e29cd95f952ebb202a3a51f08c0a0d46";
const topStoriesAPI = "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=Va9UoQ7BSpY4GzfHt7uLq6ZX16HCjwu2";

// Changing Vars
// let weatherData = "";
let topNewsMin = 0;
let topNewsMax = 4;

// date 
toDaysDate.text(moment().format('ddd Do MMM, YYYY'));

// Gets User location
function getLocation() {
  const successCallBack = (position) => {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    localWeather(lat, lon);
  }
  const errorCallBack = (error) => {
    console.error(error);
  }
  navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
}

getLocation();

// fetches weather data and call display function
function localWeather(lat, lon) {
  var openWeather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=e29cd95f952ebb202a3a51f08c0a0d46"

  fetch(openWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayLocalWeather(data)
      $("#currentWeatherlocation").text()
    });
}

// displays weather forecast
function displayLocalWeather(weatherData) {

  let icon = weatherData.weather[0].icon

  var skyWeather = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

  let weatherDataTemp = weatherData.main.temp;
  let weatherDataWind = weatherData.wind.speed;
  var weatherTempEl = $("<h5>").text("T: " + weatherDataTemp + " ℃").addClass("");
  var weatherWindEl = $("<h5>").text("W: " + weatherDataWind + " Km/h").addClass("")
  var weatherImgEl = $("<img>").attr("src", skyWeather).addClass("");
  mainWeatherEl.append(weatherImgEl, weatherTempEl, weatherWindEl);
}

// Top Stories Fetch API Function
function getTopStories() {
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
  //remove previous searched article results
  $('#artResults').text('');
  artCardsEl.children().remove();
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

  // keeps count of news arrays and lets the user know when they are up to date
  if (topNewsMin < news.length) {
    topNewsMin += 4;
    topNewsMax += 4;
  } else {
    $('#tS').text("You're up to date with today's top stories. Why not search for an article?");
  }
}

// moved user to top of page when they load new stories
function scroll() {
  window.scrollTo(0, 160);
}

// stops page reload
nextNews.on("click", (event) => {
  event.preventDefault();
  renderTopStories(topNews);
  scroll();
});

const zhouTianKey = "gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6";
//DOM elements
var searchModalEl = $('#searchModal');
var searchFormEl = $('#project-form');
var artCardsEl = $('#articleCards');
var flashClass = $('.flash');
var modalAlert = $('#modalAlert');
var searchAlert = $('#searchAlert');
var callTotal;
var articlesPerPage = 4; //This number be change anytime if we want later.
var lastPage;
var pageIndex;
var fetchedData; //Importain, this variable saves each search temporary.

//Search inputs
var artKey, artSort, newsDesk, artBegin, artEnd;

//LocalStorage variables
var index;
var searchObj;
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
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
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
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
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
  $('#artResults').text('');
  $('#pages').children().remove(); //To clear previous page btns.
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
    fetchedData = [];
    getArticles(artKey, artSort, newsDesk, artBegin, artEnd); //This fetching will neet a while to process.
    
    //displaySearch();
    searchFormEl[0].reset();
    searchModalEl.modal('hide');
  } else { modalAlert.text('(Please specify Begin and End Date!)'); flashing() }
}
//---------------------------------------------------------------------------------------------------------------------
function saveSearch(artKey, artSort, newsDesk, artBegin, artEnd) {
  searchObj = { keyword: artKey, sort: artSort, type: newsDesk, begin_date: artBegin, end_date: artEnd }
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
function getArticles(artKey, artSort, newsDesk, artBegin, artEnd) {
  //First call need to check how many article results return.
  var targetUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=' + artBegin + '&end_date='
    + artEnd + '&query=' + artKey + '&fq=news_desk:(%22' + newsDesk + '%22)&sort=' + artSort + '&api-key=' + zhouTianKey;
  fetch(targetUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var artTotal = data.response.meta.hits;
          //if artTotal is a large number, say 666, then we need 67 calls to get all results. (limit: 10 article per call for this Article Search API)
          callTotal = Math.ceil(artTotal/10);

          if (!artTotal) { searchAlert.text("Result Not Found! Please make New Search."); flashing() }
          //This is a mobile first app, remind user to double check their searching range.
          else if (artTotal > 50) { searchAlert.text("More than 50 Articles Found! Please Cut Down Date Range or Specify keywords."); flashing() }
          //Note: In this else branch, artTotal range from 1 to 50 
          else {
            saveSearch(artKey, artSort, newsDesk, artBegin, artEnd); //Search inputs only get saved if it is a meaningful search.
            if (artTotal < 2){ $('#artResults').text(artTotal + ' article found to match your search.') }
            else { $('#artResults').text(artTotal + ' articles found to match your search.') }
            //************************** 
            allCalls();
            //************************** 
          }
        });
      } else {
        searchAlert.text('Error: ' + response.statusText); flashing()
      }
    })
    .catch(function (error) {
      searchAlert.text('Unable to connect to NY Times Article Search API'); flashing()
    });
};
//**********************************************************************************************************************************
//Function to make each api call.
async function eachCall(i){
  try {
      var eachUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=' + artBegin + '&end_date=' + artEnd + '&query=' + artKey + '&fq=news_desk:(%22' + newsDesk + '%22)&sort=' + artSort + '&page=' + i + '&api-key=' + zhouTianKey;
      let eachfetch = await fetch(eachUrl);
      eachfetch = await eachfetch.json();
      for (var i = 0; i < eachfetch.response.docs.length; i++) { fetchedData.push(eachfetch.response.docs[i]) } 
  } catch(message){console.log("fetch fail.")};
}
//**********************************************************************************************************************************
//Function to construct the fetchedData array.
async function allCalls(){
  for (var i = 0; i < callTotal; i++) {
    await eachCall(i);
  };
  displaySearch();
}
//**********************************************************************************************************************************
function displaySearch(){
  //To create page btns for search results.
  var pageNum = 0;
  for (var i = 0; i < fetchedData.length; i=i+articlesPerPage) {
    pageNum = pageNum + 1;
    $('#pages').append($('<button>').addClass('pageBtn btn btn-light').attr('data-index', pageNum).text(pageNum));
    lastPage = pageNum;
  };
  //Note: need to check if return search results less than articlesPerPage
  var loops;
  if (fetchedData.length < articlesPerPage){ loops = fetchedData.length }
  else{ loops = articlesPerPage }
  for (var i = 0; i < loops; i++) {
    var artEl = $('<div>').addClass('card col-11 col-md-11 col-lg-4');
    var artTypeEl = $('<h5>').text(fetchedData[i].news_desk);
    var pubDate = fetchedData[i].pub_date.split("T");
    var dateEl = $('<h5>').text(pubDate[0]);
    var artTitleEl = $('<h1>').addClass('card-header').text(fetchedData[i].headline.main);
    var abstractEl = $('<p>').text(fetchedData[i].abstract);
    var authorEl = $('<h3>').text(fetchedData[i].byline.original);
    var artLinkEl = $('<a>').addClass('btn btn-light').attr("href", fetchedData[i].web_url).attr("target", "_blank").text("Article");
    artEl.append(artTypeEl, dateEl, artTitleEl, abstractEl, authorEl, artLinkEl);
    artCardsEl.append(artEl);
  };
}
//---------------------------------------------------------------------------------------------------------------------
//Click on page btns to show results in different pages.
//Need an if condition for last page display! 
//For example, if we have 10 results, 4 results per page, page 3 will only have 2 results.
$('#pages').on('click', '.pageBtn', displayPage);
function displayPage(event) {
  $('#articleCards').children().remove();
  var pageClicked = $(event.target);
  pageIndex = parseInt(pageClicked.attr("data-index"))-1;
  var targetPage = pageIndex*articlesPerPage;
  var remainder = fetchedData.length % articlesPerPage;
  var loopNumber;
  //If click on last page.
  if ( parseInt(pageClicked.attr("data-index")) == lastPage && remainder !== 0 ){ loopNumber = remainder }
  else{ loopNumber = articlesPerPage }
  for (var i = 0; i < loopNumber; i++) {
    var artEl = $('<div>').addClass('card col-11 col-md-11 col-lg-4');
    var artTypeEl = $('<h5>').text(fetchedData[targetPage+i].news_desk);
    var pubDate = fetchedData[targetPage+i].pub_date.split("T");
    var dateEl = $('<h5>').text(pubDate[0]);
    var artTitleEl = $('<h1>').addClass('card-header').text(fetchedData[targetPage+i].headline.main);
    var abstractEl = $('<p>').text(fetchedData[targetPage+i].abstract);
    var authorEl = $('<h3>').text(fetchedData[targetPage+i].byline.original);
    var artLinkEl = $('<a>').addClass('btn btn-light').attr("href", fetchedData[targetPage+i].web_url).attr("target", "_blank").text("Article");
    artEl.append(artTypeEl, dateEl, artTitleEl, abstractEl, authorEl, artLinkEl);
    artCardsEl.append(artEl);
  }
}
//---------------------------------------------------------------------------------------------------------------------
//Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget 
//JQuery Datepicker, select date range function.
$(function () {
  var dateFormat = "d M, y",
    from = $("#begin-date-input")
      .datepicker({ defaultDate: "+1w", changeMonth: true, changeYear: true, numberOfMonths: 1, maxDate: 0, dateFormat: "d M, y"})
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));}),
    to = $("#end-date-input").datepicker({ defaultDate: "+1w", changeMonth: true, changeYear: true, numberOfMonths: 1, maxDate: 0, dateFormat: "d M, y"})
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

//Set timer to flash message
function flashing() {
  flashClass.css('opacity', '1');
  setTimeout(function () {
    flashClass.css('opacity', '0');
  }, 5000)
};

getTopStories();