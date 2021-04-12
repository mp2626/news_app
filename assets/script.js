// Top Stories Vars
const newCard = $("#newCards");
const nextNews = $("#topNews");
const toDaysDate = $("#date");

// date 
toDaysDate.text(moment().format('ddd Do MMM, YYYY'));
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
            cardLocation = $('<h3>').text(capNewsLocalLocation);
            cardBody = $('<div>').addClass('card-body');
            cardAbstract = $('<p>').text(newsAbstract);
            cardAuthor = $('<h2>').text(author);
            cardsUrlButton = $('<a>').text('Article').attr('href', articleUrl).attr('target', '""').addClass('btn btn-light')
            // Build cards
            cardBody.append(cardBody, cardLocation, cardAbstract, cardAuthor, cardsUrlButton);
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
    window.scrollTo(0, 200);
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
var searchObj = {keyword:"aaa", sort:"aaa", type:"aaa", begin_date:"aaa", end_date:"aaa"};
var searchHistory = [];
var storedSearch = JSON.parse(localStorage.getItem("searchHistory"));
//---------------------------------------------------------------------------------------------------------------------
const newsDeskArray = ['Arts','Automobiles','Books','Business','Cars','Culture','Dining','Education','Environment','Fashion','Financial','Food','Foreign','Health','Movies','National','Politics','Science','Sports','SundayBusiness','Technology','Travel','U.S.','Vacation','Washington','Weather','World']
createNewsDeskTypes();
function createNewsDeskTypes(){
  for (var i=0; i<newsDeskArray.length; i++){
    var newsDeskType = $('<option>').text(newsDeskArray[i]);
    $('#newsDeskInput').append(newsDeskType);
  }
};

//script run from here
$('#modalBtn').on('click', modalUpdate);
//---------------------------------------------------------------------------------------------------------------------
//Functions section below
//---------------------------------------------------------------------------------------------------------------------
//Load previous search and create drop down buttons
function modalUpdate(){
  $('#dropdownBtn').children().remove(); //Needs to clean up buttons generated from previous event click.
  if (storedSearch) {historyBtns()} else {return};
}
//---------------------------------------------------------------------------------------------------------------------
function historyBtns(){
  for (var i=0; i<storedSearch.length; i++){
    var count = i + 1;
    var searchItem = $('<a>').addClass('dropdown-item').attr('data.docs-index', i).text("Search No: "+ count);
    $('#dropdownBtn').append(searchItem);
  } 
}
//---------------------------------------------------------------------------------------------------------------------
//Click on drop down buttons to auto complete previous inputs.
$('#dropdownBtn').on('click','.dropdown-item', autoComplete);
function autoComplete(event){
  var btnClicked = $(event.target);
  //get the index of the clicked button
  index = parseInt(btnClicked.attr("data.docs-index"));
  $('#art-key-input').val(storedSearch[index].keyword);
  $('#sortInput').val(storedSearch[index].sort);
  $('#newsDeskInput').val(storedSearch[index].type);
  $('#begin-date-input').val(storedSearch[index].begin_date);
  $('#end-date-input').val(storedSearch[index].end_date);
}
//---------------------------------------------------------------------------------------------------------------------
//Actions after click on search.
searchFormEl.on('submit', modalSubmit);
function modalSubmit(event) {
  event.preventDefault();
  artCardsEl.children().remove(); //remove previous searched article results
  artKey = $('#art-key-input').val().trim();
  artSort = $('#sortInput').val();
  newsDesk = $('#newsDeskInput').val();
  artBegin = $('#begin-date-input').val();
  artEnd = $('#end-date-input').val();
  saveSearch(artKey, artSort, newsDesk, artBegin, artEnd); //save inputs.
  displayArticles(artKey, artSort, newsDesk, artBegin, artEnd); //pass inputs to fetch data.docs from Article Search API.
  searchFormEl[0].reset();
  searchModalEl.modal('hide');
}
//---------------------------------------------------------------------------------------------------------------------
function saveSearch(artKey, artSort, newsDesk, artBegin, artEnd){
  if (storedSearch) {searchHistory = storedSearch};
  searchObj.keyword = artKey;
  searchObj.sort = artSort;
  searchObj.type = newsDesk;
  searchObj.begin_date = artBegin;
  searchObj.end_date = artEnd;
  //if this new search object doesn't equal any of the previous search, save it.
  if(JSON.stringify(searchHistory).indexOf(JSON.stringify(searchObj)) === -1){searchHistory.push(searchObj)}
  else {return}  
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
//---------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------
//EXAMPLE：https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=20210409&end_date=20210411&query=nets&fq=news_desk:(%22Sports%22)&sort=newest&api-key=gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6
function displayArticles(artKey, artSort, newsDesk, artBegin, artEnd) {
  //console.log(artKey); console.log(newsDesk);console.log(artSort);console.log(artBegin);console.log(artEnd);
  var targetUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=' + artBegin + '&end_date='
  + artEnd + '&query=' + artKey + '&fq=news_desk:(%22'+ newsDesk + '%22)&sort=' + artSort + '&api-key='+ zhouTianKey;
  fetch(targetUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.response.docs);
          if(!data.response.docs.length){alert("Result Not Found, please make new searches.");return}
          for(var i=0; i<data.response.docs.length; i++){
            var artEl = $('<div>').addClass('article');
            artCardsEl.append(artEl);
            var artTypeEl = $('<h4>').text(data.response.docs[i].news_desk);
            var pubDate = data.response.docs[i].pub_date.split("T");
            var dateEl = $('<h4>').text(pubDate[0]);
            var artTitleEl = $('<h2>').addClass('artTitle').text(data.response.docs[i].headline.main);
            var snippetEl = $('<h3>').text(data.response.docs[i].snippet);
            var authorEl = $('<h4>').text(data.response.docs[i].byline.original);
            var artLinkEl = $('<a>').addClass('artLink').attr("href", data.response.docs[i].web_url).text("Article");
            artLinkEl.attr("target", "_blank")
            artEl.append(artTypeEl,dateEl,artTitleEl,snippetEl,authorEl,artLinkEl);
          };
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
$( function() {
  var dateFormat = "yymmdd",
    from = $("#begin-date-input")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        maxDate: 0,
        dateFormat: "yymmdd"
      })
      .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
      }),
    to = $("#end-date-input").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      maxDate: 0,
      dateFormat: "yymmdd"
    })
    .on( "change", function() {
      from.datepicker( "option", "maxDate", getDate( this ) );
    });

  function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }
    return date;
  }
});
//Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget Widget 
function test(){
  console.log('yes')
}
//---------------------------------------------------------------------------------------------------------