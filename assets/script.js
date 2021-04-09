// Top Stories Vars
const newCard = $("#newCards");
const nextNews = $("#topNews")

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

    // vars
    news = topNews.results;
    console.log(topNews.results);

    // loop to gather data and create feed
    for (i = 0; i < news.length; i++) {

        if (i >= topNewsMin && i < topNewsMax) {

            tile = news[i].title;
            console.log(tile);

            newsAbstract = news[i].abstract;
            console.log(newsAbstract);

            author = news[i].byline;
            console.log(author);

            articleUrl = news[i].url;
            console.log(articleUrl);

            newsLocation = news[i].section;
            console.log(newsLocation);

            newsLocalLocation = news[i].subsection;
            console.log(newsLocalLocation);
        }
    }

    if (topNewsMin < news.length) {
        topNewsMin += 5;
        topNewsMax += 5;
        console.log(topNewsMin, topNewsMax);
    }
}

getTopStories();

nextNews.on("click", (event) => {
    event.preventDefault();
    renderTopStories(topNews);
});