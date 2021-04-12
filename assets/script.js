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
    $('#tS').text('Top Stories');
    newCard.children().remove('div');
    // vars
    news = topNews.results;
    console.log(topNews.results);

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
            cardBody.append(cardBody, cardLocation, cardAbstract, cardAuthor, cardsUrlButton);
            newCardDiv.append(cardTile, cardBody);
            newCard.append(newCardDiv);
        }
    }

    if (topNewsMin < news.length) {
        topNewsMin += 5;
        topNewsMax += 5;
        console.log(topNewsMin, topNewsMax);
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