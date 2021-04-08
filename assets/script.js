// Top Stories Vars
const newCard = $("#newCards");

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
            renderTopStories(data);
        });
}
// Top Stories Card Render Function

function renderTopStories(data) {

    // clear section

    // vars
    news = data.results;
    console.log(data.results);

    // loop to gather data and create feed
    for (i = 0; i < 5; i++) {

        tile = news[i].title
        console.log(tile);

        newsAbstract = news[i].abstract;
        console.log(newsAbstract);

        author = news[i].byline;
        console.log(Author);

        articleUrl = news[i].url;
        console.log(articleUrl);

        newsLocation = news[i].section;
        console.log(newsLocation);

        newsLocalLocation = news[i].subsection
        console.log(newsLocalLocation);

    }
}

getTopStories();