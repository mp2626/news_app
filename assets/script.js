// Search Article Vars
var articleCards = $(".articleCards");
const zhouTianKey = "gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6";
var searchArticleAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key="+zhouTianKey;

var searchModalEl = $('#searchModal');
var searchFormEl = $('#project-form');

var artKey;
var artType;
var artLimit;
var artBegin;
var artEnd;

var artCardsEl = $('#articleCards');
//LocalStorage variables
var searchItem = {keyword:"abc", type:"abc", limit:"1", begin_date:"1", end_date:"1"};
var searchHistory = [];
var storedSearch = JSON.parse(localStorage.getItem("searchHistory"));
//----------------------------------------------------------------------------------- 


//Functions section
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ
modalUpdate();
function modalUpdate(){
  //check if we have search history
  if (storedSearch) {historyBtns()} else {return};
}

//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT
function historyBtns(){
  for (var i=0; i<storedSearch.length; i++){
    var count = i + 1;
    var searchItem = $('<a>').addClass('dropdown-item').attr('data-index', i).text("Search No: "+ count);
    $('#dropdownBtn').append(searchItem);
  } 
}
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT

//Click on historyBtns to auto complete input.
searchSecEl.on('click','.dropdown-item', historyWeather);
function auto(event){
  var cityBtnClicked = $(event.target);
  //get inputs from the clicked button (we need: City Name - Country Code - State Code)
  var btnClickedArray = cityBtnClicked.text().split('-')
  var name = btnClickedArray[0];
  var country = btnClickedArray[1];
  var state;
  if (country ==="US") {state = btnClickedArray[2]; cityToGeoUS(name, state, country)}
  else {cityToGeo(name, country);} 
}



//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ



var artArray = ["qqq","www","aaa","ccc","ddd"];
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ
function modalSubmit(event) {
  event.preventDefault();
  artCardsEl.children().remove();
  

  artKey = $('#art-key-input').val().trim();
  artType = $('#art-type-input').val();
  artLimit = $('#art-number-input').val();
  artBegin = $('#begin-date-input').val();
  artEnd = $('#end-date-input').val();
  saveSearch(artKey, artType, artLimit, artBegin, artEnd);
  getArticles(artKey, artType, artLimit, artBegin, artEnd);

  for(var i=0; i<artArray.length; i++){
    var count = i + 1;
    var artTitleEl = $('<h2>').addClass('artTitle').text("Article No: " + count);
    artCardsEl.append(artTitleEl);
    //article content tbc
    var artEl = $('<p>').addClass('article').text(artArray[i]);
    artCardsEl.append(artEl);
  };
  

  //save search, to be done
  searchFormEl[0].reset();
  searchModalEl.modal('hide');
}
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT

//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ
function getArticles(artKey, artType, artLimit, artBegin, artEnd) {
  //fetch function
  console.log(artKey);
  console.log(artType);
  console.log(artLimit);
  console.log(artBegin);
  console.log(artEnd);
};


//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT
function saveSearch(artKey, artType, artLimit, artBegin, artEnd){
  searchItem.keyword = artKey;
  searchItem.type = artType;
  searchItem.limit = artLimit;
  searchItem.begin_date = artBegin;
  searchItem.end_date = artEnd;
  searchHistory.push(searchItem);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT



//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ
//JQuery Datepicker, select date range function.
$( function() {
  var dateFormat = "dd/mm/yy",
    from = $("#begin-date-input")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
      }),
    to = $("#end-date-input").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
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
//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ



//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZ
//Eventlistener section
searchModalEl.on('submit', modalSubmit);
searchModalEl.on('submit', saveSearch);

















  //pseudo code:
  //button, article search
  //modal pop up, user to input:
  //1.search term. 2.article type. 3.article publish date range. 4.how many articles to show
  //submit modal, add articles to the page in cards.

//ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT
// Article Search Fetch API Function
// Example call: https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=yourkey
var begin_date;
var end_date;
var keyWord;

function artSearch() {
    var queryString;
    var targetUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=gfXdGsZ9MrEsXZPtKlAv5IB6NM2ImZQ6';
    fetch(targetUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
              console.log(data);
            //Actions with the data object
            //Render them to the page
           
          });
        } else {
            alert('Error: ' + response.statusText);
          }
        })
        .catch(function (error) {
          alert('Unable to connect to NY Times Article Search API');
      });
  };

  //artSearch();
  //ZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZTZT
  


  function test(){
    console.log('yes')
  }
  